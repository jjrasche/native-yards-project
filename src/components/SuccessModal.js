// components/SuccessModal.js
import React from 'react';
import { formatPackageDisplay } from '../packageAlgorithm';

const SuccessModal = ({ onClose, stats, package: _package }) => {
  const packageItems = _package ? formatPackageDisplay(_package) : [];
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal success-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="success-icon">🌿</div>
        
        <h2>Welcome to the Movement!</h2>
        
        <p style={{ fontSize: '1.125rem', marginBottom: '24px' }}>
          You're part of {stats.totalYards} smart homeowners transforming 
          {' '}{Math.round(stats.totalYards * 0.2)} acres and saving 
          {' '}{stats.co2Saved} tons of CO₂ annually.
        </p>

        {_package && (
          <>
            <div className="success-box">
              <h3 style={{ marginBottom: '16px', color: '#10b981' }}>
                Your Custom Native Yard Kit:
              </h3>
              <ul>
                {packageItems.map((item, index) => (
                  <li key={index} style={{ marginBottom: '12px' }}>
                    <span style={{ marginRight: '8px' }}>{item.emoji}</span>
                    <strong>{item.name}</strong>
                    {item.detail && (
                      <span style={{ color: '#9ca3af', display: 'block', marginLeft: '28px' }}>
                        {item.detail}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              
              <div style={{ 
                marginTop: '24px', 
                paddingTop: '24px', 
                borderTop: '1px solid rgba(16, 185, 129, 0.3)' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Retail Value:</span>
                  <span style={{ textDecoration: 'line-through', color: '#9ca3af' }}>
                    ${_package.pricing.retail}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Your Discount:</span>
                  <span style={{ color: '#10b981' }}>-${_package.pricing.discount}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold' 
                }}>
                  <span>Kit Price:</span>
                  <span style={{ color: '#10b981' }}>${_package.pricing.final}</span>
                </div>
              </div>
            </div>

            <p style={{ marginTop: '24px', fontSize: '0.875rem', color: '#9ca3af' }}>
              This kit will transform {_package.summary.totalCoverage.toLocaleString()} sq ft 
              and offset {_package.summary.co2Offset} tons of CO₂ per year.
            </p>
          </>
        )}

        <div style={{ marginTop: '32px' }}>
          <h3>What's Next?</h3>
          <ul style={{ textAlign: 'left', marginTop: '16px' }}>
            <li>Check your email for your welcome guide</li>
            <li>We'll notify you when kits are available in your area</li>
            <li>Early access and exclusive discounts for waitlist members</li>
          </ul>
        </div>

        <button onClick={onClose} className="btn btn-primary" style={{ marginTop: '24px' }}>
          Got it!
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
