"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { ToastContainer } from "react-toastify"

const LoginPage = () => {
  const { login, register, user } = useAuth()
  const router = useRouter()

  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/home")
      }
    }
  }, [user, router]) 

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isRegister) {
        await register(email, password, name)
      } else {
        await login(email, password)
      }
    } catch (error) {
      setError(error.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow rounded">
      <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
                />
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
              className="w-full text-black dark:text-white px-3 py-2 border rounded"
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
            className="w-full text-black dark:text-white px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-black dark:text-white px-3 py-2 border rounded"
            required
          />
        </div>
        <button
          disabled={loading}
          type="submit"
          className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2 font-semibold ${loading && 'cursor-not-allowed'}`}
        >
          <div className={`w-5 h-5 border-4 border-[#e9f5ff] border-t-transparent rounded-full animate-spin ${!loading && 'hidden'}`}>
          </div>
          {loading ? "Processing..." : (isRegister ? "Register" : "Login")}
        </button>
      </form>
      <p className="text-sm mt-4 text-center">
        {isRegister ? "Already have an account?" : "Don't have an account yet?"}{" "}
        <button onClick={() => setIsRegister(!isRegister)} className="text-blue-500 underline">
          {isRegister ? "Login" : "Register"}
        </button>
      </p>
    </div>
  )
}

export default LoginPage
