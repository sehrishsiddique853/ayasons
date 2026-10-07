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
  defaultOptionsText: '',
  basicOptionSlugsText: '',
  requiredFieldsText: 'size',
  defaultColorMode: 'custom',
  presetColorsText: '',
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


const parseKeyValueObject = (text) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce((result, line) => {
      const [key, ...valueParts] = line.split('|')
      const cleanKey = (key || '').trim()
      const value = valueParts.join('|').trim()

      if (cleanKey && value) result[cleanKey] = value
      return result
    }, {})

const toKeyValueText = (value = {}) =>
  Object.entries(value || {})
    .map(([key, item]) => `${key} | ${item}`)
    .join('\n')

const parseLineList = (text) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)


const setKeyValueText = (text, key, value) => {
  const current = parseKeyValueObject(text)
  if (value) current[key] = value
  else delete current[key]
  return toKeyValueText(current)
}

const toggleLineValue = (text, value, checked) => {
  const current = new Set(parseLineList(text))
  if (checked) current.add(value)
  else current.delete(value)
  return [...current].join('\n')
}

const REQUIRED_FIELD_CHOICES = [
  ['size', 'Size'],
  ['color', 'Color'],
  ['playerName', 'Player name'],
  ['playerNumber', 'Player number'],
  ['logo', 'Logo upload'],
]

