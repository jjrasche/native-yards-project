// # PowerShell script to create Native Yards component structure
// # Run this from your project root directory (where package.json is located)

Write-Host "🌿 Setting up Native Yards component structure..." -ForegroundColor Green;

// # Create components directory
$componentsPath = "src/components"
if (!(Test-Path $componentsPath)) {
    New-Item -ItemType Directory -Path $componentsPath
    Write-Host "✓ Created components directory" -ForegroundColor Green
} else {
    Write-Host "! Components directory already exists" -ForegroundColor Yellow
}

// # Create useAnalytics.js
$analyticsContent = @'
// useAnalytics.js - Enhanced analytics hook based on market research
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Generate unique session ID
const generateSessionId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Detect potential customer segment based on behavior
const detectCustomerSegment = (formData, behavior) => {
  const segments = [];
  
  // Time-based detection
  const currentHour = new Date().getHours();
  if (currentHour >= 9 && currentHour <= 17) {
    segments.push('remote_worker');
  }
  
  // Form-based detection
  if (formData) {
    if (formData.time_commitment === 'none' || formData.time_commitment === 'minimal') {
      segments.push('busy_professional');
    }
    if (formData.desires?.includes('Save time on maintenance')) {
      segments.push('time_conscious');
    }
    if (formData.desires?.includes('Save money')) {
      segments.push('cost_conscious');
    }
    if (formData.budget === 'premium' || formData.budget === 'high') {
      segments.push('premium_buyer');
    }
  }
  
  // Behavior-based detection
  if (behavior?.viewedSafetyBenefits) {
    segments.push('safety_conscious');
  }
  if (behavior?.viewedHOACompliance) {
    segments.push('hoa_resident');
  }
  if (behavior?.multiplePropertyInquiry) {
    segments.push('landlord');
  }
  
  return segments;
};

// A/B test messaging variants
const getMessagingVariant = () => {
  const variants = {
    A: {
      hero: "Smart Yards That Maintain Themselves",
      cta: "Get Your Weekends Back",
      benefits: ['time_savings', 'cost_savings', 'property_value']
    },
    B: {
      hero: "Your Yard, Your Choice",
      cta: "Cut Maintenance by 80%",
      benefits: ['property_rights', 'cost_savings', 'safety']
    },
    C: {
      hero: "The Future of American Lawns",
      cta: "Join the Smart Yard Revolution",
      benefits: ['innovation', 'time_savings', 'curb_appeal']
    }
  };
  
  // Stable variant assignment based on session
  const variantKeys = Object.keys(variants);
  const index = parseInt(generateSessionId().substr(-1), 16) % variantKeys.length;
  return variantKeys[index];
};

