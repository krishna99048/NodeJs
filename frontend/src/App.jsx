import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserContextProvider from './Context/UserContext'
import Layout from './Components/Layout'
import Home from './Pages/Home'
import LoginPage from './Pages/Login'
import JoinUsPage from './Pages/JoinUs'
import Profile from './Pages/Profile'
import EditProfile from './Pages/EditProfile'
import ProductListing from './Pages/ProductListing'
import ProductDetail from './Pages/ProductDetail'
import Cart from './Pages/Cart'
import Checkout from './Pages/Checkout'
import OrderConfirmation from './Pages/OrderConfirmation'
import Account from './Pages/Account'
import Wishlist from './Pages/Wishlist'
import Support from './Pages/Support'
import AdminPanel from './Pages/AdminPanel'

const App = () => {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='login' element={<LoginPage />} />
          <Route path='joinus' element={<JoinUsPage />} />
          <Route path='profile' element={<Profile />} />
          <Route path='edit-profile' element={<EditProfile />} />
          <Route path='products' element={<ProductListing />} />
          <Route path='product/:id' element={<ProductDetail />} />
          <Route path='cart' element={<Cart />} />
          <Route path='checkout' element={<Checkout />} />
          <Route path='order-confirmation' element={<OrderConfirmation />} />
          <Route path='account' element={<Account />} />
          <Route path='wishlist' element={<Wishlist />} />
          <Route path='support' element={<Support />} />
          <Route path='admin' element={<AdminPanel />} />
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App