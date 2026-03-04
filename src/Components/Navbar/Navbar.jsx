import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Tv, Bell, Search, User, X } from 'lucide-react'
import { getCurrentUser, logoutUser, isAuthenticated } from '../../utils/auth'

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const searchRef = useRef(null)
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
    <nav className="bg-black px-6 py-4 flex items-center justify-between relative z-50 shadow-lg">
      {/* Logo Section */}
      <Link to="/" className="flex items-center gap-3">
        <Tv className="w-8 h-8 text-blue-900" />
        <div className="flex items-center">
          <span className="text-white text-xl font-bold">Anime</span>
          <span className="text-blue-900 text-xl font-bold">Stream</span>
        </div>
      </Link>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-8">
        {navTabs.map((tab) => (
          <Link 
            key={tab.path}
            to={tab.path} 
            className={`transition-colors ${
              isActive(tab.path) 
                ? 'text-blue-500 font-semibold' 
                : 'text-white hover:text-blue-400'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Search, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Search Bar with Dropdown */}
        <div className="relative" ref={searchRef}>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search anime..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
              className="bg-gray-800 text-white px-4 py-2 rounded-full w-64 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-900"
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
            <div className="absolute top-full mt-2 left-0 w-80 bg-gray-800 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50">
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
                        className="w-12 h-16 object-cover rounded"
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
          <Bell className="w-6 h-6" />
        </Link>

        {/* Login/Signup Buttons or Profile Circle */}
        {isLoggedIn ? (
          <Link to="/profile" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-blue-900 hover:border-blue-500 transition-colors">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link 
              to="/login" 
              className="text-white hover:text-blue-400 transition-colors font-medium"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="bg-blue-900 text-white px-4 py-2 rounded-full hover:bg-blue-800 transition-colors font-medium"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
