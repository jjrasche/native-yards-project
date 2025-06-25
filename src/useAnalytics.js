// useAnalytics.js - Custom hook
const useAnalytics = () => {
  const [sessionId] = useState(() => generateSessionId());
  const [stepTimings, setStepTimings] = useState({});

  const trackEvent = async (eventType, data) => {
    await supabase.from('analytics').insert({
      session_id: sessionId,
      event_type: eventType,
      timestamp: new Date(),
      ...data
    });
  };

  const startStep = (step) => {
    setStepTimings(prev => ({
      ...prev,
      [step]: Date.now()
    }));
    trackEvent('step_started', { step });
  };

  const completeStep = (step) => {
    const duration = Date.now() - stepTimings[step];
    trackEvent('step_completed', { step, duration });
  };

  return { trackEvent, startStep, completeStep };
};