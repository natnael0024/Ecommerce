'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import ProtectedRoute from '../../ProtectedRoute'
import Link from 'next/link'
import axios from '../../../../axios'
import { MdEdit,MdDeleteForever } from "react-icons/md";
import { IoAddOutline } from "react-icons/io5";
import Swal from 'sweetalert2'
import { useLoading } from '@/context/LoadingContext'
import Spinner from '@/components/Spinner'
import { FaShippingFast } from "react-icons/fa";
import { LuCoins, LuUsers } from "react-icons/lu"
import { LuPackage } from "react-icons/lu"
import DashboardCharts from '@/components/DashboardCharts'
import { Pie, Doughnut, Line, Bar } from 'react-chartjs-2'
import { toast } from 'react-toastify'


const AdminPage = () => {
  const { user } = useAuth()
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  })
  const { startLoading, stopLoading, loading } = useLoading()
  const [orderStatusShare, setOrderStatusShare] = useState();
  const [monthlyRevenueData, setMonthlyRevenueData] = useState(null)
  const [orderAnalytics, setOrderAnalytics] = useState(null)

  const fetchAnalytics = async () => {
    try {
      startLoading()
      const analytics = await axios.get('/admin/analytics2', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      setOrderStatusShare(analytics.data.orderStatusData)
      setMonthlyRevenueData(analytics.data.monthlyRevenueData)
      setOrderAnalytics(analytics.data.monthlyOrdersData)
      setAnalytics({
        totalProducts: analytics.data.basicAnalytics.totalProducts,
        totalOrders: analytics.data.basicAnalytics.totalOrders,
        totalUsers: analytics.data.basicAnalytics.totalUsers,
        totalRevenue: analytics.data.basicAnalytics.totalRevenue,
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Error fetching analytics',{
        hideProgressBar:true
      })
    } finally {
      stopLoading(false)
    }
  }

  
  const fetchProducts = async () => {
    try {
      startLoading()
      const response = await axios.get("/products"); 
      if (response.status != 200) {
        throw new Error("Failed to fetch products");
      }
      setProducts(response.data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      stopLoading()
    }
  }
  
  useEffect(() => {
      fetchAnalytics()
      fetchProducts()
  }, [])

  // const revenueData = {
  //   labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  //   datasets: [
  //     {
  //       label: "Revenue ($)",
  //       data: [12000, 15000, 17000, 14000, 22000, 19000],
  //       borderColor: "#007bff",
  //       backgroundColor: "rgba(0, 123, 255, 0.2)",
  //       fill: true,
  //       tension: 0.4,
  //     },
  //   ],
  // };

  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [400, 450, 500, 480, 600, 550],
        backgroundColor: "#0379e0",
        tension: 0.4
      },
    ],
  };

  const orderStatusData = {
    labels: orderStatusShare?.labels,
    datasets: [
      {
        data: orderStatusShare?.datasets[0].data,
        backgroundColor: orderStatusShare?.datasets[0].backgroundColor,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: false,
        text: 'Doughnut Chart Example',
      },
      legend: {
        position: 'top',
        display:false
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true }, 
      tooltip: { enabled: true },
    },
    scales: {
      x: { 
            grid: { 
                display: false 
            } 
         }, 
      y: { 
            grid: { 
                display: false 
            }, 
            ticks: {
                display: false 
            },
            display: false
        },
        
    },
  };

  if (loading) {
    return <Spinner/>
  }


  return (
    <div className=' space-y-5'>
      <div className="container space-y-5 mt-4">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gradient-to-tr from-primary-300 to-primary-200  p-6 rounded-lg shadow space-y-4 ">
            <div className=' flex items-center gap-2'>
              <LuPackage className=' text-4xl bg-gradient-to-b rounded-xl from-[#ff9747] to-[#f26900] text-white p-2'/>
              <h2 className="text-xl font-semibold">Total Products</h2>
            </div>
            <p className="text-4xl font-bold">{analytics.totalProducts}</p>
          </div>
  
          <div className="bg-white dark:bg-gradient-to-tr from-primary-300 to-primary-200 dark:bg-primary-50 p-6 rounded-lg shadow space-y-4 ">
            <div className=' flex items-center gap-2'>
              <FaShippingFast className=' text-4xl bg-gradient-to-b rounded-xl from-[#47a9ff] to-[#0379e0] text-white p-2'/>
              <h2 className="text-xl font-semibold">Total Orders</h2>
            </div>
            <p className="text-4xl font-bold">{analytics.totalOrders}</p>
          </div>
  
          <div className="bg-white dark:bg-gradient-to-tr from-primary-300 to-primary-200 dark:bg-primary-50 p-6 rounded-lg shadow space-y-4">
            <div className=' flex items-center gap-2'>
              <LuUsers className=' text-4xl bg-gradient-to-b rounded-xl from-[#ff8686] to-[#df5252] text-white p-2'/>
              <h2 className="text-xl font-semibold">Total Customers</h2>
            </div>
            <p className="text-4xl font-bold">{analytics.totalUsers}</p>
          </div>

          <div className="bg-white dark:bg-gradient-to-tr from-primary-300 to-primary-200 dark:bg-primary-50 p-6 rounded-lg shadow space-y-4">
            <div className=' flex items-center gap-2'>
              <LuCoins className=' text-4xl bg-gradient-to-b rounded-xl from-[#47ffb2] to-[#2eb07a] text-white p-2'/>
              <h2 className="text-xl font-semibold">Total Revenue</h2>
            </div>
            <p className="text-4xl font-bold">{analytics.totalRevenue}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-lg ">
        {/* Revenue Line Chart */}
        <div className="bg-white dark:bg-primary-200 p-4 shadow rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Revenue Trends</h2>
          {monthlyRevenueData &&
            <Line data={monthlyRevenueData} options={chartOptions} />
          }
        </div>
  
        {/* Sales Bar Chart */}
        <div className="bg-white dark:bg-primary-200 p-4 shadow rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Monthly Sales</h2>
          {orderAnalytics &&
            <Bar data={orderAnalytics} options={chartOptions} />
          }
        </div>
      </div>

      <div className=' grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-6  '>
        {/* Top Products */}
        <div className=" lg:col-span-3 overflow-x-auto bg-white dark:bg-primary-200 rounded-2xl p-4 shadow-sm">
          <h1 className='text-lg font-semibold mb-4'>Top Products</h1>
          <div >
            <table className=" font-sans  w-full">
              <thead className='border-b text-left dark:border-primary-200'>
                <tr className=' text-gray-500 dark:text-white '>
                  <th className=" font-semibold px-4">Name</th>
                  <th className=" font-semibold">Price</th>
                  <th className=" font-semibold">Category</th>
                </tr>
              </thead>
              <tbody className=''>
                {products.map((product) => (
                  <tr key={product.id} className='rounded-md hover:bg-[#c3e9ff] duration-300 dark:hover:bg-primary-300 border-b dark:border-primary-200'>
                    <td className="py-2 px-4 rounded-l-lg">{product.name}
                      {product.quantity<1 && <span className=' bg-red-100 text-red-600 rounded-full ml-2 text-sm font-semibold'>out of stock</span>}
                    </td>
                    <td className=" ">${product.price}</td>
                    <td className=" rounded-r-lg ">{product.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Order Status Pie Chart */}
        <div className=" lg:col-span-1 bg-white dark:bg-primary-200 pb-16 p-4 shadow rounded-lg h-[24rem]">
          <h2 className="text-lg font-semibold mb-4">Order Status</h2>
          <Doughnut data={orderStatusData} options={options} className=' ' />
        </div>
        
      </div>
    </div>
  )
}

export default AdminPage
