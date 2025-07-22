import React from 'react'
import {Form, message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {HideLoading, ShowLoading} from "../../redux/rootSlice";
import axios from "axios";


function AdminLeftSider() {
    const dispatch = useDispatch();
    const {portfolioData} = useSelector((state) => state.root);
    const onFinish = async (values) => {
        try {
            dispatch(ShowLoading())
            const response = await axios.post('/api/portfolio/update-leftSides', {
                ...values,
                _id: portfolioData.leftSides._id
            });
            dispatch(HideLoading())
            if (response.data.success){
                message.success(response.data.message)
            }else {
                message.error(response.data.message)
            }
        } catch (error) {
            message.error(error.message)

        }
    };
    return (
        <div className="space-y-6 fade-in">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center space-x-4">
                    <div className="admin-icon">
                        <span className="text-xl">🔗</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-primary">Social Media Links</h3>
                        <p className="text-gray-600">Manage your contact information and social media profiles</p>
                    </div>
                </div>
            </div>

            {/* Preview Section */}
            <div className="admin-card">
                <div className="mb-6">
                    <h4 className="text-lg font-semibold text-primary mb-2">Contact Preview</h4>
                    <p className="text-gray-600 mb-4">Preview how your contact links will appear</p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-red-600 text-sm">📧</span>
                            </div>
                            <span className="text-sm text-gray-600 truncate">
                                {portfolioData.leftSides?.email?.replace('mailto:', '') || 'email@example.com'}
                            </span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-600 text-sm">📱</span>
                            </div>
                            <span className="text-sm text-gray-600 truncate">
                                {portfolioData.leftSides?.phone?.replace('tel:', '') || '+91-1234567890'}
                            </span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 text-sm">🐙</span>
                            </div>
                            <span className="text-sm text-gray-600 truncate">GitHub</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 text-sm">💼</span>
                            </div>
                            <span className="text-sm text-gray-600 truncate">LinkedIn</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="admin-card admin-form">
                <div className="mb-6">
                    <h4 className="text-lg font-semibold text-primary mb-2">Contact Configuration</h4>
                    <p className="text-gray-600">Update your contact information and social media links</p>
                </div>
                
                <Form onFinish={onFinish} layout="vertical" initialValues={portfolioData.leftSides}>
                    {/* Contact Information */}
                    <div className="mb-8">
                        <h5 className="text-md font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                            <span>📞</span>
                            <span>Contact Information</span>
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Form.Item name="email" label="Email Address" className="mb-4">
                                    <div className="admin-input-group">
                                        <div className="admin-input-prefix">
                                            <span>📧</span>
                                        </div>
                                        <input 
                                            placeholder="example@domain.com"
                                            className="admin-input pl-12"
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">💡 Enter email without 'mailto:' prefix</p>
                                </Form.Item>
                            </div>
                            
                            <div className="space-y-2">
                                <Form.Item name="phone" label="Phone Number" className="mb-4">
                                    <div className="admin-input-group">
                                        <div className="admin-input-prefix">
                                            <span>📱</span>
                                        </div>
                                        <input 
                                            placeholder="tel:+91-1234567890"
                                            className="admin-input pl-12"
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">📞 Include 'tel:+91' followed by your number</p>
                                </Form.Item>
                            </div>
                        </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="mb-8">
                        <h5 className="text-md font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                            <span>🌐</span>
                            <span>Social Media Profiles</span>
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Form.Item name="github" label="GitHub Profile" className="mb-4">
                                    <div className="admin-input-group">
                                        <div className="admin-input-prefix">
                                            <span>🐙</span>
                                        </div>
                                        <input 
                                            placeholder="https://github.com/username"
                                            className="admin-input pl-12"
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">🔗 Include full GitHub profile URL with https://</p>
                                </Form.Item>
                            </div>
                            
                            <div className="space-y-2">
                                <Form.Item name="linkedin" label="LinkedIn Profile" className="mb-4">
                                    <div className="admin-input-group">
                                        <div className="admin-input-prefix">
                                            <span>💼</span>
                                        </div>
                                        <input 
                                            placeholder="https://linkedin.com/in/username"
                                            className="admin-input pl-12"
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">🔗 Include full LinkedIn profile URL with https://</p>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            className="admin-btn-secondary"
                            onClick={() => window.location.reload()}
                        >
                            <span className="flex items-center space-x-2">
                                <span>🔄</span>
                                <span>Reset</span>
                            </span>
                        </button>
                        <button
                            type="submit"
                            className="admin-btn-primary"
                        >
                            <span className="flex items-center space-x-2">
                                <span>💾</span>
                                <span>Save Links</span>
                            </span>
                        </button>
                    </div>
                </Form>
            </div>

            {/* Help Section */}
            <div className="bg-gradient-to-r from-accent/5 to-tertiary/5 border border-accent/20 rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-accent text-sm">💡</span>
                    </div>
                    <div>
                        <h4 className="font-semibold text-primary mb-3">Link Guidelines</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                            <ul className="space-y-2">
                                <li className="flex items-start space-x-2">
                                    <span className="text-secondary mt-1">•</span>
                                    <span>Use professional email address for business contacts</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-secondary mt-1">•</span>
                                    <span>Include country code in phone number format</span>
                                </li>
                            </ul>
                            <ul className="space-y-2">
                                <li className="flex items-start space-x-2">
                                    <span className="text-tertiary mt-1">•</span>
                                    <span>Ensure all social media profiles are public and professional</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-tertiary mt-1">•</span>
                                    <span>Test all links to ensure they work correctly</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminLeftSider
