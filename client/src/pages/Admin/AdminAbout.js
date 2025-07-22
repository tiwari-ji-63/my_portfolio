
import React, { useState } from 'react';
import {Form, message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {HideLoading, ShowLoading} from "../../redux/rootSlice";
import axios from "axios";
import FancyAdminField from "../../components/FancyAdminField";

function AdminAbout() {
    const dispatch = useDispatch();
    const {portfolioData} = useSelector((state) => state.root);
    const [aboutData, setAboutData] = useState({
      lottieURL: portfolioData?.about?.lottieURL || '',
      description1: portfolioData?.about?.description1 || '',
      description2: portfolioData?.about?.description2 || '',
      message: portfolioData?.about?.message || '',
      skills: Array.isArray(portfolioData?.about?.skills) ? portfolioData.about.skills.join(', ') : (portfolioData?.about?.skills || ''),
    });

    const handleFieldChange = (field, value) => {
      setAboutData(prev => ({ ...prev, [field]: value }));
    };

    const onFinish = async () => {
        try {
            const values = { ...aboutData };
            values.skills = values.skills.split(',').map(s => s.trim()).filter(Boolean);
            dispatch(ShowLoading())
            const response = await axios.post('/api/portfolio/update-about', {
                ...values,
                _id: portfolioData.about._id
            });
            dispatch(HideLoading())
            if (response.data.success) {
                message.success(response.data.message)
            } else {
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
                        <span className="text-xl">👤</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-primary">About Section</h3>
                        <p className="text-gray-600">Manage your personal story and background information</p>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="admin-card admin-form">
                <Form onFinish={onFinish} layout="vertical">
                  <div className="mb-6">
                    <FancyAdminField
                      icon={<span>🎬</span>}
                      title="Lottie Animation URL"
                      value={aboutData.lottieURL}
                      onChange={e => handleFieldChange('lottieURL', e.target.value)}
                      placeholder="Enter Lottie animation URL..."
                      checked={!!aboutData.lottieURL}
                      proTip="Use Lottie animations from lottiefiles.com for engaging visuals."
                      type="text"
                    />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <FancyAdminField
                      icon={<span>📝</span>}
                      title="Primary Description"
                      value={aboutData.description1}
                      onChange={e => handleFieldChange('description1', e.target.value)}
                      placeholder="Tell your story - who you are, what you do..."
                      checked={!!aboutData.description1}
                      proTip="Main introduction about yourself."
                      type="textarea"
                    />
                    <FancyAdminField
                      icon={<span>🎯</span>}
                      title="Secondary Description"
                      value={aboutData.description2}
                      onChange={e => handleFieldChange('description2', e.target.value)}
                      placeholder="Additional details about your background..."
                      checked={!!aboutData.description2}
                      proTip="Additional details and achievements."
                      type="textarea"
                    />
                  </div>
                  <div className="mb-6">
                    <FancyAdminField
                      icon={<span>💬</span>}
                      title="Personal Message"
                      value={aboutData.message}
                      onChange={e => handleFieldChange('message', e.target.value)}
                      placeholder="A personal message or motto that represents you..."
                      checked={!!aboutData.message}
                      proTip="A personal quote or message that defines you."
                      type="textarea"
                    />
                  </div>
                  <div className="mb-8">
                    <FancyAdminField
                      icon={<span>🛠️</span>}
                      title="Recently Working On (Skills)"
                      value={aboutData.skills}
                      onChange={e => handleFieldChange('skills', e.target.value)}
                      placeholder="React.js, Node.js, MongoDB, TypeScript..."
                      checked={!!aboutData.skills}
                      proTip="Separate skills with commas (,) - these will be displayed as tags."
                      type="textarea"
                    />
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

            {/* Help Section */}
            <div className="bg-gradient-to-r from-accent/5 to-tertiary/5 border border-accent/20 rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-accent text-sm">💡</span>
                    </div>
                    <div>
                        <h4 className="font-semibold text-primary mb-3">Content Guidelines</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                            <ul className="space-y-2">
                                <li className="flex items-start space-x-2">
                                    <span className="text-secondary mt-1">•</span>
                                    <span>Keep descriptions engaging and professional</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-secondary mt-1">•</span>
                                    <span>Use Lottie animations for visual appeal</span>
                                </li>
                            </ul>
                            <ul className="space-y-2">
                                <li className="flex items-start space-x-2">
                                    <span className="text-tertiary mt-1">•</span>
                                    <span>List current technologies you're working with</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-tertiary mt-1">•</span>
                                    <span>Personal message should reflect your values</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminAbout