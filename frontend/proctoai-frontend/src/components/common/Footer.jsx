import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="footer pb-6 bg-primary text-white pt-9 mt-n9">
      <div className="container">
        <div className="row mt-6">
          <div className="col-md-4">
            <p>
              <strong>Pixel</strong> is a large User Interface Kit that will help you prototype and design beautiful, creative and modern websites.
            </p>
            <ul className="social-buttons mb-5 mb-lg-0">
              <li>
                <a href="https://twitter.com/themesberg" className="icon icon-xs icon-white" title="Follow us on Twitter">
                  <span className="fab fa-twitter"></span>
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/Themesberg-214738555737136/" className="icon icon-xs icon-white" title="Like us on Facebook">
                  <span className="fab fa-facebook"></span>
                </a>
              </li>
              <li>
                <a href="https://github.com/themesberg" className="icon icon-xs icon-white" title="Star us on Github">
                  <span className="fab fa-github"></span>
                </a>
              </li>
              <li>
                <a href="https://dribbble.com/themesberg" className="icon icon-xs icon-white" title="Like us on Dribbble">
                  <span className="fab fa-dribbble"></span>
                </a>
              </li>
            </ul>
          </div>

          <div className="col-6 col-md-2 mb-5 mb-lg-0">
            <h3 className="h5">Themesberg</h3>
            <ul className="links-vertical">
              <li><a target="_blank" rel="noopener noreferrer" href="https://themesberg.com/blog">Blog</a></li>
              <li><a target="_blank" rel="noopener noreferrer" href="https://themesberg.com/products">Products</a></li>
              <li><a target="_blank" rel="noopener noreferrer" href="https://themesberg.com/about">About Us</a></li>
              <li><a target="_blank" rel="noopener noreferrer" href="https://themesberg.com/contact">Contact Us</a></li>
            </ul>
          </div>

          <div className="col-6 col-md-2 mb-5 mb-lg-0">
            <h3 className="h5">Other</h3>
            <ul className="links-vertical">
              <li>
                <a href="https://themesberg.com/docs/pixel-bootstrap/getting-started/overview/" target="_blank" rel="noopener noreferrer">
                  Docs <span className="badge badge-sm badge-secondary ml-2">v3.0</span>
                </a>
              </li>
              <li><a href="https://themesberg.com/docs/pixel-bootstrap/getting-started/changelog" target="_blank" rel="noopener noreferrer">Changelog</a></li>
              <li><a target="_blank" rel="noopener noreferrer" href="https://themesberg.com/licensing">License</a></li>
              <li><a target="_blank" rel="noopener noreferrer" href="https://github.com/themesberg/pixel-bootstrap-ui-kit/issues">Support</a></li>
            </ul>
          </div>

          <div className="col-12 col-md-4 mb-5 mb-lg-0">
            <h3 className="h5">Subscribe</h3>
            <p className="text-muted font-small">Join our mailing list. We write rarely, but only the best content.</p>
            <form>
              <div className="form-row mb-2">
                <div className="col-12">
                  <label className="h6 font-weight-normal text-muted" htmlFor="emailSubscribe">Email address</label>
                  <input type="email" className="form-control mb-2" placeholder="example@company.com" id="emailSubscribe" required />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-tertiary shadow-soft btn-block">
                    <span>Subscribe</span>
                  </button>
                </div>
              </div>
            </form>
            <small className="text-muted font-small">We'll never share your details. See our <a className="text-white" href="#">Privacy Policy</a></small>
          </div>
        </div>

        <hr className="my-5" />

        <div className="row">
          <div className="col mb-md-0">
            <a href="https://themesberg.com" target="_blank" rel="noopener noreferrer" className="d-flex justify-content-center">
              <img src="/assets/img/themesberg.svg" height="25" className="mb-3" alt="Themesberg Logo" />
            </a>
            <div className="d-flex text-center justify-content-center align-items-center">
              <p className="font-weight-normal font-small mb-0">
                Copyright © Themesberg <span>{year}</span>. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
