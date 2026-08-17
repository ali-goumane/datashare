import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../services/api'
import { TOKEN_KEY } from '../constants'
import type { User } from '../types'

type AuthContextValue = { token: string | null; user: User | null; loading: boolean; login: (email: string, password: string) => Promise<void>; register: (email: string, password: string) => Promise<void>; logout: () => void }
const AuthContext = createContext<AuthContextValue | null>(null)
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY)); const [user, setUser] = useState<User | null>(null); const [loading, setLoading] = useState(true)
  useEffect(() => { if (!token) { setLoading(false); return } api.me().then(setUser).catch(() => { localStorage.removeItem(TOKEN_KEY); setToken(null) }).finally(() => setLoading(false)) }, [token])
  async function authenticate(action: Promise<{ access_token: string; user: User }>) { const result = await action; localStorage.setItem(TOKEN_KEY, result.access_token); setToken(result.access_token); setUser(result.user) }
  async function login(email: string, password: string) { await authenticate(api.login(email, password)) }
  async function register(email: string, password: string) { await authenticate(api.register(email, password)) }
  function logout() { localStorage.removeItem(TOKEN_KEY); setToken(null); setUser(null) }
  return <AuthContext.Provider value={{ token, user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider'); return context }
