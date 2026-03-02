import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <header className="header-global">
      <nav id="navbar-main" className="navbar navbar-main navbar-expand-lg navbar-theme-primary headroom navbar-dark navbar-transparent">
        <div className="container position-relative">
          <Link className="navbar-brand mr-lg-5" to="/">
            <span className="font-weight-bold" style={{ fontSize: '1.25rem', letterSpacing: '0.5px' }}>ProctoAI</span>
          </Link>

          <div className={`navbar-collapse collapse ${isOpen ? 'show' : ''}`} id="navbar_global">
            <div className="navbar-collapse-header">
              <div className="row">
                <div className="col-6 collapse-brand">
                  <Link to="/" className="font-weight-bold text-primary">ProctoAI</Link>
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
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  <span className="nav-link-inner-text">About</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">
                  <span className="nav-link-inner-text">Contact</span>
                </Link>
              </li>
              {user && (
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    <span className="nav-link-inner-text">Dashboard</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="d-flex align-items-center">
            {user ? (
              <>
                <span className="mr-3" style={{ fontSize: '0.875rem' }}>Hi, {user.name}</span>
                <button className="btn btn-sm btn-outline-soft" onClick={handleLogout}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="btn btn-sm btn-outline-soft mr-2">Sign in</Link>
                <Link to="/signup" className="btn btn-sm btn-tertiary">Sign up</Link>
              </>
            )}
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
