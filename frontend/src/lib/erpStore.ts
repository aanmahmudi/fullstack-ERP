export type Counterparty = {
  id: string
  type: 'customer' | 'vendor'
  name: string
  email?: string
  phone?: string
}

export type SalesOrder = {
  id: string
  customerId: string
  number: string
  date: string
  amount: number
  status: 'draft' | 'confirmed' | 'delivered' | 'invoiced'
}

export type PurchaseOrder = {
  id: string
  vendorId: string
  number: string
  date: string
  amount: number
  status: 'draft' | 'confirmed' | 'received' | 'billed'
}

export type TaskItem = {
  id: string
  title: string
  status: 'open' | 'in_progress' | 'done'
}

export type WorkOrder = {
  id: string
  number: string
  productSku: string
  quantity: number
  status: 'planned' | 'in_progress' | 'done'
}

import {
  listCounterpartiesERP,
  createCounterpartyERP,
  listSalesOrdersERP,
  createSalesOrderERP,
  updateSalesOrderStatusERP,
  listPurchaseOrdersERP,
  createPurchaseOrderERP,
  updatePurchaseOrderStatusERP,
  listTasksERP,
  createTaskERP,
  updateTaskStatusERP,
  listWorkOrdersERP,
  createWorkOrderERP,
  updateWorkOrderStatusERP,
} from './api'
import { listProducts } from './api'

