"use client"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { HiMoon, HiSun } from "react-icons/hi"
import { LuSun } from "react-icons/lu"

const ThemeToggle = () => {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null 

  return (
    <div className="relative z-30">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className=" text-white px-4 py-2 rounded-md "
      >
            {theme === 'light' && <HiSun className="h-5 w-5 text-black" title="Light Mode" />}
            {theme === 'dark' && <HiMoon className="h-5 w-5" title="Dark Mode" />}
            {theme === 'system' && (systemTheme === 'dark' ? <HiMoon className="h-5 w-5" title="Dark Mode" /> : <HiSun className="h-5 w-5" title="Light Mode" />)}        
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-900 shadow-lg rounded-md">
          <button
            onClick={() => { setTheme("light"); setIsOpen(false); }}
            className="block rounded-md w-full text-left px-4 py-1 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
          >
             Light
          </button>
          <button
            onClick={() => { setTheme("dark"); setIsOpen(false); }}
            className="block rounded-md w-full text-left px-4 py-1 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Dark
          </button>
          <button
            onClick={() => { setTheme("system"); setIsOpen(false); }}
            className="block rounded-md w-full text-left px-4 py-1 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            System
          </button>
        </div>
      )}
    </div>
  )
}

export default ThemeToggle;
