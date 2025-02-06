"use client"

import { useEffect, useState } from "react"
import { FaEdit, FaTrash, FaEye } from "react-icons/fa"
import { useLoading } from "@/context/LoadingContext"
import Spinner from "@/components/Spinner"
import axiosInstance from "../../../../../axios"
import { useTitle } from "@/context/TitleContext"
import Pagination from "@/components/Paginations"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import Link from "next/link"

const UsersPage = () => {
  const [users, setUsers] = useState([])
  const { startLoading, stopLoading, loading } = useLoading()
  const { setTitle, title } = useTitle()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    fetchUsers()
    setTitle("Users")
  }, [])

  const fetchUsers = async () => {
    try {
      startLoading()
      const response = await axiosInstance.get("/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      setUsers(response.data.data)
      setTotalPages(response.data.meta.last_page)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Error fetching users",{
        autoClose: 5000,
        hideProgressBar: true,
      })
    } finally {
      stopLoading()
    }
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setName(user.name)
    setEmail(user.email)
    setIsModalOpen(true)
  }

  const handleDelete = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/users/${userId}`,{
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          })
          fetchUsers()
          Swal.fire("Deleted!", "Role has been deleted.", "success");
          
        } catch (error) {
          console.error("Error deleting user:", error)
          toast.error("Failed to delete user")
        }
      }
    })
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      await axiosInstance.put(`/users/${selectedUser.id}`, { name, email },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      fetchUsers()
      toast.success("User updated successfully",{
        autoClose: 5000,
        hideProgressBar: true,
      })
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error("Failed to update user",{
        autoClose: 5000,
        hideProgressBar: true,
        }
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 bg-transparent">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Link href={'/admin/users/add'}
            className="flex justify-end"
          > 
            <span className=" bg-primary p-2 px-5 rounded-lg text-xl hover:bg-primary-200 duration-200 focus:ring-2 focus:ring-primary-50">Add</span>
          </Link>
          <table className="w-full border-none font-sans">
          <thead className="border-b dark:border-primary-200">
            <tr className="text-gray-500 dark:text-white">
              <th className="p-2 font-semibold">User ID</th>
              <th className="p-2 font-semibold">Name</th>
              <th className="p-2 font-semibold">Email</th>
              <th className="p-2 font-semibold">Role</th>
              <th className="p-2 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="text-center hover:bg-gray-50 dark:hover:bg-primary-200 border-b dark:border-primary-200"
              >
                <td className="p-2">{user.id}</td>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2 flex justify-center gap-3">
                  <button className="text-blue-500 hover:text-blue-700">
                    <FaEye size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-green-500 hover:text-green-700"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white dark:bg-primary-300 p-6 rounded-md shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit User</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 px-4 py-2 rounded text-white">Cancel</button>
              <button 
                disabled={isLoading}
                onClick={handleSave} className={`px-4 py-2 focus:ring-2 focus:ring-primary-50 bg-blue-500 text-white rounded ${isLoading && 'cursor-not-allowed'}`}
              >
                {isLoading ? 'Saving...': 'Save'}  
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersPage
