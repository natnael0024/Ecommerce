'use client'
import { useState, useEffect,use } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import axiosInstance from '../../../../../axios'
import Image from 'next/image'
import Link from 'next/link'
import { useLoading } from '@/context/LoadingContext'
import { toast } from 'react-toastify'
import Spinner from '@/components/Spinner'

const ProductCategoryPage = ({params}) => {
  const searchParams = useSearchParams() 
  const categoryId = searchParams.get('category') 
  const [products, setProducts] = useState([])
  const [categoryName, setCategoryName] = useState()
  const { startLoading, stopLoading, loading } = useLoading()

  useEffect(() => {
    try {
      startLoading()
      if (categoryId) {
        const fetchData = async () => {
          const response = await axiosInstance.get(`/products?category=${categoryId}`)
          const data = response.data.data
          setProducts(data)        
        }
        const fetchCategory = async () => {
          const response = await axiosInstance.get(`/categories/${categoryId}`)
          setCategoryName(response.data.name)
        }
        fetchData()
        fetchCategory()
      }
    } catch (error) {
      toast.error('An error occurred', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
      })
    } finally {
      stopLoading()
    }
  }, [categoryId])

  if (loading) {
    return <Spinner/>
  }

  return (

    <div className='container mt-5'>
      <h2 className='text-2xl text-center sm:text-left font-bold mb-6 dark:text-gray-100'>{categoryName}</h2>
      {products?.length > 0 ? (
      <div className=' grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10'>
        {products.map((product,index) => (
          <ProductCard
            key={index}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image_path} 
          />
        ))}
        </div>
        ):(
          <div className=' mt-20 w-full flex flex-col items-center'>
            <Image
              src={'/no-results.png'}
              width={50}
              height={50}
              unoptimized={true}
              alt="no-search-results"
              className=' w-40' 
            />
            <span className='mt-5 font-bold text-3xl font-sans'>Nothing is here</span>
            <Link
              href={'/'}
              className="mt-4 block font-bold text-white p-3 px-5 rounded-full bg-[#0379e0] hover:bg-[#165389] duration-500"
              >
              Back to Home
            </Link>
          </div>
        )
      }
    </div>
  )
}

export default ProductCategoryPage
