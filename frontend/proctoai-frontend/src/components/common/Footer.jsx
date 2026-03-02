import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer pb-6 bg-primary text-white pt-9 mt-n9">
      <div className="container">
        <div className="row mt-6">
          <div className="col-md-4">
            <h3 className="h5 font-weight-bold mb-3">ProctoAI</h3>
            <p>
              AI-powered online proctoring platform — secure, intelligent, and seamless exam monitoring for educators and students.
            </p>
            <ul className="social-buttons mb-5 mb-lg-0">
              <li>
                <a href="https://github.com/Saharsh305/ProctoAI" className="icon icon-xs icon-white" title="GitHub" target="_blank" rel="noopener noreferrer">
                  <span className="fab fa-github"></span>
                </a>
              </li>
            </ul>
          </div>

          <div className="col-6 col-md-2 mb-5 mb-lg-0">
            <h3 className="h5">Platform</h3>
            <ul className="links-vertical">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/signin">Sign in</Link></li>
              <li><Link to="/signup">Sign up</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-2 mb-5 mb-lg-0">
            <h3 className="h5">Dashboard</h3>
            <ul className="links-vertical">
              <li><Link to="/dashboard">My Dashboard</Link></li>
              <li><Link to="/questions">Questions</Link></li>
              <li><Link to="/proctoring">Proctoring</Link></li>
              <li><Link to="/exam/create">Create Exam</Link></li>
            </ul>
          </div>

          <div className="col-12 col-md-4 mb-5 mb-lg-0">
            <h3 className="h5">Stay Updated</h3>
            <p className="text-muted font-small">Get notified about new features and improvements.</p>
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
            <div className="d-flex text-center justify-content-center align-items-center">
              <p className="font-weight-normal font-small mb-0">
                Copyright © ProctoAI <span>{year}</span>. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
