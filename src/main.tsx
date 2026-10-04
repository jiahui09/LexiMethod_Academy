import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { applyMotionTier, useSettings } from './store/settingsStore';
import './index.css';

function Boot() {
  const tier = useSettings((s) => s.motionTier);
  useEffect(() => {
    applyMotionTier(tier);
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const onChange = () => applyMotionTier(useSettings.getState().motionTier);
    mq?.addEventListener?.('change', onChange);
    return () => mq?.removeEventListener?.('change', onChange);
  }, [tier]);
  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Boot />
    </BrowserRouter>
  </StrictMode>,
);