export const useAnalytics = () => {
  const [sessionId] = useState(() => generateSessionId());
  const [messagingVariant] = useState(() => getMessagingVariant());
  const [stepTimings, setStepTimings] = useState({});
  const [userBehavior, setUserBehavior] = useState({});
  const [conversionPath, setConversionPath] = useState([]);

  // Track page view with messaging variant
  useEffect(() => {
    trackEvent('page_view', {
      messaging_variant: messagingVariant,
      referrer: document.referrer,
      landing_page: window.location.pathname
    });
  }, []);

  // Core tracking function
  const trackEvent = useCallback(async (eventType, data = {}) => {
    const eventData = {
      session_id: sessionId,
      event_type: eventType,
      timestamp: new Date().toISOString(),
      messaging_variant: messagingVariant,
      customer_segments: detectCustomerSegment(data.formData, userBehavior),
      ...data
    };

    try {
      await supabase.from('analytics').insert(eventData);
      
      // Update conversion path
      setConversionPath(prev => [...prev, { eventType, timestamp: Date.now() }]);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }, [sessionId, messagingVariant, userBehavior]);

  // Track messaging effectiveness
  const trackMessaging = useCallback((element, message) => {
    trackEvent('messaging_interaction', {
      element,
      message,
      avoided_terms: false // Flag if using recommended messaging
    });
  }, [trackEvent]);

  // Track benefit interactions
  const trackBenefit = useCallback((benefitType, action) => {
    const benefitMap = {
      time_savings: 'busy_professional',
      cost_savings: 'cost_conscious',
      safety: 'senior',
      property_value: 'landlord',
      hoa_compliance: 'hoa_resident'
    };

    setUserBehavior(prev => ({
      ...prev,
      [`viewed${benefitType}`]: true
    }));

    trackEvent('benefit_interaction', {
      benefit_type: benefitType,
      action,
      potential_segment: benefitMap[benefitType]
    });
  }, [trackEvent]);

  // Track form field interactions
  const trackFormField = useCallback((fieldName, value) => {
    // Detect multi-property interest
    if (fieldName === 'yard_size' && value === 'xlarge') {
      setUserBehavior(prev => ({ ...prev, multiplePropertyInquiry: true }));
    }

    trackEvent('form_field_interaction', {
      field_name: fieldName,
      field_value: value,
      field_category: getFieldCategory(fieldName)
    });
  }, [trackEvent]);

  // Track conversion with full context
  const trackConversion = useCallback(async (formData) => {
    const segments = detectCustomerSegment(formData, userBehavior);
    const pathDuration = conversionPath.length > 0 
      ? Date.now() - conversionPath[0].timestamp 
      : 0;

    await trackEvent('conversion', {
      form_data: formData,
      customer_segments: segments,
      conversion_path: conversionPath,
      path_duration: pathDuration,
      messaging_effectiveness: messagingVariant
    });

    // Track segment-specific conversion
    segments.forEach(segment => {
      trackEvent('segment_conversion', {
        segment,
        form_data: formData
      });
    });
  }, [trackEvent, userBehavior, conversionPath, messagingVariant]);

  // Track exit intent
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) {
        trackEvent('exit_intent', {
          last_interaction: conversionPath[conversionPath.length - 1],
          time_on_site: Date.now() - parseInt(sessionId.split('-')[0])
        });
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [conversionPath, sessionId, trackEvent]);

  // Step tracking (original functionality)
  const startStep = useCallback((step) => {
    setStepTimings(prev => ({
      ...prev,
      [step]: Date.now()
    }));
    trackEvent('step_started', { step });
  }, [trackEvent]);

  const completeStep = useCallback((step) => {
    const duration = Date.now() - (stepTimings[step] || Date.now());
    trackEvent('step_completed', { step, duration });
  }, [stepTimings, trackEvent]);

  return {
    // Core tracking
    trackEvent,
    startStep,
    completeStep,
    
    // Enhanced tracking
    trackMessaging,
    trackBenefit,
    trackFormField,
    trackConversion,
    
    // A/B testing
    messagingVariant,
    
    // Segment detection
    detectSegment: (formData) => detectCustomerSegment(formData, userBehavior)
  };
};

// Helper function to categorize form fields
const getFieldCategory = (fieldName) => {
  const categories = {
    email: 'contact',
    zip_code: 'location',
    yard_size: 'property',
    time_commitment: 'lifestyle',
    desires: 'goals',
    vibe: 'aesthetic',
    budget: 'financial'
  };
  return categories[fieldName] || 'other';
};

// Export messaging variants for use in components
export const MESSAGING_VARIANTS = {
  A: {
    hero: "Smart Yards That Maintain Themselves",
    subhero: "Join thousands reclaiming their weekends with intelligent landscaping",
    benefits: [
      { icon: "⏰", text: "Save 10+ hours monthly" },
      { icon: "💰", text: "Cut maintenance costs by 80%" },
      { icon: "🏡", text: "Boost property value" }
    ]
  },
  B: {
    hero: "Your Yard, Your Choice",
    subhero: "Take control with low-maintenance native landscaping",
    benefits: [
      { icon: "🏡", text: "Your property, your rules" },
      { icon: "💰", text: "Reduce costs by 80%" },
      { icon: "🛡️", text: "Safe, no-mow solution" }
    ]
  },
  C: {
    hero: "The Future of American Lawns",
    subhero: "Smart homeowners are switching to self-maintaining yards",
    benefits: [
      { icon: "🚀", text: "Cutting-edge yard tech" },
      { icon: "⏰", text: "Automated maintenance" },
      { icon: "✨", text: "Next-level curb appeal" }
    ]
  }
};
'@

