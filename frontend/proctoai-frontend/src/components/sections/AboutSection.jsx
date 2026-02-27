import React from 'react';

const AboutSection = ({ title, subtitle, description, images, signature }) => {
  return (
    <section className="section section-lg">
      <div className="container">
        <div className="row align-items-center justify-content-around">
          {images && (
            <div className="col-md-6 col-xl-6 my-5 mt-sm-0 d-none d-sm-block">
              {images.map((img, index) => (
                <img
                  key={index}
                  className={`rounded img-fluid ${index === 0 ? 'effect-img-1' : 'effect-img-2'}`}
                  src={img.src}
                  alt={img.alt}
                />
              ))}
            </div>
          )}
          <div className="col-md-6 col-xl-5 text-center text-md-left">
            <h2 className="h1 mb-5 font-weight-light">
              {title}
              <br />
              <span className="font-weight-bold">{subtitle}</span>
            </h2>
            {Array.isArray(description) ? (
              description.map((para, index) => (
                <p key={index} className="lead">{para}</p>
              ))
            ) : (
              <p className="lead">{description}</p>
            )}
            {signature && (
              <img src={signature} alt="signature" className="mt-4" width="150" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
