import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Perks from './pages/Perks.jsx'
import AllPerks from './pages/AllPerks.jsx'
import PerkForm from './pages/PerkForm.jsx'
import PerkDetails from './pages/PerkDetails.jsx'
import { useAuth } from './hooks/useAuth.js'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  const { user, logout } = useAuth()
  return (
    <div className="container">
      <nav className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="font-semibold">Campus Life & Perks</Link>
          {user && <Link to="/perks" className="text-sm">My Perks</Link> }
          {user && <Link to="/all-perks" className="text-sm">All Perks</Link>}
          {user && <Link to="/perks/new" className="text-sm">Create Perk</Link>}
        </div>
        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn">Register</Link>
            </>
          ) : (
            <>
              <span className="text-sm">Logged in as <b>{user.name}</b></span>
              <button onClick={logout}  className="btn">Logout</button>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/perks" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/perks" element={<Perks />} />
        <Route path="/all-perks" element={<AllPerks />} />
        <Route path="/perks/new" element={
          <ProtectedRoute><PerkForm /></ProtectedRoute>
        } />
        <Route path="/perks/:id/view" element={
          <ProtectedRoute><PerkDetails /></ProtectedRoute>
        } />
        <Route path="/perks/:id" element={
          <ProtectedRoute><PerkForm /></ProtectedRoute>
        } />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </div>
  )
}
