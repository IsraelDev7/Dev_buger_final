import { createContext, useContext, useState, useCallback } from 'react'
import api from '../services/api.js'

const AuthContext = createContext(null)

const STORAGE_KEY = 'devburguer_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/sessions', { email, password })
    const userData = { ...data.user, token: data.token }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    setUser(userData)
    return userData
  }, [])

  const register = useCallback(async (name, email, password) => {
    await api.post('/users', { name, email, password })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('devburguer_cart')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin: user?.admin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
