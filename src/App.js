import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client - replace with your actual keys
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [stats, setStats] = useState({ totalYards: 0, co2Saved: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { count } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true });
      
      // Based on research: avg yard = 0.2 acres, native ecosystems sequester 0.5-2.0 tons CO2/acre/year
      // Using conservative estimate of 1.0 ton/acre + eliminating lawn emissions (~0.5 ton/acre)
      // Net benefit: ~1.5 tons CO2/acre/year
      const yardsCount = count || 0;
      const avgYardAcres = 0.2;
      const co2PerAcre = 1.5; // Net benefit including eliminated emissions
      const co2Tons = Math.round(yardsCount * avgYardAcres * co2PerAcre);
      
      setStats({ totalYards: yardsCount, co2Saved: co2Tons });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {currentPage === 'landing' && <LandingPage setCurrentPage={setCurrentPage} stats={stats} />}
      {currentPage === 'form' && <FormPage setCurrentPage={setCurrentPage} refreshStats={fetchStats} />}
      {currentPage === 'success' && <SuccessPage setCurrentPage={setCurrentPage} stats={stats} />}
    </div>
  );
}

// Landing Page Component
function LandingPage({ setCurrentPage, stats }) {
  return (
    <div className="relative overflow-hidden">
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">Native Yards</div>
          <button 
            onClick={() => setCurrentPage('form')}
            className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-full font-medium transition-colors"
          >
            Join Waitlist
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-transparent"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            Kill your lawn.
            <br />
            <span className="text-green-500">Save the planet.</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Convert your water-guzzling grass into a native ecosystem. 
            It's lazy gardening that sequesters carbon.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={() => setCurrentPage('form')}
              className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-full text-lg font-medium transition-all transform hover:scale-105"
            >
              Get Your Kit →
            </button>
            <button className="border border-gray-600 hover:border-gray-400 px-8 py-4 rounded-full text-lg font-medium transition-colors">
              Learn More
            </button>
          </div>

          {/* Live Stats */}
          <div className="flex gap-8 justify-center text-center">
            <div>
              <div className="text-3xl font-bold text-green-500">{stats.totalYards}</div>
              <div className="text-gray-400">Yards Pledged</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-500">{stats.co2Saved}</div>
              <div className="text-gray-400">Tons CO₂/Year</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why Go Native?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-xl font-bold mb-2">Zero Maintenance</h3>
              <p className="text-gray-400">Native plants thrive on neglect. No mowing, minimal watering, no fertilizer.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-bold mb-2">Climate Impact</h3>
              <p className="text-gray-400">Sequester 3 tons of CO₂ per acre annually. That's like taking a car off the road.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🦋</div>
              <h3 className="text-xl font-bold mb-2">Biodiversity Boost</h3>
              <p className="text-gray-400">Create habitat for pollinators, birds, and beneficial insects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to kill your lawn?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the waitlist for our conversion kits. Launching Spring 2025.
          </p>
          <button 
            onClick={() => setCurrentPage('form')}
            className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-full text-lg font-medium transition-all transform hover:scale-105"
          >
            Join Waitlist →
          </button>
        </div>
      </section>
    </div>
  );
}

// Form Page Component (Placeholder - user will provide their own)
function FormPage({ setCurrentPage, refreshStats }) {
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

      await refreshStats();
      setCurrentPage('success');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full">
        <button 
          onClick={() => setCurrentPage('landing')}
          className="mb-8 text-gray-400 hover:text-white transition-colors"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold mb-2">Join the Native Yards Waitlist</h1>
        <p className="text-gray-400 mb-8">Get early access to our lawn conversion kits.</p>

        {/* Placeholder form - replace with user's dynamic form component */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">ZIP Code</label>
            <input
              type="text"
              required
              value={formData.zip_code}
              onChange={(e) => setFormData({...formData, zip_code: e.target.value})}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
              placeholder="12345"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Yard Size</label>
            <select
              value={formData.yard_size}
              onChange={(e) => setFormData({...formData, yard_size: e.target.value})}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
            >
              <option value="">Select size</option>
              <option value="small">Small (&lt; 1/4 acre)</option>
              <option value="medium">Medium (1/4 - 1/2 acre)</option>
              <option value="large">Large (&gt; 1/2 acre)</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 px-8 py-4 rounded-full text-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Join Waitlist'}
          </button>
        </div>

        <p className="text-sm text-gray-400 mt-6 text-center">
          We'll only email you about your native yard kit. No spam, ever.
        </p>
      </div>
    </div>
  );
}

// Success Page Component
function SuccessPage({ setCurrentPage, stats }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <div className="text-6xl mb-6">🌿</div>
        
        <h1 className="text-4xl font-bold mb-4">You're on the list!</h1>
        
        <p className="text-xl text-gray-300 mb-8">
          You're part of a movement that's already pledged to convert {stats.totalYards} yards, 
          saving {stats.co2Saved} tons of CO₂ annually.
        </p>

        <div className="bg-gray-900/50 p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-bold mb-4">What's Next?</h2>
          <ul className="text-left space-y-3 text-gray-300">
            <li>✓ We'll email you when kits are ready (Spring 2025)</li>
            <li>✓ You'll get early access and founding member pricing</li>
            <li>✓ Start dreaming about your lazy, beautiful native yard</li>
          </ul>
        </div>

        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => setCurrentPage('landing')}
            className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-full font-medium transition-colors"
          >
            Back to Home
          </button>
          <button className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-full font-medium transition-colors">
            Share on Twitter
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
