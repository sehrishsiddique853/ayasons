import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import {
  AuthProvider,
} from './context/AuthContext'

import ProtectedRoute
  from './components/auth/ProtectedRoute'

import AdminLayout
  from './components/layout/AdminLayout'

import Login
  from './pages/Login'

import Dashboard
  from './pages/Dashboard'

import Categories
  from './pages/Categories'

import AddCategory
  from './pages/AddCategory'

import EditCategory
  from './pages/EditCategory'

import Products
  from './pages/Products'

import AddProduct
  from './pages/AddProduct'

import EditProduct
  from './pages/EditProduct'

import HotSelling
  from './pages/HotSelling'

import Settings
  from './pages/Settings'

import HomeContent
  from './pages/HomeContent'

import OurProcess
  from './pages/OurProcess'

import Departments
  from './pages/Departments'

import Contact
  from './pages/Contact'

import Certifications
  from './pages/Certifications'

import './styles/admin.css'


function App() {

  return (

    <BrowserRouter>

      <AuthProvider>

        <Routes>

          {/* PUBLIC LOGIN */}

          <Route
            path="/login"
            element={<Login />}
          />


          {/* AUTHENTICATED ADMIN */}

          <Route
            element={
              <ProtectedRoute />
            }
          >

            <Route
              element={
                <AdminLayout />
              }
            >

              <Route
                path="/"
                element={
                  <Dashboard />
                }
              />


              <Route
                path="/categories"
                element={
                  <Categories />
                }
              />


              <Route
                path="/categories/new"
                element={
                  <AddCategory />
                }
              />


              <Route
                path="/categories/:id/edit"
                element={
                  <EditCategory />
                }
              />


              <Route
                path="/products"
                element={
                  <Products />
                }
              />


              <Route
                path="/products/new"
                element={
                  <AddProduct />
                }
              />


              <Route
                path="/products/:id/edit"
                element={
                  <EditProduct />
                }
              />


              <Route
                path="/hot-selling"
                element={
                  <HotSelling />
                }
              />


              <Route
                path="/home-content"
                element={
                  <HomeContent />
                }
              />


              <Route
                path="/our-process"
                element={
                  <OurProcess />
                }
              />


              <Route
                path="/departments"
                element={
                  <Departments />
                }
              />


              <Route
                path="/certifications"
                element={
                  <Certifications />
                }
              />


              <Route
                path="/contact"
                element={
                  <Contact />
                }
              />


              <Route
                path="/settings"
                element={
                  <Settings />
                }
              />

            </Route>

          </Route>

        </Routes>

      </AuthProvider>

    </BrowserRouter>

  )

}


export default App