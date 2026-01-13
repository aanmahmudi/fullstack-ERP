import { useEffect, useState } from 'react'
import { TopNav } from '../components/TopNav'
import { Segmented } from '../components/Segmented'
import { ErpStore, type PurchaseOrder, type Counterparty } from '../lib/erpStore'

export function PurchasesPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [vendors, setVendors] = useState<Counterparty[]>([])
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [number, setNumber] = useState('')
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState<number | ''>('')
  const [vendorId, setVendorId] = useState<string>('')
  const [status, setStatus] = useState<PurchaseOrder['status']>('draft')
  const [filterStatus, setFilterStatus] = useState<'all' | PurchaseOrder['status']>('all')
  const [paymentTerm, setPaymentTerm] = useState<'immediate' | 'net30' | 'net60'>('immediate')
  const [preview, setPreview] = useState<PurchaseOrder | null>(null)

  function purchaseStatusLabel(s: PurchaseOrder['status']) {
    return s === 'draft' ? 'RFQ' : s === 'confirmed' ? 'Purchase Order' : s === 'received' ? 'Receipt' : 'Vendor Bill'
  }
  function nextPurchaseNumber(s: PurchaseOrder['status']) {
    const d = new Date()
    const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
    const prefix = s === 'draft' ? 'RFQ' : s === 'confirmed' ? 'PO' : s === 'received' ? 'RCPT' : 'BILL'
    const key = `seq_${prefix}_${ymd}`
    const current = Number(localStorage.getItem(key) || '0') + 1
    localStorage.setItem(key, String(current))
    return `${prefix}-${ymd}-${String(current).padStart(3, '0')}`
  }
  function formatIDR(n: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
  }
  function computeDueDate(d: string, term: 'immediate' | 'net30' | 'net60') {
    const base = new Date(d)
    const add = term === 'net30' ? 30 : term === 'net60' ? 60 : 0
    base.setDate(base.getDate() + add)
    const yyyy = base.getFullYear()
    const mm = String(base.getMonth() + 1).padStart(2, '0')
    const dd = String(base.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  useEffect(() => {
    ErpStore.refreshPurchases().then(setOrders)
    ErpStore.refreshCounterparties().then((cps) => setVendors(cps.filter((c) => c.type === 'vendor')))
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!date || !amount || !vendorId) return
    const finalNumber = number || nextPurchaseNumber(status)
    const created = await ErpStore.addPurchase({
      number: finalNumber,
      date,
      amount: Number(amount),
      vendorId,
      status,
    })
    setOrders((prev) => [created, ...prev])
    try {
      const m = JSON.parse(localStorage.getItem('__term_purchases') || '{}')
      m[created.id] = paymentTerm
      localStorage.setItem('__term_purchases', JSON.stringify(m))
    } catch {}
    setNumber('')
    setDate('')
    setAmount('')
    setVendorId('')
    setStatus('draft')
  }

  const filtered = orders.filter((o) => {
    const matchStatus = filterStatus === 'all' ? true : o.status === filterStatus
    const s = `${o.number} ${o.status} ${vendors.find((v)=>v.id===o.vendorId)?.name ?? ''}`.toLowerCase()
    return matchStatus && s.includes(q.toLowerCase())
  })
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)
  const termsMapPurchases: Record<string, 'immediate' | 'net30' | 'net60'> = (() => {
    try { return JSON.parse(localStorage.getItem('__term_purchases') || '{}') } catch { return {} }
  })()

  async function changeStatus(id: string, next: PurchaseOrder['status']) {
    await ErpStore.updatePurchaseStatus(id, next)
    const refreshed = await ErpStore.refreshPurchases()
    setOrders(refreshed)
  }

  return (
    <>
      <TopNav active="purchases" />
      <div className="page">
        <div className="shell">
          <div className="card">
            <h2 className="cardTitle">Purchases</h2>
            <p className="cardSubtitle">Tambah Purchase Order</p>
            <div className="grid2" style={{ marginBottom: 8 }}>
              <div className="field">
                <div className="labelRow"><label className="label">Cari</label></div>
                <input className="input" value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} placeholder="Cari nomor, status, vendor" />
              </div>
              <div className="field">
                <div className="labelRow"><label className="label">Filter Status</label></div>
                <Segmented
                  value={filterStatus}
                  options={[
                    { value: 'all', label: 'Semua' },
                    { value: 'draft', label: 'RFQ' },
                    { value: 'confirmed', label: 'Purchase Order' },
                    { value: 'received', label: 'Receipt' },
                    { value: 'billed', label: 'Vendor Bill' },
                  ]}
                  onChange={(v) => { setFilterStatus(v as any); setPage(1) }}
                />
              </div>
            </div>
            <div className="linksRow">
              <span className="statusBadge status-draft">RFQ</span>
              <span className="statusBadge status-confirmed">Purchase Order</span>
              <span className="statusBadge status-received">Receipt</span>
              <span className="statusBadge status-billed">Vendor Bill</span>
            </div>
            <form onSubmit={submit} className="grid2">
              <div className="field">
                <div className="labelRow"><label className="label">Nomor</label></div>
                <input className="input" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="(otomatis jika kosong)" />
              </div>
              <div className="field">
                <div className="labelRow"><label className="label">Tanggal</label></div>
                <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="field">
                <div className="labelRow"><label className="label">Vendor</label></div>
                <select className="input" value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
                  <option value="">(pilih)</option>
                  {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
              <div className="field">
                <div className="labelRow"><label className="label">Jumlah</label></div>
                <input className="input" type="number" value={amount} onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')} />
              </div>
              <div className="field">
                <div className="labelRow"><label className="label">Status</label></div>
                <Segmented
                  value={status}
                  options={[
                    { value: 'draft', label: 'RFQ' },
                    { value: 'confirmed', label: 'Purchase Order' },
                    { value: 'received', label: 'Receipt' },
                    { value: 'billed', label: 'Vendor Bill' },
                  ]}
                  onChange={(v) => setStatus(v as PurchaseOrder['status'])}
                />
              </div>
              <div className="field">
                <div className="labelRow"><label className="label">Payment Terms</label></div>
                <Segmented
                  value={paymentTerm}
                  options={[
                    { value: 'immediate', label: 'Immediate' },
                    { value: 'net30', label: 'Net 30' },
                    { value: 'net60', label: 'Net 60' },
                  ]}
                  onChange={(v) => setPaymentTerm(v as any)}
                />
              </div>
              <div className="actions">
                <button className="button" disabled={!date || !amount || !vendorId} type="submit">Simpan</button>
              </div>
            </form>
          </div>
          <div className="card">
            <h3 className="cardTitle">Daftar Purchase Order</h3>
            {orders.length === 0 ? (
              <div className="alert">Belum ada purchase order.</div>
            ) : (
              <div className="dataTable" style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th className="premiumTableHeader" style={{ textAlign: 'left', padding: '8px' }}>Nomor</th>
                      <th className="premiumTableHeader" style={{ textAlign: 'left', padding: '8px' }}>Tanggal</th>
                      <th className="premiumTableHeader" style={{ textAlign: 'left', padding: '8px' }}>Jatuh Tempo</th>
                      <th className="premiumTableHeader" style={{ textAlign: 'left', padding: '8px' }}>Vendor</th>
                      <th className="premiumTableHeader" style={{ textAlign: 'left', padding: '8px' }}>Tipe Dokumen</th>
                      <th className="premiumTableHeader" style={{ textAlign: 'left', padding: '8px' }}>Status</th>
                      <th className="premiumTableHeader" style={{ textAlign: 'left', padding: '8px' }}>Subtotal</th>
                      <th className="premiumTableHeader" style={{ textAlign: 'left', padding: '8px' }}>Pajak</th>
                      <th className="premiumTableHeader" style={{ textAlign: 'left', padding: '8px' }}>Total</th>
                      <th className="premiumTableHeader" style={{ textAlign: 'left', padding: '8px' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((o) => (
                      <tr key={o.id}>
                        <td style={{ padding: '8px' }}>{o.number}</td>
                        <td style={{ padding: '8px' }}>{o.date}</td>
                        <td style={{ padding: '8px' }}>{computeDueDate(o.date, termsMapPurchases[o.id] ?? 'immediate')}</td>
                        <td style={{ padding: '8px' }}>{vendors.find((v) => v.id === o.vendorId)?.name ?? '-'}</td>
                        <td style={{ padding: '8px' }}>{purchaseStatusLabel(o.status)}</td>
                        <td style={{ padding: '8px' }}>
                          <span className={`statusBadge status-${o.status}`}>{purchaseStatusLabel(o.status)}</span>
                        </td>
                        <td style={{ padding: '8px' }}>{formatIDR(o.amount)}</td>
                        <td style={{ padding: '8px' }}>{formatIDR(Math.round(o.amount * 0.11))}</td>
                        <td style={{ padding: '8px' }}>{formatIDR(Math.round(o.amount * 1.11))}</td>
                        <td style={{ padding: '8px' }}>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {o.status === 'draft' && (
                              <button
                                type="button"
                                className="buttonSecondary button"
                                onClick={() => alert('RFQ dikirim ke vendor (simulasi)')}
                              >
                                Send RFQ
                              </button>
                            )}
                            <button
                              type="button"
                              className="buttonSecondary button"
                              onClick={() => setPreview(o)}
                            >
                              Print
                            </button>
                            <button
                              type="button"
                              className="buttonSecondary button"
                              disabled={o.status !== 'draft'}
                              onClick={() => changeStatus(o.id, 'confirmed')}
                            >
                              Confirm Order
                            </button>
                            <button
                              type="button"
                              className="buttonSecondary button"
                              disabled={o.status !== 'confirmed'}
                              onClick={() => changeStatus(o.id, 'received')}
                            >
                              Validate Receipt
                            </button>
                            <button
                              type="button"
                              className="buttonSecondary button"
                              disabled={o.status !== 'received'}
                              onClick={() => changeStatus(o.id, 'billed')}
                            >
                              Create Bill
                            </button>
                          </div>
                        </td>
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
      {preview && (
        <div className="modalOverlay" onClick={() => setPreview(null)}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <div className="printDocTitle">Purchase Document Preview</div>
              <div className="pill">{purchaseStatusLabel(preview.status)}</div>
            </div>
            <div style={{ display: 'grid', gap: 6, marginBottom: 12 }}>
              <div><b>Nomor:</b> {preview.number}</div>
              <div><b>Tanggal:</b> {preview.date}</div>
              <div><b>Vendor:</b> {vendors.find((v) => v.id === preview.vendorId)?.name ?? '-'}</div>
            </div>
            <table className="printTable">
              <thead>
                <tr>
                  <th>Deskripsi</th>
                  <th>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{purchaseStatusLabel(preview.status)}</td>
                  <td>{formatIDR(preview.amount)}</td>
                </tr>
              </tbody>
            </table>
            <div className="modalActions">
              <button className="buttonSecondary button" onClick={() => setPreview(null)}>Tutup</button>
              <button className="button" onClick={() => window.print()}>Cetak</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
