import { useState, useEffect } from 'react';

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after a short delay if not dismissed before
      const hasSeenPrompt = localStorage.getItem('pwa-prompt-seen');
      if (!hasSeenPrompt) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    setDeferredPrompt(null);
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-seen', 'true');
    
    return outcome === 'accepted';
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-seen', 'true');
  };

  return {
    showPrompt,
    installPWA,
    dismissPrompt,
    canInstall: !!deferredPrompt,
  };
};