// # Component templates
$components = @{
    "HeroSection.js" = @'
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
'@

    "BenefitsSection.js" = @'
// components/BenefitsSection.js
import React from 'react';

const BenefitsSection = ({ analytics }) => {
  const { trackBenefit, messagingVariant } = analytics;

  // Benefits tailored to different segments based on research
  const benefits = [
    {
      id: 'time_savings',
      icon: '⏰',
      title: 'Save 10+ Hours/Month',
      description: 'No more weekly mowing. Native plants maintain themselves.',
      segment: 'busy_professional'
    },
    {
      id: 'cost_savings',
      icon: '💰',
      title: 'Cut Costs by 80%',
      description: 'Eliminate gas, fertilizer, and water bills. Save $500-2000 annually.',
      segment: 'cost_conscious'
    },
    {
      id: 'safety',
      icon: '🛡️',
      title: 'Safer for Your Family',
      description: 'No dangerous mowing. No chemical exposure. Just natural beauty.',
      segment: 'senior'
    },
    {
      id: 'property_value',
      icon: '📈',
      title: 'Boost Property Value',
      description: 'Modern landscaping that reduces maintenance calls by 80%.',
      segment: 'landlord'
    },
    {
      id: 'hoa_compliance',
      icon: '✅',
      title: 'HOA Approved Designs',
      description: 'Professional plans that meet community standards.',
      segment: 'hoa_resident'
    },
    {
      id: 'innovation',
      icon: '🚀',
      title: 'Smart Landscaping',
      description: 'Data-driven plant selection for your exact conditions.',
      segment: 'tech_savvy'
    }
  ];

  // Different heading based on messaging variant
  const getHeading = () => {
    switch(messagingVariant) {
      case 'B': return 'Your Yard, Your Benefits';
      case 'C': return 'The Smart Yard Advantage';
      default: return 'Why Choose Native Yards?';
    }
  };

  return (
    <section className="section bg-dark" id="benefits">
      <div className="container">
        <h2 className="text-center">{getHeading()}</h2>
        
        <div className="grid grid-3">
          {benefits.map(benefit => (
            <div 
              key={benefit.id}
              className="card" 
              onClick={() => trackBenefit(benefit.id, 'click')}
              onMouseEnter={() => trackBenefit(benefit.id, 'hover')}
              style={{ cursor: 'pointer' }}
            >
              <div className="icon">{benefit.icon}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
'@

    "HowItWorksSection.js" = @'
// components/HowItWorksSection.js
import React from 'react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '1',
      title: 'Get Your Custom Kit',
      description: 'Receive native plants and seeds specifically chosen for your region and yard conditions.'
    },
    {
      number: '2',
      title: 'Simple Setup',
      description: 'Follow our easy guide to replace sections of lawn. No experience needed - natives are forgiving!'
    },
    {
      number: '3',
      title: 'Enjoy & Relax',
      description: 'Watch your yard transform while doing less work. Native plants maintain themselves.'
    }
  ];

  return (
    <section className="section" id="how-it-works">
      <div className="container">
        <h2 className="text-center mb-16">How It Works</h2>
        
        <div className="grid grid-3">
          {steps.map(step => (
            <div key={step.number} className="card">
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
'@

    "SafetySection.js" = @'
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
'@

    "FAQSection.js" = @'
// components/FAQSection.js
import React from 'react';

const FAQSection = () => {
  const faqs = [
    {
      question: 'Is this legal in my area?',
      answer: 'Our kits include a guide to local ordinances. Most areas allow native landscaping, and we\'ll help you navigate any restrictions.'
    },
    {
      question: 'What if I have no gardening experience?',
      answer: 'Perfect! Native plants are much more forgiving than traditional gardens. If you can dig a hole, you can do this.'
    },
    {
      question: 'Will this work with my HOA?',
      answer: 'Yes! Our designs look intentional and maintained. We provide documentation showing how native landscapes increase property values and support local ordinances.'
    },
    {
      question: 'How much maintenance is really required?',
      answer: 'After the first year of establishment, expect 2-4 hours per season. Compare that to 2-4 hours per week with traditional lawns!'
    },
    {
      question: 'When will kits be available?',
      answer: 'We\'re launching in Spring 2026, starting with select regions. Join the waitlist for early access and exclusive discounts.'
    }
  ];

  return (
    <section className="section" id="faq">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h2 className="text-center">Common Questions</h2>
        
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
'@

    "FinalCTASection.js" = @'
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
'@

    "FormModal.js" = @'
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
'@

    "SuccessModal.js" = @'
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
'@
}

// # Create useAnalytics.js
$analyticsPath = "src/useAnalytics.js"
$analyticsContent | Out-File -FilePath $analyticsPath -Encoding UTF8
Write-Host "✓ Created useAnalytics.js" -ForegroundColor Green

// # Create each component file
foreach ($component in $components.GetEnumerator()) {
    $filePath = Join-Path $componentsPath $component.Key
    $component.Value | Out-File -FilePath $filePath -Encoding UTF8
    Write-Host "✓ Created $($component.Key)" -ForegroundColor Green
}

// # Create updated App.js content
$appJsContent = @'
// App.js - Clean component structure
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAnalytics } from './useAnalytics';

// Import components
import HeroSection from './components/HeroSection';
import BenefitsSection from './components/BenefitsSection';
import HowItWorksSection from './components/HowItWorksSection';
import SafetySection from './components/SafetySection';
import FAQSection from './components/FAQSection';
import FinalCTASection from './components/FinalCTASection';
import FormModal from './components/FormModal';
import SuccessModal from './components/SuccessModal';

// Import utilities
import { generatePackage } from './packageAlgorithm';

// Initialize Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [stats, setStats] = useState({ totalYards: 0, co2Saved: 0 });
  const [userPackage, setUserPackage] = useState(null);
  
  // Initialize analytics
  const analytics = useAnalytics();

  useEffect(() => {
    fetchStats();
    
    // Escape key handler
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowForm(false);
        setShowSuccess(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const fetchStats = async () => {
    try {
      const { count } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true });
      
      const yardsCount = count || 0;
      const avgYardAcres = 0.2;
      const co2PerAcre = 1.5;
      const co2Tons = Math.round(yardsCount * avgYardAcres * co2PerAcre);
      
      setStats({ totalYards: yardsCount, co2Saved: co2Tons });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFormSuccess = (formData) => {
    setShowForm(false);
    setShowSuccess(true);
    setUserPackage(generatePackage(formData));
    fetchStats();
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      <HeroSection 
        stats={stats}
        onCTAClick={() => setShowForm(true)}
        analytics={analytics}
      />
      
      <HowItWorksSection />
      
      <BenefitsSection analytics={analytics} />
      
      <SafetySection />
      
      <FAQSection />
      
      <FinalCTASection 
        stats={stats}
        onCTAClick={() => setShowForm(true)}
      />

      {showForm && (
        <FormModal 
          onClose={() => setShowForm(false)} 
          onSuccess={handleFormSuccess}
          analytics={analytics}
        />
      )}

      {showSuccess && (
        <SuccessModal 
          onClose={() => setShowSuccess(false)} 
          stats={stats}
          package={userPackage}
        />
      )}
    </div>
  );
}

export default App;
'@

// # Backup existing App.js and create new one
$appJsPath = "src/App.js"
if (Test-Path $appJsPath) {
    Copy-Item $appJsPath "$appJsPath.backup"
    Write-Host "✓ Backed up existing App.js to App.js.backup" -ForegroundColor Yellow
}

$appJsContent | Out-File -FilePath $appJsPath -Encoding UTF8
Write-Host "✓ Updated App.js" -ForegroundColor Green

// # Create SQL schema file
$sqlContent = @'
-- Analytics table schema for Supabase
CREATE TABLE analytics (
  id BIGSERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  messaging_variant CHAR(1),
  customer_segments TEXT[],
  
  -- Event-specific data
  element VARCHAR(255),
  message TEXT,
  benefit_type VARCHAR(100),
  action VARCHAR(50),
  field_name VARCHAR(100),
  field_value TEXT,
  field_category VARCHAR(50),
  
  -- Conversion data
  form_data JSONB,
  conversion_path JSONB,
  path_duration INTEGER,
  
  -- Behavioral data
  referrer TEXT,
  landing_page VARCHAR(255),
  last_interaction JSONB,
  time_on_site INTEGER,
  
  -- Performance
  duration INTEGER,
  step VARCHAR(100),
  
  -- Indexing for performance
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_analytics_session ON analytics(session_id);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_timestamp ON analytics(timestamp);
CREATE INDEX idx_analytics_variant ON analytics(messaging_variant);
CREATE INDEX idx_analytics_segments ON analytics USING GIN(customer_segments);

-- Update waitlist table to track segments and messaging
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS detected_segments TEXT[];
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS messaging_variant CHAR(1);
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS conversion_source VARCHAR(100);

-- View for segment analysis
CREATE VIEW segment_performance AS
SELECT 
  segment,
  COUNT(*) as total_conversions,
  AVG(CASE WHEN budget = 'premium' OR budget = 'high' THEN 1 ELSE 0 END) as premium_rate,
  AVG(CASE WHEN yard_size IN ('large', 'xlarge') THEN 1 ELSE 0 END) as large_yard_rate
FROM waitlist, unnest(detected_segments) AS segment
GROUP BY segment;

-- View for messaging performance
CREATE VIEW messaging_performance AS
SELECT 
  messaging_variant,
  COUNT(*) as conversions,
  AVG(CASE WHEN budget IN ('premium', 'high') THEN 1 ELSE 0 END) as high_value_rate,
  COUNT(DISTINCT zip_code) as geographic_spread
FROM waitlist
WHERE messaging_variant IS NOT NULL
GROUP BY messaging_variant;
'@

$sqlContent | Out-File -FilePath "supabase_analytics_schema.sql" -Encoding UTF8
Write-Host "✓ Created supabase_analytics_schema.sql" -ForegroundColor Green

// # Create .env template if it doesn't exist
$envPath = ".env"
if (!(Test-Path $envPath)) {
    $envContent = @'
// # Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
'@
    $envContent | Out-File -FilePath $envPath -Encoding UTF8
    Write-Host "✓ Created .env template (add your Supabase credentials)" -ForegroundColor Yellow
}

Write-Host "`n🎉 Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Update .env with your Supabase credentials" -ForegroundColor White
Write-Host "2. Run the SQL in supabase_analytics_schema.sql in your Supabase dashboard" -ForegroundColor White
Write-Host "3. npm start to run your app" -ForegroundColor White
Write-Host "`nFile structure created:" -ForegroundColor Cyan
Write-Host "  src/" -ForegroundColor White
Write-Host "  ├── App.js (updated)" -ForegroundColor Green
Write-Host "  ├── useAnalytics.js (new)" -ForegroundColor Green
Write-Host "  └── components/ (new)" -ForegroundColor Green
Write-Host "      ├── HeroSection.js" -ForegroundColor Green
Write-Host "      ├── BenefitsSection.js" -ForegroundColor Green
Write-Host "      ├── HowItWorksSection.js" -ForegroundColor Green
Write-Host "      ├── SafetySection.js" -ForegroundColor Green
Write-Host "      ├── FAQSection.js" -ForegroundColor Green
Write-Host "      ├── FinalCTASection.js" -ForegroundColor Green
Write-Host "      ├── FormModal.js" -ForegroundColor Green
Write-Host "      └── SuccessModal.js" -ForegroundColor Green