import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { forgotPassword } from '../lib/api'
import { HttpError } from '../lib/http'

export function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [resetToken, setResetToken] = useState<string | null>(null)

  const resetLink = useMemo(() => {
    if (!resetToken) return null
    return `/reset-password?token=${encodeURIComponent(resetToken)}`
  }, [resetToken])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setResetToken(null)
    setSubmitting(true)

    try {
      const res = await forgotPassword({ identifier })
      setMessage(res.message)
      setResetToken(res.resetToken)
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.body?.message || 'Gagal memproses permintaan')
      } else {
        setError('Gagal memproses permintaan')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="topBar">
        <div>
          <h2 className="cardTitle">Forgot Password</h2>
          <p className="cardSubtitle">
            Masukkan email atau username untuk mendapatkan token reset.
          </p>
        </div>
      </div>

      {error ? <div className="alert alertError">{error}</div> : null}
      {message ? <div className="alert">{message}</div> : null}

      {resetToken ? (
        <div className="alert">
          <div style={{ display: 'grid', gap: 8 }}>
            <div>Reset token (mode development):</div>
            <div className="mono">{resetToken}</div>
            {resetLink ? (
              <div>
                Buka halaman reset:{' '}
                <Link className="mono" to={resetLink}>
                  {resetLink}
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <form onSubmit={onSubmit}>
        <div className="field">
          <div className="label">Email atau Username</div>
          <input
            className="input"
            placeholder="contoh: subrutin atau subrutin@email.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="actions">
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? 'Memproses...' : 'Kirim Token'}
          </button>
        </div>

        <div className="linksRow">
          <span>
            <Link to="/login">Kembali ke Login</Link>
          </span>
          <span>
            Belum punya akun? <Link to="/create-account">Create Account</Link>
          </span>
        </div>
      </form>
    </div>
  )
}

