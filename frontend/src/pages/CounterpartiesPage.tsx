import { useEffect, useState } from 'react'
import { TopNav } from '../components/TopNav'
import { ErpStore, type Counterparty } from '../lib/erpStore'
import { Segmented } from '../components/Segmented'

export function CounterpartiesPage() {
  const [items, setItems] = useState<Counterparty[]>([])
  const [type, setType] = useState<Counterparty['type']>('customer')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [q, setQ] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'customer' | 'vendor'>('all')
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    ErpStore.refreshCounterparties().then(setItems)
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name) return
    const created = await ErpStore.addCounterparty({ type, name, email, phone })
    setItems((prev) => [created, ...prev])
    setType('customer')
    setName('')
    setEmail('')
    setPhone('')
  }

  const filtered = items.filter((i) => {
    const matchType = filterType === 'all' ? true : i.type === filterType
    const s = `${i.name} ${i.email ?? ''} ${i.phone ?? ''}`.toLowerCase()
    return matchType && s.includes(q.toLowerCase())
  })
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <>
      <TopNav active="counterparties" />
      <div className="page">
        <div className="shell">
          <div className="card">
            <h2 className="cardTitle">Counterparties</h2>
            <p className="cardSubtitle">Customers dan Vendors</p>
            <div className="grid2" style={{ marginBottom: 8 }}>
              <div className="field">
                <div className="labelRow"><label className="label">Cari</label></div>
                <input className="input" value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} placeholder="Cari nama/email/HP" />
              </div>
              <div className="field">
                <div className="labelRow"><label className="label">Filter</label></div>
                <Segmented
                  value={filterType}
                  options={[
                    { value: 'all', label: 'Semua' },
                    { value: 'customer', label: 'Customer' },
                    { value: 'vendor', label: 'Vendor' },
                  ]}
                  onChange={(v) => { setFilterType(v as any); setPage(1) }}
                />
              </div>
            </div>
            <form onSubmit={submit} className="grid2">
              <div className="field">
                <div className="labelRow"><label className="label">Tipe</label></div>
                <Segmented
                  value={type}
                  options={[
                    { value: 'customer', label: 'Customer' },
                    { value: 'vendor', label: 'Vendor' },
                  ]}
                  onChange={(v) => setType(v as Counterparty['type'])}
                />
              </div>
              <div className="field">
                <div className="labelRow"><label className="label">Nama</label></div>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="field">
                <div className="labelRow"><label className="label">Email</label></div>
                <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="field">
                <div className="labelRow"><label className="label">No HP</label></div>
                <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="actions">
                <button className="button" disabled={!name} type="submit">Simpan</button>
              </div>
            </form>
          </div>
          <div className="card">
            <h3 className="cardTitle">Daftar</h3>
            {items.length === 0 ? (
              <div className="alert">Belum ada data.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Tipe</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Nama</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Email</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>No HP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((i) => (
                      <tr key={i.id}>
                        <td style={{ padding: '8px' }}>{i.type}</td>
                        <td style={{ padding: '8px' }}>{i.name}</td>
                        <td style={{ padding: '8px' }}>{i.email || '-'}</td>
                        <td style={{ padding: '8px' }}>{i.phone || '-'}</td>
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
