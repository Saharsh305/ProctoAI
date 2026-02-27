import React from 'react';

const Card = ({ children, border = true, className = '', ...props }) => {
  const borderClass = border ? 'border-light' : 'border-0';

  return (
    <div className={`card ${borderClass} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};

export default Card;
