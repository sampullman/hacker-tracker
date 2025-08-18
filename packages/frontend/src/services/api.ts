import type { AuthResponse, CreateUserRequest, LoginRequest, ApiResponse, User, ApiError, EmailConfirmationRequest } from 'shared-types'

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Base fetch wrapper with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // Add authorization token if available
  const token = localStorage.getItem('auth_token')
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw {
        message: errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        code: errorData.code || 'API_ERROR',
      } as ApiError
    }

    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw {
        message: 'Network error: Unable to connect to server',
        status: 0,
        code: 'NETWORK_ERROR',
      } as ApiError
    }
    throw error
  }
}

// Auth API methods
export const authApi = {
  /**
   * Sign up a new user
   */
  async signup(userData: { email: string; password: string; username?: string }): Promise<{ success: boolean; user?: User; token?: string; message?: string; requiresEmailConfirmation?: boolean }> {
    try {
      const requestData: CreateUserRequest = {
        email: userData.email,
        username: userData.username || userData.email.split('@')[0],
        password: userData.password
      }
      
      const response = await apiRequest<ApiResponse<AuthResponse>>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(requestData),
      })

      if (response.data) {
        return {
          success: true,
          user: response.data.user,
          token: response.data.token,
          requiresEmailConfirmation: response.data.requiresEmailConfirmation
        }
      } else {
        return {
          success: false,
          message: response.error || 'Registration failed'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Registration failed'
      }
    }
  },

  /**
   * Sign in an existing user
   */
  async signin(credentials: LoginRequest): Promise<{ success: boolean; user?: User; token?: string; message?: string; requiresEmailConfirmation?: boolean }> {
    try {
      const response = await apiRequest<ApiResponse<AuthResponse>>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      })

      if (response.data) {
        return {
          success: true,
          user: response.data.user,
          token: response.data.token,
          requiresEmailConfirmation: response.data.requiresEmailConfirmation
        }
      } else {
        return {
          success: false,
          message: response.error || 'Login failed'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Login failed'
      }
    }
  },

  /**
   * Sign out the current user
   */
  async signout(): Promise<{ success: boolean }> {
    await apiRequest<ApiResponse>('/auth/logout', {
      method: 'POST',
    })
    
    // Clear local token on successful signout
    localStorage.removeItem('auth_token')
    return { success: true }
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await apiRequest<ApiResponse<User>>('/auth/me')
    if (response.data) {
      return response.data
    }
    throw new Error('Failed to get user profile')
  },

  /**
   * Confirm email address with code
   */
  async confirmEmail(data: EmailConfirmationRequest): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiRequest<ApiResponse<{ success: boolean }>>('/auth/confirm-email', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      if (response.data) {
        return {
          success: true
        }
      } else {
        return {
          success: false,
          message: response.error || 'Confirmation failed'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Confirmation failed'
      }
    }
  },

  /**
   * Resend email confirmation code
   */
  async resendConfirmation(): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiRequest<ApiResponse<{ success: boolean }>>('/auth/resend-confirmation', {
        method: 'POST',
      })

      if (response.data) {
        return {
          success: true
        }
      } else {
        return {
          success: false,
          message: response.error || 'Failed to resend confirmation'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to resend confirmation'
      }
    }
  },
}

// Utility functions for token management
export const tokenUtils = {
  /**
   * Store authentication token
   */
  setToken(token: string): void {
    localStorage.setItem('auth_token', token)
  },

  /**
   * Get stored authentication token
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token')
  },

  /**
   * Remove authentication token
   */
  removeToken(): void {
    localStorage.removeItem('auth_token')
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}

// Export default api object with all methods
const api = {
  auth: authApi,
  token: tokenUtils,
}

export default api