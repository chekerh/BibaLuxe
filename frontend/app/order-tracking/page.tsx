'use client';

import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TrustBadges from '@/components/TrustBadges';

interface TrackingStatus {
  status: string;
  date: string;
  location: string;
  description: string;
}

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingStatus[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!orderId.trim()) return;

    setIsSearching(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock tracking data
    setTrackingData([
      {
        status: 'Order Placed',
        date: '2024-01-15',
        location: 'BibaLuxe Warehouse',
        description: 'Your order has been confirmed and payment processed.',
      },
      {
        status: 'Processing',
        date: '2024-01-16',
        location: 'BibaLuxe Warehouse',
        description: 'Your order is being prepared for shipment.',
      },
      {
        status: 'Shipped',
        date: '2024-01-17',
        location: 'In Transit',
        description: 'Your order has left our warehouse and is on its way.',
      },
      {
        status: 'Out for Delivery',
        date: '2024-01-19',
        location: 'Local Distribution Center',
        description: 'Your order is out for delivery today.',
      },
    ]);
    setIsSearching(false);
  };

  const getStatusIcon = (status: string, index: number, total: number) => {
    if (index === total - 1) {
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    }
    return <Clock className="w-6 h-6 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-white">
      <TrustBadges />
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 pt-32">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 text-center">
          Track Your Order
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Enter your order number to track your shipment
        </p>

        {/* Search Form */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter order number (e.g., BBL-123456)"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-black"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !orderId.trim()}
              className="px-8 py-4 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? 'Tracking...' : 'Track Order'}
            </button>
          </div>
        </div>

        {/* Tracking Results */}
        {trackingData && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-black">Order #{orderId}</h2>
            </div>

            <div className="relative">
              {/* Timeline */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

              <div className="space-y-8">
                {trackingData.map((item, index) => (
                  <div key={index} className="relative flex gap-6">
                    <div className="relative z-10">
                      {getStatusIcon(item.status, index, trackingData.length)}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-black">{item.status}</h3>
                        <span className="text-sm text-gray-600">{item.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{item.location}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 px-6 py-3 bg-gray-100 text-black rounded-full hover:bg-gray-200 transition-colors font-medium">
                  Download Shipping Label
                </button>
                <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-medium">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        {!trackingData && (
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-black mb-4">Need Help?</h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-black mb-2">Can't find your order number?</p>
                <p className="text-gray-600 text-sm">
                  Check your confirmation email or contact our support team at{' '}
                  <a href="mailto:support@bibaluxe.com" className="text-green-600 hover:underline">
                    support@bibaluxe.com
                  </a>
                </p>
              </div>
              <div>
                <p className="font-semibold text-black mb-2">Expected delivery time?</p>
                <p className="text-gray-600 text-sm">
                  Most orders arrive within 2-7 business days. Express shipping available for select items.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

