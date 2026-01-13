import { useEffect, useState } from 'react'
import { TopNav } from '../components/TopNav'
import type { CategoryDTO, WarehouseDTO, ProductDTO } from '../lib/api'
import { listCategories, listWarehouses, listProducts } from '../lib/api'

export function InventoryPage() {
  const [categories, setCategories] = useState<CategoryDTO[]>([])
  const [warehouses, setWarehouses] = useState<WarehouseDTO[]>([])
  const [products, setProducts] = useState<ProductDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([listCategories(), listWarehouses(), listProducts()])
      .then(([cats, whs, prods]) => {
        setCategories(cats)
        setWarehouses(whs)
        setProducts(prods)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <TopNav active="inventory" />
      <div className="page">
        <div className="shell">
          <div className="card">
            <h2 className="cardTitle">Inventory</h2>
            <p className="cardSubtitle">Ringkasan data Inventory</p>
            <div style={{ display: 'grid', gap: 8 }}>
              <div>Kategori: <b>{categories.length}</b></div>
              <div>Gudang: <b>{warehouses.length}</b></div>
              <div>Produk: <b>{products.length}</b></div>
            </div>
          </div>
          <div className="card">
            <h3 className="cardTitle">Daftar Produk</h3>
            {loading ? (
              <div className="alert">Memuat produk…</div>
            ) : products.length === 0 ? (
              <div className="alert">Belum ada produk.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '8px' }}>SKU</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Nama</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>UOM</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Harga</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td style={{ padding: '8px' }}>{p.sku}</td>
                        <td style={{ padding: '8px' }}>{p.name}</td>
                        <td style={{ padding: '8px' }}>{p.uom || '-'}</td>
                        <td style={{ padding: '8px' }}>{p.unitPrice ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

