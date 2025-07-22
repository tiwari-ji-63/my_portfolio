import React, { useState } from 'react';
import ProfileFrame from '../../components/ProfileFrame';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { message } from 'antd';

function ProfileImageUploader() {
    const { portfolioData } = useSelector((state) => state.root);
    const { introduction = {} } = portfolioData || {};
    const { profileImage, firstName, lastName } = introduction;

    const [currentImage, setCurrentImage] = useState(profileImage);
    const [selectedFrame, setSelectedFrame] = useState('rainbow');
    const [isUploading, setIsUploading] = useState(false);

    const frameTypes = [
        { value: 'modern', label: 'Modern' },
        { value: 'circular', label: 'Circular' },
        { value: 'square', label: 'Square' },
        { value: 'hexagon', label: 'Hexagon' },
        { value: 'diamond', label: 'Diamond' },
        { value: 'vintage', label: 'Vintage' },
        { value: 'neon', label: 'Neon' },
        { value: 'rainbow', label: 'Rainbow' },
        { value: 'galaxy', label: 'Galaxy' }
    ];

    const handleImageUpload = async (base64Image) => {
        setIsUploading(true);
        try {
            // Update the introduction with new profile image
            const response = await axios.post('/api/portfolio/update-introduction', {
                ...introduction,
                profileImage: base64Image
            });

            if (response.data.success) {
                setCurrentImage(base64Image);
                message.success('Profile image updated successfully!');
                // Refresh the page to show updated image throughout the portfolio
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                message.error('Failed to update profile image');
            }
        } catch (error) {
            console.error('Error updating profile image:', error);
            message.error('Error updating profile image');
        }
        setIsUploading(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-gray-800 rounded-xl p-8">
                <h2 className="text-3xl font-bold text-white text-center mb-8">
                    Profile Image Manager
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Current Profile */}
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-white mb-6">
                            Current Profile
                        </h3>
                        <div className="flex justify-center mb-4">
                            <ProfileFrame 
                                image={currentImage}
                                name={`${firstName} ${lastName}`}
                                size="xlarge"
                                frameType={selectedFrame}
                                borderColor="tertiary"
                                showName={true}
                                allowUpload={true}
                                onImageUpload={handleImageUpload}
                            />
                        </div>
                        {isUploading && (
                            <div className="text-tertiary text-sm">
                                Updating profile image...
                            </div>
                        )}
                    </div>

                    {/* Right: Frame Selector */}
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-6">
                            Choose Frame Style
                        </h3>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {frameTypes.map(frame => (
                                <button
                                    key={frame.value}
                                    onClick={() => setSelectedFrame(frame.value)}
                                    className={`p-3 rounded-lg transition-all duration-200 ${
                                        selectedFrame === frame.value
                                            ? 'bg-tertiary text-white border-2 border-secondary'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    {frame.label}
                                </button>
                            ))}
                        </div>

                        {/* Preview with different sizes */}
                        <div className="bg-gray-700 rounded-lg p-4">
                            <h4 className="text-white font-medium mb-3">Preview Sizes:</h4>
                            <div className="flex justify-center items-end gap-4 flex-wrap">
                                {['small', 'medium', 'large'].map(size => (
                                    <div key={size} className="text-center">
                                        <ProfileFrame 
                                            image={currentImage}
                                            size={size}
                                            frameType={selectedFrame}
                                            borderColor="tertiary"
                                        />
                                        <p className="text-gray-300 text-xs mt-1 capitalize">{size}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-8 bg-gray-700 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-3">Instructions:</h3>
                    <ul className="text-gray-300 text-sm space-y-2">
                        <li>• Click on your profile image to upload a new one</li>
                        <li>• Choose from 9 unique frame styles</li>
                        <li>• Supported formats: JPG, PNG, GIF (max 5MB)</li>
                        <li>• Square images work best for all frame types</li>
                        <li>• High resolution images (at least 512x512) recommended</li>
                        <li>• Changes will be visible throughout your portfolio</li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 text-center space-x-4">
                    <button
                        onClick={() => window.history.back()}
                        className="border-2 border-gray-500 text-gray-300 px-6 py-2 rounded hover:border-gray-400 transition-colors"
                    >
                        Back
                    </button>
                    <button
                        onClick={() => window.location.href = '/profile-frame-demo'}
                        className="border-2 border-tertiary text-tertiary px-6 py-2 rounded hover:border-secondary hover:text-white transition-all duration-300"
                    >
                        View All Frames
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfileImageUploader;
