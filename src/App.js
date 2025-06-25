import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { generatePackage, formatPackageDisplay } from './packageAlgorithm';

// Initialize Supabase client - replace with your actual keys
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Main App Component
function App() {
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [stats, setStats] = useState({ totalYards: 0, co2Saved: 0 });
  const [userPackage, setUserPackage] = useState(null);

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

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-gradient"></div>
        
        <div className="container hero-content">
          <div className="text-center">
            <h1>
              Transform Your Yard.
              <br />
              <span className="text-green">Fight Climate Change.</span>
            </h1>
            
            <p className="hero-subtitle">
              Convert your high-maintenance lawn into a beautiful native ecosystem. 
              Less work. More impact. Join thousands making the switch.
            </p>
            
            <button 
              onClick={() => setShowForm(true)}
              className="btn btn-primary btn-large"
            >
              Join the Waitlist
            </button>

            {/* Live Stats */}
            <div className="stats">
              <div className="stat">
                <div className="stat-value">{stats.totalYards}</div>
                <div className="stat-label">Yards Pledged</div>
              </div>
              <div className="stat">
                <div className="stat-value">{stats.co2Saved}</div>
                <div className="stat-label">Tons CO₂/Year</div>
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

      {/* How It Works Section */}
      <section className="section" id="how-it-works">
        <div className="container">
          <h2 className="text-center mb-16">How It Works</h2>
          
          <div className="grid grid-3">
            <div className="card">
              <div className="step-number">1</div>
              <h3>Get Your Custom Kit</h3>
              <p>Receive native plants and seeds specifically chosen for your region and yard conditions.</p>
            </div>
            <div className="card">
              <div className="step-number">2</div>
              <h3>Simple Setup</h3>
              <p>Follow our easy guide to replace sections of lawn. No experience needed - natives are forgiving!</p>
            </div>
            <div className="card">
              <div className="step-number">3</div>
              <h3>Enjoy & Relax</h3>
              <p>Watch your yard transform while doing less work. Native plants maintain themselves.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section bg-dark" id="benefits">
        <div className="container">
          <h2 className="text-center">Why Native Yards?</h2>
          
          <div className="grid grid-3">
            <div className="card">
              <div className="icon">⏰</div>
              <h3>Save 10+ Hours/Month</h3>
              <p>No more weekly mowing, watering, or fertilizing. Native plants thrive on their own.</p>
            </div>
            <div className="card">
              <div className="icon">💰</div>
              <h3>Cut Costs by 75%</h3>
              <p>Eliminate gas, fertilizer, and most water bills. Save $500-2000 annually.</p>
            </div>
            <div className="card">
              <div className="icon">🌍</div>
              <h3>Real Climate Impact</h3>
              <p>Each yard sequesters 0.3 tons CO₂/year - equivalent to planting 7 trees annually.</p>
            </div>
            <div className="card">
              <div className="icon">🦋</div>
              <h3>Wildlife Haven</h3>
              <p>Support 10x more pollinators, birds, and beneficial insects than traditional lawns.</p>
            </div>
            <div className="card">
              <div className="icon">🏡</div>
              <h3>Unique Curb Appeal</h3>
              <p>Stand out with a dynamic, seasonally-changing landscape that tells a story.</p>
            </div>
            <div className="card">
              <div className="icon">🌊</div>
              <h3>Water Conservation</h3>
              <p>Use 50-75% less water. Deep-rooted natives tap into natural groundwater.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section" id="faq">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 className="text-center">Common Questions</h2>
          
          <div className="faq-item">
            <h3>Is this legal in my area?</h3>
            <p>Our kits include a guide to local ordinances. Most areas allow native landscaping, and we'll help you navigate any restrictions.</p>
          </div>
          
          <div className="faq-item">
            <h3>What if I have no gardening experience?</h3>
            <p>Perfect! Native plants are much more forgiving than traditional gardens. If you can dig a hole, you can do this.</p>
          </div>
          
          <div className="faq-item">
            <h3>Will this work with my HOA?</h3>
            <p>Yes! Our designs look intentional and maintained. We provide documentation showing how native landscapes increase property values and support local ordinances.</p>
          </div>
          
          <div className="faq-item">
            <h3>When will kits be available?</h3>
            <p>We're launching in Spring 2026, starting with select regions. Join the waitlist for early access.</p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section text-center final-cta">
        <div className="container">
          <h2>Ready to Make the Switch?</h2>
          <p className="cta-subtitle">
            Join {stats.totalYards} others committed to transforming their yards.
            <br />
            Be part of the solution.
          </p>
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary btn-large"
          >
            Join the Waitlist
          </button>
        </div>
      </section>

      {/* Form Modal */}
      {showForm && (
        <FormModal 
        onClose={() => setShowForm(false)} 
        onSuccess={(formData) => {  // Now receives formData
            setShowForm(false);
            setShowSuccess(true);
            setUserPackage(generatePackage(formData)); // Generate package
            fetchStats();
        }}
        />
      )}

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal 
        onClose={() => setShowSuccess(false)} 
        stats={stats}
        package={userPackage}  // Pass package
        />
      )}
    </div>
  );
}

