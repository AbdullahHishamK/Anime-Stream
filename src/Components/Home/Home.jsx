import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Plus, Play, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { HeroSkeleton, AnimeGridSkeleton, AnimeListSkeleton, GenreCardSkeleton } from '../UI/Skeleton'
import { BlurUpImage } from '../UI/LazyImage'

// API fetch functions
const fetchTopAnime = async () => {
  const response = await fetch('https://api.jikan.moe/v4/top/anime?limit=15')
  if (!response.ok) throw new Error('Failed to fetch top anime')
  const data = await response.json()
  return data.data
}

const fetchGenres = async () => {
  const response = await fetch('https://api.jikan.moe/v4/genres/anime')
  if (!response.ok) throw new Error('Failed to fetch genres')
  const data = await response.json()
  return data.data
}

const fetchCurrentSeason = async () => {
  const response = await fetch('https://api.jikan.moe/v4/seasons/now?limit=12')
  if (!response.ok) throw new Error('Failed to fetch current season')
  const data = await response.json()
  return data.data
}

const Home = () => {
  // Use React Query for data fetching with caching
  const { data: topAnime, isLoading: topLoading, error: topError } = useQuery({
    queryKey: ['topAnime'],
    queryFn: fetchTopAnime,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  })

  const { data: genres, isLoading: genresLoading } = useQuery({
    queryKey: ['genres'],
    queryFn: fetchGenres,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })

  const { data: currentSeason, isLoading: seasonLoading } = useQuery({
    queryKey: ['currentSeason'],
    queryFn: fetchCurrentSeason,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Show error toast if data fetch fails
  React.useEffect(() => {
    if (topError) {
      toast.error('Failed to load anime data. Please refresh the page.')
    }
  }, [topError])

  // Fallback data
  const fallbackAnime = {
    mal_id: 21,
    title_english: 'One Piece',
    images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/6/73221l.jpg' } },
    synopsis: 'Monkey D. Luffy sets off on an adventure with his pirate crew in hopes of finding the greatest treasure ever.',
    score: 8.7,
    rating: 'PG-13',
    season: 'winter',
    year: 1999,
    url: 'https://myanimelist.net/anime/21/One_Piece'
  }

  const fallbackTrending = [
    { mal_id: 5, title_english: 'Fullmetal Alchemist', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/5/74023l.jpg' } }, score: 9.1, genres: [{ name: 'Action' }] },
    { mal_id: 9, title_english: 'Steins;Gate', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/9/55199l.jpg' } }, score: 9.0, genres: [{ name: 'Sci-Fi' }] },
    { mal_id: 11, title_english: 'Hunter x Hunter', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/11/39775l.jpg' } }, score: 9.0, genres: [{ name: 'Action' }] },
    { mal_id: 12, title_english: 'One Punch Man', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/12/87449l.jpg' } }, score: 8.5, genres: [{ name: 'Action' }] },
    { mal_id: 39551, title_english: 'Demon Slayer', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/147/121156l.jpg' } }, score: 8.7, genres: [{ name: 'Action' }] }
  ]

  const fallbackNewReleases = [
    { mal_id: 148, title_english: 'Blue Lock', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/148/120627l.jpg' } }, score: 8.3, genres: [{ name: 'Sports' }] },
    { mal_id: 193, title_english: 'Chainsaw Man', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/193/128635l.jpg' } }, score: 8.5, genres: [{ name: 'Action' }] },
    { mal_id: 1308, title_english: 'Jujutsu Kaisen', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/1308/115805l.jpg' } }, score: 8.7, genres: [{ name: 'Action' }] },
    { mal_id: 1663, title_english: 'Spy x Family', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/1663/126627l.jpg' } }, score: 8.7, genres: [{ name: 'Comedy' }] },
    { mal_id: 147, title_english: 'Frieren', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/147/121156l.jpg' } }, score: 9.0, genres: [{ name: 'Fantasy' }] },
    { mal_id: 169, title_english: 'Dandadan', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/169/153131l.jpg' } }, score: 8.6, genres: [{ name: 'Action' }] }
  ]

  const fallbackGenres = [
    { mal_id: 1, name: 'Action', count: 4000 },
    { mal_id: 2, name: 'Adventure', count: 2500 },
    { mal_id: 8, name: 'Comedy', count: 3500 },
    { mal_id: 10, name: 'Fantasy', count: 3000 },
    { mal_id: 22, name: 'Romance', count: 2800 }
  ]

  // Get sections from anime list
  const heroAnime = topAnime?.length > 0 ? topAnime[0] : fallbackAnime
  const trendingAnime = topAnime?.length > 1 ? topAnime.slice(1, 6) : fallbackTrending
  const newReleasesData = currentSeason?.length > 0 ? currentSeason.slice(0, 6) : fallbackNewReleases
  const displayGenres = genres?.length > 0 ? genres.slice(0, 5) : fallbackGenres

  // Loading state with skeleton
  if (topLoading || genresLoading || seasonLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <HeroSkeleton />
        <div className="bg-slate-950 py-16 px-8 md:px-16 lg:px-24">
          <div className="mb-10">
            <div className="h-12 w-48 bg-gray-700 animate-pulse rounded-lg mb-4"></div>
          </div>
          <AnimeGridSkeleton count={5} />
        </div>
        <div className="bg-slate-950 py-16 px-8 md:px-16 lg:px-24">
          <div className="mb-10">
            <div className="h-12 w-48 bg-gray-700 animate-pulse rounded-lg mb-4"></div>
          </div>
          <AnimeListSkeleton count={6} />
        </div>
        <div className="bg-slate-950 py-16 px-8 md:px-16 lg:px-24">
          <div className="mb-10">
            <div className="h-12 w-48 bg-gray-700 animate-pulse rounded-lg mb-4"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <GenreCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const backgroundImage = heroAnime?.images?.jpg?.large_image_url || fallbackAnime.images.jpg.large_image_url
  const title = heroAnime?.title_english || heroAnime?.title || fallbackAnime.title_english
  const titleWords = title.split(' ')
  const firstWord = titleWords[0] || ''
  const secondWord = titleWords.slice(1).join(' ') || ''

  const getShortSynopsis = (synopsis) => {
    if (!synopsis) return ''
    const words = synopsis.split(' ')
    return words.slice(0, 20).join(' ') + '...'
  }

  const getFirstGenre = (animeGenres) => {
    if (animeGenres && animeGenres.length > 0) {
      return animeGenres[0].name
    }
    return ''
  }

  const getImageUrl = (item) => {
    if (item?.images?.jpg?.large_image_url) return item.images.jpg.large_image_url
    return `https://placehold.co/300x450/1e3a8a/ffffff?text=${encodeURIComponent(item?.title_english || item?.title || 'Anime')}`
  }

  const renderTrendingCard = (item, index) => (
    <Link to={`/anime/${item.mal_id}`} key={item.mal_id || index} className="group cursor-pointer">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 shadow-lg shadow-blue-900/20 group-hover:shadow-2xl group-hover:shadow-blue-900/40 transition-all duration-300 group-hover:-translate-y-2">
        <BlurUpImage 
          src={getImageUrl(item)} 
          alt={item.title_english || item.title || 'Anime'}
          className="w-full h-full"
          lowQualitySrc={`https://placehold.co/75x100/1e3a8a/ffffff?text=`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <span className="bg-blue-600 text-white text-sm px-4 py-2 rounded-full flex items-center justify-center gap-2">
              <Play className="w-4 h-4" /> Watch Now
            </span>
          </div>
        </div>
        <div className="absolute top-3 right-3 bg-blue-900/90 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          {item.score || 'N/A'}
        </div>
      </div>
      <h3 className="text-white font-semibold text-lg mb-2 truncate group-hover:text-blue-400 transition-colors">{item.title_english || item.title || 'Unknown'}</h3>
      <p className="text-blue-900 text-sm font-medium">{getFirstGenre(item.genres)}</p>
    </Link>
  )

  const renderNewReleaseCard = (item, index) => (
    <Link to={`/anime/${item.mal_id}`} key={item.mal_id || index} className="group cursor-pointer">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3 shadow-lg shadow-blue-900/20 group-hover:shadow-xl group-hover:shadow-blue-900/40 transition-all duration-300 group-hover:-translate-y-1">
        <BlurUpImage 
          src={getImageUrl(item)} 
          alt={item.title_english || item.title || 'Anime'}
          className="w-full h-full"
          lowQualitySrc={`https://placehold.co/50x75/1e3a8a/ffffff?text=`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-3 left-3 right-3">
            <span className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full flex items-center justify-center gap-1">
              <Play className="w-3 h-3" /> Watch
            </span>
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-blue-900/90 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-0.5">
          <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
          {item.score || 'N/A'}
        </div>
      </div>
      <h3 className="text-white font-medium text-sm mb-1 truncate group-hover:text-blue-400 transition-colors">{item.title_english || item.title || 'Unknown'}</h3>
      <p className="text-blue-900 text-xs font-medium">{getFirstGenre(item.genres)}</p>
    </Link>
  )

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-screen w-full bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>

        <div className="relative z-10 flex flex-col items-start justify-center h-full px-8 md:px-16 lg:px-24 pt-32">
          <div className="flex items-center gap-4 mb-4">
            {heroAnime.rating && (
              <span className="bg-blue-900 text-white text-sm px-3 py-1 rounded-full font-semibold">{heroAnime.rating}</span>
            )}
            {heroAnime.season && (
              <span className="text-gray-300 text-sm capitalize">{heroAnime.season} {heroAnime.year}</span>
            )}
          </div>

          <div className="mb-6">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-none">{firstWord}</h1>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-blue-900 leading-none">{secondWord}</h1>
          </div>

          <p className="text-gray-300 max-w-2xl mb-8 text-lg">{getShortSynopsis(heroAnime.synopsis)}</p>

          <div className="flex items-center gap-4">
            <a href={heroAnime.url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors">
              <Play className="w-5 h-5" />
              Watch Episode
            </a>
            <button className="flex items-center gap-2 bg-gray-700/80 hover:bg-gray-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
              <Plus className="w-5 h-5" />
              My List
            </button>
          </div>
        </div>
      </div>

      {/* Trending Now - 5 Equal Cards */}
      <div className="bg-slate-950 py-16 px-8 md:px-16 lg:px-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-bold text-white">Trending Now</h2>
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {trendingAnime.map((item, index) => renderTrendingCard(item, index))}
        </div>
      </div>

      {/* New Releases - 6 Equal Shorter Cards */}
      <div className="bg-slate-950 py-16 px-8 md:px-16 lg:px-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-bold text-white">New Releases</h2>
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {newReleasesData.map((item, index) => renderNewReleaseCard(item, index))}
        </div>
      </div>

      {/* Popular Genres */}
      <div className="bg-slate-950 py-16 px-8 md:px-16 lg:px-24">
        <h2 className="text-4xl font-bold text-white mb-10">Popular Genres</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {displayGenres.map((genre, index) => {
            const gradientStyles = [
              { background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)' },
              { background: 'linear-gradient(135deg, #34d399 0%, #14b8a6 50%, #3b82f6 100%)' },
              { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #ef4444 100%)' },
              { background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f43f5e 100%)' },
              { background: 'linear-gradient(135deg, #22d3d1 0%, #3b82f6 50%, #6366f1 100%)' }
            ]
            return (
              <Link to={`/genres/${genre.mal_id}`} key={genre.mal_id || index} style={gradientStyles[index]} className="relative h-40 rounded-xl overflow-hidden cursor-pointer group hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  <h3 className="text-white text-xl font-bold text-center px-4">{genre.name}</h3>
                  <p className="text-white/70 text-sm mt-1">{genre.count || genre.anime_count || 0} anime</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Home
