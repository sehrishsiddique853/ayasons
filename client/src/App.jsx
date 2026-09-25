import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  Routes,
  Route,
  useLocation,
  useNavigationType,
} from 'react-router-dom'

import Navbar from './components/layout/Navbar'

import Home from './pages/Home'

import ProductCategoryPage from './components/products/shared/ProductCategoryPage'


import './App.css'
import './style/Hero.css'
import './style/AboutSection.css'
import './style/ManufactureSection.css'
import './style/ManufacturingExcellence.css'
import './style/Footer.css'


function ScrollManager() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const scrollPositions = useRef(new Map())

  useEffect(() => {
    if (
      'scrollRestoration' in
      window.history
    ) {
      const previousValue =
        window.history.scrollRestoration

      window.history.scrollRestoration =
        'manual'

      return () => {
        window.history.scrollRestoration =
          previousValue
      }
    }

    return undefined
  }, [])

  useEffect(() => {
    return () => {
      scrollPositions.current.set(
        location.key,
        {
          x:
            window.scrollX,

          y:
            window.scrollY,
        }
      )
    }
  }, [
    location.key,
  ])

  useEffect(() => {
    const scrollFrame =
      window.requestAnimationFrame(
        () => {
          if (location.hash) {
            const section =
              document.querySelector(
                location.hash
              )

            if (section) {
              section.scrollIntoView({
                behavior:
                  'smooth',
              })
            }

            return
          }

          if (
            navigationType ===
            'POP'
          ) {
            const position =
              scrollPositions
                .current
                .get(location.key)

            window.scrollTo({
              left:
                position?.x || 0,

              top:
                position?.y || 0,

              behavior:
                'auto',
            })

            return
          }

          window.scrollTo({
            left: 0,

            top: 0,

            behavior:
              'auto',
          })
        }
      )

    return () => {
      window.cancelAnimationFrame(
        scrollFrame
      )
    }
  }, [
    location.key,
    location.hash,
    navigationType,
  ])


  return null
}


function RouteLoadingBar() {
  const location = useLocation()

  const [
    isVisible,
    setIsVisible,
  ] = useState(false)


  useEffect(() => {
    setIsVisible(true)

    const timeoutId =
      window.setTimeout(
        () => {
          setIsVisible(false)
        },
        650
      )

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [
    location.pathname,
    location.search,
  ])


  if (!isVisible) {
    return null
  }


  return (
    <div
      className="route-loading-bar"
      aria-hidden="true"
    />
  )
}


function App() {
  return (
    <div className="site-shell">

      <ScrollManager />

      <RouteLoadingBar />


      <Navbar />


      <main>
        <Routes>

          {/* HOME */}

          <Route
            path="/"
            element={
              <Home />
            }
          />


          {/*
          |--------------------------------------------------------------------------
          | DYNAMIC PRODUCT CATEGORY PAGE
          |--------------------------------------------------------------------------
          |
          | Examples:
          |
          | /products/activewear
          | /products/sportswear
          | /products/streetwear
          | /products/shoes
          | /products/boxing-gear
          |
          */}

          <Route
            path="/products/:categorySlug"
            element={
              <ProductCategoryPage />
            }
          />

        </Routes>
      </main>

    </div>
  )
}


export default App
