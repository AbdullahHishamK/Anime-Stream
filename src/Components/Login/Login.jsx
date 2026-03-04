import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { loginUser } from '../../utils/auth'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get success message from signup redirect
  const successMessage = location.state?.message || ''
  
  // Show success toast if redirected from signup
  React.useEffect(() => {
    if (successMessage) {
      toast.success(successMessage)
    }
  }, [successMessage])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm()

  const [showPassword, setShowPassword] = React.useState(false)

  const onSubmit = async (data) => {
    try {
      const result = loginUser(data.emailOrUsername.trim(), data.password)
      
      if (result.success) {
        toast.success('Login successful! Welcome back.')
        navigate('/')
      } else {
        toast.error(result.message)
        setError('root', { message: result.message })
      }
    } catch {
      toast.error('An unexpected error occurred')
      setError('root', { message: 'An unexpected error occurred' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Back to Home */}
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Login to your Anime Stream account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email or Username */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Email or Username</label>
              <input
                type="text"
                {...register('emailOrUsername', {
                  required: 'Email or username is required',
                  minLength: {
                    value: 3,
                    message: 'Must be at least 3 characters',
                  },
                })}
                className={`w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 ${
                  errors.emailOrUsername ? 'focus:ring-red-500' : 'focus:ring-blue-900'
                }`}
                placeholder="Enter your email or username"
              />
              {errors.emailOrUsername && (
                <p className="text-red-500 text-sm mt-1">{errors.emailOrUsername.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 4,
                      message: 'Password must be at least 4 characters',
                    },
                  })}
                  className={`w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 pr-12 ${
                    errors.password ? 'focus:ring-red-500' : 'focus:ring-blue-900'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Error Message */}
            {errors.root && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
                {errors.root.message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-center text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:text-blue-400 font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
