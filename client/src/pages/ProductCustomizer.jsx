import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
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

const createInitialState = (items) =>
  items.reduce((result, item) => {
    const firstColor = item.colors?.[0]

    result[item.id] = {
      enabled: false,
      size: '',
      color:
        (typeof firstColor === 'string' ? firstColor : firstColor?.value) ||
        '#080808',
      quantity: 1,
      playerName: '',
      playerNumber: '',
      logoName: '',
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

      Object.values(logoPreviews).forEach((preview) => {
        if (preview) URL.revokeObjectURL(preview)
      })
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
      (item) => (item.sizes || []).length && !configuration[item.id].size
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

  if (error || !product || !activeItem) {
    return (
      <>
        <main className="product-customizer-page">
          <div className="customizer-empty">
            <h1>Product unavailable</h1>
            <p>{error || 'No customizable items found.'}</p>
            <Link to={`/products/${categorySlug}`}>Back to collection</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

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
              <p>{product.description}</p>
            </div>

            <Link className="ecom-back-link" to={`/products/${categorySlug}`}>
              <ArrowLeft size={16} />
              Back to collection
            </Link>
          </div>

          <section className="ecom-kit-selector">
            <div className="ecom-section-heading">
              <div>
                <span>Choose items</span>
                <h2>Build your set</h2>
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
                <img src={activeItem.image?.url} alt={activeItem.name} />
              </div>

              <div className="ecom-visual-caption">
                <span>{product.name}</span>
                <strong>{activeItem.name}</strong>
              </div>
            </div>

            <div className="ecom-product-options">
              <div className="ecom-option-head">
                <div>
                  <span>Customize item</span>
                  <h2>{activeItem.name}</h2>
                  <p>{activeItem.description}</p>
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

              {(activeItem.sizes || []).length > 0 && (
                <div className="ecom-option-block">
                  <div className="ecom-option-label">
                    <span>Size</span>
                    <strong>{activeSelection.size || 'Select a size'}</strong>
                  </div>

                  <div className="customizer-size-grid">
                    {activeItem.sizes.map((size) => (
                      <button
                        type="button"
                        key={size}
                        className={activeSelection.size === size ? 'active' : ''}
                        onClick={() => updateItem(activeItem.id, 'size', size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="ecom-option-block">
                <ColorPicker
                  colors={activeItem.colors || []}
                  value={activeSelection.color}
                  allowCustomColor={activeItem.allowCustomColor}
                  onChange={(color) =>
                    updateItem(activeItem.id, 'color', color)
                  }
                />
              </div>

              {(activeItem.optionGroups || []).map((group) => (
                <div className="ecom-option-block" key={group.slug || group.name}>
                  <div className="ecom-option-label">
                    <span>{group.name}</span>
                  </div>

                  <div className="customizer-choice-grid">
                    {optionValues(group).map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        className={
                          activeSelection.options?.[group.slug] === option.value
                            ? 'active'
                            : ''
                        }
                        onClick={() =>
                          updateItem(activeItem.id, 'options', {
                            ...(activeSelection.options || {}),
                            [group.slug]: option.value,
                          })
                        }
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {(activeItem.allowPlayerName || activeItem.allowPlayerNumber) && (
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

              {activeItem.allowLogoUpload && (
                <div className="ecom-option-block">
                  <div className="ecom-option-label">
                    <span>Team logo</span>
                  </div>

                  <div className="ecom-logo-row">
                    <label className="ecom-logo-upload">
                      <Upload size={17} />
                      <span>{activeSelection.logoName || 'Upload logo'}</span>
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
                  <span>Special instructions</span>
                  <textarea
                    rows="3"
                    value={activeSelection.notes}
                    onChange={(event) =>
                      updateItem(activeItem.id, 'notes', event.target.value)
                    }
                    placeholder="Add any extra manufacturing or branding instructions..."
                  />
                </label>
              )}

              <div className="ecom-purchase-row">
                <div className="ecom-quantity-wrap">
                  <span>Quantity</span>
                  <QuantitySelector
                    value={activeSelection.quantity}
                    onChange={(quantity) =>
                      updateItem(activeItem.id, 'quantity', quantity)
                    }
                  />
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
                <div className="ecom-message">{message}</div>
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
                  <div className="ecom-cart-preview-item" key={cartItem.cartId}>
                    <img src={cartItem.itemImage} alt="" />

                    <div>
                      <strong>{cartItem.itemName}</strong>
                      <span>
                        {cartItem.size || 'Custom'} · Qty {cartItem.quantity}
                      </span>
                    </div>

                    <button
                      type="button"
                      aria-label="Remove item"
                      onClick={() => removeFromCart(cartItem.cartId)}
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
