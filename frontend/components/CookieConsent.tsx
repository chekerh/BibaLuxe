'use client';

import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show after a short delay
      setTimeout(() => setShow(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Cookie className="w-8 h-8 text-green-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-black mb-1">We use cookies</h3>
            <p className="text-sm text-gray-600">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
              By clicking "Accept All", you consent to our use of cookies.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDecline}
            className="px-6 py-3 border-2 border-gray-300 rounded-full hover:border-gray-400 transition-colors font-medium text-black"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all font-semibold"
          >
            Accept All
          </button>
          <button
            onClick={() => setShow(false)}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

