// ======= src/pages/Dashboard.jsx =======
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Dashboard() {
  const token = localStorage.getItem('token')

  /* ───────────────────────────
     Core state
  ─────────────────────────── */
  const [user, setUser] = useState(null)
  const [referrals, setReferrals] = useState([])
  const [rewards, setRewards] = useState([])
  const [activeTab, setActiveTab] = useState('overview') // overview | referrals | rewards

  /* pagination state */
  const REF_PAGE_SIZE = 5
  const REW_PAGE_SIZE = 5
  const [refPage, setRefPage] = useState(1)
  const [rewPage, setRewPage] = useState(1)

  /* ───────────────────────────
     Fetch data on mount
  ─────────────────────────── */
  useEffect(() => {
    if (!token) {
      window.location.href = '/login'
      return
    }

    const auth = { headers: { Authorization: `Bearer ${token}` } }

    Promise.all([
      axios.get('http://localhost:5000/api/user/me', auth),
      axios.get('http://localhost:5000/api/user/downlines', auth),
      axios.get('http://localhost:5000/api/user/rewards', auth)
    ])
      .then(([meRes, downlineRes, rewardRes]) => {
        setUser(meRes.data)
        setReferrals(downlineRes.data)
        // newest first
        setRewards(
          [...rewardRes.data].sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          )
        )
      })
      .catch(err => {
        console.error(err)
        localStorage.clear()
        window.location.href = '/login'
      })
  }, [token])

  if (!user)
    return <p className="loading" style={{ textAlign: 'center' }}>Loading...</p>

  /* ───────────────────────────
     Pagination helpers
  ─────────────────────────── */
  const refTotal = Math.ceil(referrals.length / REF_PAGE_SIZE) || 1
  const refStart = (refPage - 1) * REF_PAGE_SIZE
  const paginatedRefs = referrals.slice(refStart, refStart + REF_PAGE_SIZE)

  const rewTotal = Math.ceil(rewards.length / REW_PAGE_SIZE) || 1
  const rewStart = (rewPage - 1) * REW_PAGE_SIZE
  const paginatedRews = rewards.slice(rewStart, rewStart + REW_PAGE_SIZE)

  /* ───────────────────────────
     Render helpers
  ─────────────────────────── */
  const referralLink = `${window.location.origin}/register?ref=${user.referralCode}`

  return (
    <div className="dashboard">
      {/* tab controls */}
      <div className="tab-buttons" style={{ marginBottom: '1rem' }}>
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'referrals' ? 'active' : ''}`}
          onClick={() => setActiveTab('referrals')}
        >
          My Referrals
        </button>
        <button
          className={`tab-btn ${activeTab === 'rewards' ? 'active' : ''}`}
          onClick={() => setActiveTab('rewards')}
        >
          Reward History
        </button>
      </div>

      {/* ========== OVERVIEW ========== */}
      {activeTab === 'overview' && (
        <>
          <h2 className="dashboard-title">Welcome, {user.name}</h2>
          <div className="user-info">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Referral Code:</strong> {user.referralCode}</p>
            <p><strong>Points:</strong> {user.points}</p>
          </div>
          <button
            className="btn-copy-link"
            onClick={() => {
              navigator.clipboard.writeText(referralLink)
              alert('Referral link copied!')
            }}
          >
            Copy My Referral Link
          </button>
        </>
      )}

      {/* ========== REFERRALS TAB ========== */}
      {activeTab === 'referrals' && (
        <>
          <h3 className="section-title">My Referrals</h3>
          {referrals.length === 0 ? (
            <p className="empty-message">No referrals yet.</p>
          ) : (
            <ul className="referral-list">
              {paginatedRefs.map(r => (
                <li key={r._id} className="referral-item">
                  {r.name} <span className="referral-email">({r.email})</span>
                </li>
              ))}
            </ul>
          )}
          <Pagination
            totalPages={refTotal}
            current={refPage}
            onPage={setRefPage}
          />
        </>
      )}

      {/* ========== REWARD HISTORY TAB ========== */}
      {activeTab === 'rewards' && (
        <>
          <h3 className="section-title">Reward History</h3>
          {rewards.length === 0 ? (
            <p className="empty-message">No reward history.</p>
          ) : (
            <ul className="reward-list">
              {paginatedRews.map(r => (
                <li key={r._id} className="reward-item">
                  <span className="reward-points">+{r.points} pts</span> from {r.fromUserId?.name || 'Self'} (level {r.level}) &middot;{' '}
                  {new Date(r.timestamp).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
          <Pagination
            totalPages={rewTotal}
            current={rewPage}
            onPage={setRewPage}
          />
        </>
      )}
    </div>
  )
}

/* ───────────────────────────
   Simple pagination buttons
─────────────────────────── */
function Pagination({ totalPages, current, onPage }) {
  if (totalPages <= 1) return null

  return (
    <div className="tab-buttons" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
      <button
        className="tab-btn"
        disabled={current === 1}
        style={{ opacity: current === 1 ? 0.4 : 1 }}
        onClick={() => onPage(current - 1)}
      >
        ← Prev
      </button>

      <span style={{ padding: '0.5rem 1rem', fontWeight: 600 }}>
        Page {current} / {totalPages}
      </span>

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
