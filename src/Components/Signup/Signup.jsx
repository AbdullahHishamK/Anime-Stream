import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Check, X, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { saveUser, validatePassword } from '../../utils/auth'

const Signup = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
  } = useForm()

  const password = watch('password', '')
  const passwordValidation = validatePassword(password)

  const onSubmit = async (data) => {
    try {
      // Check password validation
      if (!passwordValidation.every(rule => rule.valid)) {
        toast.error('Please meet all password requirements')
        return
      }

      // Create user object
      const user = {
        username: data.username.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        fullName: data.fullName.trim(),
        dateOfBirth: data.dateOfBirth,
        bio: data.bio.trim(),
        avatar: ''
      }

      const result = saveUser(user)

      if (result.success) {
        toast.success('Account created successfully!')
        navigate('/login', { state: { message: 'Account created successfully! Please login.' } })
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
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400">Join Anime Stream today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Username *</label>
              <input
                type="text"
                {...register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters',
                  },
                })}
                className={`w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 ${
                  errors.username ? 'focus:ring-red-500' : 'focus:ring-blue-900'
                }`}
                placeholder="Choose a username"
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Full Name *</label>
              <input
                type="text"
                {...register('fullName', {
                  required: 'Full name is required',
                })}
                className={`w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 ${
                  errors.fullName ? 'focus:ring-red-500' : 'focus:ring-blue-900'
                }`}
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email',
                  },
                })}
                className={`w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 ${
                  errors.email ? 'focus:ring-red-500' : 'focus:ring-blue-900'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Date of Birth</label>
              <input
                type="date"
                {...register('dateOfBirth')}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className={`w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 pr-12 ${
                    errors.password ? 'focus:ring-red-500' : 'focus:ring-blue-900'
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Rules */}
              <div className="mt-3 space-y-1">
                {passwordValidation.map((rule, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {rule.valid ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <X className="w-4 h-4 text-gray-500" />
                    )}
                    <span className={`text-xs ${rule.valid ? 'text-green-500' : 'text-gray-500'}`}>
                      {rule.message}
                    </span>
                  </div>
                ))}
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                  className={`w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 pr-12 ${
                    errors.confirmPassword ? 'focus:ring-red-500' : 'focus:ring-blue-900'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Bio (Optional)</label>
              <textarea
                {...register('bio')}
                rows={3}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Submit Error */}
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
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
