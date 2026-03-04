import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Calendar, Edit, Save, X, Camera, LogOut, Plus, Trash2 } from 'lucide-react'
import { getCurrentUser, updateUser, logoutUser, validatePassword, removeFromMyList, getMyList } from '../../utils/auth'

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => getCurrentUser())
  const [myList, setMyList] = useState(() => getMyList())
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(() => {
    const currentUser = getCurrentUser()
    return {
      username: currentUser?.username || '',
      email: currentUser?.email || '',
      fullName: currentUser?.fullName || '',
      dateOfBirth: currentUser?.dateOfBirth || '',
      bio: currentUser?.bio || '',
      avatar: currentUser?.avatar || ''
    }
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleLogout = () => {
    logoutUser()
    navigate('/')
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const validateEditForm = () => {
    const newErrors = {}
    if (!editData.username.trim()) newErrors.username = 'Username is required'
    if (!editData.email.trim()) newErrors.email = 'Email is required'
    if (!editData.fullName.trim()) newErrors.fullName = 'Full name is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePasswordChange = () => {
    const newErrors = {}
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required'
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else {
      const validation = validatePassword(passwordData.newPassword)
      if (!validation.every(r => r.valid)) {
        newErrors.newPassword = 'Password does not meet requirements'
      }
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    // Verify current password
    if (user.password !== passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is incorrect'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (showPasswordFields) {
      if (!validatePasswordChange()) return
      const updatedUser = { ...user, password: passwordData.newPassword }
      const result = updateUser(updatedUser)
      if (result.success) {
        setSuccess('Password updated successfully!')
        setShowPasswordFields(false)
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      }
    } else {
      if (!validateEditForm()) return
      const updatedUser = { ...user, ...editData }
      const result = updateUser(updatedUser)
      if (result.success) {
        setUser(result.user)
        setMyList(getMyList())
        setIsEditing(false)
        setSuccess('Profile updated successfully!')
      }
    }
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleCancel = () => {
    const currentUser = getCurrentUser()
    setIsEditing(false)
    setShowPasswordFields(false)
    setEditData({
      username: currentUser?.username || '',
      email: currentUser?.email || '',
      fullName: currentUser?.fullName || '',
      dateOfBirth: currentUser?.dateOfBirth || '',
      bio: currentUser?.bio || '',
      avatar: currentUser?.avatar || ''
    })
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setErrors({})
  }

  const handleRemoveFromList = (animeId) => {
    const result = removeFromMyList(animeId)
    if (result.success) {
      setMyList(getMyList())
      setUser(getCurrentUser())
      setSuccess('Removed from My List')
      setTimeout(() => setSuccess(''), 3000)
    }
  }

  const getImageUrl = (item) => {
    if (item?.images?.jpg?.small_image_url) return item.images.jpg.small_image_url
    if (item?.images?.jpg?.image_url) return item.images.jpg.image_url
    return 'https://placehold.co/100x150/1e3a8a/ffffff?text=A'
  }

  const passwordValidation = validatePassword(passwordData.newPassword)

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">My Profile</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-gray-800 rounded-2xl overflow-hidden mb-8">
          {/* Avatar Section */}
          <div className="relative h-48 bg-gradient-to-r from-blue-900 to-purple-900">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-700 border-4 border-gray-800 overflow-hidden flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-800 transition-colors">
                    <Camera className="w-5 h-5 text-white" />
                    <input 
                      type="text" 
                      name="avatar"
                      value={editData.avatar}
                      onChange={handleEditChange}
                      placeholder="Avatar URL"
                      className="absolute opacity-0 w-full h-full cursor-pointer"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            {/* Edit/Save Buttons */}
            <div className="flex justify-end gap-3 mb-6">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Profile Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <User className="w-4 h-4" />
                  Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={editData.username}
                    onChange={handleEditChange}
                    className={`w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 ${
                      errors.username ? 'focus:ring-red-500' : 'focus:ring-blue-900'
                    }`}
                  />
                ) : (
                  <p className="text-white text-lg">{user.username}</p>
                )}
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>

              {/* Full Name */}
              <div>
                <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={editData.fullName}
                    onChange={handleEditChange}
                    className={`w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 ${
                      errors.fullName ? 'focus:ring-red-500' : 'focus:ring-blue-900'
                    }`}
                  />
                ) : (
                  <p className="text-white text-lg">{user.fullName}</p>
                )}
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    className={`w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 ${
                      errors.email ? 'focus:ring-red-500' : 'focus:ring-blue-900'
                    }`}
                  />
                ) : (
                  <p className="text-white text-lg">{user.email}</p>
                )}
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <Calendar className="w-4 h-4" />
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={editData.dateOfBirth}
                    onChange={handleEditChange}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                ) : (
                  <p className="text-white text-lg">{user.dateOfBirth || 'Not set'}</p>
                )}
              </div>

              {/* Bio - Full Width */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <User className="w-4 h-4" />
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={editData.bio}
                    onChange={handleEditChange}
                    rows={4}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-white text-lg">{user.bio || 'No bio yet'}</p>
                )}
              </div>

              {/* Member Since - Full Width */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <Calendar className="w-4 h-4" />
                  Member Since
                </label>
                <p className="text-white text-lg">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'Unknown'}
                </p>
              </div>
            </div>

            {/* Password Change Section */}
            {isEditing && (
              <div className="mt-8 pt-6 border-t border-gray-700">
                {!showPasswordFields ? (
                  <button
                    onClick={() => setShowPasswordFields(true)}
                    className="text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    Change Password
                  </button>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold mb-4">Change Password</h3>
                    
                    {/* Current Password */}
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className={`w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 ${
                          errors.currentPassword ? 'focus:ring-red-500' : 'focus:ring-blue-900'
                        }`}
                      />
                      {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className={`w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 ${
                          errors.newPassword ? 'focus:ring-red-500' : 'focus:ring-blue-900'
                        }`}
                      />
                      {passwordData.newPassword && (
                        <div className="mt-2 space-y-1">
                          {passwordValidation.map((rule, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${rule.valid ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                              <span className={`text-xs ${rule.valid ? 'text-green-500' : 'text-gray-500'}`}>
                                {rule.message}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className={`w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 ${
                          errors.confirmPassword ? 'focus:ring-red-500' : 'focus:ring-blue-900'
                        }`}
                      />
                      {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <button
                      onClick={() => setShowPasswordFields(false)}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* My List Section */}
        <div className="bg-gray-800 rounded-2xl overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Plus className="w-6 h-6 text-blue-500" />
              My List
              <span className="text-gray-400 text-lg font-normal">({myList.length} anime)</span>
            </h2>
          </div>

          <div className="p-8">
            {myList.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {myList.map((anime) => (
                  <div key={anime.mal_id} className="relative group">
                    <Link to={`/anime/${anime.mal_id}`}>
                      <img 
                        src={getImageUrl(anime)} 
                        alt={anime.title_english || anime.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="mt-2">
                        <p className="text-white text-sm font-medium truncate">
                          {anime.title_english || anime.title}
                        </p>
                        {anime.score && (
                          <p className="text-gray-400 text-xs">★ {anime.score}</p>
                        )}
                      </div>
                    </Link>
                    <button
                      onClick={() => handleRemoveFromList(anime.mal_id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Plus className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-xl mb-2">Your list is empty</p>
                <p className="text-gray-500 text-sm">Browse anime and add them to your list</p>
                <Link 
                  to="/browse" 
                  className="inline-block mt-4 text-blue-500 hover:text-blue-400"
                >
                  Browse Anime →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
