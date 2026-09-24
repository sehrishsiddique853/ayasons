import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import AdminLayout from './components/layout/AdminLayout'
import './styles/admin.css'
import Dashboard from './pages/Dashboard'
import Categories from './pages/Categories'
import AddCategory from './pages/AddCategory'
import EditCategory from './pages/EditCategory'
import Products from './pages/Products'
import AddProduct from './pages/AddProduct'
import EditProduct from './pages/EditProduct'
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
            path="/categories/new"
            element={<AddCategory />}
          />

          <Route
            path="/categories/:id/edit"
            element={<EditCategory />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/products/new"
            element={<AddProduct />}
          />

          <Route
            path="/products/:id/edit"
            element={<EditProduct />}
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
