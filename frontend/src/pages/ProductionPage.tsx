import { useEffect, useState } from 'react'
import { TopNav } from '../components/TopNav'
import { Segmented } from '../components/Segmented'
import { ErpStore, type WorkOrder } from '../lib/erpStore'

export function ProductionPage() {
  const [items, setItems] = useState<WorkOrder[]>([])
  const [number, setNumber] = useState('')
  const [productSku, setProductSku] = useState('')
  const [quantity, setQuantity] = useState<number | ''>('')
  const [status, setStatus] = useState<WorkOrder['status']>('planned')
  const [filterStatus, setFilterStatus] = useState<'all' | WorkOrder['status']>('all')

  function woStatusLabel(s: WorkOrder['status']) {
    return s === 'planned' ? 'Confirmed' : s === 'in_progress' ? 'In Progress' : 'Done'
  }

  useEffect(() => {
    ErpStore.refreshWorkOrders().then(setItems)
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!number || !productSku || !quantity) return
    const created = await ErpStore.addWorkOrder({ number, productSku, quantity: Number(quantity), status })
    setItems((prev) => [created, ...prev])
    setNumber('')
    setProductSku('')
    setQuantity('')
    setStatus('planned')
  }

  return (
    <>
      <TopNav active="production" />
      <div className="page">
        <div className="shell">
          <div className="card">
            <h2 className="cardTitle">Production</h2>
            <p className="cardSubtitle">Work Orders</p>
            <form onSubmit={submit} className="grid2">
              <div className="field"><div className="labelRow"><label className="label">Nomor</label></div><input className="input" value={number} onChange={(e) => setNumber(e.target.value)} /></div>
              <div className="field"><div className="labelRow"><label className="label">SKU</label></div><input className="input" value={productSku} onChange={(e) => setProductSku(e.target.value)} /></div>
              <div className="field"><div className="labelRow"><label className="label">Jumlah</label></div><input className="input" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')} /></div>
              <div className="field">
                <div className="labelRow"><label className="label">Status</label></div>
                <Segmented
                  value={status}
                  options={[
                    { value: 'planned', label: 'Confirmed' },
                    { value: 'in_progress', label: 'In Progress' },
                    { value: 'done', label: 'Done' },
                  ]}
                  onChange={(v) => setStatus(v as WorkOrder['status'])}
                />
              </div>
              <div className="actions"><button className="button" disabled={!number || !productSku || !quantity} type="submit">Tambah</button></div>
            </form>
          </div>
          <div className="card">
            <h3 className="cardTitle">Daftar Work Order</h3>
            <div className="grid2" style={{ marginBottom: 8 }}>
              <div className="field">
                <div className="labelRow"><label className="label">Filter Status</label></div>
                <select className="input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}>
                  <option value="all">Semua</option>
                  <option value="planned">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="field">
                <div className="labelRow"><label className="label">Legend</label></div>
                <div className="linksRow">
                  <span className="statusBadge status-planned">planned</span>
                  <span className="statusBadge status-in_progress">in_progress</span>
                  <span className="statusBadge status-done">done</span>
                </div>
              </div>
            </div>
            {items.length === 0 ? <div className="alert">Belum ada work order.</div> : (
              <div className="dataTable" style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th className="premiumTableHeader" style={{ textAlign: 'left', padding: '8px' }}>Nomor</th>
                      <th className="premiumTableHeader" style={{ textAlign: 'left', padding: '8px' }}>SKU</th>
                      <th className="premiumTableHeader" style={{ textAlign: 'left', padding: '8px' }}>Jumlah</th>
                      <th className="premiumTableHeader" style={{ textAlign: 'left', padding: '8px' }}>Status</th>
                      <th className="premiumTableHeader" style={{ textAlign: 'left', padding: '8px' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.filter((w) => filterStatus === 'all' ? true : w.status === filterStatus).map((w) => (
                      <tr key={w.id}>
                        <td style={{ padding: '8px' }}>{w.number}</td>
                        <td style={{ padding: '8px' }}>{w.productSku}</td>
                        <td style={{ padding: '8px' }}>{w.quantity}</td>
                        <td style={{ padding: '8px' }}>
                          <span className={`statusBadge status-${w.status} ${filterStatus !== 'all' && filterStatus === w.status ? 'statusChangeHighlight' : ''}`}>{woStatusLabel(w.status)}</span>
                        </td>
                        <td style={{ padding: '8px' }}>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              className="buttonSecondary button"
                              disabled={w.status !== 'planned'}
                              onClick={async () => {
                                await ErpStore.updateWorkOrderStatus(w.id, 'in_progress')
                                const refreshed = await ErpStore.refreshWorkOrders()
                                setItems(refreshed)
                              }}
                            >
                              Start
                            </button>
                            <button
                              type="button"
                              className="buttonSecondary button"
                              disabled={w.status === 'done'}
                              onClick={async () => {
                                await ErpStore.updateWorkOrderStatus(w.id, 'done')
                                const refreshed = await ErpStore.refreshWorkOrders()
                                setItems(refreshed)
                              }}
                            >
                              Done
                            </button>
                          </div>
                        </td>
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
