'use client';

import { useState } from 'react';
import { X, ShoppingCart, Heart, Star } from 'lucide-react';
import { Product } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useI18n } from '@/contexts/I18nContext';
import StockIndicator from './StockIndicator';

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
}: QuickViewModalProps) {
  const { t, dir, locale } = useI18n();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Helper to get localized name
  const getName = (name: string | { en: string; ar?: string; fr?: string }): string => {
    if (typeof name === 'string') return name;
    return name[locale as keyof typeof name] || name.en || '';
  };
  
  // Helper to get localized value
  const getLocalized = (value: string | { en: string; ar?: string; fr?: string } | undefined, defaultVal: string = ''): string => {
    if (!value) return defaultVal;
    if (typeof value === 'string') return value;
    return value[locale as keyof typeof value] || value.en || defaultVal;
  };

  if (!isOpen) return null;

  const images = product.image ? [product.image, product.image, product.image] : [];
  const rating = product.rating || 4.5;
  const reviewsCount = product.reviewsCount || 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} dir={dir}>
      <div
        className="absolute inset-4 md:inset-8 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-w-6xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b border-gray-200 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <h2 className="text-xl font-bold text-black">{t('common.quickView')}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label={t('common.close')}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Images */}
            <div>
              <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden mb-4">
                {product.image ? (
                  <Image
                    src={images[selectedImage] || product.image}
                    alt={getName(product.name)}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-8xl">
                      {product.category === 'mattress' ? '🛏️' : '🪑'}
                    </span>
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index
                          ? 'border-green-600'
                          : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${getName(product.name)} ${index + 1}`}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <span className="inline-block px-3 py-1 bg-gray-100 text-black rounded-full text-xs font-semibold uppercase mb-4">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-black mb-2">{getName(product.name)}</h1>
              {product.tagline && (
                <p className="text-lg text-gray-600 mb-4">{getLocalized(product.tagline)}</p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(rating)
                          ? 'fill-green-600 text-green-600'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold">{rating.toFixed(1)}</span>
                <span className="text-gray-600">({reviewsCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <p className="text-3xl font-bold text-green-600">${product.price.toFixed(2)}</p>
                <p className="text-lg text-gray-400 line-through">
                  ${(product.price * 1.2).toFixed(2)}
                </p>
              </div>

              {/* Stock */}
              <div className="mb-6">
                <StockIndicator inStock={product.inStock} />
              </div>

              {/* Highlights */}
              {product.highlights && product.highlights.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-black mb-2">Key Features</h3>
                  <ul className="space-y-2">
                    {product.highlights.slice(0, 4).map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-600">✓</span>
                        <span>{getLocalized(highlight)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    addToCart(product);
                    onClose();
                  }}
                  disabled={!product.inStock}
                  className={`flex-1 px-6 py-4 rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${
                    product.inStock
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {t('quickView.addToCart')}
                </button>
                <button
                  onClick={() => {
                    if (isInWishlist(product._id)) {
                      removeFromWishlist(product._id);
                    } else {
                      addToWishlist(product);
                    }
                  }}
                  className={`px-6 py-4 rounded-full font-semibold border-2 transition-colors flex items-center justify-center gap-2 ${
                    isInWishlist(product._id)
                      ? 'border-green-600 bg-green-50 text-green-600'
                      : 'border-gray-300 hover:border-green-600 hover:text-green-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-green-600' : ''}`} />
                  {isInWishlist(product._id) ? t('common.inWishlist') : t('common.wishlist')}
                </button>
              </div>

              <Link
                href={`/products/${product._id}`}
                onClick={onClose}
                className="block mt-4 text-center text-green-600 hover:text-green-700 font-semibold"
              >
                {t('quickView.viewDetails')} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

