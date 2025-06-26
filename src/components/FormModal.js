// FormModal.js - Multi-step form component with Enter key support

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { generatePackage, formatPackageDisplay } from '../packageAlgorithm';
import { FORM_CONFIG } from '../formConfig';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const emptyForm = () => ({ email: '', zip_code: '', yard_size: '', time_commitment: '', desires: [], vibe: '', budget: '' });
const dummyForm = () => ({ email: 'jimjrasche@gmail.com', zip_code: '49525', yard_size: 3000, time_commitment: 'moderate', desires: ['edible', 'curb_appeal', 'low_maintenance'], vibe: '', budget: 'high' });


function FormModal({ onClose, onSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(dummyForm());
  const [loading, setLoading] = useState(false);
  const [generatedPackage, setGeneratedPackage] = useState(null);

  const totalSteps = FORM_CONFIG.steps.length;

  // Handle Enter key press
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Don't trigger on Enter if target is a checkbox, select, or textarea
      if (e.key === 'Enter' && !e.shiftKey && 
          e.target.type !== 'checkbox' && 
          e.target.tagName !== 'SELECT' && 
          e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (currentStep < totalSteps) {
          handleNext();
        } else if (currentStep === totalSteps && !loading) {
          handleSubmit();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentStep, formData, loading]);

  const handleDesireToggle = (desire) => {
    setFormData(prev => ({
      ...prev,
      desires: prev.desires.includes(desire)
        ? prev.desires.filter(d => d !== desire)
        : [...prev.desires, desire]
    }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.email) {
          alert('Please enter your email');
          return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
          alert('Please enter a valid email address');
          return false;
        }
        return true;
      case 2:
        if (!formData.zip_code) {
          alert('Please enter your ZIP code');
          return false;
        }
        if (!formData.yard_size) {
          alert('Please select your yard size');
          return false;
        }
        return true;
      case 3:
        return true; // Optional fields
      case 4:
        return true; // Optional fields
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep()) {
      return;
    }

    // Generate package when moving to step 5
    if (currentStep === 4) {
      const pkg = generatePackage(formData);
      setGeneratedPackage(pkg);
    }

    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([formData]);

      if (error) throw error;

      onSuccess(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    const stepConfig = FORM_CONFIG.steps[currentStep - 1];

    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h2>{stepConfig.title}</h2>
            <p className="mb-8">{stepConfig.subtitle}</p>
            
            <div className="form-group">
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="form-input"
                placeholder="you@example.com"
                autoFocus
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h2>{stepConfig.title}</h2>
            <p className="mb-8">{stepConfig.subtitle}</p>
            
            <div className="form-group">
              <label className="form-label">ZIP Code</label>
              <input
                type="text"
                required
                value={formData.zip_code}
                onChange={(e) => setFormData({...formData, zip_code: e.target.value.replace(/\D/g, '').slice(0, 5)})}
                className="form-input"
                placeholder="12345"
                autoFocus
                maxLength="5"
              />
            </div>

            <div className="form-group">
              <label className="form-label">How big is your yard?</label>
              <select
                value={formData.yard_size}
                onChange={(e) => setFormData({...formData, yard_size: e.target.value})}
                className="form-select"
              >
                <option value="">Select size</option>
                {FORM_CONFIG.yardSizes.map(size => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h2>{stepConfig.title}</h2>
            <p className="mb-8">{stepConfig.subtitle}</p>
            
            <div className="checkbox-grid">
              {FORM_CONFIG.desires.map(desire => (
                <label key={desire.value} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.desires.includes(desire.value)}
                    onChange={() => handleDesireToggle(desire.value)}
                    className="checkbox-input"
                  />
                  <span>{desire.label}</span>
                </label>
              ))}
            </div>

            <div className="form-group mt-4">
              <label className="form-label">How much time for yard work?</label>
              <select
                value={formData.time_commitment}
                onChange={(e) => setFormData({...formData, time_commitment: e.target.value})}
                className="form-select"
              >
                <option value="">Select commitment</option>
                {FORM_CONFIG.timeCommitments.map(commitment => (
                  <option key={commitment.value} value={commitment.value}>
                    {commitment.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h2>{stepConfig.title}</h2>
            <p className="mb-8">{stepConfig.subtitle}</p>
            
            <div className="form-group">
              <label className="form-label">What vibe appeals to you?</label>
              <select
                value={formData.vibe}
                onChange={(e) => setFormData({...formData, vibe: e.target.value})}
                className="form-select"
              >
                <option value="">Select style</option>
                {FORM_CONFIG.styles.map(style => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Initial investment budget</label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                className="form-select"
              >
                <option value="">Select budget</option>
                {FORM_CONFIG.budgets.map(budget => (
                  <option key={budget.value} value={budget.value}>
                    {budget.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <h2>{stepConfig.title}</h2>
            <p className="mb-8">{stepConfig.subtitle}</p>
            
            {generatedPackage && (
              <div className="success-box">
                <ul>
                  {formatPackageDisplay(generatedPackage).map((item, index) => (
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
                      ${generatedPackage.pricing.retail}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Your Discount:</span>
                    <span style={{ color: '#10b981' }}>-${generatedPackage.pricing.discount}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold' 
                  }}>
                    <span>Kit Price:</span>
                    <span style={{ color: '#10b981' }}>${generatedPackage.pricing.final}</span>
                  </div>
                </div>
              </div>
            )}

            <p style={{ marginTop: '24px', fontSize: '0.875rem', color: '#9ca3af' }}>
              This kit will transform {generatedPackage?.summary.totalCoverage.toLocaleString()} sq ft 
              and offset {generatedPackage?.summary.co2Offset} tons of CO₂ per year.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        {/* Progress indicator */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
              Step {currentStep} of {totalSteps}
            </span>
            <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
              {Math.round((currentStep / totalSteps) * 100)}% complete
            </span>
          </div>
          <div style={{ height: '4px', backgroundColor: '#374151', borderRadius: '2px' }}>
            <div 
              style={{ 
                width: `${(currentStep / totalSteps) * 100}%`, 
                height: '100%', 
                backgroundColor: '#10b981', 
                borderRadius: '2px',
                transition: 'width 0.3s ease'
              }} 
            />
          </div>
        </div>

        {renderStepContent()}

        {/* Navigation buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginTop: '32px' 
        }}>
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="btn"
              style={{ 
                flex: '1', 
                backgroundColor: '#374151',
                color: '#fff'
              }}
            >
              Back
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              className="btn btn-primary"
              style={{ flex: '2' }}
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn btn-primary"
              style={{ flex: '2', opacity: loading ? 0.5 : 1 }}
            >
              {loading ? 'Confirming...' : 'Confirm Package'}
            </button>
          )}
        </div>

        <p style={{ 
          textAlign: 'center', 
          marginTop: '16px', 
          fontSize: '0.875rem', 
          color: '#6b7280' 
        }}>
          Press Enter to continue
        </p>
      </div>
    </div>
  );
}

export default FormModal;