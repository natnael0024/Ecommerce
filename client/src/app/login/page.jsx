"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { FaOpencart } from "react-icons/fa6"

const LoginPage = () => {
  const { login, register, user } = useAuth()
  const router = useRouter()

  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState("") 

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/home")
      }
    }
  }, [user, router])

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole)
    if (selectedRole === "admin") {
      setEmail("admin@example.com") 
      setPassword("123456") 
    } else if (selectedRole === "user") {
      setEmail("user@example.com") 
      setPassword("123456") 
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await login(email, password) // Login for both roles (admin and user)
    } catch (error) {
      setError(error.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-tl dark:from-black dark:to-primary-300 ">
      {/* Left Side: Form Section */}
      <div className=" max-w-md mx-auto my-auto p-6 rounded-xl flex flex-col justify-center w-full md:w-1/2">
        <div className="text-4xl mb-10 md:text-5xl lg:text-6xl text-secondary-100 font-bold flex items-center gap-1">
          <FaOpencart />
          MyStore
        </div>

        {/* Role Selection Buttons (only for login) */}
        {!isRegister && (
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => handleRoleSelection("admin")}
              className={`w-full py-2 rounded ${role === "admin" ? "bg-primary text-white " : "bg-gray-200 dark:text-black"}`}
            >
              Admin
            </button>
            <button
              onClick={() => handleRoleSelection("user")}
              className={`w-full py-2 rounded ${role === "user" ? "bg-primary text-white" : "bg-gray-200 dark:text-black"}`}
            >
              User
            </button>
          </div>
        )}

        <h1 className="text-xl font-bold mb-4">{isRegister ? "Register" : "Login"}</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-black dark:text-white px-3 py-2  rounded"
                required
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-black dark:text-white px-3 py-2  rounded"
              required
              readOnly={role !== ""} // Make email field read-only based on role selection
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-black dark:text-white px-3 py-2  rounded"
              required
              readOnly={role !== ""} // Make password field read-only based on role selection
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className={`w-full bg-primary text-white py-2 rounded hover:bg-primary-200 flex items-center justify-center gap-2 font-semibold ${loading && 'cursor-not-allowed'}`}
          >
            <div className={`w-5 h-5 border-4 border-[#e9f5ff] border-t-transparent rounded-full animate-spin ${!loading && 'hidden'}`}></div>
            {loading ? "Processing..." : "Login"}
          </button>
        </form>
        <p className="text-sm mt-4 text-center">
          {isRegister ? "Already have an account?" : "Don't have an account yet?"}{" "}
          <button onClick={() => setIsRegister(!isRegister)} className="text-primary underline">
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>

      {/* Right Side: Image Section */}
      <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url("https://framerusercontent.com/images/rZ7ujBaa5BAzdp5fwhNvyZFLAnc.jpg?scale-down-to-2048")' }} />
    </div>
  )
}

export default LoginPage
