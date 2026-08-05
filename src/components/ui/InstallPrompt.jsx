import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show the install prompt
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // If the app is already installed, hide it
    window.addEventListener('appinstalled', () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We no longer need the prompt. Clear it up
    setDeferredPrompt(null);
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-bg-card border border-border shadow-2xl rounded-2xl p-4 z-[9999] animate-[fadeInUp_0.3s_ease-out]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
            <img src="/pwa-icon-512.png" alt="App Icon" className="w-10 h-10 object-contain" />
          </div>
          <div>
            <h3 className="font-bold text-text">Install S&S Kids</h3>
            <p className="text-sm text-text/70">Add our app to your home screen for a better experience.</p>
          </div>
        </div>
        <button 
          onClick={() => setShowPrompt(false)}
          className="text-text/50 hover:text-text p-1 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="mt-4 flex gap-3">
        <button 
          onClick={handleInstallClick}
          className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Install App
        </button>
      </div>
    </div>
  );
}

export default InstallPrompt;
