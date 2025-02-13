'use client'
import { useEffect, useState } from "react";
import { useLoading } from "@/context/LoadingContext";  // Loading context to manage loading state
import axiosInstance from "../../../../axios";  // Axios instance for API calls
import { useTitle } from "@/context/TitleContext";  // Title context to update page title
import Spinner from "@/components/Spinner";  // Spinner component for loading state
import { FaEye } from "react-icons/fa";  // Eye icon for viewing order details
import { toast } from "react-toastify";
import Pagination from "@/components/Paginations";
import { FaX } from "react-icons/fa6";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const CustomerOrdersPage = () => {
  const [orders, setOrders] = useState([]);  // State to store customer orders
  const { startLoading, stopLoading, loading } = useLoading();  // Loading context hooks

  const [selectedOrder, setSelectedOrder] = useState(null);  // Selected order details for modal
  const [modalOpen, setModalOpen] = useState(false);  // To control modal visibility
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const {user} = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchCustomerOrders();  
  }, []);

  
  useEffect(() => {
    if (!user) {
      router.push("/home");
    }
  }, [user, router]);

  // Fetch orders of the current customer
  const fetchCustomerOrders = async () => {
    try {
      startLoading();
      const response = await axiosInstance.get("/orders/customer", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      setOrders(response.data.data);
      setTotalPages(response.data.last_page);
      console.log('response.data.last_page: ',response.data.last_page)
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      stopLoading();
    }
  };

  // Fetch order details and show in modal
  const handleViewOrder = async (orderId) => {
    try {
    //   startLoading();
    const loadingToast = toast.info('Getting Order Data...', {
            autoClose: false, 
            hideProgressBar: true,
          });
      const response = await axiosInstance.get(`/orders/${orderId}/customer`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data)
      setSelectedOrder(response.data); 
      setModalOpen(true);  
      toast.update(loadingToast, {
        render: 'Data loaded successfully!',
        type: 'success',
        hideProgressBar: true,
        autoClose: 3000,
      })
    } catch (error) {
        toast.error('Error fetching order details', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: true,
          });
    } finally {
    //   stopLoading();
    }
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };
  console.log('TOAL PAGES:',totalPages)

  if (loading) {
    return <Spinner text={'Loading Orders...'} />;  
  }

  return (
    <div className=" py-5 bg-transparent">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <div className=' mt-20 w-full flex flex-col items-center'>
          <Image
            src={'/assets/empty-cart.png'}
            width={50}
            height={50}
            unoptimized={true}
            alt="empty-cart.png"
            className=' w-40' 
          />
          <span className='mt-5 font-semibold text-2xl font-sans'>You have no orders!</span>
          <Link
            href={'/home'}
            className="mt-4 block font-bold text-white p-3 px-5 rounded-full bg-[#0379e0] hover:bg-[#165389] duration-500"
            >
            Back to Home
          </Link>
        </div> 
      ) : (
        <div className=" overflow-x-auto dark:bg-primary-200 rounded-2xl p-4">
            <table className="w-full border-none font-sans">
                <thead className="border-b dark:border-primary-200">
                    <tr className="text-gray-500 dark:text-white">
                      <th className="p-2 font-semibold">Order ID</th>
                      <th className="p-2 font-semibold">Total</th>
                      <th className="p-2 font-semibold">Status</th>
                      <th className="p-2 font-semibold">Date</th>
                      <th className="p-2 font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="text-center hover:bg-gray-50 dark:hover:bg-primary-200 border-b dark:border-primary-200"
                    >
                      <td className="p-2">{order.id}</td>
                      <td className="p-2">${order.total_price}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-semibold ${
                            order.status === "pending"
                              ? "bg-amber-200 text-amber-500"
                              : order.status === "processing"
                              ? "bg-sky-100 text-sky-400"
                              : order.status === "shipped"
                              ? "bg-blue-100 text-blue-400"
                              : order.status === "delivered"
                              ? "bg-green-100 text-green-600"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-400"
                              : ""
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-2">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="p-2 flex justify-center gap-3">
                        <button
                          onClick={() => handleViewOrder(order.id)}  // Open modal to view details
                          className="text-blue-500 dark:text-blue-500 hover:text-blue-700"
                        >
                          <FaEye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
            </table>
            
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                />
        </div>
      )}
      

      {/* Order Details Modal */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-primary-200 p-8 rounded-lg max-w-4xl w-full">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Order Details - {selectedOrder.id}</h2>
              <button
                onClick={closeModal}  // Close the modal
                className="text-red-500 hover:text-red-700"
              >
                <FaX/>
              </button>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">Customer Information</h3>
              <p>Name: {selectedOrder.shipping_name}</p>
              <p>
                Address: {selectedOrder.shipping_address}, {selectedOrder.shipping_city}, {selectedOrder.shipping_zip}, {selectedOrder.shipping_country}
              </p>
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

export default CustomerOrdersPage;
