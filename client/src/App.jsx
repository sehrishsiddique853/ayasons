import {
  useEffect,
} from 'react'

import {
  Routes,
  Route,
  useLocation,
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


function ScrollToHash() {
  const {
    hash,
    pathname,
  } = useLocation()


  useEffect(() => {

    if (!hash) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })

      return
    }


    window.requestAnimationFrame(
      () => {
        const section =
          document.querySelector(
            hash
          )


        if (section) {
          section.scrollIntoView({
            behavior: 'smooth',
          })
        }
      }
    )

  }, [
    hash,
    pathname,
  ])


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