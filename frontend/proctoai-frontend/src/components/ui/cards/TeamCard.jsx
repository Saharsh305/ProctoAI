import React from 'react';

const TeamCard = ({ image, name, title, description, socialLinks = [] }) => {
  return (
    <div className="card border-light">
      <img src={image} className="card-img-top rounded-top" alt={name} />
      <div className="card-body">
        <h3 className="h5 card-title mb-2">{name}</h3>
        <span className="card-subtitle text-gray font-weight-normal">{title}</span>
        {description && <p className="card-text my-3">{description}</p>}
        
        <ul className="list-unstyled d-flex mt-3 mb-0">
          {socialLinks.map((link, index) => (
            <li key={index}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className={`icon icon-xs icon-${link.type} mr-3`}>
                <span className={`fab fa-${link.type}`}></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeamCard;
