"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../../axios";
import Link from "next/link";
import { IoAddOutline } from "react-icons/io5";
import { useLoading } from "@/context/LoadingContext";
import { MdDeleteForever, MdEdit, MdOutlineCategory } from "react-icons/md";
import Spinner from "@/components/Spinner";
import { useTitle } from "@/context/TitleContext";
import Swal from "sweetalert2";
import { LuPackage } from "react-icons/lu";
import Pagination from "@/components/Paginations";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [newCategory, setNewCategory] = useState(""); // For Adding New Category
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const { startLoading, stopLoading, loading } = useLoading()
  const { setTitle } = useTitle()

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetchProductsWithPagination(currentPage);
    setTitle("Products");
  }, [currentPage]);

  useEffect(()=>{
    fetchProducts()
    fetchCategories();
  },[])

  const fetchProducts = async (page) => {
    try {
      startLoading()
      const response = await axiosInstance.get(`/products?page=${page}`);
      if (response.status !== 200) throw new Error("Failed to fetch products");
      setProducts(response.data.data);
      setTotalPages(response.data.meta.last_page);
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  const fetchProductsWithPagination = async (page) => {
    try {
      const response = await axiosInstance.get(`/products?page=${page}`);
      if (response.status !== 200) throw new Error("Failed to fetch products");
      setProducts(response.data.data);
      setTotalPages(response.data.meta.last_page);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      startLoading();
      const response = await axiosInstance.get("/categories");
      if (response.status !== 200) throw new Error("Failed to fetch categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#000",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          axiosInstance.delete(`/products/${id}`,{
            headers:{
              'Authorization':`Bearer ${localStorage.getItem('token')}`
            }
          }).then(() => {
            Swal.fire("Deleted!", "Product has been deleted.", "success");
            fetchProducts();
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#000",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          axiosInstance.delete(`/categories/${id}`,{
            headers:{
              'Authorization':`Bearer ${localStorage.getItem('token')}`
            }
          }).then(() => {
            Swal.fire("Deleted!", "Category has been deleted.", "success");
            fetchCategories();
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditCategory = (category) => {
    setEditCategory(category);
    setCategoryName(category.name);
  };

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) return;
    try {
      const res = await axiosInstance.put(`/categories/${editCategory.id}`, {
        name: categoryName,
      },{
        headers:{
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
      });
      Swal.fire("Success!", "Category updated successfully!", "success");
      setEditCategory(null);
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  }

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await axiosInstance.post("/categories", { name: newCategory },
        {
          headers:{
            'Authorization':`Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      Swal.fire("Success!", "Category added successfully!", "success");
      setNewCategory("");
      setShowAddCategoryModal(false);
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="bg-transparent">
      {/* Product List Table */}
      <div className="mt-2 space-y-5">
        <div className="mb-2 flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-1">
            <LuPackage className=" text-sm md:text-md lg:text-xl" />
            Product List
          </h2>
          <Link
            href="/admin/products/add"
            className="bg-[#0379e0] text-white py-2 px-4 rounded hover:bg-[#0379e0] flex items-center focus:ring-2 focus:ring-[#63b6ff]"
          >
            <IoAddOutline />
            Add Product
          </Link>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto dark:bg-primary-200 rounded-2xl p-4 shadow-sm">
          <table className="w-full font-sans text-sm sm:text-md">
            <thead className="border-b text-left dark:border-primary-200">
              <tr className="text-gray-500 dark:text-white">
                <th className="font-semibold">SN</th>
                <th className="font-semibold">Name</th>
                <th className="font-semibold">Price</th>
                <th className="font-semibold">Stock</th>
                <th className="font-semibold">Category</th>
                <th className="font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product.id}
                  className="rounded-md hover:bg-primary-50 duration-300 dark:hover:bg-primary-300 border-b dark:border-primary-200"
                >
                  <td>{index + 1}</td>
                  <td className="py-2">
                    {product.name}
                    {product.quantity < 1 && (
                      <span className="bg-red-100 text-red-600 rounded-full px-1 ml-2 text-sm font-semibold">
                        out of stock
                      </span>
                    )}
                  </td>
                  <td>${product.price}</td>
                  <td>{product.quantity}</td>
                  <td>{product.category}</td>
                  <td className="flex">
                    <Link
                      href={`/admin/products/${product.id}/edit/`}
                      className="text-[#0379e0] hover:underline flex items-center"
                    >
                      <MdEdit className="text-2xl" />
                    </Link>
                    <button
                      className="text-red-500 hover:underline ml-4 flex items-center"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <MdDeleteForever className="text-2xl"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
            />
      </div>

        
        <div className="mb-2 flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-1 center">
            <MdOutlineCategory className=" text-sm md:text-md lg:text-xl" />
            Category List
          </h2>
          <button onClick={() => setShowAddCategoryModal(true)}
              className="bg-[#0379e0] text-white py-2 px-4 rounded hover:bg-[#0379e0] flex items-center focus:ring-2 focus:ring-[#63b6ff]"
            >
              <IoAddOutline />
              Add Category
          </button>
        </div>
        {/* Categories */}
        <div className="overflow-x-auto dark:bg-primary-200 rounded-2xl p-4 shadow-sm mt-6">
          <table className="w-full font-sans">
            <thead className="border-b text-left dark:border-primary-200">
              <tr className="text-gray-500 dark:text-white">
                <th className="font-semibold">SN</th>
                <th className="font-semibold">Name</th>
                <th className="font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, index) => (
                <tr
                  key={cat.id}
                  className="rounded-md hover:bg-primary-50 duration-300 dark:hover:bg-primary-300 border-b dark:border-primary-200"
                >
                  <td>{index + 1}</td>
                  <td className="py-2">{cat.name}</td>
                  <td className="flex">
                    <button
                      className="text-[#0379e0] hover:underline flex items-center"
                      onClick={() => handleEditCategory(cat)}
                    >
                      <MdEdit className="text-2xl"/>
                      
                    </button>
                    <button
                      className="text-red-500 hover:underline ml-4 flex items-center"
                      onClick={() => handleDeleteCategory(cat.id)}
                    >
                      <MdDeleteForever className="text-2xl"/>
                      
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Category Modal */}
        {editCategory && (
          <div className="fixed inset-0 bg-black  bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-black p-6 rounded-lg shadow-lg">
              <h2 className="text-lg  font-semibold mb-4">Edit Category</h2>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <div className="mt-4 flex justify-end">
                <button className="mr-2" onClick={() => setEditCategory(null)}>Cancel</button>
                <button onClick={handleSaveCategory} className="bg-primary-100 text-white p-2 px-4 hover:bg-primary-200 focus:ring-2 focus:ring-primary-50 rounded-md">Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Add Category Modal */}
        {showAddCategoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-black p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="Enter category name"
              />
              <div className="mt-4 flex gap-2 justify-end">
                <button  onClick={() => setShowAddCategoryModal(false)}
                  className=" hover:bg-slate-200 dark:hover:bg-primary-300 p-2 px-4 rounded-md">Cancel</button>
                <button onClick={handleAddCategory} 
                  className="bg-primary-100 text-white p-2 px-4 hover:bg-primary-200 focus:ring-2 focus:ring-primary-50 rounded-md">
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
