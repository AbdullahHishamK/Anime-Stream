import React, { useState, useEffect } from 'react'

const LazyImage = ({ 
  src, 
  alt, 
  className = '',
  placeholder = 'https://placehold.co/300x450/1e3a8a/ffffff?text=Loading...',
  threshold = 0.1
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(placeholder)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      { threshold }
    )

    const element = document.getElementById(`lazy-${alt}`)
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [alt, threshold])

  useEffect(() => {
    if (isInView && src) {
      const img = new Image()
      img.src = src
      img.onload = () => {
        setCurrentSrc(src)
        setIsLoaded(true)
      }
      img.onerror = () => {
        setCurrentSrc(placeholder)
        setIsLoaded(true)
      }
    }
  }, [isInView, src, placeholder])

  return (
    <div 
      id={`lazy-${alt}`}
      className={`relative ${className}`}
    >
      <img
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-50'
        }`}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}

// Blur-up version with low quality placeholder
const BlurUpImage = ({ 
  src, 
  alt, 
  className = '',
  lowQualitySrc = 'https://placehold.co/50x75/1e3a8a/ffffff?text=',
  threshold = 0.1
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      { threshold }
    )

    const element = document.getElementById(`blur-${alt}`)
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [alt, threshold])

  useEffect(() => {
    if (isInView && src) {
      const img = new Image()
      img.src = src
      img.onload = () => setIsLoaded(true)
      img.onerror = () => setIsLoaded(true)
    }
  }, [isInView, src])

  return (
    <div 
      id={`blur-${alt}`}
      className={`relative ${className}`}
      style={{
        backgroundImage: isInView ? `url(${lowQualitySrc})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-xl'
          }`}
        />
      )}
    </div>
  )
}

export { LazyImage, BlurUpImage }
export default LazyImage
