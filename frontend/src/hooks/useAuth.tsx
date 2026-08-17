import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api, getStoredToken, setStoredToken } from '../services/api'
import type { User } from '../types'

type AuthContextValue = {
  token: string | null
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken())
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    setStoredToken(null)
    setToken(null)
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    const stored = getStoredToken()
    if (!stored) {
      setUser(null)
      setToken(null)
      return
    }
    try {
      const me = await api.me()
      setUser(me)
      setToken(stored)
    } catch {
      logout()
    }
  }, [logout])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      if (getStoredToken()) {
        try {
          const me = await api.me()
          if (!cancelled) {
            setUser(me)
            setToken(getStoredToken())
          }
        } catch {
          if (!cancelled) logout()
        }
      }
      if (!cancelled) setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [logout])

  const login = useCallback(async (email: string, password: string) => {
    const result = await api.login(email, password)
    setStoredToken(result.access_token)
    setToken(result.access_token)
    setUser(result.user)
  }, [])

  const register = useCallback(async (email: string, password: string) => {
    const result = await api.register(email, password)
    setStoredToken(result.access_token)
    setToken(result.access_token)
    setUser(result.user)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      refreshUser,
    }),
    [token, user, loading, login, register, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth doit être utilisé dans AuthProvider')
  }
  return ctx
}
