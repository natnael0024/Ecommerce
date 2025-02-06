"use client"

import { useEffect, useState } from "react"
import { FaEdit, FaTrash, FaEye } from "react-icons/fa"
import { useLoading } from "@/context/LoadingContext"
import Spinner from "@/components/Spinner"
import axiosInstance from "../../../../../axios"
import { useTitle } from "@/context/TitleContext"
import Pagination from "@/components/Paginations"
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const { startLoading, stopLoading, loading } = useLoading()
  const {setTitle} = useTitle()

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetchOrders()
    setTitle('Orders')
  }, [])

  const fetchOrders = async () => {
    try {
      startLoading()
      const response = await axiosInstance.get("/orders",
        {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
        })
      console.log('Orders:',response)
      setOrders(response.data.data)
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error('Error fetching orders', {
              position: 'top-center',
              autoClopse: 5000,
              hideProgressBar: true,
            })
    } finally {
        stopLoading()
    }
  }

  if(loading){
    return <Spinner/>
  }
  return (
    <div className="p-6 bg-transparent">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-none font-sans">
          <thead className=" border-b dark:border-primary-200">
              <tr className="text-gray-500 dark:text-white ">
                <th className=" p-2 font-semibold">Order ID</th>
                <th className=" p-2 font-semibold">Customer</th>
                <th className=" p-2 font-semibold">Total</th>
                <th className=" p-2 font-semibold">Status</th>
                <th className=" p-2 font-semibold">Delivery Address</th>
                <th className=" p-2 font-semibold">Date</th>
                <th className=" p-2 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="text-center hover:bg-gray-50 dark:hover:bg-primary-200 border-b dark:border-primary-200">
                  <td className=" p-2">{order.id}</td>
                  <td className=" p-2">{order.shipping_name}</td>
                  <td className=" p-2">${order.total_price}</td>
                  <td className=" p-2">
                    <span className={`px-2 py-1 rounded-full  text-sm font-semibold ${order.status === "pending" ? "bg-amber-200 text-amber-500 dark:text-amber-500" :order.status === "processing" ? "bg-sky-100 text-sky-400 dark:text-sky-400" : order.status === "shipped" ? "bg-[#cee8ff]  text-primary-100 dark:text-primary-100" : order.status === "delivered" ? "bg-green-100 text-green-600 dark:text-green-600" : order.status ==="cancelled" ? "bg-red-100 text-red-400 dark:text-red-400" : ''}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className=" p-2">
                    {order.shipping_address}, {order.shipping_city}, {order.shipping_zip}, {order.shipping_country}
                  </td>
                  <td className=" p-2">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className=" p-2 flex justify-center gap-3">
                    <button className="text-blue-500 dark:text-blue-500 hover:text-blue-700"><FaEye size={18} /></button>
                    <button className="text-green-500 dark:text-green-500 hover:text-green-700"><FaEdit size={18} /></button>
                    <button className="text-red-500 dark:text-red-500 hover:text-red-700"><FaTrash size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      )}
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
        />

    </div>
  )
}

export default OrdersPage