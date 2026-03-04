import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Home from '../Home/Home'
import Navbar from '../Navbar/Navbar'
import Browse from '../Browse/Browse'
import NewSeason from '../New-Season/NewSeason'
import Trending from '../Trending/Trending'
import Genres from '../Genres/Genres'
import GenresAnime from '../GenresAnime/GenresAnime'
import Details from '../Details/Details'
import Notification from '../Notification/Notification'
import Login from '../Login/Login'
import Signup from '../Signup/Signup'
import Profile from '../Profile/Profile'
import Footer from '../Footer/Footer'

// Page transition animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
}

// Wrapper component for animated page
const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  )
}

const Layout = () => {
  const location = useLocation()

  return (
    <div>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
          <Route path="/browse" element={<AnimatedPage><Browse /></AnimatedPage>} />
          <Route path="/new-season" element={<AnimatedPage><NewSeason /></AnimatedPage>} />
          <Route path="/trending" element={<AnimatedPage><Trending /></AnimatedPage>} />
          <Route path="/genres" element={<AnimatedPage><Genres /></AnimatedPage>} />
          <Route path="/genres/:id" element={<AnimatedPage><GenresAnime /></AnimatedPage>} />
          <Route path="/anime/:id" element={<AnimatedPage><Details /></AnimatedPage>} />
          <Route path="/notifications" element={<AnimatedPage><Notification /></AnimatedPage>} />
          <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
          <Route path="/signup" element={<AnimatedPage><Signup /></AnimatedPage>} />
          <Route path="/profile" element={<AnimatedPage><Profile /></AnimatedPage>} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  )
}

export default Layout
