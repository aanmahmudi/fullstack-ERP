import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { UserDto } from '../lib/api'
import { me } from '../lib/api'
import { clearAuthToken } from '../lib/authToken'

export function HomePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserDto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    me()
      .then((u) => setUser(u))
      .finally(() => setLoading(false))
  }, [])

  function logout() {
    clearAuthToken()
    navigate('/login', { replace: true })
  }

  return (
    <div className="page">
      <div className="card" style={{ width: '100%', maxWidth: 920 }}>
        <div className="topBar">
          <div>
            <h2 className="cardTitle">Dashboard</h2>
            <p className="cardSubtitle">Login berhasil. Token tersimpan di browser.</p>
          </div>
          <button className="button buttonSecondary" onClick={logout} style={{ width: 160 }}>
            Logout
          </button>
        </div>

        {loading ? (
          <div className="alert">Memuat profil…</div>
        ) : user ? (
          <div className="alert">
            <div style={{ display: 'grid', gap: 6 }}>
              <div>
                Halo, <b>{user.firstName}</b> ({user.username})
              </div>
              <div>Email: {user.email}</div>
              <div>No HP: {user.phoneNumber}</div>
              <div className="hint">Endpoint: GET /api/auth/me</div>
            </div>
          </div>
        ) : (
          <div className="alert alertError">Gagal memuat profil.</div>
        )}

        <div className="alert">
          <div style={{ display: 'grid', gap: 8 }}>
            <div className="mono">POST /api/auth/register</div>
            <div className="mono">POST /api/auth/login</div>
            <div className="mono">POST /api/auth/forgot-password</div>
            <div className="mono">POST /api/auth/reset-password</div>
          </div>
        </div>
      </div>
    </div>
  )
}

