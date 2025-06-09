import { Link } from 'react-router-dom'

function Home() {
    const user = JSON.parse(localStorage.getItem('user'))

    if (!user) {
        return (
            <div style={{ padding: '2rem' }}>
                <h2>Welcome to Multi-Referral App</h2>
                <p>Please <Link to="/login">Login</Link> or <Link to="/register">Register</Link> to continue.</p>
            </div>
        )
    }

     return (
    <div className="home-container home-logged-in">
      {user.isAdmin ? (
        <>
          <h2 className="home-title">Welcome Admin</h2>
          <Link to="/admin" className="home-link">
            Go to Admin Panel 
          </Link>
        </>
      ) : (
        <>
          <h2 className="home-title">Welcome {user.name}</h2>
          <Link to="/dashboard" className="home-link">
            Go to Your Dashboard
          </Link>
        </>
      )}
    </div>
  )
}

export default Home
