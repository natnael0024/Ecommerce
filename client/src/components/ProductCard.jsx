import React from "react";
import Link from "next/link";

const ProductCard = ({ id, name, price, image }) => {
  return (
    <div className="border rounded-md p-4">
      <img src={image} alt={name} className="w-full h-48 object-cover rounded-md" />
      <h3 className="mt-2 text-lg font-semibold">{name}</h3>
      <p className="text-gray-600">${price}</p>
      <Link href={`/product/${id}`}>
        <span className="mt-4 block bg-blue-500 text-white text-center py-2 rounded-md hover:bg-blue-600">
          View Details
        </span>
      </Link>
    </div>
  );
};

export default ProductCard;
