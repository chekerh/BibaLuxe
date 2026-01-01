'use client';

import { useState } from 'react';
import { Calculator, Package, Truck } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

interface ShippingOption {
  name: string;
  price: number;
  days: string;
  description: string;
}

export default function ShippingCalculator() {
  const { t } = useI18n();
  const [zipCode, setZipCode] = useState('');
  const [calculated, setCalculated] = useState(false);

  const shippingOptions: ShippingOption[] = [
    {
      name: t('shippingCalculator.standardShipping'),
      price: 49.99,
      days: `5-7 ${t('shippingCalculator.businessDays')}`,
      description: t('shippingCalculator.freeOnOrders'),
    },
    {
      name: t('shippingCalculator.expressShipping'),
      price: 99.99,
      days: `2-3 ${t('shippingCalculator.businessDays')}`,
      description: t('shippingCalculator.priorityHandling'),
    },
    {
      name: t('shippingCalculator.whiteGloveDelivery'),
      price: 199.99,
      days: `7-10 ${t('shippingCalculator.businessDays')}`,
      description: t('shippingCalculator.roomPlacement'),
    },
  ];

  const handleCalculate = () => {
    if (zipCode.length >= 5) {
      setCalculated(true);
    }
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <Calculator className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-bold text-black">{t('shippingCalculator.title')}</h3>
      </div>
      
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={zipCode}
          onChange={(e) => {
            setZipCode(e.target.value);
            setCalculated(false);
          }}
          placeholder={t('shippingCalculator.enterZipCode')}
          maxLength={5}
          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-black"
        />
        <button
          onClick={handleCalculate}
          disabled={zipCode.length < 5}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('shippingCalculator.calculate')}
        </button>
      </div>

      {calculated && (
        <div className="space-y-3">
          {shippingOptions.map((option, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-black">{option.name}</p>
                  <p className="text-sm text-gray-600">{option.days}</p>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
              </div>
              <p className="text-lg font-bold text-green-600">
                {option.price === 0 ? t('cart.free') : `$${option.price.toFixed(2)}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

