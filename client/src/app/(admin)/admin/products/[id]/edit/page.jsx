'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { use } from "react"
import axios from '../../../../../../../axios'
import { MdEdit } from "react-icons/md"
import Image from 'next/image'
import { toast } from 'react-toastify';
import { useTitle } from '@/context/TitleContext'
import { useLoading } from '@/context/LoadingContext'
import Spinner from '@/components/Spinner'


const EditProductPage = ({ params }) => {
  const router = useRouter()
  const { id } = use(params)

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description:'',
    quantity: '',
    category_id:'',
    image: null,
  })
  const {startLoading, stopLoading, loading} = useLoading()
  const [error, setError] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [categories,setCategories] = useState([])
  const [product,setProduct] = useState()
  const {setTitle} = useTitle()
  
  
  const fetchProduct = async () => {
    try {
      startLoading()
      const response = await axios.get(`/products/${id}`)
      const product = response.data.data
      setProduct(product)
      setFormData({
        name: product.name || '',
        price: product.price || '',
        description:product.description || '',
        quantity: product.quantity || '',
        category_id: product.category_id || '',
        image:null
      })
      if (product.image_path) {
          setImagePreview(product.image_path)
        }
    } catch (err) {
      setError('Failed to fetch product details')
    } finally {
      stopLoading()
    }
  }
  const fetchCategories = async () =>{
    try {
      startLoading()
        const res = await axios.get('/categories')
        setCategories(res.data.data)
    } catch (error) {
        throw new Error(error)
    } finally {
      stopLoading()
    }
}

  useEffect(() => {
    fetchCategories()
    fetchProduct()
    setTitle('Products - Edit Product')
  }, [id])

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
    startLoading()
    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('price', formData.price)
      data.append('quantity', formData.quantity)
      data.append('description', formData.description)
      data.append('category_id', formData.category_id)
      if (formData.image) {
        data.append('image', formData.image)
      }
      await axios.post(
        `/products/${id}/update`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      toast.success('Product Updated!', {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
      router.push('/admin/products')
    } catch (err) {
       toast.error('Failed to update product', {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
      setError('Failed to update product')
    } finally {
      stopLoading()
    }
  }

  if(loading){
    return <Spinner/>
  }

  return (
    <div className="container mt-2">
      <h1 className="text-2xl font-bold mb-4 flex gap-1 items-center "> <MdEdit className='text-white p-1 bg-primary-100 rounded-full'/> Edit Product : {product?.name}</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className=" shadow  rounded flex flex-col sm:flex-row sm:justify-between sm:gap-7 items-start ">
        <div className="mb-4 sm:flex-1">
          {imagePreview ? (
            <div className="">
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
              className='w-full md:w-1/2 h-full  object-cover rounded-md'
              width={500} 
              height={500} 
              unoptimized={true} 
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

        <div className=' w-full sm:flex-1'>
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
            <label className="block text-sm font-medium mb-2 ">quantity</label>
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
            <label className="block text-sm font-medium mb-2">description</label>
            <textarea
              rows={5}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded dark:bg-primary-400 dark:border-primary-200"
            />
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

      </form>
    </div>
  )
}

export default EditProductPage