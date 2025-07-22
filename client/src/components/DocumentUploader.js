import React, { useState } from 'react';

function DocumentUploader({ onFileSelect, currentFile, label = "Resume / CV", acceptedTypes = ".pdf,.doc,.docx" }) {
    const [preview, setPreview] = useState(currentFile || null);
    const [dragActive, setDragActive] = useState(false);
    const [fileName, setFileName] = useState('');
    const [urlInput, setUrlInput] = useState('');

    // Initialize file name from currentFile
    React.useEffect(() => {
        if (currentFile) {
            console.log('DocumentUploader currentFile:', currentFile);
            if (typeof currentFile === 'string') {
                // It's a URL
                setFileName('Resume.pdf');
                setPreview(currentFile);
                setUrlInput(currentFile);
            } else if (currentFile.name) {
                // It's a file object
                setFileName(currentFile.name);
                setPreview(currentFile.data || currentFile);
            }
        }
    }, [currentFile]);

    // Compress base64 string if needed
    const compressBase64 = (base64String) => {
        // Remove data URL prefix for size calculation
        const base64Data = base64String.split(',')[1];
        const sizeInBytes = (base64Data.length * 3) / 4;
        
        // If over 3MB, suggest alternatives
        if (sizeInBytes > 3 * 1024 * 1024) {
            console.warn(`Large file detected: ${formatFileSize(sizeInBytes)}`);
        }
        
        return base64String;
    };

    const handleFileChange = (file) => {
        if (file) {
            console.log('Document file selected:', file);
            
            // Check file size (5MB limit to account for Base64 expansion)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                alert(`File size too large! Please select a file smaller than 5MB. Your file is ${formatFileSize(file.size)}.\n\nTip: Try compressing your PDF or using a URL instead.`);
                return;
            }
            
            // Check file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                alert('Invalid file type! Please select a PDF, DOC, or DOCX file.');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64String = compressBase64(e.target.result);
                
                // Check Base64 size (it's larger than original file)
                console.log(`Original file size: ${formatFileSize(file.size)}, Base64 size: ${formatFileSize(base64String.length)}`);
                
                setPreview(base64String);
                setFileName(file.name);
                const fileData = {
                    data: base64String,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    originalSize: file.size,
                    base64Size: base64String.length
                };
                console.log('Document file processed:', fileData);
                onFileSelect(fileData);
            };
            reader.onerror = () => {
                alert('Error reading file. Please try again.');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        handleFileChange(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        const file = e.dataTransfer.files[0];
        handleFileChange(file);
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

    const removeFile = () => {
        setPreview(null);
        setFileName('');
        onFileSelect(null);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-semibold text-primary mb-3">{label}</label>
            
            {/* Main Upload Area */}
            <div 
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                    dragActive 
                        ? 'border-secondary bg-secondary/5 scale-105' 
                        : preview 
                            ? 'border-tertiary bg-tertiary/5' 
                            : 'border-gray-300 hover:border-secondary hover:bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {preview ? (
                    /* File Uploaded State */
                    <div className="space-y-4">
                        <div className="flex items-center justify-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-tertiary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-white text-3xl">📄</span>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-bold text-primary mb-1">{fileName}</h3>
                            <p className="text-sm text-gray-600">File uploaded successfully</p>
                        </div>
                        
                        <div className="flex items-center justify-center space-x-3">
                            {typeof preview === 'string' && preview.startsWith('http') ? (
                                <a
                                    href={preview}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200"
                                >
                                    <span>📥</span>
                                    <span>Download</span>
                                </a>
                            ) : null}
                            
                            <button
                                type="button"
                                onClick={removeFile}
                                className="inline-flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200"
                            >
                                <span>🗑️</span>
                                <span>Remove</span>
                            </button>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-200">
                            <label className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-tertiary to-secondary text-white rounded-xl cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105">
                                <span>📄</span>
                                <span>Change Document</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept={acceptedTypes}
                                    onChange={handleFileInput}
                                />
                            </label>
                        </div>
                    </div>
                ) : (
                    /* Upload Prompt */
                    <div className="space-y-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                            <span className="text-4xl text-gray-400">📄</span>
                        </div>
                        
                        <div>
                            <h3 className="text-xl font-bold text-primary mb-2">Upload Your Resume</h3>
                            <p className="text-gray-600 mb-4">
                                Drag and drop your resume here, or click to browse
                            </p>
                            
                            <label className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-secondary to-tertiary text-white rounded-xl cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105">
                                <span>📂</span>
                                <span>Choose File</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept={acceptedTypes}
                                    onChange={handleFileInput}
                                />
                            </label>
                        </div>
                        
                        <div className="text-xs text-gray-500 space-y-1">
                            <p>Supported formats: PDF, DOC, DOCX</p>
                            <p>Maximum file size: 5MB</p>
                        </div>
                    </div>
                )}
            </div>

            {/* URL Alternative */}
            <div className="mt-6 p-4 bg-gradient-to-r from-accent/5 to-tertiary/5 rounded-xl border border-accent/20">
                <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-accent text-sm">🔗</span>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-primary mb-2">Or enter resume URL:</h4>
                        <input
                            type="url"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="https://example.com/resume.pdf"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-secondary transition-all duration-300"
                            onBlur={(e) => {
                                if (e.target.value.trim()) {
                                    const url = e.target.value.trim();
                                    console.log('URL entered:', url);
                                    setPreview(url);
                                    setFileName('Resume.pdf');
                                    const urlData = {
                                        data: url,
                                        name: 'Resume.pdf',
                                        type: 'url',
                                        isUrl: true
                                    };
                                    console.log('URL file data:', urlData);
                                    onFileSelect(urlData);
                                }
                            }}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            💡 Tip: Upload a file for better reliability, or use a URL as backup
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DocumentUploader;
