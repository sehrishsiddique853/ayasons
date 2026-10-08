import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Upload,
} from 'lucide-react'
import api from '../services/api'
import CustomProductCard from '../components/customizer/CustomProductCard'
import ColorPicker from '../components/customizer/ColorPicker'
import QuantitySelector from '../components/customizer/QuantitySelector'
import { useCart } from '../context/CartContext'
import Footer from '../components/home/Footer'
import PageLoader from '../components/common/PageLoader'
import '../style/products/ProductCustomizer.css'

const BASIC_OPTION_SLUGS = new Set([
  'sleeve-style',
  'fit',
  'surface',
  'shell-type',
])

const SOCCER_STANDARD_DEFAULTS = {
  'jersey-sleeve': 'Short Sleeve',
  'jersey-fit': 'Athletic',
  'neck-style': 'V Neck',
  'shorts-style': 'Regular Fit',
  'shorts-waist': 'Elastic + Drawcord',
  fabric: 'Dry Fit',
  'fabric-pattern': 'Solid',
  'material-finish': 'Matte',
  'branding-method': 'Sublimation',
  'team-crest-position': 'Left Chest',
  'sponsor-placement': 'None',
  'number-style': 'Classic',
  'trim-style': 'Plain',
  stitching: 'Flatlock',
  packaging: 'Bulk Packed',
}

const SOCCER_VARIANT_DEFAULTS = {
  'soccer-uniform-1': {
    // Pro match kit — dynamic/angular performance look.
    'jersey-sleeve': 'Short Sleeve',
    'jersey-fit': 'Athletic',
    'neck-style': 'V Neck',
    'shorts-size': '',
    'shorts-style': 'Regular Fit',
    'shorts-waist': 'Elastic + Drawcord',
    fabric: 'Micro Mesh',
    'fabric-pattern': 'Geometric',
    'material-finish': 'Matte',
    'branding-method': 'Sublimation',
    'team-crest-position': 'Left Chest',
    'sponsor-placement': 'None',
    'number-style': 'Modern',
    'trim-style': 'Contrast Piping',
    stitching: 'Flatlock',
    packaging: 'Bulk Packed',
  },

  'soccer-uniform-2': {
    // Classic club kit — traditional teamwear construction.
    'jersey-sleeve': 'Short Sleeve',
    'jersey-fit': 'Regular',
    'neck-style': 'Crew Neck',
    'shorts-size': '',
    'shorts-style': 'Regular Fit',
    'shorts-waist': 'Elastic + Drawcord',
    fabric: 'Polyester Interlock',
    'fabric-pattern': 'Stripes',
    'material-finish': 'Matte',
    'branding-method': 'Embroidery',
    'team-crest-position': 'Left Chest',
    'sponsor-placement': 'None',
    'number-style': 'Classic',
    'trim-style': 'Plain',
    stitching: 'Reinforced',
    packaging: 'Bulk Packed',
  },

  'soccer-uniform-3': {
    // Elite performance kit — modern fitted look.
    'jersey-sleeve': 'Short Sleeve',
    'jersey-fit': 'Slim',
    'neck-style': 'V Neck',
    'shorts-size': '',
    'shorts-style': 'Slim Fit',
    'shorts-waist': 'Elastic + Drawcord',
    fabric: 'Bird Eye Mesh',
    'fabric-pattern': 'Gradient',
    'material-finish': 'Matte',
    'branding-method': 'Sublimation',
    'team-crest-position': 'Left Chest',
    'sponsor-placement': 'None',
    'number-style': 'Modern',
    'trim-style': 'Contrast Piping',
    stitching: 'Flatlock',
    packaging: 'Bulk Packed',
  },

  'soccer-uniform-4': {
    // Long-sleeve match kit — clean cool-weather setup.
    'jersey-sleeve': 'Long Sleeve',
    'jersey-fit': 'Regular',
    'neck-style': 'Crew Neck',
    'shorts-size': '',
    'shorts-style': 'Regular Fit',
    'shorts-waist': 'Elastic + Drawcord',
    fabric: 'Dry Fit',
    'fabric-pattern': 'Solid',
    'material-finish': 'Matte',
    'branding-method': 'Heat Transfer',
    'team-crest-position': 'Left Chest',
    'sponsor-placement': 'None',
    'number-style': 'Classic',
    'trim-style': 'Plain',
    stitching: 'Reinforced',
    packaging: 'Bulk Packed',
  },
}

