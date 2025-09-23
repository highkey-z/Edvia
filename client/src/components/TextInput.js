import React from 'react';
import { AlertIcon } from './icons';

const TextInput = ({ value, onChange, placeholder }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handlePaste = (e) => {
    // Allow paste and let the onChange handle the content
    setTimeout(() => {
      // Auto-focus and scroll to bottom after paste
      e.target.scrollTop = e.target.scrollHeight;
    }, 100);
  };

  return (
    <div className="form-group">
      <label className="form-label">
        Text to Simplify
        <span className="text-secondary text-sm ml-2 font-medium">
          ({value.length} characters)
        </span>
      </label>
      <textarea
        className="form-textarea"
        value={value}
        onChange={handleChange}
        onPaste={handlePaste}
        placeholder={placeholder}
        maxLength={10000}
        rows={10}
      />
      {value.length > 9000 && (
        <div className="flex items-center space-x-3 mt-4 p-4 bg-warning-50 border border-warning-100 rounded-lg">
          <AlertIcon size={16} className="text-warning-600" />
          <p className="text-sm text-secondary font-medium">
            Text is getting long. Consider breaking it into smaller sections for better results.
          </p>
        </div>
      )}
    </div>
  );
};

export default TextInput;


