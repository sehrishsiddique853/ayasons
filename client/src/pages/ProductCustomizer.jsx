import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, ShoppingBag, Trash2 } from 'lucide-react'
import api from '../services/api'
import CustomProductCard from '../components/customizer/CustomProductCard'
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

function ProductCustomizer() {
  const { categorySlug, productSlug } = useParams()
  const { cartItems, addToCart, removeFromCart, totalQuantity } = useCart()

  const [product, setProduct] = useState(null)
  const [configuration, setConfiguration] = useState({})
  const [expandedItem, setExpandedItem] = useState(null)
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
        setProduct(loadedProduct)
        setConfiguration(createInitialState(loadedProduct.items || []))
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
    return () => { active = false }
  }, [categorySlug, productSlug])

  const selectedCount = useMemo(
    () => Object.values(configuration).filter((item) => item.enabled).length,
    [configuration]
  )

  if (loading) {
    return (
      <>
        <main className="product-customizer-page">
          <div className="customizer-empty">
            <PageLoader label="Loading customizer" variant="inline" />
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error || !product) {
    return (
      <>
        <main className="product-customizer-page">
          <div className="customizer-empty">
            <h1>Customizer unavailable</h1>
            <p>{error}</p>
            <Link to={`/products/${categorySlug}`}>Back to collection</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const toggleItem = (itemId) => {
    setConfiguration((current) => {
      const nextEnabled = !current[itemId].enabled
      if (nextEnabled) setExpandedItem(itemId)
      else if (expandedItem === itemId) setExpandedItem(null)

      return {
        ...current,
        [itemId]: { ...current[itemId], enabled: nextEnabled },
      }
    })
    setMessage('')
  }

  const changeItem = (itemId, key, value) => {
    setConfiguration((current) => ({
      ...current,
      [itemId]: { ...current[itemId], [key]: value },
    }))
    setMessage('')
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

  return (
    <>
      <main className="product-customizer-page">
        <section className="product-customizer-hero">
          <div className="product-customizer-hero-inner">
            <Link className="customizer-back" to={`/products/${categorySlug}`}>
              <ArrowLeft size={18} />
              Back to {product.category?.name || 'collection'}
            </Link>

            <span className="customizer-eyebrow">Custom Product Builder</span>
            <h1>Build Your {product.name}</h1>
            <p>{product.description}</p>

            <div className="customizer-steps">
              <span><b>01</b>Select items</span>
              <span><b>02</b>Choose size</span>
              <span><b>03</b>Pick colors</span>
              <span><b>04</b>Customize</span>
              <span><b>05</b>Add to cart</span>
            </div>
          </div>
        </section>

        <div className="product-customizer-layout">
          <section className="customizer-products">
            <div className="customizer-section-heading">
              <div>
                <span>BUILD YOUR ORDER</span>
                <h2>Choose what you need</h2>
                <p>Select only the products you need. Open one item at a time to customize it.</p>
              </div>
              <strong>{selectedCount} / {product.items.length} selected</strong>
            </div>

            <div className="customizer-product-list">
              {product.items.map((item) => (
                <CustomProductCard
                  key={item.id}
                  item={item}
                  selected={configuration[item.id]}
                  expanded={expandedItem === item.id}
                  onExpand={(itemId) =>
                    setExpandedItem((current) => current === itemId ? null : itemId)
                  }
                  onToggle={toggleItem}
                  onChange={changeItem}
                />
              ))}
            </div>
          </section>

          <aside className="customizer-cart-panel">
            <div className="customizer-cart-sticky">
              <div className="customizer-cart-heading">
                <div><ShoppingBag size={22} /><h3>Your Cart</h3></div>
                <span>{totalQuantity}</span>
              </div>

              <div className="customizer-current-selection">
                <span>Current selection</span>
                <strong>{selectedCount} products</strong>
              </div>

              {message && (
                <div className="customizer-message">
                  <CheckCircle2 size={18} /><span>{message}</span>
                </div>
              )}

              <button type="button" className="customizer-add-cart" onClick={handleAddToCart}>
                <ShoppingBag size={18} />
                Add Selected To Cart
              </button>

              <p className="customizer-cart-help">
                Final pricing is confirmed according to quantity, fabric, branding and customization requirements.
              </p>

              {cartItems.length > 0 && (
                <div className="customizer-cart-items">
                  <h4>Cart items</h4>
                  {cartItems.map((cartItem) => (
                    <div className="customizer-mini-cart-item" key={cartItem.cartId}>
                      <div>
                        <strong>{cartItem.itemName}</strong>
                        <span>{cartItem.size || 'Custom'} · Qty {cartItem.quantity}</span>
                      </div>
                      <button
                        type="button"
                        aria-label="Remove from cart"
                        onClick={() => removeFromCart(cartItem.cartId)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default ProductCustomizer
