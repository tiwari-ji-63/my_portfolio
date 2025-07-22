import React, { useState } from 'react'
import {Form, message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {HideLoading, ShowLoading} from "../../redux/rootSlice";
import axios from "axios";
import ImageUploader from "../../components/ImageUploader";
import DocumentUploader from "../../components/DocumentUploader";

function AdminIntro() {
    const dispatch = useDispatch();
    const {portfolioData} = useSelector((state) => state.root);
    const [profileImage, setProfileImage] = useState(portfolioData?.introduction?.profileImage || null);
    const [resumeFile, setResumeFile] = useState(portfolioData?.introduction?.myResume || null);
    
    // Debug log to check initial values
    React.useEffect(() => {
        console.log('AdminIntro initialized with:');
        console.log('- portfolioData:', portfolioData);
        console.log('- initial profileImage:', portfolioData?.introduction?.profileImage);
        console.log('- initial resumeFile:', portfolioData?.introduction?.myResume);
    }, [portfolioData]);
    
    const onFinish = async (values) => {
        try {
            console.log('Form Values:', values);
            console.log('Profile Image:', profileImage);
            console.log('Resume File:', resumeFile);
            
            // Include the profile image and resume file in the form data
            const formData = {
                ...values,
                profileImage: profileImage,
                myResume: resumeFile?.data || resumeFile // Support both file upload and URL
            };
            
            console.log('Sending FormData:', formData);
            
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
            console.error('Submit Error:', error);
            
            // Handle specific error types
            if (error.response?.status === 413) {
                message.error('File too large! Please use a smaller resume file (under 5MB) or use a URL instead.');
            } else if (error.response?.status === 400) {
                message.error('Invalid file format or data. Please check your resume file.');
            } else if (error.response?.data?.message) {
                message.error(error.response.data.message);
            } else {
                message.error('Failed to save resume. Please try again or use a URL instead.');
            }
        }
    };
    return (
        <div className="space-y-6 fade-in">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center space-x-4">
                    <div className="admin-icon">
                        <span className="text-xl">👋</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-primary">Introduction Section</h3>
                        <p className="text-gray-600">Manage your personal introduction and profile details</p>
                    </div>
                </div>
            </div>

            {/* Current Profile Overview */}
            <div className="admin-card">
                <div className="mb-6">
                    <h4 className="text-lg font-semibold text-primary mb-2">Current Profile</h4>
                    <p className="text-gray-600">Live preview of your introduction section</p>
                </div>
                
                <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-tertiary/5 p-6 rounded-2xl border border-gray-200">
                    <div className="flex items-start space-x-6">
                        {/* Profile Image Preview */}
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-gray-100 to-gray-200">
                                {portfolioData?.introduction?.profileImage ? (
                                    <img 
                                        src={portfolioData.introduction.profileImage} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <span className="text-3xl">👤</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Profile Info */}
                        <div className="flex-1 min-w-0">
                            <div className="mb-4">
                                <h3 className="text-2xl font-bold text-primary mb-1">
                                    {portfolioData?.introduction?.firstName || 'First'} {portfolioData?.introduction?.lastName || 'Last'}
                                </h3>
                                <p className="text-lg text-secondary font-semibold">
                                    {portfolioData?.introduction?.jobTitle || 'Job Title'}
                                </p>
                                <p className="text-gray-600 mt-2">
                                    {portfolioData?.introduction?.welcomeText || 'Welcome text will appear here...'}
                                </p>
                            </div>
                            
                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg text-center">
                                    <div className="text-lg font-bold text-blue-600">
                                        {portfolioData?.introduction?.profileImage ? '✓' : '✗'}
                                    </div>
                                    <div className="text-xs text-gray-600">Profile Image</div>
                                </div>
                                <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg text-center">
                                    <div className="text-lg font-bold text-green-600">
                                        {portfolioData?.introduction?.myResume ? '✓' : '✗'}
                                    </div>
                                    <div className="text-xs text-gray-600">Resume</div>
                                </div>
                                <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg text-center">
                                    <div className="text-lg font-bold text-purple-600">
                                        {portfolioData?.introduction?.firstName && portfolioData?.introduction?.lastName ? '✓' : '✗'}
                                    </div>
                                    <div className="text-xs text-gray-600">Full Name</div>
                                </div>
                                <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg text-center">
                                    <div className="text-lg font-bold text-orange-600">
                                        {portfolioData?.introduction?.welcomeText ? '✓' : '✗'}
                                    </div>
                                    <div className="text-xs text-gray-600">Welcome Text</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Profile Completion */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                            <span className="text-sm font-medium text-gray-700">
                                {(() => {
                                    const fields = [
                                        portfolioData?.introduction?.firstName,
                                        portfolioData?.introduction?.lastName,
                                        portfolioData?.introduction?.jobTitle,
                                        portfolioData?.introduction?.welcomeText,
                                        portfolioData?.introduction?.profileImage,
                                        portfolioData?.introduction?.myResume
                                    ];
                                    const completed = fields.filter(Boolean).length;
                                    return Math.round((completed / fields.length) * 100);
                                })()}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-gradient-to-r from-secondary to-tertiary h-2 rounded-full transition-all duration-500"
                                style={{ 
                                    width: `${(() => {
                                        const fields = [
                                            portfolioData?.introduction?.firstName,
                                            portfolioData?.introduction?.lastName,
                                            portfolioData?.introduction?.jobTitle,
                                            portfolioData?.introduction?.welcomeText,
                                            portfolioData?.introduction?.profileImage,
                                            portfolioData?.introduction?.myResume
                                        ];
                                        const completed = fields.filter(Boolean).length;
                                        return Math.round((completed / fields.length) * 100);
                                    })()}%` 
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="admin-card admin-form">
                <Form onFinish={onFinish} layout="vertical" initialValues={portfolioData.introduction}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Form.Item name="welcomeText" label="Welcome Text" className="mb-6">
                            <input 
                                placeholder="Enter welcome text..."
                                className="admin-input w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl text-primary placeholder-gray-400 focus:outline-none focus:border-secondary focus:bg-white transition-all duration-300"
                            />
                        </Form.Item>
                        
                        <Form.Item name="jobTitle" label="Job Title" className="mb-6">
                            <input 
                                placeholder="Enter job title..."
                                className="admin-input w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl text-primary placeholder-gray-400 focus:outline-none focus:border-secondary focus:bg-white transition-all duration-300"
                            />
                        </Form.Item>
                        
                        <Form.Item name="firstName" label="First Name" className="mb-6">
                            <input 
                                placeholder="Enter first name..."
                                className="admin-input w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl text-primary placeholder-gray-400 focus:outline-none focus:border-secondary focus:bg-white transition-all duration-300"
                            />
                        </Form.Item>
                        
                        <Form.Item name="lastName" label="Last Name" className="mb-6">
                            <input 
                                placeholder="Enter last name..."
                                className="admin-input w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl text-primary placeholder-gray-400 focus:outline-none focus:border-secondary focus:bg-white transition-all duration-300"
                            />
                        </Form.Item>
                    </div>
                    
                    <Form.Item name="description" label="Description" className="mb-6">
                        <textarea 
                            placeholder="Enter description..."
                            rows={4}
                            className="admin-input w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl text-primary placeholder-gray-400 focus:outline-none focus:border-secondary focus:bg-white transition-all duration-300 resize-none"
                        />
                    </Form.Item>
                    
                    {/* File Upload Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Enhanced Resume Uploader */}
                        <div className="space-y-3">
                            <label className="text-primary font-semibold text-sm">Resume / CV</label>
                            <div className="bg-gradient-to-br from-secondary/5 to-tertiary/5 p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-secondary transition-all duration-300">
                                <DocumentUploader
                                    onFileSelect={(file) => {
                                        console.log('Resume file selected in AdminIntro:', file);
                                        setResumeFile(file);
                                    }}
                                    currentFile={resumeFile}
                                    label="Resume / CV"
                                    acceptedTypes=".pdf,.doc,.docx"
                                />
                            </div>
                        </div>
                        
                        {/* Enhanced Image Uploader */}
                        <div className="space-y-3">
                            <label className="text-primary font-semibold text-sm">Profile Picture</label>
                            <div className="bg-gradient-to-br from-secondary/5 to-tertiary/5 p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-secondary transition-all duration-300">
                                <ImageUploader
                                    onImageSelect={setProfileImage}
                                    currentImage={profileImage}
                                    label="Profile Picture"
                                />
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
                                <span>Save Changes</span>
                            </span>
                        </button>
                    </div>
                </Form>
            </div>
            
            {/* Preview Modal */}
            <Modal
                title="Profile Preview"
                open={isPreviewModal}
                onCancel={() => setIsPreviewModal(false)}
                footer={[
                    <button
                        key="screenshot"
                        onClick={takeScreenshot}
                        className="mr-3 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                        📸 Take Screenshot
                    </button>,
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
                <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-tertiary/10 p-8 rounded-2xl">
                    <div className="flex items-center space-x-6">
                        {/* Profile Image */}
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-gray-100 to-gray-200">
                                {portfolioData?.introduction?.profileImage ? (
                                    <img 
                                        src={portfolioData.introduction.profileImage} 
                                        alt="Profile Preview" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <span className="text-4xl">👤</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Profile Info */}
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-primary mb-2">
                                {formData.firstName || portfolioData?.introduction?.firstName || 'First'} {formData.lastName || portfolioData?.introduction?.lastName || 'Last'}
                            </h2>
                            <p className="text-xl text-secondary font-semibold mb-3">
                                {formData.jobTitle || portfolioData?.introduction?.jobTitle || 'Job Title'}
                            </p>
                            <p className="text-gray-700 mb-4">
                                {formData.welcomeText || portfolioData?.introduction?.welcomeText || 'Welcome text will appear here...'}
                            </p>
                            {(formData.description || portfolioData?.introduction?.description) && (
                                <p className="text-gray-600 text-sm">
                                    {formData.description || portfolioData?.introduction?.description}
                                </p>
                            )}
                            
                            {/* Quick Actions */}
                            <div className="flex items-center space-x-4 mt-6">
                                {portfolioData?.introduction?.myResume && (
                                    <a
                                        href={portfolioData.introduction.myResume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        <span>📄</span>
                                        <span>View Resume</span>
                                    </a>
                                )}
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <span>Profile completion: </span>
                                    <span className="font-semibold text-green-600">
                                        {(() => {
                                            const fields = [
                                                portfolioData?.introduction?.firstName,
                                                portfolioData?.introduction?.lastName,
                                                portfolioData?.introduction?.jobTitle,
                                                portfolioData?.introduction?.welcomeText,
                                                portfolioData?.introduction?.profileImage,
                                                portfolioData?.introduction?.myResume
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
