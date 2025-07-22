import React, { useState } from 'react';

function ImageUploader({ onImageSelect, currentImage, label = "Upload Image" }) {
    const [preview, setPreview] = useState(currentImage || null);
    const [dragActive, setDragActive] = useState(false);

    const handleImageChange = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64String = e.target.result;
                setPreview(base64String);
                onImageSelect(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        handleImageChange(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        const file = e.dataTransfer.files[0];
        handleImageChange(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const removeImage = () => {
        setPreview(null);
        onImageSelect(null);
    };

    return (
        <div className="w-full">
            <label className="block text-lg font-bold text-white mb-4 text-center">
                {label}
            </label>
            
            {/* Modern Upload Area */}
            <div className="bg-gradient-to-br from-primary/30 via-accent/20 to-tertiary/25 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
                <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                        dragActive 
                            ? 'border-tertiary/80 bg-gradient-to-br from-tertiary/20 to-accent/15 shadow-lg scale-105' 
                            : 'border-white/40 hover:border-tertiary/60 hover:bg-gradient-to-br hover:from-white/10 hover:to-tertiary/10'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {preview ? (
                        /* Enhanced Preview */
                        <div className="relative">
                            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 p-2">
                                <img 
                                    src={preview} 
                                    alt="Preview" 
                                    className="max-w-full h-64 object-cover rounded-lg mx-auto shadow-lg"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none rounded-lg"></div>
                            </div>
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:scale-110"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                            <div className="mt-6">
                                <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-tertiary to-accent text-white rounded-xl hover:from-tertiary/80 hover:to-accent/80 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    Change Image
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileInput}
                                    />
                                </label>
                            </div>
                        </div>
                    ) : (
                        /* Enhanced Upload Prompt */
                        <div className="space-y-6">
                            <div className="relative">
                                <div className="text-8xl mb-6 relative">
                                    <div className="absolute inset-0 text-tertiary/30 transform translate-x-1 translate-y-1">�</div>
                                    <div className="relative text-gradient bg-gradient-to-r from-tertiary to-accent bg-clip-text">📸</div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="text-xl font-bold text-white">
                                    Drop your image here, or{' '}
                                    <label className="text-tertiary cursor-pointer hover:text-accent transition-colors duration-300 underline decoration-wavy decoration-tertiary/50">
                                        browse files
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileInput}
                                        />
                                    </label>
                                </div>
                                <div className="flex items-center justify-center gap-4 text-white/80">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                        </svg>
                                        JPG
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                        </svg>
                                        PNG
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                        </svg>
                                        GIF
                                    </span>
                                    <span className="text-white/60">• Max 5MB</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Enhanced URL Input Section */}
                <div className="mt-8 p-6 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-white/20">
                    <label className="block text-lg font-semibold text-white mb-4 text-center">
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                            </svg>
                            Or enter image URL
                        </span>
                    </label>
                    <div className="relative">
                        <input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-tertiary/50 focus:border-tertiary/50 transition-all duration-300"
                            onBlur={(e) => {
                                if (e.target.value) {
                                    setPreview(e.target.value);
                                    onImageSelect(e.target.value);
                                }
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-tertiary/10 to-accent/10 rounded-xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImageUploader;
