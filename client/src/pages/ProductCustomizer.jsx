import {
  useMemo,
  useState,
} from 'react'

import {
  useParams,
  Link,
} from 'react-router-dom'

import {
  ArrowLeft,
  CheckCircle2,
  ShoppingBag,
  Trash2,
} from 'lucide-react'

import CustomProductCard
  from '../components/customizer/CustomProductCard'

import {
  productCustomizerData,
} from '../data/productCustomizerData'

import {
  useCart,
} from '../context/CartContext'

import Footer
  from '../components/home/Footer'

import '../style/products/ProductCustomizer.css'


const createInitialState = (
  items
) => {
  return items.reduce(
    (result, item) => {
      result[item.id] = {
        enabled: false,

        size: '',

        color:
          item.colors?.[0] ||
          '#080808',

        quantity: 1,

        sleeve:
          item.options
            ?.sleeve?.[0] ||
          '',

        playerName: '',

        playerNumber: '',

        logoName: '',

        notes: '',
      }

      return result
    },
    {}
  )
}


function ProductCustomizer() {
  const {
    categorySlug,
    productSlug,
  } = useParams()

  const product =
    productCustomizerData[
      productSlug
    ]

  const {
    cartItems,
    addToCart,
    removeFromCart,
    totalQuantity,
  } = useCart()

  const [
    configuration,
    setConfiguration,
  ] = useState(() =>
    product
      ? createInitialState(
          product.items
        )
      : {}
  )

  const [
    message,
    setMessage,
  ] = useState('')


  const selectedCount =
    useMemo(
      () =>
        Object.values(
          configuration
        ).filter(
          (item) =>
            item.enabled
        ).length,
      [configuration]
    )


  if (!product) {
    return (
      <>
        <main className="product-customizer-page">

          <div className="customizer-empty">

            <h1>
              Customizer coming soon
            </h1>

            <p>
              Custom options for this
              product have not been
              added yet.
            </p>

            <Link
              to={`/products/${categorySlug}`}
            >
              Back to collection
            </Link>

          </div>

        </main>

        <Footer />
      </>
    )
  }


  const toggleItem = (
    itemId
  ) => {
    setConfiguration(
      (current) => ({
        ...current,

        [itemId]: {
          ...current[itemId],

          enabled:
            !current[itemId]
              .enabled,
        },
      })
    )

    setMessage('')
  }


  const changeItem = (
    itemId,
    key,
    value
  ) => {
    setConfiguration(
      (current) => ({
        ...current,

        [itemId]: {
          ...current[itemId],

          [key]: value,
        },
      })
    )

    setMessage('')
  }


  const handleAddToCart = () => {

    const selectedItems =
      product.items.filter(
        (item) =>
          configuration[
            item.id
          ]?.enabled
      )


    if (
      selectedItems.length ===
      0
    ) {
      setMessage(
        'Please select at least one item.'
      )

      return
    }


    const missingSize =
      selectedItems.find(
        (item) =>
          !configuration[
            item.id
          ].size
      )


    if (missingSize) {
      setMessage(
        `Please select a size for ${missingSize.name}.`
      )

      return
    }


    const cartEntries =
      selectedItems.map(
        (item) => ({
          cartId:
            `${item.id}-${Date.now()}-${Math.random()}`,

          categorySlug,

          productSlug,

          productName:
            product.name,

          itemId:
            item.id,

          itemName:
            item.name,

          ...configuration[
            item.id
          ],
        })
      )


    addToCart(cartEntries)

    setMessage(
      `${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''} added to cart.`
    )
  }


  return (
    <>
      <main className="product-customizer-page">

        <section className="product-customizer-hero">

          <div className="product-customizer-hero-inner">

            <Link
              className="customizer-back"
              to={`/products/${categorySlug}`}
            >
              <ArrowLeft
                size={18}
              />

              Back to Sportswear
            </Link>


            <span className="customizer-eyebrow">
              {product.eyebrow}
            </span>


            <h1>
              {product.title}
            </h1>


            <p>
              {product.description}
            </p>


            <div className="customizer-steps">

              <span>
                <b>01</b>
                Select items
              </span>

              <span>
                <b>02</b>
                Choose size
              </span>

              <span>
                <b>03</b>
                Pick colors
              </span>

              <span>
                <b>04</b>
                Customize
              </span>

              <span>
                <b>05</b>
                Add to cart
              </span>

            </div>

          </div>

        </section>


        <div className="product-customizer-layout">

          <section className="customizer-products">

            <div className="customizer-section-heading">

              <div>
                <span>
                  BUILD YOUR KIT
                </span>

                <h2>
                  Choose what you need
                </h2>

                <p>
                  You do not have to
                  order the complete
                  set. Select only the
                  products your team
                  requires.
                </p>
              </div>


              <strong>
                {selectedCount} /{' '}
                {product.items.length}{' '}
                selected
              </strong>

            </div>


            <div className="customizer-product-list">

              {product.items.map(
                (item) => (
                  <CustomProductCard
                    key={item.id}
                    item={item}
                    selected={
                      configuration[
                        item.id
                      ]
                    }
                    onToggle={
                      toggleItem
                    }
                    onChange={
                      changeItem
                    }
                  />
                )
              )}

            </div>

          </section>


          <aside className="customizer-cart-panel">

            <div className="customizer-cart-sticky">

              <div className="customizer-cart-heading">

                <div>
                  <ShoppingBag
                    size={22}
                  />

                  <h3>
                    Your Cart
                  </h3>
                </div>

                <span>
                  {totalQuantity}
                </span>

              </div>


              <div className="customizer-current-selection">

                <span>
                  Current selection
                </span>

                <strong>
                  {selectedCount}{' '}
                  products
                </strong>

              </div>


              {message && (
                <div className="customizer-message">
                  <CheckCircle2
                    size={18}
                  />

                  <span>
                    {message}
                  </span>
                </div>
              )}


              <button
                type="button"
                className="customizer-add-cart"
                onClick={
                  handleAddToCart
                }
              >
                <ShoppingBag
                  size={18}
                />

                Add Selected To Cart
              </button>


              <p className="customizer-cart-help">
                Final pricing can be
                confirmed according to
                quantity, customization,
                fabric and branding
                requirements.
              </p>


              {cartItems.length >
                0 && (
                <div className="customizer-cart-items">

                  <h4>
                    Cart items
                  </h4>

                  {cartItems.map(
                    (cartItem) => (
                      <div
                        className="customizer-mini-cart-item"
                        key={
                          cartItem.cartId
                        }
                      >

                        <div>
                          <strong>
                            {
                              cartItem.itemName
                            }
                          </strong>

                          <span>
                            {
                              cartItem.size
                            }
                            {' · '}
                            Qty{' '}
                            {
                              cartItem.quantity
                            }
                          </span>
                        </div>


                        <button
                          type="button"
                          aria-label="Remove from cart"
                          onClick={() =>
                            removeFromCart(
                              cartItem.cartId
                            )
                          }
                        >
                          <Trash2
                            size={16}
                          />
                        </button>

                      </div>
                    )
                  )}

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