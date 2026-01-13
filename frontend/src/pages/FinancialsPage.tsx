import { TopNav } from '../components/TopNav'
import { ErpStore } from '../lib/erpStore'

export function FinancialsPage() {
  const sales = ErpStore.listSales()
  const purchases = ErpStore.listPurchases()
  const salesTotal = sales.reduce((n, x) => n + x.amount, 0)
  const purchaseTotal = purchases.reduce((n, x) => n + x.amount, 0)
  const profit = salesTotal - purchaseTotal

  return (
    <>
      <TopNav active="financials" />
      <div className="page">
        <div className="shell">
          <div className="card">
            <h2 className="cardTitle">Financials</h2>
            <p className="cardSubtitle">Ringkasan sederhana</p>
            <div style={{ display: 'grid', gap: 8 }}>
              <div>Total Sales: <b>{salesTotal}</b></div>
              <div>Total Purchases: <b>{purchaseTotal}</b></div>
              <div>Profit: <b>{profit}</b></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

