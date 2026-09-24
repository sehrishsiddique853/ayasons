import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'

import api from '../../services/api'

import '../../styles/category-form.css'

const emptyForm = {
  categoryId: '',
  name: '',
  slug: '',
  group: '',
  description: '',
  featuresText: '',
  order: 0,
  active: true,
  featured: false,
  featuredOrder: '',
  image: null,
}

const slugify = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

function ProductForm({
  mode,
  productId,
}) {
  const navigate = useNavigate()
  const isEdit = mode === 'edit'

  const [form, setForm] = useState(emptyForm)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const imagePreview = useMemo(
    () =>
      form.image
        ? URL.createObjectURL(form.image)
        : form.imageUrl,
    [form.image, form.imageUrl]
  )

  useEffect(() => {
    let active = true

    const loadData = async () => {
      try {
        setLoading(true)
        setError('')

        const requests = [
          api.get('/admin/categories'),
        ]

        if (isEdit) {
          requests.push(api.get(`/admin/products/${productId}`))
        }

        const [categoryResponse, productResponse] = await Promise.all(requests)

        if (!active) {
          return
        }

        const loadedCategories = categoryResponse.data.categories || []
        setCategories(loadedCategories)

        if (productResponse) {
          const product = productResponse.data.product

          setForm({
            ...emptyForm,
            categoryId: String(product.categoryId || product.category?.id || ''),
            name: product.name || '',
            slug: product.slug || '',
            group: product.group || '',
            description: product.description || '',
            featuresText: (product.features || []).join('\n'),
            order: product.order || 0,
            active: Boolean(product.active),
            featured: Boolean(product.featured),
            featuredOrder: product.featuredOrder
              ? String(product.featuredOrder)
              : '',
            imageUrl: product.image?.url,
          })
        } else {
          setForm((current) => ({
            ...current,
            categoryId: loadedCategories[0]?.id
              ? String(loadedCategories[0].id)
              : '',
          }))
        }
      } catch (error) {
        console.error('Product form load error:', error)
        setError('Unable to load product form data.')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      active = false
    }
  }, [isEdit, productId])

  useEffect(() => {
    return () => {
      if (form.image && imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [form.image, imagePreview])

  const updateField = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleNameChange = (value) => {
    setForm((current) => ({
      ...current,
      name: value,
      slug:
        current.slug && isEdit
          ? current.slug
          : slugify(value),
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setSaving(true)
      setError('')

      const features = form.featuresText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)

      const data = new FormData()

      data.append('categoryId', form.categoryId)
      data.append('name', form.name)
      data.append(
        'slug',
        form.slug || slugify(form.name)
      )
      data.append('group', form.group)
      data.append('description', form.description)
      data.append('features', JSON.stringify(features))
      data.append('order', String(form.order || 0))
      data.append('active', String(form.active))
      data.append('featured', String(form.featured))
      data.append('featuredOrder', form.featuredOrder)

      if (form.image) {
        data.append('image', form.image)
      }

      if (isEdit) {
        await api.put(`/admin/products/${productId}`, data)
      } else {
        await api.post('/admin/products', data)
      }

      navigate('/products')
    } catch (error) {
      console.error('Product save error:', error)
      setError(
        error.response?.data?.message ||
        'Unable to save product.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="catalog-form-state">
        Loading product...
      </div>
    )
  }

  return (
    <div className="catalog-form-page">
      <div className="admin-page-header">
        <div>
          <span className="admin-page-eyebrow">
            CATALOG
          </span>

          <h1>
            {isEdit ? 'Edit Product' : 'Add Product'}
          </h1>

          <p>
            Add the product information customers will see. The page link is created automatically from the product name.
          </p>
        </div>

        <Link className="catalog-secondary-button" to="/products">
          <ArrowLeft size={17} />
          Back
        </Link>
      </div>

      {error && (
        <div className="categories-error">
          {error}
        </div>
      )}

      <form className="catalog-form-card" onSubmit={handleSubmit}>
        <div className="catalog-form-grid">
          <div className="catalog-form-section catalog-field-wide">
            Basic product information
          </div>

          <label>
            <span>Category</span>
            <select
              value={form.categoryId}
              onChange={(event) => updateField('categoryId', event.target.value)}
              required
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <small>
              Choose where this product should appear.
            </small>
          </label>

          <label>
            <span>Product name</span>
            <input
              value={form.name}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder="Men's Training T-Shirt"
              required
            />
            <small>
              This is the product title shown on the website.
            </small>
          </label>

          <label>
            <span>Website page link</span>
            <input
              value={form.slug}
              onChange={(event) => updateField('slug', slugify(event.target.value))}
              placeholder="mens-training-t-shirt"
            />
            <small>
              Auto-filled from the product name. Only edit if you want a specific URL.
            </small>
          </label>

          <label>
            <span>Product group</span>
            <input
              value={form.group}
              onChange={(event) => updateField('group', event.target.value)}
              placeholder="Team Sportswear"
            />
            <small>
              Optional. Example: Men&apos;s Activewear, Training Wear, Uniforms.
            </small>
          </label>

          <label className="catalog-field-wide">
            <span>Product description</span>
            <textarea
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              placeholder="Performance-focused tops designed for training, fitness and everyday active use."
              required
            />
            <small>
              Write one short customer-friendly description.
            </small>
          </label>

          <label className="catalog-field-wide">
            <span>Product highlights</span>
            <textarea
              value={form.featuresText}
              onChange={(event) => updateField('featuresText', event.target.value)}
              placeholder="Custom Colors&#10;Custom Branding&#10;Custom Sizes"
            />
            <small>
              Type one highlight per line. These appear under the product description.
            </small>
          </label>

          <div className="catalog-form-section catalog-field-wide">
            Image and visibility
          </div>

          <label>
            <span>Sort order</span>
            <input
              type="number"
              min="0"
              value={form.order}
              onChange={(event) => updateField('order', event.target.value)}
            />
            <small>
              Lower numbers appear first. You can leave this as 0.
            </small>
          </label>

          <label>
            <span>Product Image {isEdit ? '(optional)' : ''}</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => updateField('image', event.target.files?.[0] || null)}
              required={!isEdit}
            />
            <small>
              Upload a clear product image. JPG, PNG or WEBP are supported.
            </small>
            {imagePreview && (
              <img className="catalog-image-preview" src={imagePreview} alt="" />
            )}
          </label>

          <label className="catalog-checkbox">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) => updateField('active', event.target.checked)}
            />
            <span>Show this product on the website</span>
          </label>

          <label className="catalog-checkbox">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => updateField('featured', event.target.checked)}
            />
            <span>Show in Hot Selling products</span>
          </label>

          {form.featured && (
            <label>
              <span>Hot Selling slot</span>
              <select
                value={form.featuredOrder}
                onChange={(event) => updateField('featuredOrder', event.target.value)}
                required
              >
                <option value="">Choose slot</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((slot) => (
                  <option key={slot} value={slot}>
                    Slot {slot}
                  </option>
                ))}
              </select>
              <small>
                There are exactly 8 Hot Selling slots. Choosing an occupied slot replaces the old product.
              </small>
            </label>
          )}
        </div>

        <div className="catalog-form-actions">
          <button className="categories-add-button" type="submit" disabled={saving}>
            <Save size={17} />
            {saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm
