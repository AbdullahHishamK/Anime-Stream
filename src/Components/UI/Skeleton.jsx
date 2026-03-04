import React from 'react'

const Skeleton = ({ className = '', variant = 'rectangular' }) => {
  const baseClasses = 'animate-pulse bg-gray-700'
  
  const variantClasses = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded h-4'
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  )
}

// Skeleton for anime card
export const AnimeCardSkeleton = () => {
  return (
    <div className="cursor-pointer">
      <Skeleton className="w-full aspect-[3/4] rounded-xl" />
      <div className="mt-3">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

// Skeleton for anime card with smaller variant
export const AnimeCardSmallSkeleton = () => {
  return (
    <div className="cursor-pointer">
      <Skeleton className="w-full aspect-[2/3] rounded-lg" />
      <div className="mt-2">
        <Skeleton className="h-4 w-3/4 mb-1" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  )
}

// Skeleton for hero section
export const HeroSkeleton = () => {
  return (
    <div className="relative h-screen w-full bg-gray-900">
      <Skeleton className="absolute inset-0" />
      <div className="absolute inset-0 flex flex-col items-start justify-center px-8 md:px-16 lg:px-24 pt-32">
        <Skeleton className="h-6 w-32 mb-4 rounded-full" />
        <Skeleton className="h-16 w-2/3 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-6 w-full max-w-2xl mb-8" />
        <div className="flex gap-4">
          <Skeleton className="h-12 w-40 rounded-full" />
          <Skeleton className="h-12 w-32 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// Skeleton for genre card
export const GenreCardSkeleton = () => {
  return (
    <Skeleton className="h-40 rounded-xl" />
  )
}

// Skeleton for anime grid
export const AnimeGridSkeleton = ({ count = 10 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <AnimeCardSkeleton key={index} />
      ))}
    </div>
  )
}

// Skeleton for anime list section
export const AnimeListSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <AnimeCardSmallSkeleton key={index} />
      ))}
    </div>
  )
}

export default Skeleton
