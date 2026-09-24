import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Link } from 'react-router-dom'
import {
  Boxes,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'

import api from '../services/api'

import '../styles/categories.css'

function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const filteredProducts = useMemo(
    () =>
      categoryId
        ? products.filter((product) => String(product.categoryId) === categoryId)
        : products,
    [categoryId, products]
  )

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')

      const [productResponse, categoryResponse] = await Promise.all([
        api.get('/admin/products'),
        api.get('/admin/categories'),
      ])

      setProducts(productResponse.data.products || [])
      setCategories(categoryResponse.data.categories || [])
    } catch (error) {
      console.error('Products error:', error)
      setError('Unable to load products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const deleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}"?`
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      await api.delete(`/admin/products/${product.id}`)
      setProducts((current) =>
        current.filter((item) => item.id !== product.id)
      )
    } catch (error) {
      console.error('Product delete error:', error)
      setError(
        error.response?.data?.message ||
        'Unable to delete product.'
      )
    }
  }

  return (
    <div className="categories-page">
      <div className="admin-page-header">
        <div>
          <span className="admin-page-eyebrow">
            CATALOG
          </span>

          <h1>Products</h1>

          <p>
            Manage AYOSONS product cards, images and category placement.
          </p>
        </div>

        <Link
          className="categories-add-button"
          to="/products/new"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {error && (
        <div className="categories-error">
          {error}
        </div>
      )}

      <div className="categories-card">
        <div className="categories-card-header">
          <div>
            <h2>All Products</h2>
            <p>
              {loading
                ? 'Loading...'
                : `${filteredProducts.length} products`}
            </p>
          </div>

          <select
            className="catalog-filter"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="categories-state">
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="categories-state">
            <Boxes size={34} strokeWidth={1.5} />
            <strong>No products found</strong>
            <span>
              Add products to populate the website catalog.
            </span>
          </div>
        ) : (
          <div className="categories-table-wrapper">
            <table className="categories-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Group</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="category-name-cell">
                        <div className="category-thumbnail">
                          <img src={product.image.url} alt={product.name} />
                        </div>

                        <div>
                          <strong>{product.name}</strong>
                          <span>/{product.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="category-showcase">
                        {product.category?.name || 'Unassigned'}
                      </span>
                    </td>

                    <td>
                      <span className="category-showcase">
                        {product.group || '-'}
                      </span>
                    </td>

                    <td>
                      <span className="category-order">
                        {product.order}
                      </span>
                    </td>

                    <td>
                      <div className="catalog-status-stack">
                        <span
                          className={
                            product.active
                              ? 'category-status category-status--active'
                              : 'category-status category-status--inactive'
                          }
                        >
                          {product.active ? 'Active' : 'Inactive'}
                        </span>

                        {product.featured && (
                          <span className="category-status category-status--featured">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <div className="category-actions">
                        <Link
                          className="category-action-button"
                          to={`/products/${product.id}/edit`}
                          title="Edit product"
                        >
                          <Pencil size={16} />
                        </Link>

                        <button
                          type="button"
                          className="category-action-button category-action-button--danger"
                          title="Delete product"
                          onClick={() => deleteProduct(product)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
