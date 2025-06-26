// components/HeroSection.js
import React from 'react';
import { MESSAGING_VARIANTS } from '../useAnalytics';

const HeroSection = ({ stats, onCTAClick, analytics }) => {
  const { trackEvent, trackMessaging, messagingVariant } = analytics;
  const messaging = MESSAGING_VARIANTS[messagingVariant];

  const scrollToSection = (sectionId) => {
    trackEvent('section_navigation', { to_section: sectionId });
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCTAClick = () => {
    trackMessaging('hero_cta', messaging.hero);
    onCTAClick();
  };

  // Different CTA text based on variant
  const getCTAText = () => {
    switch(messagingVariant) {
      case 'A': return 'Get Your Weekends Back';
      case 'B': return 'Take Control Today';
      case 'C': return 'Join the Revolution';
      default: return 'Join the Waitlist';
    }
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-gradient"></div>
      
      <div className="container hero-content">
        <div className="text-center">
          <h1>{messaging.hero}</h1>
          
          <p className="hero-subtitle">{messaging.subhero}</p>
          
          <button 
            onClick={handleCTAClick}
            className="btn btn-primary btn-large"
          >
            {getCTAText()}
          </button>

          {/* Live Stats */}
          <div className="stats">
            <div className="stat">
              <div className="stat-value">{stats.totalYards}</div>
              <div className="stat-label">Yards Transformed</div>
            </div>
            <div className="stat">
              <div className="stat-value">{stats.co2Saved}</div>
              <div className="stat-label">Tons CO₂/Year Saved</div>
            </div>
          </div>

          <button 
            onClick={() => scrollToSection('how-it-works')}
            className="scroll-indicator"
            aria-label="Scroll down"
          >
            ↓
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
