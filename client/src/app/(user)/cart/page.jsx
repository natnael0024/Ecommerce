'use client'
import React, { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/CartItem";
import Link from "next/link";
import UserLayout from "../layout";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const CartPage = () => {
  const { cartItems, removeFromCart } = useCart();
  const {user} = useAuth()
  const router = useRouter()
    useEffect(() => {
      if (!user) {
        router.push("/home");
      }
    }, [user, router]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Cart</h1>
      {cartItems.length === 0 ? 
        <div className=' mt-20 w-full flex flex-col items-center'>
            <Image
              src={'/assets/empty-cart.png'}
              width={50}
              height={50}
              unoptimized={true}
              alt="empty-cart.png"
              className=' w-40' 
            />
            <span className='mt-5 font-semibold text-2xl font-sans'>Your cart is empty!</span>
            <Link
              href={'/home'}
              className="mt-4 block font-bold text-white p-3 px-5 rounded-full bg-[#0379e0] hover:bg-[#165389] duration-500"
              >
              Back to Home
            </Link>
          </div>
        :
      <div>
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
      }
    </div>
  );
};

export default CartPage;
