'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useCart } from "@/context/CartContext";
import { CiMoneyCheck1 } from "react-icons/ci";
import axiosInstance from '../../../../axios';

const Checkout = () => {
  const { cartItems } = useCart()
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    address: '',
    city: '',
    zip: '',
    country: '',
  })
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleShippingChange = (e) => {
    const { name, value } = e.target
    setShippingDetails({ ...shippingDetails, [name]: value })
  }

  const handlePaymentChange = (e) => {
    const { name, value } = e.target
    setPaymentInfo({ ...paymentInfo, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const orderData = {
        cartItems,
        shippingDetails,
        paymentInfo,
      }
      console.log('orderData: ',orderData)
      const res = await axiosInstance.post('/orders', orderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        })
        console.log("Order response:",res)
      toast.success('Order placed successfully!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
      })
      router.push('/my-orders')
    } catch (err) {
      toast.error('Failed to place the order. Please try again.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
      })
      setError('An error occurred while processing your order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-container container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-1">
        <CiMoneyCheck1 className='text-white p-1 bg-[#0379e0] rounded-full'/>
        Checkout</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className=" sm:p-6 rounded flex gap-4 flex-col-reverse sm:flex-row ">
        <div className=' flex-1 shadow p-6 rounded-lg'>
          {/* Shipping Details */}
          <div className="mb-4 space-y-3">
            <h2 className="text-xl font-semibold">Shipping Details</h2>
            <input
              type="text"
              name="name"
              value={shippingDetails.name}
              onChange={handleShippingChange}
              placeholder="Full Name"
              className="w-full px-3 py-2 border rounded mb-2"
              required
              />
            <input
              type="text"
              name="address"
              value={shippingDetails.address}
              onChange={handleShippingChange}
              placeholder="Address"
              className="w-full px-3 py-2 border rounded mb-2"
              required
              />
            <input
              type="text"
              name="city"
              value={shippingDetails.city}
              onChange={handleShippingChange}
              placeholder="City"
              className="w-full px-3 py-2 border rounded mb-2"
              required
              />
            <input
              type="text"
              name="zip"
              value={shippingDetails.zip}
              onChange={handleShippingChange}
              placeholder="Zip Code"
              className="w-full px-3 py-2 border rounded mb-2"
              required
              />
            <input
              type="text"
              name="country"
              value={shippingDetails.country}
              onChange={handleShippingChange}
              placeholder="Country"
              className="w-full px-3 py-2 border rounded mb-2"
              required
              />
          </div>

          {/* Payment Details */}
          <div className="mb-4 space-y-3">
            <h2 className="text-xl font-semibold">Payment Information</h2>
            <input
              type="text"
              name="cardNumber"
              value={paymentInfo.cardNumber}
              onChange={handlePaymentChange}
              placeholder="Card Number"
              className="w-full px-3 py-2 border rounded mb-2"
              required
              />
            <input
              type="text"
              name="expiryDate"
              value={paymentInfo.expiryDate}
              onChange={handlePaymentChange}
              placeholder="Expiry Date (MM/YY)"
              className="w-full px-3 py-2 border rounded mb-2"
              required
              />
            <input
              type="text"
              name="cvv"
              value={paymentInfo.cvv}
              onChange={handlePaymentChange}
              placeholder="CVV"
              className="w-full px-3 py-2 border rounded mb-2"
              required
            />
          </div>
          {/* Submit Button */}
          <div className="flex sm:justify-end justify-center">
            <button
              type="submit"
              className={`bg-[#0379e0] focus:ring-2 focus:ring-[#59b2ff]  text-white px-6 py-2 rounded-md font-semibold ${loading && ' cursor-not-allowed'}`}
              disabled={loading}
              >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-4 flex-1 space-y-3 p-6">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index} className="flex justify-between mb-2">
                <span>{item.name}</span>
                <span>{item.quantity} x ${item.price}</span>
              </li>
            ))}
          </ul>
          <hr className='  border-[#cee8ff]'/>
          <div className="flex justify-between mt-4 text-xl">
            <strong >Total:</strong>
            <strong >
              $
              {cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}
            </strong>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Checkout
