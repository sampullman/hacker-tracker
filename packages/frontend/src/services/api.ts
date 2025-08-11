// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Types
export interface AuthRequest {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user?: {
    id: string
    email: string
    name?: string
  }
  token?: string
  message?: string
}

export interface ApiError {
  message: string
  status?: number
  code?: string
}

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
        message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        code: errorData.code,
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
  async signup(credentials: AuthRequest): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },

  /**
   * Sign in an existing user
   */
  async signin(credentials: AuthRequest): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },

  /**
   * Sign out the current user
   */
  async signout(): Promise<{ success: boolean }> {
    const result = await apiRequest<{ success: boolean }>('/auth/signout', {
      method: 'POST',
    })
    
    // Clear local token on successful signout
    localStorage.removeItem('auth_token')
    return result
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<AuthResponse['user']> {
    return apiRequest<AuthResponse['user']>('/auth/profile')
  },

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/refresh', {
      method: 'POST',
    })
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