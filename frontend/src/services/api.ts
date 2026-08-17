import type {
  ApiErrorBody,
  AuthResponse,
  FileHistoryItem,
  FileMetadata,
  UploadedFile,
  User,
} from '../types'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'
const TOKEN_KEY = 'datashare_token'

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

async function parseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as ApiErrorBody
    if (Array.isArray(body.message)) return body.message.join(', ')
    if (typeof body.message === 'string') return body.message
  } catch {
    /* ignore */
  }
  return `Erreur ${response.status}`
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false,
): Promise<T> {
  const headers = new Headers(options.headers)
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (auth) {
    const token = getStoredToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  if (response.status === 204) return undefined as T
  const contentType = response.headers.get('Content-Type') ?? ''
  if (contentType.includes('application/json')) {
    return (await response.json()) as T
  }
  return undefined as T
}

export const api = {
  register(email: string, password: string) {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  login(email: string, password: string) {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  me() {
    return request<User>('/auth/me', {}, true)
  },

  uploadFile(formData: FormData, withAuth: boolean) {
    return request<UploadedFile>(
      '/files/upload',
      { method: 'POST', body: formData },
      withAuth,
    )
  },

  listFiles() {
    return request<FileHistoryItem[]>('/files', {}, true)
  },

  getFileMetadata(token: string) {
    return request<FileMetadata>(`/files/token/${encodeURIComponent(token)}`)
  },

  async downloadFile(token: string, password?: string): Promise<Blob> {
    const headers = new Headers({ 'Content-Type': 'application/json' })
    const response = await fetch(
      `${API_BASE}/files/token/${encodeURIComponent(token)}/download`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(password ? { password } : {}),
      },
    )
    if (!response.ok) {
      throw new Error(await parseError(response))
    }
    return response.blob()
  },

  deleteFile(id: number) {
    return request<{ message: string }>(`/files/${id}`, { method: 'DELETE' }, true)
  },
}
