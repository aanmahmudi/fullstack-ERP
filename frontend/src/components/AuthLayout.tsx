import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="page">
      <div className="shell">
        <div className="card">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
