import { useEffect, useMemo, useState } from 'react'
import { TopNav } from '../components/TopNav'
import type { ProductDTO, CategoryDTO } from '../lib/api'
import { listProducts, listCategories, createProduct } from '../lib/api'

export function ProductsPage() {
  const [products, setProducts] = useState<ProductDTO[]>([])
  const [categories, setCategories] = useState<CategoryDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const [sku, setSku] = useState('')
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)
  const [uom, setUom] = useState('UNIT')
  const [unitPrice, setUnitPrice] = useState<number | undefined>(undefined)
  const [reorderLevel, setReorderLevel] = useState<number | undefined>(undefined)

  useEffect(() => {
    Promise.all([listProducts(), listCategories()])
      .then(([prods, cats]) => {
        setProducts(prods)
        setCategories(cats)
      })
      .finally(() => setLoading(false))
  }, [])

  const categoryOptions = useMemo(() => categories.map((c) => ({ value: c.id, label: c.name })), [categories])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const created = await createProduct({
        sku,
        name,
        categoryId,
        uom,
        unitPrice,
        reorderLevel,
      })
      setProducts((prev) => [created, ...prev])
      setSku('')
      setName('')
      setCategoryId(undefined)
      setUom('UNIT')
      setUnitPrice(undefined)
      setReorderLevel(undefined)
    } catch (err: any) {
      setError(err?.message || 'Gagal menyimpan produk')
    } finally {
      setSaving(false)
    }
  }

  const filtered = products.filter((p) => {
    const s = `${p.sku} ${p.name}`.toLowerCase()
    return s.includes(q.toLowerCase())
  })
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <>
      <TopNav active="inventory" />
      <div className="page">
        <div className="shell">
          <div className="card">
            <h2 className="cardTitle">Products</h2>
            <p className="cardSubtitle">Kelola produk</p>
            <div className="field" style={{ marginBottom: 8 }}>
              <div className="labelRow"><label className="label">Cari</label></div>
              <input className="input" value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} placeholder="Cari SKU atau Nama" />
            </div>
            <form onSubmit={submit} className="grid2">
              <div className="field">
                <div className="labelRow"><label className="label">SKU</label></div>
                <input className="input" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="Contoh: LAPTOP-001" />
              </div>
              <div className="field">
                <div className="labelRow"><label className="label">Nama Produk</label></div>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Gaming Laptop" />
              </div>
              <div className="field">
                <div className="labelRow"><label className="label">Kategori</label></div>
                <select className="input" value={categoryId ?? ''} onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}>
                  <option value="">(Pilih kategori)</option>
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <div className="labelRow"><label className="label">UOM</label></div>
                <input className="input" value={uom} onChange={(e) => setUom(e.target.value)} />
              </div>
              <div className="field">
                <div className="labelRow"><label className="label">Harga</label></div>
                <input className="input" type="number" value={unitPrice ?? ''} onChange={(e) => setUnitPrice(e.target.value ? Number(e.target.value) : undefined)} />
              </div>
              <div className="field">
                <div className="labelRow"><label className="label">Reorder Level</label></div>
                <input className="input" type="number" value={reorderLevel ?? ''} onChange={(e) => setReorderLevel(e.target.value ? Number(e.target.value) : undefined)} />
              </div>
              <div className="actions">
                <button className="button" disabled={!sku || !name || saving} type="submit">Simpan</button>
              </div>
              {error && <div className="alert alertError">{error}</div>}
            </form>
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
                      <th style={{ textAlign: 'left', padding: '8px' }}>Kategori</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>UOM</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Harga</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((p) => (
                      <tr key={p.id}>
                        <td style={{ padding: '8px' }}>{p.sku}</td>
                        <td style={{ padding: '8px' }}>{p.name}</td>
                        <td style={{ padding: '8px' }}>{p.categoryId ?? '-'}</td>
                        <td style={{ padding: '8px' }}>{p.uom || '-'}</td>
                        <td style={{ padding: '8px' }}>{p.unitPrice ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="actions" style={{ marginTop: 10 }}>
                  <div className="pill">Halaman {page} / {pages}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="buttonSecondary button" type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
                    <button className="buttonSecondary button" type="button" disabled={page >= pages} onClick={() => setPage((p) => Math.min(pages, p + 1))}>Next</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
