import React from 'react';

const FormGroup = ({ label, htmlFor, children, icon = null, className = '' }) => {
  return (
    <div className={`form-group mb-4 ${className}`.trim()}>
      {label && <label className="h6" htmlFor={htmlFor}>{label}</label>}
      <div className="input-group">
        {icon && (
          <div className="input-group-prepend">
            <span className="input-group-text">
              <span className={`fas fa-${icon}`}></span>
            </span>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default FormGroup;
