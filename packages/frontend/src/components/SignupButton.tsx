import { useState } from 'react'

const SignupButton = () => {
  const [isHovered, setIsHovered] = useState(false)

  const handleSignup = () => {
    // TODO: Implement signup functionality
    console.log('Signup clicked - TODO: implement signup modal/flow')
  }

  return (
    <button
      onClick={handleSignup}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/50"
    >
      {/* Button glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
      
      {/* Button content */}
      <div className="relative flex items-center justify-center space-x-2">
        <span>Start Tracking for Free</span>
        <svg 
          className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
    </button>
  )
}

export default SignupButton