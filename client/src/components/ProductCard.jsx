import React from "react"
import Link from "next/link"
import Image from "next/image"

const ProductCard = ({ id, name, price, image }) => {
  return (
    <div className=" rounded-md overflow-hidden">
      {image? (
        <Image 
          width={50} 
          height={50}
          src={image} 
          alt={name}
          unoptimized={true} 
          className="w-full h-48 object-cover rounded-md hover:scale-105 duration-500" />
      ):(
        <Image 
          src="/product_image_placeholder.png" 
          alt="My Optimized Image" 
          className='w-full h-48 object-cover rounded-md hover:scale-105 duration-500'
          width={500} 
          height={500}
          />
      )}
      <p className="mt-2 text-green-700 font-bold">${price}</p>
      <h3 className=" text-md dark:text-white ">{name}</h3>
      <Link href={`/products/${id}`}
      className=" items-start flex ">
        <span className="mt-2 block border border-[#0379e0] text-[#0379e0] text-center py-1 px-3 font-semibold rounded-full hover:bg-[#0379e0] hover:text-white duration-700 focus:bg-[#0379e0]">
          View Details
        </span>
      </Link>
    </div>
  ) 
}

export default ProductCard
