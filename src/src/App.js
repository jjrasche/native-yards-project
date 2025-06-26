// App.js - Clean component structure
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAnalytics } from './useAnalytics';

// Import components
import HeroSection from '../components/HeroSection';
import BenefitsSection from '../components/BenefitsSection';
import HowItWorksSection from '../components/HowItWorksSection';
import SafetySection from '../components/SafetySection';
import FAQSection from '../components/FAQSection';
import FinalCTASection from '../components/FinalCTASection';
import FormModal from '../components/FormModal';
import SuccessModal from '../components/SuccessModal';

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
