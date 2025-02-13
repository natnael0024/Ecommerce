'use client'
import { useState, useEffect,use } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { useLoading } from '@/context/LoadingContext'
import Spinner from '@/components/Spinner'
import axiosInstance from '../../../../../axios'

const SearchResults = ({params}) => {
  const searchParams = useSearchParams() 
  const query = searchParams.get('query') 
  const [products, setProducts] = useState([])
  const { startLoading, stopLoading, loading } = useLoading()

  const fetchResult = async()=>{
    try {
      startLoading()
      if (query) {
        const response = await axiosInstance.get(`/products?query=${query}`)
        const data = response.data.data
        setProducts(data)
        console.log('Search res:',data)
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
  }
  useEffect(() => {
    fetchResult()
  }, [query])

  console.log('LOaDING:',loading)


  return (
    <div className='container'>
      {loading ? <Spinner/> 
      :(
      <div>
        <h2 className='text-2xl font-bold mb-6 dark:text-gray-100 mt-2'>Search Results for: "{query}"</h2>
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
            <span className='mt-5 font-bold text-3xl font-sans dark:text-slate-100'>No results found for {query}</span>
            <span className='dark:text-slate-200'>please check your spelling or use different keyword</span>
            <Link
              href={'/home'}
              className="mt-4 block font-bold text-white p-3 px-5 rounded-full bg-[#0379e0] hover:bg-[#165389] duration-500"
              >
              Back to Home
            </Link>
          </div>
      )}
          </div>
      )}
      
    </div>
  )
}

export default SearchResults
