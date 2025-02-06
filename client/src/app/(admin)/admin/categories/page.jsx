'use client'
import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../../../axios'
import Link from 'next/link'
import { IoAddOutline } from 'react-icons/io5'
import { useLoading } from '@/context/LoadingContext'
import { MdDeleteForever, MdEdit } from 'react-icons/md'
import Spinner from '@/components/Spinner'
import { useTitle } from '@/context/TitleContext'
import Swal from 'sweetalert2'


const CategoryPage = () => {
    const [products, setProducts] = useState([])
    const {startLoading, stopLoading, loading} = useLoading()
    const {setTitle} = useTitle()

    const fetchProducts = async () => {
        try {
          startLoading()
          const response = await axiosInstance.get("/products") 
          if (response.status != 200) {
            throw new Error("Failed to fetch products")
          }
          setProducts(response.data.data)
        } catch (error) {
          setError(error.message)
        } finally {
          stopLoading()
        }
      }
      useEffect(() => {
            fetchProducts()
            setTitle('Products')
        }, [])
      
    const handleDeleteProduct = async(id) => {
          try {
            await Swal.fire({
              title: 'Are you sure?',
              text: "You won't be able to revert this!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#000',
              confirmButtonText: 'Yes, delete it!',
            }).then((result) => {
              if (result.isConfirmed) {
                 axios.delete(`/products/${id}`, {headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  }
                  })
                  .then((res) => {
                    Swal.fire({
                      title: 'Deleted!',
                      text: 'Category has been deleted.',
                      icon: 'success',
                    })
                    fetchProducts()
                    fetchAnalytics()
                  })
                  .catch((error) => {
                    alert(error)
                    console.log(error);
                  });
              }
            })
          } catch (error) {
             alert(error.message)
        } 
    }

  if (loading) {
    return <Spinner/>
  }

  return (
    <div className=' bg-transparent  '>
        {/* Product List Table */}
      <div className="mt-2">
        <div className="mb-2 flex justify-between  items-center">
          <h2 className="text-xl font-semibold">Product List</h2>
          <Link
            href="/admin/products/add"
            className="bg-[#0379e0]  text-white py-2 px-4 rounded hover:bg-[#0379e0] flex items-center focus:ring-2 focus:ring-[#63b6ff]"
          >
            <IoAddOutline/>
            Add Product
          </Link>
        </div>
  
        {/* Responsive Table */}
        <div className="overflow-x-auto dark:bg-primary-200 rounded-2xl p-4 shadow-sm">
          <table className="w-full  font-sans">
            <thead className='border-b text-left dark:border-primary-200'>
              <tr className=' text-gray-500 dark:text-white '>
                <th className=" font-semibold">Name</th>
                <th className=" font-semibold">Price</th>
                <th className=" font-semibold">Stock</th>
                <th className=" font-semibold">Category</th>
                <th className=" font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className='rounded-md hover:bg-primary-50 duration-300 dark:hover:bg-primary-300 border-b dark:border-primary-200'>
                  <td className="py-2  ">{product.name}
                    {product.quantity<1 && <span className=' bg-red-100 text-red-600 rounded-full px-1 ml-2 text-sm font-semibold'>out of stock</span>}
                  </td>
                  <td className=" ">${product.price}</td>
                  <td className=" ">{product.quantity}</td>
                  <td className=" ">{product.category}</td>
                  <td className="  flex">
                    <Link
                      href={`/admin/products/${product.id}/edit/`}
                      className="text-[#0379e0] hover:underline flex items-center"
                    >
                      <MdEdit/>
                      Edit
                    </Link>
                    <button
                      className="text-red-500 hover:underline ml-4 flex items-center"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <MdDeleteForever/>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CategoryPage