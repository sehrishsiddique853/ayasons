import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import AdminLayout from './components/layout/AdminLayout'

import Dashboard from './pages/Dashboard'
import Categories from './pages/Categories'
import Products from './pages/Products'
import HotSelling from './pages/HotSelling'
import Settings from './pages/Settings'

import './styles/admin.css'


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          element={<AdminLayout />}
        >

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/categories"
            element={<Categories />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/hot-selling"
            element={<HotSelling />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  )
}


export default App