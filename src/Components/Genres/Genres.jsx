import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Genres = () => {
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('https://api.jikan.moe/v4/genres/anime')
        const data = await response.json()
        
        if (data.data && data.data.length > 0) {
          setGenres(data.data)
        } else {
          // Fallback genres
          setGenres([
            { mal_id: 1, name: 'Action', count: 4000 },
            { mal_id: 2, name: 'Adventure', count: 2500 },
            { mal_id: 8, name: 'Comedy', count: 3500 },
            { mal_id: 10, name: 'Fantasy', count: 3000 },
            { mal_id: 22, name: 'Romance', count: 2800 },
            { mal_id: 7, name: 'Mystery', count: 1500 },
            { mal_id: 4, name: 'Comedy', count: 3500 },
            { mal_id: 24, name: 'Sci-Fi', count: 2000 },
            { mal_id: 36, name: 'Slice of Life', count: 1800 },
            { mal_id: 30, name: 'Sports', count: 1200 }
          ])
        }
      } catch (error) {
        console.error('Error fetching genres:', error)
        setGenres([
          { mal_id: 1, name: 'Action', count: 4000 },
          { mal_id: 2, name: 'Adventure', count: 2500 },
          { mal_id: 8, name: 'Comedy', count: 3500 },
          { mal_id: 10, name: 'Fantasy', count: 3000 },
          { mal_id: 22, name: 'Romance', count: 2800 },
          { mal_id: 7, name: 'Mystery', count: 1500 },
          { mal_id: 4, name: 'Comedy', count: 3500 },
          { mal_id: 24, name: 'Sci-Fi', count: 2000 },
          { mal_id: 36, name: 'Slice of Life', count: 1800 },
          { mal_id: 30, name: 'Sports', count: 1200 }
        ])
      }

      setLoading(false)
    }

    fetchGenres()
  }, [])

  // Gradient color combinations
  const gradients = [
    { background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)' },
    { background: 'linear-gradient(135deg, #34d399 0%, #14b8a6 50%, #3b82f6 100%)' },
    { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #ef4444 100%)' },
    { background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f43f5e 100%)' },
    { background: 'linear-gradient(135deg, #22d3d1 0%, #3b82f6 50%, #6366f1 100%)' },
    { background: 'linear-gradient(135deg, #f472b6 0%, #c084fc 50%, #818cf8 100%)' },
    { background: 'linear-gradient(135deg, #fb923c 0%, #f87171 50%, #c084fc 100%)' },
    { background: 'linear-gradient(135deg, #4ade80 0%, #22d3ee 50%, #3b82f6 100%)' },
    { background: 'linear-gradient(135deg, #facc15 0%, #f97316 50%, #ec4899 100%)' },
    { background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #e879f9 100%)' },
    { background: 'linear-gradient(135deg, #fca5a5 0%, #fcd34d 50%, #6ee7b7 100%)' },
    { background: 'linear-gradient(135deg, #c4b5fd 0%, #67e8f9 50%, #99f6e4 100%)' },
    { background: 'linear-gradient(135deg, #fdba74 0%, #c084fc 50%, #f472b6 100%)' },
    { background: 'linear-gradient(135deg, #7dd3fc 0%, #a78bfa 50%, #f0abfc 100%)' },
    { background: 'linear-gradient(135deg, #fde047 0%, #86efac 50%, #5eead4 100%)' },
    { background: 'linear-gradient(135deg, #fca5a5 0%, #fdba74 50%, #fcd34d 100%)' },
    { background: 'linear-gradient(135deg, #93c5fd 0%, #c4b5fd 50%, #fbcfe8 100%)' },
    { background: 'linear-gradient(135deg, #86efac 0%, #67e8f9 50%, #a5b4fc 100%)' },
    { background: 'linear-gradient(135deg, #fde68a 0%, #fca5a5 50%, #c4b5fd 100%)' },
    { background: 'linear-gradient(135deg, #bef264 0%, #a7f3d0 50%, #bae6fd 100%)' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-slate-950 py-16 px-8 md:px-16 lg:px-24">
        <h1 className="text-5xl font-bold text-white mb-4">Browse by Genre</h1>
        <p className="text-gray-400 text-lg">Explore anime by your favorite genres</p>
      </div>

      {/* Genre Cards Grid */}
      <div className="bg-slate-950 py-8 px-8 md:px-16 lg:px-24 pb-24">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {genres.map((genre, index) => (
            <Link 
              to={`/genres/${genre.mal_id}`}
              key={genre.mal_id}
              style={gradients[index % gradients.length]}
              className="relative h-48 rounded-xl overflow-hidden cursor-pointer group hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
                <h3 className="text-white text-xl font-bold text-center">
                  {genre.name}
                </h3>
                {genre.count && (
                  <p className="text-white/70 text-sm mt-2">
                    {genre.count} anime
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {genres.length === 0 && (
          <div className="text-center text-gray-400 py-16">
            No genres found
          </div>
        )}
      </div>
    </div>
  )
}

export default Genres
