import React, { useState } from 'react';
import { Button } from './button';
import '../../styles/Navigation.css';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="nav-container">
        {/* Logo */}
        <a href="/" className="nav-logo">
          <img src="/logo.svg" alt="CareerKomodo" />
        </a>

        {/* Desktop Navigation */}
        <div className="nav-links">
          <a href="/home" className="nav-link">Home</a>
          <a href="/services" className="nav-link">Services</a>
          <a href="/mentors" className="nav-link">Find Mentors</a>
          <a href="/resources" className="nav-link">Resources</a>
          <a href="/about" className="nav-link">About</a>
        </div>

        {/* Auth Buttons */}
        <div className="nav-auth">
          <Button variant="outline" size="sm" onClick={() => {}}>Log In</Button>
          <Button size="sm" onClick={() => {}}>Sign Up</Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`nav-menu-button ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`nav-mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <a href="/home" className="nav-mobile-link">Home</a>
        <a href="/services" className="nav-mobile-link">Services</a>
        <a href="/mentors" className="nav-mobile-link">Find Mentors</a>
        <a href="/resources" className="nav-mobile-link">Resources</a>
        <a href="/about" className="nav-mobile-link">About</a>
        <div className="nav-mobile-auth">
          <Button variant="outline" className="w-full" onClick={() => {}}>Log In</Button>
          <Button className="w-full" onClick={() => {}}>Sign Up</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 