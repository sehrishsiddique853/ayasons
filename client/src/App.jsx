import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import Navbar from './components/layout/Navbar'
import Home from './pages/Home'

import Activewear from './components/products/activewear'
import Sportswear from './components/products/sportswear'
import Streetwear from './components/products/streetwear'
import Workwear from './components/products/workwear'
import VarsityJackets from './components/products/varsity-jackets'
import Headwear from './components/products/headwear'
import Accessories from './components/products/accessories'

import './App.css'
import './style/Hero.css'
import './style/AboutSection.css'
import './style/ManufactureSection.css'
import './style/ManufacturingExcellence.css'
import './style/Footer.css'

function ScrollToHash() {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    window.requestAnimationFrame(() => {
      const section = document.querySelector(hash)

      if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
      }
    })
  }, [hash, pathname])

  return null
}

function App() {
  return (
    <div className="site-shell">

      <ScrollToHash />

      <Navbar />

      <main>
        <Routes>

          {/* HOME */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* PRODUCT CATEGORY PAGES */}
          <Route
            path="/products/activewear"
            element={<Activewear />}
          />

          <Route
            path="/products/sportswear"
            element={<Sportswear />}
          />

          <Route
            path="/products/streetwear"
            element={<Streetwear />}
          />

          <Route
            path="/products/workwear"
            element={<Workwear />}
          />

          <Route
            path="/products/varsity-jackets"
            element={<VarsityJackets />}
          />

          <Route
            path="/products/headwear"
            element={<Headwear />}
          />

          <Route
            path="/products/accessories"
            element={<Accessories />}
          />

        </Routes>
      </main>

    </div>
  )
}

export default App
