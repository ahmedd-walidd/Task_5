/**
 * AllPerks Component
 * 
 * This component displays all perks from the database (not filtered by user).
 * It includes:
 * - Search functionality by perk name/title
 * - Filter functionality by merchant name
 * - Clickable perk cards that navigate to detail view
 * 
 * This component demonstrates extensive use of React Hooks for state management
 * and side effects.
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

export default function AllPerks() {
  
  // ==================== STATE MANAGEMENT WITH useState HOOK ====================
  
  /**
   * useState Hook #1: perks
   * 
   * Purpose: Stores the array of all perks fetched from the database
   * Initial value: Empty array []
   * 
   * useState returns a tuple [stateValue, setterFunction]
   * - perks: Current state value (array of perk objects)
   * - setPerks: Function to update the state
   * 
   * When setPerks is called, React will:
   * 1. Update the state value
   * 2. Re-render the component with the new value
   * 3. Preserve the state between renders
   */
  const [perks, setPerks] = useState([])

  /**
   * useState Hook #2: searchQuery
   * 
   * Purpose: Stores the current search input value for filtering by perk title
   * Initial value: Empty string ''
   * 
   * This state is controlled by the search input field and updates on every keystroke.
   * It's used to filter perks by name when the user types in the search box.
   */
  const [searchQuery, setSearchQuery] = useState('')

  /**
   * useState Hook #3: merchantFilter
   * 
   * Purpose: Stores the selected merchant name for filtering perks
   * Initial value: Empty string '' (meaning "all merchants")
   * 
   * This state is controlled by a dropdown/select element and updates when
   * the user selects a different merchant from the list.
   */
  const [merchantFilter, setMerchantFilter] = useState('')

  /**
   * useState Hook #4: uniqueMerchants
   * 
   * Purpose: Stores a list of unique merchant names from all perks
   * Initial value: Empty array []
   * 
   * This is derived from the perks data and used to populate the merchant
   * filter dropdown with available options.
   */
  const [uniqueMerchants, setUniqueMerchants] = useState([])

  /**
   * useState Hook #5: loading
   * 
   * Purpose: Tracks whether data is currently being fetched from the API
   * Initial value: true (starts as loading)
   * 
   * Used to show a loading indicator while waiting for the API response.
   * When true: Display "Loading..." message
   * When false: Display the perks list or empty state
   */
  const [loading, setLoading] = useState(true)

  /**
   * useState Hook #6: error
   * 
   * Purpose: Stores any error message from failed API requests
   * Initial value: Empty string '' (no error)
   * 
   * If an API request fails, the error message is stored here and displayed
   * to the user. When empty, no error message is shown.
   */
  const [error, setError] = useState('')

  // ==================== SIDE EFFECTS WITH useEffect HOOK ====================

  /**
   * useEffect Hook #1: Initial Data Loading
   * 
   * Purpose: Fetch all perks when the component first mounts
   * Dependencies: [] (empty array)
   * 
   * How useEffect works:
   * - First argument: A function containing side effect code
   * - Second argument: Dependency array
   * 
   * With an empty dependency array [], this effect runs:
   * - Once when the component mounts (appears on screen)
   * - Never again (no dependencies to trigger re-runs)
   * 
   * This is perfect for initial data loading that should happen once.
   */
  useEffect(() => {
    // Call the load function to fetch perks from API
    loadAllPerks()
    
    // Note: We don't need a cleanup function here since we're just fetching data
    // Cleanup functions are returned from useEffect and run when:
    // - The component unmounts
    // - Before the effect runs again (if dependencies change)
  }, []) // Empty dependency array = run once on mount

  /**
   * useEffect Hook #2: Auto-search on Input Change
   * 
   * Purpose: Automatically fetch perks whenever search or filter values change
   * Dependencies: [searchQuery, merchantFilter]
   * 
   * This effect runs:
   * - On initial mount (with empty search and filter)
   * - Whenever searchQuery changes (user types in search box)
   * - Whenever merchantFilter changes (user selects different merchant)
   * 
   * Why this approach?
   * - Real-time search: Results update as you type
   * - Better UX: Smooth, responsive search while typing
   * - Debouncing: We add a small delay to avoid excessive API calls
   * 
   * The cleanup function:
   * - Returns a function that clears the timeout
   * - Runs before the effect runs again or on unmount
   * - Prevents multiple simultaneous API calls (debouncing)
   */
  useEffect(() => {
    // Debounce: Wait 500ms after user stops typing before searching
    // This is short enough to feel smooth but long enough to reduce API calls
    // The search happens WHILE the cursor is still blinking/typing
    const timeoutId = setTimeout(() => {
      loadAllPerks()
    }, 500) // 500ms delay - feels smooth and responsive
    
    // Cleanup function: Clear the timeout if effect runs again
    // This happens when searchQuery or merchantFilter changes again
    // before the 500ms delay is up
    return () => {
      clearTimeout(timeoutId)
    }
    
    // Dependencies: re-run when search or filter changes
    // Note: We intentionally omit loadAllPerks from dependencies to avoid
    // recreating the effect on every render
  }, [searchQuery, merchantFilter])

  /**
   * useEffect Hook #3: Extract Unique Merchants
   * 
   * Purpose: Update the list of unique merchants whenever perks data changes
   * Dependencies: [perks]
   * 
   * This effect runs:
   * - On initial mount (after perks is first set)
   * - Whenever the perks array changes (new data fetched, filters applied, etc.)
   * 
   * Why separate effect?
   * - Separates concerns: data fetching vs. data processing
   * - Keeps merchant list in sync with perks data
   * - Demonstrates how useEffect can respond to state changes
   */
  useEffect(() => {
    // Extract all merchant names from perks array
    const merchants = perks
      .map(perk => perk.merchant) // Get merchant from each perk
      .filter(merchant => merchant && merchant.trim()) // Remove empty/null values
    
    // Create array of unique merchants using Set
    // Set automatically removes duplicates, then we convert back to array
    const unique = [...new Set(merchants)]
    
    // Update state with unique merchants
    setUniqueMerchants(unique)
    
    // This effect depends on [perks], so it re-runs whenever perks changes
  }, [perks]) // Dependency: re-run when perks array changes

  // ==================== ASYNC FUNCTION: API DATA FETCHING ====================

  /**
   * loadAllPerks Function
   * 
   * Purpose: Fetch all perks from the API with optional search and filter parameters
   * 
   * This is an async function because:
   * - API calls are asynchronous (they take time)
   * - We use await to wait for the response
   * - Error handling with try/catch for network failures
   * 
   * Query Parameters:
   * - search: Filter perks by title (case-insensitive partial match)
   * - merchant: Filter perks by exact merchant name
   * 
   * State Updates:
   * - Sets loading to true before fetch
   * - Sets perks with fetched data on success
   * - Sets error message on failure
   * - Sets loading to false when done (success or failure)
   */
  async function loadAllPerks() {
    // Reset error state before new request
    setError('')
    
    // Show loading indicator
    setLoading(true)
    
    try {
      // Make GET request to /api/perks/all with query parameters
      const res = await api.get('/perks/all', {
        params: {
          // Only include search param if searchQuery is not empty
          search: searchQuery.trim() || undefined,
          // Only include merchant param if merchantFilter is not empty
          merchant: merchantFilter.trim() || undefined
        }
      })
      
      // Update perks state with response data
      setPerks(res.data.perks)
      
    } catch (err) {
      // Handle errors (network failure, server error, etc.)
      console.error('Failed to load perks:', err)
      setError(err?.response?.data?.message || 'Failed to load perks')
      
    } finally {
      // This block runs whether try succeeds or catch handles error
      // Always stop loading indicator
      setLoading(false)
    }
  }

  // ==================== EVENT HANDLERS ====================

  /**
   * handleSearch Function
   * 
   * Purpose: Manually trigger search when user clicks the "Search" button
   * 
   * Why keep this when we have auto-search?
   * - Provides explicit control for users who prefer it
   * - Immediate search without waiting for debounce delay
   * - Accessibility: Not all users want auto-search
   * - Fallback: If auto-search isn't working, manual search still works
   */
  function handleSearch(e) {
    // Prevent default form submission behavior (page reload)
    e.preventDefault()
    
    // Immediately reload perks with current search and filter values
    // This bypasses the debounce delay for instant results
    loadAllPerks()
  }

  /**
   * handleReset Function
   * 
   * Purpose: Clear all filters and reload all perks
   * 
   * This demonstrates state reset - setting multiple state values
   * back to their initial values. The useEffect hook will automatically
   * trigger a new search when these values change.
   */
  function handleReset() {
    // Reset search and filter states to empty
    // The useEffect with [searchQuery, merchantFilter] dependencies
    // will automatically trigger and reload all perks
    setSearchQuery('')
    setMerchantFilter('')
  }

  // ==================== CONDITIONAL RENDERING ====================

  /**
   * Note: We DON'T use early returns for loading/error states
   * 
   * Why?
   * - Early returns would unmount the search form
   * - User would lose focus on the input field
   * - Typing experience would be interrupted
   * 
   * Instead:
   * - We always render the full UI (form + results)
   * - Show inline loading indicator next to buttons
   * - Show error messages above the results
   * - This keeps the form interactive during searches
   */

  // ==================== MAIN RENDER ====================

  /**
   * JSX Return Statement
   * 
   * This is what gets rendered to the screen.
   * 
   * Key React Concepts:
   * 1. Controlled Components: Input values tied to state (value prop)
   * 2. Event Handlers: onChange, onSubmit, onClick
   * 3. Conditional Rendering: && operator for conditional display
   * 4. List Rendering: map() to create elements from arrays
   * 5. Keys: unique key prop for list items (React optimization)
   */
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">All Perks</h1>
        <div className="text-sm text-zinc-600">
          Showing {perks.length} perk{perks.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Search and Filter Form */}
      <div className="card">
        <form onSubmit={handleSearch} className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Search Input - Controlled Component */}
            {/* 
              Controlled Component Pattern:
              - value prop: Ties input to state (single source of truth)
              - onChange prop: Updates state when user types
              - Input value always reflects state value
              - State controls the input (not DOM)
              
              Auto-search on every keystroke:
              - useEffect with [searchQuery] dependency triggers search
              - Debounced by 500ms for smooth, responsive feel
              - Search happens while user is still typing
              - Also has manual Search button for immediate results
            */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                <span className="material-symbols-outlined text-sm align-middle">search</span>
                {' '}Search by Name
              </label>
              <input
                type="text"
                className="input"
                placeholder="Enter perk name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                /* 
                  onChange breakdown:
                  - e: Event object from input change
                  - e.target: The input element itself
                  - e.target.value: Current value of input
                  - setSearchQuery: Updates state with new value
                  
                  Flow: User types → onChange fires → state updates → 
                        useEffect detects change → waits 500ms → calls API
                        OR user clicks Search button → immediate API call
                */
              />
              <p className="text-xs text-zinc-500 mt-1">
                Auto-searches as you type, or press Enter / click Search
              </p>
            </div>

            {/* Merchant Filter Dropdown - Controlled Component */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                <span className="material-symbols-outlined text-sm align-middle">store</span>
                {' '}Filter by Merchant
              </label>
              <select
                className="input"
                value={merchantFilter}
                onChange={(e) => setMerchantFilter(e.target.value)}
                /* 
                  Same controlled component pattern as input above
                  When merchant changes, useEffect automatically triggers search
                */
              >
                <option value="">All Merchants</option>
                {/* 
                  List Rendering with map():
                  - Takes uniqueMerchants array
                  - Returns array of <option> elements
                  - Each needs unique key prop for React's reconciliation
                  - Key helps React identify which items changed
                */}
                {uniqueMerchants.map(merchant => (
                  <option key={merchant} value={merchant}>
                    {merchant}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 items-center">
            <button type="submit" className="btn bg-blue-600 text-white border-blue-600 hover:bg-blue-700">
              <span className="material-symbols-outlined text-sm align-middle">search</span>
              {' '}Search Now
            </button>
            <button 
              type="button" 
              onClick={handleReset}
              className="btn"
            >
              <span className="material-symbols-outlined text-sm align-middle">refresh</span>
              {' '}Reset Filters
            </button>
            
            {/* Loading indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                Searching...
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Error Message - Inline, doesn't replace the UI */}
      {error && (
        <div className="card border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-600">
              <span className="material-symbols-outlined">error</span>
              <p>{error}</p>
            </div>
            <button onClick={loadAllPerks} className="btn text-sm">
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Perks Grid - Always visible, updates in place */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* 
          Conditional Rendering with map():
          - If perks.length > 0: Show perk cards
          - If perks.length === 0: Show empty state (after the map)
        */}
        {perks.map(perk => (
          /* 
            Link Component:
            - From react-router-dom
            - Client-side navigation (no page reload)
            - to prop: destination route
            - Wrapped around card to make entire card clickable
            
            Key Prop:
            - Required for list items in React
            - Should be unique and stable (perk._id is perfect)
            - Helps React efficiently update the DOM
            - Don't use array index as key if list can change
          */
          <Link
            key={perk._id}
            to={`/perks/${perk._id}/view`}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
          >
            {/* Perk Title */}
            <div className="font-semibold text-lg text-zinc-900 mb-2">
              {perk.title}
            </div>

            {/* Perk Metadata */}
            <div className="text-sm text-zinc-600 space-y-1">
              {/* Conditional Rendering with && operator */}
              {/* Only show merchant if it exists */}
              {perk.merchant && (
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">store</span>
                  {perk.merchant}
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">category</span>
                <span className="capitalize">{perk.category}</span>
              </div>
              
              {perk.discountPercent > 0 && (
                <div className="flex items-center gap-1 text-green-600 font-semibold">
                  <span className="material-symbols-outlined text-xs">local_offer</span>
                  {perk.discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Description - truncated if too long */}
            {perk.description && (
              <p className="mt-2 text-sm text-zinc-700 line-clamp-2">
                {perk.description}
              </p>
            )}

            {/* Creator info - populated from backend */}
            {perk.createdBy && (
              <div className="mt-3 pt-3 border-t border-zinc-200 text-xs text-zinc-500">
                Created by: {perk.createdBy.name || perk.createdBy.email}
              </div>
            )}
          </Link>
        ))}

        {/* 
          Empty State:
          - Conditional rendering with && operator
          - Only shows when perks array is empty AND not loading
          - Provides helpful message to user
        */}
        {perks.length === 0 && !loading && (
          <div className="col-span-full text-center py-12 text-zinc-600">
            <span className="material-symbols-outlined text-5xl mb-4 block text-zinc-400">
              sentiment_dissatisfied
            </span>
            <p className="text-lg">No perks found.</p>
            <p className="text-sm mt-2">Try adjusting your search or filters.</p>
          </div>
        )}

        {/* 
          Loading State During Search:
          - Shows when loading AND we have no results yet (initial load)
          - Doesn't interrupt the user's typing
          - Appears in the results area, not replacing the form
        */}
        {loading && perks.length === 0 && (
          <div className="col-span-full text-center py-12 text-zinc-600">
            <span className="material-symbols-outlined text-5xl mb-4 block text-zinc-400 animate-spin">
              progress_activity
            </span>
            <p className="text-lg">Loading perks...</p>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * ==================== REACT HOOKS SUMMARY ====================
 * 
 * This component demonstrates the following React Hooks:
 * 
 * 1. useState (6 instances):
 *    - Managing component state
 *    - State persists between renders
 *    - Triggers re-render when updated
 *    - Used for: perks, searchQuery, merchantFilter, uniqueMerchants, loading, error
 * 
 * 2. useEffect (3 instances):
 *    - Running side effects (API calls, data processing)
 *    - First: Loads data on component mount
 *    - Second: Auto-search when search/filter changes (with debouncing)
 *    - Third: Derives unique merchants from perks data
 *    - Dependencies control when effects run
 *    - Cleanup functions prevent memory leaks and excessive API calls
 * 
 * KEY CONCEPTS DEMONSTRATED:
 * 
 * - Controlled Components: Form inputs tied to state
 * - Auto-search: Search triggered on every keystroke
 * - Debouncing: 300ms delay to prevent excessive API calls
 * - Cleanup Functions: Clear timeouts to prevent memory leaks
 * - Async/Await: Handling asynchronous API calls
 * - Error Handling: Try/catch with user feedback
 * - Loading States: Better UX during data fetching
 * - Conditional Rendering: Show different UI based on state
 * - List Rendering: map() to create elements from arrays
 * - Event Handlers: Responding to user interactions
 * - Derived State: Computing values from existing state
 * - Client-side Routing: Navigation with react-router-dom
 * 
 * BEST PRACTICES:
 * 
 * - Single Responsibility: Each state variable has one purpose
 * - Separation of Concerns: Data fetching separate from rendering
 * - User Feedback: Loading and error states, helpful messages
 * - Accessibility: Semantic HTML, labels for inputs
 * - Performance: Keys for list items, debouncing, cleanup functions
 * - Real-time Updates: Search as you type for better UX
 */
