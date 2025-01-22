'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import ProtectedRoute from '../ProtectedRoute'
import Link from 'next/link'
import axios from '../../../axios'

const AdminPage = () => {
  const { user } = useAuth()
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        console.log('Token:',localStorage.getItem('token'))
        // Replace with your API endpoint for analytics
        const response = await axios.get('/admin/analytics', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        setAnalytics({
          totalProducts: response.data.totalProducts,
          totalOrders: response.data.totalOrders,
          totalUsers: response.data.totalUsers,
        })
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchProducts = async () => {
        try {
          const response = await axios.get("/products"); 
          if (response.status != 200) {
            throw new Error("Failed to fetch products");
          }
          setProducts(response.data.data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      
      fetchAnalytics()
      fetchProducts()
  }, [user,products])

  const handleDeleteProduct = async(id) => {
    try {
      const response = await axios.delete(`/products/${id}`, {headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      if (response.status == 204) {
        alert("product deleted");
      }
    } catch (error) {
       alert(error.message)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <ProtectedRoute>
    <div className="container space-y-5 mt-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow-lg text-center">
          <h2 className="text-xl font-semibold">Total Products</h2>
          <p className="text-4xl font-bold">{analytics.totalProducts}</p>
        </div>

        <div className="bg-white p-6 rounded shadow-lg text-center">
          <h2 className="text-xl font-semibold">Total Orders</h2>
          <p className="text-4xl font-bold">{analytics.totalOrders}</p>
        </div>

        <div className="bg-white p-6 rounded shadow-lg text-center">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-4xl font-bold">{analytics.totalUsers}</p>
        </div>
      </div>
    </div>

    {/* Product List Table */}
    <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Product List</h2>

        <div className="mb-4">
          <Link href="/admin/products/add">
            <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-500">
              Add Product
            </button>
          </Link>
        </div>

        <table className="min-w-full bg-white border border-gray-300 rounded-md">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Price</th>
              <th className="py-2 px-4 border-b text-left">Stock</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="py-2 px-4 border-b">{product.name}</td>
                <td className="py-2 px-4 border-b">${product.price}</td>
                <td className="py-2 px-4 border-b">{product.quantity}</td>
                <td className="py-2 px-4 border-b">
                  <Link href={`/admin/products/${product.id}/edit/`} className="text-blue-500 hover:underline">
                    Edit
                  </Link>
                  <button
                    className="text-red-500 hover:underline ml-4"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ProtectedRoute>
  )
}

export default AdminPage
