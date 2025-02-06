'use client'
import React, { createContext, useContext, useState, useEffect } from "react"
import axios from "../../axios"
import {redirect, useRouter} from 'next/navigation'
import { toast } from "react-toastify"


const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const router = useRouter()

    // useEffect(() => {
        // const storedUser = localStorage.getItem('user')
        // const storedToken = localStorage.getItem('token')
        // if (storedUser && storedToken) {
        //     setUser(JSON.parse(storedUser))
        //     setToken(storedToken)
        // }
    // }, [])

    useEffect(() => {
        if (typeof window !== 'undefined') { 
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('token');
            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            }
        }
    }, []);

    const login = async (email,password) => {
        try {
            const res = await axios.post('/login',{email,password})
            const data = res.data
            data.user.role = data.role
            setUser(data.user)
            setToken(data.access_token)
            localStorage.setItem('user', JSON.stringify(data.user))
            localStorage.setItem('token', data.access_token)
            toast.success('Login success', {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: true,
              })
            if (data.role === 'admin') {
                router.push('/admin')
            } else {
                router.push('/home')
            }
        } catch (error) {
            toast.error('Login failed', {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: true,
            })
        } 
    }

    const register = async (email, password, name) => {
         try {
          const res = await axios.post('/register',{name,email,password})
          console.log('Register:',res)
          const data = res.data
          data.user.role = data.role
          setUser(data.user)
          setToken(data.access_token)

          localStorage.setItem('user', JSON.stringify(data.user))
          localStorage.setItem('token', data.access_token)
          toast.success('Registration success', {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: true,
            })
          router.push('/home')
         } catch (error) {
            toast.error('Registration failed', {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: true,
            })
         }
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        // setRole(null) 
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        // localStorage.removeItem('role') 
    }
    
    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context;
}

// export { AuthProvider, AuthContext }