const soccerDefaultOptions = (item) =>
  (item.optionGroups || []).reduce((result, group) => {
    const desired =
      SOCCER_VARIANT_DEFAULTS[item.slug]?.[group.slug] ||
      SOCCER_STANDARD_DEFAULTS[group.slug]

    if (!desired) return result

    const match = optionValues(group).find(
      (option) =>
        String(option.value).toLowerCase() ===
        String(desired).toLowerCase()
    )

    if (match) {
      result[group.slug] = match.value
    }

    return result
  }, {})

const createInitialState = (items) =>
  items.reduce((result, item) => {
    const zones =
      item.colorZones?.length
        ? item.colorZones
        : ['Primary Color']

    result[item.id] = {
      enabled: false,
      size: '',
      colorMode: '',
      color: '',
      presetColorSelections: {},
      colorSelections: zones.reduce((colors, zone) => {
        colors[zone] = ''
        return colors
      }, {}),
      quantity: 1,
      playerName: '',
      playerNumber: '',
      logoName: '',
      logoFile: null,
      notes: '',
      options: {},
    }

    return result
  }, {})

const isDuplicateSizeGroup = (item, group) => {
  if (!(item?.sizes || []).length) return false

  const slug = String(group?.slug || '').trim().toLowerCase()
  const name = String(group?.name || '').trim().toLowerCase()

  return slug === 'size' || name === 'size'
}

const visibleOptionGroups = (item) =>
  (item?.optionGroups || []).filter(
    (group) => !isDuplicateSizeGroup(item, group)
  )

const hasAdvancedCustomization = (item) => {
  const colorZones = item?.colorZones || []
  const basicSlugs = new Set(item?.basicOptionSlugs || [])

  return Boolean(
    colorZones.length > 1 ||
    visibleOptionGroups(item).some((group) => !basicSlugs.has(group.slug)) ||
    item?.allowLogoUpload ||
    item?.allowCustomNotes
  )
}

const optionValues = (group) =>
  (group.values || []).map((value) =>
    typeof value === 'string'
      ? { label: value, value }
      : value
  )


const componentToHex = (value) =>
  Math.max(0, Math.min(255, value))
    .toString(16)
    .padStart(2, '0')

const rgbToHex = (r, g, b) =>
  `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`

const colorDistance = (a, b) =>
  Math.sqrt(
    ((a.r - b.r) ** 2) +
    ((a.g - b.g) ** 2) +
    ((a.b - b.b) ** 2)
  )

