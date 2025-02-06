'use client'
import React from "react";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/CartItem";
import Link from "next/link";
import UserLayout from "../layout";

const CartPage = () => {
  const { cartItems, removeFromCart } = useCart();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (cartItems.length === 0) {
    return <p className="text-center mt-10">Your cart is empty!</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <CartItem key={item.id} id={item.id} name={item.name} price={item.price} quantity={item.quantity} image={item.image_path} onRemove={removeFromCart}/>
        ))}
      </div>
      <div className="mt-6 text-right space-y-5 flex flex-col items-end">
        <p className="text-lg font-bold">
          Total: ${calculateTotal().toFixed(2)}
        </p>
        <Link href={'/checkout'} className=" bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
          Checkout
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
