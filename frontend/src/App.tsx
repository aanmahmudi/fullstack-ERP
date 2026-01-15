import { Navigate, Route, Routes } from 'react-router-dom'

import { AuthLayout } from './components/AuthLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { CreateAccountPage } from './pages/CreateAccountPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
