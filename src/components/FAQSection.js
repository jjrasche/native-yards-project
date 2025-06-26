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
