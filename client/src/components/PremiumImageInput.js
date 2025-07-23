import React, { useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * PremiumImageInput - A modern, reusable component for image upload or URL input with preview.
 * Props:
 *   value: current image URL or file (string)
 *   onChange: function to call with new image URL or file
 *   inputType: 'url' | 'upload'
 *   setInputType: function to change input type
 *   label: optional label
 *   className: optional className
 */
function PremiumImageInput({ value, onChange, inputType, setInputType, label, className }) {
  const fileInputRef = useRef();
  const previewUrl = inputType === 'upload' && value instanceof File ? URL.createObjectURL(value) : value;

  return (
    <div className={`w-full ${className || ''}`}>
      {label && <label className="block mb-2 font-semibold text-primary">{label}</label>}
      <div className="flex gap-4 mb-3">
        <button
          type="button"
          className={`px-4 py-2 rounded-xl font-semibold border-2 transition-all duration-200 ${inputType === 'upload' ? 'bg-primary text-white border-primary' : 'bg-white border-gray-300 text-primary hover:bg-primary/10'}`}
          onClick={() => setInputType('upload')}
        >
          Upload Image
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-xl font-semibold border-2 transition-all duration-200 ${inputType === 'url' ? 'bg-primary text-white border-primary' : 'bg-white border-gray-300 text-primary hover:bg-primary/10'}`}
          onClick={() => setInputType('url')}
        >
          Use Image URL
        </button>
      </div>
      {inputType === 'upload' ? (
        <div className="rounded-2xl bg-gradient-to-br from-white/40 to-primary/10 p-4 shadow-lg w-full flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={e => {
              if (e.target.files && e.target.files[0]) {
                onChange(e.target.files[0]);
              }
            }}
          />
          <button
            type="button"
            className="admin-btn-primary mb-2"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            Choose Image
          </button>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-xl border border-gray-200 mt-2 shadow"
            />
          )}
        </div>
      ) : (
        <input
          type="url"
          placeholder="Enter image URL..."
          className="admin-input w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl text-primary placeholder-gray-400 focus:outline-none focus:border-secondary focus:bg-white transition-all duration-300"
          value={typeof value === 'string' ? value : ''}
          onChange={e => onChange(e.target.value)}
        />
      )}
      {inputType === 'url' && value && (
        <div className="flex justify-center mt-3">
          <img
            src={value}
            alt="Preview"
            className="w-40 h-40 object-cover rounded-xl border border-gray-200 shadow"
          />
        </div>
      )}
    </div>
  );
}

PremiumImageInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func.isRequired,
  inputType: PropTypes.oneOf(['url', 'upload']).isRequired,
  setInputType: PropTypes.func.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
};

export default PremiumImageInput;
