import React from 'react'
import { Link } from 'react-router-dom'
import { Bell, Calendar, Clock, Play, Star, ChevronRight } from 'lucide-react'

const Notification = () => {
  // Sample notifications data with anime IDs
  const notifications = [
    {
      id: 1,
      type: 'new_episode',
      title: 'New Episode Available',
      anime: 'Demon Slayer: Kimetsu no Yaiba',
      animeId: 38000,
      episode: 'Episode 11',
      time: '2 hours ago',
      image: 'https://cdn.myanimelist.net/images/anime/147/121156l.jpg',
      unread: true
    },
    {
      id: 2,
      type: 'trending',
      title: 'Trending Now',
      anime: 'Jujutsu Kaisen',
      animeId: 40748,
      description: 'Currently #2 in trending anime',
      time: '5 hours ago',
      image: 'https://cdn.myanimelist.net/images/anime/1308/115805l.jpg',
      unread: true
    },
    {
      id: 3,
      type: 'season',
      title: 'New Season Started',
      anime: 'One Piece',
      animeId: 21,
      description: 'New season is now streaming',
      time: '1 day ago',
      image: 'https://cdn.myanimelist.net/images/anime/6/73221l.jpg',
      unread: false
    },
    {
      id: 4,
      type: 'recommendation',
      title: 'Recommended For You',
      anime: 'Fullmetal Alchemist: Brotherhood',
      animeId: 5114,
      description: 'Based on your watch history',
      time: '2 days ago',
      image: 'https://cdn.myanimelist.net/images/anime/5/74023l.jpg',
      unread: false
    },
    {
      id: 5,
      type: 'new_episode',
      title: 'New Episode Available',
      anime: 'Spy x Family',
      animeId: 45688,
      episode: 'Episode 18',
      time: '3 days ago',
      image: 'https://cdn.myanimelist.net/images/anime/1663/126627l.jpg',
      unread: false
    },
    {
      id: 6,
      type: 'new_episode',
      title: 'New Episode Available',
      anime: 'Chainsaw Man',
      animeId: 44511,
      episode: 'Episode 12',
      time: '4 days ago',
      image: 'https://cdn.myanimelist.net/images/anime/193/128635l.jpg',
      unread: false
    },
    {
      id: 7,
      type: 'trending',
      title: 'Trending Now',
      anime: 'Blue Lock',
      animeId: 49596,
      description: 'Currently #1 in trending anime',
      time: '5 days ago',
      image: 'https://cdn.myanimelist.net/images/anime/148/120627l.jpg',
      unread: false
    }
  ]

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_episode':
        return <Play className="w-4 h-4" />
      case 'trending':
        return <Star className="w-4 h-4" />
      case 'season':
        return <Calendar className="w-4 h-4" />
      case 'recommendation':
        return <Bell className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getIconBgColor = (type) => {
    switch (type) {
      case 'new_episode':
        return 'bg-green-500'
      case 'trending':
        return 'bg-yellow-500'
      case 'season':
        return 'bg-blue-500'
      case 'recommendation':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-slate-950 py-12 px-8 md:px-16 lg:px-24">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Notifications</h1>
            <p className="text-gray-400 text-lg">
              {notifications.filter(n => n.unread).length} unread notifications
            </p>
          </div>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
            Mark all as read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="py-8 px-8 md:px-16 lg:px-24 pb-24">
        <div className="max-w-4xl mx-auto">
          {notifications.map((notification) => (
            <Link
              to={`/anime/${notification.animeId}`}
              key={notification.id}
              className={`relative flex items-start gap-4 p-4 rounded-xl mb-4 transition-all ${
                notification.unread 
                  ? 'bg-gray-800 hover:bg-gray-750 border-l-4 border-blue-500' 
                  : 'bg-gray-800/50 hover:bg-gray-750'
              }`}
            >
              {/* Anime Image */}
              <div className="relative flex-shrink-0">
                <img 
                  src={notification.image} 
                  alt={notification.anime}
                  className="w-20 h-28 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = `https://placehold.co/80x112/1e3a8a/ffffff?text=${encodeURIComponent(notification.anime.charAt(0))}`
                  }}
                />
                {/* Type Icon Badge */}
                <div className={`absolute -bottom-2 -right-2 w-7 h-7 ${getIconBgColor(notification.type)} rounded-full flex items-center justify-center text-white shadow-lg`}>
                  {getNotificationIcon(notification.type)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium ${
                    notification.unread ? 'text-blue-400' : 'text-gray-400'
                  }`}>
                    {notification.title}
                  </span>
                  {notification.unread && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </div>
                <h3 className="text-white font-semibold text-lg mb-1 truncate">
                  {notification.anime}
                </h3>
                {notification.episode && (
                  <p className="text-gray-300 text-sm mb-1">{notification.episode}</p>
                )}
                {notification.description && (
                  <p className="text-gray-400 text-sm mb-1">{notification.description}</p>
                )}
                <div className="flex items-center gap-1 text-gray-500 text-xs mt-2">
                  <Clock className="w-3 h-3" />
                  {notification.time}
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0 mt-4" />
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {notifications.length === 0 && (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-xl">No notifications yet</p>
            <p className="text-gray-500 text-sm mt-2">Check back later for updates</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notification
