import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { resetPassword } from '../lib/api'
import { HttpError } from '../lib/http'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialToken = useMemo(() => searchParams.get('token') || '', [searchParams])

  const [token, setToken] = useState(initialToken)
  const [newPassword, setNewPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setDone(false)
    setSubmitting(true)

    try {
      await resetPassword({ token, newPassword })
      setDone(true)
      setTimeout(() => navigate('/login', { replace: true }), 900)
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.body?.message || 'Gagal reset password')
      } else {
        setError('Gagal reset password')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="topBar">
        <div>
          <h2 className="cardTitle">Reset Password</h2>
          <p className="cardSubtitle">Masukkan token dan password baru.</p>
        </div>
      </div>

      {error ? <div className="alert alertError">{error}</div> : null}
      {done ? <div className="alert">Password berhasil diubah. Redirect ke login…</div> : null}

      <form onSubmit={onSubmit}>
        <div className="field">
          <div className="label">Token</div>
          <input
            className="input mono"
            placeholder="Tempel token dari halaman Forgot Password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>

        <div style={{ height: 12 }} />

        <div className="field">
          <div className="label">Password Baru</div>
          <input
            className="input"
            type="password"
            placeholder="Minimal 8 karakter"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <div className="actions">
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? 'Memproses...' : 'Reset Password'}
          </button>
        </div>

        <div className="linksRow">
          <span>
            <Link to="/login">Kembali ke Login</Link>
          </span>
          <span>
            <Link to="/forgot-password">Minta token lagi</Link>
          </span>
        </div>
      </form>
    </div>
  )
}

