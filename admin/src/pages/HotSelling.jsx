import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Save, Star } from 'lucide-react'

import api from '../services/api'

import '../styles/categories.css'

const slotNumbers = [1, 2, 3, 4, 5, 6, 7, 8]

function HotSelling() {
  const [selectedIds, setSelectedIds] = useState(Array(8).fill(''))
  const [availableProducts, setAvailableProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const selectedCount = useMemo(
    () => selectedIds.filter(Boolean).length,
    [selectedIds]
  )

  const hasDuplicates = useMemo(() => {
    const filled = selectedIds.filter(Boolean)
    return new Set(filled).size !== filled.length
  }, [selectedIds])

  const productsById = useMemo(
    () =>
      new Map(
        availableProducts.map((product) => [
          String(product.id),
          product,
        ])
      ),
    [availableProducts]
  )

  const canSave =
    selectedCount === 8 &&
    !hasDuplicates &&
    !saving

  useEffect(() => {
    let active = true

    const loadHotSelling = async () => {
      try {
        setLoading(true)
        setError('')
        setMessage('')

        const response = await api.get('/admin/hot-selling')
        const selected = Array(8).fill('')

        ;(response.data.products || []).forEach((product, index) => {
          const slot =
            product.featuredOrder &&
            product.featuredOrder >= 1 &&
            product.featuredOrder <= 8
              ? product.featuredOrder - 1
              : index

          if (slot >= 0 && slot < 8) {
            selected[slot] = String(product.id)
          }
        })

        if (!active) {
          return
        }

        setSelectedIds(selected)
        setAvailableProducts(response.data.availableProducts || [])
      } catch (error) {
        console.error('Hot Selling load error:', error)
        setError('Unable to load Hot Selling products.')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadHotSelling()

    return () => {
      active = false
    }
  }, [])

  const updateSlot = (slotIndex, value) => {
    setMessage('')
    setError('')

    setSelectedIds((current) =>
      current.map((item, index) =>
        index === slotIndex
          ? value
          : item
      )
    )
  }

  const saveHotSelling = async () => {
    try {
      setSaving(true)
      setError('')
      setMessage('')

      await api.put('/admin/hot-selling', {
        productIds: selectedIds.map((id) => Number(id)),
      })

      setMessage('Hot Selling products updated successfully.')
    } catch (error) {
      console.error('Hot Selling save error:', error)
      setError(
        error.response?.data?.message ||
        'Unable to save Hot Selling products.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="categories-page">
      <div className="admin-page-header">
        <div>
          <span className="admin-page-eyebrow">
            FEATURED
          </span>

          <h1>Hot Selling</h1>

          <p>
            Choose exactly 8 products to display in the website Hot Selling section.
          </p>
        </div>

        <button
          className="categories-add-button"
          type="button"
          disabled={!canSave}
          onClick={saveHotSelling}
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save 8 Products'}
        </button>
      </div>

      {error && (
        <div className="categories-error">
          {error}
        </div>
      )}

      {message && (
        <div className="categories-success">
          {message}
        </div>
      )}

      <div className="categories-card">
        <div className="categories-card-header">
          <div>
            <h2>Selected Products</h2>
            <p>
              {loading
                ? 'Loading...'
                : `${selectedCount} of 8 selected`}
            </p>
          </div>

          {hasDuplicates && (
            <span className="category-status category-status--inactive">
              Remove duplicate selections
            </span>
          )}
        </div>

        {loading ? (
          <div className="categories-state">
            Loading Hot Selling products...
          </div>
        ) : (
          <div className="hot-selling-slots">
            {slotNumbers.map((slot, index) => {
              const selectedProduct =
                productsById.get(selectedIds[index])

              return (
                <article className="hot-selling-slot" key={slot}>
                  <div className="hot-selling-slot-number">
                    <Star size={17} />
                    Slot {slot}
                  </div>

                  <select
                    value={selectedIds[index]}
                    onChange={(event) => updateSlot(index, event.target.value)}
                  >
                    <option value="">Choose product</option>
                    {availableProducts.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.category.name}
                      </option>
                    ))}
                  </select>

                  {selectedProduct && (
                    <div className="hot-selling-selected-product">
                      <img
                        src={selectedProduct.image.url}
                        alt={selectedProduct.name}
                      />

                      <div>
                        <strong>{selectedProduct.name}</strong>
                        <span>{selectedProduct.category.name}</span>
                      </div>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default HotSelling
