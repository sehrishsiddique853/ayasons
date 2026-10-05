import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Settings2,
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
  'sock-length',
  'shell-type',
])

const firstColorValue = (item) => {
  const firstColor = item.colors?.[0]

  return (
    (typeof firstColor === 'string' ? firstColor : firstColor?.value) ||
    '#080808'
  )
}

const createInitialState = (items) =>
  items.reduce((result, item) => {
    const baseColor = firstColorValue(item)

    const zones =
      item.colorZones?.length
        ? item.colorZones
        : ['Primary Color']

    result[item.id] = {
      enabled: false,
      size: '',
      color: baseColor,
      colorSelections: zones.reduce((colors, zone) => {
        colors[zone] = baseColor
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

const optionValues = (group) =>
  (group.values || []).map((value) =>
    typeof value === 'string'
      ? { label: value, value }
      : value
  )

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
          `/product-customizer/${categorySlug}/${productSlug}`
        )

        if (!active) return

        const loadedProduct = response.data.product
        const items = loadedProduct.items || []

        setProduct(loadedProduct)
        setConfiguration(createInitialState(items))
        setActiveItemId(items[0]?.id || null)
        setAdvancedOpen(false)
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
    setAdvancedOpen(false)

    setConfiguration((current) => ({
      ...current,
      [itemId]: {
        ...current[itemId],
        enabled: true,
      },
    }))

    setMessage('')
  }

  const toggleActiveItem = () => {
    if (!activeItem) return

    setConfiguration((current) => ({
      ...current,
      [activeItem.id]: {
        ...current[activeItem.id],
        enabled: !current[activeItem.id].enabled,
      },
    }))

    setMessage('')
  }

  const updateColorZone = (zone, color) => {
    if (!activeItem) return

    setConfiguration((current) => ({
      ...current,
      [activeItem.id]: {
        ...current[activeItem.id],
        color,
        colorSelections: {
          ...(current[activeItem.id].colorSelections || {}),
          [zone]: color,
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

    const missingSize = selectedItems.find(
      (item) =>
        (item.sizes || []).length &&
        !configuration[item.id].size
    )

    if (missingSize) {
      setActiveItemId(missingSize.id)
      setMessage(`Please select a size for ${missingSize.name}.`)
      return
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

  const basicOptionGroups =
    (activeItem.optionGroups || []).filter((group) =>
      BASIC_OPTION_SLUGS.has(group.slug)
    )

  const advancedOptionGroups =
    (activeItem.optionGroups || []).filter(
      (group) => !BASIC_OPTION_SLUGS.has(group.slug)
    )

  const hasAdvancedOptions =
    advancedColorZones.length > 0 ||
    advancedOptionGroups.length > 0 ||
    activeItem.allowLogoUpload ||
    activeItem.allowCustomNotes

  return (
    <>
      <main className="product-customizer-page">
        <div className="ecom-product-shell">
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
                Start with the essentials. If you want full control,
                open Advanced Customization for detailed manufacturing options.
              </p>
            </div>

            <Link
              className="ecom-back-link"
              to={`/products/${categorySlug}`}
            >
              <ArrowLeft size={16} />
              Back to collection
            </Link>
          </div>

          <section className="ecom-kit-selector">
            <div className="ecom-section-heading">
              <div>
                <span>Step 1</span>
                <h2>Choose what you need</h2>
              </div>

              <strong>{selectedCount} selected</strong>
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
            </div>

            <div className="ecom-product-options">
              <div className="ecom-option-head">
                <div>
                  <span>Step 2</span>
                  <h2>{activeItem.name}</h2>
                  <p>
                    Choose the basic options below. These are enough
                    for customers who do not need detailed customization.
                  </p>
                </div>

                <button
                  type="button"
                  className={
                    activeSelection.enabled
                      ? 'ecom-item-toggle active'
                      : 'ecom-item-toggle'
                  }
                  onClick={toggleActiveItem}
                >
                  {activeSelection.enabled && <Check size={15} />}
                  {activeSelection.enabled ? 'Selected' : 'Select item'}
                </button>
              </div>

              <div className="ecom-basic-customization">
                <div className="ecom-mode-heading">
                  <div>
                    <span>Basic Customization</span>
                    <strong>Quick and simple</strong>
                  </div>

                  <p>
                    Size, main color, essential style and personalization.
                  </p>
                </div>

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

                {(activeItem.allowPlayerName ||
                  activeItem.allowPlayerNumber) && (
                  <div className="ecom-personalize-box">
                    <h3>Personalization</h3>

                    <div className="ecom-personalize-grid">
                      {activeItem.allowPlayerName && (
                        <label>
                          <span>Name on item</span>
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
                            placeholder="Enter name"
                            maxLength={30}
                          />
                        </label>
                      )}

                      {activeItem.allowPlayerNumber && (
                        <label>
                          <span>Number</span>
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
                            placeholder="00"
                            maxLength={3}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                )}

                <div className="ecom-basic-quantity">
                  <div className="ecom-quantity-wrap">
                    <span>Quantity</span>

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
                          For customers who want full manufacturing control
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
                          Detailed manufacturing options
                        </strong>

                        <p>
                          Optional. Configure additional colors, materials,
                          construction, branding and special requirements.
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
                <div>
                  <strong>
                    {advancedOpen
                      ? 'Detailed customization enabled'
                      : 'Basic customization is enough to continue'}
                  </strong>

                  <span>
                    You can add this item now or open advanced options.
                  </span>
                </div>

                <button
                  type="button"
                  className="ecom-add-cart"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag size={18} />
                  Add selected items to cart
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
