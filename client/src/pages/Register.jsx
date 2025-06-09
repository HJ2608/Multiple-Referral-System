import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';



function Register() {
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    referralCode: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {


      const res = await axios.post('http://localhost:5000/api/auth/register', formData)
      alert('Registered successfully! You can now log in.')

      setMessage('Registered successfully! You can now log in.')
      navigate('/login')
    } catch (err) {
      setMessage(err.response?.data?.error || 'Registration failed')
    }
  }

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (!ref) return;

    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      alert('Referral link detected — you’ve been logged out for security.');

      // replace the history entry, but we still stay on /register?ref=...
      navigate(`/register?ref=${ref}`, { replace: true });
    }
  }, [searchParams, navigate]);

  // ➋ Always prefill from ?ref on the very first render
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setFormData(prev => ({ ...prev, referralCode: ref }));
    }
  }, []);



  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
          className="register-input"
        />
        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          required
          className="register-input"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="register-input"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="register-input"
        />
        <input
          name="referralCode"
          placeholder="Referral Code (optional)"
          value={formData.referralCode}
          onChange={handleChange}
          className="register-input"
        />
        <button type="submit" className="register-button">
          Register
        </button>
      </form>
      <p className="register-login-text">
        Already have an account?{' '}
        <a href="/login" className="register-login-link">
          Login
        </a>
      </p>
      {message && <p className="register-message">{message}</p>}
    </div>
  )
}

export default Register
