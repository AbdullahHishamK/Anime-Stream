import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Tv, Bell, Search, User, X, Menu } from 'lucide-react'
import { getCurrentUser, logoutUser, isAuthenticated } from '../../utils/auth'

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const searchRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Check auth status on mount and when location changes
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      setIsLoggedIn(authenticated)
      if (authenticated) {
        setUser(getCurrentUser())
      }
    }
    checkAuth()
  }, [location])

  // Check if a path is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  // Debounced search
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setLoading(true)
        try {
          const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchQuery)}&limit=8&order_by=popularity&sort=desc`)
          const data = await response.json()
          
          if (data.data && data.data.length > 0) {
            setSearchResults(data.data)
            setShowResults(true)
          } else {
            setSearchResults([])
            setShowResults(false)
          }
        } catch (error) {
          console.error('Search error:', error)
          setSearchResults([])
        }
        setLoading(false)
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }, 500)

    return () => clearTimeout(delayDebounce)
  }, [searchQuery])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectAnime = (anime) => {
    setSearchQuery('')
    setSearchResults([])
    setShowResults(false)
    navigate(`/anime/${anime.mal_id}`)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setShowResults(false)
  }

  const handleLogout = () => {
    logoutUser()
    setIsLoggedIn(false)
    setUser(null)
    navigate('/')
  }

  const getImageUrl = (item) => {
    if (item.images?.jpg?.small_image_url) return item.images.jpg.small_image_url
    return 'https://placehold.co/50x75/1e3a8a/ffffff?text=A'
  }

  // Navigation tabs with active state styling
  const navTabs = [
    { path: '/browse', label: 'Browse' },
    { path: '/new-season', label: 'New Season' },
    { path: '/trending', label: 'Trending' },
    { path: '/genres', label: 'Genres' }
  ]

  return (
    <nav className="bg-black px-4 md:px-6 py-4 flex items-center justify-between relative z-50 shadow-lg">
      {/* Logo Section */}
      <Link to="/" className="flex items-center gap-3">
        <Tv className="w-7 h-7 md:w-8 md:h-8 text-blue-900" />
        <div className="flex items-center">
          <span className="text-white text-lg md:text-xl font-bold">Anime</span>
          <span className="text-blue-900 text-lg md:text-xl font-bold">Stream</span>
        </div>
      </Link>

      {/* Mobile Menu Button - Visible on mobile only */}
      <button 
        className="md:hidden text-white hover:text-blue-400 p-2"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Desktop Navigation Tabs - Hidden on mobile */}
      <div className="hidden md:flex items-center gap-6 lg:gap-8">
        {navTabs.map((tab) => (
          <Link 
            key={tab.path}
            to={tab.path} 
            className={`transition-colors text-sm lg:text-base ${
              isActive(tab.path) 
                ? 'text-blue-500 font-semibold' 
                : 'text-white hover:text-blue-400'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Desktop Search, Notifications, Profile - Hidden on mobile */}
      <div className="hidden md:flex items-center gap-4">
        {/* Search Bar with Dropdown */}
        <div className="relative" ref={searchRef}>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search anime..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
              className="bg-gray-800 text-white px-4 py-2 rounded-full w-48 lg:w-64 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            {searchQuery && (
              <button 
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full mt-2 left-0 w-72 lg:w-80 bg-gray-800 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50">
              {loading ? (
                <div className="p-4 text-gray-400 text-center">Searching...</div>
              ) : searchResults.length > 0 ? (
                <div className="max-h-96 overflow-y-auto">
                  {searchResults.map((anime) => (
                    <button
                      key={anime.mal_id}
                      onClick={() => handleSelectAnime(anime)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors text-left"
                    >
                      <img 
                        src={getImageUrl(anime)} 
                        alt={anime.title_english || anime.title}
                        className="w-10 h-14 lg:w-12 lg:h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {anime.title_english || anime.title}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {anime.year || 'Unknown'} • {anime.score || 'N/A'} ★
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-gray-400 text-center">No results found</div>
              )}
            </div>
          )}
        </div>

        {/* Bell Icon - Links to Notifications */}
        <Link to="/notifications" className="text-white hover:text-blue-400 transition-colors">
          <Bell className="w-5 h-5 lg:w-6 lg:h-6" />
        </Link>

        {/* Login/Signup Buttons or Profile Circle */}
        {isLoggedIn ? (
          <Link to="/profile" className="flex items-center gap-2">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-blue-900 hover:border-blue-500 transition-colors">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              )}
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-2 lg:gap-3">
            <Link 
              to="/login" 
              className="text-white hover:text-blue-400 transition-colors font-medium text-sm"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="bg-blue-900 text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-full hover:bg-blue-800 transition-colors font-medium text-sm"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="absolute top-full left-0 right-0 bg-gray-900 shadow-xl py-4 md:hidden z-50"
        >
          {/* Mobile Search */}
          <div className="px-4 mb-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search anime..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                className="bg-gray-800 text-white px-4 py-2 rounded-full w-full pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              {searchQuery && (
                <button 
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex flex-col">
            {navTabs.map((tab) => (
              <Link 
                key={tab.path}
                to={tab.path} 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-6 py-3 transition-colors ${
                  isActive(tab.path) 
                    ? 'text-blue-500 font-semibold bg-gray-800' 
                    : 'text-white hover:text-blue-400 hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {/* Mobile Divider */}
          <div className="border-t border-gray-700 my-2"></div>

          {/* Mobile Notifications Link */}
          <Link 
            to="/notifications"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-6 py-3 text-white hover:text-blue-400 hover:bg-gray-800 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </Link>

          {/* Mobile Auth Links */}
          {isLoggedIn ? (
            <>
              <Link 
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-6 py-3 text-white hover:text-blue-400 hover:bg-gray-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-blue-900">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <span>Profile</span>
              </Link>
              <button 
                onClick={() => {
                  handleLogout()
                  setMobileMenuOpen(false)
                }}
                className="flex items-center gap-3 px-6 py-3 text-white hover:text-blue-400 hover:bg-gray-800 transition-colors w-full text-left"
              >
                <X className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 px-6 py-3">
              <Link 
                to="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:text-blue-400 transition-colors font-medium py-2"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                onClick={() => setMobileMenuOpen(false)}
                className="bg-blue-900 text-white px-4 py-2 rounded-full hover:bg-blue-800 transition-colors font-medium text-center"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
