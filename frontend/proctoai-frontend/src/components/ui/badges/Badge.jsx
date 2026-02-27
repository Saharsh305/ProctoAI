import React from 'react';

const Badge = ({ children, variant = 'primary', size = 'sm', className = '' }) => {
  const badgeClass = `badge badge-${variant}`;
  const sizeClass = size !== 'sm' ? `badge-${size}` : '';

  return (
    <span className={`${badgeClass} ${sizeClass} ${className}`.trim()}>
      {children}
    </span>
  );
};

export default Badge;
