import React from 'react';

const LoadingSpinner = ({ size = 'normal' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    normal: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin`}>
      <div className="w-full h-full border-2 border-neutral-200 border-t-primary-600 rounded-full"></div>
    </div>
  );
};

export default LoadingSpinner;


