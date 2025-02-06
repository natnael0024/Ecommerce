'use client'
import React, { useState, useEffect } from "react";
import axios from '../../../../../../axios';
import { MdEdit, MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useLoading } from "@/context/LoadingContext";
import Spinner from "@/components/Spinner";

const RolePage = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [formData, setFormData] = useState({ name: "", permissions: [] });
    const {startLoading, stopLoading, loading} = useLoading()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchRoles();
        fetchPermissions();
    }, []);

    const fetchRoles = async () => {
        try {
            startLoading()
            const response = await axios.get("/roles",{
                headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}
            });
            setRoles(response.data);
        } catch (error) {
            toast.error('Failed to fetch roles', {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: true,
            })
        } finally {
            stopLoading()
        }
    };

    const fetchPermissions = async () => {
        try {
            const response = await axios.get("/permissions",{
                headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}
            });
            setPermissions(response.data);
        } catch (error) {
            toast.error('Failed to fetch permissions', {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: true,
            })
        } 
    };

    const handleDelete = async (roleId) => {
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
                 axios.delete(`/roles/${roleId}`,{
                    headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}
                })
                .then(() => {
                  Swal.fire("Deleted!", "Role has been deleted.", "success");
                  fetchRoles()
                });

              }
            });
          } catch (error) {
            Swal.fire("Error!", "Failed to delete role!", "error");
          } 
    };

    const handleSave = async () => {
        try {
            setIsLoading(true)
            if (selectedRole) {
                const res = await axios.put(`/roles/${selectedRole.id}`, formData,{
                    headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}
                });
                console.log(res)
            } else {
                const res = await axios.post("/roles", formData,{
                    headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}
                });
                console.log(res)
            }
            setShowModal(false);
            fetchRoles();
            toast.success('Successfully saved!', {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: true,
              })
        } catch (error) {
            toast.error('Failed to save role', {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: true,
            })
        } finally {
            setIsLoading(false)
        }
    };

    const handleEdit = (role) => {
        setSelectedRole(role);
        setFormData({
            name: role.name,
            permissions: role.permissions.map((p) => p.id),
        });
        setShowModal(true);
    };

    const handleCheckboxChange = (permissionId) => {
        setFormData((prev) => {
            const updatedPermissions = prev.permissions.includes(permissionId)
                ? prev.permissions.filter((id) => id !== permissionId)
                : [...prev.permissions, permissionId];
            return { ...prev, permissions: updatedPermissions };
        });
    };

    if (loading) {
        return <Spinner />;
    }
    
    return (
        <div className="p-6 bg-white dark:bg-primary-400 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Manage Roles</h2>
                <button onClick={() => { setShowModal(true); setSelectedRole(null); setFormData({ name: "", permissions: [] }); }} className="bg-blue-500 text-white px-4 py-2 rounded">Add Role</button>
            </div>

            <table className="w-full border-none font-sans">
                <thead className="border-b dark:border-primary-200">
                    <tr className=" text-gray-500 dark:text-white">
                        <th className=" p-2 font-semibold">ID</th>
                        <th className=" p-2 font-semibold">Name</th>
                        <th className=" p-2 font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map((role) => (
                        <tr key={role.id} className="text-center hover:bg-gray-50 dark:hover:bg-primary-200 border-b dark:border-primary-200">
                            <td className="p-2 ">{role.id}</td>
                            <td className="p-2 ">{role.name}</td>
                            <td className="p-2 flex justify-center  gap-5 space-x-3 text-2xl ">
                                <button onClick={() => handleEdit(role)} className="text-blue-500"><MdEdit /></button>
                                <button onClick={() => handleDelete(role.id)} className="text-red-500"><MdDeleteForever /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-primary-400 p-6 rounded-lg w-[40rem]">
                        <h2 className="text-lg font-bold mb-2">{selectedRole ? "Edit Role" : "Add Role"}</h2>
                        <input type="text" placeholder="Role Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded mb-4" />
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Permissions</h3>
                            <div className=" grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
                            {permissions.map((permission) => (
                                <label key={permission.id} className="block">
                                    <input type="checkbox" checked={formData.permissions.includes(permission.id)} onChange={() => handleCheckboxChange(permission.id)} /> {permission.name}
                                </label>
                            ))}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
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
    );
};

export default RolePage;