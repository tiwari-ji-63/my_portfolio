
import React, { useState } from 'react';
import {Form, message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {HideLoading, ShowLoading} from "../../redux/rootSlice";
import axios from "axios";
import FancyAdminField from "../../components/FancyAdminField";

function AdminHeader() {
    const dispatch = useDispatch();
    const {portfolioData} = useSelector((state) => state.root);
    const [headerData, setHeaderData] = useState({
      firstLetter: portfolioData?.headers?.firstLetter || '',
      middleLetter: portfolioData?.headers?.middleLetter || '',
      lastLetter: portfolioData?.headers?.lastLetter || '',
    });

    const handleFieldChange = (field, value) => {
      setHeaderData(prev => ({ ...prev, [field]: value }));
    };

    const onFinish = async () => {
        try {
            dispatch(ShowLoading())
            const response = await axios.post('/api/portfolio/update-headers', {
                ...headerData,
                _id: portfolioData.headers._id
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
                        <span className="text-xl">🎨</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-primary">Header Management</h3>
                        <p className="text-gray-600">Customize your portfolio header letters and branding</p>
                    </div>
                </div>
            </div>

            {/* Preview Section */}
            <div className="admin-card">
                <div className="mb-6">
                    <h4 className="text-lg font-semibold text-primary mb-2">Header Preview</h4>
                    <p className="text-gray-600 mb-4">Preview how your header will look</p>
                </div>
                <div className="bg-gradient-to-r from-primary to-secondary p-8 rounded-xl text-center">
                    <div className="flex items-center justify-center space-x-2 text-4xl font-bold text-white">
                        <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                            {portfolioData.headers?.firstLetter || 'A'}
                        </span>
                        <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                            {portfolioData.headers?.middleLetter || 'B'}
                        </span>
                        <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                            {portfolioData.headers?.lastLetter || 'C'}
                        </span>
                    </div>
                    <p className="text-white/80 mt-4">Your portfolio header letters</p>
                </div>
            </div>

            {/* Form Section */}
            <div className="admin-card admin-form">
                <div className="mb-6">
                    <h4 className="text-lg font-semibold text-primary mb-2">Header Configuration</h4>
                    <p className="text-gray-600">Configure the letters that appear in your portfolio header</p>
                </div>
                
                <Form onFinish={onFinish} layout="vertical">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <FancyAdminField
                      icon={<span>🅰️</span>}
                      title="First Letter"
                      value={headerData.firstLetter}
                      onChange={e => handleFieldChange('firstLetter', e.target.value.slice(0, 1))}
                      placeholder="e.g., J"
                      checked={!!headerData.firstLetter}
                      proTip="First letter of your name or brand."
                      type="text"
                    />
                    <FancyAdminField
                      icon={<span>🅱️</span>}
                      title="Middle Letter"
                      value={headerData.middleLetter}
                      onChange={e => handleFieldChange('middleLetter', e.target.value.slice(0, 1))}
                      placeholder="e.g., S"
                      checked={!!headerData.middleLetter}
                      proTip="Middle letter or initial."
                      type="text"
                    />
                    <FancyAdminField
                      icon={<span>🅲️</span>}
                      title="Last Letter"
                      value={headerData.lastLetter}
                      onChange={e => handleFieldChange('lastLetter', e.target.value.slice(0, 1))}
                      placeholder="e.g., D"
                      checked={!!headerData.lastLetter}
                      proTip="Last letter of your name."
                      type="text"
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
                                <span>Save Header</span>
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
                        <h4 className="font-semibold text-primary mb-3">Header Tips</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                            <ul className="space-y-2">
                                <li className="flex items-start space-x-2">
                                    <span className="text-secondary mt-1">•</span>
                                    <span>Use initials of your name for personal branding</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-secondary mt-1">•</span>
                                    <span>Keep letters readable and professional</span>
                                </li>
                            </ul>
                            <ul className="space-y-2">
                                <li className="flex items-start space-x-2">
                                    <span className="text-tertiary mt-1">•</span>
                                    <span>Letters will be displayed prominently on your portfolio</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-tertiary mt-1">•</span>
                                    <span>Consider using company or brand initials</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminHeader
