import { useEffect, useState } from 'react'
import { TopNav } from '../components/TopNav'
import type { WarehouseDTO } from '../lib/api'
import { listWarehouses, createWarehouse } from '../lib/api'

export function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<WarehouseDTO[]>([])
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listWarehouses()
      .then(setWarehouses)
      .finally(() => setLoading(false))
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const created = await createWarehouse({ name, location })
      setWarehouses((prev) => [created, ...prev])
      setName('')
      setLocation('')
    } catch (err: any) {
      setError(err?.message || 'Gagal menyimpan gudang')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <TopNav active="warehouse" />
      <div className="page">
        <div className="shell">
          <div className="card">
            <h2 className="cardTitle">Warehouses</h2>
            <p className="cardSubtitle">Kelola gudang</p>
            <form onSubmit={submit} className="grid2">
              <div className="field">
                <div className="labelRow"><label className="label">Nama Gudang</label></div>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Main Warehouse" />
              </div>
              <div className="field">
                <div className="labelRow"><label className="label">Lokasi</label></div>
                <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Contoh: Jakarta" />
              </div>
              <div className="actions">
                <button className="button" disabled={!name || saving} type="submit">Simpan</button>
              </div>
              {error && <div className="alert alertError">{error}</div>}
            </form>
          </div>
          <div className="card">
            <h3 className="cardTitle">Daftar Gudang</h3>
            {loading ? (
              <div className="alert">Memuat gudang…</div>
            ) : warehouses.length === 0 ? (
              <div className="alert">Belum ada gudang.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Nama</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Lokasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warehouses.map((w) => (
                      <tr key={w.id}>
                        <td style={{ padding: '8px' }}>{w.name}</td>
                        <td style={{ padding: '8px' }}>{w.location || '-'}</td>
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

