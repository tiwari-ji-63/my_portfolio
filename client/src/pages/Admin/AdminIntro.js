import React, { useState, useCallback } from 'react'
import {Form, message, Modal} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {HideLoading, ShowLoading} from "../../redux/rootSlice";
import axios from "axios";
import ImageUploader from "../../components/ImageUploader";
import DocumentUploader from "../../components/DocumentUploader";

import AnimatedJobTitle from "../../components/AnimatedJobTitle";
import FancyAdminField from "../../components/FancyAdminField";

function AdminIntro() {
    const dispatch = useDispatch();
    const {portfolioData} = useSelector((state) => state.root);
    const [profileImage, setProfileImage] = useState(portfolioData?.introduction?.profileImage || null);
    const [resumeFile, setResumeFile] = useState(portfolioData?.introduction?.myResume || null);
    const [isPreviewModal, setIsPreviewModal] = useState(false);
    const [previewData, setPreviewData] = useState({
        welcomeText: portfolioData?.introduction?.welcomeText || '',
        jobTitle: Array.isArray(portfolioData?.introduction?.jobTitle) 
            ? portfolioData.introduction.jobTitle 
            : (portfolioData?.introduction?.jobTitle || '').split(',').map(title => title.trim()).filter(title => title),
        firstName: portfolioData?.introduction?.firstName || '',
        lastName: portfolioData?.introduction?.lastName || '',
        description: portfolioData?.introduction?.description || ''
    });

    // Real-time field update handler
    const handleFieldChange = useCallback((field, value) => {
        if (field === 'jobTitle') {
            // Convert comma-separated string to array for job titles
            const jobTitlesArray = value.split(',').map(title => title.trim()).filter(title => title);
            setPreviewData(prev => ({
                ...prev,
                [field]: jobTitlesArray
            }));
        } else {
            setPreviewData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    }, []);

    // Screenshot capture function

    
    // Always use previewData for submission, not AntD form values
    const onFinish = async () => {
        try {
            const formData = {
                ...previewData,
                jobTitle: Array.isArray(previewData.jobTitle)
                    ? previewData.jobTitle
                    : (typeof previewData.jobTitle === 'string' ? previewData.jobTitle.split(',').map(t => t.trim()).filter(Boolean) : []),
                profileImage: profileImage,
                myResume: resumeFile?.data || resumeFile
            };
            dispatch(ShowLoading())
            const response = await axios.post('/api/portfolio/update-introduction', {
                ...formData,
                _id: portfolioData.introduction._id
            });
            dispatch(HideLoading())
            if (response.data.success){
                message.success(response.data.message)
            }else {
                message.error(response.data.message)
            }
        } catch (error) {
            dispatch(HideLoading())
            message.error(error.message)
        }
    }

    return (
        <div>
            <Form 
                onFinish={onFinish} 
                layout="vertical" 
                className="admin-form"
            >
                <div className="admin-card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
                        <h3 className="text-xl font-semibold text-primary">📝 Introduction</h3>
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-primary/20 to-transparent"></div>
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
                            ✨ Active Section
                        </span>
                    </div>
                    
                    {/* Current Profile Overview */}
                    <div className="admin-card mb-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 relative overflow-hidden">
                        {/* Decorative corner accent */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 rounded-bl-full"></div>
                        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        
                        <div className="mb-6 relative">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                                    <span className="text-white text-sm font-bold">👤</span>
                                </div>
                                <h4 className="text-lg font-semibold text-primary">🎯 Current Profile</h4>
                                <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full border border-green-200">
                                    📊 Live Preview
                                </div>
                            </div>
                            <p className="text-gray-600 ml-11">✨ Live preview of your introduction section</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-primary/8 via-secondary/8 to-tertiary/8 p-6 rounded-2xl border-2 border-blue-200/50 shadow-lg relative overflow-hidden">
                            {/* Decorative background elements */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>
                            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-sm"></div>
                            <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-sm"></div>
                            
                            <div className="flex items-start space-x-6 relative">
                                {/* Profile Image Preview */}
                                <div className="flex-shrink-0">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-gray-100 to-gray-200 ring-2 ring-blue-200/50">
                                            {profileImage || portfolioData?.introduction?.profileImage ? (
                                                <img 
                                                    src={profileImage || portfolioData?.introduction?.profileImage} 
                                                    alt="Profile" 
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <span className="text-3xl">👤</span>
                                                </div>
                                            )}
                                        </div>
                                        {/* Status indicator */}
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                            <span className="text-white text-xs">✓</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Profile Info */}
                                <div className="flex-1 min-w-0 relative">
                                    <div className="mb-4 relative">
                                        <div className="absolute -left-3 top-0 w-1 h-full bg-gradient-to-b from-blue-400 to-indigo-500 rounded-full"></div>
                                        <h3 className="text-2xl font-bold text-primary mb-1 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                            {previewData.firstName || 'First'} {previewData.lastName || 'Last'}
                                        </h3>
                                        <div className="mb-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200/50 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-500"></div>
                                            <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                                                    <span className="text-white text-sm">💼</span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-purple-600 font-medium uppercase tracking-wide mb-1">Professional Title</p>
                                                    <div className="text-lg text-purple-800 font-bold">
                                                        <AnimatedJobTitle 
                                                            jobTitles={previewData.jobTitle}
                                                            className="text-lg text-purple-800 font-bold"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                                                    ✨ Featured
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 p-3 bg-white/60 rounded-xl border border-blue-100 relative">
                                            <div className="absolute top-2 left-2 w-1 h-1 bg-blue-400 rounded-full"></div>
                                            <p className="text-gray-600 italic pl-3">
                                                "{previewData.welcomeText || 'Welcome text will appear here...'}"
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Quick Stats */}
                                    <div className="flex flex-wrap gap-3">
                                        <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm border-2 ${
                                            (profileImage || portfolioData?.introduction?.profileImage) 
                                                ? 'bg-green-50 text-green-700 border-green-200' 
                                                : 'bg-orange-50 text-orange-700 border-orange-200'
                                        }`}>
                                            <span className={`w-2 h-2 rounded-full ${
                                                (profileImage || portfolioData?.introduction?.profileImage) 
                                                    ? 'bg-green-500' 
                                                    : 'bg-orange-500'
                                            }`}></span>
                                            📸 Profile {(profileImage || portfolioData?.introduction?.profileImage) ? 'Added' : 'Missing'}
                                        </div>
                                        <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm border-2 ${
                                            (resumeFile || portfolioData?.introduction?.myResume) 
                                                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                                : 'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                            <span className={`w-2 h-2 rounded-full ${
                                                (resumeFile || portfolioData?.introduction?.myResume) 
                                                    ? 'bg-blue-500' 
                                                    : 'bg-red-500'
                                            }`}></span>
                                            📄 Resume {(resumeFile || portfolioData?.introduction?.myResume) ? 'Added' : 'Missing'}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Action Buttons */}
                                {/* Action buttons removed as requested */}
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      <FancyAdminField
                        icon={<span>👋</span>}
                        title="Welcome Text"
                        value={previewData.welcomeText}
                        onChange={e => { handleFieldChange('welcomeText', e.target.value); }}
                        placeholder="Enter welcome text..."
                        checked={!!previewData.welcomeText}
                        proTip={
                          <>
                            <span className="font-semibold">This text appears above your name and job titles.</span><br/>
                            Keep it short and welcoming!
                          </>
                        }
                      />
                      <FancyAdminField
                        icon={<span>💼</span>}
                        title="Job Titles"
                        badge="Featured"
                        value={Array.isArray(previewData.jobTitle) ? previewData.jobTitle.join(', ') : previewData.jobTitle}
                        onChange={e => { handleFieldChange('jobTitle', e.target.value); }}
                        placeholder="e.g., Full Stack Developer, UI/UX Designer, Problem Solver"
                        checked={!!(Array.isArray(previewData.jobTitle) ? previewData.jobTitle.length : previewData.jobTitle)}
                        proTip={
                          <>
                            <span className="font-semibold">💼 Pro Tip for Job Titles:</span><br/>
                            Enter multiple job titles separated by commas. If only one title is entered, it will be displayed without animation. Multiple titles will create a typing animation effect.
                          </>
                        }
                      />
                      <FancyAdminField
                        icon={<span>🧑</span>}
                        title="First Name"
                        value={previewData.firstName}
                        onChange={e => { handleFieldChange('firstName', e.target.value); }}
                        placeholder="Enter first name..."
                        checked={!!previewData.firstName}
                        proTip="This is your first name as it will appear on your profile."
                      />
                      <FancyAdminField
                        icon={<span>👨‍💼</span>}
                        title="Last Name"
                        value={previewData.lastName}
                        onChange={e => { handleFieldChange('lastName', e.target.value); }}
                        placeholder="Enter last name..."
                        checked={!!previewData.lastName}
                        proTip="This is your last name as it will appear on your profile."
                      />
                    </div>
                    
                    <FancyAdminField
                      icon={<span>📝</span>}
                      title="Description"
                      value={previewData.description}
                      onChange={e => { handleFieldChange('description', e.target.value); }}
                      placeholder="Enter description..."
                      checked={!!previewData.description}
                      proTip="Describe yourself, your background, or your professional summary. This will appear in your introduction section."
                      type="textarea"
                    />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Profile Image
                            </label>
                            <ImageUploader 
                                currentImage={profileImage}
                                onImageSelect={setProfileImage}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Resume
                            </label>
                            <DocumentUploader 
                                currentFile={resumeFile}
                                onFileSelect={setResumeFile}
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end">
                        <button 
                            type="submit"
                            className="admin-button-primary px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 font-medium"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </Form>
            
            {/* Preview Modal */}
            <Modal
                title="Profile Preview"
                open={isPreviewModal}
                onCancel={() => setIsPreviewModal(false)}
                footer={[
                    <button
                        key="close"
                        onClick={() => setIsPreviewModal(false)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        Close
                    </button>
                ]}
                width={800}
                className="profile-preview-modal"
            >
                <div className="profile-preview-content p-6 bg-white rounded-lg">
                    <div className="flex items-start space-x-6">
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-gray-200 shadow-lg">
                                {profileImage || portfolioData?.introduction?.profileImage ? (
                                    <img 
                                        src={profileImage || portfolioData?.introduction?.profileImage} 
                                        alt="Profile Preview" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                        <span className="text-4xl">👤</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-gray-800 mb-3">
                                {previewData.firstName || 'First Name'} {previewData.lastName || 'Last Name'}
                            </h2>
                            
                            {/* Enhanced Job Title Display */}
                            <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-xl border-2 border-purple-200/50 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-500"></div>
                                <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                                        <span className="text-white text-lg">💼</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-purple-600 font-medium uppercase tracking-wide mb-1">Professional Title</p>
                                        <div className="text-xl text-purple-800 font-bold">
                                            <AnimatedJobTitle 
                                                jobTitles={previewData.jobTitle}
                                                className="text-xl text-purple-800 font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                                        ✨ Featured Role
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 mb-4">
                                {previewData.welcomeText || 'Welcome text will appear here...'}
                            </p>
                            {previewData.description && (
                                <p className="text-gray-700 leading-relaxed">
                                    {previewData.description}
                                </p>
                            )}
                            
                            {/* Completion Status */}
                            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                                <h4 className="font-semibold text-gray-800 mb-2">Profile Completion Status</h4>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Overall Progress:</span>
                                    <span className="font-bold text-blue-600">
                                        {(() => {
                                            const fields = [
                                                previewData.firstName,
                                                previewData.lastName,
                                                previewData.jobTitle,
                                                previewData.description,
                                                previewData.welcomeText,
                                                profileImage || portfolioData?.introduction?.profileImage,
                                                resumeFile || portfolioData?.introduction?.myResume
                                            ];
                                            const completed = fields.filter(Boolean).length;
                                            return Math.round((completed / fields.length) * 100);
                                        })()}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default AdminIntro
