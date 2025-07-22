
import React, { useState } from 'react';
import {Form, message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {HideLoading, ShowLoading} from "../../redux/rootSlice";
import axios from "axios";
import FancyAdminField from "../../components/FancyAdminField";

function AdminFooter() {
    const dispatch = useDispatch();
    const {portfolioData} = useSelector((state) => state.root);
    const [footerData, setFooterData] = useState({
      firstLine: portfolioData?.footer?.firstLine || '',
      secondLine: portfolioData?.footer?.secondLine || '',
    });

    const handleFieldChange = (field, value) => {
      setFooterData(prev => ({ ...prev, [field]: value }));
    };

    const onFinish = async () => {
        try {
            dispatch(ShowLoading())
            const response = await axios.post('/api/portfolio/update-footer', {
                ...footerData,
                _id: portfolioData.footer._id
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
                        <span className="text-xl">📋</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-primary">Footer Management</h3>
                        <p className="text-gray-600">Customize your website footer content and copyright information</p>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="admin-card admin-form">
                <Form onFinish={onFinish} layout="vertical">
                  <div className="space-y-6">
                    <FancyAdminField
                      icon={<span>📝</span>}
                      title="Primary Footer Text"
                      value={footerData.firstLine}
                      onChange={e => handleFieldChange('firstLine', e.target.value)}
                      placeholder="e.g., Designed and Developed by [Your Name]"
                      checked={!!footerData.firstLine}
                      proTip="Main footer message or attribution."
                    />
                    <FancyAdminField
                      icon={<span>©️</span>}
                      title="Secondary Footer Text"
                      value={footerData.secondLine}
                      onChange={e => handleFieldChange('secondLine', e.target.value)}
                      placeholder="e.g., © 2025 All rights reserved"
                      checked={!!footerData.secondLine}
                      proTip="Copyright notice or additional information."
                    />
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
                                <span>Save Changes</span>
                            </span>
                        </button>
                    </div>
                </Form>
            </div>

            {/* Footer Preview */}
            <div className="admin-card">
                <h4 className="text-lg font-semibold text-primary mb-4 flex items-center space-x-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-tertiary to-secondary rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">👁️</span>
                    </span>
                    <span>Footer Preview</span>
                </h4>
                
                <div className="bg-gradient-to-r from-primary to-primary/90 text-white p-8 rounded-xl">
                    <div className="text-center space-y-2">
                        <p className="text-white/90">
                            {portfolioData.footer?.firstLine || 'Primary footer text will appear here'}
                        </p>
                        <p className="text-white/70 text-sm">
                            {portfolioData.footer?.secondLine || 'Secondary footer text will appear here'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tips Section */}
            <div className="bg-gradient-to-r from-accent/5 to-tertiary/5 border border-accent/20 rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-accent text-sm">💡</span>
                    </div>
                    <div>
                        <h4 className="font-semibold text-primary mb-3">Footer Content Tips</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                            <ul className="space-y-2">
                                <li className="flex items-start space-x-2">
                                    <span className="text-secondary mt-1">•</span>
                                    <span>Include your name and portfolio attribution</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-secondary mt-1">•</span>
                                    <span>Add current year for copyright notice</span>
                                </li>
                            </ul>
                            <ul className="space-y-2">
                                <li className="flex items-start space-x-2">
                                    <span className="text-tertiary mt-1">•</span>
                                    <span>Keep text concise and professional</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-tertiary mt-1">•</span>
                                    <span>Consider adding "Made with ❤️" for personal touch</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminFooter
