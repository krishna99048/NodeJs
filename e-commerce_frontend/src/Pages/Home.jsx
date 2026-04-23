import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <>
     <div className="w-full h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter">
        DESIGN <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-pink-400">FASTER.</span>
      </h1>
      <p className="text-indigo-100/60 max-w-lg mb-10 text-lg">
        The next generation of creative tools is here. Join the community and start building today.
      </p>
      <Link to="/login">
        <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-indigo-400 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
          Get Started — It's Free
        </button>
      </Link>
    </div>
        
    
    </>
  )
}

export default Home