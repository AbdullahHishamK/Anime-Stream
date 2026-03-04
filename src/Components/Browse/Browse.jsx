import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Search, Filter, Star, Play } from 'lucide-react'
import toast from 'react-hot-toast'
import { AnimeGridSkeleton } from '../UI/Skeleton'
import { BlurUpImage } from '../UI/LazyImage'

// API fetch function
const fetchAnimeList = async ({ pageParam = 1 }) => {
  const response = await fetch(`https://api.jikan.moe/v4/anime?page=${pageParam}&limit=25&order_by=score&sort=desc`)
  if (!response.ok) throw new Error('Failed to fetch anime')
  const data = await response.json()
  return {
    data: data.data || [],
    nextPage: data.pagination?.has_next_page ? pageParam + 1 : undefined,
    currentPage: pageParam,
  }
}

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')

  const genres = ['All', 'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Slice of Life']

  // Use React Query infinite query for fetching anime with pagination
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ['animeList'],
    queryFn: fetchAnimeList,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Combine all pages into a single array
  const animeList = React.useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap(page => page.data)
  }, [data])

  // Show error toast
  React.useEffect(() => {
    if (error) {
      toast.error('Failed to load anime. Please refresh the page.')
    }
  }, [error])

  // Filter anime based on search and genre
  const filteredAnime = animeList.filter(anime => {
    const matchesSearch = anime.title_english?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          anime.title?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = selectedGenre === 'All' || 
                         anime.genres?.some(g => g.name === selectedGenre) ||
                         anime.themes?.some(t => t.name === selectedGenre)
    return matchesSearch && matchesGenre
  })

  const getFirstGenre = (anime) => {
    if (anime.genres && anime.genres.length > 0) {
      return anime.genres[0].name
    }
    if (anime.themes && anime.themes.length > 0) {
      return anime.themes[0].name
    }
    return 'Anime'
  }

  const getImageUrl = (anime) => {
    if (anime.images?.jpg?.large_image_url) return anime.images.jpg.large_image_url
    return `https://placehold.co/300x450/1e3a8a/ffffff?text=${encodeURIComponent(anime.title_english || anime.title || 'Anime')}`
  }

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Header Section */}
        <div className="bg-slate-950 py-12 px-8 md:px-16 lg:px-24">
          <div className="h-12 w-48 bg-gray-700 animate-pulse rounded-lg mb-4"></div>
          <div className="h-6 w-80 bg-gray-700 animate-pulse rounded-lg mb-8"></div>
          <div className="h-16 max-w-2xl bg-gray-700 animate-pulse rounded-full mb-8"></div>
          <div className="flex gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-10 w-20 bg-gray-700 animate-pulse rounded-full"></div>
            ))}
          </div>
        </div>
        {/* Grid skeleton */}
        <div className="py-12 px-8 md:px-16 lg:px-24">
          <div className="h-8 w-32 bg-gray-700 animate-pulse rounded-lg mb-8"></div>
          <AnimeGridSkeleton count={15} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header Section */}
      <div className="bg-slate-950 py-12 px-8 md:px-16 lg:px-24">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Browse Anime</h1>
        <p className="text-gray-400 text-lg mb-8">Discover thousands of anime series and movies ({animeList.length} anime loaded)</p>

        {/* Search Bar */}
        <div className="relative max-w-2xl mb-8">
          <input 
            type="text" 
            placeholder="Search anime..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 text-white px-6 py-4 rounded-full pl-14 text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
        </div>

        {/* Genre Filters */}
        <div className="flex flex-wrap gap-3">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-5 py-2 rounded-full font-medium transition-colors ${
                selectedGenre === genre 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="py-12 px-8 md:px-16 lg:px-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">
            {selectedGenre === 'All' ? 'All Anime' : selectedGenre}
            <span className="text-gray-400 text-lg font-normal ml-2">
              ({filteredAnime.length} results)
            </span>
          </h2>
          
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </div>

        {/* Anime Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredAnime.map((anime) => (
            <Link 
              to={`/anime/${anime.mal_id}`}
              key={anime.mal_id} 
              className="group cursor-pointer"
            >
              {/* Anime Card */}
              <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-3 shadow-lg shadow-blue-900/20 group-hover:shadow-2xl group-hover:shadow-blue-900/40 transition-all duration-300 group-hover:-translate-y-2">
                <BlurUpImage 
                  src={getImageUrl(anime)} 
                  alt={anime.title_english || anime.title}
                  className="w-full h-full"
                  lowQualitySrc={`https://placehold.co/50x75/1e3a8a/ffffff?text=`}
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="bg-blue-600 text-white text-sm px-3 py-2 rounded-full flex items-center justify-center gap-2">
                      <Play className="w-4 h-4" />
                      Watch Now
                    </span>
                  </div>
                </div>
                {/* Rating badge */}
                <div className="absolute top-3 right-3 bg-blue-900/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  {anime.score}
                </div>
              </div>
              
              {/* Anime Title */}
              <h3 className="text-white font-semibold text-sm mb-1 truncate group-hover:text-blue-400 transition-colors">
                {anime.title_english || anime.title}
              </h3>
              
              {/* Genre - Dark Blue */}
              <p className="text-blue-900 text-xs font-medium">
                {getFirstGenre(anime)}
              </p>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        {hasNextPage && (
          <div className="flex justify-center mt-12">
            <button 
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors disabled:opacity-50"
            >
              {isFetchingNextPage ? 'Loading...' : isFetching ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

        {/* No Results */}
        {filteredAnime.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">No anime found matching your criteria</p>
            <button 
              onClick={() => {setSearchQuery(''); setSelectedGenre('All')}}
              className="mt-4 text-blue-400 hover:text-blue-300"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Browse
