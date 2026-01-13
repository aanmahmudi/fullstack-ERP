import { useEffect, useState } from 'react'
import { TopNav } from '../components/TopNav'
import { Segmented } from '../components/Segmented'
import { ErpStore, type TaskItem } from '../lib/erpStore'

export function TasksPage() {
  const [items, setItems] = useState<TaskItem[]>([])
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<TaskItem['status']>('open')
  const [filterStatus, setFilterStatus] = useState<'all' | TaskItem['status']>('all')

  function taskStatusLabel(s: TaskItem['status']) {
    return s === 'open' ? 'To Do' : s === 'in_progress' ? 'In Progress' : 'Done'
  }

  useEffect(() => {
    ErpStore.refreshTasks().then(setItems)
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!title) return
    const created = await ErpStore.addTask({ title, status })
    setItems((prev) => [created, ...prev])
    setTitle('')
    setStatus('open')
  }

  return (
    <>
      <TopNav active="tasks" />
      <div className="page">
        <div className="shell">
          <div className="card">
            <h2 className="cardTitle">Tasks</h2>
            <p className="cardSubtitle">Daftar tugas sederhana</p>
            <form onSubmit={submit} className="grid2">
              <div className="field">
                <div className="labelRow"><label className="label">Judul</label></div>
                <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="field">
                <div className="labelRow"><label className="label">Status</label></div>
                <Segmented
                  value={status}
                  options={[
                    { value: 'open', label: 'To Do' },
                    { value: 'in_progress', label: 'In Progress' },
                    { value: 'done', label: 'Done' },
                  ]}
                  onChange={(v) => setStatus(v as TaskItem['status'])}
                />
              </div>
              <div className="actions">
                <button className="button" disabled={!title} type="submit">Tambah</button>
              </div>
            </form>
          </div>
          <div className="card">
            <h3 className="cardTitle">Daftar</h3>
            <div className="grid2" style={{ marginBottom: 8 }}>
              <div className="field">
                <div className="labelRow"><label className="label">Filter Status</label></div>
                <select className="input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}>
                  <option value="all">Semua</option>
                  <option value="open">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="field">
                <div className="labelRow"><label className="label">Legend</label></div>
                <div className="linksRow">
                  <span className="statusBadge status-open">To Do</span>
                  <span className="statusBadge status-in_progress">In Progress</span>
                  <span className="statusBadge status-done">Done</span>
                </div>
              </div>
            </div>
            {items.length === 0 ? (
              <div className="alert">Belum ada tugas.</div>
            ) : (
              <div className="dataTable" style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th className="premiumTableHeader" style={{ textAlign: 'left', padding: '8px' }}>Judul</th>
                      <th className="premiumTableHeader" style={{ textAlign: 'left', padding: '8px' }}>Status</th>
                      <th className="premiumTableHeader" style={{ textAlign: 'left', padding: '8px' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.filter((t) => filterStatus === 'all' ? true : t.status === filterStatus).map((t) => (
                      <tr key={t.id}>
                        <td style={{ padding: '8px' }}>{t.title}</td>
                        <td style={{ padding: '8px' }}>
                          <span className={`statusBadge status-${t.status} ${filterStatus !== 'all' && filterStatus === t.status ? 'statusChangeHighlight' : ''}`}>{taskStatusLabel(t.status)}</span>
                        </td>
                        <td style={{ padding: '8px' }}>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              className="buttonSecondary button"
                              disabled={t.status !== 'open'}
                              onClick={async () => {
                                await ErpStore.updateTaskStatus(t.id, 'in_progress')
                                const refreshed = await ErpStore.refreshTasks()
                                setItems(refreshed)
                              }}
                            >
                              Start
                            </button>
                            <button
                              type="button"
                              className="buttonSecondary button"
                              disabled={t.status === 'done'}
                              onClick={async () => {
                                await ErpStore.updateTaskStatus(t.id, 'done')
                                const refreshed = await ErpStore.refreshTasks()
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
