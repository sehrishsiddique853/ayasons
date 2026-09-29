import {
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'

import {
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'

import Navbar from './components/layout/Navbar'
import ImagePreloader from './components/common/ImagePreloader'
import { ContactSettingsProvider } from './context/ContactSettingsContext'
import { loadProductCategories } from './services/productCategoriesCache'
import { loadHomepageContent } from './services/homepageContentCache'

import Home from './pages/Home'

import ProductCategoryPage from './components/products/shared/ProductCategoryPage'
import About
  from './pages/About'
import Manufacturing
  from './pages/Manufacturing'
import './App.css'
import './style/Hero.css'
import './style/AboutSection.css'
import './style/ManufactureSection.css'
import './style/ManufacturingExcellence.css'
import './style/Footer.css'
import Products
  from './pages/Products'

  import Contact
  from './pages/Contact'

function ScrollManager() {
  const location = useLocation()

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

  useLayoutEffect(() => {
    const root = document.documentElement
    const previousScrollBehavior = root.style.scrollBehavior

    root.style.scrollBehavior = 'auto'

    if (location.hash) {
      const section = document.querySelector(
        location.hash
      )

      if (section) {
        section.scrollIntoView({
          behavior: 'auto',
          block: 'start',
        })

        root.style.scrollBehavior = previousScrollBehavior
        return
      }
    }

    window.scrollTo({
      left: 0,
      top: 0,
      behavior: 'auto',
    })

    root.style.scrollBehavior = previousScrollBehavior
  }, [
    location.pathname,
    location.hash,
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
  useEffect(() => {
    const warmProductsPage = () => {
      loadProductCategories().catch(() => {})
      loadHomepageContent().catch(() => {})
    }

    const idleId = window.requestIdleCallback
      ? window.requestIdleCallback(warmProductsPage, {
          timeout: 2500,
        })
      : window.setTimeout(warmProductsPage, 1200)

    return () => {
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(idleId)
      } else {
        window.clearTimeout(idleId)
      }
    }
  }, [])

  return (
    <ContactSettingsProvider>
      <div className="site-shell">

      <ImagePreloader />

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

          <Route
  path="/manufacturing"
  element={
    <Manufacturing />
  }
/>

<Route
  path="/contact"
  element={
    <Contact />
  }
/>

<Route
  path="/about"
  element={
    <About />
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
  path="/products"
  element={
    <Products />
  }
/>

          <Route
            path="/products/:categorySlug"
            element={
              <ProductCategoryPage />
            }
          />

        </Routes>
      </main>

      </div>
    </ContactSettingsProvider>
  )
}


export default App
