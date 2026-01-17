'use client';

import { Product } from '@/lib/api';
import { ShoppingCart, Plus } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/contexts/I18nContext';

interface FrequentlyBoughtTogetherProps {
  mainProduct: Product;
  relatedProducts: Product[];
}

export default function FrequentlyBoughtTogether({
  mainProduct,
  relatedProducts,
}: FrequentlyBoughtTogetherProps) {
  const { t, locale } = useI18n();
  
  // Helper to get localized name
  const getName = (name: string | { en: string; ar?: string; fr?: string }): string => {
    if (typeof name === 'string') return name;
    return name[locale as keyof typeof name] || name.en || '';
  };
  
  if (relatedProducts.length === 0) return null;

  const totalPrice = mainProduct.price + relatedProducts.reduce((sum, p) => sum + p.price, 0);
  const savings = totalPrice * 0.1; // 10% savings

  return (
    <section className="py-12 px-4 md:px-8 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-black">
          {t('frequentlyBoughtTogether.title')}
        </h2>
        
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
            {/* Main Product */}
            <div className="flex-1 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-3xl">🛏️</span>
              </div>
              <p className="text-sm font-semibold text-black">{getName(mainProduct.name)}</p>
              <p className="text-lg font-bold text-green-600">${mainProduct.price.toFixed(2)}</p>
            </div>

            {/* Plus Icon */}
            <div className="text-2xl text-gray-400">+</div>

            {/* Related Products */}
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                {relatedProducts.slice(0, 2).map((product) => (
                  <div key={product._id} className="text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-2xl">
                        {product.category === 'furniture' ? '🪑' : '🛏️'}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-black line-clamp-2 mb-1">
                      {getName(product.name)}
                    </p>
                    <p className="text-sm font-bold text-green-600">${product.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total & Savings */}
            <div className="flex-1 text-center">
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <p className="text-sm text-gray-600 mb-1">{t('frequentlyBoughtTogether.total')}</p>
                <p className="text-2xl font-bold text-black mb-2">
                  ${totalPrice.toFixed(2)}
                </p>
                <p className="text-sm text-green-600 font-semibold">
                  {t('frequentlyBoughtTogether.youSave')} ${savings.toFixed(2)} {t('frequentlyBoughtTogether.whenBoughtTogether')}
                </p>
              </div>
            </div>
          </div>

          <button className="w-full md:w-auto px-8 py-4 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2 mx-auto">
            <ShoppingCart className="w-5 h-5" />
            {t('frequentlyBoughtTogether.addAllToCart')}
          </button>
        </div>
      </div>
    </section>
  );
}

