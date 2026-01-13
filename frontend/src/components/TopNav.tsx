import type { ReactNode } from 'react'
import './topnav.css'
import { Link } from 'react-router-dom'

type NavItem = {
  key: string
  label: string
  icon: ReactNode
}

const items: NavItem[] = [
  { key: 'overview', label: 'Overview', icon: <span>📈</span> },
  { key: 'purchases', label: 'Purchases', icon: <span>🛍️</span> },
  { key: 'sales', label: 'Sales', icon: <span>🧾</span> },
  { key: 'inventory', label: 'Inventory', icon: <span>🛒</span> },
  { key: 'counterparties', label: 'Counterparties', icon: <span>👥</span> },
  { key: 'warehouse', label: 'Warehouse', icon: <span>📦</span> },
  { key: 'financials', label: 'Financials', icon: <span>💼</span> },
  { key: 'ecommerce', label: 'eCommerce', icon: <span>🛒</span> },
  { key: 'production', label: 'Production', icon: <span>📊</span> },
  { key: 'tasks', label: 'Tasks', icon: <span>✅</span> },
  { key: 'applications', label: 'Applications', icon: <span>⚙️</span> },
]

export function TopNav({ active = 'inventory' }: { active?: string }) {
  return (
    <div className="topNav">
      <div className="topNavInner">
        <div className="brand">
          <div className="brandLogo">⋀⋀</div>
        </div>
        <div className="navItems">
          {items.map((it) => {
            const to =
              it.key === 'overview' ? '/app' :
              it.key === 'inventory' ? '/inventory' :
              it.key === 'warehouse' ? '/warehouses' :
              it.key === 'sales' ? '/sales' :
              it.key === 'purchases' ? '/purchases' :
              it.key === 'counterparties' ? '/counterparties' :
              it.key === 'financials' ? '/financials' :
              it.key === 'production' ? '/production' :
              it.key === 'tasks' ? '/tasks' :
              it.key === 'applications' ? '/applications' :
              it.key === 'ecommerce' ? '/ecommerce' :
              undefined
            return to ? (
              <Link to={to} key={it.key} className={`navItem ${active === it.key ? 'active' : ''}`}>
                <div className="navIcon">{it.icon}</div>
                <div className="navLabel">{it.label}</div>
              </Link>
            ) : (
              <div key={it.key} className="navItem">
                <div className="navIcon">{it.icon}</div>
                <div className="navLabel">{it.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
