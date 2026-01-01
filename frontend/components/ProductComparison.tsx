'use client';

import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Product } from '@/lib/api';
import Image from 'next/image';
import { useI18n } from '@/contexts/I18nContext';

interface ProductComparisonProps {
  products: Product[];
  onRemove: (productId: string) => void;
  onClose: () => void;
}

export default function ProductComparison({
  products,
  onRemove,
  onClose,
}: ProductComparisonProps) {
  const { t, dir } = useI18n();
  if (products.length === 0) return null;

  const features = [
    t('productComparison.price'),
    t('productComparison.rating'),
    t('productComparison.warranty'),
    t('productComparison.shipping'),
    t('productComparison.category'),
    t('productComparison.inStock'),
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="absolute inset-4 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b border-gray-200 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <h2 className="text-2xl font-bold text-black">{t('productComparison.title')}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label={t('common.close')}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className={`p-4 ${dir === 'rtl' ? 'text-right' : 'text-left'} border-b border-gray-200`}>{t('productComparison.features')}</th>
                {products.map((product) => (
                  <th key={product._id} className="p-4 text-center border-b border-gray-200 relative">
                    <button
                      onClick={() => onRemove(product._id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                      aria-label="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex flex-col items-center gap-2">
                      {product.image ? (
                        <div className="w-24 h-24 relative rounded-lg overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-4xl">
                            {product.category === 'mattress' ? '🛏️' : '🪑'}
                          </span>
                        </div>
                      )}
                      <h3 className="font-semibold text-black text-sm">{product.name}</h3>
                      <p className="text-lg font-bold text-green-600">${product.price.toFixed(2)}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`p-4 font-semibold text-black border-b border-gray-100 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('productComparison.price')}</td>
                {products.map((product) => (
                  <td key={product._id} className="p-4 text-center border-b border-gray-100">
                    <span className="text-lg font-bold text-green-600">
                      ${product.price.toFixed(2)}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className={`p-4 font-semibold text-black border-b border-gray-100 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('productComparison.rating')}</td>
                {products.map((product) => (
                  <td key={product._id} className="p-4 text-center border-b border-gray-100">
                    <span className="font-semibold">
                      {product.rating?.toFixed(1) || t('productComparison.notAvailable')} ⭐
                    </span>
                    <p className="text-xs text-gray-600">
                      ({product.reviewsCount || 0} {t('product.reviews')})
                    </p>
                  </td>
                ))}
              </tr>
              <tr>
                <td className={`p-4 font-semibold text-black border-b border-gray-100 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('productComparison.warranty')}</td>
                {products.map((product) => (
                  <td key={product._id} className="p-4 text-center border-b border-gray-100">
                    {product.warrantyYears ? `${product.warrantyYears} ${t('productComparison.years')}` : t('productComparison.notAvailable')}
                  </td>
                ))}
              </tr>
              <tr>
                <td className={`p-4 font-semibold text-black border-b border-gray-100 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('productComparison.shipping')}</td>
                {products.map((product) => (
                  <td key={product._id} className="p-4 text-center border-b border-gray-100">
                    <p className="text-sm text-gray-600">{product.shippingInfo || t('productComparison.notAvailable')}</p>
                  </td>
                ))}
              </tr>
              <tr>
                <td className={`p-4 font-semibold text-black border-b border-gray-100 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('productComparison.category')}</td>
                {products.map((product) => (
                  <td key={product._id} className="p-4 text-center border-b border-gray-100">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold uppercase">
                      {t(`common.${product.category}`)}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className={`p-4 font-semibold text-black border-b border-gray-100 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('productComparison.inStock')}</td>
                {products.map((product) => (
                  <td key={product._id} className="p-4 text-center border-b border-gray-100">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.inStock
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.inStock ? t('productComparison.yes') : t('productComparison.no')}
                    </span>
                  </td>
                ))}
              </tr>
              {products[0]?.highlights && (
                <tr>
                  <td className={`p-4 font-semibold text-black border-b border-gray-100 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    {t('product.keyFeatures')}
                  </td>
                  {products.map((product) => (
                    <td key={product._id} className="p-4 border-b border-gray-100">
                      <ul className="text-sm text-gray-600 space-y-1">
                        {product.highlights?.slice(0, 3).map((highlight, i) => (
                          <li key={i}>• {highlight}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            {t('productComparison.compareUpTo')}
          </p>
        </div>
      </div>
    </div>
  );
}

