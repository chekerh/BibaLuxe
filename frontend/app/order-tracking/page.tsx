'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TrustBadges from '@/components/TrustBadges';
import { useI18n } from '@/contexts/I18nContext';
import { ordersApi, TrackingInfo } from '@/lib/api';
import { useToast } from '@/components/Toast';

export default function OrderTrackingPage() {
  const { t } = useI18n();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingInfo[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load order ID from URL params if present
  useEffect(() => {
    const orderIdParam = searchParams?.get('orderId');
    if (orderIdParam) {
      setOrderId(orderIdParam);
      handleSearch(orderIdParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearch = async (orderNumber?: string) => {
    const orderNum = orderNumber || orderId.trim();
    if (!orderNum) return;

    setIsSearching(true);
    setError(null);

    try {
      const order = await ordersApi.trackOrder(orderNum);
      setTrackingData(order.trackingHistory || []);
      setOrderId(order.orderNumber);
    } catch (err: any) {
      console.error('Failed to fetch order:', err);
      setError(err.response?.data?.message || 'Order not found. Please check your order number.');
      setTrackingData(null);
      showToast(
        err.response?.data?.message || 'Order not found. Please check your order number.',
        'error'
      );
    } finally {
      setIsSearching(false);
    }
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
          {t('orderTracking.title')}
        </h1>
        <p className="text-gray-600 text-center mb-8">
          {t('orderTracking.subtitle')}
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
                placeholder={t('orderTracking.placeholder')}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-black"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={isSearching || !orderId.trim()}
              className="px-8 py-4 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? t('orderTracking.tracking') : t('orderTracking.trackOrder')}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <p className="text-red-800 text-center">{error}</p>
          </div>
        )}

        {/* Tracking Results */}
        {trackingData && trackingData.length > 0 && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-black">{t('orderTracking.orderNumber')}{orderId}</h2>
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
                  {t('orderTracking.downloadLabel')}
                </button>
                <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-medium">
                  {t('orderTracking.contactSupport')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        {!trackingData && (
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-black mb-4">{t('orderTracking.needHelp')}</h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-black mb-2">{t('orderTracking.cantFindOrder')}</p>
                <p className="text-gray-600 text-sm">
                  {t('orderTracking.checkEmail')}{' '}
                  <a href="mailto:support@bibaluxe.com" className="text-green-600 hover:underline">
                    support@bibaluxe.com
                  </a>
                </p>
              </div>
              <div>
                <p className="font-semibold text-black mb-2">{t('orderTracking.expectedDelivery')}</p>
                <p className="text-gray-600 text-sm">
                  {t('orderTracking.deliveryInfo')}
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

