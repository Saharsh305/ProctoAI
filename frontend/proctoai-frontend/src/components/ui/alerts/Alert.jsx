import React from 'react';

const Alert = ({ type = 'info', title, message, dismissible = true, className = '' }) => {
  const [visible, setVisible] = React.useState(true);

  if (!visible) return null;

  return (
    <div className={`alert alert-${type} ${dismissible ? 'alert-dismissible' : ''} ${className}`.trim()}>
      {title && <h4 className="alert-heading">{title}</h4>}
      {message && <p>{message}</p>}
      {dismissible && (
        <button
          type="button"
          className="close"
          onClick={() => setVisible(false)}
        >
          <span>&times;</span>
        </button>
      )}
    </div>
  );
};

export default Alert;
