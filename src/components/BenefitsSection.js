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