const extractDominantKitColors = (imageUrl) =>
  new Promise((resolve) => {
    if (!imageUrl) {
      resolve([])
      return
    }

    const image = new Image()
    image.crossOrigin = 'anonymous'

    image.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const size = 120
        canvas.width = size
        canvas.height = size

        const context = canvas.getContext('2d', {
          willReadFrequently: true,
        })

        if (!context) {
          resolve([])
          return
        }

        context.drawImage(image, 0, 0, size, size)

        const { data } = context.getImageData(0, 0, size, size)
        const buckets = new Map()

        for (let index = 0; index < data.length; index += 16) {
          const r = data[index]
          const g = data[index + 1]
          const b = data[index + 2]
          const alpha = data[index + 3]

          if (alpha < 180) continue

          const max = Math.max(r, g, b)
          const min = Math.min(r, g, b)
          const brightness = (r + g + b) / 3

          // Ignore white/light studio backgrounds and near-neutral shadows.
          if (brightness > 238) continue
          if (brightness > 220 && max - min < 18) continue

          const qr = Math.round(r / 24) * 24
          const qg = Math.round(g / 24) * 24
          const qb = Math.round(b / 24) * 24
          const key = `${qr}-${qg}-${qb}`

          const current = buckets.get(key) || {
            r: qr,
            g: qg,
            b: qb,
            count: 0,
          }

          current.count += 1
          buckets.set(key, current)
        }

        const ranked = [...buckets.values()]
          .sort((a, b) => b.count - a.count)

        const selected = []

        for (const color of ranked) {
          if (
            selected.every(
              (picked) => colorDistance(color, picked) > 52
            )
          ) {
            selected.push(color)
          }

          if (selected.length === 4) break
        }

        resolve(
          selected.map((color) =>
            rgbToHex(color.r, color.g, color.b)
          )
        )
      } catch {
        resolve([])
      }
    }

    image.onerror = () => resolve([])
    image.src = imageUrl
  })

