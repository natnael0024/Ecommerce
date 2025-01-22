'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { use } from "react"
import axios from '../../../../../../axios'

const EditProductPage = ({ params }) => {
  const router = useRouter()
  const { id } = use(params)

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description:'',
    quantity: '',
    image: null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${id}`)
        const product = response.data.data
        setFormData({
          name: product.name || '',
          price: product.price || '',
          description:product.description || '',
          quantity: product.quantity || '',
          image:null
        })
        if (product.image_path) {
            setImagePreview(product.image_path)
          }
      } catch (err) {
        setError('Failed to fetch product details')
      }
    }
    fetchProduct()
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
    setLoading(true)
    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('price', formData.price)
      data.append('quantity', formData.quantity)
      data.append('description', formData.description)
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
      router.push('/admin')
    } catch (err) {
      setError('Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
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
            className="w-full px-3 py-2 border rounded"
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
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Image</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded"
            accept="image/*"
          />
          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm mb-2">Image Preview:</p>
              <img
                src={imagePreview}
                alt="Selected"
                className="max-w-xs border rounded shadow"
              />
            </div>
          )}
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
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProductPage
