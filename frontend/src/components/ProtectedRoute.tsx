import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { me } from '../lib/api'
import { clearAuthToken, getAuthToken } from '../lib/authToken'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation()
  const token = useMemo(() => getAuthToken(), [])
  const [ready, setReady] = useState(false)
  const [ok, setOk] = useState(false)

  useEffect(() => {
    if (!token) {
      setReady(true)
      setOk(false)
      return
    }
    me()
      .then(() => {
        setOk(true)
      })
      .catch(() => {
        clearAuthToken()
        setOk(false)
      })
      .finally(() => setReady(true))
  }, [token])

  if (!ready) {
    return <div className="page">Loading...</div>
  }

  if (!ok) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}
