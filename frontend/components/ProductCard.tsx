'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react';
import StockIndicator from './StockIndicator';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import QuickViewModal from './QuickViewModal';
import { useI18n } from '@/contexts/I18nContext';
import { LocalizedString } from '@/lib/api'; // Import LocalizedString

interface ProductCardProps {
  id: string;
  name: LocalizedString;
  tagline?: LocalizedString;
  price: number;
  image?: string;
  category: string;
  rating?: number;
  reviewsCount?: number;
  shippingInfo?: LocalizedString;
  inStock?: boolean;
  stockCount?: number;
}

export default function ProductCard({
  id,
  name,
  tagline,
  price,
  image,
  category,
  rating = 4.5,
  reviewsCount = 0,
  shippingInfo,
  inStock = true,
  stockCount,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { t, locale } = useI18n(); // Destructure locale

  const getLocalized = (obj: LocalizedString | string | undefined, defaultVal: string = '') => {
    if (typeof obj === 'string') return obj; 
    return obj?.[locale as keyof LocalizedString] || defaultVal;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      _id: id,
      name: getLocalized(name, name.en),
      tagline: getLocalized(tagline, tagline?.en),
      price,
      description: getLocalized(tagline, tagline?.en) || '', // Use localized tagline for description
      category,
      image,
      rating,
      reviewsCount,
      shippingInfo: getLocalized(shippingInfo, shippingInfo?.en),
      inStock,
      specifications: {},
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const product = {
      _id: id,
      name: getLocalized(name, name.en),
      tagline: getLocalized(tagline, tagline?.en),
      price,
      description: getLocalized(tagline, tagline?.en) || '', // Use localized tagline for description
      category,
      image,
      rating,
      reviewsCount,
      shippingInfo: getLocalized(shippingInfo, shippingInfo?.en),
      inStock,
      specifications: {},
    };
    if (isInWishlist(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist(product);
    }
  };

  const { dir } = useI18n();
  return (
    <Link href={`/products/${id}`} className="group" dir={dir}>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-gray-100">
        <div className="relative w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={getLocalized(name, name.en)}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="text-7xl mb-4">🛏️</div>
                <span className="text-gray-400 text-sm font-medium">{getLocalized(name, name.en)}</span>
              </div>
            </div>
          )}
          <div className={`absolute top-4 ${dir === 'rtl' ? 'right-4' : 'left-4'} bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md border border-gray-200`}>
            <span className="text-xs font-bold text-black uppercase tracking-wide">
              {category === 'mattress' ? t('common.mattresses') : t('common.furniture')}
            </span>
          </div>
          <div className={`absolute top-4 ${dir === 'rtl' ? 'left-4' : 'right-4'} opacity-0 group-hover:opacity-100 transition-opacity flex gap-2`}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuickViewOpen(true);
              }}
              className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors border border-gray-200"
              aria-label={t('common.quickView')}
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={handleAddToCart}
              className="bg-white p-3 rounded-full shadow-lg hover:bg-green-600 hover:text-white transition-colors border border-gray-200"
              aria-label={t('common.addToCart')}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`bg-white p-3 rounded-full shadow-lg transition-colors border border-gray-200 ${
                isInWishlist(id)
                  ? 'text-green-600 hover:bg-green-50'
                  : 'hover:bg-gray-100'
              }`}
              aria-label={t('common.wishlist')}
            >
              <Heart className={`w-5 h-5 ${isInWishlist(id) ? 'fill-green-600' : ''}`} />
            </button>
          </div>
          {category === 'mattress' && (
            <div className="absolute bottom-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {t('common.bestSeller')}
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-1 text-black group-hover:text-gray-600 transition-colors line-clamp-2">
            {getLocalized(name, name.en)}
          </h3>
          {tagline && (
            <p className="text-sm text-gray-500 mb-3 line-clamp-2 min-h-[3.5rem]">
              {getLocalized(tagline, tagline.en)}
            </p>
          )}

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating) ? 'fill-green-600 text-green-600' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({reviewsCount})</span>
          </div>

          <div className="mb-3">
            <StockIndicator inStock={inStock} stockCount={stockCount} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-black">${price.toFixed(2)}</p>
              <p className="text-sm text-gray-400 line-through">${(price * 1.2).toFixed(2)}</p>
              {shippingInfo && (
                <p className="text-xs text-gray-500 mt-1">{getLocalized(shippingInfo, shippingInfo.en)}</p>
              )}
            </div>
            <button className="px-6 py-3 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-700 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
              {t('common.viewDetails')}
            </button>
          </div>
        </div>
      </div>
      <QuickViewModal
        product={{
          _id: id,
          name: getLocalized(name, name.en),
          tagline: getLocalized(tagline, tagline?.en),
          price,
          description: getLocalized(tagline, tagline?.en) || '',
          category,
          image,
          rating,
          reviewsCount,
          shippingInfo: getLocalized(shippingInfo, shippingInfo?.en),
          inStock,
          specifications: {},
        }}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </Link>
  );
}
