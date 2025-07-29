'use client'
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import BrandSlider from "@/components/BrandSlider";
import { FaOpencart } from "react-icons/fa6";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { toast } from "react-toastify";
import { SiAdidas, SiPuma, SiSamsung, SiZara,SiLenovo, SiNvidia, SiHp } from "react-icons/si";

const products = [
  { id: 1, name: "Linen-blended Coat", price: "$699", image: "https://img.freepik.com/free-photo/fashionable-mocha-tone-portrait_23-2151914803.jpg" },
  { id: 2, name: "Perfume", price: "$1299", image: "https://img.freepik.com/free-photo/dreamy-aesthetic-cosmetic-product-with-fresh-background_23-2151382791.jpg" },
  { id: 3, name: "Headphones", price: "$199", image: "https://img.freepik.com/free-photo/shiny-black-headphones-reflect-golden-nightclub-lights-generated-by-ai_188544-10148.jpg?t=st=1738745145~exp=1738748745~hmac=055219d296fff427a616b6668da7e109cd8c3bf198e1b6a2a9994f4069dc9779&w=1380" },
];

const brands = [
  { id: 1, logo: <SiAdidas/>, alt: 'Brand 1' },
  { id: 2, logo: <SiPuma/>, alt: 'Brand 2' },
  { id: 3, logo: <SiSamsung/>, alt: 'Brand 3' },
  { id: 4, logo: <SiZara/>, alt: 'Brand 4' },
  { id: 5, logo: <SiLenovo/>, alt: 'Brand 5' },
  { id: 6, logo: <SiNvidia />    , alt: 'Brand 6' },
  { id: 7, logo: <SiHp/>, alt: 'Brand 7' },
];

const handleSubscribe = (e) => {
  e.preventDefault()
  toast.info('We Appreciate You!',{
    hideProgressBar:true,
    position:"bottom-right"
  })
}

export const LandingPage = () => {
  return (
    <div className="  dark:bg-gray-900 text-gray-900 dark:text-white ">
      <Navbar/>
      {/* Hero Section */}
      <section className="h-[40rem] flex flex-col items-center justify-center text-center px-6  bg-fixed bg-cover" style={{ backgroundImage: "url('https://framerusercontent.com/images/rZ7ujBaa5BAzdp5fwhNvyZFLAnc.jpg?scale-down-to=2048')" }}>
          <motion.h1
            className=" text-6xl sm:text-6xl lg:text-8xl font-bold font-sans text-white"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Elevate Your Shopping Experience
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Discover the best deals on tech gadgets, apparel, and more.
          </motion.p>
          <motion.button
            className="mt-6 px-6 py-3 bg-primary text-white text-2xl font-semibold font-sans shadow-lg hover:bg-primary-200 duration-200 flex items-center gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Link href='/home' className=" flex items-center gap-2"><FaShoppingCart className=" text-amber-300" /> Shop Now</Link>
          </motion.button>
          <motion.div
          className="absolute bottom-36"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          >
            <svg
              className="w-6 h-6 animate-bounce"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
      </section>
      

      {/* brands section */}
      <section className="py-10 ">
        <h2 className="text-center text-3xl font-bold mb-6">Our Trusted Brands</h2>
        <BrandSlider items={brands}/>
      </section>

      {/* Featured Products */}
      <section className="py-10">
      <h2 className="text-3xl font-bold text-center mb-6">Featured Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 w-full  md:w-[80%] lg:w-[70%] mx-auto">
        {products.map((product) => (
          <motion.div
            key={product.id}
            className="bg-white dark:bg-gray-800   shadow-sm hover:shadow-md cursor-pointer "
            initial={{ opacity: 1, scale: 1, y: 100 }}
            whileInView={{ opacity: 1, scale: 1, y:0 }}
            transition={{ duration: 1 }}
          >
            <img src={product.image} alt={product.name} className="w-full h-80 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{product.name}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-transparent dark:bg-gray-800">
        <h2 className="text-3xl font-bold text-center">What Our Customers Say</h2>
        <div className="flex flex-col md:flex-row gap-6 mt-8 justify-center items-center">
          <motion.div
            className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md max-w-sm"
            whileHover={{ scale: 1.05 }}
          >
            <p>"Amazing quality and fast delivery!"</p>
            <div className="flex items-center mt-3 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <p className="mt-2 font-semibold">- Kasu Hopa</p>
          </motion.div>
          <motion.div
            className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md max-w-sm"
            whileHover={{ scale: 1.05 }}
          >
            <p>"Best shopping experience ever!"</p>
            <div className="flex items-center mt-3 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <p className="mt-2 font-semibold">- Gete Torpa</p>
          </motion.div>
        </div>
      </section>

      {/* Subscribe */}
      <section className=" py-10 bg-primary text-black dark:text-white sm:text-2xl font-sans">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white">Get in Touch</h2>
          <form className="mt-10 flex flex-col items-center justify-center gap-4 md:flex-row lg:flex-row ">
            <input type="text" placeholder="Your Name" className="p-3 border " />
            <input type="email" placeholder="Your Email" className="p-3 border  " />
            <button type="submit" onClick={(e)=>handleSubscribe(e)} className="ml-4 p-3 px-5 bg-primary-200 hover:bg-primary duration-200 text-white ">Submit</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center dark:bg-gray-900 dark:text-white">
        <p>&copy; 2025 MyStore. All rights reserved. Natnael Legesse</p>
      </footer>
    </div>
  );
};

export default LandingPage;

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0  z-40 w-full px-6 py-4 flex items-center justify-between transition-all duration-700 ${
        isScrolled ? "bg-white dark:bg-black backdrop-blur-md" : "bg-transparent"
      }`}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Logo */}
      <a href="#" className="text-2xl font-bold">
      <h1
          className=" text-md mt-2 md:text-xl lg:text-2xl font-thin hover:text-amber-400 flex items-center gap-1"
        >
          <FaOpencart />
          MyStore
        </h1>
      </a>

      <div className=' text-right'>
          <ThemeToggle/>
      </div>

      {/* Nav Links */}
      {/* <div className="hidden md:flex space-x-8 text-gray-300">
        <a href="#about" className="hover:text-white transition duration-300">
          About
        </a>
        <a href="#gallery" className="hover:text-white transition duration-300">
          Gallery
        </a>
      </div> */}

      {/* Mobile Menu Button */}
      {/* <MobileMenu /> */}
    </motion.nav>
  );
};

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-white focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 left-0 w-full bg-black/90 backdrop-blur-md shadow-md flex flex-col items-center space-y-6 py-6 md:hidden"
          >
            <a href="#about" className="text-white text-lg" onClick={() => setIsOpen(false)}>
              About
            </a>
            <a href="#gallery" className="text-white text-lg" onClick={() => setIsOpen(false)}>
              Gallery
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};