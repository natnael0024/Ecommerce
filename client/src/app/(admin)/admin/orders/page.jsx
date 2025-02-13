'use client'
import { useEffect, useState } from "react"
import { FaEdit, FaTrash, FaEye } from "react-icons/fa"
import { useLoading } from "@/context/LoadingContext"
import Spinner from "@/components/Spinner"
import axiosInstance from "../../../../../axios"
import { useTitle } from "@/context/TitleContext"
import Pagination from "@/components/Paginations"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import { FaX } from "react-icons/fa6"

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const { startLoading, stopLoading, loading } = useLoading()
  const [isLoading,setIsLoading] = useState(false)
  const { setTitle } = useTitle()

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchOrders();
    setTitle('Orders');
  }, [])

  const fetchOrders = async () => {
    try {
      startLoading();
      const response = await axiosInstance.get("/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Orders:', response);
      setOrders(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error('Error fetching orders', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
      });
    } finally {
      stopLoading();
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // startLoading();
      const loadingToast = toast.info('Updating order status...', {
        autoClose: false, 
        hideProgressBar: true,
      });
      const response = await axiosInstance.put(
        `/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const updatedOrder = response.data.order;
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
      toast.update(loadingToast, {
        render: 'Order status updated successfully!',
        type: 'success',
        hideProgressBar: true,
        autoClose: 3000,
      })
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error('Error updating order status', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
    } finally {
      // stopLoading();
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      setIsLoading(true)
      const loadingToast = toast.info('Getting Order Data...', {
        autoClose: false, 
        hideProgressBar: true,
      });

      const response = await axiosInstance.get(`/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })

      setSelectedOrder(response.data); 
      setModalOpen(true)
      toast.update(loadingToast, {
        render: 'Data loaded successfully!',
        type: 'success',
        hideProgressBar: true,
        autoClose: 3000,
      })
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error('Error fetching order details', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className=" bg-transparent">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto dark:bg-primary-200 rounded-2xl p-4 shadow-sm">
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
              <tr
                key={order.id}
                className="text-center hover:bg-gray-50 dark:hover:bg-primary-200 border-b dark:border-primary-200"
              >
                <td className=" p-2">{order.id}</td>
                <td className=" p-2">{order.shipping_name}</td>
                <td className=" p-2">${order.total_price}</td>
                <td className=" p-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={` ${order.status=='pending'?'bg-gray-400':order.status=='processing'?'bg-primary-50':order.status=='shipped'?'bg-primary-100':order.status=='delivered'?'bg-green-500':order.status=='cancelled'?'bg-red-400':'bg-gray-200'} px-2 py-1 rounded-full text-sm font-semibold text-gray-100 dark:text-white`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className=" p-2">
                  {order.shipping_address}, {order.shipping_city}, {order.shipping_zip}, {order.shipping_country}
                </td>
                <td className=" p-2">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className=" p-2 flex justify-center gap-3">
                  <button
                    onClick={() => handleViewOrder(order.id)}
                    className="text-blue-500 dark:text-blue-500 hover:text-blue-700"
                    disabled={isLoading}>
                    <FaEye size={18} />
                  </button>
                  {/* <button className="text-green-500 dark:text-green-500 hover:text-green-700">
                    <FaEdit size={18} />
                  </button> */}
                  <button className="text-red-500 dark:text-red-500 hover:text-red-700">
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-primary-200 p-8 rounded-lg max-w-4xl w-full">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Order Details - {selectedOrder.id}</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-red-500 hover:text-red-700"
              >
                <FaX className="text-2xl"/>
              </button>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">Customer Information</h3>
              <p>Name: {selectedOrder.shipping_name}</p>
              <p>Address: {selectedOrder.shipping_address}, {selectedOrder.shipping_city}, {selectedOrder.shipping_zip}, {selectedOrder.shipping_country}</p>
              <p>Total: ${selectedOrder.total_price}</p>
              <p>Status: {selectedOrder.status}</p>
            </div>
      
            <div className="mt-6">
              <h3 className="font-semibold">Order Items</h3>
              <table className="w-full table-auto mt-2">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Item Name</th>
                    <th className="p-2 text-left">Quantity</th>
                    <th className="p-2 text-left">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">{item.product_name}</td>
                      <td className="p-2">{item.quantity}</td>
                      <td className="p-2">${item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrdersPage;
