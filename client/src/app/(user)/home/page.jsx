'use client'
import React, { useEffect, useState } from "react"
import ProductCard from "@/components/ProductCard"
import FeaturedSlider from "@/components/Slider"

const HomePage = () => {
  const featuredItems = [
    {
      id: 1,
      name: 'Product 1',
      price: '19.99',
      image: 'https://img.freepik.com/free-psd/black-friday-super-sale-facebook-cover-banner-template_120329-5177.jpg?t=st=1737988889~exp=1737992489~hmac=df4bfc2e766ffeaf19c59f5ea0d250e0efc328eca595dcbb05ff0ab2938b2c0c&w=1060',
    },
    {
      id: 2,
      name: 'Product 2',
      price: '29.99',
      image: 'https://img.freepik.com/free-psd/black-friday-big-sale-social-media-post-design-template_47987-25239.jpg?t=st=1737988991~exp=1737992591~hmac=f249848359a4c167c8264d139942bf6dac9c2430c0ad813eea35cf4c78a11b64&w=1060',
    },
    {
      id: 3,
      name: 'Ad: 50% Off!',
      price: '',
      image: 'https://img.freepik.com/free-psd/black-friday-super-sale-facebook-cover-template_120329-2087.jpg?t=st=1737989213~exp=1737992813~hmac=90c17cc196393a429426e31b63d75a187facd4acd58f71a39d1857c8fa651fc9&w=900',
    },
    // {
    //   id: 4,
    //   name: 'Ad: 50% Off!',
    //   price: '',
    //   image: 'https://img.freepik.com/free-photo/showing-cart-trolley-shopping-online-sign-graphic_53876-133967.jpg?t=st=1737531792~exp=1737535392~hmac=b2937a6ee200069ffe20d78df950b9166a41c9b6d959f1d618539b2017c05dad&w=1060',
    // },
  ]

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8002/api/products") 
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }
        const data = await response.json()
        setProducts(data.data)
        console.log(data.data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return <p className="text-center mt-10">Loading products...</p>
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>
  }

  return (
    <div className="container">
      <FeaturedSlider featuredItems={featuredItems}/>

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
        <div>
          <h1 className="text-2xl font-bold mb-6 dark:text-white">Save on home appliances & accessories</h1>
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
        { products.filter(product => product.category_id === 5).length > 0 && 
        <div >
          <h1 className="text-2xl font-bold mb-6 dark:text-white">Popular in healthcare & fitness</h1>
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
      </div>
    </div>
  )
}

export default HomePage
