import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../api'

// Category color schemes with gradient backgrounds and accent colors
const categoryThemes = {
  food: {
    gradient: 'from-orange-50 to-red-50',
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-800',
    icon: 'restaurant',
    iconColor: 'text-orange-500',
    accentText: 'text-orange-600'
  },
  tech: {
    gradient: 'from-blue-50 to-indigo-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800',
    icon: 'computer',
    iconColor: 'text-blue-500',
    accentText: 'text-blue-600'
  },
  travel: {
    gradient: 'from-purple-50 to-pink-50',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-800',
    icon: 'flight',
    iconColor: 'text-purple-500',
    accentText: 'text-purple-600'
  },
  fitness: {
    gradient: 'from-green-50 to-emerald-50',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-800',
    icon: 'fitness_center',
    iconColor: 'text-green-500',
    accentText: 'text-green-600'
  },
  other: {
    gradient: 'from-gray-50 to-slate-50',
    border: 'border-gray-200',
    badge: 'bg-gray-100 text-gray-800',
    icon: 'card_giftcard',
    iconColor: 'text-gray-500',
    accentText: 'text-gray-600'
  }
}

export default function PerkDetails() {
  const nav = useNavigate()
  const { id } = useParams()
  const [perk, setPerk] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.get('/perks/' + id)
      .then(res => {
        setPerk(res.data.perk)
        setLoading(false)
      })
      .catch(err => {
        setError(err?.response?.data?.message || 'Failed to load perk')
        setLoading(false)
      })
  }, [id])

 // TODO 2: Implement delete functionality with a window confirm dialog 
  async function handleDelete() {
   
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-12 text-zinc-600">Loading...</div>
      </div>
    )
  }

  if (error || !perk) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error || 'Perk not found'}</p>
          <Link to="/perks" className="btn">Back to Perks</Link>
        </div>
      </div>
    )
  }

  const theme = categoryThemes[perk.category] || categoryThemes.other

  return (
    //TODO 3: Implement delete perk handler
    <div className="max-w-3xl mx-auto">
      {/* Back button */}
      <div className="mb-4">
        <Link to="/perks" className="text-sm text-zinc-600 hover:text-zinc-900">
          ← Back to all perks
        </Link>
      </div>

      {/* Main card with gradient background */}
      <div className={`card bg-gradient-to-br ${theme.gradient} ${theme.border} border-2`}>
        
        {/* Category icon */}
        <div className="flex justify-center mb-4">
          <span className={`material-symbols-outlined ${theme.iconColor}`} style={{ fontSize: '80px', fontWeight: '300' }}>
            {theme.icon}
          </span>
        </div>

        {/* Title - large, centered, bold */}
        <h1 className="text-4xl md:text-5xl font-bold text-center text-zinc-900 mb-6">
          {perk.title}
        </h1>

        {/* Category badge */}
        <div className="flex justify-center mb-6">
          <span className={`${theme.badge} px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide`}>
            {perk.category}
          </span>
        </div>

        {/* Discount badge - prominent if available */}
        {perk.discountPercent > 0 && (
          <div className="flex justify-center mb-8">
            <div className={`${theme.accentText} bg-white border-2 ${theme.border} rounded-2xl px-8 py-4 shadow-lg`}>
              <div className="text-5xl font-bold text-center">
                {perk.discountPercent}%
              </div>
              <div className="text-sm font-semibold text-center uppercase tracking-wide mt-1">
                Discount
              </div>
            </div>
          </div>
        )}

        {/* Details section */}
        <div className="space-y-4 mb-8">
          
          {/* Merchant */}
          {perk.merchant && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-zinc-200">
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">
                Merchant
              </div>
              <div className={`text-xl font-semibold ${theme.accentText}`}>
                {perk.merchant}
              </div>
            </div>
          )}

          {/* Description */}
          {perk.description && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-zinc-200">
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                Description
              </div>
              <div className="text-zinc-700 leading-relaxed">
                {perk.description}
              </div>
            </div>
          )}

          {/* Created date */}
          {perk.createdAt && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-zinc-200">
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">
                Created
              </div>
              <div className="text-sm text-zinc-700">
                {new Date(perk.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 justify-center flex-wrap">
          <Link 
            to={`/perks/${id}`} 
            className={`btn bg-white ${theme.border} border-2 ${theme.accentText} hover:bg-opacity-90 font-semibold px-6 py-3 flex items-center gap-2`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
            Edit Perk
          </Link>
          <button
            
            className="btn bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 font-semibold px-6 py-3 flex items-center gap-2"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
            Delete Perk
          </button>
        </div>
      </div>
    </div>
  )
}
