'use client'
import React, { useState, useEffect } from 'react'
import axios from '../../../../../../axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axiosInstance from '../../../../../../axios'
import { useLoading } from '@/context/LoadingContext'
import Spinner from '@/components/Spinner'

const UserForm = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [role, setRole] = useState('')
    const [roles, setRoles] = useState([])
    const {startLoading, stopLoading, loading} = useLoading()
    const [isLoading, setIsLoading] = useState(false)

    const fetchRoles = async () => {
        try {
            startLoading()
            const response = await axios.get('/roles',{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setRoles(response.data)
        } catch (error) {
            toast.error("Failed to fetch roles.",{
                hideProgressBar: true
            })
        } finally {
            stopLoading()
        }
    }

    useEffect(() => {
        fetchRoles()
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            setIsLoading(true)
            await axiosInstance.post('/users', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
                role,
            },{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            toast.success("User registered successfully!",{
                hideProgressBar:true
            })
            setName('')
            setEmail('')
            setPassword('')
            setPasswordConfirmation('')
            setRole('')
        } catch (error) {
            if (error.response && error.response.data.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error("An error occurred during registration.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    if (loading) {
        return <Spinner/>
    }

    return (
       

            <div className="min-h-screen flex justify-center items-start mt-8 md:p-6">
                <div className="bg-white dark:bg-primary-200 p-4 md:p-8 lg:p-8 rounded-lg shadow-lg w-full sm:w-96">
                    <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">Register User</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full p-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
                            />
                        </div>
        
                        <div className="mb-4">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
                            />
                        </div>
        
                        <div className="mb-4">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
                            />
                        </div>
        
                        <div className="mb-4">
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required
                                className="w-full p-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
                            />
                        </div>
        
                        <div className="mb-6">
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                                className="w-full p-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
                            >
                                <option value="">Select Role</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>
        
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`${isLoading ? 'cursor-not-allowed' : 'hover:bg-primary-300'} font-semibold flex items-center gap-2 justify-center w-full p-3 bg-primary text-white rounded-lg  focus:outline-none focus:ring-2 focus:ring-primary-300`}
                        >
                            {isLoading && 
                                <div className=' w-5 h-5 border-[4px] rounded-full border-t-transparent border-white animate-spin'></div>}
                            {isLoading ? 'Registering...': 'Register User'}
                        </button>
                    </form>
                    <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
                </div>
            </div>
        
    )
}

export default UserForm
