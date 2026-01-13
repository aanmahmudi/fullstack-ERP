import { useEffect, useState } from 'react'
import { TopNav } from '../components/TopNav'
import type { CategoryDTO } from '../lib/api'
import { listCategories, createCategory } from '../lib/api'

export function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryDTO[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .finally(() => setLoading(false))
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const created = await createCategory({ name, description })
      setCategories((prev) => [created, ...prev])
      setName('')
      setDescription('')
    } catch (err: any) {
      setError(err?.message || 'Gagal menyimpan kategori')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <TopNav active="inventory" />
      <div className="page">
        <div className="shell">
          <div className="card">
            <h2 className="cardTitle">Categories</h2>
            <p className="cardSubtitle">Kelola kategori produk</p>
            <form onSubmit={submit} className="grid2">
              <div className="field">
                <div className="labelRow">
                  <label className="label">Nama Kategori</label>
                </div>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Electronics" />
              </div>
              <div className="field">
                <div className="labelRow">
                  <label className="label">Deskripsi</label>
                </div>
                <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Opsional" />
              </div>
              <div className="actions">
                <button className="button" disabled={!name || saving} type="submit">Simpan</button>
              </div>
              {error && <div className="alert alertError">{error}</div>}
            </form>
          </div>
          <div className="card">
            <h3 className="cardTitle">Daftar Kategori</h3>
            {loading ? (
              <div className="alert">Memuat kategori…</div>
            ) : categories.length === 0 ? (
              <div className="alert">Belum ada kategori.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Nama</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Deskripsi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr key={c.id}>
                        <td style={{ padding: '8px' }}>{c.name}</td>
                        <td style={{ padding: '8px' }}>{c.description || '-'}</td>
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

