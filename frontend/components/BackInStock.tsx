'use client';

import { useState } from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import { useToast } from './Toast';

interface BackInStockProps {
  productId: string;
  productName: string;
}

export default function BackInStock({ productId, productName }: BackInStockProps) {
  const [email, setEmail] = useState('');
  const [notified, setNotified] = useState(false);
  const { showToast } = useToast();

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    // Save to localStorage (in production, send to backend)
    const notifications = JSON.parse(localStorage.getItem('back-in-stock') || '[]');
    notifications.push({ productId, email, productName });
    localStorage.setItem('back-in-stock', JSON.stringify(notifications));

    setNotified(true);
    showToast('We\'ll notify you when this product is back in stock!', 'success');
    setEmail('');
  };

  if (notified) {
    return (
      <div className="bg-green-50 rounded-xl p-4 border border-green-200 flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
        <p className="text-sm text-green-800">
          You'll be notified when <span className="font-semibold">{productName}</span> is back in stock!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <div className="flex items-center gap-3 mb-3">
        <Bell className="w-5 h-5 text-green-600" />
        <h3 className="font-semibold text-black">Notify Me When Available</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Get notified by email when this product is back in stock
      </p>
      <form onSubmit={handleNotify} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-black text-sm"
          required
        />
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold text-sm whitespace-nowrap"
        >
          Notify Me
        </button>
      </form>
    </div>
  );
}

