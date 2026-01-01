'use client';

import { Phone, Package, RotateCcw, Truck, Shield, Clock } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

interface StoreFeaturesProps {
  storePhone?: string;
  storeOwnerName?: string;
}

export default function StoreFeatures({ 
  storePhone = '+1 (555) 123-4567',
  storeOwnerName = 'Store Owner'
}: StoreFeaturesProps) {
  const { t } = useI18n();
  const handleCall = () => {
    window.location.href = `tel:${storePhone.replace(/\D/g, '')}`;
  };

  return (
    <section className="py-16 px-4 md:px-8 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">
          {t('storeFeatures.storeServices')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Call Store Owner */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-600 p-3 rounded-full">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black">{t('storeFeatures.callStoreOwner')}</h3>
                <p className="text-sm text-gray-600">{t('storeFeatures.directContact')}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              {t('storeFeatures.speakDirectly', { name: storeOwnerName })}
            </p>
            <button
              onClick={handleCall}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              {t('storeFeatures.call')} {storePhone}
            </button>
          </div>

          {/* Refund Policy */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-black p-3 rounded-full">
                <RotateCcw className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black">{t('storeFeatures.easyReturns')}</h3>
                <p className="text-sm text-gray-600">{t('storeFeatures.satisfaction')}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              {t('storeFeatures.notSatisfied')}
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>{t('storeFeatures.dayReturnWindow')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>{t('storeFeatures.freeReturnShipping')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{t('storeFeatures.refundProcessed')}</span>
              </div>
            </div>
          </div>

          {/* Delivery/Livraison */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-black p-3 rounded-full">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black">{t('storeFeatures.fastDelivery')}</h3>
                <p className="text-sm text-gray-600">{t('home.fastDelivery')}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              {t('storeFeatures.fastReliable')}
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span>{t('storeFeatures.dayDelivery')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>{t('storeFeatures.freeShippingOver')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>{t('storeFeatures.whiteGloveAvailable')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

