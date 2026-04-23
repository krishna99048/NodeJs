import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import LoginPage from './Pages/Login'
import JoinUsPage from './Pages/JoinUs'
import Profile from './Pages/Profile'
import EditProfile from './Pages/EditProfile'



const App = () => {
  return (
    <>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/joinus' element={<JoinUsPage />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/edit-profile' element={<EditProfile />} />
          
        </Routes>
    </>
  )
}

export default App