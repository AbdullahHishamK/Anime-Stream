import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Star, Play } from 'lucide-react'
import toast from 'react-hot-toast'
import { HeroSkeleton, AnimeGridSkeleton } from '../UI/Skeleton'
import { BlurUpImage } from '../UI/LazyImage'

// API fetch functions
const fetchCurrentSeason = async () => {
  const response = await fetch('https://api.jikan.moe/v4/seasons/now?limit=10')
  if (!response.ok) throw new Error('Failed to fetch current season')
  const data = await response.json()
  return data.data
}

const fetchSeasonAnime = async (season) => {
  const response = await fetch(`https://api.jikan.moe/v4/seasons/${season}?limit=15`)
  if (!response.ok) throw new Error(`Failed to fetch ${season}`)
  const data = await response.json()
  return data.data
}

// Fallback data
const fallbackNewSeason = [
  { mal_id: 1, title_english: 'One Piece', title: 'One Piece', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/6/73221l.jpg' } }, score: 8.7, genres: [{ name: 'Action' }], synopsis: 'Monkey D. Luffy sets off on an adventure with his pirate crew.', episodes: 1000, rating: 'PG-13', url: 'https://myanimelist.net/anime/21/One_Piece' },
  { mal_id: 2, title_english: 'Naruto', title: 'Naruto', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/5/17411l.jpg' } }, score: 8.0, genres: [{ name: 'Action' }], synopsis: 'Naruto Uzumaki dreams of becoming the Hokage.', episodes: 220, rating: 'PG-13', url: 'https://myanimelist.net/anime/20/Naruto' },
  { mal_id: 3, title_english: 'Bleach', title: 'Bleach', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/3/21664l.jpg' } }, score: 8.1, genres: [{ name: 'Action' }], synopsis: 'Ichigo gains the powers of a Soul Reaper.', episodes: 366, rating: 'PG-13', url: 'https://myanimelist.net/anime/269/Bleach' },
  { mal_id: 4, title_english: 'Fullmetal Alchemist', title: 'Fullmetal Alchemist', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/5/74023l.jpg' } }, score: 9.1, genres: [{ name: 'Action' }], synopsis: 'Two brothers search for a Philosopher\'s Stone.', episodes: 64, rating: 'PG-13', url: 'https://myanimelist.net/anime/121/Fullmetal_Alchemist' },
  { mal_id: 5, title_english: 'Attack on Titan', title: 'Attack on Titan', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/10/47347l.jpg' } }, score: 9.0, genres: [{ name: 'Action' }], synopsis: 'Humanity lives inside cities surrounded by enormous walls.', episodes: 87, rating: 'R-17', url: 'https://myanimelist.net/anime/16498/Shingeki_no_Kyojin' }
]

const fallbackAnimeList = [
  { mal_id: 6, title_english: 'Demon Slayer', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/147/121156l.jpg' } }, score: 8.7, genres: [{ name: 'Action' }] },
  { mal_id: 7, title_english: 'Jujutsu Kaisen', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/1308/115805l.jpg' } }, score: 8.7, genres: [{ name: 'Action' }] },
  { mal_id: 8, title_english: 'My Hero Academia', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/13/80161l.jpg' } }, score: 8.4, genres: [{ name: 'Action' }] },
  { mal_id: 9, title_english: 'Black Clover', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/13687/106643l.jpg' } }, score: 8.2, genres: [{ name: 'Action' }] },
  { mal_id: 10, title_english: 'Spy x Family', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/1663/126627l.jpg' } }, score: 8.7, genres: [{ name: 'Comedy' }] },
  { mal_id: 11, title_english: 'Chainsaw Man', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/193/128635l.jpg' } }, score: 8.5, genres: [{ name: 'Action' }] },
  { mal_id: 12, title_english: 'Blue Lock', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/148/120627l.jpg' } }, score: 8.3, genres: [{ name: 'Sports' }] },
  { mal_id: 13, title_english: 'Frieren', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/147/121156l.jpg' } }, score: 9.0, genres: [{ name: 'Fantasy' }] },
  { mal_id: 14, title_english: 'Dandadan', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/169/153131l.jpg' } }, score: 8.6, genres: [{ name: 'Action' }] },
  { mal_id: 15, title_english: 'Dragon Ball Super', images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/anime/14/76119l.jpg' } }, score: 8.2, genres: [{ name: 'Action' }] }
]

const NewSeason = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [allAnime, setAllAnime] = useState([])
  const currentYear = new Date().getFullYear()

  // Use React Query for fetching current season
  const { data: currentSeasonData, isLoading: seasonLoading, error: seasonError } = useQuery({
    queryKey: ['currentSeason'],
    queryFn: fetchCurrentSeason,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Fetch all seasons
  const { data: winterData } = useQuery({
    queryKey: ['season', `${currentYear}/winter`],
    queryFn: () => fetchSeasonAnime(`${currentYear}/winter`),
    staleTime: 1000 * 60 * 10, // 10 minutes
  })

  const { data: springData } = useQuery({
    queryKey: ['season', `${currentYear}/spring`],
    queryFn: () => fetchSeasonAnime(`${currentYear}/spring`),
    staleTime: 1000 * 60 * 10,
  })

  const { data: summerData } = useQuery({
    queryKey: ['season', `${currentYear}/summer`],
    queryFn: () => fetchSeasonAnime(`${currentYear}/summer`),
    staleTime: 1000 * 60 * 10,
  })

  const { data: fallData } = useQuery({
    queryKey: ['season', `${currentYear}/fall`],
    queryFn: () => fetchSeasonAnime(`${currentYear}/fall`),
    staleTime: 1000 * 60 * 10,
  })

  // Combine all season data
  React.useEffect(() => {
    const combinedData = [
      ...(winterData || []),
      ...(springData || []),
      ...(summerData || []),
      ...(fallData || []),
    ]
    if (combinedData.length > 0) {
      setAllAnime(combinedData)
    } else {
      setAllAnime([...fallbackNewSeason, ...fallbackAnimeList])
    }
  }, [winterData, springData, summerData, fallData])

  // Show error toast
  React.useEffect(() => {
    if (seasonError) {
      toast.error('Failed to load current season. Using fallback data.')
    }
  }, [seasonError])

  // Get season data or fallback
  const seasons = currentSeasonData?.length > 0 ? currentSeasonData : fallbackNewSeason

  // Auto-rotate slider
  React.useEffect(() => {
    if (seasons.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % seasons.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [seasons.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % seasons.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + seasons.length) % seasons.length)
  }

  // Helper function to get image URL
  const getImageUrl = (item) => {
    if (item?.images?.jpg?.large_image_url) return item.images.jpg.large_image_url
    return `https://placehold.co/600x900/1e3a8a/ffffff?text=${encodeURIComponent(item?.title || 'Anime')}`
  }

  // Get first genre
  const getFirstGenre = (animeGenres) => {
    if (animeGenres && animeGenres.length > 0) {
      return animeGenres[0].name
    }
    return ''
  }

  // Loading state with skeleton
  if (seasonLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Hero skeleton */}
        <div className="relative h-[70vh] w-full bg-gray-900">
          <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
          <div className="relative z-10 flex flex-col items-start justify-end h-full px-8 md:px-16 lg:px-24 pb-16">
            <div className="h-6 w-32 bg-gray-700 animate-pulse rounded-full mb-4"></div>
            <div className="h-16 w-2/3 bg-gray-700 animate-pulse rounded-lg mb-4"></div>
            <div className="h-6 w-1/3 bg-gray-700 animate-pulse rounded-lg mb-8"></div>
            <div className="h-20 w-full max-w-2xl bg-gray-700 animate-pulse rounded-lg"></div>
          </div>
        </div>
        {/* Grid skeleton */}
        <div className="bg-slate-950 py-16 px-8 md:px-16 lg:px-24">
          <div className="h-12 w-48 bg-gray-700 animate-pulse rounded-lg mb-10"></div>
          <AnimeGridSkeleton count={10} />
        </div>
      </div>
    )
  }

  const currentAnime = seasons[currentSlide] || fallbackNewSeason[0]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section with Slider */}
      <div className="relative h-[70vh] w-full">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{ backgroundImage: `url(${getImageUrl(currentAnime)})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        </div>

        {/* Slider Content */}
        <div className="relative z-10 flex flex-col items-start justify-end h-full px-8 md:px-16 lg:px-24 pb-16">
          {/* Season Badge */}
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-blue-600 text-white text-sm px-4 py-1 rounded-full font-semibold">
              Now Airing
            </span>
            <span className="text-gray-300 text-sm">
              New Season
            </span>
          </div>

          {/* Anime Name */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 max-w-4xl">
            {currentAnime?.title_english || currentAnime?.title || 'Unknown Title'}
          </h1>

          {/* Genre */}
          <p className="text-blue-900 text-lg font-medium mb-4">
            {getFirstGenre(currentAnime?.genres)}
          </p>

          {/* Rating and Episodes */}
          <div className="flex items-center gap-4 mb-6">
            {currentAnime?.score && (
              <div className="flex items-center gap-1 text-white">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">{currentAnime.score}</span>
              </div>
            )}
            {currentAnime?.episodes && (
              <span className="text-gray-300">{currentAnime.episodes} episodes</span>
            )}
            {currentAnime?.rating && (
              <span className="text-gray-300">{currentAnime.rating}</span>
            )}
          </div>

          {/* Synopsis */}
          <p className="text-gray-300 max-w-2xl mb-6 line-clamp-3">
            {currentAnime?.synopsis}
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <a 
              href={currentAnime?.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors"
            >
              <Play className="w-5 h-5" />
              Watch Now
            </a>
          </div>
        </div>

        {/* Slider Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {seasons.slice(0, 8).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-blue-600' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* All Anime Section - Newest to Oldest */}
      <div className="bg-slate-950 py-16 px-8 md:px-16 lg:px-24">
        <h2 className="text-4xl font-bold text-white mb-10">
          All Anime - Newest to Oldest
        </h2>
        
        {/* Anime Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {allAnime.map((anime, index) => (
            <Link 
              to={`/anime/${anime.mal_id}`}
              key={`${anime.mal_id}-${index}`}
              className="group cursor-pointer"
            >
              {/* Anime Card */}
              <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-4 shadow-lg shadow-blue-900/20 group-hover:shadow-2xl group-hover:shadow-blue-900/40 transition-all duration-300 group-hover:-translate-y-2">
                <BlurUpImage 
                  src={getImageUrl(anime)} 
                  alt={anime.title_english || anime.title || 'Anime'}
                  className="w-full h-full"
                  lowQualitySrc={`https://placehold.co/50x75/1e3a8a/ffffff?text=`}
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      Watch Now
                    </span>
                  </div>
                </div>
                {/* Rating badge */}
                <div className="absolute top-3 right-3 bg-blue-900/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  {anime.score || 'N/A'}
                </div>
              </div>
              
              {/* Anime Name */}
              <h3 className="text-white font-semibold text-sm mb-2 truncate group-hover:text-blue-400 transition-colors">
                {anime.title_english || anime.title || 'Unknown'}
              </h3>
              
              {/* Genre - Dark Blue */}
              <p className="text-blue-900 text-xs font-medium">
                {getFirstGenre(anime.genres)}
              </p>
            </Link>
          ))}
        </div>

        {allAnime.length === 0 && (
          <div className="text-center text-gray-400 py-16">
            No anime found
          </div>
        )}
      </div>
    </div>
  )
}

export default NewSeason