function OptionGroup({
  group,
  selection,
  onChange,
}) {
  return (
    <div className="ecom-option-block">
      <div className="ecom-option-label">
        <span>{group.name}</span>
        <strong>
          {selection.options?.[group.slug] || 'Choose option'}
        </strong>
      </div>

      <div className="customizer-choice-grid">
        {optionValues(group).map((option) => (
          <button
            type="button"
            key={option.value}
            className={
              selection.options?.[group.slug] === option.value
                ? 'active'
                : ''
            }
            onClick={() =>
              onChange({
                ...(selection.options || {}),
                [group.slug]: option.value,
              })
            }
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function ProductCustomizer() {
  const { categorySlug, productSlug } = useParams()

  const {
    cartItems,
    addToCart,
    removeFromCart,
    totalQuantity,
  } = useCart()

  const [product, setProduct] = useState(null)
  const [configuration, setConfiguration] = useState({})
  const [activeItemId, setActiveItemId] = useState(null)
  const [logoPreviews, setLogoPreviews] = useState({})
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get(
          `/product-customizer/${categorySlug}/${productSlug}`,
          { params: { updatedAt: Date.now() } }
        )

        if (!active) return

        const loadedProduct = response.data.product
        const items = loadedProduct.items || []

        setProduct(loadedProduct)
        const nextConfiguration = createInitialState(items)
        if (items.length) {
          nextConfiguration[items[0].id].enabled = true
        }
        setConfiguration(nextConfiguration)
        setActiveItemId(items[0]?.id || null)
        setAdvancedOpen(hasAdvancedCustomization(items[0]))
      } catch (requestError) {
        if (!active) return

        setError(
          requestError.response?.data?.message ||
          'This product customizer is not available yet.'
        )
      } finally {
        if (active) setLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [categorySlug, productSlug])

  const selectedCount = useMemo(
    () =>
      Object.values(configuration).filter((item) => item.enabled).length,
    [configuration]
  )

  const activeItem =
    product?.items?.find((item) => item.id === activeItemId) ||
    product?.items?.[0] ||
    null

  const activeSelection =
    activeItem ? configuration[activeItem.id] : null

  const isDesignCollection =
    (product?.items || []).length >= 3 &&
    (product?.items || []).every((item) =>
      /-\d+$/.test(item.slug || '')
    )

  const updateItem = (itemId, key, value) => {
    setConfiguration((current) => ({
      ...current,
      [itemId]: {
        ...current[itemId],
        [key]: value,
      },
    }))

    setMessage('')
  }

  const chooseItem = (itemId) => {
    setActiveItemId(itemId)
    setAdvancedOpen(
      hasAdvancedCustomization(
        product?.items?.find((item) => item.id === itemId)
      )
    )

    setConfiguration((current) => {
      if (productSlug !== 'soccer-uniform') {
        return {
          ...current,
          [itemId]: {
            ...current[itemId],
            enabled: true,
          },
        }
      }

      // Soccer cards represent alternative complete kit designs,
      // not individual pieces of one kit. Only one design is selected.
      return Object.fromEntries(
        Object.entries(current).map(([id, value]) => [
          id,
          { ...value, enabled: Number(id) === Number(itemId) },
        ])
      )
    })

    setMessage('')
  }

  const updateColorZone = (zone, color) => {
    if (!activeItem) return

    setConfiguration((current) => {
      const existing = current[activeItem.id]
      const nextMode =
        productSlug === 'soccer-uniform'
          ? existing.colorMode === 'preset'
            ? 'custom-preset'
            : existing.colorMode || 'custom'
          : 'custom'

      return {
        ...current,
        [activeItem.id]: {
          ...existing,
          colorMode: nextMode,
          color:
            zone === 'Jersey Main Color'
              ? color
              : existing.color,
          colorSelections: {
            ...(existing.colorSelections || {}),
            [zone]: color,
          },
        },
      }
    })

    setMessage('')
  }

  const updateSoccerKitSize = (size) => {
    if (!activeItem) return

    setConfiguration((current) => ({
      ...current,
      [activeItem.id]: {
        ...current[activeItem.id],
        size,
        options: {
          ...(current[activeItem.id].options || {}),
          'shorts-size': size,
        },
      },
    }))

    setMessage('')
  }

  const selectOriginalDesignColors = async () => {
    if (!activeItem) return

    let preset =
      activeItem.presetColors &&
      Object.keys(activeItem.presetColors).length > 0
        ? { ...activeItem.presetColors }
        : {}

    if (Object.keys(preset).length === 0) {
      const colors = await extractDominantKitColors(activeItem.image?.url)

      if (colors.length > 0) {
        const [
          mainColor,
          secondaryColor = mainColor,
          accentColor = secondaryColor,
          shortsColor = mainColor,
        ] = colors

        preset = {
          'Jersey Main Color': mainColor,
          'Jersey Secondary Color': secondaryColor,
          'Shorts Main Color': shortsColor,
          'Trim / Accent Color': accentColor,
        }
      }
    }

    setConfiguration((current) => {
      const existing = current[activeItem.id]

      return {
        ...current,
        [activeItem.id]: {
          ...existing,
          colorMode: 'preset',
          presetColorSelections: { ...preset },
          color: preset['Jersey Main Color'] || '',
          colorSelections: { ...preset },
        },
      }
    })

    setMessage('')
  }

  const selectCustomMainColor = () => {
    if (!activeItem) return

    setConfiguration((current) => {
      const existing = current[activeItem.id]

      return {
        ...current,
        [activeItem.id]: {
          ...existing,
          colorMode: 'custom',
          color: '',
          presetColorSelections: {},
          colorSelections: Object.fromEntries(
            (activeItem.colorZones || ['Primary Color']).map((zone) => [zone, ''])
          ),
        },
      }
    })

    setMessage('')
  }

  const updateSoccerKitColor = (color) => {
    if (!activeItem) return

    setConfiguration((current) => ({
      ...current,
      [activeItem.id]: {
        ...current[activeItem.id],
        colorMode: 'custom',
        color,
        colorSelections: {
          ...(current[activeItem.id].colorSelections || {}),
          'Jersey Main Color': color,
          'Shorts Main Color': color,
          'Jersey Secondary Color': '',
          'Trim / Accent Color': '',
        },
      },
    }))

    setMessage('')
  }

  const handleLogo = (event) => {
    const file = event.target.files?.[0]

    if (!file || !activeItem) return

    setLogoPreviews((current) => {
      if (current[activeItem.id]) {
        URL.revokeObjectURL(current[activeItem.id])
      }

      return {
        ...current,
        [activeItem.id]: URL.createObjectURL(file),
      }
    })

    updateItem(activeItem.id, 'logoName', file.name)
    updateItem(activeItem.id, 'logoFile', file)
  }

  const handleAddToCart = () => {
    const selectedItems = product.items.filter(
      (item) => configuration[item.id]?.enabled
    )

    if (!selectedItems.length) {
      setMessage('Please select at least one item.')
      return
    }

    for (const item of selectedItems) {
      const selected = configuration[item.id]
      const configuredRequired = Array.isArray(item.requiredFields)
        ? item.requiredFields
        : []
      const required = new Set(
        configuredRequired.length
          ? configuredRequired
          : (item.sizes || []).length
            ? ['size']
            : []
      )

      if (required.has('size') && !selected.size) {
        setActiveItemId(item.id)
        setMessage(`Please select a size for ${item.name}.`)
        return
      }

      if (required.has('color')) {
        const firstZone =
          item.colorZones?.[0] || 'Primary Color'
        const selectedColor =
          selected.colorSelections?.[firstZone] ||
          selected.color

        if (!selectedColor) {
          setActiveItemId(item.id)
          setMessage(`Please select a color for ${item.name}.`)
          return
        }
      }

      if (
        required.has('playerName') &&
        !String(selected.playerName || '').trim()
      ) {
        setActiveItemId(item.id)
        setMessage(`Please enter a player name for ${item.name}.`)
        return
      }

      if (
        required.has('playerNumber') &&
        !String(selected.playerNumber || '').trim()
      ) {
        setActiveItemId(item.id)
        setMessage(`Please enter a player number for ${item.name}.`)
        return
      }

      if (
        required.has('logo') &&
        !selected.logoFile
      ) {
        setActiveItemId(item.id)
        setAdvancedOpen(true)
        setMessage(`Please upload a logo for ${item.name}.`)
        return
      }
    }

    addToCart(
      selectedItems.map((item) => ({
        cartId: `${item.id}-${Date.now()}-${Math.random()}`,
        categorySlug,
        productSlug,
        productId: product.id,
        productName: product.name,
        itemId: item.id,
        itemName: item.name,
        itemImage: item.image?.url,
        ...configuration[item.id],
      }))
    )

    setMessage(
      `${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''} added to cart.`
    )
  }

  if (loading) {
    return (
      <>
        <main className="product-customizer-page">
          <div className="customizer-empty">
            <PageLoader label="Loading product" variant="inline" />
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error || !product || !activeItem || !activeSelection) {
    return (
      <>
        <main className="product-customizer-page">
          <div className="customizer-empty">
            <h1>Product unavailable</h1>
            <p>{error || 'No customizable items found.'}</p>
            <Link to={`/products/${categorySlug}`}>
              Back to collection
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const colorZones =
    activeItem.colorZones?.length
      ? activeItem.colorZones
      : ['Primary Color']

  const basicColorZone = colorZones[0]

  const advancedColorZones = colorZones.slice(1)

  const configuredBasicSlugs =
    Array.isArray(activeItem.basicOptionSlugs)
      ? new Set(activeItem.basicOptionSlugs)
      : new Set()

  const useConfiguredBasic =
    Array.isArray(activeItem.basicOptionSlugs)

  const optionGroups = visibleOptionGroups(activeItem)

  const basicOptionGroups =
    optionGroups.filter((group) =>
      useConfiguredBasic
        ? configuredBasicSlugs.has(group.slug)
        : BASIC_OPTION_SLUGS.has(group.slug)
    )

  const advancedOptionGroups =
    optionGroups.filter((group) =>
      !basicOptionGroups.some(
        (basicGroup) => basicGroup.slug === group.slug
      )
    )

  const hasAdvancedOptions =
    advancedColorZones.length > 0 ||
    advancedOptionGroups.length > 0 ||
    activeItem.allowLogoUpload ||
    activeItem.allowCustomNotes


  const designSetIncludes =
    activeItem.specifications?.find(
      (spec) => spec.label === 'Product Detail'
    )?.value ||
    activeItem.specifications?.find(
      (spec) => spec.label === 'Set Includes'
    )?.value ||
    activeItem.specifications?.find(
      (spec) => spec.label === 'Product'
    )?.value ||
    product.name

  const designBranding =
    activeItem.specifications?.find(
      (spec) => spec.label === 'Branding Detail'
    )?.value ||
    'Custom colors, team logo and branding options'

  const designCustomization =
    activeItem.specifications?.find(
      (spec) => spec.label === 'Customization Detail'
    )?.value ||
    'Sport-specific sizing, fit, fabric and finishing choices'

  const designUse =
    activeItem.specifications?.find(
      (spec) => spec.label === 'Use'
    )?.value ||
    'Teams, clubs, academies and custom orders'

  return (
    <>
      <main className="product-customizer-page">
        <div className="ecom-product-shell">
          {isDesignCollection ? (
            <header className="ecom-collection-header">
              <h1>{product.name}</h1>
              <p>Our Collection</p>
            </header>
          ) : (
            <>
              <div className="ecom-breadcrumb">
                <Link to="/products">Products</Link>
                <span>/</span>
                <Link to={`/products/${categorySlug}`}>
                  {product.category?.name || 'Collection'}
                </Link>
                <span>/</span>
                <strong>{product.name}</strong>
              </div>
              <div className="ecom-title-row">
                <div>
                  <span>Custom Manufacturing</span>
                  <h1>{product.name}</h1>
                  <p>
                    Start with the essentials, or open Advanced Customization
                    to configure additional details.
                  </p>
                </div>
                <Link className="ecom-back-link" to={`/products/${categorySlug}`}>
                  <ArrowLeft size={16} />
                  Back to collection
                </Link>
              </div>
            </>
          )}

          <section className={`ecom-kit-selector${isDesignCollection ? ' design-collection-selector' : ''}`}>
            <div className="ecom-section-heading">
              <div>
                <span>{isDesignCollection ? 'Available designs' : 'Step 1'}</span>
                <h2>{isDesignCollection ? 'Choose your design' : 'Choose what you need'}</h2>
              </div>

              <strong>{isDesignCollection ? 'Select a design' : `${selectedCount} selected`}</strong>
            </div>

            <div className="ecom-item-grid">
              {product.items.map((item) => (
                <CustomProductCard
                  key={item.id}
                  item={item}
                  selected={configuration[item.id]}
                  active={activeItem.id === item.id}
                  onSelect={chooseItem}
                />
              ))}
            </div>
          </section>

          <section className="ecom-configurator">
            <div className="ecom-product-visual">
              <div className="ecom-main-image">
                <img
                  src={activeItem.image?.url}
                  alt={activeItem.name}
                />
              </div>

              <div className="ecom-visual-caption">
                <span>{product.name}</span>
                <strong>{activeItem.name}</strong>
              </div>

                              <div className="soccer-product-proof">
                  <div className="soccer-proof-grid">
                    <div className="soccer-proof-item">
                      <strong>Custom Design</strong>
                      <span>Your colors, logo and team identity</span>
                    </div>

                    <div className="soccer-proof-item">
                      <strong>Performance Fabrics</strong>
                      <span>Sport-specific fabric, fit and construction options</span>
                    </div>

                    <div className="soccer-proof-item">
                      <strong>Made for Teams</strong>
                      <span>Player details, branding and coordinated team presentation</span>
                    </div>

                    <div className="soccer-proof-item">
                      <strong>Production Options</strong>
                      <span>Multiple finishes, decoration and customization methods</span>
                    </div>
                  </div>

                  <section className="soccer-product-description">
                    <h3>Product Description</h3>

                    <p>{activeItem.description}</p>

                    <ul>
                      <li>
                        <ShieldCheck size={17} />
                        <span>{designSetIncludes}</span>
                      </li>
                      <li>
                        <ShieldCheck size={17} />
                        <span>{designBranding}</span>
                      </li>
                      <li>
                        <ShieldCheck size={17} />
                        <span>{designCustomization}</span>
                      </li>
                      <li>
                        <ShieldCheck size={17} />
                        <span>{designUse}</span>
                      </li>
                    </ul>
                  </section>
                </div>

            </div>

            <div className="ecom-product-options">
              <div className="ecom-option-head">
                <div>
                  <span>Customize your {isDesignCollection ? 'design' : 'product'}</span>
                  <h2>{activeItem.name}</h2>
                  <p>
                    {isDesignCollection
                      ? `Customize ${activeItem.name} with the available size, color, fit, fabric and branding options.`
                      : 'Choose your basic options, or customize further below.'}
                  </p>
                </div>


              </div>

              <div className="ecom-basic-customization">
                <>
                  {(activeItem.sizes || []).length > 0 && (
                    <div className="ecom-option-block">
                      <div className="ecom-option-label">
                        <span>Size</span>
                        <strong>
                          {activeSelection.size || 'Select a size'}
                        </strong>
                      </div>

                      <div className="customizer-size-grid">
                        {activeItem.sizes.map((size) => (
                          <button
                            type="button"
                            key={size}
                            className={
                              activeSelection.size === size
                                ? 'active'
                                : ''
                            }
                            onClick={() =>
                              updateItem(activeItem.id, 'size', size)
                            }
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="ecom-option-block">
                    <ColorPicker
                      label={basicColorZone}
                      colors={activeItem.colors || []}
                      value={
                        activeSelection.colorSelections?.[basicColorZone] ||
                        activeSelection.color
                      }
                      allowCustomColor={activeItem.allowCustomColor}
                      onChange={(color) =>
                        updateColorZone(basicColorZone, color)
                      }
                    />
                  </div>

                  {basicOptionGroups.map((group) => (
                    <OptionGroup
                      key={group.slug || group.name}
                      group={group}
                      selection={activeSelection}
                      onChange={(options) =>
                        updateItem(activeItem.id, 'options', options)
                      }
                    />
                  ))}
                </>

                {(activeItem.allowPlayerName ||
                  activeItem.allowPlayerNumber) && (
                  <div className="ecom-personalize-box">
                    <h3>Player Details</h3>

                    <div className="ecom-personalize-grid">
                      {activeItem.allowPlayerName && (
                        <label>
                          <span>Name on Jersey</span>
                          <input
                            type="text"
                            value={activeSelection.playerName}
                            onChange={(event) =>
                              updateItem(
                                activeItem.id,
                                'playerName',
                                event.target.value
                              )
                            }
                            placeholder="Player name"
                            maxLength={30}
                          />
                        </label>
                      )}

                      {activeItem.allowPlayerNumber && (
                        <label>
                          <span>Jersey Number</span>
                          <input
                            type="text"
                            value={activeSelection.playerNumber}
                            onChange={(event) =>
                              updateItem(
                                activeItem.id,
                                'playerNumber',
                                event.target.value
                              )
                            }
                            placeholder="10"
                            maxLength={3}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                )}

                <div className="ecom-basic-quantity">
                  <div className="ecom-quantity-wrap">
                    <span>Order Quantity</span>

                    <QuantitySelector
                      value={activeSelection.quantity}
                      onChange={(quantity) =>
                        updateItem(
                          activeItem.id,
                          'quantity',
                          quantity
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              {hasAdvancedOptions && (
                <div className="ecom-advanced-wrap">
                  <button
                    type="button"
                    className="ecom-advanced-toggle"
                    onClick={() =>
                      setAdvancedOpen((current) => !current)
                    }
                    aria-expanded={advancedOpen}
                  >
                    <div>
                      <Settings2 size={18} />

                      <span>
                        <strong>Advanced Customization</strong>
                        <small>
                          Optional — choose additional customization only if needed
                        </small>
                      </span>
                    </div>

                    {advancedOpen
                      ? <ChevronUp size={19} />
                      : <ChevronDown size={19} />}
                  </button>

                  {advancedOpen && (
                    <div className="ecom-advanced-panel">
                      <div className="ecom-advanced-intro">
                        <strong>
                          Advanced Teamwear Options
                        </strong>

                        <p>
                          Choose shirt fit, sleeves, neckline, shorts setup, fabric, colors, branding and finishing as needed.
                        </p>
                      </div>

                      {advancedColorZones.map((zone) => (
                        <div
                          className="ecom-option-block"
                          key={zone}
                        >
                          <ColorPicker
                            label={zone}
                            colors={activeItem.colors || []}
                            value={
                              activeSelection.colorSelections?.[zone] ||
                              activeSelection.color
                            }
                            allowCustomColor={
                              activeItem.allowCustomColor
                            }
                            onChange={(color) =>
                              updateColorZone(zone, color)
                            }
                          />
                        </div>
                      ))}

                      {advancedOptionGroups.map((group) => (
                        <OptionGroup
                          key={group.slug || group.name}
                          group={group}
                          selection={activeSelection}
                          onChange={(options) =>
                            updateItem(
                              activeItem.id,
                              'options',
                              options
                            )
                          }
                        />
                      ))}

                      {activeItem.allowLogoUpload && (
                        <div className="ecom-option-block">
                          <div className="ecom-option-label">
                            <span>Team / Brand Logo</span>
                          </div>

                          <div className="ecom-logo-row">
                            <label className="ecom-logo-upload">
                              <Upload size={17} />

                              <span>
                                {activeSelection.logoName ||
                                  'Upload logo'}
                              </span>

                              <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleLogo}
                              />
                            </label>

                            {logoPreviews[activeItem.id] && (
                              <img
                                className="ecom-logo-preview"
                                src={logoPreviews[activeItem.id]}
                                alt="Team logo preview"
                              />
                            )}
                          </div>
                        </div>
                      )}

                      {activeItem.allowCustomNotes && (
                        <label className="ecom-notes">
                          <span>
                            Special manufacturing instructions
                          </span>

                          <textarea
                            rows="3"
                            value={activeSelection.notes}
                            onChange={(event) =>
                              updateItem(
                                activeItem.id,
                                'notes',
                                event.target.value
                              )
                            }
                            placeholder="Patterns, panel placement, stitching, branding position, packaging or any other request..."
                          />
                        </label>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="ecom-checkout-actions">
                <button
                  type="button"
                  className="ecom-add-cart"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag size={18} />
                  Add to Cart
                </button>
              </div>

              {message && (
                <div className="ecom-message">
                  {message}
                </div>
              )}
            </div>
          </section>

          {cartItems.length > 0 && (
            <section className="ecom-cart-preview">
              <div className="ecom-cart-preview-head">
                <div>
                  <ShoppingBag size={19} />
                  <h2>Cart</h2>
                  <span>{totalQuantity} total qty</span>
                </div>

                <Link to="/cart">View full cart</Link>
              </div>

              <div className="ecom-cart-preview-list">
                {cartItems.slice(-4).map((cartItem) => (
                  <div
                    className="ecom-cart-preview-item"
                    key={cartItem.cartId}
                  >
                    <img
                      src={cartItem.itemImage}
                      alt=""
                    />

                    <div>
                      <strong>{cartItem.itemName}</strong>

                      <span>
                        {cartItem.size || 'Custom'} · Qty{' '}
                        {cartItem.quantity}
                      </span>
                    </div>

                    <button
                      type="button"
                      aria-label="Remove item"
                      onClick={() =>
                        removeFromCart(cartItem.cartId)
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

export default ProductCustomizer
