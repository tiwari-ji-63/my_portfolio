import React, { useState } from 'react';
import PremiumImageInput from '../../components/PremiumImageInput';
import { useDispatch, useSelector } from "react-redux";
import { Form, message, Modal } from "antd";
import { HideLoading, ReloadData, ShowLoading } from "../../redux/rootSlice";
import axios from "axios";


// Helper to upload image file and get URL
async function uploadImageFile(file) {
    const formData = new FormData();
    formData.append('image', file);
    const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.url;
}

function AdminCertificates() {
    const dispatch = useDispatch();
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);
    const { portfolioData } = useSelector((state) => state.root);
    const { certificates } = portfolioData;
    const [type, setType] = useState("add");
    // Premium image input state
    const [imageInputType, setImageInputType] = useState('url');
    const [certificateImage, setCertificateImage] = useState("");

    const onFinish = async (values) => {
        try {
            // Handle image: if File, upload and get URL; if string, use as is
            let imageUrl = certificateImage;
            if (certificateImage && typeof certificateImage !== 'string') {
                dispatch(ShowLoading());
                imageUrl = await uploadImageFile(certificateImage);
                dispatch(HideLoading());
            }
            if (imageUrl) {
                values.image = imageUrl;
            }
            dispatch(ShowLoading());
            let response;
            if (selectedItemForEdit) {
                response = await axios.post('/api/portfolio/update-certificate', {
                    _id: selectedItemForEdit._id,
                    ...values
                });
            } else {
                response = await axios.post('/api/portfolio/add-certificate', values);
            }

            dispatch(HideLoading());
            if (response.data.success) {
                message.success(response.data.message);
                setShowAddEditModal(false);
                setSelectedItemForEdit(null);
                setCertificateImage("");
                dispatch(ReloadData(true));
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    };

    const onDelete = async (item) => {
        try {
            dispatch(ShowLoading());
            const response = await axios.post('/api/portfolio/delete-certificate', {
                _id: item._id
            });
            dispatch(HideLoading());
            if (response.data.success) {
                message.success(response.data.message);
                dispatch(ReloadData(true));
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    };

    return (
        <div className="space-y-6 fade-in">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="admin-icon">
                            <span className="text-xl">🏆</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-primary">Certificates Management</h3>
                            <p className="text-gray-600">Manage your professional certifications and achievements</p>
                        </div>
                    </div>
                    <button 
                        className="admin-btn-primary"
                        onClick={() => {
                            setSelectedItemForEdit(null);
                            setType("add");
                            setShowAddEditModal(true);
                        }}
                    >
                        <span className="flex items-center space-x-2">
                            <span>➕</span>
                            <span>Add Certificate</span>
                        </span>
                    </button>
                </div>
            </div>

            {/* Certificates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((certificate, index) => (
                    <div key={certificate._id} className="admin-card group hover:scale-105 transition-all duration-300" style={{animationDelay: `${index * 100}ms`}}>
                        {/* Certificate Image */}
                        <div className="relative mb-4 overflow-hidden rounded-xl">
                            <img 
                                src={certificate.image} 
                                alt={certificate.title}
                                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <div className="text-white">
                                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                        <span className="text-lg">🏆</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Certificate Info */}
                        <div className="space-y-3">
                            <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors duration-300 line-clamp-2">
                                {certificate.title}
                            </h3>
                            
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span className="text-secondary font-semibold">📅</span>
                                <span>Issued: {certificate.issueDate}</span>
                            </div>
                            
                            <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg line-clamp-3">
                                {certificate.description}
                            </p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
                            <button
                                className="admin-btn-danger text-sm px-4 py-2"
                                onClick={() => onDelete(certificate)}
                            >
                                <span className="flex items-center space-x-1">
                                    <span>🗑️</span>
                                    <span>Delete</span>
                                </span>
                            </button>
                            <button
                                className="admin-btn-secondary text-sm px-4 py-2"
                                onClick={() => {
                                    setSelectedItemForEdit(certificate);
                                    setType("edit");
                                    setShowAddEditModal(true);
                                }}
                            >
                                <span className="flex items-center space-x-1">
                                    <span>✏️</span>
                                    <span>Edit</span>
                                </span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {certificates.length === 0 && (
                <div className="admin-card text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🏆</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Certificates Added</h3>
                    <p className="text-gray-500 mb-6">Start building your credentials by adding your first certificate</p>
                    <button
                        className="admin-btn-primary"
                        onClick={() => {
                            setSelectedItemForEdit(null);
                            setType("add");
                            setShowAddEditModal(true);
                        }}
                    >
                        <span className="flex items-center space-x-2">
                            <span>🚀</span>
                            <span>Add First Certificate</span>
                        </span>
                    </button>
                </div>
            )}

            {/* Add/Edit Modal */}
            {(type === "add" || selectedItemForEdit) && (
                <Modal 
                    open={showAddEditModal}
                    title={
                        <div className="flex items-center space-x-3 p-2">
                            <div className="admin-icon w-8 h-8">
                                <span className="text-sm">{selectedItemForEdit ? "✏️" : "➕"}</span>
                            </div>
                            <span className="text-lg font-bold text-primary">
                                {selectedItemForEdit ? "Edit Certificate" : "Add New Certificate"}
                            </span>
                        </div>
                    }
                    footer={null}
                    onCancel={() => {
                        setShowAddEditModal(false);
                        setSelectedItemForEdit(null);
                    }}
                    width={600}
                    className="custom-modal"
                >
                    <div className="admin-form mt-6">
                        <Form 
                            layout="vertical" 
                            onFinish={onFinish}
                            initialValues={selectedItemForEdit || {}}
                        >
                            <Form.Item name="title" label="Certificate Title / Issuer" className="mb-4">
                                <input 
                                    placeholder="e.g., AWS Certified Solutions Architect"
                                    className="admin-input w-full"
                                />
                            </Form.Item>
                            
                            <Form.Item name="issueDate" label="Issue Date" className="mb-4">
                                <input 
                                    placeholder="e.g., January 2024"
                                    className="admin-input w-full"
                                />
                            </Form.Item>
                            
                            <div className="mb-4">
                                <PremiumImageInput
                                    value={certificateImage || selectedItemForEdit?.image || ""}
                                    onChange={setCertificateImage}
                                    inputType={imageInputType}
                                    setInputType={setImageInputType}
                                    label="Certificate Image"
                                />
                            </div>
                            
                            <Form.Item name="description" label="Description" className="mb-6">
                                <textarea 
                                    placeholder="Describe what this certificate represents and the skills you gained..."
                                    rows={4}
                                    className="admin-input resize-none"
                                />
                            </Form.Item>

                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    className="admin-btn-secondary"
                                    onClick={() => {
                                        setShowAddEditModal(false);
                                        setSelectedItemForEdit(null);
                                    }}
                                >
                                    <span className="flex items-center space-x-2">
                                        <span>❌</span>
                                        <span>Cancel</span>
                                    </span>
                                </button>
                                <button
                                    type="submit"
                                    className="admin-btn-primary"
                                >
                                    <span className="flex items-center space-x-2">
                                        <span>{selectedItemForEdit ? "💾" : "➕"}</span>
                                        <span>{selectedItemForEdit ? "Update" : "Add"}</span>
                                    </span>
                                </button>
                            </div>
                        </Form>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default AdminCertificates;