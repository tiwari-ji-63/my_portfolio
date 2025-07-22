import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Form, message, InputNumber, Table, Button, Space, Popconfirm, Switch, Select, Tag } from "antd";
import { HideLoading, ReloadData, ShowLoading } from "../../redux/rootSlice";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

function AdminSocialStats() {
    const dispatch = useDispatch();
    const { portfolioData } = useSelector((state) => state.root);
    const { socialStats } = portfolioData;
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedField, setSelectedField] = useState(null);
    const [addForm] = Form.useForm();
    const [editForm] = Form.useForm();

    // Get fields array or empty array if not available
    const fields = socialStats?.fields || [];

    // Sample professional stats suggestions
    const getSampleStats = () => [
        { name: "Years of Experience", value: 5, category: "experience", unit: "+" },
        { name: "Projects Completed", value: 120, category: "projects", unit: "+" },
        { name: "Happy Clients", value: 85, category: "clients", unit: "+" },
        { name: "Technologies Mastered", value: 15, category: "skills", unit: "+" },
        { name: "Success Rate", value: 98, category: "achievements", unit: "%" },
        { name: "LinkedIn Followers", value: 1250, category: "social", unit: "+" }
    ];

    const addSampleStats = async () => {
        try {
            dispatch(ShowLoading());
            const samples = getSampleStats();
            
            for (const sample of samples) {
                const newStat = {
                    ...sample,
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    type: 'static',
                    enabled: true,
                    order: fields.length
                };
                
                await axios.post("/api/portfolio/add-social-stats", newStat);
            }
            
            dispatch(HideLoading());
            message.success("✅ Sample professional stats added successfully!");
            dispatch(ReloadData(true));
        } catch (error) {
            dispatch(HideLoading());
            message.error("Failed to add sample stats: " + error.message);
        }
    };

    const onAdd = async (values) => {
        try {
            dispatch(ShowLoading());
            const response = await axios.post("/api/portfolio/add-social-stats", values);
            dispatch(HideLoading());
            if (response.data.success) {
                message.success("✅ Field Added Successfully");
                setShowAddModal(false);
                addForm.resetFields();
                dispatch(ReloadData(true));
            } else {
                message.error("Failed to add field: " + response.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error("Failed to add field: " + error.message);
        }
    };

    const onUpdate = async (values) => {
        try {
            dispatch(ShowLoading());
            const response = await axios.put(
                `/api/portfolio/update-social-stats/${selectedField._id}`,
                values
            );
            dispatch(HideLoading());
            if (response.data.success) {
                message.success("✅ Field Updated Successfully");
                setShowEditModal(false);
                setSelectedField(null);
                editForm.resetFields();
                dispatch(ReloadData(true));
            } else {
                message.error("Failed to update field: " + response.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error("Failed to update field: " + error.message);
        }
    };

    const onDelete = async (record) => {
        try {
            dispatch(ShowLoading());
            const response = await axios.delete(`/api/portfolio/delete-social-stats/${record._id}`);
            dispatch(HideLoading());
            if (response.data.success) {
                message.success("✅ Field Deleted Successfully");
                dispatch(ReloadData(true));
            } else {
                message.error("Failed to delete field: " + response.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error("Failed to delete field: " + error.message);
        }
    };

    // Table columns for professional stats
    const statsColumns = [
        {
            title: 'Stat Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
            render: (value, record) => {
                const displayValue = record.unit ? `${value}${record.unit}` : value;
                if (record.type === 'dynamic') {
                    return <span style={{ color: '#1890ff', fontWeight: 'bold' }}>{displayValue}</span>;
                }
                return <span style={{ fontWeight: 'bold' }}>{displayValue}</span>;
            }
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (category) => {
                const colors = {
                    'experience': 'blue',
                    'projects': 'green', 
                    'clients': 'orange',
                    'skills': 'purple',
                    'achievements': 'gold',
                    'social': 'cyan'
                };
                return (
                    <Tag color={colors[category] || 'default'}>
                        {category?.toUpperCase() || 'GENERAL'}
                    </Tag>
                );
            }
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (
                <Tag color={type === 'dynamic' ? 'blue' : 'green'}>
                    {type === 'dynamic' ? 'AUTO' : 'MANUAL'}
                </Tag>
            )
        },
        {
            title: 'Enabled',
            dataIndex: 'enabled',
            key: 'enabled',
            render: (enabled) => (
                <Tag color={enabled ? 'green' : 'red'}>
                    {enabled ? 'Active' : 'Inactive'}
                </Tag>
            )
        },
        {
            title: 'Last Updated',
            dataIndex: 'lastUpdated',
            key: 'lastUpdated',
            render: (date) => {
                if (!date) return 'Never';
                return new Date(date).toLocaleString();
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setSelectedField(record);
                            editForm.setFieldsValue(record);
                            setShowEditModal(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this field?"
                        onConfirm={() => onDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="primary"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div className="space-y-6 fade-in">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="admin-icon">
                            <span className="text-xl">📊</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-primary">Professional Stats Management</h3>
                            <p className="text-gray-600">Manage your professional achievements and statistics</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        {fields.length === 0 && (
                            <button
                                className="admin-btn-secondary"
                                onClick={addSampleStats}
                            >
                                <span className="flex items-center space-x-2">
                                    <span>🎯</span>
                                    <span>Add Sample Stats</span>
                                </span>
                            </button>
                        )}
                        <button
                            className="admin-btn-primary"
                            onClick={() => setShowAddModal(true)}
                        >
                            <span className="flex items-center space-x-2">
                                <span>➕</span>
                                <span>Add Stat</span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Enhanced Stats Overview Cards */}
            {fields.length > 0 && (
                <div className="space-y-6">
                    {/* Primary Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="admin-card text-center group hover:scale-105 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                                    <span className="text-white text-2xl">🏆</span>
                                </div>
                                <h3 className="text-sm text-gray-600 mb-2 font-medium">Total Stats</h3>
                                <p className="text-3xl font-bold text-green-600 mb-2">{fields.length}</p>
                                <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                                    <span>📊</span>
                                    <span>Active metrics</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="admin-card text-center group hover:scale-105 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                                    <span className="text-white text-2xl">⚡</span>
                                </div>
                                <h3 className="text-sm text-gray-600 mb-2 font-medium">Experience Years</h3>
                                <p className="text-3xl font-bold text-blue-600 mb-2">
                                    {fields.find(f => f.category === 'experience')?.value || 0}+
                                </p>
                                <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                                    <span>💼</span>
                                    <span>Professional journey</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="admin-card text-center group hover:scale-105 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                                    <span className="text-white text-2xl">🚀</span>
                                </div>
                                <h3 className="text-sm text-gray-600 mb-2 font-medium">Total Projects</h3>
                                <p className="text-3xl font-bold text-purple-600 mb-2">
                                    {fields.filter(f => f.category === 'projects').reduce((sum, f) => sum + f.value, 0)}+
                                </p>
                                <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                                    <span>💻</span>
                                    <span>Completed work</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="admin-card text-center group hover:scale-105 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/10"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                                    <span className="text-white text-2xl">👥</span>
                                </div>
                                <h3 className="text-sm text-gray-600 mb-2 font-medium">Happy Clients</h3>
                                <p className="text-3xl font-bold text-orange-600 mb-2">
                                    {fields.filter(f => f.category === 'clients').reduce((sum, f) => sum + f.value, 0)}+
                                </p>
                                <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                                    <span>😊</span>
                                    <span>Satisfied clients</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="admin-card">
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold text-primary mb-2">Stats by Category</h4>
                            <p className="text-gray-600">Overview of your achievements across different categories</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {['experience', 'projects', 'clients', 'skills', 'achievements', 'social'].map(category => {
                                const categoryStats = fields.filter(f => f.category === category);
                                const totalValue = categoryStats.reduce((sum, f) => sum + f.value, 0);
                                const categoryIcons = {
                                    experience: '💼',
                                    projects: '🚀',
                                    clients: '👥',
                                    skills: '🛠️',
                                    achievements: '🏆',
                                    social: '🌐'
                                };
                                const categoryColors = {
                                    experience: 'text-blue-600 bg-blue-100',
                                    projects: 'text-purple-600 bg-purple-100',
                                    clients: 'text-orange-600 bg-orange-100',
                                    skills: 'text-green-600 bg-green-100',
                                    achievements: 'text-yellow-600 bg-yellow-100',
                                    social: 'text-pink-600 bg-pink-100'
                                };
                                
                                return (
                                    <div key={category} className="text-center p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
                                        <div className={`w-12 h-12 ${categoryColors[category]} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                                            <span className="text-xl">{categoryIcons[category]}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-1 capitalize">{category}</p>
                                        <p className={`text-lg font-bold ${categoryColors[category].split(' ')[0]}`}>
                                            {categoryStats.length > 0 ? totalValue : 0}
                                        </p>
                                        <p className="text-xs text-gray-500">{categoryStats.length} metrics</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Table */}
            <div className="admin-card">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-primary mb-2">Stats Overview</h3>
                    <p className="text-gray-600">Manage and track your professional achievements</p>
                </div>
                <Table
                    columns={statsColumns}
                    dataSource={fields}
                    rowKey="_id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} stats`,
                        className: "admin-pagination"
                    }}
                    className="admin-table"
                />
            </div>

            {/* Empty State */}
            {fields.length === 0 && (
                <div className="admin-card text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">📊</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Professional Stats</h3>
                    <p className="text-gray-500 mb-6">Start showcasing your achievements by adding professional statistics</p>
                    <div className="flex justify-center space-x-4">
                        <button
                            className="admin-btn-secondary"
                            onClick={addSampleStats}
                        >
                            <span className="flex items-center space-x-2">
                                <span>🎯</span>
                                <span>Add Sample Stats</span>
                            </span>
                        </button>
                        <button
                            className="admin-btn-primary"
                            onClick={() => setShowAddModal(true)}
                        >
                            <span className="flex items-center space-x-2">
                                <span>🚀</span>
                                <span>Add Custom Stat</span>
                            </span>
                        </button>
                    </div>
                </div>
            )}
            {/* Add Modal */}
            <Modal
                open={showAddModal}
                title={
                    <div className="flex items-center space-x-3 p-2">
                        <div className="admin-icon w-8 h-8">
                            <span className="text-sm">➕</span>
                        </div>
                        <span className="text-lg font-bold text-primary">Add New Professional Stat</span>
                    </div>
                }
                footer={null}
                onCancel={() => {
                    setShowAddModal(false);
                    addForm.resetFields();
                }}
                width={600}
                className="custom-modal"
            >
                <div className="admin-form mt-6">
                    <Form
                        form={addForm}
                        layout="vertical"
                        onFinish={onAdd}
                    >
                        <Form.Item
                            label="Stat Name"
                            name="name"
                            rules={[{ required: true, message: "Please enter stat name" }]}
                            className="mb-4"
                        >
                            <input 
                                placeholder="e.g., Years of Experience, Projects Completed, Happy Clients"
                                className="admin-input"
                            />
                        </Form.Item>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item
                                label="Value"
                                name="value"
                                rules={[{ required: true, message: "Please enter value" }]}
                                className="mb-4"
                            >
                                <InputNumber 
                                    style={{ width: '100%' }} 
                                    placeholder="e.g., 5, 120, 1000"
                                    min={0}
                                    className="admin-input-number"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Unit (Optional)"
                                name="unit"
                                className="mb-4"
                            >
                                <input 
                                    placeholder="e.g., +, Years, K, %, $"
                                    className="admin-input"
                                />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item
                                label="Category"
                                name="category"
                                rules={[{ required: true, message: "Please select category" }]}
                                className="mb-4"
                            >
                                <Select 
                                    placeholder="Select category"
                                    className="admin-select"
                                    initialValue="experience"
                                >
                                    <Option value="experience">Experience</Option>
                                    <Option value="projects">Projects</Option>
                                    <Option value="clients">Clients</Option>
                                    <Option value="skills">Skills</Option>
                                    <Option value="achievements">Achievements</Option>
                                    <Option value="social">Social Media</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Type"
                                name="type"
                                rules={[{ required: true, message: "Please select type" }]}
                                className="mb-4"
                            >
                                <Select 
                                    placeholder="Select type"
                                    className="admin-select"
                                    initialValue="static"
                                >
                                    <Option value="static">Manual Entry</Option>
                                    <Option value="dynamic">Auto-calculated</Option>
                                </Select>
                            </Form.Item>
                        </div>

                        <Form.Item
                            label="Display on Portfolio"
                            name="enabled"
                            valuePropName="checked"
                            className="mb-6"
                            initialValue={true}
                        >
                            <Switch />
                        </Form.Item>

                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                className="admin-btn-secondary"
                                onClick={() => {
                                    setShowAddModal(false);
                                    addForm.resetFields();
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
                                    <span>➕</span>
                                    <span>Add Stat</span>
                                </span>
                            </button>
                        </div>
                    </Form>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                open={showEditModal}
                title={
                    <div className="flex items-center space-x-3 p-2">
                        <div className="admin-icon w-8 h-8">
                            <span className="text-sm">✏️</span>
                        </div>
                        <span className="text-lg font-bold text-primary">Edit Professional Stat</span>
                    </div>
                }
                footer={null}
                onCancel={() => {
                    setShowEditModal(false);
                    setSelectedField(null);
                    editForm.resetFields();
                }}
                width={600}
                className="custom-modal"
            >
                <div className="admin-form mt-6">
                    <Form
                        form={editForm}
                        layout="vertical"
                        onFinish={onUpdate}
                    >
                        <Form.Item
                            label="Stat Name"
                            name="name"
                            rules={[{ required: true, message: "Please enter stat name" }]}
                            className="mb-4"
                        >
                            <input 
                                placeholder="e.g., Years of Experience, Projects Completed, Happy Clients"
                                className="admin-input"
                            />
                        </Form.Item>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item
                                label="Value"
                                name="value"
                                rules={[{ required: true, message: "Please enter value" }]}
                                className="mb-4"
                            >
                                <InputNumber 
                                    style={{ width: '100%' }} 
                                    placeholder="e.g., 5, 120, 1000"
                                    min={0}
                                    className="admin-input-number"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Unit (Optional)"
                                name="unit"
                                className="mb-4"
                            >
                                <input 
                                    placeholder="e.g., +, Years, K, %, $"
                                    className="admin-input"
                                />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item
                                label="Category"
                                name="category"
                                rules={[{ required: true, message: "Please select category" }]}
                                className="mb-4"
                            >
                                <Select 
                                    placeholder="Select category"
                                    className="admin-select"
                                >
                                    <Option value="experience">Experience</Option>
                                    <Option value="projects">Projects</Option>
                                    <Option value="clients">Clients</Option>
                                    <Option value="skills">Skills</Option>
                                    <Option value="achievements">Achievements</Option>
                                    <Option value="social">Social Media</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Type"
                                name="type"
                                rules={[{ required: true, message: "Please select type" }]}
                                className="mb-4"
                            >
                                <Select 
                                    placeholder="Select type"
                                    className="admin-select"
                                >
                                    <Option value="static">Manual Entry</Option>
                                    <Option value="dynamic">Auto-calculated</Option>
                                </Select>
                            </Form.Item>
                        </div>

                        <Form.Item
                            label="Display on Portfolio"
                            name="enabled"
                            valuePropName="checked"
                            className="mb-6"
                        >
                            <Switch />
                        </Form.Item>

                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                className="admin-btn-secondary"
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedField(null);
                                    editForm.resetFields();
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
                                    <span>💾</span>
                                    <span>Update Stat</span>
                                </span>
                            </button>
                        </div>
                    </Form>
                </div>
            </Modal>
        </div>
    );
}

export default AdminSocialStats;
