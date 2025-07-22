
import React, { useState } from 'react';
import {Form, message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {HideLoading, ShowLoading} from "../../redux/rootSlice";
import axios from "axios";
import FancyAdminField from "../../components/FancyAdminField";

function AdminContact() {
    const dispatch = useDispatch();
    const {portfolioData} = useSelector((state) => state.root);
    const [contactData, setContactData] = useState({
      name: portfolioData?.contacts?.name || '',
      age: portfolioData?.contacts?.age || '',
      gender: portfolioData?.contacts?.gender || '',
      email: portfolioData?.contacts?.email || '',
      mobile: portfolioData?.contacts?.mobile || '',
      address: portfolioData?.contacts?.address || '',
      lottieURL: portfolioData?.contacts?.lottieURL || '',
    });

    const handleFieldChange = (field, value) => {
      setContactData(prev => ({ ...prev, [field]: value }));
    };

    const onFinish = async () => {
        try {
            dispatch(ShowLoading())
            const response = await axios.post('/api/portfolio/update-contacts', {
                ...contactData,
                _id: portfolioData.contacts._id
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
                        <span className="text-xl">📧</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-primary">Contact Information</h3>
                        <p className="text-gray-600">Manage your contact details and personal information</p>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="admin-card admin-form">
                <Form onFinish={onFinish} layout="vertical">
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-primary mb-4 flex items-center space-x-2">
                      <span className="w-6 h-6 bg-gradient-to-r from-secondary to-tertiary rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">👤</span>
                      </span>
                      <span>Personal Information</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <FancyAdminField
                        icon={<span>👤</span>}
                        title="Full Name"
                        value={contactData.name}
                        onChange={e => handleFieldChange('name', e.target.value)}
                        placeholder="Enter your full name..."
                        checked={!!contactData.name}
                        proTip="Your complete name as it will appear on your contact card."
                      />
                      <FancyAdminField
                        icon={<span>🎂</span>}
                        title="Age"
                        value={contactData.age}
                        onChange={e => handleFieldChange('age', e.target.value)}
                        placeholder="Enter your age..."
                        checked={!!contactData.age}
                        proTip="Your age (optional)."
                        type="number"
                      />
                      <FancyAdminField
                        icon={<span>🚻</span>}
                        title="Gender"
                        value={contactData.gender}
                        onChange={e => handleFieldChange('gender', e.target.value)}
                        placeholder="Enter your gender..."
                        checked={!!contactData.gender}
                        proTip="Gender (optional)."
                      />
                    </div>
                  </div>
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-primary mb-4 flex items-center space-x-2">
                      <span className="w-6 h-6 bg-gradient-to-r from-tertiary to-accent rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">📱</span>
                      </span>
                      <span>Contact Details</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FancyAdminField
                        icon={<span>📧</span>}
                        title="Email Address"
                        value={contactData.email}
                        onChange={e => handleFieldChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        checked={!!contactData.email}
                        proTip="Professional email for contact."
                        type="email"
                      />
                      <FancyAdminField
                        icon={<span>📞</span>}
                        title="Mobile Number"
                        value={contactData.mobile}
                        onChange={e => handleFieldChange('mobile', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        checked={!!contactData.mobile}
                        proTip="Include country code if international."
                        type="tel"
                      />
                    </div>
                  </div>
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-primary mb-4 flex items-center space-x-2">
                      <span className="w-6 h-6 bg-gradient-to-r from-accent to-secondary rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">🌍</span>
                      </span>
                      <span>Location & Media</span>
                    </h4>
                    <div className="space-y-6">
                      <FancyAdminField
                        icon={<span>🏠</span>}
                        title="Address / Location"
                        value={contactData.address}
                        onChange={e => handleFieldChange('address', e.target.value)}
                        placeholder="City, State, Country"
                        checked={!!contactData.address}
                        proTip="General location (city/state/country)."
                      />
                      <FancyAdminField
                        icon={<span>🎨</span>}
                        title="Lottie Animation URL"
                        value={contactData.lottieURL}
                        onChange={e => handleFieldChange('lottieURL', e.target.value)}
                        placeholder="https://assets.lottiefiles.com/packages/..."
                        checked={!!contactData.lottieURL}
                        proTip={<span>Animated illustration for contact section - browse at <a href="https://lottiefiles.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-tertiary ml-1">lottiefiles.com</a></span>}
                      />
                    </div>
                  </div>
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

            {/* Contact Preview Card */}
            <div className="admin-card">
                <h4 className="text-lg font-semibold text-primary mb-4 flex items-center space-x-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-tertiary to-secondary rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">👁️</span>
                    </span>
                    <span>Contact Card Preview</span>
                </h4>
                
                <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-6">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-secondary to-tertiary rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                                {portfolioData.contacts?.name?.charAt(0) || 'U'}
                            </span>
                        </div>
                        <div>
                            <h5 className="font-semibold text-primary">{portfolioData.contacts?.name || 'Your Name'}</h5>
                            <p className="text-gray-600 text-sm">{portfolioData.contacts?.email || 'your.email@example.com'}</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                            <span className="text-secondary">📞</span>
                            <span>{portfolioData.contacts?.mobile || 'Phone number'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-tertiary">🌍</span>
                            <span>{portfolioData.contacts?.address || 'Location'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-accent">👤</span>
                            <span>{portfolioData.contacts?.age || 'Age'} • {portfolioData.contacts?.gender || 'Gender'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminContact