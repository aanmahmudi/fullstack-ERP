import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { UserDto, CategoryDTO, WarehouseDTO, ProductDTO } from '../lib/api'
import { me, listCategories, listWarehouses, listProducts } from '../lib/api'
import { clearAuthToken } from '../lib/authToken'
import { TopNav } from '../components/TopNav'

export function HomePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<CategoryDTO[]>([])
  const [warehouses, setWarehouses] = useState<WarehouseDTO[]>([])
  const [products, setProducts] = useState<ProductDTO[]>([])

  useEffect(() => {
    me()
      .then((u) => setUser(u))
      .finally(() => setLoading(false))
    // Load inventory summary
    Promise.all([listCategories(), listWarehouses(), listProducts()])
      .then(([cats, whs, prods]) => {
        setCategories(cats)
        setWarehouses(whs)
        setProducts(prods)
      })
      .catch(() => {
        // ignore errors for now; section will show zero items
      })
  }, [])

  function logout() {
    clearAuthToken()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <TopNav active="overview" />
      <div className="page">
        <div className="shell">
          <div className="card">
            <div className="topBar">
              <div>
                <h2 className="cardTitle">Dashboard</h2>
                <p className="cardSubtitle">Ringkasan akun dan aktivitas sistem.</p>
              </div>
              <button className="button buttonSecondary" onClick={logout} style={{ width: 140 }}>
                Logout
              </button>
            </div>

            {loading ? (
              <div className="alert">Memuat profil…</div>
            ) : user ? (
              <div className="alert">
                <div style={{ display: 'grid', gap: 6 }}>
                  <div>Halo, <b>{user.firstName}</b> ({user.username})</div>
                  <div>Email: {user.email}</div>
                  <div>No HP: {user.phoneNumber}</div>
                </div>
              </div>
            ) : (
              <div className="alert alertError">Gagal memuat profil.</div>
            )}

            <div className="kpiGrid" style={{ marginTop: 8 }}>
              <div className="kpiCard">
                <div className="kpiNumber">{categories.length}</div>
                <div className="kpiLabel">Kategori</div>
              </div>
              <div className="kpiCard">
                <div className="kpiNumber">{warehouses.length}</div>
                <div className="kpiLabel">Gudang</div>
              </div>
              <div className="kpiCard">
                <div className="kpiNumber">{products.length}</div>
                <div className="kpiLabel">Produk</div>
              </div>
              <div className="kpiCard">
                <div className="kpiNumber">{Math.min(5, products.length)}</div>
                <div className="kpiLabel">Contoh Ditampilkan</div>
              </div>
            </div>

            {products.length > 0 ? (
              <div className="card" style={{ marginTop: 12 }}>
                <div className="topBar">
                  <div>
                    <h3 className="cardTitle">Contoh Produk</h3>
                    <p className="cardSubtitle">5 item terbaru</p>
                  </div>
                  <button className="button buttonSecondary" onClick={() => navigate('/products')} style={{ width: 140 }}>
                    Lihat Semua
                  </button>
                </div>
                <div className="dataTable" style={{ padding: 10 }}>
                  {products.slice(0, 5).map((p) => (
                    <div key={p.id} className="pill">
                      <span className="mono">{p.sku}</span>
                      <span>— {p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="alert">Belum ada data produk.</div>
            )}
          </div>

          <div className="card">
            <h3 className="cardTitle">Aksi Cepat</h3>
            <p className="cardSubtitle">Navigasi modul utama.</p>
            <div className="grid2" style={{ gap: 12 }}>
              <button className="button" onClick={() => navigate('/inventory')}>Inventory</button>
              <button className="button" onClick={() => navigate('/warehouses')}>Warehouse</button>
              <button className="button" onClick={() => navigate('/sales')}>Sales</button>
              <button className="button" onClick={() => navigate('/purchases')}>Purchases</button>
              <button className="button" onClick={() => navigate('/counterparties')}>Counterparties</button>
              <button className="button" onClick={() => navigate('/tasks')}>Tasks</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
