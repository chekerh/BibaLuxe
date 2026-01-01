'use client';

import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { useToast } from './Toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    // Simulate API call
    try {
      // In production, this would call your backend API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSubscribed(true);
      showToast('Successfully subscribed to newsletter!', 'success');
      setEmail('');
      
      // Reset after 3 seconds
      setTimeout(() => setSubscribed(false), 3000);
    } catch (error) {
      showToast('Failed to subscribe. Please try again.', 'error');
    }
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-bold text-black">Subscribe to Our Newsletter</h3>
      </div>
      <p className="text-gray-600 mb-6">
        Get exclusive deals, new product announcements, and sleep tips delivered to your inbox.
      </p>
      
      {subscribed ? (
        <div className="flex items-center gap-2 text-green-600 font-semibold">
          <CheckCircle className="w-5 h-5" />
          <span>Thank you for subscribing!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-black"
            required
          />
          <button
            type="submit"
            className="px-8 py-4 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all font-semibold whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
      )}
      
      <p className="text-xs text-gray-500 mt-4">
        By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
      </p>
    </div>
  );
}

