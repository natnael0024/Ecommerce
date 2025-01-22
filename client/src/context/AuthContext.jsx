'use client'
import React, { createContext, useContext, useState, useEffect } from "react"
import axios from "../../axios"
import {useRouter} from 'next/navigation'

// const AuthContext = createContext()

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(false);
//   const router = useRouter()

//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//   }, []);

//   useEffect(() => {
//     if (user) {
//       localStorage.setItem("user", JSON.stringify(user));
//     } else {
//       localStorage.removeItem("user");
//     }
//   }, [user]);

//   const login = async (email, password) => {
//     try {
//       setLoading(true)
//       const response = await axios.post('/login',{email,password})
//       setUser(response.data.user)
//       router.push('/')
//     } catch (error) {
//       console.log(error)
//       alert("Invalid email or password")
//     } finally {
//       setLoading(false)
//     }
    
//   };

//   const register = async (email, password, name) => {
//    try {
//     setLoading(true)
//     const res = await axios.post('/register',{name,email,password})
//     setUser(res.data.user)
//     router.push('/')
//    } catch (error) {
//     console.error(error);
//     alert("Registration failed.");
//    } finally {
//     setLoading(false)
//    }
//   };

//   const logout = () => {
//     setUser(null); 
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// pppppp


const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    // const [role, setRole] = useState(null) 
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        const storedToken = localStorage.getItem('token')
        // const storedRole = localStorage.getItem('role') 
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser))
            setToken(storedToken)
            // setRole(storedRole)
        }
        console.log(user)
    }, [])

    const login = async (email,password) => {
        try {
            setLoading(true)
            const res = await axios.post('/login',{email,password})
            const data = res.data
            data.user.role = data.role
            setUser(data.user)
            setToken(data.access_token)
            console.log('INLOGIN: ',user)
            // setRole(data.role)
            localStorage.setItem('user', JSON.stringify(data.user))
            localStorage.setItem('token', data.access_token)
            // localStorage.setItem('role', data.role) 
            router.push('/')
        } catch (error) {
            // console.error(error)
            // alert("Login failed.")
            return {'message':'Login Failed'}
        } finally {
            setLoading(false)
        }
    }

    const register = async (email, password, name) => {
         try {
          setLoading(true)
          const res = await axios.post('/register',{name,email,password})
          data.user.role = data.role
          setUser(data.user)
          setToken(data.access_token)
          
          localStorage.setItem('user', JSON.stringify(data.user))
          localStorage.setItem('token', data.access_token)
          router.push('/')
         } catch (error) {
          // console.error(error);
          return {'message':'Login Failed'}
          // alert("Registration failed.")
         } finally {
          setLoading(false)
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
