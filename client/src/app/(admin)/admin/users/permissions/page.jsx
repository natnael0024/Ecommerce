'use client'
import React, { useEffect, useState } from "react";
import axios from "../../../../../../axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { useLoading } from "@/context/LoadingContext";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import Swal from "sweetalert2";

const PermissionPage = () => {
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPermission, setCurrentPermission] = useState(null);
  const [name, setName] = useState("");
  const {startLoading, stopLoading, loading} = useLoading()

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    startLoading();
    try {
      const response = await axios.get("/permissions",{
        headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}
      });
      setPermissions(response.data);
    } catch (error) {
      toast.error('Error fetching permissions', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
      })
    } finally {
      stopLoading();
    }
  };

  const handleSave = async () => {
    try {
        setisLoading(true)
      if (currentPermission) {
        await axios.put(`/permissions/${currentPermission.id}`, { name },{
            headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}
        });
        toast.success('permission updated', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: true,
          })
      } else {
        await axios.post("/permissions", { name },{
            headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}
        });
        toast.success('permission saved', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: true,
          })
      }
      fetchPermissions();
      setModalOpen(false);
      setName("");
      setCurrentPermission(null);
    } catch (error) {
        toast.error('Error saving permission', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: true,
          })
    } finally {
        setisLoading(false)
    }
  };

  const handleDelete = async (id) => {
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
             axios.delete(`/permissions/${id}`,{
                headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}
            })
            .then(() => {
              Swal.fire("Deleted!", "Role has been deleted.", "success");
              fetchPermissions()
            });
          }
        });
      } catch (error) {
        Swal.fire("Error!", "Failed to delete role!", "error");
      } 
  }
  
  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="p-6 bg-white dark:bg-primary-300 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Permissions</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setModalOpen(true)}>
          Add Permission
        </button>
      </div>
      
        <table className="w-full border-none font-sans">
          <thead className="border-b dark:border-primary-200">
            <tr className="text-gray-500 dark:text-white">
              <th className="p-2 font-semibold">ID</th>
              <th className="p-2 font-semibold">Name</th>
              <th className="p-2 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((permission) => (
              <tr key={permission.id} className="text-center hover:bg-gray-50 dark:hover:bg-primary-200 border-b dark:border-primary-200">
                <td className="p-2">{permission.id}</td>
                <td className="p-2">{permission.name}</td>
                <td className="p-2 flex justify-center  gap-5 space-x-3 text-2xl">
                  <button
                    className="text-blue-500"
                    onClick={() => {
                      setCurrentPermission(permission);
                      setName(permission.name);
                      setModalOpen(true);
                    }}
                  >
                    <MdEdit />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(permission.id)}
                  >
                    <MdDeleteForever />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50">
          <div className="bg-white dark:bg-primary-400 p-6 rounded-lg w-[40rem] ">
            <h2 className="text-lg font-semibold mb-4">
              {currentPermission ? "Edit Permission" : "Add Permission"}
            </h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="Permission Name"
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => { setModalOpen(false); setName('')}}>
                Cancel
              </button>
              <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default PermissionPage;
