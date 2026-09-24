import {
  useEffect,
  useState,
} from 'react'

import {
  Layers3,
  Pencil,
  Trash2,
  Plus,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import api from '../services/api'

import '../styles/categories.css'


function Categories() {

  const [
    categories,
    setCategories,
  ] = useState([])


  const [
    loading,
    setLoading,
  ] = useState(true)


  const [
    error,
    setError,
  ] = useState('')


  useEffect(() => {

    let active = true


    const loadCategories =
      async () => {
        try {

          setLoading(true)
          setError('')


          const response =
            await api.get(
              '/admin/categories'
            )


          if (active) {
            setCategories(
              response.data.categories
            )
          }

        } catch (error) {

          console.error(
            'Categories error:',
            error
          )


          if (active) {
            setError(
              'Unable to load categories.'
            )
          }

        } finally {

          if (active) {
            setLoading(false)
          }

        }
      }


    loadCategories()


    return () => {
      active = false
    }

  }, [])

  const deleteCategory = async (category) => {
    const confirmed = window.confirm(
      `Delete "${category.name}" and all products inside it?`
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      await api.delete(`/admin/categories/${category.id}`)
      setCategories((current) =>
        current.filter((item) => item.id !== category.id)
      )
    } catch (error) {
      console.error('Category delete error:', error)
      setError(
        error.response?.data?.message ||
        'Unable to delete category.'
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

          <h1>
            Categories
          </h1>

          <p>
            Manage product categories
            displayed across the AYOSONS
            website.
          </p>

        </div>


        <Link
          className="categories-add-button"
          to="/categories/new"
        >
          <Plus size={18} />

          Add Category
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

            <h2>
              All Categories
            </h2>

            <p>
              {loading
                ? 'Loading...'
                : `${categories.length} categories`}
            </p>

          </div>

        </div>


        {loading ? (

          <div className="categories-state">
            Loading categories...
          </div>

        ) : categories.length === 0 ? (

          <div className="categories-state">

            <Layers3
              size={34}
              strokeWidth={1.5}
            />

            <strong>
              No categories found
            </strong>

            <span>
              Categories will appear
              here once created.
            </span>

          </div>

        ) : (

          <div className="categories-table-wrapper">

            <table className="categories-table">

              <thead>
                <tr>

                  <th>
                    Category
                  </th>

                  <th>
                    Showcase
                  </th>

                  <th>
                    Products
                  </th>

                  <th>
                    Order
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>
              </thead>


              <tbody>

                {categories.map(
                  (category) => (

                    <tr
                      key={
                        category.id
                      }
                    >

                      <td>

                        <div className="category-name-cell">

                          <div className="category-thumbnail">

                            <img
                              src={
                                category
                                  .image
                                  .url
                              }
                              alt={
                                category.name
                              }
                            />

                          </div>


                          <div>

                            <strong>
                              {
                                category.name
                              }
                            </strong>

                            <span>
                              /
                              {
                                category.slug
                              }
                            </span>

                          </div>

                        </div>

                      </td>


                      <td>

                        <span className="category-showcase">
                          {
                            category
                              .showcaseLabel ||
                            '—'
                          }
                        </span>

                      </td>


                      <td>

                        <span className="category-product-count">
                          {
                            category
                              .productCount
                          }
                        </span>

                      </td>


                      <td>

                        <span className="category-order">
                          {
                            category.order
                          }
                        </span>

                      </td>


                      <td>

                        <span
                          className={
                            category.active
                              ? 'category-status category-status--active'
                              : 'category-status category-status--inactive'
                          }
                        >

                          {
                            category.active
                              ? 'Active'
                              : 'Inactive'
                          }

                        </span>

                      </td>


                      <td>

                        <div className="category-actions">

                          <Link
                            className="category-action-button"
                            to={`/categories/${category.id}/edit`}
                            title="Edit category"
                          >
                            <Pencil
                              size={16}
                            />
                          </Link>


                          <button
                            type="button"
                            className="category-action-button category-action-button--danger"
                            title="Delete category"
                            onClick={() => deleteCategory(category)}
                          >
                            <Trash2
                              size={16}
                            />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  )
}


export default Categories
