import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Modal, Tooltip, message } from 'antd';
import { EyeOutlined, DeleteOutlined, MailOutlined, CheckOutlined, InboxOutlined } from '@ant-design/icons';

function ContactMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [stats, setStats] = useState({});

    // Fetch messages
    const fetchMessages = async (page = 1, pageSize = 10, status = '') => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: pageSize.toString(),
                ...(status && { status })
            });

            const response = await fetch(`/api/contact/messages?${params}`);
            const data = await response.json();

            if (data.success) {
                setMessages(data.data.messages);
                setPagination({
                    current: data.data.pagination.currentPage,
                    pageSize: pageSize,
                    total: data.data.pagination.totalMessages
                });
            }
        } catch (error) {
            message.error('Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    };

    // Fetch statistics
    const fetchStats = async () => {
        try {
            const response = await fetch('/api/contact/stats');
            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    // Update message status
    const updateMessageStatus = async (id, status) => {
        try {
            const response = await fetch(`/api/contact/messages/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status })
            });

            const data = await response.json();
            if (data.success) {
                message.success('Status updated successfully');
                fetchMessages(pagination.current, pagination.pageSize);
                fetchStats();
            }
        } catch (error) {
            message.error('Failed to update status');
        }
    };

    // Delete message
    const deleteMessage = async (id) => {
        Modal.confirm({
            title: 'Delete Message',
            content: 'Are you sure you want to delete this message? This action cannot be undone.',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    const response = await fetch(`/api/contact/messages/${id}`, {
                        method: 'DELETE'
                    });

                    const data = await response.json();
                    if (data.success) {
                        message.success('Message deleted successfully');
                        fetchMessages(pagination.current, pagination.pageSize);
                        fetchStats();
                    }
                } catch (error) {
                    message.error('Failed to delete message');
                }
            }
        });
    };

    // View message details
    const viewMessage = (record) => {
        setSelectedMessage(record);
        setViewModalVisible(true);
        if (record.status === 'new') {
            updateMessageStatus(record._id, 'read');
        }
    };

    useEffect(() => {
        fetchMessages();
        fetchStats();
    }, []);

    const getStatusColor = (status) => {
        const colors = {
            new: 'blue',
            read: 'orange',
            replied: 'green',
            archived: 'gray'
        };
        return colors[status] || 'default';
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 150,
            ellipsis: true
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
            ellipsis: true
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
            ellipsis: true
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {status.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 200,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="View Message">
                        <Button
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => viewMessage(record)}
                        />
                    </Tooltip>
                    {record.status === 'new' && (
                        <Tooltip title="Mark as Read">
                            <Button
                                icon={<MailOutlined />}
                                size="small"
                                onClick={() => updateMessageStatus(record._id, 'read')}
                            />
                        </Tooltip>
                    )}
                    {record.status !== 'replied' && (
                        <Tooltip title="Mark as Replied">
                            <Button
                                icon={<CheckOutlined />}
                                size="small"
                                type="primary"
                                onClick={() => updateMessageStatus(record._id, 'replied')}
                            />
                        </Tooltip>
                    )}
                    <Tooltip title="Archive">
                        <Button
                            icon={<InboxOutlined />}
                            size="small"
                            onClick={() => updateMessageStatus(record._id, 'archived')}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            onClick={() => deleteMessage(record._id)}
                        />
                    </Tooltip>
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
                            <span className="text-xl">💬</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-primary">Contact Messages</h3>
                            <p className="text-gray-600">Manage and respond to contact inquiries</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            className="admin-btn-secondary"
                            onClick={() => fetchMessages()}
                        >
                            <span className="flex items-center space-x-2">
                                <span>🔄</span>
                                <span>Refresh</span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Enhanced Statistics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Messages Card */}
                <div className="admin-card text-center group hover:scale-105 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                            <span className="text-white text-2xl">📧</span>
                        </div>
                        <h3 className="text-sm text-gray-600 mb-2 font-medium">Total Messages</h3>
                        <p className="text-3xl font-bold text-blue-600 mb-2">{stats.total || 0}</p>
                        <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                            <span>📈</span>
                            <span>All time</span>
                        </div>
                    </div>
                </div>
                
                {/* New Messages Card */}
                <div className="admin-card text-center group hover:scale-105 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                            <span className="text-white text-2xl">🆕</span>
                        </div>
                        <h3 className="text-sm text-gray-600 mb-2 font-medium">New Messages</h3>
                        <p className="text-3xl font-bold text-green-600 mb-2">{stats.byStatus?.new || 0}</p>
                        <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                            <span>⏰</span>
                            <span>Needs attention</span>
                        </div>
                        {stats.byStatus?.new > 0 && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">{stats.byStatus?.new}</span>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Today's Messages Card */}
                <div className="admin-card text-center group hover:scale-105 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/10"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                            <span className="text-white text-2xl">📅</span>
                        </div>
                        <h3 className="text-sm text-gray-600 mb-2 font-medium">Today's Messages</h3>
                        <p className="text-3xl font-bold text-orange-600 mb-2">{stats.today || 0}</p>
                        <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                            <span>🌅</span>
                            <span>Last 24 hours</span>
                        </div>
                    </div>
                </div>
                
                {/* Replied Messages Card */}
                <div className="admin-card text-center group hover:scale-105 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                            <span className="text-white text-2xl">✅</span>
                        </div>
                        <h3 className="text-sm text-gray-600 mb-2 font-medium">Replied</h3>
                        <p className="text-3xl font-bold text-purple-600 mb-2">{stats.byStatus?.replied || 0}</p>
                        <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                            <span>💬</span>
                            <span>Responses sent</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="admin-card">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-2">Messages Overview</h3>
                        <p className="text-gray-600">Manage and respond to contact inquiries from your portfolio</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            className="admin-btn-secondary text-sm"
                            onClick={() => fetchMessages()}
                        >
                            <span className="flex items-center space-x-2">
                                <span>🔄</span>
                                <span>Refresh</span>
                            </span>
                        </button>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Live updates</span>
                        </div>
                    </div>
                </div>

                {/* Response Time Analytics */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {stats.byStatus?.replied ? Math.round((stats.byStatus.replied / stats.total) * 100) : 0}%
                            </div>
                            <div className="text-sm text-gray-600">Response Rate</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {stats.averageResponseTime || '< 24h'}
                            </div>
                            <div className="text-sm text-gray-600">Avg Response Time</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                {stats.byStatus?.pending || 0}
                            </div>
                            <div className="text-sm text-gray-600">Pending Replies</div>
                        </div>
                    </div>
                </div>
                <Table
                    columns={columns}
                    dataSource={messages}
                    loading={loading}
                    pagination={{
                        ...pagination,
                        onChange: (page, pageSize) => {
                            fetchMessages(page, pageSize);
                        },
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} messages`,
                        className: "admin-pagination"
                    }}
                    rowKey="_id"
                    size="small"
                    className="admin-table"
                />
            </div>

            {/* Empty State */}
            {messages.length === 0 && !loading && (
                <div className="admin-card text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">📭</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Messages Yet</h3>
                    <p className="text-gray-500 mb-6">Contact messages from your portfolio will appear here</p>
                    <button
                        className="admin-btn-primary"
                        onClick={() => fetchMessages()}
                    >
                        <span className="flex items-center space-x-2">
                            <span>🔄</span>
                            <span>Refresh Messages</span>
                        </span>
                    </button>
                </div>
            )}

            {/* View Message Modal */}
            <Modal
                title="Message Details"
                open={viewModalVisible}
                onCancel={() => setViewModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setViewModalVisible(false)}>
                        Close
                    </Button>,
                    selectedMessage && selectedMessage.status !== 'replied' && (
                        <Button
                            key="reply"
                            type="primary"
                            onClick={() => {
                                updateMessageStatus(selectedMessage._id, 'replied');
                                setViewModalVisible(false);
                            }}
                        >
                            Mark as Replied
                        </Button>
                    )
                ]}
                width={700}
            >
                {selectedMessage && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <strong>Name:</strong>
                                <p>{selectedMessage.name}</p>
                            </div>
                            <div>
                                <strong>Email:</strong>
                                <p>
                                    <a href={`mailto:${selectedMessage.email}`}>
                                        {selectedMessage.email}
                                    </a>
                                </p>
                            </div>
                        </div>
                        <div>
                            <strong>Subject:</strong>
                            <p>{selectedMessage.subject}</p>
                        </div>
                        <div>
                            <strong>Message:</strong>
                            <div className="bg-gray-50 p-4 rounded border">
                                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                                <strong>Status:</strong>
                                <Tag color={getStatusColor(selectedMessage.status)} className="ml-2">
                                    {selectedMessage.status.toUpperCase()}
                                </Tag>
                            </div>
                            <div>
                                <strong>Received:</strong>
                                <p>{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default ContactMessages;
