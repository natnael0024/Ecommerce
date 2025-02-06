import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/NavBar";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Category from "@/components/Category";
import localFont from 'next/font/local'
import Footer from "@/components/Footer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingProvider, useLoading } from '@/context/LoadingContext';
import Spinner from "@/components/Spinner";


export default function UserLayout({ children }) {
  return (
        <CartProvider>
          <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
              <Navbar/>
              <Category/>
              <main className="px-2 min-h-screen sm:px-5 lg:px-20 z-10 ">{children}</main>
              <Footer/>
        </CartProvider>
  );
}