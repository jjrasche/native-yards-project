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