export const ErpStore = {
  listCounterparties(): Counterparty[] {
    const rows = (window as any).__erp_cache_counterparties as Counterparty[] | undefined
    if (rows) return rows
    return []
  },
  async refreshCounterparties(): Promise<Counterparty[]> {
    const list = await listCounterpartiesERP()
    const mapped = list.map<Counterparty>((c) => ({
      id: String(c.id),
      type: c.type === 'CUSTOMER' ? 'customer' : 'vendor',
      name: c.name,
      email: c.email,
      phone: c.phone,
    }))
    ;(window as any).__erp_cache_counterparties = mapped
    return mapped
  },
  async addCounterparty(item: Omit<Counterparty, 'id'>): Promise<Counterparty> {
    const created = await createCounterpartyERP({
      type: item.type === 'customer' ? 'CUSTOMER' : 'VENDOR',
      name: item.name,
      email: item.email,
      phone: item.phone,
    })
    const mapped: Counterparty = {
      id: String(created.id),
      type: created.type === 'CUSTOMER' ? 'customer' : 'vendor',
      name: created.name,
      email: created.email,
      phone: created.phone,
    }
    const list = await ErpStore.refreshCounterparties()
    ;(window as any).__erp_cache_counterparties = [mapped, ...list]
    return mapped
  },

  listSales(): SalesOrder[] {
    const rows = (window as any).__erp_cache_sales as SalesOrder[] | undefined
    if (rows) return rows
    return []
  },
  async refreshSales(): Promise<SalesOrder[]> {
    const list = await listSalesOrdersERP()
    const mapped = list.map<SalesOrder>((o) => ({
      id: String(o.id),
      number: o.number,
      date: o.date,
      customerId: String(o.customerId),
      amount: o.amount,
      status: o.status.toLowerCase() as SalesOrder['status'],
    }))
    ;(window as any).__erp_cache_sales = mapped
    return mapped
  },
  async addSales(item: Omit<SalesOrder, 'id'>): Promise<SalesOrder> {
    const created = await createSalesOrderERP({
      number: item.number,
      date: item.date,
      customerId: Number(item.customerId),
      amount: item.amount,
      status: item.status.toUpperCase() as any,
    })
    const mapped: SalesOrder = {
      id: String(created.id),
      number: created.number,
      date: created.date,
      customerId: String(created.customerId),
      amount: created.amount,
      status: created.status.toLowerCase() as SalesOrder['status'],
    }
    const list = await ErpStore.refreshSales()
    ;(window as any).__erp_cache_sales = [mapped, ...list]
    return mapped
  },
  async updateSalesStatus(id: string, status: SalesOrder['status']): Promise<SalesOrder> {
    const updated = await updateSalesOrderStatusERP(Number(id), status.toUpperCase() as any)
    const mapped: SalesOrder = {
      id: String(updated.id),
      number: updated.number,
      date: updated.date,
      customerId: String(updated.customerId),
      amount: updated.amount,
      status: updated.status.toLowerCase() as SalesOrder['status'],
    }
    const list = await ErpStore.refreshSales()
    ;(window as any).__erp_cache_sales = list.map((o) => (o.id === mapped.id ? mapped : o))
    return mapped
  },

  listPurchases(): PurchaseOrder[] {
    const rows = (window as any).__erp_cache_purchases as PurchaseOrder[] | undefined
    if (rows) return rows
    return []
  },
  async refreshPurchases(): Promise<PurchaseOrder[]> {
    const list = await listPurchaseOrdersERP()
    const mapped = list.map<PurchaseOrder>((o) => ({
      id: String(o.id),
      number: o.number,
      date: o.date,
      vendorId: String(o.vendorId),
      amount: o.amount,
      status: o.status.toLowerCase() as PurchaseOrder['status'],
    }))
    ;(window as any).__erp_cache_purchases = mapped
    return mapped
  },
  async addPurchase(item: Omit<PurchaseOrder, 'id'>): Promise<PurchaseOrder> {
    const created = await createPurchaseOrderERP({
      number: item.number,
      date: item.date,
      vendorId: Number(item.vendorId),
      amount: item.amount,
      status: item.status.toUpperCase() as any,
    })
    const mapped: PurchaseOrder = {
      id: String(created.id),
      number: created.number,
      date: created.date,
      vendorId: String(created.vendorId),
      amount: created.amount,
      status: created.status.toLowerCase() as PurchaseOrder['status'],
    }
    const list = await ErpStore.refreshPurchases()
    ;(window as any).__erp_cache_purchases = [mapped, ...list]
    return mapped
  },
  async updatePurchaseStatus(id: string, status: PurchaseOrder['status']): Promise<PurchaseOrder> {
    const updated = await updatePurchaseOrderStatusERP(Number(id), status.toUpperCase() as any)
    const mapped: PurchaseOrder = {
      id: String(updated.id),
      number: updated.number,
      date: updated.date,
      vendorId: String(updated.vendorId),
      amount: updated.amount,
      status: updated.status.toLowerCase() as PurchaseOrder['status'],
    }
    const list = await ErpStore.refreshPurchases()
    ;(window as any).__erp_cache_purchases = list.map((o) => (o.id === mapped.id ? mapped : o))
    return mapped
  },

  listTasks(): TaskItem[] {
    const rows = (window as any).__erp_cache_tasks as TaskItem[] | undefined
    if (rows) return rows
    return []
  },
  async refreshTasks(): Promise<TaskItem[]> {
    const list = await listTasksERP()
    const mapped = list.map<TaskItem>((t) => ({
      id: String(t.id),
      title: t.title,
      status: t.status.toLowerCase() as TaskItem['status'],
    }))
    ;(window as any).__erp_cache_tasks = mapped
    return mapped
  },
  async addTask(item: Omit<TaskItem, 'id'>): Promise<TaskItem> {
    const created = await createTaskERP({
      title: item.title,
      status: item.status.toUpperCase() as any,
    })
    const mapped: TaskItem = {
      id: String(created.id),
      title: created.title,
      status: created.status.toLowerCase() as TaskItem['status'],
    }
    const list = await ErpStore.refreshTasks()
    ;(window as any).__erp_cache_tasks = [mapped, ...list]
    return mapped
  },
  async updateTaskStatus(id: string, status: TaskItem['status']): Promise<TaskItem> {
    const updated = await updateTaskStatusERP(Number(id), status.toUpperCase() as any)
    const mapped: TaskItem = {
      id: String(updated.id),
      title: updated.title,
      status: updated.status.toLowerCase() as TaskItem['status'],
    }
    const list = await ErpStore.refreshTasks()
    ;(window as any).__erp_cache_tasks = list.map((t) => (t.id === mapped.id ? mapped : t))
    return mapped
  },

  listWorkOrders(): WorkOrder[] {
    const rows = (window as any).__erp_cache_workorders as WorkOrder[] | undefined
    if (rows) return rows
    return []
  },
  async refreshWorkOrders(): Promise<WorkOrder[]> {
    const list = await listWorkOrdersERP()
    const mapped = list.map<WorkOrder>((w) => ({
      id: String(w.id),
      number: w.number,
      productSku: '',
      quantity: w.quantity,
      status: w.status.toLowerCase() as WorkOrder['status'],
    }))
    ;(window as any).__erp_cache_workorders = mapped
    return mapped
  },
  async addWorkOrder(item: Omit<WorkOrder, 'id'>): Promise<WorkOrder> {
    const products = await listProducts()
    const found = products.find((p) => p.sku === item.productSku)
    if (!found) throw new Error('Produk tidak ditemukan')
    const created = await createWorkOrderERP({
      number: item.number,
      productId: found.id,
      quantity: item.quantity,
      status: item.status.toUpperCase() as any,
    })
    const mapped: WorkOrder = {
      id: String(created.id),
      number: created.number,
      productSku: item.productSku,
      quantity: created.quantity,
      status: created.status.toLowerCase() as WorkOrder['status'],
    }
    const list = await ErpStore.refreshWorkOrders()
    ;(window as any).__erp_cache_workorders = [mapped, ...list]
    return mapped
  },
  async updateWorkOrderStatus(id: string, status: WorkOrder['status']): Promise<WorkOrder> {
    const updated = await updateWorkOrderStatusERP(Number(id), status.toUpperCase() as any)
    const list = await ErpStore.refreshWorkOrders()
    const mapped: WorkOrder | undefined = list
      .map<WorkOrder>((w) => ({
        id: String(w.id),
        number: w.number,
        productSku: '',
        quantity: w.quantity,
        status: w.status.toLowerCase() as WorkOrder['status'],
      }))
      .find((w) => w.id === String(updated.id))
    if (mapped) {
      ;(window as any).__erp_cache_workorders = list.map((w) =>
        String(w.id) === mapped.id ? { ...mapped } : { id: String(w.id), number: w.number, productSku: '', quantity: w.quantity, status: w.status.toLowerCase() as WorkOrder['status'] },
      )
      return mapped
    }
    return {
      id: String(updated.id),
      number: updated.number,
      productSku: '',
      quantity: updated.quantity,
      status: updated.status.toLowerCase() as WorkOrder['status'],
    }
  },

  async seedDemo() {
    const cps = await ErpStore.refreshCounterparties()
    if (cps.length === 0) {
      await ErpStore.addCounterparty({ type: 'customer', name: 'PT Suka Maju', email: 'cs@sukamaju.id', phone: '08123456789' })
      await ErpStore.addCounterparty({ type: 'customer', name: 'CV Gemilang', email: 'sales@gemilang.co', phone: '08129876543' })
      await ErpStore.addCounterparty({ type: 'vendor', name: 'PT Sumber Makmur', email: 'po@sumbermakmur.id', phone: '081277788899' })
    }
    const refreshed = await ErpStore.refreshCounterparties()
    const customers = refreshed.filter(c => c.type === 'customer')
    const vendors = refreshed.filter(c => c.type === 'vendor')
    const so = await ErpStore.refreshSales()
    if (so.length === 0 && customers.length) {
      await ErpStore.addSales({ number: 'SO-001', date: new Date().toISOString().slice(0,10), amount: 15000000, customerId: customers[0].id, status: 'confirmed' })
    }
    const po = await ErpStore.refreshPurchases()
    if (po.length === 0 && vendors.length) {
      await ErpStore.addPurchase({ number: 'PO-001', date: new Date().toISOString().slice(0,10), amount: 9500000, vendorId: vendors[0].id, status: 'confirmed' })
    }
    const tasks = await ErpStore.refreshTasks()
    if (tasks.length === 0) {
      await ErpStore.addTask({ title: 'Follow up customer', status: 'open' })
    }
    await ErpStore.refreshWorkOrders()
  }
}
