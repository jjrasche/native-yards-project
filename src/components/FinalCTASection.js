// components/FinalCTASection.js
import React from 'react';

const FinalCTASection = ({ stats, onCTAClick }) => {
  return (
    <section className="section text-center final-cta">
      <div className="container">
        <h2>Ready to Make the Switch?</h2>
        <p className="cta-subtitle">
          Join {stats.totalYards} smart homeowners who've already transformed their yards.
          <br />
          Be part of the solution.
        </p>
        <button 
          onClick={onCTAClick}
          className="btn btn-primary btn-large"
        >
          Join the Waitlist
        </button>
      </div>
    </section>
  );
};

export default FinalCTASection;
