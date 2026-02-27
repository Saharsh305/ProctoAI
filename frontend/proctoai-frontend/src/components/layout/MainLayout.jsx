import React from 'react';
import Navigation from '../common/Navigation';
import Footer from '../common/Footer';
import Preloader from '../common/Preloader';

const MainLayout = ({ children, showPreloader = false }) => {
  return (
    <div className="main-layout">
      {showPreloader && <Preloader />}
      <Navigation />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
