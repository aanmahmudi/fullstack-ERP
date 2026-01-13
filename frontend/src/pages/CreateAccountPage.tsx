import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { register } from '../lib/api'
import { setAuthToken } from '../lib/authToken'
import { HttpError } from '../lib/http'

export function CreateAccountPage() {
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const res = await register({
        firstName,
        lastName,
        email,
        username,
        password,
        phoneNumber,
      })
      setAuthToken(res.token)
      navigate('/app', { replace: true })
    } catch (err) {
      if (err instanceof HttpError) {
        const fieldErrors = err.body?.fieldErrors || null
        const msg =
          fieldErrors && Object.keys(fieldErrors).length > 0
            ? Object.values(fieldErrors).join(', ')
            : err.body?.message || 'Register gagal'
        setError(msg)
      } else {
        setError('Register gagal')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="topBar">
        <div>
          <h2 className="cardTitle">Create Account</h2>
          <p className="cardSubtitle">Isi data untuk membuat akun baru.</p>
        </div>
      </div>

      {error ? <div className="alert alertError">{error}</div> : null}

      <form onSubmit={onSubmit}>
        <div className="grid2">
          <div className="field">
            <div className="label">First Name</div>
            <input
              className="input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
            />
          </div>

          <div className="field">
            <div className="label">Last Name</div>
            <input
              className="input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
            />
          </div>
        </div>

        <div style={{ height: 12 }} />

        <div className="field">
          <div className="label">Email</div>
          <input
            className="input"
            type="email"
            placeholder="contoh: nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div style={{ height: 12 }} />

        <div className="grid2">
          <div className="field">
            <div className="label">Username</div>
            <input
              className="input"
              placeholder="contoh: subrutin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="field">
            <div className="label">No Handphone</div>
            <input
              className="input"
              placeholder="contoh: 08123456789"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              autoComplete="tel"
            />
          </div>
        </div>

        <div style={{ height: 12 }} />

        <div className="field">
          <div className="label">Password</div>
          <input
            className="input"
            type="password"
            placeholder="Minimal 8 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <div className="actions">
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? 'Memproses...' : 'Create Account'}
          </button>
        </div>

        <div className="linksRow">
          <span>
            Sudah punya akun? <Link to="/login">Login</Link>
          </span>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </form>
    </div>
  )
}

