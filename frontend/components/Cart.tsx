'use client';

import { useState } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/contexts/I18nContext';

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const { t, locale } = useI18n();
  
  // Helper to get localized name
  const getName = (name: string | { en: string; ar?: string; fr?: string }): string => {
    if (typeof name === 'string') return name;
    return name[locale as keyof typeof name] || name.en || '';
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-black hover:text-green-600 transition-colors relative"
        aria-label="Shopping cart"
      >
        <ShoppingCart className="w-5 h-5" />
        {getTotalItems() > 0 && (
          <span className="absolute top-0 right-0 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
            {getTotalItems()}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-black">{t('cart.title')}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">{t('cart.empty')}</p>
                  <Link
                    href="/#products"
                    onClick={() => setIsOpen(false)}
                    className="inline-block px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all"
                  >
                    {t('cart.continueShopping')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item._id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      {item.image ? (
                        <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={getName(item.name)}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-3xl">
                            {item.category === 'mattress' ? '🛏️' : '🪑'}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-black truncate">{getName(item.name)}</h3>
                        <p className="text-sm text-gray-600">${item.price.toFixed(2)} {t('common.each')}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-600 hover:text-red-700"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <p className="font-bold text-black">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-black">{t('cart.total')}:</span>
                  <span className="text-green-600">${getTotalPrice().toFixed(2)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block w-full px-6 py-4 bg-green-600 text-white rounded-full text-center font-semibold hover:bg-green-700 transition-all"
                >
                  {t('cart.checkout')}
                </Link>
                <Link
                  href="/#products"
                  onClick={() => setIsOpen(false)}
                  className="block w-full px-6 py-4 bg-gray-100 text-black rounded-full text-center font-semibold hover:bg-gray-200 transition-all"
                >
                  {t('cart.continueShopping')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

