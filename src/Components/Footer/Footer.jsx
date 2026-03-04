import React from 'react'
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white py-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">A</span>
              </div>
              <span className="text-2xl font-bold">
                <span className="text-white">Anime</span>
                <span className="text-blue-900">Stream</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Your ultimate destination for streaming the latest anime series and movies. 
              Watch anywhere, anytime, on any device.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Browse Anime</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">New Releases</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Trending Now</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Genres</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">My List</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 pt-10 pb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Subscribe to our Newsletter</h3>
              <p className="text-gray-400">Get the latest updates on new anime and exclusive offers.</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 md:w-64 px-4 py-3 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-r-lg transition-colors flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 AnimeStream. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
