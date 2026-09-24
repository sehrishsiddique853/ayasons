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
  name: '',
  slug: '',
  eyebrow: '',
  showcaseLabel: '',
  heroTitle: '',
  description: '',
  collectionDescription: '',
  groupsText: '',
  order: 0,
  active: true,
  heroImage: null,
  collectionImage: null,
}

const slugify = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

function CategoryForm({
  categoryId,
  mode,
}) {
  const navigate = useNavigate()
  const isEdit = mode === 'edit'

  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const title = isEdit ? 'Edit Category' : 'Add Category'

  const heroPreview = useMemo(
    () =>
      form.heroImage
        ? URL.createObjectURL(form.heroImage)
        : form.heroImageUrl,
    [form.heroImage, form.heroImageUrl]
  )

  const collectionPreview = useMemo(
    () =>
      form.collectionImage
        ? URL.createObjectURL(form.collectionImage)
        : form.collectionImageUrl,
    [form.collectionImage, form.collectionImageUrl]
  )

  useEffect(() => {
    if (!isEdit) {
      return undefined
    }

    let active = true

    const loadCategory = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get(`/admin/categories/${categoryId}`)
        const category = response.data.category

        if (!active) {
          return
        }

        setForm({
          ...emptyForm,
          name: category.name || '',
          slug: category.slug || '',
          eyebrow: category.eyebrow || '',
          showcaseLabel: category.showcaseLabel || '',
          heroTitle: category.heroTitle || '',
          description: category.description || '',
          collectionDescription: category.collectionDescription || '',
          groupsText: (category.groups || []).join('\n'),
          order: category.order || 0,
          active: Boolean(category.active),
          heroImageUrl: category.heroImage?.url,
          collectionImageUrl: category.collectionImage?.url,
        })
      } catch (error) {
        console.error('Category load error:', error)
        setError('Unable to load category.')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadCategory()

    return () => {
      active = false
    }
  }, [categoryId, isEdit])

  useEffect(() => {
    return () => {
      if (form.heroImage && heroPreview) {
        URL.revokeObjectURL(heroPreview)
      }

      if (form.collectionImage && collectionPreview) {
        URL.revokeObjectURL(collectionPreview)
      }
    }
  }, [collectionPreview, form.collectionImage, form.heroImage, heroPreview])

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

      const data = new FormData()
      const groups = form.groupsText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)

      data.append('name', form.name)
      data.append(
        'slug',
        form.slug || slugify(form.name)
      )
      data.append('eyebrow', form.eyebrow)
      data.append('showcaseLabel', form.showcaseLabel)
      data.append('heroTitle', form.heroTitle)
      data.append('description', form.description)
      data.append('collectionDescription', form.collectionDescription)
      data.append('groups', JSON.stringify(groups))
      data.append('order', String(form.order || 0))
      data.append('active', String(form.active))

      if (form.heroImage) {
        data.append('heroImage', form.heroImage)
      }

      if (form.collectionImage) {
        data.append('collectionImage', form.collectionImage)
      }

      if (isEdit) {
        await api.put(`/admin/categories/${categoryId}`, data)
      } else {
        await api.post('/admin/categories', data)
      }

      navigate('/categories')
    } catch (error) {
      console.error('Category save error:', error)
      setError(
        error.response?.data?.message ||
        'Unable to save category.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="catalog-form-state">
        Loading category...
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

          <h1>{title}</h1>

          <p>
            Fill in what customers should see on the website. The page link is created for you from the category name.
          </p>
        </div>

        <Link className="catalog-secondary-button" to="/categories">
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
            Basic website information
          </div>

          <label>
            <span>Category name</span>
            <input
              value={form.name}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder="Activewear"
              required
            />
            <small>
              This is the main category name shown on cards and headings.
            </small>
          </label>

          <label>
            <span>Website page link</span>
            <input
              value={form.slug}
              onChange={(event) => updateField('slug', slugify(event.target.value))}
              placeholder="activewear"
            />
            <small>
              Auto-filled from the name. Use lowercase words with dashes only if you need to change it.
            </small>
          </label>

          <label>
            <span>Small label above title</span>
            <input
              value={form.eyebrow}
              onChange={(event) => updateField('eyebrow', event.target.value)}
              placeholder="Activewear"
            />
            <small>
              Short text shown above the main page heading.
            </small>
          </label>

          <label>
            <span>Home page card label</span>
            <input
              value={form.showcaseLabel}
              onChange={(event) => updateField('showcaseLabel', event.target.value)}
              placeholder="Gym & Fitness"
            />
            <small>
              Short label used on the home page category showcase.
            </small>
          </label>

          <label className="catalog-field-wide">
            <span>Large page title</span>
            <input
              value={form.heroTitle}
              onChange={(event) => updateField('heroTitle', event.target.value)}
              placeholder="Performance Made For Movement"
              required
            />
            <small>
              This is the big headline at the top of the category page.
            </small>
          </label>

          <label className="catalog-field-wide">
            <span>Main description</span>
            <textarea
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              placeholder="Custom gym, fitness and activewear manufactured for brands, studios and performance-focused collections."
              required
            />
            <small>
              Write one or two clear sentences for customers.
            </small>
          </label>

          <label className="catalog-field-wide">
            <span>Collection section description</span>
            <textarea
              value={form.collectionDescription}
              onChange={(event) => updateField('collectionDescription', event.target.value)}
              placeholder="Custom activewear designed around comfort, performance and movement."
            />
            <small>
              Optional. If left blank, the main description will be used.
            </small>
          </label>

          <label className="catalog-field-wide">
            <span>Product groups shown on this category page</span>
            <textarea
              value={form.groupsText}
              onChange={(event) => updateField('groupsText', event.target.value)}
              placeholder="Men's Activewear&#10;Women's Activewear"
            />
            <small>
              Type one group per line. Example: Men&apos;s Activewear, Women&apos;s Activewear.
            </small>
          </label>

          <div className="catalog-form-section catalog-field-wide">
            Images and visibility
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

          <label className="catalog-checkbox">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) => updateField('active', event.target.checked)}
            />
            <span>Show this category on the website</span>
          </label>

          <label>
            <span>Top banner image {isEdit ? '(optional)' : ''}</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => updateField('heroImage', event.target.files?.[0] || null)}
              required={!isEdit}
            />
            <small>
              Used as the large image at the top of the category page.
            </small>
            {heroPreview && (
              <img className="catalog-image-preview" src={heroPreview} alt="" />
            )}
          </label>

          <label>
            <span>Category card image {isEdit ? '(optional)' : ''}</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => updateField('collectionImage', event.target.files?.[0] || null)}
              required={!isEdit}
            />
            <small>
              Used on the home page and inside the collection section.
            </small>
            {collectionPreview && (
              <img className="catalog-image-preview" src={collectionPreview} alt="" />
            )}
          </label>
        </div>

        <div className="catalog-form-actions">
          <button className="categories-add-button" type="submit" disabled={saving}>
            <Save size={17} />
            {saving ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CategoryForm
