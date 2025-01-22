'use client'
import React from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

const Navbar = () => {
  const { logout, user } = useAuth()

  return (
    <nav className="bg-gray-800 text-white px-2 sm:px-5 lg:px-20 py-4">
      <div className="container  flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/" className="text-xl font-bold hover:text-gray-300">
          MyStore
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          

          {user ? (
            <div className="flex items-center gap-4">
              {user.role =='admin' &&
                <Link href="/admin" className="hover:text-gray-300">
                  Admin Panel
                </Link>
              }
              <Link href="/cart" className="hover:text-gray-300">
                Cart
              </Link>
              <span className="font-semibold">{user.name}</span>
              <button
                onClick={logout}
                className="bg-gray-600 hover:bg-gray-500 text-white py-1 px-3 rounded"
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-500 text-white py-1 px-3 rounded"
              aria-label="Login"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
