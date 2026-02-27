import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AboutCompany from './pages/AboutCompany';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AboutCompany />} />
        <Route path="/about" element={<AboutCompany />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
