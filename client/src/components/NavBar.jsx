'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { FaCartShopping, FaOpencart, FaUser, FaBars, FaX } from 'react-icons/fa6'
import { CiSearch } from 'react-icons/ci'
import { useCart } from '@/context/CartContext'
import { useRouter } from "next/navigation"
import ThemeToggle from './ThemeToggle'


const Navbar = () => {
  const { logout, user } = useAuth()
  const { cartItems } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const getTotalQuantity = () => {
    return cartItems.reduce((sum,item) => sum + item.quantity, 0);
  }


  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/products/search?query=${searchQuery}`);
  }

  return (
    <nav className="bg-[#0379e0] text-white px-2 sm:px-5 lg:px-20 py-4">
      <div className="container flex justify-between items-center">
        {/* Logo Section */}
        <Link
          href="/home"
          className="text-xl md:text-2xl lg:text-4xl text-secondary-100  font-bold hover:text-amber-400 flex items-center gap-1"
        >
          <FaOpencart />
          MyStore
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch}>
        <div className="border dark:border-primary-200 rounded-full p-1 px-3 dark:bg-primary-200 bg-white w-[10rem] sm:w-[20rem] md:w-[30rem] lg:w-auto flex items-center">
          <input 
           type="text"
           className="p-2 bg-transparent outline-none text-sky-900 dark:text-sky-300 w-full placeholder:text-[#0379e0]" 
           placeholder="Search"
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)} />
          <button type='submit' className="p-1 bg-[#0379e0] rounded-full">
            <CiSearch className="text-white text-2xl" />
          </button>
        </div>
          </form>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6">
          <Link
            href="/home"
            className="hover:bg-[#103d64] text-white py-1 px-3 sm:py-2 md:py-3 md:px-4 lg:py-3 lg:px-5 rounded-full"
          >
            Home
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="hover:bg-[#103d64] text-white py-1 px-3 sm:py-2 md:py-3 md:px-4 lg:py-3 lg:px-5 rounded-full"
                >
                  Admin Panel
                </Link>
              )}
              <Link
                href="/cart"
                className="relative hover:bg-[#103d64] text-white py-1 px-3 sm:py-2 md:py-3 md:px-4 lg:py-3 lg:px-5 rounded-full"
              >
                <div className="absolute left-10 bottom-7 p-1 bg-amber-400 border border-amber-800 text-black text-xs rounded-full">
                  {getTotalQuantity()}
                </div>
                <FaCartShopping size={25} />
              </Link>
              <span className="font-semibold flex items-center">
                <FaUser />
                {user.name}
              </span>
              <button
                onClick={logout}
                className="hover:bg-[#103d64] text-white py-1 px-3 sm:py-2 md:py-3 md:px-4 lg:py-3 lg:px-5 rounded-full"
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hover:bg-[#103d64] text-white py-1 px-3 sm:py-2 md:py-3 md:px-4 lg:py-3 lg:px-5 rounded-full"
              aria-label="Login"
            >
              Login
            </Link>
          )}
        </div>
        <div className='hidden lg:block'>
          <ThemeToggle/>
        </div>


        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden text-2xl focus:outline-none"
        >
          {mobileMenuOpen ? <FaX /> : <FaBars />}
        </button>
      </div>


      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0379e0] text-white p-4">
          <Link
            href="/"
            className="block hover:bg-[#103d64] py-2 px-4 rounded-full"
            onClick={toggleMobileMenu}
          >
            Home
          </Link>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="block hover:bg-[#103d64] py-2 px-4 rounded-full"
                  onClick={toggleMobileMenu}
                >
                  Admin Panel
                </Link>
              )}
              <Link
                href="/cart"
                className="block hover:bg-[#103d64] py-2 px-4 rounded-full"
                onClick={toggleMobileMenu}
              >
                Cart
              </Link>
              <button
                onClick={() => {
                  logout()
                  toggleMobileMenu()
                }}
                className="block hover:bg-[#103d64] py-2 px-4 rounded-full"
              >
                Logout
              </button>
              <div className=' flex items-center px-4 py-2'>
                Theme
                <ThemeToggle/>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="block hover:bg-[#103d64] py-2 px-4 rounded-full"
              onClick={toggleMobileMenu}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
