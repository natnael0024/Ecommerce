'use client'
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import axiosInstance from "../../axios"
import { useRouter } from "next/navigation"

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null)
    const router = useRouter();

    const handleCategoryFilter = (id) => {
        setSelectedCategory(id); 
        router.push(`/products/categories?category=${id}`);
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axiosInstance.get('/categories');
                setCategories(res.data.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        }
        fetchCategories();
    }, []);

    return (
        <div className="z-20 sticky top-0 shadow-sm flex justify-evenly py-2 px-2 sm:px-5 lg:px-20 w-full bg-sky-50 dark:bg-primary-200 overflow-x-auto gap-5 sm:gap-0 scrollbar-hide">
            {categories &&
                categories.map((cat) => (
                    <button
                        onClick={() => handleCategoryFilter(cat.id)}
                        key={cat.id}
                        className={`whitespace-nowrap font-thin text-xs sm:text-sm text-[#051f36] dark:text-white ${selectedCategory === cat.id ? 'text-[#38a2ff]  underline' : 'hover:underline'}`}
                    >
                        {cat.name}
                    </button>
                ))}
        </div>
    );
}

export default Category;
