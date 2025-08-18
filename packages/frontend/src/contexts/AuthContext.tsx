/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import type { User } from 'shared-types'

export interface AuthResponse {
  success: boolean
  message?: string
  userId?: string
  requiresEmailConfirmation?: boolean
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<AuthResponse>
  signup: (email: string, username: string, password: string) => Promise<AuthResponse>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  confirmEmail: (userId: string, code: string) => Promise<AuthResponse>
  resendConfirmation: () => Promise<AuthResponse>
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

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.auth.signin({ email, password })
    
    if (response.success && response.token && response.user) {
      api.token.setToken(response.token)
      setUser(response.user)
      
      // Check if email confirmation is required
      if (response.requiresEmailConfirmation) {
        return { 
          success: true, 
          requiresEmailConfirmation: true,
          userId: response.user.id
        }
      }
      
      navigate('/track')
      return { success: true }
    }
    
    return { 
      success: false, 
      message: response.message || 'Login failed' 
    }
  }

  const signup = async (email: string, username: string, password: string): Promise<AuthResponse> => {
    const response = await api.auth.signup({ email, password, username })
    
    if (response.success && response.token && response.user) {
      api.token.setToken(response.token)
      setUser(response.user)
      
      // Signup always requires email confirmation
      return { 
        success: true, 
        requiresEmailConfirmation: true,
        userId: response.user.id
      }
    }
    
    return { 
      success: false, 
      message: response.message || 'Signup failed' 
    }
  }

  const confirmEmail = async (userId: string, code: string): Promise<AuthResponse> => {
    try {
      const response = await api.auth.confirmEmail({ userId, code })
      
      if (response.success) {
        // Update user's email confirmation status
        if (user && user.id === userId) {
          setUser({ ...user, emailConfirmed: true })
        }
        
        // Refresh user data
        await checkAuth()
        
        // Navigate to track page after successful confirmation
        navigate('/track')
        
        return { success: true }
      }
      
      return { 
        success: false, 
        message: response.message || 'Invalid or expired code' 
      }
    } catch (error) {
      console.error('Email confirmation error:', error)
      return { 
        success: false, 
        message: 'Failed to confirm email. Please try again.' 
      }
    }
  }

  const resendConfirmation = async (): Promise<AuthResponse> => {
    try {
      const response = await api.auth.resendConfirmation()
      
      if (response.success) {
        return { success: true }
      }
      
      return { 
        success: false, 
        message: response.message || 'Failed to resend confirmation' 
      }
    } catch (error) {
      console.error('Resend confirmation error:', error)
      return { 
        success: false, 
        message: 'Failed to resend confirmation. Please try again.' 
      }
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
    checkAuth,
    confirmEmail,
    resendConfirmation
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}