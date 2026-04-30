"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { getMeApi } from "@/lib/api"

interface User {
  _id: string
  name: string
  email: string
  language: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("tripsathi_token")
    if (storedToken) {
      setToken(storedToken)
      getMeApi(storedToken)
        .then((data) => setUser(data))
        .catch(() => {
          localStorage.removeItem("tripsathi_token")
          localStorage.removeItem("tripsathi_user")
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = (newToken: string, newUser: User) => {
    setToken(newToken)
    setUser(newUser)
    localStorage.setItem("tripsathi_token", newToken)
    localStorage.setItem("tripsathi_user", JSON.stringify(newUser))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("tripsathi_token")
    localStorage.removeItem("tripsathi_user")
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
