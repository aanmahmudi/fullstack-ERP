import { getAuthToken } from './authToken'
import { fetchJson } from './http'

export type UserDto = {
  id: number
  firstName: string
  lastName: string
  email: string
  username: string
  phoneNumber: string
}

export type AuthResponse = {
  token: string
  user: UserDto
}

export type ForgotPasswordResponse = {
  message: string
  resetToken: string | null
}

export async function register(payload: {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  phoneNumber: string
}): Promise<AuthResponse> {
  return fetchJson<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function login(payload: {
  identifier: string
  password: string
}): Promise<AuthResponse> {
  return fetchJson<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function forgotPassword(payload: {
  identifier: string
}): Promise<ForgotPasswordResponse> {
  return fetchJson<ForgotPasswordResponse>('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function resetPassword(payload: {
  token: string
  newPassword: string
}): Promise<void> {
  return fetchJson<void>('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function me(): Promise<UserDto> {
  const token = getAuthToken()
  return fetchJson<UserDto>('/api/auth/me', {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

// Inventory DTOs
export type CategoryDTO = {
  id: number
  name: string
  description?: string
  parentId?: number | null
}

export type WarehouseDTO = {
  id: number
  name: string
  location?: string
}

export type ProductDTO = {
  id: number
  sku: string
  name: string
  description?: string
  categoryId?: number | null
  unitPrice?: number
  costPrice?: number
  uom?: string
  reorderLevel?: number
}

// Inventory APIs
export async function listCategories(): Promise<CategoryDTO[]> {
  return fetchJson<CategoryDTO[]>('/api/inventory/categories', { method: 'GET' })
}

export async function listWarehouses(): Promise<WarehouseDTO[]> {
  return fetchJson<WarehouseDTO[]>('/api/inventory/warehouses', { method: 'GET' })
}

export async function listProducts(): Promise<ProductDTO[]> {
  return fetchJson<ProductDTO[]>('/api/inventory/products', { method: 'GET' })
}

export async function createCategory(payload: {
  name: string
  description?: string
  parentId?: number | null
}): Promise<CategoryDTO> {
  return fetchJson<CategoryDTO>('/api/inventory/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function createWarehouse(payload: {
  name: string
  location?: string
}): Promise<WarehouseDTO> {
  return fetchJson<WarehouseDTO>('/api/inventory/warehouses', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function createProduct(payload: {
  sku: string
  name: string
  description?: string
  categoryId?: number | null
  unitPrice?: number
  costPrice?: number
  uom?: string
  reorderLevel?: number
}): Promise<ProductDTO> {
  return fetchJson<ProductDTO>('/api/inventory/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export type CounterpartyERP = {
  id: number
  type: 'CUSTOMER' | 'VENDOR'
  name: string
  email?: string
  phone?: string
}

export type SalesOrderERP = {
  id: number
  number: string
  date: string
  customerId: number
  amount: number
  status: 'DRAFT' | 'CONFIRMED' | 'DELIVERED' | 'INVOICED'
}

export type PurchaseOrderERP = {
  id: number
  number: string
  date: string
  vendorId: number
  amount: number
  status: 'DRAFT' | 'CONFIRMED' | 'RECEIVED' | 'BILLED'
}

export type TaskItemERP = {
  id: number
  title: string
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE'
}

export type WorkOrderERP = {
  id: number
  number: string
  productId: number
  quantity: number
  status: 'PLANNED' | 'IN_PROGRESS' | 'DONE'
}

export async function listCounterpartiesERP(): Promise<CounterpartyERP[]> {
  return fetchJson<CounterpartyERP[]>('/api/erp/counterparties', { method: 'GET' })
}

export async function createCounterpartyERP(payload: {
  type: 'CUSTOMER' | 'VENDOR'
  name: string
  email?: string
  phone?: string
}): Promise<CounterpartyERP> {
  return fetchJson<CounterpartyERP>('/api/erp/counterparties', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function listSalesOrdersERP(): Promise<SalesOrderERP[]> {
  return fetchJson<SalesOrderERP[]>('/api/erp/sales-orders', { method: 'GET' })
}

export async function createSalesOrderERP(payload: {
  number: string
  date?: string
  customerId: number
  amount?: number
  status?: 'DRAFT' | 'CONFIRMED' | 'DELIVERED' | 'INVOICED'
}): Promise<SalesOrderERP> {
  return fetchJson<SalesOrderERP>('/api/erp/sales-orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateSalesOrderStatusERP(id: number, status: SalesOrderERP['status']): Promise<SalesOrderERP> {
  return fetchJson<SalesOrderERP>(`/api/erp/sales-orders/${id}/status?status=${status}`, { method: 'PATCH' })
}

export async function listPurchaseOrdersERP(): Promise<PurchaseOrderERP[]> {
  return fetchJson<PurchaseOrderERP[]>('/api/erp/purchase-orders', { method: 'GET' })
}

export async function createPurchaseOrderERP(payload: {
  number: string
  date?: string
  vendorId: number
  amount?: number
  status?: 'DRAFT' | 'CONFIRMED' | 'RECEIVED' | 'BILLED'
}): Promise<PurchaseOrderERP> {
  return fetchJson<PurchaseOrderERP>('/api/erp/purchase-orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updatePurchaseOrderStatusERP(id: number, status: PurchaseOrderERP['status']): Promise<PurchaseOrderERP> {
  return fetchJson<PurchaseOrderERP>(`/api/erp/purchase-orders/${id}/status?status=${status}`, { method: 'PATCH' })
}

export async function listTasksERP(): Promise<TaskItemERP[]> {
  return fetchJson<TaskItemERP[]>('/api/erp/tasks', { method: 'GET' })
}

export async function createTaskERP(payload: { title: string; status?: TaskItemERP['status'] }): Promise<TaskItemERP> {
  return fetchJson<TaskItemERP>('/api/erp/tasks', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateTaskStatusERP(id: number, status: TaskItemERP['status']): Promise<TaskItemERP> {
  return fetchJson<TaskItemERP>(`/api/erp/tasks/${id}/status?status=${status}`, { method: 'PATCH' })
}

export async function listWorkOrdersERP(): Promise<WorkOrderERP[]> {
  return fetchJson<WorkOrderERP[]>('/api/erp/work-orders', { method: 'GET' })
}

export async function createWorkOrderERP(payload: {
  number: string
  productId: number
  quantity: number
  status?: WorkOrderERP['status']
}): Promise<WorkOrderERP> {
  return fetchJson<WorkOrderERP>('/api/erp/work-orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateWorkOrderStatusERP(id: number, status: WorkOrderERP['status']): Promise<WorkOrderERP> {
  return fetchJson<WorkOrderERP>(`/api/erp/work-orders/${id}/status?status=${status}`, { method: 'PATCH' })
}
