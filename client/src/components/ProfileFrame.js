import React, { useState, useRef, useEffect } from 'react';

const ProfileFrame = ({ 
    image, 
    name, 
    size = "medium", 
    frameType = "modern",
    borderColor = "tertiary",
    showName = false,
    allowUpload = false,
    onImageUpload = null,
    className = ""
}) => {
    const [currentImage, setCurrentImage] = useState(image);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Update currentImage when image prop changes
    useEffect(() => {
        setCurrentImage(image);
    }, [image]);

    // Size configurations
    const sizeConfig = {
        small: "w-24 h-24",
        medium: "w-32 h-32",
        large: "w-48 h-48",
        xlarge: "w-64 h-64",
        xxlarge: "w-80 h-80"
    };

    // Enhanced frame type configurations with unique borders
    const frameTypes = {
        modern: {
            container: "relative overflow-hidden group",
            image: "rounded-full object-cover w-full h-full transition-transform duration-300 group-hover:scale-105",
            border: "border-4 border-tertiary bg-gradient-to-r from-tertiary to-secondary p-1",
            shadow: "shadow-lg hover:shadow-xl transition-shadow duration-300",
            overlay: "after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-t after:from-black/20 after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300"
        },
        circular: {
            container: "relative overflow-hidden group",
            image: "rounded-full object-cover w-full h-full transition-transform duration-300 group-hover:scale-110",
            border: "border-8 border-tertiary bg-gradient-to-br from-tertiary via-white to-tertiary p-2",
            shadow: "shadow-2xl hover:shadow-cyan-400/25 transition-all duration-300",
            overlay: "ring-4 ring-white ring-opacity-20 hover:ring-opacity-40 transition-all duration-300"
        },
        square: {
            container: "relative overflow-hidden group",
            image: "rounded-lg object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2",
            border: "border-6 border-purple-400 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-1.5",
            shadow: "shadow-xl hover:shadow-purple-400/30 transition-all duration-300",
            overlay: "before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-600/20 before:to-pink-600/20 before:rounded-lg before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
        },
        hexagon: {
            container: "relative overflow-hidden group",
            image: "object-cover w-full h-full transition-transform duration-300 group-hover:scale-110",
            border: "border-4 border-blue-400 bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-500 p-1",
            shadow: "shadow-lg hover:shadow-blue-400/40 transition-all duration-300",
            overlay: "clip-path-hexagon before:absolute before:inset-0 before:bg-gradient-conic before:from-blue-400 before:via-purple-500 before:to-pink-500 before:opacity-20 hover:before:opacity-40 before:transition-opacity before:duration-300"
        },
        diamond: {
            container: "relative overflow-hidden rotate-45 group",
            image: "object-cover w-full h-full -rotate-45 scale-150 transition-transform duration-300 group-hover:scale-[1.6]",
            border: "border-4 border-yellow-400 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-1",
            shadow: "shadow-xl hover:shadow-orange-400/40 transition-all duration-300",
            overlay: "before:absolute before:inset-0 before:bg-gradient-radial before:from-yellow-400/30 before:to-red-500/30 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
        },
        vintage: {
            container: "relative overflow-hidden group",
            image: "rounded-full object-cover w-full h-full sepia hover:sepia-0 transition-all duration-500",
            border: "border-8 border-amber-600 bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 p-2",
            shadow: "shadow-2xl hover:shadow-amber-600/50 transition-all duration-300",
            overlay: "ring-8 ring-amber-200 ring-opacity-50 hover:ring-amber-300 hover:ring-opacity-70 transition-all duration-300 before:absolute before:inset-0 before:rounded-full before:bg-radial-gradient before:from-amber-200/20 before:to-transparent"
        },
        neon: {
            container: "relative overflow-hidden group",
            image: "rounded-full object-cover w-full h-full transition-all duration-300 group-hover:brightness-110",
            border: "border-4 border-cyan-400 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-1",
            shadow: "shadow-lg shadow-cyan-400/50 hover:shadow-cyan-300/70 hover:shadow-2xl transition-all duration-300",
            overlay: "ring-2 ring-cyan-300 ring-opacity-75 animate-pulse hover:ring-4 hover:ring-cyan-200 transition-all duration-300 before:absolute before:inset-0 before:rounded-full before:bg-gradient-conic before:from-cyan-400 before:via-blue-500 before:to-purple-600 before:opacity-20 before:animate-spin before:duration-3000"
        },
        rainbow: {
            container: "relative overflow-hidden group",
            image: "rounded-full object-cover w-full h-full transition-transform duration-300 group-hover:scale-105",
            border: "border-6 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 p-1.5",
            shadow: "shadow-xl hover:shadow-rainbow transition-all duration-300",
            overlay: "ring-4 ring-white/30 hover:ring-white/50 transition-all duration-300 before:absolute before:inset-0 before:rounded-full before:bg-gradient-conic before:from-red-500 before:via-yellow-500 before:via-green-500 before:via-blue-500 before:to-purple-500 before:opacity-20 before:animate-spin before:duration-4000"
        },
        galaxy: {
            container: "relative overflow-hidden group",
            image: "rounded-full object-cover w-full h-full transition-all duration-500 group-hover:scale-110 group-hover:brightness-110",
            border: "border-6 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 p-1.5",
            shadow: "shadow-2xl shadow-purple-500/30 hover:shadow-purple-400/50 transition-all duration-300",
            overlay: "ring-6 ring-purple-400/30 hover:ring-purple-300/50 transition-all duration-300 before:absolute before:inset-0 before:rounded-full before:bg-gradient-radial before:from-purple-400/20 before:via-blue-500/10 before:to-transparent before:animate-pulse"
        }
    };

    const currentFrameConfig = frameTypes[frameType] || frameTypes.modern;

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        setIsUploading(true);

        try {
            // Convert to base64
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Image = e.target.result;
                setCurrentImage(base64Image);
                setIsUploading(false);
                
                // Call parent callback if provided
                if (onImageUpload) {
                    onImageUpload(base64Image);
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error uploading image:', error);
            setIsUploading(false);
            alert('Error uploading image. Please try again.');
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Don't render anything if no image and no upload allowed
    if (!currentImage && !allowUpload) {
        // Return a placeholder for profile images
        return (
            <div className={`${sizeConfig[size]} bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center border-4 border-tertiary ${className}`}>
                <svg className="w-1/2 h-1/2 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
            </div>
        );
    }

    return (
        <div className={`flex flex-col items-center gap-4 ${className}`}>
            {/* Profile Image with Frame */}
            <div className={`
                ${sizeConfig[size]}
                ${currentFrameConfig.container}
                ${currentFrameConfig.border}
                ${currentFrameConfig.shadow}
                ${currentFrameConfig.overlay}
                transition-all duration-300
                ${allowUpload ? 'cursor-pointer' : ''}
            `}
            onClick={allowUpload ? triggerFileInput : undefined}
            >
                {currentImage ? (
                    <img
                        src={currentImage}
                        alt={name || "Profile"}
                        className={currentFrameConfig.image}
                    />
                ) : (
                    <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                        {isUploading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
                        ) : (
                            <div className="text-center text-gray-500">
                                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span className="text-xs">Upload</span>
                            </div>
                        )}
                    </div>
                )}
                
                {/* Upload overlay */}
                {allowUpload && currentImage && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Hidden file input */}
            {allowUpload && (
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
            )}

            {/* Upload status */}
            {allowUpload && isUploading && (
                <div className="text-white text-sm">
                    Uploading...
                </div>
            )}

            {/* Name Display */}
            {showName && name && (
                <h3 className="text-center font-semibold text-white text-lg">
                    {name}
                </h3>
            )}

            {/* Upload instruction */}
            {allowUpload && !isUploading && (
                <p className="text-center text-gray-300 text-xs max-w-32">
                    Click to upload new image
                </p>
            )}
        </div>
    );
};

export default ProfileFrame;
