import React from 'react';
import Button from '../ui/buttons/Button';

const CTA = ({ title, description, buttonText, buttonLink, imageUrl }) => {
  return (
    <section className="section py-0">
      <div className="container z-2">
        <div className="row position-relative justify-content-center align-items-center">
          <div className="col-12">
            <div className="card border-light px-4 py-1">
              <div className="card-body text-center text-md-left">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <h2 className="h1 mb-3">{title || 'Become one of us'}</h2>
                    <p className="lead mb-4">
                      {description || 'Do you want to join our team and work remotely from anywhere you\'d like? We can\'t wait to hear from you!'}
                    </p>
                    <Button variant="primary">
                      <span className="mr-1">
                        <span className="fas fa-file-invoice"></span>
                      </span>
                      {buttonText || 'Check Careers'}
                    </Button>
                  </div>
                  {imageUrl && (
                    <div className="col-12 col-md-6 mt-5 mt-md-0 text-md-right">
                      <img src={imageUrl} alt="CTA" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
