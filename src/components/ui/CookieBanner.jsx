import { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';

function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-bg-card border border-border shadow-2xl rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 pointer-events-auto">
        <div className="flex-1">
          <h3 className="text-text font-bold text-lg mb-2 flex items-center gap-2">
            <Cookie className="w-5 h-5 text-primary" /> We Value Your Privacy
          </h3>
          <p className="text-sm text-text-light leading-relaxed">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
          <button
            onClick={handleDecline}
            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl border-2 border-border text-text font-semibold hover:bg-bg-alt transition-colors cursor-pointer"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors shadow-sm cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieBanner;
