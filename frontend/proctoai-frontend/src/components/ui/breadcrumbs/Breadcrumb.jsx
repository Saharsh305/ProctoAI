import React from 'react';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={index} className={index === items.length - 1 ? 'active' : ''}>
            {item.url ? (
              <a href={item.url}>{item.label}</a>
            ) : (
              item.label
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
