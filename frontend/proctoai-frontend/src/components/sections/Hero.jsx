import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/buttons/Button';

const Hero = ({ title, subtitle, description, primaryLink, secondaryLink, imageUrl, bgColor = 'bg-secondary' }) => {
  return (
    <section className={`section-header ${bgColor} text-white`}>
      <div className="container">
        <div className="row justify-content-between align-items-center">
          <div className="col-12 col-md-7 col-lg-6 text-center text-md-left">
            <h1 className="display-2 mb-4">
              {title}
              <br className="d-none d-md-inline" />
            </h1>
            <p className="lead mb-4 text-muted">{description}</p>
            {primaryLink && (
              <Link to={primaryLink.url} className="btn btn-tertiary mr-3 animate-up-2">
                {primaryLink.label} <span className="ml-2"><span className="fas fa-arrow-right"></span></span>
              </Link>
            )}
          </div>
          {imageUrl && (
            <div className="col-12 col-md-5 d-none d-md-block text-center">
              <img src={imageUrl} alt="Hero" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
