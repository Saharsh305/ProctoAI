import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="header-global">
      <nav id="navbar-main" className="navbar navbar-main navbar-expand-lg navbar-theme-primary headroom navbar-dark navbar-transparent">
        <div className="container position-relative">
          <Link className="navbar-brand mr-lg-5" to="/">
            <img className="navbar-brand-dark" src="/assets/img/brand/light.svg" alt="Logo" />
            <img className="navbar-brand-light" src="/assets/img/brand/dark.svg" alt="Logo" />
          </Link>

          <div className={`navbar-collapse collapse ${isOpen ? 'show' : ''}`} id="navbar_global">
            <div className="navbar-collapse-header">
              <div className="row">
                <div className="col-6 collapse-brand">
                  <Link to="/">
                    <img src="/assets/img/brand/dark.svg" alt="Logo" />
                  </Link>
                </div>
                <div className="col-6 collapse-close">
                  <button 
                    className="btn-close" 
                    onClick={toggleMenu}
                    aria-label="Toggle navigation"
                  >
                    <span className="fas fa-times"></span>
                  </button>
                </div>
              </div>
            </div>

            <ul className="navbar-nav navbar-nav-hover align-items-lg-center">
              <li className="nav-item dropdown">
                <Link className="nav-link" to="#pages" data-toggle="dropdown">
                  <span className="nav-link-inner-text">Pages</span>
                  <span className="fas fa-angle-down nav-link-arrow ml-2"></span>
                </Link>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/about">About</Link></li>
                  <li><Link className="dropdown-item" to="/contact">Contact</Link></li>
                  <li><Link className="dropdown-item" to="/pricing">Pricing</Link></li>
                  <li><Link className="dropdown-item" to="/services">Services</Link></li>
                  <li><Link className="dropdown-item" to="/signin">Sign in</Link></li>
                  <li><Link className="dropdown-item" to="/signup">Sign up</Link></li>
                </ul>
              </li>

              <li className="nav-item dropdown mega-dropdown">
                <Link className="nav-link" to="#components" data-toggle="dropdown">
                  <span className="nav-link-inner-text">Components</span>
                  <span className="fas fa-angle-down nav-link-arrow ml-2"></span>
                </Link>
              </li>

              <li className="nav-item dropdown">
                <Link className="nav-link" to="#support" data-toggle="dropdown">
                  <span className="nav-link-inner-text">Support</span>
                  <span className="fas fa-angle-down nav-link-arrow ml-2"></span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="d-flex align-items-center">
            <button className="navbar-toggler ml-2" type="button" onClick={toggleMenu}>
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