function ProductCustomizerManager({ productId }) {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [drafts, setDrafts] = useState({
    size: '',
    colorName: '',
    colorHex: '#000000',
    zone: '',
    specLabel: '',
    specValue: '',
    optionName: '',
    optionValues: '',
  })

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


  const currentOptionGroups = useMemo(
    () => parseOptionGroups(form.optionsText),
    [form.optionsText]
  )

  const currentDefaultOptions = useMemo(
    () => parseKeyValueObject(form.defaultOptionsText),
    [form.defaultOptionsText]
  )

  const currentBasicSlugs = useMemo(
    () => new Set(parseLineList(form.basicOptionSlugsText)),
    [form.basicOptionSlugsText]
  )

  const currentRequiredFields = useMemo(
    () => new Set(parseLineList(form.requiredFieldsText)),
    [form.requiredFieldsText]
  )

  const currentColorZones = useMemo(
    () => parseLineList(form.colorZonesText),
    [form.colorZonesText]
  )

  const currentPresetColors = useMemo(
    () => parseKeyValueObject(form.presetColorsText),
    [form.presetColorsText]
  )


  const currentSizes = useMemo(
    () => parseLineList(form.sizesText),
    [form.sizesText]
  )

  const currentColors = useMemo(
    () => parseColors(form.colorsText),
    [form.colorsText]
  )

  const currentSpecifications = useMemo(
    () => parseSpecifications(form.specificationsText),
    [form.specificationsText]
  )


  const specificationValue = (...labels) =>
    currentSpecifications.find((spec) => labels.includes(spec.label))?.value || ''

  const productInfo = {
    bullet1: specificationValue('Product Detail', 'Set Includes', 'Product'),
    bullet2:
      specificationValue('Branding Detail') ||
      'Custom colors, team logo and branding options',
    bullet3:
      specificationValue('Customization Detail') ||
      'Sport-specific sizing, fit, fabric and finishing choices',
    bullet4: specificationValue('Use'),
  }

  const updateProductInfo = (key, value) => {
    const labelMap = {
      bullet1: 'Product Detail',
      bullet2: 'Branding Detail',
      bullet3: 'Customization Detail',
      bullet4: 'Use',
    }

    const aliases =
      key === 'bullet1'
        ? ['Product Detail', 'Set Includes', 'Product']
        : [labelMap[key]]

    const remaining = currentSpecifications.filter(
      (spec) => !aliases.includes(spec.label)
    )

    const next = value.trim()
      ? [...remaining, { label: labelMap[key], value }]
      : remaining

    updateField('specificationsText', toSpecificationsText(next))
  }

  const updateDraft = (name, value) =>
    setDrafts((current) => ({ ...current, [name]: value }))

  const setLines = (field, values) =>
    updateField(field, values.filter(Boolean).join('\n'))

  const addSize = () => {
    const value = drafts.size.trim()
    if (!value) return
    setLines('sizesText', [...currentSizes, value])
    updateDraft('size', '')
  }

  const removeSize = (index) =>
    setLines('sizesText', currentSizes.filter((_, itemIndex) => itemIndex !== index))

  const addColor = () => {
    const name = drafts.colorName.trim()
    const hex = drafts.colorHex.trim()
    if (!name || !hex) return
    updateField(
      'colorsText',
      toColorsText([...currentColors, { name, value: hex }])
    )
    setDrafts((current) => ({
      ...current,
      colorName: '',
      colorHex: '#000000',
    }))
  }

  const removeColor = (index) =>
    updateField(
      'colorsText',
      toColorsText(currentColors.filter((_, itemIndex) => itemIndex !== index))
    )

  const addZone = () => {
    const value = drafts.zone.trim()
    if (!value) return
    setLines('colorZonesText', [...currentColorZones, value])
    updateDraft('zone', '')
  }

  const removeZone = (index) =>
    setLines(
      'colorZonesText',
      currentColorZones.filter((_, itemIndex) => itemIndex !== index)
    )

  const addSpecification = () => {
    const label = drafts.specLabel.trim()
    const value = drafts.specValue.trim()
    if (!label || !value) return
    updateField(
      'specificationsText',
      toSpecificationsText([
        ...currentSpecifications,
        { label, value },
      ])
    )
    setDrafts((current) => ({
      ...current,
      specLabel: '',
      specValue: '',
    }))
  }

  const removeSpecification = (index) =>
    updateField(
      'specificationsText',
      toSpecificationsText(
        currentSpecifications.filter((_, itemIndex) => itemIndex !== index)
      )
    )

  const addOptionGroup = () => {
    const name = drafts.optionName.trim()
    const values = drafts.optionValues
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)

    if (!name || values.length === 0) return

    updateField(
      'optionsText',
      toOptionsText([
        ...currentOptionGroups,
        {
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
          values,
        },
      ])
    )

    setDrafts((current) => ({
      ...current,
      optionName: '',
      optionValues: '',
    }))
  }

  const removeOptionGroup = (index) =>
    updateField(
      'optionsText',
      toOptionsText(
        currentOptionGroups.filter((_, itemIndex) => itemIndex !== index)
      )
    )

  const openNew = () => {
    setDrafts({
      size: '',
      colorName: '',
      colorHex: '#000000',
      zone: '',
      specLabel: '',
      specValue: '',
      optionName: '',
      optionValues: '',
    })
    setForm({ ...emptyForm, order: items.length + 1 })
    setShowForm(true)
    setError('')
  }

  const openEdit = (item) => {
    setDrafts({
      size: '',
      colorName: '',
      colorHex: '#000000',
      zone: '',
      specLabel: '',
      specValue: '',
      optionName: '',
      optionValues: '',
    })
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
      defaultOptionsText: toKeyValueText(item.defaultOptions),
      basicOptionSlugsText: (item.basicOptionSlugs || []).join('\n'),
      requiredFieldsText: (item.requiredFields || []).join('\n'),
      defaultColorMode: item.defaultColorMode || 'custom',
      presetColorsText: toKeyValueText(item.presetColors),
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
      data.append('defaultOptions', JSON.stringify({}))
      data.append('basicOptionSlugs', JSON.stringify(parseLineList(form.basicOptionSlugsText)))
      data.append('requiredFields', JSON.stringify(parseLineList(form.requiredFieldsText)))
      data.append('defaultColorMode', 'custom')
      data.append('presetColors', JSON.stringify(parseKeyValueObject(form.presetColorsText)))
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
          <span className="admin-page-eyebrow">DESIGN VARIANTS</span>
          <h2>Sub Products</h2>
          <p>
            Manage the four design cards customers see for this product. Each design can have its own image, sizes, colors and customization choices.
          </p>
        </div>

        <button className="categories-add-button" type="button" onClick={openNew}>
          <Plus size={17} />
          Add Sub Product
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
              <h3>{form.id ? 'Edit Sub Product' : 'Add Sub Product'}</h3>
              <p>Keep it simple: add the design image, available choices and what should appear in Basic or Advanced customization.</p>
            </div>
            <button type="button" className="pcm-close" onClick={closeForm} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          <div className="pcm-editor-sections">
            <section className="pcm-form-section">
              <div className="pcm-section-title">
                <span>1</span>
                <div>
                  <h4>Design details</h4>
                  <p>Name, image and short description shown to customers.</p>
                </div>
              </div>

              <div className="pcm-grid">
                <label>
                  <span>Design name</span>
                  <input
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    placeholder="American Football Uniform 1"
                    required
                  />
                </label>

                <label>
                  <span>Display order</span>
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
                  <span>Design image {form.id ? '(upload only to replace)' : ''}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) => updateField('image', event.target.files?.[0] || null)}
                  />
                  <small>If no image is uploaded, the main product image is used.</small>
                  {imagePreview && <img className="pcm-preview" src={imagePreview} alt="" />}
                </label>
              </div>
            </section>

            <section className="pcm-form-section">
              <div className="pcm-section-title">
                <span>2</span>
                <div>
                  <h4>Sizes</h4>
                  <p>Add only the sizes customers can order for this design.</p>
                </div>
              </div>

              <div className="pcm-inline-add">
                <input
                  value={drafts.size}
                  onChange={(event) => updateDraft('size', event.target.value)}
                  placeholder="e.g. XL"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      addSize()
                    }
                  }}
                />
                <button type="button" onClick={addSize}><Plus size={15} /> Add size</button>
              </div>

              <div className="pcm-chip-list">
                {currentSizes.map((size, index) => (
                  <span className="pcm-chip" key={`${size}-${index}`}>
                    {size}
                    <button type="button" onClick={() => removeSize(index)} aria-label={`Remove ${size}`}><X size={12} /></button>
                  </span>
                ))}
                {currentSizes.length === 0 && <small>No sizes added yet.</small>}
              </div>
            </section>

            <section className="pcm-form-section">
              <div className="pcm-section-title">
                <span>3</span>
                <div>
                  <h4>Colors</h4>
                  <p>Set the preset color swatches and the garment areas customers can color.</p>
                </div>
              </div>

              <div className="pcm-subgroup">
                <strong>Available color swatches</strong>
                <div className="pcm-color-add">
                  <input
                    value={drafts.colorName}
                    onChange={(event) => updateDraft('colorName', event.target.value)}
                    placeholder="Color name"
                  />
                  <input
                    type="color"
                    value={drafts.colorHex}
                    onChange={(event) => updateDraft('colorHex', event.target.value)}
                  />
                  <input
                    value={drafts.colorHex}
                    onChange={(event) => updateDraft('colorHex', event.target.value)}
                    placeholder="#000000"
                  />
                  <button type="button" onClick={addColor}><Plus size={15} /> Add color</button>
                </div>

                <div className="pcm-color-list">
                  {currentColors.map((color, index) => (
                    <div className="pcm-color-item" key={`${color.name}-${index}`}>
                      <i style={{ background: color.value }} />
                      <span>{color.name}</span>
                      <small>{color.value}</small>
                      <button type="button" onClick={() => removeColor(index)}><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pcm-subgroup">
                <strong>Color areas</strong>
                <small>Example: Jersey Main Color, Pants Main Color, Trim / Accent Color.</small>
                <div className="pcm-inline-add">
                  <input
                    value={drafts.zone}
                    onChange={(event) => updateDraft('zone', event.target.value)}
                    placeholder="Color area name"
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        addZone()
                      }
                    }}
                  />
                  <button type="button" onClick={addZone}><Plus size={15} /> Add area</button>
                </div>
                <div className="pcm-chip-list">
                  {currentColorZones.map((zone, index) => (
                    <span className="pcm-chip" key={`${zone}-${index}`}>
                      {zone}
                      <button type="button" onClick={() => removeZone(index)}><X size={12} /></button>
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="pcm-form-section">
              <div className="pcm-section-title">
                <span>4</span>
                <div>
                  <h4>Customization options</h4>
                  <p>Create customer choices such as fit, sleeve, fabric or decoration.</p>
                </div>
              </div>

              <div className="pcm-option-add">
                <input
                  value={drafts.optionName}
                  onChange={(event) => updateDraft('optionName', event.target.value)}
                  placeholder="Option name, e.g. Jersey Fit"
                />
                <input
                  value={drafts.optionValues}
                  onChange={(event) => updateDraft('optionValues', event.target.value)}
                  placeholder="Choices separated by commas, e.g. Regular, Athletic, Slim"
                />
                <button type="button" onClick={addOptionGroup}><Plus size={15} /> Add option</button>
              </div>

              <div className="pcm-option-list">
                {currentOptionGroups.map((group, index) => (
                  <div className="pcm-option-row" key={group.slug}>
                    <div>
                      <strong>{group.name}</strong>
                      <span>{group.values.join(' • ')}</span>
                    </div>
                    <label className="pcm-basic-toggle">
                      <input
                        type="checkbox"
                        checked={currentBasicSlugs.has(group.slug)}
                        onChange={(event) =>
                          updateField(
                            'basicOptionSlugsText',
                            toggleLineValue(
                              form.basicOptionSlugsText,
                              group.slug,
                              event.target.checked
                            )
                          )
                        }
                      />
                      <span>{currentBasicSlugs.has(group.slug) ? 'Basic' : 'Advanced'}</span>
                    </label>
                    <button type="button" className="pcm-icon-delete" onClick={() => removeOptionGroup(index)}><Trash2 size={15} /></button>
                  </div>
                ))}
                {currentOptionGroups.length === 0 && <div className="pcm-behavior-empty">No customization options added yet.</div>}
              </div>
            </section>

            <section className="pcm-form-section">
              <div className="pcm-section-title">
                <span>5</span>
                <div>
                  <h4>Customer requirements</h4>
                  <p>Choose what must be completed before the design can be added to cart.</p>
                </div>
              </div>

              <div className="pcm-choice-list pcm-choice-list-compact">
                {REQUIRED_FIELD_CHOICES.map(([value, label]) => (
                  <label key={value}>
                    <input
                      type="checkbox"
                      checked={currentRequiredFields.has(value)}
                      onChange={(event) =>
                        updateField(
                          'requiredFieldsText',
                          toggleLineValue(
                            form.requiredFieldsText,
                            value,
                            event.target.checked
                          )
                        )
                      }
                    />
                    <span><strong>{label}</strong></span>
                  </label>
                ))}
              </div>
            </section>

            <section className="pcm-form-section">
              <div className="pcm-section-title">
                <span>6</span>
                <div>
                  <h4>Product information</h4>
                  <p>This appears below the product image exactly in the same order shown on the customer page.</p>
                </div>
              </div>

              <div className="pcm-product-info-editor">
                <label className="pcm-product-description-field">
                  <span>Product Description</span>
                  <textarea
                    value={form.description}
                    onChange={(event) => updateField('description', event.target.value)}
                    placeholder="Write the product description shown below the image..."
                    required
                  />
                </label>

                <div className="pcm-product-info-bullets">
                  <label>
                    <span>1</span>
                    <input
                      value={productInfo.bullet1}
                      onChange={(event) => updateProductInfo('bullet1', event.target.value)}
                      placeholder="e.g. Soccer Uniform or Jersey and shorts set"
                    />
                  </label>

                  <label>
                    <span>2</span>
                    <input
                      value={productInfo.bullet2}
                      onChange={(event) => updateProductInfo('bullet2', event.target.value)}
                      placeholder="Custom colors, team logo and branding options"
                    />
                  </label>

                  <label>
                    <span>3</span>
                    <input
                      value={productInfo.bullet3}
                      onChange={(event) => updateProductInfo('bullet3', event.target.value)}
                      placeholder="Sport-specific sizing, fit, fabric and finishing choices"
                    />
                  </label>

                  <label>
                    <span>4</span>
                    <input
                      value={productInfo.bullet4}
                      onChange={(event) => updateProductInfo('bullet4', event.target.value)}
                      placeholder="e.g. Teams, clubs, academies and custom orders"
                    />
                  </label>
                </div>

                <small className="pcm-product-info-note">
                  These four lines appear with the shield/check icons under Product Description.
                </small>
              </div>
            </section>
          </div>

          <div className="pcm-feature-section">
            <div className="pcm-section-title">
              <span>7</span>
              <div>
                <h4>Extra customer features</h4>
                <p>Turn optional inputs on or off for this design.</p>
              </div>
            </div>
            <div className="pcm-checks">
            {[
              ['allowCustomColor', 'Custom color picker'],
              ['allowLogoUpload', 'Team logo upload'],
              ['allowPlayerName', 'Player name'],
              ['allowPlayerNumber', 'Player number'],
              ['allowCustomNotes', 'Custom instructions'],
              ['active', 'Visible to customers'],
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
