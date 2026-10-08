import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Send, ShoppingBag, Trash2 } from 'lucide-react'
import api from '../services/api'
import { useCart } from '../context/CartContext'
import Footer from '../components/home/Footer'
import '../style/products/Cart.css'

const labelFromSlug = (value) =>
  String(value || '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

function Cart() {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    totalQuantity,
  } = useCart()

  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    message: '',
  })

  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState('')

  const updateCustomer = (field, value) => {
    setCustomer((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const submitQuote = async (event) => {
    event.preventDefault()

    if (!cartItems.length) {
      setFeedback('Your cart is empty.')
      return
    }

    try {
      setStatus('submitting')
      setFeedback('')

      const formData = new FormData()
      formData.append('name', customer.name)
      formData.append('email', customer.email)
      formData.append('phone', customer.phone)
      formData.append('company', customer.company)
      formData.append('country', customer.country)
      formData.append('message', customer.message)

      const itemsForRequest = cartItems.map((item) => {
        const copy = {
          productName: item.productName,
          itemName: item.itemName,
          size: item.size,
          color: item.color,
          colorMode: item.colorMode || '',
          colorSelections: item.colorSelections || {},
          quantity: item.quantity,
          playerName: item.playerName,
          playerNumber: item.playerNumber,
          logoName: item.logoName,
          notes: item.notes,
          options: item.options || {},
        }

        if (item.logoFile instanceof File) {
          copy.logoUploadIndex =
            Array.from(formData.getAll('logos')).length
          formData.append('logos', item.logoFile)
        }

        return copy
      })

      formData.append('items', JSON.stringify(itemsForRequest))

      const response = await api.post('/quotes', formData)

      setStatus('success')
      setFeedback(
        `Order #${response.data.orderId || response.data.quoteId} has been confirmed. A confirmation email has been sent to you.`
      )

      clearCart()
    } catch (error) {
      setStatus('error')
      setFeedback(
        error.response?.data?.message ||
        'Unable to send your request right now.'
      )
    }
  }

  return (
    <>
      <main className="cart-page">
        <div className="cart-shell">
          <div className="cart-page-head">
            <div>
              <span>Custom Order</span>
              <h1>Your Cart</h1>
              <p>
                Review every specification below. When you place the order, AYOSONS receives
                the complete order details and you receive an order confirmation by email.
              </p>
            </div>

            <Link className="cart-continue" to="/products">
              <ArrowLeft size={17} />
              Continue Shopping
            </Link>
          </div>

          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={34} />
              <h2>Your cart is empty</h2>
              <p>
                Add customized products and all selected specifications will appear here.
              </p>

              {feedback && (
                <div className="cart-feedback success">{feedback}</div>
              )}

              <Link to="/products">Browse Products</Link>
            </div>
          ) : (
            <form className="cart-layout" onSubmit={submitQuote}>
              <section className="cart-list">
                {cartItems.map((item) => (
                  <article className="cart-row" key={item.cartId}>
                    <div className="cart-row-image">
                      {item.itemImage ? (
                        <img src={item.itemImage} alt={item.itemName} />
                      ) : (
                        <ShoppingBag size={28} />
                      )}
                    </div>

                    <div className="cart-row-content">
                      <span className="cart-row-product">
                        {item.productName}
                      </span>

                      <h2>{item.itemName}</h2>

                      <div className="cart-spec-grid">
                        {item.size && (
                          <div>
                            <span>Size</span>
                            <strong>{item.size}</strong>
                          </div>
                        )}

                        <div>
                          <span>Quantity</span>
                          <strong>{item.quantity}</strong>
                        </div>

                        {item.colorMode && (
                          <div>
                            <span>Color Setup</span>
                            <strong>
                              {item.colorMode === 'preset'
                                ? 'Original Design Colors'
                                : item.colorMode === 'custom-preset'
                                  ? 'Original Colors + Custom Changes'
                                  : 'Custom Main Color'}
                            </strong>
                          </div>
                        )}

                        {Object.entries(item.colorSelections || {}).map(
                          ([zone, color]) =>
                            color ? (
                              <div key={zone}>
                                <span>{zone}</span>
                                <strong className="cart-color-value">
                                  <i style={{ background: color }} />
                                  {color}
                                </strong>
                              </div>
                            ) : null
                        )}

                        {Object.entries(item.options || {}).map(
                          ([key, value]) =>
                            value && (
                              <div key={key}>
                                <span>{labelFromSlug(key)}</span>
                                <strong>{value}</strong>
                              </div>
                            )
                        )}

                        {item.playerName && (
                          <div>
                            <span>Player Name</span>
                            <strong>{item.playerName}</strong>
                          </div>
                        )}

                        {item.playerNumber && (
                          <div>
                            <span>Player Number</span>
                            <strong>{item.playerNumber}</strong>
                          </div>
                        )}

                        {item.logoName && (
                          <div>
                            <span>Logo File</span>
                            <strong>{item.logoName}</strong>
                          </div>
                        )}
                      </div>

                      {item.notes && (
                        <div className="cart-notes">
                          <span>Special Instructions</span>
                          <p>{item.notes}</p>
                        </div>
                      )}
                    </div>

                    <button
                      className="cart-remove"
                      type="button"
                      aria-label={`Remove ${item.itemName}`}
                      onClick={() => removeFromCart(item.cartId)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </article>
                ))}
              </section>

              <aside className="cart-summary">
                <h2>Place Your Order</h2>

                <div className="cart-summary-line">
                  <span>Configured items</span>
                  <strong>{cartItems.length}</strong>
                </div>

                <div className="cart-summary-line">
                  <span>Total quantity</span>
                  <strong>{totalQuantity}</strong>
                </div>

                <div className="cart-customer-fields">
                  <label>
                    <span>Your name *</span>
                    <input
                      required
                      value={customer.name}
                      onChange={(event) =>
                        updateCustomer('name', event.target.value)
                      }
                      placeholder="Full name"
                    />
                  </label>

                  <label>
                    <span>Email *</span>
                    <input
                      required
                      type="email"
                      value={customer.email}
                      onChange={(event) =>
                        updateCustomer('email', event.target.value)
                      }
                      placeholder="you@company.com"
                    />
                  </label>

                  <label>
                    <span>Phone / WhatsApp</span>
                    <input
                      value={customer.phone}
                      onChange={(event) =>
                        updateCustomer('phone', event.target.value)
                      }
                      placeholder="+1 234 567 890"
                    />
                  </label>

                  <label>
                    <span>Company / Brand</span>
                    <input
                      value={customer.company}
                      onChange={(event) =>
                        updateCustomer('company', event.target.value)
                      }
                      placeholder="Brand name"
                    />
                  </label>

                  <label>
                    <span>Country</span>
                    <input
                      value={customer.country}
                      onChange={(event) =>
                        updateCustomer('country', event.target.value)
                      }
                      placeholder="Country"
                    />
                  </label>

                  <label>
                    <span>General message</span>
                    <textarea
                      rows="3"
                      value={customer.message}
                      onChange={(event) =>
                        updateCustomer('message', event.target.value)
                      }
                      placeholder="Deadline, shipping destination, target budget or other notes..."
                    />
                  </label>
                </div>

                <p>
                  Your order details are saved and emailed to AYOSONS. You will also receive
                  an Order Confirmed email with your submitted specifications.
                </p>

                <button
                  className="cart-quote-button"
                  type="submit"
                  disabled={status === 'submitting'}
                >
                  <Send size={16} />
                  {status === 'submitting'
                    ? 'Placing Order...'
                    : 'Place Order'}
                </button>

                {feedback && (
                  <div
                    className={
                      status === 'success'
                        ? 'cart-feedback success'
                        : 'cart-feedback error'
                    }
                  >
                    {feedback}
                  </div>
                )}

                <button
                  className="cart-clear"
                  type="button"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
              </aside>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

export default Cart
