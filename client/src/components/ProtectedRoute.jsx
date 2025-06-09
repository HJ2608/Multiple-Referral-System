import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children, adminOnly = false }) {
  const user = JSON.parse(localStorage.getItem('user'))

  if (!user) return <Navigate to="/login" />

  if (adminOnly && !user.isAdmin) return <Navigate to="/login" />

  return children
}

export default ProtectedRoute
