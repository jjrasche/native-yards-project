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
