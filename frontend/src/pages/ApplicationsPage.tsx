import { TopNav } from '../components/TopNav'
import { Link } from 'react-router-dom'
import { ErpStore } from '../lib/erpStore'

export function ApplicationsPage() {
  const apps = [
    { to: '/inventory', title: 'Inventory' },
    { to: '/warehouses', title: 'Warehouses' },
    { to: '/categories', title: 'Categories' },
    { to: '/products', title: 'Products' },
    { to: '/sales', title: 'Sales' },
    { to: '/purchases', title: 'Purchases' },
    { to: '/counterparties', title: 'Counterparties' },
    { to: '/financials', title: 'Financials' },
    { to: '/production', title: 'Production' },
    { to: '/tasks', title: 'Tasks' },
    { to: '/ecommerce', title: 'eCommerce' },
  ]
  return (
    <>
      <TopNav active="applications" />
      <div className="page">
        <div className="shell">
          <div className="card">
            <h2 className="cardTitle">Applications</h2>
            <p className="cardSubtitle">Modul yang tersedia</p>
            <div className="actions">
              <button className="button" onClick={() => ErpStore.seedDemo()}>Seed Demo Data</button>
            </div>
            <div className="grid2">
              {apps.map((a) => (
                <Link key={a.to} to={a.to} className="pill">{a.title}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
