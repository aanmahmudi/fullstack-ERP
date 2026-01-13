import { TopNav } from '../components/TopNav'

export function ECommercePage() {
  return (
    <>
      <TopNav active="ecommerce" />
      <div className="page">
        <div className="shell">
          <div className="card">
            <h2 className="cardTitle">eCommerce</h2>
            <p className="cardSubtitle">Sinkronisasi produk dan pesanan (placeholder)</p>
            <div className="alert">Integrasi marketplace akan ditambahkan kemudian.</div>
          </div>
        </div>
      </div>
    </>
  )
}
