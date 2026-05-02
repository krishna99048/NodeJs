import React, { createContext, useState, useEffect } from 'react'

export const UserContext = createContext()

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [orders, setOrders] = useState([])

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedCart = localStorage.getItem('cartItems')
    const savedWishlist = localStorage.getItem('wishlistItems')
    const savedOrders = localStorage.getItem('orders')

    if (savedUser) setUser(JSON.parse(savedUser))
    if (savedCart) setCartItems(JSON.parse(savedCart))
    if (savedWishlist) setWishlistItems(JSON.parse(savedWishlist))
    if (savedOrders) setOrders(JSON.parse(savedOrders))
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems])

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems))
  }, [wishlistItems])

  // Save user to localStorage
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
  }, [user])

  // Save orders to localStorage
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders))
  }, [orders])

  // Cart functions
  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id)
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ))
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId))
  }

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCartItems(cartItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ))
    }
  }

  const clearCart = () => {
    setCartItems([])
  }

  // Wishlist functions
  const addToWishlist = (product) => {
    if (!wishlistItems.find(item => item.id === product.id)) {
      setWishlistItems([...wishlistItems, product])
    }
  }

  const removeFromWishlist = (productId) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== productId))
  }

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId)
  }

  // User functions
  const login = (userData) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
    clearCart()
  }

  const updateProfile = (updatedData) => {
    setUser({ ...user, ...updatedData })
  }

  // Order functions
  const addOrder = (order) => {
    setOrders([...orders, { ...order, id: Date.now(), date: new Date().toISOString() }])
    clearCart()
  }

  const contextValue = {
    user,
    setUser,
    login,
    logout,
    updateProfile,
    cartItems,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    orders,
    addOrder,
  }

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider