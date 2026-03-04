import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Star, Play, Calendar, Clock, Film, Tv, Users, BookOpen, ChevronLeft, Plus, Check } from 'lucide-react'
import { addToMyList, removeFromMyList, isInMyList, getCurrentUser } from '../../utils/auth'

const Details = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [anime, setAnime] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [inMyList, setInMyList] = useState(false)
  const [listMessage, setListMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchAnimeDetails = async () => {
      try {
        // Fetch anime details from Jikan API
        const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`)
        
        if (response.status === 429) {
          // Rate limited, use fallback
          throw new Error('Rate limited')
        }
        
        const data = await response.json()
        
        if (data.data && isMounted) {
          setAnime(data.data)
          // Check if in user's list
          const isInList = isInMyList(data.data.mal_id)
          setInMyList(isInList)
        } else if (isMounted) {
          setError('Anime not found')
        }

        if (isMounted) {
          setLoading(false)
        }

      } catch {
        if (isMounted) {
          setError('Failed to load anime details')
          setLoading(false)
        }
      }
    }

    if (id) {
      fetchAnimeDetails()
    }

    return () => {
      isMounted = false
    }
  }, [id])

  const handleAddToList = () => {
    const user = getCurrentUser()
    if (!user) {
      navigate('/login')
      return
    }

    if (inMyList) {
      const result = removeFromMyList(anime.mal_id)
      if (result.success) {
        setInMyList(false)
        setListMessage('Removed from My List')
      }
    } else {
      const result = addToMyList(anime)
      if (result.success) {
        setInMyList(true)
        setListMessage('Added to My List')
      } else {
        setListMessage(result.message)
      }
    }
    
    setTimeout(() => setListMessage(''), 3000)
  }

  // Helper function to get image URL
  const getImageUrl = (item) => {
    if (item?.images?.jpg?.large_image_url) return item.images.jpg.large_image_url
    if (item?.images?.jpg?.image_url) return item.images.jpg.image_url
    return 'https://placehold.co/600x900/1e3a8a/ffffff?text=No+Image'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg">Loading anime details...</p>
        </div>
      </div>
    )
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error || 'Anime not found'}</p>
          <Link to="/" className="text-blue-400 hover:text-blue-300">Go back home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-24 left-4 md:left-8 z-20 flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      {/* Hero Section */}
      <div className="relative h-[80vh] w-full">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${getImageUrl(anime)})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex items-end h-full px-8 md:px-16 lg:px-24 pb-16">
          {/* Anime Image */}
          <div className="hidden md:block w-64 lg:w-80 flex-shrink-0 mr-8">
            <img 
              src={getImageUrl(anime)} 
              alt={anime.title_english || anime.title || 'Anime'}
              className="w-full rounded-xl shadow-2xl shadow-blue-900/50"
            />
          </div>

          {/* Anime Info */}
          <div className="flex-1">
            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {anime.title_english || anime.title || 'Unknown Title'}
            </h1>

            {/* Japanese Title */}
            {anime.title_japanese && (
              <p className="text-gray-400 text-lg mb-4">
                {anime.title_japanese}
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1 text-white bg-blue-900/50 px-3 py-1 rounded-full">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">{anime.score || 'N/A'}</span>
              </div>
              <span className="text-gray-400">
                ({anime.scored_by ? anime.scored_by.toLocaleString() : 'N/A'} users)
              </span>
            </div>

            {/* Episodes & Status */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {anime.episodes && (
                <div className="flex items-center gap-2 text-white">
                  <Tv className="w-5 h-5 text-blue-500" />
                  <span>{anime.episodes} Episodes</span>
                </div>
              )}
              {anime.duration && (
                <div className="flex items-center gap-2 text-white">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span>{anime.duration}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-white">
                <Film className="w-5 h-5 text-blue-500" />
                <span>{anime.status}</span>
              </div>
              {anime.year && (
                <div className="flex items-center gap-2 text-white">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span>{anime.year}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {anime.genres.map((genre) => (
                  <span 
                    key={genre.mal_id}
                    className="bg-blue-900/50 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-4">
              <a 
                href={anime.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors"
              >
                <Play className="w-5 h-5" />
                Watch Now
              </a>
              
              {/* Add to My List Button */}
              <button 
                onClick={handleAddToList}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-colors ${
                  inMyList 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                {inMyList ? (
                  <>
                    <Check className="w-5 h-5" />
                    In My List
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    My List
                  </>
                )}
              </button>

              {anime.trailer?.url && (
                <a 
                  href={anime.trailer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
                >
                  <Play className="w-5 h-5" />
                  Watch Trailer
                </a>
              )}
            </div>

            {/* Message */}
            {listMessage && (
              <p className={`mt-4 ${inMyList ? 'text-green-400' : 'text-gray-400'}`}>
                {listMessage}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-slate-950 py-16 px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          {/* Synopsis */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              Synopsis
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              {anime.synopsis || 'No synopsis available.'}
            </p>
          </div>

          {/* Additional Info Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Studio & Source */}
            <div className="bg-gray-900/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Anime Information</h3>
              <div className="space-y-4">
                {anime.studio && anime.studio.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Film className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm">Studio</p>
                      <p className="text-white">{anime.studio[0].name}</p>
                    </div>
                  </div>
                )}
                {anime.source && (
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm">Source</p>
                      <p className="text-white">{anime.source}</p>
                    </div>
                  </div>
                )}
                {anime.rating && (
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm">Rating</p>
                      <p className="text-white">{anime.rating}</p>
                    </div>
                  </div>
                )}
                {anime.season && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm">Season</p>
                      <p className="text-white capitalize">{anime.season} {anime.year}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Stats */}
            <div className="bg-gray-900/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">Score</p>
                    <p className="text-white text-xl font-bold">{anime.score || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">Ranked</p>
                    <p className="text-white">#{anime.rank || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Tv className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">Popularity</p>
                    <p className="text-white">#{anime.popularity || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">Members</p>
                    <p className="text-white">{anime.members ? anime.members.toLocaleString() : 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">Favorites</p>
                    <p className="text-white">{anime.favorites ? anime.favorites.toLocaleString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Images */}
          {anime.images && anime.images.jpg && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-white mb-6">Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {anime.images.jpg.large_image_url && (
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={anime.images.jpg.large_image_url} 
                      alt="Gallery"
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Details
