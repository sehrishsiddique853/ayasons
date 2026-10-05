import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'ayosons-cart'

export function CartProvider({
  children,
}) {
  const [cartItems, setCartItems] =
    useState(() => {
      try {
        const saved =
          localStorage.getItem(
            STORAGE_KEY
          )

        return saved
          ? JSON.parse(saved)
          : []
      } catch {
        return []
      }
    })

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(cartItems)
    )
  }, [cartItems])

  const addToCart = (
    newItems
  ) => {
    setCartItems((current) => [
      ...current,
      ...newItems,
    ])
  }

  const removeFromCart = (
    cartId
  ) => {
    setCartItems((current) =>
      current.filter(
        (item) =>
          item.cartId !== cartId
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const totalQuantity =
    useMemo(
      () =>
        cartItems.reduce(
          (total, item) =>
            total +
            Number(
              item.quantity || 0
            ),
          0
        ),
      [cartItems]
    )

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    totalQuantity,
  }

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context =
    useContext(CartContext)

  if (!context) {
    throw new Error(
      'useCart must be used inside CartProvider'
    )
  }

  return context
}