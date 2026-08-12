import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext(null)

const storageKey = "todo_auth_token"

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(storageKey) || null)

  useEffect(() => {
    if (token) {
      localStorage.setItem(storageKey, token)
    } else {
      localStorage.removeItem(storageKey)
    }
  }, [token])

  const login = (newToken) => setToken(newToken)
  const logout = () => setToken(null)

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
