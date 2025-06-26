// components/SafetySection.js
import React from 'react';

const SafetySection = () => {
  return (
    <section className="section" id="safety">
      <div className="container">
        <h2 className="text-center">A Safer Way to Garden</h2>
        
        <div className="stats">
          <div className="stat">
            <div className="stat-value">84,944</div>
            <div className="stat-label">Annual Mowing Injuries</div>
          </div>
          <div className="stat">
            <div className="stat-value">0</div>
            <div className="stat-label">With Native Yards</div>
          </div>
        </div>
        
        <p className="text-center mt-4" style={{ maxWidth: '600px', margin: '32px auto' }}>
          Join thousands choosing a beautiful, maintenance-free yard that's safe for the whole family. 
          No more dangerous equipment, slippery grass, or chemical exposure.
        </p>
      </div>
    </section>
  );
};

export default SafetySection;
