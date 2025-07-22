import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import {Form, message, Modal} from "antd";
import {HideLoading, ReloadData, ShowLoading} from "../../redux/rootSlice";
import axios from "axios";

function AdminEducation() {
    const dispatch = useDispatch();
    const [showAddEditModal, setShowAddEditModal] = React.useState(false);
    const [selectedItemForEdit, setSelectedItemForEdit] = React.useState(null);
    const {portfolioData} = useSelector((state) => state.root);
    const {educations} = portfolioData;
    const [type, setType] = React.useState("add");
    const [form] = Form.useForm();

    // Reset form when modal opens/closes or when selectedItemForEdit changes
    React.useEffect(() => {
        if (showAddEditModal) {
            if (selectedItemForEdit) {
                form.setFieldsValue(selectedItemForEdit);
            } else {
                form.resetFields();
            }
        }
    }, [showAddEditModal, selectedItemForEdit, form]);

    const onFinish = async (values) => {
        try {
            dispatch(ShowLoading());
            let response;
            if (selectedItemForEdit) {
                response = await axios.post('/api/portfolio/update-education', {
                    _id: selectedItemForEdit._id,
                    ...values
                });
            } else {
                response = await axios.post('/api/portfolio/add-education', values);
            }

            dispatch(HideLoading());
            if (response.data.success) {
                message.success(response.data.message);
                form.resetFields();
                setShowAddEditModal(false);
                setSelectedItemForEdit(null);
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
            const response = await axios.post('/api/portfolio/delete-education', {
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
                            <span className="text-xl">🎓</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-primary">Education Management</h3>
                            <p className="text-gray-600">Manage your educational background and academic achievements</p>
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
                            <span>Add Education</span>
                        </span>
                    </button>
                </div>
            </div>

            {/* Education Timeline */}
            <div className="space-y-6">
                {educations.map((education, index) => (
                    <div key={education._id} className="admin-card group hover:scale-102 transition-all duration-300" style={{animationDelay: `${index * 100}ms`}}>
                        <div className="flex items-start space-x-4">
                            {/* Timeline Icon */}
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-gradient-to-r from-accent to-tertiary rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-white text-lg">🎓</span>
                                </div>
                                {index < educations.length - 1 && (
                                    <div className="w-0.5 h-16 bg-gradient-to-b from-accent to-tertiary ml-6 mt-4"></div>
                                )}
                            </div>

                            {/* Education Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors duration-300">
                                            {education.degree}
                                        </h3>
                                        <p className="text-lg text-tertiary font-semibold">{education.institution}</p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                            <span className="flex items-center space-x-1">
                                                <span>📅</span>
                                                <span>{education.period}</span>
                                            </span>
                                            {education.location && (
                                                <span className="flex items-center space-x-1">
                                                    <span>📍</span>
                                                    <span>{education.location}</span>
                                                </span>
                                            )}
                                            {education.grade && (
                                                <span className="flex items-center space-x-1">
                                                    <span>🏅</span>
                                                    <span>{education.grade}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            className="admin-btn-danger text-sm px-3 py-2"
                                            onClick={() => onDelete(education)}
                                        >
                                            <span className="flex items-center space-x-1">
                                                <span>🗑️</span>
                                            </span>
                                        </button>
                                        <button
                                            className="admin-btn-secondary text-sm px-3 py-2"
                                            onClick={() => {
                                                setSelectedItemForEdit(education);
                                                setType("edit");
                                                setShowAddEditModal(true);
                                            }}
                                        >
                                            <span className="flex items-center space-x-1">
                                                <span>✏️</span>
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* Education Title */}
                                <div className="mb-3">
                                    <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                                        {education.title}
                                    </span>
                                </div>

                                {/* Description */}
                                <div className="mb-4">
                                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                                        {education.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {educations.length === 0 && (
                <div className="admin-card text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🎓</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Education Records</h3>
                    <p className="text-gray-500 mb-6">Start building your academic profile by adding your educational background</p>
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
                            <span>Add First Education</span>
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
                                {selectedItemForEdit ? "Edit Education" : "Add New Education"}
                            </span>
                        </div>
                    }
                    footer={null}
                    onCancel={() => {
                        form.resetFields();
                        setShowAddEditModal(false);
                        setSelectedItemForEdit(null);
                    }}
                    width={700}
                    className="custom-modal"
                >
                    <div className="admin-form mt-6">
                        <Form 
                            form={form}
                            layout="vertical" 
                            onFinish={onFinish}
                        >
                            <Form.Item name="title" label="Education Title / Program" className="mb-4">
                                <input 
                                    placeholder="e.g., Computer Science Education, Engineering Program"
                                    className="admin-input w-full"
                                />
                            </Form.Item>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Form.Item name="institution" label="Institution Name" className="mb-4">
                                    <input 
                                        placeholder="e.g., Stanford University"
                                        className="admin-input w-full"
                                    />
                                </Form.Item>
                                
                                <Form.Item name="degree" label="Degree / Certificate" className="mb-4">
                                    <input 
                                        placeholder="e.g., Bachelor of Computer Science"
                                        className="admin-input w-full"
                                    />
                                </Form.Item>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Form.Item name="period" label="Time Period" className="mb-4">
                                    <input 
                                        placeholder="e.g., 2015 - 2019"
                                        className="admin-input w-full"
                                    />
                                </Form.Item>
                                
                                <Form.Item name="grade" label="Grade / GPA" className="mb-4">
                                    <input 
                                        placeholder="e.g., 3.8 GPA, First Class"
                                        className="admin-input w-full"
                                    />
                                </Form.Item>
                                
                                <Form.Item name="location" label="Location" className="mb-4">
                                    <input 
                                        placeholder="e.g., Stanford, CA"
                                        className="admin-input w-full"
                                    />
                                </Form.Item>
                            </div>
                            
                            <Form.Item name="description" label="Description" className="mb-6">
                                <textarea 
                                    placeholder="Describe your education experience, major subjects, achievements, projects, etc..."
                                    rows={4}
                                    className="admin-input resize-none"
                                />
                            </Form.Item>

                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    className="admin-btn-secondary"
                                    onClick={() => {
                                        form.resetFields();
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

export default AdminEducation;