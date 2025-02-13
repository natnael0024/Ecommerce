'use client'
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { use } from "react"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import axios from "../../../../../axios"
import Image from "next/image"
import ProductCard from "@/components/ProductCard"
import Spinner from "@/components/Spinner"

const ProductPage = ({ params }) => {
  const { id } = use(params) 
  const [product, setProduct] = useState(null)
  const [similarProducts, setSimilarProducts] = useState([])
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()
  const { cartItems,addToCart } = useCart()
  const { user } = useAuth()

  const cartItem = cartItems.find((item) => item.id === product?.id)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${id}`) 
        if (response.status != 200) {
          throw new Error("Failed to fetch product details")
        }
        const data = await response.data
        setProduct(data.product)
        setSimilarProducts(data.similar)
      } catch (error) {
        // throw new Error(error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!user) {
      alert("You must be logged in to add items to the cart.")
      router.push("/login")
      return
    }
    addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image_path: product.image_path,
      })
    // alert(`${product.name} has been added to the cart!`)
  }

  if (loading) {
    return <Spinner text={'Loading product details...'}/>
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>
  }

  return (

    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Product Image */}
        {product.image_path ? (
          <Image
            width={50}
            height={50}
            src={product.image_path}
            alt={product.name}
            className="w-full md:w-1/2 h-full  object-cover rounded-md dark:bg-black"
            unoptimized={true} 

          />
        ):(
          <Image 
            src="/product_image_placeholder.png" 
            alt="My Optimized Image" 
            className='w-full md:w-1/2 h-full  object-cover rounded-md '
            width={500}
            height={500}
            unoptimized={true}
          />
        )}

        {/* Product Details */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold dark:text-white">{product.name}</h1>
          <p className="text-gray-600 dark:text-gray-200 text-lg mt-2">${product.price}</p>
          <p className="text-gray-700 dark:text-gray-200 mt-4">{product.description}</p>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            // disabled={!!cartItem} 
            className={`py-2 px-4 mt-4 rounded focus:ring-2  ${
              cartItem
                ? "bg-green-500 text-white focus:ring-green-300"
                : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-300 text-white"
            }`}
          >
            {cartItem
              ? `Added (${cartItem.quantity})`
              : "Add to Cart"}
          </button>
          {/* Back to Home */}
          <button
            onClick={() => router.push("/")}
            className="mt-4 block text-blue-500 underline"
          >
            Back to Home
          </button>
        </div>
      </div>
      {similarProducts.length > 0 &&
      <div className=" mt-5">
        <h1 className=" text-xl md:text-2xl font-semibold">Similar Products You Might Like</h1>
        <div className=" mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {similarProducts.map(prod=>(
            <ProductCard 
                key={prod.id}
                id={prod.id}
                name={prod.name}
                price={prod.price}
                image={prod.image_path} />
          ))}
        </div>
      </div>}
    </div>
  )
}

export default ProductPage
