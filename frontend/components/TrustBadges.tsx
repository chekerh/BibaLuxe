'use client';

import { Shield, Lock, Truck, Award, CheckCircle } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export default function TrustBadges() {
  const { t } = useI18n();
  
  return (
    <div className="bg-white border-t border-b border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          {[
            {
              icon: <Shield className="w-6 h-6 text-green-600" />,
              text: t('trustBadges.secureCheckout'),
              subtext: t('trustBadges.sslEncrypted'),
            },
            {
              icon: <Truck className="w-6 h-6 text-green-600" />,
              text: t('trustBadges.freeShipping'),
              subtext: t('trustBadges.over500'),
            },
            {
              icon: <Lock className="w-6 h-6 text-green-600" />,
              text: t('trustBadges.safePayment'),
              subtext: t('trustBadges.protected'),
            },
            {
              icon: <Award className="w-6 h-6 text-green-600" />,
              text: t('trustBadges.qualityGuaranteed'),
              subtext: t('trustBadges.yearWarranty'),
            },
            {
              icon: <CheckCircle className="w-6 h-6 text-green-600" />,
              text: t('trustBadges.easyReturns'),
              subtext: t('trustBadges.dayPolicy'),
            },
          ].map((badge, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              {badge.icon}
              <div>
                <p className="text-sm font-semibold text-black">{badge.text}</p>
                <p className="text-xs text-gray-600">{badge.subtext}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

