'use client'
import { useState, useEffect } from 'react';
import axios from '../../../../../axios';
import { toast } from 'react-toastify';
import { useLoading } from '@/context/LoadingContext';
import Spinner from '@/components/Spinner';
import { MdDelete, MdEdit } from 'react-icons/md';
import Image from 'next/image';
import Swal from 'sweetalert2';

const PromotionManagement = () => {
    const [promotions, setPromotions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const {startLoading, stopLoading, loading} = useLoading()

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        position: "",
        status: 'active',
        media: null, 
        mediaPreview: null,
        currentMedia: null
    });

    const fetchPromotions = async () => {
        try {
            startLoading()
            const response = await axios.get('/admin/promotions',{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                },
            });
            setPromotions(response.data.promotions);
        } catch (error) {
            toast.error('Failed to fetch promotions',{
                hideProgressBar:true
            })
        } finally {
            stopLoading()
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        console.log('Status:',formData.status)
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const mediaPreviewUrl = URL.createObjectURL(file);
            setFormData((prevData) => ({
                ...prevData,
                media: file,
                mediaPreview: mediaPreviewUrl,
            }));
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
                   axios.delete(`/promotions/${id}`,{
                      headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}
                  })
                  .then(() => {
                    Swal.fire("Deleted!", "Promotion has been deleted.", "success");
                    // fetchPromotions()
                  });
                }
              });
            setPromotions(promotions.filter((promotion) => promotion.id !== id));
        } catch (error) {
            Swal.fire("Error", "Failed to Delete", "error");

        }
    };

    const handleAddPromotion = async () => {
        setIsLoading(true)
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("start_date", formData.start_date);
        formDataToSend.append("end_date", formData.end_date);
        formDataToSend.append("position", formData.position);
        formDataToSend.append("status", formData.status);
        if (formData.media) {
            formDataToSend.append("media", formData.media);
        }

        console.log('FOrmdata:',formData, formDataToSend)

        try {
            const response = await axios.post('/promotions', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization':`Bearer ${localStorage.getItem('token')}`
                },
            });
            console.log(response)
            setPromotions([response.data.promotion, ...promotions]);
            setAddModalOpen(false);
        } catch (error) {
            toast.error('Failed to add promo',{
                hideProgressBar:true
            })
        } finally{
            setIsLoading(false)
        }
    };

    const handleUpdatePromotion = async () => {
        setIsLoading(true)
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("start_date", formData.start_date);
        formDataToSend.append("end_date", formData.end_date);
        formDataToSend.append("position", formData.position);
        formDataToSend.append("status", formData.status);
        if (formData.media) {
            formDataToSend.append("media", formData.media);
        }

        try {
            const response = await axios.post(`/promotions/${selectedPromotion.id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                },
            });
            setPromotions((prevPromotions) =>
                prevPromotions.map((promotion) =>
                    promotion.id === selectedPromotion.id
                        ? { ...promotion, ...formData }
                        : promotion
                )
            );
            setUpdateModalOpen(false);
            toast.success('successfully updated',{
                hideProgressBar:true
            })
            fetchPromotions()
        } catch (error) {
            toast.error('Failed to update promo',{
                hideProgressBar:true
            })
        } finally {
            setIsLoading(false)
        }
    };


    if(loading){
        return <Spinner/>
    }

    return (
        <div className="container mx-auto p-6">
            <div className=' flex items-center justify-between'>
                <h1 className="text-2xl font-bold mb-6">Promotion Management</h1>
                <button
                    onClick={() => setAddModalOpen(true)}
                    className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
                >
                    Add New Promotion
                </button>
            </div>

            <table className="min-w-full  border-gray-200 rounded-lg">
                <thead>
                    <tr>
                        <th></th>
                        <th className="py-2 px-4 text-left">Title</th>
                        <th className="py-2 px-4 text-left">Description</th>
                        <th className="py-2 px-4 text-left">Pos</th>
                        <th className="py-2 px-4 text-left">Status</th>
                        <th className="py-2 px-4 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {promotions.map((promotion) => (
                        <tr key={promotion.id}>
                            <td className=' py-2 px-4'>
                            {promotion.media_path &&
                                <Image
                                className=' object-cover'
                                src={promotion.media_path}
                                width={80}
                                height={80}
                                alt=''
                                unoptimized
                                />
                            }
                            </td>
                            <td className="py-2 px-4">{promotion.title}</td>
                            <td className="py-2 px-4">{promotion.description}</td>
                            <td className="py-2 px-4">{promotion.position}</td>
                            <td className="py-2 px-4">{promotion.status===true ? 'Active': 'Inactive'}</td>
                            <td className="py-2 px-4">
                                <button
                                    onClick={() => {
                                        setSelectedPromotion(promotion);
                                        setFormData({
                                            title: promotion.title,
                                            description: promotion.description,
                                            start_date: promotion.start_date,
                                            end_date: promotion.end_date,
                                            position: promotion.position,
                                            status: promotion.status === true ? 'active' : 'inactive', 
                                            media: null,
                                            mediaPreview: null,
                                            currentMedia: promotion.media_path || null 
                                        });
                                        setUpdateModalOpen(true);
                                    }}
                                    className="text-primary text-xl py-1 px-3 rounded mr-2"
                                >
                                    <MdEdit />
                                </button>
                                <button
                                    onClick={() => handleDelete(promotion.id)}
                                    className="text-red-500 text-xl py-1 px-3 rounded"
                                >
                                    <MdDelete/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add Promotion Modal */}
            {addModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-primary-400 p-6 rounded-lg w-96 lg:w-[60rem] gap-4 flex  flex-col md:flex-row lg:flex-row">
                        <div className='flex-1'>
                            <h2 className="text-2xl font-bold mb-4">Add New Promotion</h2>
                            {/* Media Preview */}
                            {formData.mediaPreview &&
                                <div className="mt-4">
                                        <img
                                            src={formData.mediaPreview}
                                            alt="Media Preview"
                                            className="w-full lg:max-h-[20rem]  object-contain rounded"
                                            />
                                </div>
                            }
                            {/* Media File Input */}
                            <input
                                    type="file"
                                    name="media"
                                    onChange={handleFileChange}
                                    className="block mt-5 w-full text-sm file:mr-4 file:rounded file:border-0 file:bg-[#0379e0] file:py-2.5 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-bgprimary file:duration-500 hover:file:bg-[#1d619d] file:cursor-pointer cursor-pointer focus:outline-none" 
                                />
                        </div>

                        <div className=' flex-1'>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Title"
                                className="w-full p-2 mb-4 border border-gray-300 rounded"
                            />
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Description"
                                className="w-full p-2 mb-4 border border-gray-300 rounded"
                            />
                            <input
                                type="datetime-local"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-4 border border-gray-300 rounded"
                            />
                            <input
                                type="datetime-local"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-4 border border-gray-300 rounded"
                            />
                            <select
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-4 border border-gray-300 rounded"
                            >   
                                <option value="">Select Position</option>
                                <option value="home-slider">Home slider</option>
                                <option value="product-page">Product page</option>
                                <option value="cart-page">Cart page</option>
                                <option value="popup">Popup</option>
                                <option value="checkout">Checkout</option>
                            </select>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-4 border border-gray-300 rounded"
                            >
                                <option value={'active'}>Active</option>
                                <option value={'inactive'}>Inactive</option>
                            </select>
                            
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setAddModalOpen(false)}
                                    className="bg-gray-500 text-white py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddPromotion}
                                    disabled={isLoading}
                                    className={`${isLoading && 'cursor-not-allowed'} bg-blue-500 text-white py-2 px-4 rounded flex items-center gap-2`}
                                >
                                    <div className={`w-5 h-5 border-4 border-[#e9f5ff] border-t-transparent rounded-full animate-spin ${!isLoading && 'hidden'}`}>
                                    </div>
                                    {isLoading ? 'Adding...': 'Add Promotion'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Promotion Modal */}
            {updateModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-primary-400 p-6 rounded-lg w-96 lg:w-[60rem] flex flex-col md:flex-row lg:flex-row gap-4">
                        <div className='flex-1'>
                            <h2 className="text-2xl font-bold mb-4">Update Promotion</h2>
                            {/* Media Preview */}
                            {formData.mediaPreview ?
                                <div className="mt-4">
                                        <img
                                            src={formData.mediaPreview}
                                            alt="Media Preview"
                                            className="w-full lg:max-h-[20rem]  object-contain rounded"
                                            />
                                </div>
                                :
                                <div className="mt-4">
                                        <img
                                            src={formData.currentMedia}
                                            alt="Current Media"
                                            className="w-full lg:max-h-[20rem]  object-contain rounded"
                                            />
                                </div>
                            }
                            {/* Media File Input */}
                            <input
                                type="file"
                                name="media"
                                onChange={handleFileChange}
                                className="block mt-5 w-full text-sm file:mr-4 file:rounded file:border-0 file:bg-[#0379e0] file:py-2.5 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-bgprimary file:duration-500 hover:file:bg-[#1d619d] file:cursor-pointer cursor-pointer focus:outline-none" 
                            />
                        </div>
                        
                        <div className=' flex-1'>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Title"
                                className="w-full p-2 mb-4 border border-gray-300 rounded"
                            />
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Description"
                                className="w-full p-2 mb-4 border border-gray-300 rounded"
                            />
                            <input
                                type="datetime-local"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-4 border border-gray-300 rounded"
                            />
                            <input
                                type="datetime-local"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-4 border border-gray-300 rounded"
                            />
                            <select
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-4 border border-gray-300 rounded"
                            >
                                <option value="home-slider">Home slider</option>
                                <option value="product-page">Product page</option>
                                <option value="cart-page">Cart page</option>
                                <option value="popup">Popup</option>
                                <option value="checkout">Checkout</option>
                            </select>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-4 border border-gray-300 rounded"
                            >
                                <option value='active'>Active</option>
                                <option value='inactive'>Inactive</option>
                            </select>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setUpdateModalOpen(false)}
                                    className="bg-gray-500 text-white py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdatePromotion}
                                    disabled={isLoading}
                                    className="bg-blue-500 text-white py-2 px-4 rounded flex items-center gap-2"
                                >
                                    <div className={`w-5 h-5 border-4 border-[#e9f5ff] border-t-transparent rounded-full animate-spin ${!isLoading && 'hidden'}`}>
                                    </div>
                                    {isLoading ? 'Updating...':'Update Promotion'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromotionManagement;
