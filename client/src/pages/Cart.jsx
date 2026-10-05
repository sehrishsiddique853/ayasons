import { Link } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import Footer from '../components/home/Footer'
import '../style/products/Cart.css'

function Cart() {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    totalQuantity,
  } = useCart()

  return (
    <>
      <main className="cart-page">
        <div className="cart-shell">
          <div className="cart-page-head">
            <div>
              <span>Your Selection</span>
              <h1>Shopping Cart</h1>
              <p>
                Review your selected products and customization details before requesting a quote.
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
              <p>Add customizable products and they will appear here.</p>
              <Link to="/products">Browse Products</Link>
            </div>
          ) : (
            <div className="cart-layout">
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
                      <span className="cart-row-product">{item.productName}</span>
                      <h2>{item.itemName}</h2>

                      <div className="cart-row-meta">
                        {item.size && <span>Size: <strong>{item.size}</strong></span>}
                        {item.color && (
                          <span className="cart-color-meta">
                            Color:
                            <i style={{ background: item.color }} />
                            <strong>{item.color}</strong>
                          </span>
                        )}
                        <span>Qty: <strong>{item.quantity}</strong></span>
                      </div>

                      {(item.playerName || item.playerNumber) && (
                        <div className="cart-row-personalization">
                          {item.playerName && <span>Name: {item.playerName}</span>}
                          {item.playerNumber && <span>Number: {item.playerNumber}</span>}
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
                <h2>Order Summary</h2>

                <div className="cart-summary-line">
                  <span>Items</span>
                  <strong>{cartItems.length}</strong>
                </div>

                <div className="cart-summary-line">
                  <span>Total quantity</span>
                  <strong>{totalQuantity}</strong>
                </div>

                <p>
                  Pricing is confirmed after review because fabric, branding, quantity and customization can affect the final quote.
                </p>

                <Link className="cart-quote-button" to="/contact">
                  Request Quote
                </Link>

                <button className="cart-clear" type="button" onClick={clearCart}>
                  Clear Cart
                </button>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

export default Cart
