import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const maxPagesToShow = 4; // Maximum number of pages to display
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfMaxPages);
    let endPage = Math.min(totalPages, currentPage + halfMaxPages);

    if (endPage - startPage < maxPagesToShow - 1) {
        if (startPage === 1) {
            endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        } else if (endPage === totalPages) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
    }

    return (
        <div className="flex justify-center mt-6 space-x-2">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={` px-3 p-2 rounded-full text-sm font-semibold transition-all
                    ${currentPage === 1 ? "bg-gray-300 dark:bg-primary-300 text-gray-500 cursor-not-allowed" : "bg-primary text-white hover:bg-primary-200"}`}
            >
                {/* &laquo;  */}
                <FaAngleLeft/>
            </button>

            {/* Page Numbers */}
            <div className=" bg-gray-200 dark:bg-primary-300 flex gap-2 rounded-full px-2">
            {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
                <button
                    key={startPage + index}
                    onClick={() => onPageChange(startPage + index)}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all 
                        ${currentPage === startPage + index
                            ? "bg-primary text-white scale-110 shadow-sm shadow-primary-50 dark:shadow-none"
                            : " text-gray-700 dark:text-white dark:hover:text-primary hover:text-primary "}
                    `}
                >
                    {startPage + index}
                </button>
            ))}
            </div>
            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 p-2 text-sm font-semibold transition-all rounded-full
                    ${currentPage === totalPages ? "bg-gray-300 dark:bg-primary-300 text-gray-500 cursor-not-allowed" : "bg-primary text-white hover:bg-primary-200"}`}
            >
                 {/* &raquo; */}
                 <FaAngleRight/>
            </button>
        </div>
    );
};

export default Pagination;
