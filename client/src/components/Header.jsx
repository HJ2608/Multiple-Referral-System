import { NavLink, useNavigate } from 'react-router-dom'

function Header() {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="container header__inner">
        <h2 style={{ margin: 0 , fontWeight:700 }}><NavLink to="/">Multi-Referral System</NavLink></h2>
      <nav className="nav">
        <NavLink to="/" className={({isActive})=> isActive ? 'nav__link active':'nav__link'}>Home</NavLink>
        {user?.isAdmin && <NavLink to="/admin" className={({isActive})=> isActive ? 'nav__link active':'nav__link'}>Admin Panel</NavLink>}
        {!user?.isAdmin && token && <NavLink to="/dashboard" className={({isActive})=> isActive ? 'nav__link active':'nav__link'}>Dashboard</NavLink>}

        {token ? (
          <button
            onClick={handleLogout}
            className="btn btn--primary" style={{marginLeft:'1.5rem'}}>
            Logout
          </button>
        ) : (
          <NavLink to="/login" className={({isActive})=> isActive ? 'nav__link active':'nav__link'}>Login</NavLink>
        )}
      </nav>
      </div>
    </header>
  )
}

export default Header
