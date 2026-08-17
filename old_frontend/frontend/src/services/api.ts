import type { AuthResponse, FileInfo, User } from '../types'
import { TOKEN_KEY } from '../constants'

const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')
function headers(): Record<string, string> { const token = localStorage.getItem(TOKEN_KEY); return token ? { Authorization: `Bearer ${token}` } : {} }
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const requestHeaders: HeadersInit = { ...headers(), ...(options.headers || {}) }
  const response = await fetch(`${API_URL}${path}`, { ...options, headers: requestHeaders })
  if (!response.ok) { const body = await response.json().catch(() => null); throw new Error(body?.message || 'Une erreur est survenue') }
  return response.json() as Promise<T>
}
export const api = {
  login: (email: string, password: string) => request<AuthResponse>('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }),
  register: (email: string, password: string) => request<AuthResponse>('/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }),
  me: () => request<User>('/auth/me'),
  upload: (data: FormData) => request<FileInfo>('/files/upload', { method: 'POST', body: data }),
  history: () => request<FileInfo[]>('/files'),
  metadata: (token: string) => request<FileInfo>(`/files/token/${token}`),
  download: async (token: string, password?: string) => { const requestHeaders: HeadersInit = { ...headers(), 'Content-Type': 'application/json' }; const response = await fetch(`${API_URL}/files/token/${token}/download`, { method: 'POST', headers: requestHeaders, body: JSON.stringify({ password }) }); if (!response.ok) { const body = await response.json().catch(() => null); throw new Error(body?.message || 'Téléchargement impossible') } return response.blob() },
  remove: (id: number) => request<{ message: string }>(`/files/${id}`, { method: 'DELETE' }),
}
