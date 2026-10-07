import { useEffect, useMemo, useState } from 'react'
import { Edit3, Plus, Save, Trash2, X } from 'lucide-react'
import api from '../../services/api'
import '../../styles/product-customizer-manager.css'

const emptyForm = {
  id: null,
  name: '',
  description: '',
  sizesText: '',
  colorsText: 'Black | #080808\nWhite | #ffffff',
  colorZonesText: 'Primary Color\nSecondary Color\nTrim / Accent Color',
  optionsText: '',
  specificationsText: '',
  allowCustomColor: true,
  allowLogoUpload: false,
  allowPlayerName: false,
  allowPlayerNumber: false,
  allowCustomNotes: true,
  active: true,
  order: 0,
  image: null,
  imageUrl: '',
}

const parseColors = (text) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [namePart, valuePart] = line.split('|').map((part) => part.trim())
      const value = valuePart || namePart
      return { name: valuePart ? namePart : value, value }
    })

const parseOptionGroups = (text) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [namePart, valuesPart = ''] = line.split(':')
      const name = namePart.trim()
      const values = valuesPart
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)

      return {
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        values,
      }
    })

const toColorsText = (colors = []) =>
  colors
    .map((color) =>
      typeof color === 'string'
        ? color
        : `${color.name || color.value} | ${color.value}`
    )
    .join('\n')

const toOptionsText = (groups = []) =>
  groups
    .map((group) => {
      const values = (group.values || [])
        .map((value) => typeof value === 'string' ? value : value.label || value.value)
        .join(', ')
      return `${group.name}: ${values}`
    })
    .join('\n')

const parseSpecifications = (text) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...valueParts] = line.split('|')
      return {
        label: (label || '').trim(),
        value: valueParts.join('|').trim(),
      }
    })
    .filter((item) => item.label && item.value)

const toSpecificationsText = (specifications = []) =>
  specifications
    .map((item) => `${item.label} | ${item.value}`)
    .join('\n')

