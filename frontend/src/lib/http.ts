export type ApiErrorBody = {
  message?: string
  timestamp?: string
  fieldErrors?: Record<string, string> | null
}

export class HttpError extends Error {
  status: number
  body?: ApiErrorBody

  constructor(status: number, message: string, body?: ApiErrorBody) {
    super(message)
    this.status = status
    this.body = body
  }
}

export async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (res.status === 204) {
    return undefined as T
  }

  const contentType = res.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')

  if (!res.ok) {
    let body: ApiErrorBody | undefined
    if (isJson) {
      try {
        body = (await res.json()) as ApiErrorBody
      } catch {
        body = undefined
      }
    }
    const message = body?.message || `HTTP ${res.status}`
    throw new HttpError(res.status, message, body)
  }

  if (!isJson) {
    return (await res.text()) as T
  }
  return (await res.json()) as T
}

