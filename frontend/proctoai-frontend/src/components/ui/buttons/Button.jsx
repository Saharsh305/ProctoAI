import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', block = false, className = '', ...props }) => {
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  const blockClass = block ? 'btn-block' : '';

  return (
    <button 
      className={`btn ${variantClass} ${sizeClass} ${blockClass} ${className}`.trim()} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