function ProductCustomizerManager({ productId }) {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const imagePreview = useMemo(
    () => form.image ? URL.createObjectURL(form.image) : form.imageUrl,
    [form.image, form.imageUrl]
  )

  const loadItems = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/admin/products/${productId}/customizer`)
      setItems(response.data.items || [])
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load customizer items.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [productId])

  useEffect(() => {
    return () => {
      if (form.image && imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [form.image, imagePreview])

  const updateField = (name, value) =>
    setForm((current) => ({ ...current, [name]: value }))

  const openNew = () => {
    setForm({ ...emptyForm, order: items.length + 1 })
    setShowForm(true)
    setError('')
  }

  const openEdit = (item) => {
    setForm({
      ...emptyForm,
      id: item.id,
      name: item.name || '',
      description: item.description || '',
      sizesText: (item.sizes || []).join('\n'),
      colorsText: toColorsText(item.colors),
      colorZonesText: (item.colorZones || ['Primary Color']).join('\n'),
      optionsText: toOptionsText(item.optionGroups),
      specificationsText: toSpecificationsText(item.specifications),
      allowCustomColor: Boolean(item.allowCustomColor),
      allowLogoUpload: Boolean(item.allowLogoUpload),
      allowPlayerName: Boolean(item.allowPlayerName),
      allowPlayerNumber: Boolean(item.allowPlayerNumber),
      allowCustomNotes: Boolean(item.allowCustomNotes),
      active: Boolean(item.active),
      order: item.order || 0,
      image: null,
      imageUrl: item.image?.url || '',
    })
    setShowForm(true)
    setError('')
  }

  const closeForm = () => {
    setShowForm(false)
    setForm(emptyForm)
  }

  const saveItem = async (event) => {
    event.preventDefault()

    try {
      setSaving(true)
      setError('')

      const data = new FormData()
      data.append('name', form.name)
      data.append('description', form.description)
      data.append(
        'sizes',
        JSON.stringify(
          form.sizesText.split('\n').map((item) => item.trim()).filter(Boolean)
        )
      )
      data.append('colors', JSON.stringify(parseColors(form.colorsText)))
      data.append(
        'colorZones',
        JSON.stringify(form.colorZonesText.split('\n').map((item) => item.trim()).filter(Boolean))
      )
      data.append('optionGroups', JSON.stringify(parseOptionGroups(form.optionsText)))
      data.append('specifications', JSON.stringify(parseSpecifications(form.specificationsText)))
      data.append('allowCustomColor', String(form.allowCustomColor))
      data.append('allowLogoUpload', String(form.allowLogoUpload))
      data.append('allowPlayerName', String(form.allowPlayerName))
      data.append('allowPlayerNumber', String(form.allowPlayerNumber))
      data.append('allowCustomNotes', String(form.allowCustomNotes))
      data.append('active', String(form.active))
      data.append('order', String(form.order || 0))

      if (form.image) data.append('image', form.image)

      if (form.id) {
        await api.put(
          `/admin/products/${productId}/customizer/items/${form.id}`,
          data
        )
      } else {
        await api.post(
          `/admin/products/${productId}/customizer/items`,
          data
        )
      }

      closeForm()
      await loadItems()
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save customizer item.')
    } finally {
      setSaving(false)
    }
  }

  const deleteItem = async (item) => {
    if (!window.confirm(`Delete "${item.name}" from this product customizer?`)) return

    try {
      setError('')
      await api.delete(
        `/admin/products/${productId}/customizer/items/${item.id}`
      )
      await loadItems()
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete item.')
    }
  }

  return (
    <section className="pcm">
      <div className="pcm-head">
        <div>
          <span className="admin-page-eyebrow">PRODUCT BUILDER</span>
          <h2>Customer Customization</h2>
          <p>
            Add the compact cards customers can select and customize. Images, sizes,
            colors and options are loaded from the database.
          </p>
        </div>

        <button className="categories-add-button" type="button" onClick={openNew}>
          <Plus size={17} />
          Add Customizable Item
        </button>
      </div>

      {error && <div className="categories-error">{error}</div>}

      {loading ? (
        <div className="pcm-empty">Loading customizer...</div>
      ) : items.length === 0 ? (
        <div className="pcm-empty">
          No customizer items yet. Add the first item to enable the Customize Product button.
        </div>
      ) : (
        <div className="pcm-list">
          {items.map((item) => (
            <article className="pcm-card" key={item.id}>
              <div className="pcm-thumb">
                <img src={item.image?.url} alt="" />
              </div>

              <div className="pcm-info">
                <div className="pcm-title-row">
                  <h3>{item.name}</h3>
                  {!item.active && <span className="pcm-badge">Hidden</span>}
                </div>
                <p>{item.description}</p>
                <div className="pcm-meta">
                  <span>{item.sizes?.length || 0} sizes</span>
                  <span>{item.colors?.length || 0} colors</span>
                  <span>{item.optionGroups?.length || 0} option groups</span>
                  <span>Order {item.order}</span>
                </div>
              </div>

              <div className="pcm-actions">
                <button type="button" onClick={() => openEdit(item)}>
                  <Edit3 size={16} /> Edit
                </button>
                <button type="button" className="pcm-delete" onClick={() => deleteItem(item)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {showForm && (
        <form className="pcm-editor" onSubmit={saveItem}>
          <div className="pcm-editor-head">
            <div>
              <h3>{form.id ? 'Edit Customizable Item' : 'Add Customizable Item'}</h3>
              <p>Everything saved here appears dynamically on the customer product builder.</p>
            </div>
            <button type="button" className="pcm-close" onClick={closeForm} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          <div className="pcm-grid">
            <label>
              <span>Item name</span>
              <input
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="Jersey / Shirt"
                required
              />
            </label>

            <label>
              <span>Sort order</span>
              <input
                type="number"
                min="0"
                value={form.order}
                onChange={(event) => updateField('order', event.target.value)}
              />
            </label>

            <label className="pcm-wide">
              <span>Description</span>
              <textarea
                value={form.description}
                onChange={(event) => updateField('description', event.target.value)}
                placeholder="Short customer-friendly description..."
                required
              />
            </label>

            <label className="pcm-wide">
              <span>Item image {form.id ? '(optional replacement)' : ''}</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => updateField('image', event.target.files?.[0] || null)}
              />
              <small>If no item image is uploaded, the customer page falls back to the main product image.</small>
              {imagePreview && <img className="pcm-preview" src={imagePreview} alt="" />}
            </label>

            <label>
              <span>Sizes</span>
              <textarea
                value={form.sizesText}
                onChange={(event) => updateField('sizesText', event.target.value)}
                placeholder={'XS\nS\nM\nL\nXL'}
              />
              <small>One size per line.</small>
            </label>

            <label>
              <span>Preset colors</span>
              <textarea
                value={form.colorsText}
                onChange={(event) => updateField('colorsText', event.target.value)}
                placeholder={'Black | #080808\nRed | #e10600'}
              />
              <small>One per line: Color name | #hex.</small>
            </label>

            <label>
              <span>Color zones</span>
              <textarea
                value={form.colorZonesText}
                onChange={(event) => updateField('colorZonesText', event.target.value)}
                placeholder={'Primary Color\nSecondary Color\nTrim / Accent Color'}
              />
              <small>One customizable color area per line.</small>
            </label>

            <label className="pcm-wide">
              <span>Product specifications</span>
              <textarea
                value={form.specificationsText}
                onChange={(event) => updateField('specificationsText', event.target.value)}
                placeholder={'Uniform Type | Pro Match Kit\nFabric | Micro Mesh Dry Fit\nFit | Athletic Fit'}
              />
              <small>One specification per line: Label | Value.</small>
            </label>

            <label className="pcm-wide">
              <span>Option groups</span>
              <textarea
                value={form.optionsText}
                onChange={(event) => updateField('optionsText', event.target.value)}
                placeholder={'Sleeve Style: Short Sleeve, Long Sleeve\nCollar: V Neck, Round Neck'}
              />
              <small>One group per line: Group name: option 1, option 2.</small>
            </label>
          </div>

          <div className="pcm-checks">
            {[
              ['allowCustomColor', 'Allow any custom color'],
              ['allowLogoUpload', 'Allow team logo upload'],
              ['allowPlayerName', 'Allow player name'],
              ['allowPlayerNumber', 'Allow player number'],
              ['allowCustomNotes', 'Allow custom instructions'],
              ['active', 'Show this item to customers'],
            ].map(([field, label]) => (
              <label key={field}>
                <input
                  type="checkbox"
                  checked={form[field]}
                  onChange={(event) => updateField(field, event.target.checked)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>

          <div className="pcm-editor-actions">
            <button type="button" className="catalog-secondary-button" onClick={closeForm}>
              Cancel
            </button>
            <button type="submit" className="categories-add-button" disabled={saving}>
              <Save size={17} />
              {saving ? 'Saving...' : 'Save Item'}
            </button>
          </div>
        </form>
      )}
    </section>
  )
}

export default ProductCustomizerManager
