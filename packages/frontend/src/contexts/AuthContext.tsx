/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import type { User } from 'shared-types'

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  signup: (email: string, password: string, username?: string) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const checkAuth = async () => {
    try {
      const token = api.token.getToken()
      if (!token) {
        setIsLoading(false)
        return
      }

      const profile = await api.auth.getProfile()
      setUser(profile)
    } catch (error) {
      console.error('Auth check failed:', error)
      api.token.removeToken()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await api.auth.signin({ email, password })
    
    if (response.success && response.token && response.user) {
      api.token.setToken(response.token)
      setUser(response.user)
      navigate('/track')
      return { success: true }
    }
    
    return { 
      success: false, 
      message: response.message || 'Login failed' 
    }
  }

  const signup = async (email: string, password: string, username?: string) => {
    const response = await api.auth.signup({ email, password, username })
    
    if (response.success && response.token && response.user) {
      api.token.setToken(response.token)
      setUser(response.user)
      navigate('/track')
      return { success: true }
    }
    
    return { 
      success: false, 
      message: response.message || 'Signup failed' 
    }
  }

  const logout = async () => {
    try {
      await api.auth.signout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      api.token.removeToken()
      setUser(null)
      navigate('/')
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    checkAuth
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}