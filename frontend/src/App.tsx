import { Navigate, Route, Routes } from 'react-router-dom'

import { AuthLayout } from './components/AuthLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { CreateAccountPage } from './pages/CreateAccountPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { InventoryPage } from './pages/InventoryPage'
import { WarehousesPage } from './pages/WarehousesPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { ProductsPage } from './pages/ProductsPage'
import { SalesPage } from './pages/SalesPage'
import { PurchasesPage } from './pages/PurchasesPage'
import { CounterpartiesPage } from './pages/CounterpartiesPage'
import { FinancialsPage } from './pages/FinancialsPage'
import { ProductionPage } from './pages/ProductionPage'
import { TasksPage } from './pages/TasksPage'
import { ApplicationsPage } from './pages/ApplicationsPage'
import { ECommercePage } from './pages/eCommercePage'

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
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <InventoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/warehouses"
        element={
          <ProtectedRoute>
            <WarehousesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <CategoriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/sales" element={<ProtectedRoute><SalesPage /></ProtectedRoute>} />
      <Route path="/purchases" element={<ProtectedRoute><PurchasesPage /></ProtectedRoute>} />
      <Route path="/counterparties" element={<ProtectedRoute><CounterpartiesPage /></ProtectedRoute>} />
      <Route path="/financials" element={<ProtectedRoute><FinancialsPage /></ProtectedRoute>} />
      <Route path="/production" element={<ProtectedRoute><ProductionPage /></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
      <Route path="/applications" element={<ProtectedRoute><ApplicationsPage /></ProtectedRoute>} />
      <Route path="/ecommerce" element={<ProtectedRoute><ECommercePage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
