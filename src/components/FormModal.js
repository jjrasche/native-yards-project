// components/FormModal.js
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const FormModal = ({ onClose, onSuccess, analytics }) => {
  const { trackFormField, trackConversion, detectSegment, messagingVariant } = analytics;
  
  const [formData, setFormData] = useState({
    email: '',
    zip_code: '',
    property_type: '',
    yard_size: '',
    time_commitment: '',
    desires: [],
    safety_concerns: false,
    hoa_resident: false,
    vibe: '',
    budget: ''
  });
  const [loading, setLoading] = useState(false);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    trackFormField(field, value);
  };

  const handleDesireToggle = (desire) => {
    const newDesires = formData.desires.includes(desire)
      ? formData.desires.filter(d => d !== desire)
      : [...formData.desires, desire];
    
    handleFieldChange('desires', newDesires);
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.zip_code) {
      alert('Please fill in all required fields');
      return;
    }
    
    setLoading(true);

    try {
      // Track conversion with full context
      await trackConversion(formData);
      
      // Save to database with segments and variant
      const { error } = await supabase
        .from('waitlist')
        .insert([{
          ...formData,
          detected_segments: detectSegment(formData),
          messaging_variant: messagingVariant
        }]);

      if (error) throw error;
      onSuccess(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>Join the Native Yards Movement</h2>
        <p className="mb-8">Tell us about your yard and goals. This helps us create the perfect kit for you.</p>

        {/* Required Fields */}
        <div className="form-section">
          <h3 className="form-section-title">Contact Info</h3>
          
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              className="form-input"
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">ZIP Code *</label>
            <input
              type="text"
              required
              value={formData.zip_code}
              onChange={(e) => handleFieldChange('zip_code', e.target.value)}
              className="form-input"
              placeholder="12345"
            />
          </div>
        </div>

        {/* Property Details - For Segment Detection */}
        <div className="form-section">
          <h3 className="form-section-title">Your Property</h3>
          
          <div className="form-group">
            <label className="form-label">Property Type</label>
            <select
              value={formData.property_type}
              onChange={(e) => handleFieldChange('property_type', e.target.value)}
              className="form-select"
            >
              <option value="">Select type</option>
              <option value="single_family">Single Family Home</option>
              <option value="rental">Rental Property</option>
              <option value="multiple">Multiple Properties</option>
              <option value="commercial">Commercial Property</option>
              <option value="senior_living">Senior Living</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Yard Size</label>
            <select
              value={formData.yard_size}
              onChange={(e) => handleFieldChange('yard_size', e.target.value)}
              className="form-select"
            >
              <option value="">Select size</option>
              <option value="tiny">Tiny (&lt; 1,000 sq ft)</option>
              <option value="small">Small (1,000 - 5,000 sq ft)</option>
              <option value="medium">Medium (5,000 - 10,000 sq ft)</option>
              <option value="large">Large (10,000 - 20,000 sq ft)</option>
              <option value="xlarge">Extra Large (20,000+ sq ft)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">How much time do you want to spend on yard work?</label>
            <select
              value={formData.time_commitment}
              onChange={(e) => handleFieldChange('time_commitment', e.target.value)}
              className="form-select"
            >
              <option value="">Select time commitment</option>
              <option value="none">None - I want it to maintain itself</option>
              <option value="minimal">Minimal - A few hours per season</option>
              <option value="moderate">Moderate - A few hours per month</option>
              <option value="active">Active - I enjoy gardening</option>
            </select>
          </div>
        </div>

        {/* Goals */}
        <div className="form-section">
          <h3 className="form-section-title">What matters most to you?</h3>
          <p className="form-helper">Check all that apply</p>
          
          <div className="checkbox-grid">
            {[
              'Save time on maintenance',
              'Reduce water bills',
              'Safer yard (no mowing)',
              'Reduce maintenance calls',
              'Increase property value',
              'HOA compliance',
              'Curb appeal',
              'Save money',
              'Wildlife habitat',
              'Low maintenance beauty'
            ].map(desire => (
              <label key={desire} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.desires.includes(desire)}
                  onChange={() => handleDesireToggle(desire)}
                  className="checkbox-input"
                />
                <span>{desire}</span>
              </label>
            ))}
          </div>

          {/* Special checkboxes for segment detection */}
          <div style={{ marginTop: '24px' }}>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.safety_concerns}
                onChange={(e) => handleFieldChange('safety_concerns', e.target.checked)}
                className="checkbox-input"
              />
              <span>I'm concerned about lawn mowing safety</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.hoa_resident}
                onChange={(e) => handleFieldChange('hoa_resident', e.target.checked)}
                className="checkbox-input"
              />
              <span>I live in an HOA community</span>
            </label>
          </div>
        </div>

        {/* Style & Budget */}
        <div className="form-section">
          <h3 className="form-section-title">Style & Investment</h3>
          
          <div className="form-group">
            <label className="form-label">What look are you going for?</label>
            <select
              value={formData.vibe}
              onChange={(e) => handleFieldChange('vibe', e.target.value)}
              className="form-select"
            >
              <option value="">Select style</option>
              <option value="manicured">Clean & Manicured</option>
              <option value="cottage">Cottage Garden</option>
              <option value="modern">Modern & Structured</option>
              <option value="meadow">Natural Meadow</option>
              <option value="mixed">Mix of Everything</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Initial investment comfort level</label>
            <select
              value={formData.budget}
              onChange={(e) => handleFieldChange('budget', e.target.value)}
              className="form-select"
            >
              <option value="">Select budget</option>
              <option value="low">Under $200</option>
              <option value="medium">$200 - $500</option>
              <option value="high">$500 - $1,000</option>
              <option value="premium">$1,000+</option>
              <option value="unsure">Not sure yet</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn btn-primary"
          style={{ width: '100%', opacity: loading ? 0.5 : 1 }}
        >
          {loading ? 'Submitting...' : 'Join Waitlist'}
        </button>

        <p className="text-center mt-4" style={{ fontSize: '14px', color: '#9ca3af' }}>
          We'll create a custom native yard kit based on your specific needs and location.
        </p>
      </div>
    </div>
  );
};

export default FormModal;
