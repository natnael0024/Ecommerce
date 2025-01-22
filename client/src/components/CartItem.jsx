import React from "react";

const CartItem = ({ id, name, price, quantity, image, onRemove }) => {
  return (
    <div className="flex justify-between items-center border-b pb-2 mb-2">
      <div className=" flex gap-2 w-full">
      <img
          src={image}
          alt={name}
          className=" max-w-20 max-h-20 md:w-1/2 h-64 object-cover rounded-md"
        />
        <div className="  ">
            <h3 className="font-semibold">{name}</h3>
            <p className="text-gray-600">
              ${price} x {quantity}
            </p>
        </div>
      </div>
      <div>
        <button
          onClick={() => onRemove(id)}
          className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
