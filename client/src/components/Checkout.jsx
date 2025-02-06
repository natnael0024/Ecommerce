'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { useCart } from './path/to/CartContext'

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
      // Simulate an API call to submit the order
      const orderData = {
        cartItems,
        shippingDetails,
        paymentInfo,
      }

      // Assume we have an API function to process the payment and place the order
      // await axios.post('/api/orders', orderData)

      toast.success('Order placed successfully!', {
        position: 'top-center',
        autoClose: 5000,
      })
      router.push('/order-success')
    } catch (err) {
      toast.error('Failed to place the order. Please try again.', {
        position: 'top-center',
        autoClose: 5000,
      })
      setError('An error occurred while processing your order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-container container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded">
        {/* Shipping Details */}
        <div className="mb-4">
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
        <div className="mb-4">
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

        {/* Order Summary */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index} className="flex justify-between mb-2">
                <span>{item.name}</span>
                <span>{item.quantity} x ${item.price}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-4">
            <strong>Total:</strong>
            <strong>
              $
              {cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}
            </strong>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Checkout
