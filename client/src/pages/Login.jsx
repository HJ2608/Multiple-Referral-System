import { useState } from 'react'
import axios from 'axios'
import { data, useNavigate } from 'react-router-dom'
function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            
            
            const res = await axios.post('http://localhost:5000/api/auth/login', formData)
            if (!res.data.user.isActive) {
                alert('This account has been deactivated.');
                return; // Stop further execution
            }
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('user', JSON.stringify(res.data.user))
            setMessage('Login successful')
            navigate('/')

        } catch (err) {
            console.error('Login error \n', err.response || err)
            setMessage(err.response?.data?.error || 'Login failed')
        }
    }

    return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="login-input"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="login-input"
        />
        <button type="submit" className="login-button" onClick={handleSubmit}>
          Login
        </button>
      </form>
      <p className="login-register-text">
        Don't have an account?{' '}
        <a href="/register" className="login-register-link">
          Register
        </a>
      </p>
      {message && <p className="login-message">{message}</p>}
    </div>
  )
}

export default Login
