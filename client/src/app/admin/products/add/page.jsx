'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from '../../../../../axios'

const AddProductPage = () => {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
    image: null,
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
      if (formData.image) {
        data.append('image', formData.image)
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
      router.push('/admin')
    } catch (err) {
      setError('Failed to add product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
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
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            rows="4"
            required
          ></textarea>
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
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddProductPage
