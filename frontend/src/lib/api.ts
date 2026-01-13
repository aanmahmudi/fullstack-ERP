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

