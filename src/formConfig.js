// formConfig.js - All form data sources in one place

export const FORM_CONFIG = {
  yardSizes: [
    { value: 'tiny', label: 'Tiny (< 1,000 sq ft)', sqft: 500 },
    { value: 'small', label: 'Small (1,000 - 5,000 sq ft)', sqft: 3000 },
    { value: 'medium', label: 'Medium (5,000 - 10,000 sq ft)', sqft: 7500 },
    { value: 'large', label: 'Large (10,000 - 20,000 sq ft)', sqft: 15000 },
    { value: 'xlarge', label: 'Extra Large (20,000+ sq ft)', sqft: 30000 }
  ],

  timeCommitments: [
    { value: 'none', label: 'None - Set it and forget it' },
    { value: 'minimal', label: 'Minimal - Few hours per season' },
    { value: 'moderate', label: 'Moderate - Few hours per month' },
    { value: 'active', label: 'Active - I enjoy gardening' }
  ],

  desires: [
    { value: 'low_maintenance', label: 'Save time on maintenance' },
    { value: 'water_saving', label: 'Reduce water usage' },
    { value: 'pollinators', label: 'Support pollinators' },
    { value: 'wildlife', label: 'Create wildlife habitat' },
    { value: 'edible', label: 'Grow food' },
    { value: 'curb_appeal', label: 'Improve curb appeal' },
    { value: 'save_money', label: 'Save money' },
    { value: 'climate', label: 'Fight climate change' },
    { value: 'educational', label: 'Educational for kids' },
    { value: 'beauty', label: 'Natural beauty' }
  ],

  styles: [
    { value: 'wild', label: 'Wild & Natural' },
    { value: 'cottage', label: 'Cottage Garden' },
    { value: 'modern', label: 'Modern & Structured' },
    { value: 'meadow', label: 'Prairie Meadow' },
    { value: 'woodland', label: 'Woodland Shade' },
    { value: 'desert', label: 'Xeriscape' },
    { value: 'mixed', label: 'Mix of Everything' }
  ],

  budgets: [
    { value: 'low', label: 'Under $200' },
    { value: 'medium', label: '$200 - $500' },
    { value: 'high', label: '$500 - $1,000' },
    { value: 'premium', label: '$1,000+' },
    { value: 'unsure', label: 'Not sure yet' }
  ],

  steps: [
    {
      id: 1,
      title: "Let's start with your email",
      subtitle: "We'll send your personalized native yard guide here.",
      fields: ['email']
    },
    {
      id: 2,
      title: "Tell us about your location",
      subtitle: "This helps us select native plants perfect for your climate.",
      fields: ['zip_code', 'yard_size']
    },
    {
      id: 3,
      title: "What are your goals?",
      subtitle: "Check all that apply - this helps us customize your kit.",
      fields: ['desires', 'time_commitment']
    },
    {
      id: 4,
      title: "Choose your style",
      subtitle: "Almost done! Let's talk aesthetics and budget.",
      fields: ['vibe', 'budget']
    },
    {
      id: 5,
      title: "Your Custom Native Yard Kit",
      subtitle: "Based on your preferences, here's what we recommend:",
      fields: []
    }
  ]
};

// Helper function to get square feet from yard size
export const getSquareFeet = (yardSize) => {
  const size = FORM_CONFIG.yardSizes.find(s => s.value === yardSize);
  return size?.sqft || 5000;
};