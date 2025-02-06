'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from '../../../../../../axios'
import { FaOpencart } from "react-icons/fa"
import Image from 'next/image'
import { MdAdd } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useTitle } from '@/context/TitleContext'

const AddProductPage = () => {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
    category_id: '',
    image: null,
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [categories,setCategories] = useState([])
  const {setTitle} = useTitle()
  

  useEffect(()=>{
    const fetchCategories = async () =>{
      try {
          const res = await axios.get('/categories')
          setCategories(res.data.data)
      } catch (error) {
          throw new Error(error)
      }
    }
    fetchCategories()
    setTitle('Products - Add')
  },[])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData({ ...formData, image: file })

    if (file) {
      setImagePreview(URL.createObjectURL(file))
    } else {
      setImagePreview(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('price', formData.price)
      data.append('quantity', formData.quantity)
      data.append('description', formData.description)
      data.append('category_id', formData.category_id)
      if (formData.image) {
        data.append('image', formData.image)
      // } else {
      //   data.append('image', '/product_image_placeholder.png')
      }

      await axios.post(
        '/products',
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      router.push('/admin/products')
      toast.success('Product Added!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } catch (err) {
      setError('Failed to add product. Please try again.')
      toast.error('Failed to add product. Please try again.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container  mt-8">
      <h1 className="text-2xl font-bold mb-4 flex gap-1 items-center "> 
        <MdAdd className='text-white p-1 bg-[#0379e0] rounded-full'/> 
        Add Product</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className=" shadow rounded flex flex-col md:flex-row lg:flex-row sm:gap-7">
        <div className="mb-4 sm:flex-1">
          <label className="block text-sm font-medium mb-2">Image</label>
          {imagePreview ? (
            <div className="mt-4">
              {/* <p className="text-sm mb-2">Image Preview:</p> */}
              <img
                src={imagePreview}
                alt="Selected"
                className=" border rounded shadow"
              />
            </div>
          ):(
            <Image 
              src="/product_image_placeholder.png" 
              alt="My Optimized Image" 
              className='w-[7rem] sm:w-[10rem] md:w-[15rem] lg:w-[30rem] rounded-md shadow'
              width={500} 
              height={500} 
              />
          )
        }
        <input
          type="file"
          name="image"
          onChange={handleFileChange}
          className="block mt-5 w-full text-sm file:mr-4 file:rounded file:border-0 file:bg-[#0379e0] file:py-2.5 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-bgprimary file:duration-500 hover:file:bg-[#1d619d] file:cursor-pointer cursor-pointer focus:outline-none" 
          accept="image/*"
        />
        </div>

        <div className=' sm:flex-1'>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded dark:bg-primary-400 dark:border-primary-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded dark:bg-primary-400 dark:border-primary-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded dark:bg-primary-400 dark:border-primary-200"
              required
            />
          </div>
          <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Category</label>
              <select value={formData.category_id} onChange={handleChange} name='category_id' className=' border p-2 rounded dark:bg-primary-400 dark:border-primary-200'>
                <option value="">Select category</option>
                {categories.map(cat=>(
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded dark:bg-primary-400 dark:border-primary-200"
              rows="4"
              required
            ></textarea>
          </div>
              
          <div className="flex justify-end items-center gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-200 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddProductPage
