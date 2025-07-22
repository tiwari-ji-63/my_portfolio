import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Form, message, Modal } from "antd";
import { HideLoading, ReloadData, ShowLoading } from "../../redux/rootSlice";
import axios from "axios";

function AdminProjects() {
    const dispatch = useDispatch();
    const [showAddEditModal, setShowAddEditModal] = React.useState(false);
    const [selectedItemForEdit, setSelectedItemForEdit] = React.useState(null);
    const { portfolioData } = useSelector((state) => state.root);
    const { projects } = portfolioData;
    const [type, setType] = React.useState("add");

    const onFinish = async (values) => {
        try {
            const temptechnologies = values.technologies.split(" , ");
            values.technologies = temptechnologies;
            dispatch(ShowLoading());
            let response;
            if (selectedItemForEdit) {
                response = await axios.post('/api/portfolio/update-project', {
                    _id: selectedItemForEdit._id,
                    ...values
                });
            } else {
                response = await axios.post('/api/portfolio/add-project', values);
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
            const response = await axios.post('/api/portfolio/delete-project', {
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
                            <span className="text-xl">🚀</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-primary">Projects Management</h3>
                            <p className="text-gray-600">Manage your portfolio projects and showcases</p>
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
                            <span>Add Project</span>
                        </span>
                    </button>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                    <div key={project._id} className="admin-card group hover:scale-105 transition-all duration-300" style={{animationDelay: `${index * 100}ms`}}>
                        {/* Project Image */}
                        <div className="relative mb-4 overflow-hidden rounded-xl">
                            <img 
                                src={project.image} 
                                alt={project.title}
                                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        
                        {/* Project Info */}
                        <div className="space-y-3">
                            <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors duration-300">
                                {project.title}
                            </h3>
                            
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-start space-x-2">
                                    <span className="text-secondary font-semibold">🛠️ Tech:</span>
                                    <div className="flex flex-wrap gap-1">
                                        {project.technologies?.map((tech, i) => (
                                            <span key={i} className="bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs font-medium">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <span className="text-secondary font-semibold">🔗 Links:</span>
                                    <div className="flex space-x-2">
                                        {project.project_link && (
                                            <a href={project.project_link} target="_blank" rel="noopener noreferrer" 
                                               className="text-tertiary hover:text-secondary transition-colors duration-300">
                                                Live
                                            </a>
                                        )}
                                        {project.github_link && (
                                            <a href={project.github_link} target="_blank" rel="noopener noreferrer"
                                               className="text-tertiary hover:text-secondary transition-colors duration-300">
                                                GitHub
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                                {project.description}
                            </p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
                            <button
                                className="admin-btn-danger text-sm px-4 py-2"
                                onClick={() => onDelete(project)}
                            >
                                <span className="flex items-center space-x-1">
                                    <span>🗑️</span>
                                    <span>Delete</span>
                                </span>
                            </button>
                            <button
                                className="admin-btn-secondary text-sm px-4 py-2"
                                onClick={() => {
                                    setSelectedItemForEdit(project);
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
                                {selectedItemForEdit ? "Edit Project" : "Add New Project"}
                            </span>
                        </div>
                    }
                    footer={null}
                    onCancel={() => {
                        setShowAddEditModal(false);
                        setSelectedItemForEdit(null);
                    }}
                    width={700}
                    className="custom-modal"
                >
                    <div className="admin-form mt-6">
                        <Form 
                            layout="vertical" 
                            onFinish={onFinish}
                            initialValues={{
                                ...selectedItemForEdit,
                                technologies: selectedItemForEdit?.technologies?.join(" , "),
                            } || {}}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Form.Item name="title" label="Project Name" className="mb-4">
                                    <input 
                                        placeholder="Enter project name..."
                                        className="admin-input w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl text-primary placeholder-gray-400 focus:outline-none focus:border-secondary focus:bg-white transition-all duration-300"
                                    />
                                </Form.Item>
                                
                                <Form.Item name="image" label="Project Image URL" className="mb-4">
                                    <input 
                                        placeholder="Enter image URL..."
                                        className="admin-input w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl text-primary placeholder-gray-400 focus:outline-none focus:border-secondary focus:bg-white transition-all duration-300"
                                    />
                                </Form.Item>
                            </div>
                            
                            <Form.Item name="technologies" label="Technologies (Separated by comma , )" className="mb-4">
                                <input 
                                    placeholder="React, Node.js, MongoDB..."
                                    className="admin-input w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl text-primary placeholder-gray-400 focus:outline-none focus:border-secondary focus:bg-white transition-all duration-300"
                                />
                            </Form.Item>
                            
                            <Form.Item name="description" label="Description" className="mb-4">
                                <textarea 
                                    placeholder="Describe your project..."
                                    rows={4}
                                    className="admin-input w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl text-primary placeholder-gray-400 focus:outline-none focus:border-secondary focus:bg-white transition-all duration-300 resize-none"
                                />
                            </Form.Item>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Form.Item name="project_link" label="Live Demo Link" className="mb-6">
                                    <input 
                                        placeholder="https://your-project.com"
                                        className="admin-input w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl text-primary placeholder-gray-400 focus:outline-none focus:border-secondary focus:bg-white transition-all duration-300"
                                    />
                                </Form.Item>
                                
                                <Form.Item name="github_link" label="GitHub Repository" className="mb-6">
                                    <input 
                                        placeholder="https://github.com/username/repo"
                                        className="admin-input w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl text-primary placeholder-gray-400 focus:outline-none focus:border-secondary focus:bg-white transition-all duration-300"
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

export default AdminProjects;
