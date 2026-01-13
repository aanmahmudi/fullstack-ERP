import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { login } from '../lib/api'
import { setAuthToken } from '../lib/authToken'
import { HttpError } from '../lib/http'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const nextPath = useMemo(() => {
    const from = (location.state as { from?: string } | null)?.from
    return from || '/app'
  }, [location.state])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await login({ identifier, password })
      setAuthToken(res.token)
      navigate(nextPath, { replace: true })
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.body?.message || 'Login gagal')
      } else {
        setError('Login gagal')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="topBar">
        <div>
          <h2 className="cardTitle">Login</h2>
          <p className="cardSubtitle">Masukkan email/username dan password.</p>
        </div>
      </div>

      {error ? <div className="alert alertError">{error}</div> : null}

      <form onSubmit={onSubmit}>
        <div className="field">
          <div className="labelRow">
            <div className="label">Email atau Username</div>
          </div>
          <input
            className="input"
            placeholder="masukkan username atau email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div style={{ height: 12 }} />

        <div className="field">
          <div className="labelRow">
            <div className="label">Password</div>
          </div>
          <input
            className="input"
            type="password"
            placeholder="Minimal 8 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <div className="actions">
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? 'Memproses...' : 'Login'}
          </button>
        </div>

        <div className="linksRow">
          <span>
            Belum punya akun? <Link to="/create-account">Create Account</Link>
          </span>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </form>
    </div>
  )
}

