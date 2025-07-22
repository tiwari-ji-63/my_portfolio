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
    
    const onFinish = async (values) => {
        try {
            const formData = {
                ...values,
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
                initialValues={portfolioData?.introduction}
                className="admin-form"
            >
                <div className="admin-card">
                    <h3 className="text-xl font-semibold text-primary mb-6">Introduction</h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Profile Image
                            </label>
                            <ImageUploader 
                                value={profileImage}
                                onChange={setProfileImage}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Resume
                            </label>
                            <DocumentUploader 
                                value={resumeFile}
                                onChange={setResumeFile}
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
        </div>
    )
}

export default AdminIntro
