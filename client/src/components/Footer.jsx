'use client'
import React from 'react'
import Link from 'next/link'
import { FaOpencart,FaXTwitter, FaGithub } from 'react-icons/fa6'
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0379e0] mt-10  px-4 py-6  sm:px-5 lg:px-20">
        <div className="mx-auto w-full  ">
            <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link
            href="/"
            className=" text-2xl md:text-4xl lg:text-5xl text-amber-300 font-bold hover:text-gray-300 flex items-center gap-1"
            >
            <FaOpencart />
              <div className=' flex gap-0'>
               <span>MyStore</span> &trade;
              </div>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:gap-6 sm:grid-cols-2">
              <div>
                  <h2 className="mb-6 text-sm font-semibold text-gray-100 uppercase dark:text-light">Follow me</h2>
                  <ul className="text-gray-100 dark:text-gray-400 font-medium">
                      <li className="mb-4">
                          <Link target='blank' href="https://github.com/natnael0024" className="hover:underline text-gray-200 ">Github</Link>
                      </li>
                      <li>
                          <Link target='blank' href="https://www.linkedin.com/in/nathnael-legesse-6239591a2/" className="hover:underline text-gray-200">LinkedIn</Link>
                      </li>
                  </ul>
              </div>
              <div>
                  <h2 className="mb-6 text-sm font-semibold text-gray-100 uppercase dark:text-light">Legal</h2>
                  <ul className="text-gray-100 dark:text-gray-400 font-medium">
                      <li className="mb-4">
                          <Link href="/privacy-policy" className="hover:underline text-gray-200">Privacy Policy</Link>
                      </li>
                      <li>
                          <Link href="/terms&conditions" className="hover:underline text-gray-200">Terms &amp; Conditions</Link>
                      </li>
                  </ul>
              </div>
            </div>
            </div>
            <hr className="my-6 border-amber-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
            <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-gray-100 sm:text-center dark:text-gray-200">
                &copy; {new Date().getFullYear()} <Link href="/" className="hover:underline">MyStore</Link> | by <Link target='blank' href="https://natnaellegesse.vercel.app" className='underline'>Natnael Legesse</Link> | All Rights Reserved.
            </span>
            <div className="flex mt-4 sm:justify-center sm:mt-0 text-2xl">
                <Link target='blank' href="https://www.linkedin.com/in/nathnael-legesse-6239591a2/" className="text-gray-100 hover:text-gray-900 dark:hover:text-light duration-500">
                    <FaLinkedin/>
                    <span className="sr-only">LinkedIn</span>
                </Link>
                
                <Link target='blank' href="https://www.x.com/amnotmine"  className="text-gray-100 hover:text-gray-900 dark:hover:text-light ms-5 duration-500">
                    <FaXTwitter/>
                    <span className="sr-only">X page</span>
                </Link>
                <Link target='blank' href="https://www.github.com/natnael0024"  className="text-gray-100 hover:text-gray-900 dark:hover:text-light ms-5 duration-500">
                    <FaGithub/>
                    <span className="sr-only">GitHub account</span>
                </Link>
                </div>
            </div>
        </div>
    </footer>

  )
}

export default Footer