// Form Modal Component
function FormModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    zip_code: '',
    yard_size: '',
    time_commitment: '',
    desires: [],
    vibe: '',
    budget: ''
  });
  const [loading, setLoading] = useState(false);

  const handleDesireToggle = (desire) => {
    setFormData(prev => ({
      ...prev,
      desires: prev.desires.includes(desire)
        ? prev.desires.filter(d => d !== desire)
        : [...prev.desires, desire]
    }));
  };

    const handleSubmit = async () => {
    if (!formData.email || !formData.zip_code) {
        alert('Please fill in all required fields');
        return;
    }
    
    setLoading(true);

    try {
        const { error } = await supabase
        .from('waitlist')
        .insert([formData]);

        if (error) throw error;

        onSuccess(formData); // Pass formData to parent
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
              onChange={(e) => setFormData({...formData, email: e.target.value})}
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
              onChange={(e) => setFormData({...formData, zip_code: e.target.value})}
              className="form-input"
              placeholder="12345"
            />
          </div>
        </div>

        {/* Yard Details */}
        <div className="form-section">
          <h3 className="form-section-title">Your Yard</h3>
          
          <div className="form-group">
            <label className="form-label">Yard Size</label>
            <select
              value={formData.yard_size}
              onChange={(e) => setFormData({...formData, yard_size: e.target.value})}
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
              onChange={(e) => setFormData({...formData, time_commitment: e.target.value})}
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
          <h3 className="form-section-title">What do you want from your yard?</h3>
          <p className="form-helper">Check all that apply</p>
          
          <div className="checkbox-grid">
            {[
              'Save time on maintenance',
              'Reduce water usage',
              'Support pollinators',
              'Create wildlife habitat',
              'Grow food',
              'Improve curb appeal',
              'Save money',
              'Fight climate change',
              'Educational for kids',
              'Natural beauty'
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
        </div>

        {/* Style & Budget */}
        <div className="form-section">
          <h3 className="form-section-title">Style & Investment</h3>
          
          <div className="form-group">
            <label className="form-label">What vibe are you going for?</label>
            <select
              value={formData.vibe}
              onChange={(e) => setFormData({...formData, vibe: e.target.value})}
              className="form-select"
            >
              <option value="">Select style</option>
              <option value="wild">Wild & Natural</option>
              <option value="cottage">Cottage Garden</option>
              <option value="modern">Modern & Structured</option>
              <option value="meadow">Prairie Meadow</option>
              <option value="woodland">Woodland Shade</option>
              <option value="desert">Xeriscape</option>
              <option value="mixed">Mix of Everything</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Budget for initial conversion</label>
            <select
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
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
          This info helps us create the perfect kit for your specific yard and climate.
        </p>
      </div>
    </div>
  );
}

// Success Modal Component
function SuccessModal({ onClose, stats, package: _package }) {
  const packageItems = _package ? formatPackageDisplay(_package) : [];
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal success-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="success-icon">🌿</div>
        
        <h2>Welcome to the Movement!</h2>
        
        <p style={{ fontSize: '1.125rem', marginBottom: '24px' }}>
          You're part of {stats.totalYards} households transforming 
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
            <li>Join our community for tips and support</li>
          </ul>
        </div>

        <button onClick={onClose} className="btn btn-primary" style={{ marginTop: '24px' }}>
          Got it!
        </button>
      </div>
    </div>
  );
}

export default App;