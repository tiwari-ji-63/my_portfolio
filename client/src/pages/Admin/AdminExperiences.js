import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import {Form, message, Modal} from "antd";
import {HideLoading, ReloadData, ShowLoading} from "../../redux/rootSlice";
import axios from "axios";

function AdminExperiences() {
    const dispatch = useDispatch();
    const [showAddEditModal, setShowAddEditModal] = React.useState(false);
    const [selectedItemForEdit, setSelectedItemForEdit] = React.useState(null);
    const {portfolioData} = useSelector((state) => state.root);
    const {experiences} = portfolioData;
    const [type, setType] = React.useState("add");

    const onFinish = async (values) => {
        try {
            dispatch(ShowLoading());
            let response;
            if (selectedItemForEdit) {
                response = await axios.post('/api/portfolio/update-experience', {
                    _id: selectedItemForEdit._id,
                    ...values
                });
            } else {
                response = await axios.post('/api/portfolio/add-experience', values);
            }

            dispatch(HideLoading());
            if (response.data.success) {
                message.success(response.data.message);
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
            const response = await axios.post('/api/portfolio/delete-experience', {
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
                            <span className="text-xl">💼</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-primary">Work Experience</h3>
                            <p className="text-gray-600">Manage your professional experience and career history</p>
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
                            <span>Add Experience</span>
                        </span>
                    </button>
                </div>
            </div>

            {/* Experience Timeline */}
            <div className="space-y-6">
                {experiences.map((experience, index) => (
                    <div key={experience._id} className="admin-card group hover:scale-102 transition-all duration-300" style={{animationDelay: `${index * 100}ms`}}>
                        <div className="flex items-start space-x-4">
                            {/* Timeline Icon */}
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-gradient-to-r from-secondary to-tertiary rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-white text-lg">💼</span>
                                </div>
                                {index < experiences.length - 1 && (
                                    <div className="w-0.5 h-16 bg-gradient-to-b from-secondary to-tertiary ml-6 mt-4"></div>
                                )}
                            </div>

                            {/* Experience Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors duration-300">
                                            {experience.title}
                                        </h3>
                                        <p className="text-lg text-tertiary font-semibold">{experience.company}</p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                            <span className="flex items-center space-x-1">
                                                <span>📅</span>
                                                <span>{experience.period}</span>
                                            </span>
                                            {experience.location && (
                                                <span className="flex items-center space-x-1">
                                                    <span>📍</span>
                                                    <span>{experience.location}</span>
                                                </span>
                                            )}
                                            {experience.employmentType && (
                                                <span className="flex items-center space-x-1">
                                                    <span>💼</span>
                                                    <span>{experience.employmentType}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            className="admin-btn-danger text-sm px-3 py-2"
                                            onClick={() => onDelete(experience)}
                                        >
                                            <span className="flex items-center space-x-1">
                                                <span>🗑️</span>
                                            </span>
                                        </button>
                                        <button
                                            className="admin-btn-secondary text-sm px-3 py-2"
                                            onClick={() => {
                                                setSelectedItemForEdit(experience);
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

                                {/* Technologies */}
                                {experience.technologies && (
                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-2">
                                            {experience.technologies.split(',').map((tech, techIndex) => (
                                                <span key={techIndex} className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">
                                                    {tech.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Description */}
                                <div className="mb-4">
                                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                                        {experience.description}
                                    </p>
                                </div>

                                {/* Responsibilities */}
                                {experience.responsibilities && (
                                    <div className="mb-4">
                                        <h4 className="font-semibold text-primary mb-2 flex items-center space-x-2">
                                            <span className="text-green-600">📋</span>
                                            <span>Key Responsibilities</span>
                                        </h4>
                                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                            {experience.responsibilities.split('\n').filter(r => r.trim()).map((resp, respIndex) => (
                                                <div key={respIndex} className="flex items-start space-x-2 mb-1">
                                                    <span className="text-green-600 mt-1">•</span>
                                                    <span className="text-gray-700 text-sm">{resp.trim()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Achievements */}
                                {experience.achievements && (
                                    <div>
                                        <h4 className="font-semibold text-primary mb-2 flex items-center space-x-2">
                                            <span className="text-yellow-600">⭐</span>
                                            <span>Key Achievements</span>
                                        </h4>
                                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                            {experience.achievements.split('\n').filter(a => a.trim()).map((achievement, achIndex) => (
                                                <div key={achIndex} className="flex items-start space-x-2 mb-1">
                                                    <span className="text-yellow-600 mt-1">★</span>
                                                    <span className="text-gray-700 text-sm">{achievement.trim()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {experiences.length === 0 && (
                <div className="admin-card text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">💼</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Work Experience Added</h3>
                    <p className="text-gray-500 mb-6">Start building your professional timeline by adding your first work experience</p>
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
                            <span>Add First Experience</span>
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
                                {selectedItemForEdit ? "Edit Experience" : "Add New Experience"}
                            </span>
                        </div>
                    }
                    footer={null}
                    onCancel={() => {
                        setShowAddEditModal(false);
                        setSelectedItemForEdit(null);
                    }}
                    width={800}
                    className="custom-modal"
                >
                    <div className="admin-form mt-6">
                        <Form 
                            layout="vertical" 
                            onFinish={onFinish}
                            initialValues={selectedItemForEdit || {}}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Form.Item name="title" label="Position / Job Title" className="mb-4">
                                    <input 
                                        placeholder="e.g., Senior Software Engineer"
                                        className="admin-input w-full"
                                    />
                                </Form.Item>
                                
                                <Form.Item name="company" label="Company Name" className="mb-4">
                                    <input 
                                        placeholder="e.g., Google Inc."
                                        className="admin-input w-full"
                                    />
                                </Form.Item>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Form.Item name="period" label="Time Period" className="mb-4">
                                    <input 
                                        placeholder="e.g., Jan 2020 - Present"
                                        className="admin-input w-full"
                                    />
                                </Form.Item>
                                
                                <Form.Item name="location" label="Location" className="mb-4">
                                    <input 
                                        placeholder="e.g., San Francisco, CA"
                                        className="admin-input w-full"
                                    />
                                </Form.Item>
                                
                                <Form.Item name="employmentType" label="Employment Type" className="mb-4">
                                    <select className="admin-input w-full">
                                        <option value="">Select Type</option>
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Freelance">Freelance</option>
                                        <option value="Internship">Internship</option>
                                    </select>
                                </Form.Item>
                            </div>
                            
                            <Form.Item name="technologies" label="Technologies / Skills Used" className="mb-4">
                                <input 
                                    placeholder="React, Node.js, MongoDB, AWS (comma-separated)"
                                    className="admin-input w-full"
                                />
                            </Form.Item>
                            
                            <Form.Item name="description" label="Role Description" className="mb-4">
                                <textarea 
                                    placeholder="Provide an overview of your role and main responsibilities..."
                                    rows={4}
                                    className="admin-input resize-none"
                                />
                            </Form.Item>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Form.Item name="responsibilities" label="Key Responsibilities (one per line)" className="mb-4">
                                    <textarea 
                                        placeholder="Led development team of 5 engineers&#10;Architected scalable microservices&#10;Implemented CI/CD pipelines"
                                        rows={4}
                                        className="admin-input resize-none"
                                    />
                                </Form.Item>
                                
                                <Form.Item name="achievements" label="Key Achievements (one per line)" className="mb-4">
                                    <textarea 
                                        placeholder="Improved system performance by 40%&#10;Reduced deployment time by 60%&#10;Won Employee of the Year award"
                                        rows={4}
                                        className="admin-input resize-none"
                                    />
                                </Form.Item>
                            </div>

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

export default AdminExperiences;
