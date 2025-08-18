import { useState, useEffect } from 'react'
import Modal from './Modal'
import { useAuth } from '../hooks/useAuth'

type AuthMode = 'signup' | 'login' | 'confirm'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: AuthMode
  userId?: string
}

interface FormData {
  email: string
  username?: string
  password: string
  confirmPassword?: string
  confirmationCode?: string
}

const AuthModal = ({ isOpen, onClose, initialMode = 'signup', userId }: AuthModalProps) => {
  const { login, signup, confirmEmail, resendConfirmation, user } = useAuth()
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    confirmationCode: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirmationUserId, setConfirmationUserId] = useState<string>(userId || '')
  const [successMessage, setSuccessMessage] = useState('')

  // Update mode when initialMode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
      if (userId) {
        setConfirmationUserId(userId)
      }
    }
  }, [initialMode, isOpen, userId])

  // Auto-show confirmation if user is not confirmed
  useEffect(() => {
    if (isOpen && user && !user.emailConfirmed) {
      setMode('confirm')
      setConfirmationUserId(user.id)
    }
  }, [isOpen, user])

  // Reset form when modal closes or mode changes
  const resetForm = () => {
    setFormData({ email: '', username: '', password: '', confirmPassword: '', confirmationCode: '' })
    setErrors({})
    setIsLoading(false)
    setSuccessMessage('')
  }

  const handleModeToggle = () => {
    if (mode === 'confirm') return // Can't toggle away from confirm mode
    setMode(mode === 'signup' ? 'login' : 'signup')
    resetForm()
  }

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (mode === 'confirm') {
      if (!formData.confirmationCode) {
        newErrors.confirmationCode = 'Confirmation code is required'
      } else if (formData.confirmationCode.length !== 6) {
        newErrors.confirmationCode = 'Code must be 6 digits'
      }
    } else {
      if (!formData.email) {
        newErrors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }

      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long'
      }

      if (mode === 'signup') {
        if (!formData.username) {
          newErrors.username = 'Username is required'
        } else if (formData.username.length < 3) {
          newErrors.username = 'Username must be at least 3 characters long'
        }

        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password'
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      if (mode === 'confirm') {
        const response = await confirmEmail(confirmationUserId, formData.confirmationCode!)
        if (response.success) {
          onClose()
          resetForm()
        } else {
          setErrors({ general: response.message || 'Invalid or expired code' })
        }
      } else {
        const response = mode === 'signup' 
          ? await signup(formData.email, formData.username!, formData.password)
          : await login(formData.email, formData.password)

        if (response.success) {
          if (response.requiresEmailConfirmation) {
            // Switch to confirmation mode
            setMode('confirm')
            setConfirmationUserId(response.userId || '')
            setFormData(prev => ({ ...prev, confirmationCode: '' }))
            setErrors({})
          } else {
            onClose()
            resetForm()
          }
        } else {
          setErrors({ general: response.message || `${mode} failed. Please try again.` })
        }
      }
    } catch (error) {
      console.error(`${mode} error:`, error)
      setErrors({ 
        general: `${mode === 'confirm' ? 'Confirmation' : mode} failed. Please try again.` 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    try {
      const response = await resendConfirmation()
      if (response.success) {
        setSuccessMessage('A new confirmation code has been sent to your email')
        setTimeout(() => setSuccessMessage(''), 5000)
      } else {
        setErrors({ general: response.message || 'Failed to resend code' })
      }
    } catch (error) {
      setErrors({ general: 'Failed to resend code. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    // Don't allow closing if email confirmation is required
    if (mode === 'confirm' && user && !user.emailConfirmed) {
      return
    }
    resetForm()
    onClose()
  }

  const inputClass = "w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
  const labelClass = "block text-sm font-medium text-gray-300 mb-2"
  const errorClass = "text-red-400 text-sm mt-1"

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              {mode === 'confirm' ? (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {mode === 'confirm' ? 'Confirm Your Email' : mode === 'signup' ? 'Join Hacker Tracker' : 'Welcome Back'}
          </h2>
          <p className="text-gray-300">
            {mode === 'confirm' 
              ? 'Enter the 6-digit code sent to your email' 
              : mode === 'signup' 
              ? 'Start tracking your keywords for free' 
              : 'Sign in to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

          {mode === 'confirm' ? (
            <div>
              <label htmlFor="confirmationCode" className={labelClass}>Confirmation Code</label>
              <input
                type="text"
                id="confirmationCode"
                value={formData.confirmationCode || ''}
                onChange={handleInputChange('confirmationCode')}
                className={inputClass}
                placeholder="Enter 6-digit code"
                maxLength={6}
                pattern="[0-9]{6}"
                disabled={isLoading}
                autoComplete="off"
              />
              {errors.confirmationCode && <p className={errorClass}>{errors.confirmationCode}</p>}
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="email" className={labelClass}>Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  className={inputClass}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
                {errors.email && <p className={errorClass}>{errors.email}</p>}
              </div>

              {mode === 'signup' && (
                <div>
                  <label htmlFor="username" className={labelClass}>Username</label>
                  <input
                    type="text"
                    id="username"
                    value={formData.username || ''}
                    onChange={handleInputChange('username')}
                    className={inputClass}
                    placeholder="Choose a username"
                    disabled={isLoading}
                  />
                  {errors.username && <p className={errorClass}>{errors.username}</p>}
                </div>
              )}

              <div>
                <label htmlFor="password" className={labelClass}>Password</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  className={inputClass}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                {errors.password && <p className={errorClass}>{errors.password}</p>}
              </div>

              {mode === 'signup' && (
                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword || ''}
                    onChange={handleInputChange('confirmPassword')}
                    className={inputClass}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword}</p>}
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-500/50 disabled:to-orange-600/50 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-500/50 disabled:transform-none disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {mode === 'confirm' ? 'Confirming...' : mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
              </div>
            ) : (
              mode === 'confirm' ? 'Confirm Email' : mode === 'signup' ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          {mode === 'confirm' ? (
            <p className="text-gray-400 text-sm">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResendCode}
                className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
                disabled={isLoading}
              >
                Resend Code
              </button>
            </p>
          ) : (
            <p className="text-gray-400 text-sm">
              {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={handleModeToggle}
                className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
                disabled={isLoading}
              >
                {mode === 'signup' ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default AuthModal