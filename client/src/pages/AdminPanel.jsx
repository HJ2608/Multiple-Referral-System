import { useEffect, useState } from 'react'
import axios from 'axios'

function AdminPanel() {
  const token = localStorage.getItem('token')

  /* ───────────────────────────
     Users state  +  pagination
     ─────────────────────────── */
  const [users, setUsers] = useState([])
  const [searchName, setSearchName] = useState('')
  const [minPoints, setMinPoints] = useState('')
  const [maxPoints, setMaxPoints] = useState('')
  const [userPage, setUserPage] = useState(1)
  const USERS_PER_PAGE = 10

  /* ───────────────────────────
     Rewards  +  pagination
     ─────────────────────────── */
  const [allRewards, setAllRewards] = useState([])
  const [rewardPage, setRewardPage] = useState(1)
  const REWARDS_PER_PAGE = 10

  /* ───────────────────────────
     Misc state
     ─────────────────────────── */
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('users')
  const [adjustments, setAdjustments] = useState({})

  /* ───────────────────────────
     Fetch users
     ─────────────────────────── */
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUsers(res.data))
      .catch(err =>
        setError(err.response?.data?.error || 'Unable to fetch users')
      )
  }, [token])

  /* ───────────────────────────
     Fetch rewards (latest first)
     ─────────────────────────── */
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/admin/rewards', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res =>
        // newest → oldest
        setAllRewards(
          [...res.data].sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          )
        )
      )
  }, [token])

  /* ───────────────────────────
     Helpers for users
     ─────────────────────────── */
  const filteredUsers = users
    .filter(u => !u.isAdmin) // hide admins
    .filter(u =>
      u.name.toLowerCase().includes(searchName.toLowerCase().trim())
    )
    .filter(
      u => minPoints === '' || u.points >= parseInt(minPoints || 0, 10)
    )
    .filter(
      u => maxPoints === '' || u.points <= parseInt(maxPoints || 0, 10)
    )

  const totalUserPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE)
  const userSliceStart = (userPage - 1) * USERS_PER_PAGE
  const paginatedUsers = filteredUsers.slice(
    userSliceStart,
    userSliceStart + USERS_PER_PAGE
  )

  /* ───────────────────────────
     Helpers for rewards
     ─────────────────────────── */
  const totalRewardPages = Math.ceil(allRewards.length / REWARDS_PER_PAGE)
  const rewardSliceStart = (rewardPage - 1) * REWARDS_PER_PAGE
  const paginatedRewards = allRewards.slice(
    rewardSliceStart,
    rewardSliceStart + REWARDS_PER_PAGE
  )

  /* ───────────────────────────
     Toggle & adjust points
     ─────────────────────────── */
  const handleToggleActive = async (userId, current) => {
    const action = current ? 'deactivate' : 'activate'
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return
    console.log("User Id:",userId)
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/toggle-status/${userId}`,
        { isActive: !current },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUsers(prev =>
        prev.map(u => (u._id === userId ? { ...u, isActive: !current } : u))
      )
    } catch (err) {
      alert(`Error trying to ${action} user`)
    }
  }

  const handleAdjustPoints = async userId => {
  const raw = adjustments[userId]
  const value = parseInt(raw, 10)

  if (isNaN(value) || value == 0) {
    return alert('Please enter a valid non-zero point value')
  }

  const user = users.find(u => u._id === userId)
  if (!user) return

  const newPoints = user.points + value

  if (newPoints < 0) {
    return alert('Negative values not possible: total points cannot be less than 0')
  }

  try {
    await axios.patch(
      `http://localhost:5000/api/admin/points/${userId}`,
      { points: value },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    setUsers(prev =>
      prev.map(u =>
        u._id === userId ? { ...u, points: newPoints } : u
      )
    )
    setAdjustments(a => ({ ...a, [userId]: '' }))
    alert('Points updated successfully! ✅')
  } catch {
    alert('Error updating points')
  }
}


  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>

  /* ───────────────────────────
     Render
     ─────────────────────────── */
  return (
    <div className="admin-panel">
      <h2 className="title">Admin Panel</h2>

      {/* tab buttons */}
      <div className="tab-buttons">
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Manage Users
        </button>
        <button
          className={`tab-btn ${activeTab === 'rewards' ? 'active' : ''}`}
          onClick={() => setActiveTab('rewards')}
        >
          View Rewards
        </button>
      </div>

      {/* ========== USERS TAB ========== */}
      {activeTab === 'users' && (
        <>
          {/* filters */}
          <div className="filters">
            <input
              className="input-filter"
              placeholder="Search name"
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
            />
            <input
              className="input-filter"
              type="number"
              placeholder="Min points"
              value={minPoints}
              onChange={e => setMinPoints(e.target.value)}
            />
            <input
              className="input-filter"
              type="number"
              placeholder="Max points"
              value={maxPoints}
              onChange={e => setMaxPoints(e.target.value)}
            />
          </div>

          {/* table */}
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Points</th>
                <th>Referral Code</th>
                <th>Referred By</th>
                <th>Status</th>
                <th>Change Status</th>
                <th>Adjust Points</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.points}</td>
                  <td>{u.referralCode}</td>
                  <td>{u.referredBy || '—'}</td>
                  <td>{u.isActive ? 'Active' : 'Inactive'}</td>
                  <td>
                    <button
                      className="btn-toggle"
                      onClick={() => handleToggleActive(u._id, u.isActive)}
                    >
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                  <td>
                    <input
                      className="input-points"
                      type="number"
                      placeholder="±pts"
                      value={adjustments[u._id] || ''}
                      onChange={e =>
                        setAdjustments(a => ({ ...a, [u._id]: e.target.value }))
                      }
                    />
                    <button
  className="btn-apply"
  onClick={() => handleAdjustPoints(u._id)}
  disabled={parseInt(adjustments[u._id], 10) === 0}
>
  Apply
</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* user pagination */}
          {totalUserPages > 1 && (
            <Pagination
              totalPages={totalUserPages}
              current={userPage}
              onPage={p => setUserPage(p)}
            />
          )}
        </>
      )}

      {/* ========== REWARDS TAB ========== */}
      {activeTab === 'rewards' && (
        <>
          <h3 className="sub-title">All Reward Logs</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Receiver</th>
                <th>From</th>
                <th>Points</th>
                <th>Level</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRewards.map(r => (
                <tr key={r._id}>
                  <td>{r.userId?.name}</td>
                  <td>{r.fromUserId?.name}</td>
                  <td>{r.points}</td>
                  <td>{r.level}</td>
                  <td>{new Date(r.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* reward pagination */}
          {totalRewardPages > 1 && (
            <Pagination
              totalPages={totalRewardPages}
              current={rewardPage}
              onPage={p => setRewardPage(p)}
            />
          )}
        </>
      )}
    </div>
  )
}

/* ───────────────────────────
   Tiny pagination component
   ─────────────────────────── */
function Pagination({ totalPages, current, onPage }) {
  if (totalPages <= 1) return null
  const numbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="tab-buttons" style={{ justifyContent: 'center' }}>
      <button
        className="tab-btn"
        disabled={current === 1}
        style={{ opacity: current === 1 ? 0.4 : 1 }}
        onClick={() => onPage(current - 1)}
      >
        ← Prev
      </button>

      {numbers.map(n => (
        <button
          key={n}
          className={`tab-btn ${n === current ? 'active' : ''}`}
          onClick={() => onPage(n)}
        >
          {n}
        </button>
      ))}

      <button
        className="tab-btn"
        disabled={current === totalPages}
        style={{ opacity: current === totalPages ? 0.4 : 1 }}
        onClick={() => onPage(current + 1)}
      >
        Next →
      </button>
    </div>
  )
}

export default AdminPanel
