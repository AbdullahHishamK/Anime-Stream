import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Star, Play, ChevronLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { AnimeGridSkeleton } from '../UI/Skeleton'
import { BlurUpImage } from '../UI/LazyImage'

// Map of genre IDs to names
const genreIdMap = {
  1: 'Action', 2: 'Adventure', 4: 'Comedy', 8: 'Comedy', 7: 'Mystery',
  10: 'Fantasy', 22: 'Romance', 24: 'Sci-Fi', 30: 'Sports', 36: 'Slice of Life',
  37: 'Supernatural', 14: 'Horror', 9: 'Drama', 23: 'School', 17: 'Martial Arts',
  21: 'Magic', 25: 'Music', 27: 'Shoujo', 28: 'Shounen', 29: 'Space',
  31: 'Superhero', 32: 'Vampire', 35: 'Dementia', 38: 'Military', 39: 'Police',
  40: 'Psychological', 41: 'Samurai', 42: 'Seinen', 43: 'Shoujo Ai', 44: 'Shounen Ai',
  47: 'Super Power', 48: 'Time Travel', 49: 'Yaoi', 50: 'Yuri'
}

// Get genre name from id
const getGenreName = (id) => {
  const genreId = parseInt(id)
  return genreIdMap[genreId] || ''
}

// API fetch function
const fetchGenreAnime = async (genreId) => {
  const response = await fetch(`https://api.jikan.moe/v4/anime?genres=${genreId}&limit=25&order_by=score&sort=desc`)
  if (!response.ok) throw new Error('Failed to fetch anime')
  const data = await response.json()
  return data.data || []
}

const GenresAnime = () => {
  const { id } = useParams()
  
  const genreName = getGenreName(id)

  // Use React Query for fetching anime - simple query approach
  const { data: animeList = [], isLoading, error } = useQuery({
    queryKey: ['genreAnime', id],
    queryFn: () => fetchGenreAnime(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id, // Only fetch if id exists
  })

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error('Failed to load anime. Please try again.')
    }
  }, [error])

  const getImageUrl = (item) => {
    if (item?.images?.jpg?.large_image_url) return item.images.jpg.large_image_url
    return `https://placehold.co/300x450/1e3a8a/ffffff?text=${encodeURIComponent(item?.title_english || item?.title || 'Anime')}`
  }

  const getFirstGenre = (animeGenres) => {
    if (animeGenres && animeGenres.length > 0) {
      return animeGenres[0].name
    }
    return genreName || ''
  }

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="bg-slate-950 py-16 px-8 md:px-16 lg:px-24">
          <div className="h-10 w-32 bg-gray-700 animate-pulse rounded-lg mb-4"></div>
          <div className="h-16 w-64 bg-gray-700 animate-pulse rounded-lg"></div>
        </div>
        <div className="bg-slate-950 py-8 px-8 md:px-16 lg:px-24 pb-24">
          <AnimeGridSkeleton count={15} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-slate-950 py-16 px-8 md:px-16 lg:px-24">
        <Link to="/genres" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Genres
        </Link>
        <h1 className="text-5xl font-bold text-white mb-4">{genreName || 'Loading...'} Anime</h1>
      </div>

      <div className="bg-slate-950 py-8 px-8 md:px-16 lg:px-24 pb-24">
        <p className="text-gray-400 mb-8">{animeList.length} anime found</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {animeList.map((item, index) => (
            <Link to={`/anime/${item.mal_id}`} key={`${item.mal_id}-${index}`} className="group cursor-pointer">
              <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-4 shadow-lg shadow-blue-900/20 group-hover:shadow-2xl group-hover:shadow-blue-900/40 transition-all duration-300 group-hover:-translate-y-2">
                <BlurUpImage 
                  src={getImageUrl(item)} 
                  alt={item.title_english || item.title || 'Anime'}
                  className="w-full h-full"
                  lowQualitySrc={`https://placehold.co/50x75/1e3a8a/ffffff?text=`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded-full">
                      <Play className="w-3 h-3" />
                      Watch Now
                    </span>
                  </div>
                </div>
                <div className="absolute top-3 right-3 bg-blue-900/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  {item.score || 'N/A'}
                </div>
              </div>
              <h3 className="text-white font-semibold text-sm mb-2 truncate group-hover:text-blue-400 transition-colors">
                {item.title_english || item.title || 'Unknown'}
              </h3>
              <p className="text-blue-900 text-xs font-medium">{getFirstGenre(item.genres)}</p>
            </Link>
          ))}
        </div>

        {animeList.length === 0 && !isLoading && (
          <div className="text-center text-gray-400 py-16">No anime found in this genre</div>
        )}
      </div>
    </div>
  )
}

export default GenresAnime
