'use client'

import React, {  useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import ProtectedRoute from '../ProtectedRoute'
import { useAuth } from '@/context/AuthContext'
import { HiOutlineLogout } from "react-icons/hi";
import { TitleProvider, useTitle } from '@/context/TitleContext'
import { IoChevronForwardOutline } from 'react-icons/io5'
import ThemeToggle from '@/components/ThemeToggle'
import { ToastContainer } from 'react-toastify'
import { useRouter } from 'next/navigation'

const AdminLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const { logout, user } = useAuth()
  const {title, setTitle} = useTitle()

  const router = useRouter();
  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/home')
    }
  }, [user, router])
  return (
    <ProtectedRoute>
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
        <div className="flex w-full bg-gray-50 dark:bg-primary-400">
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <div className={` w-full min-h-screen px-2 sm:px-7 transition-all duration-500 }`}>
            <header className=" py-2 flex items-center justify-between">
              <h1 className=" text-sm md:text-xl lg:text-xl font-semibold flex items-center font-sans dark:text-slate-100">
                Admin Dashboard <IoChevronForwardOutline className=' text-gray-400 dark:text-slate-100'/> {title}
              </h1>
              <div className=' flex items-center gap-2'>
                <ThemeToggle />
                {user &&
                 <button className=' flex items-center gap-1 text-white bg-[#0379e0] rounded-full p-2 px-3'
                  onClick={logout}>
                  <span className=' hidden md:block lg:block'>Logout</span>
                  <HiOutlineLogout/>
                 </button>

                 }
              </div>
            </header>
            <main className="">{children}</main>
          </div>
        </div>
    </ProtectedRoute>
  )
}

export default AdminLayout
