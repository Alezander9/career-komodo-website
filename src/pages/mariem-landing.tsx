import React from 'react';
import Button from './Button';
import '../styles/LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Your Career Journey Starts Here</h1>
          <p className="hero-subtitle">
            Discover your path to success with personalized career guidance and expert mentorship
          </p>
          <div className="hero-cta">
            <Button size="large" variant="primary">Get Started</Button>
            <Button size="large" variant="outline">Learn More</Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose CareerKomodo?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Personalized Guidance</h3>
            <p>Get tailored career advice based on your unique goals and aspirations</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Expert Mentorship</h3>
            <p>Connect with industry professionals who've walked the path before you</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Career Growth</h3>
            <p>Access resources and tools to accelerate your professional development</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>Success Stories</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p className="testimonial-text">
              "CareerKomodo helped me navigate my career transition with confidence. The mentorship was invaluable!"
            </p>
            <div className="testimonial-author">
              <p className="author-name">Sarah Johnson</p>
              <p className="author-title">Software Engineer</p>
            </div>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-text">
              "The personalized guidance I received was exactly what I needed to take my career to the next level."
            </p>
            <div className="testimonial-author">
              <p className="author-name">Michael Chen</p>
              <p className="author-title">Product Manager</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Career?</h2>
          <p>Join other professionals who have found their path with CareerKomodo</p>
          <Button size="large" variant="primary">Start Your Journey</Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 