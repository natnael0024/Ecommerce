'use client'
import React, { useEffect, useState } from "react"
import ProductCard from "@/components/ProductCard"
import FeaturedSlider from "@/components/Slider"
import axios from "axios"
import axiosInstance from "../../../../axios"
import Spinner from "@/components/Spinner"
import Link from "next/link"

const HomePage = () => {

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sliderPromos,setSliderPromos] = useState([])
 
  const fetchSliderPromos = async () => {
    const response = await axiosInstance.get(`/promotions?pos=home-slider`)
    console.log(response.data.promotions)
    setSliderPromos(response.data.promotions)
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products") 
        setProducts(response.data.data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
    fetchSliderPromos()
  }, [])

  if (loading) {
    return <Spinner/>
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>
  }

  return (
    <div className="container">
      <FeaturedSlider featuredItems={sliderPromos}/>

      {/* products */}
      <div className=" space-y-10">
        <div>
          <h1 className="text-2xl font-bold mb-6 dark:text-white ">Trending Products</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image_path} 
              />
            ))}
          </div>
        </div>
        { products.filter(product => product.category_id === 4).length > 0 && 
        <div>
          <div className=" flex justify-between items-center">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">Save on home appliances & accessories</h1>
            <Link href={`/products/categories?category=${4}`}
              className=" hover:bg-[#069bff1a] dark:hover:bg-[#069bff5c] p-2 rounded-full">
              view all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
            {products
              .filter(product=>product.category_id===4)
              .map((product,index) => (
              <ProductCard
                key={index}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image_path} 
                />
              ))}
          </div>
        </div>
        }
        { products.filter(product => product.category_id === 5).length > 0 && 
        <div >
          <h1 className="text-2xl font-bold mb-6 dark:text-white"></h1>
          <div className=" flex justify-between items-center">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">Popular in healthcare & fitness</h1>
            <Link href={`/products/categories?category=${5}`}
              className=" hover:bg-[#069bff1a] dark:hover:bg-[#069bff5c] p-2 rounded-full">
              view all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
            {products
              .filter(product=>product.category_id===5)
              .map((product,index) => (
                <ProductCard
                key={index}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image_path} 
                />
              ))}
          </div>
        </div>
        }
        { products.filter(product => product.category_id === 1).length > 0 && 
        <div >
          <h1 className="text-2xl font-bold mb-6 dark:text-white"></h1>
          <div className=" flex justify-between items-center">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">Get Best Deal on Electronics</h1>
            <Link href={`/products/categories?category=${1}`}
              className=" hover:bg-[#069bff1a] dark:hover:bg-[#069bff5c] p-2 rounded-full">
              view all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
            {products
              .filter(product=>product.category_id===1)
              .map((product,index) => (
                <ProductCard
                key={index}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image_path} 
                />
              ))}
          </div>
        </div>
        }
        { products.filter(product => product.category_id === 2).length > 0 && 
        <div >
          <h1 className="text-2xl font-bold mb-6 dark:text-white"></h1>
          <div className=" flex justify-between items-center">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">Food & Beverages</h1>
            <Link href={`/products/categories?category=${2}`}
              className=" hover:bg-[#069bff1a] dark:hover:bg-[#069bff5c] p-2 rounded-full">
              view all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
            {products
              .filter(product=>product.category_id===2)
              .map((product,index) => (
                <ProductCard
                key={index}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image_path} 
                />
              ))}
          </div>
        </div>
        }
        { products.filter(product => product.category_id === 3).length > 0 && 
        <div >
          <h1 className="text-2xl font-bold mb-6 dark:text-white"></h1>
          <div className=" flex justify-between items-center">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">Keep Up With Latest Fashion Trends</h1>
            <Link href={`/products/categories?category=${3}`}
              className=" hover:bg-[#069bff1a] dark:hover:bg-[#069bff5c] p-2 rounded-full">
              view all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
            {products
              .filter(product=>product.category_id===3)
              .map((product,index) => (
                <ProductCard
                key={index}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image_path} 
                />
              ))}
          </div>
        </div>
        }
      </div>
    </div>
  )
}

export default HomePage
