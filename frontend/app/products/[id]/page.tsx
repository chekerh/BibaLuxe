'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { productsApi, Product, LocalizedString } from '@/lib/api'; // Import LocalizedString
import Scene3D from '@/components/Scene3D';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useI18n } from '@/contexts/I18nContext';
import { Star, Truck, Shield, Check, ShoppingCart, Heart, ArrowLeft, Sparkles } from 'lucide-react';
import ProductRecommendations from '@/components/ProductRecommendations';
import StockIndicator from '@/components/StockIndicator';
import TrustBadges from '@/components/TrustBadges';
import LiveChat from '@/components/LiveChat';
import FrequentlyBoughtTogether from '@/components/FrequentlyBoughtTogether';
import Breadcrumbs from '@/components/Breadcrumbs';
import Footer from '@/components/Footer';
import { ProductDetailSkeleton } from '@/components/LoadingSkeleton';
import ProductImageGallery from '@/components/ProductImageGallery';
import CustomerReviews from '@/components/CustomerReviews';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import SizeGuide from '@/components/SizeGuide';
import SocialShare from '@/components/SocialShare';
import ProductQuestions from '@/components/ProductQuestions';
import ShippingCalculator from '@/components/ShippingCalculator';
import SocialProof from '@/components/SocialProof';
import BackInStock from '@/components/BackInStock';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { locale, t, dir } = useI18n(); // Added t and dir
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    if (id) {
      // Fetch all products for recommendations
      productsApi
        .getAll(undefined, locale)
        .then((products) => {
          setAllProducts(products);
          const foundProduct = products.find((p) => p._id === id);
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            // Fallback: try to fetch by ID
            return productsApi.getById(id, locale);
          }
        })
        .then((p) => {
          if (p && !product) setProduct(p);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, locale]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">{t('product.notFoundTitle')}</h1>
          <Link href="/" className="text-black hover:text-gray-600">
            {t('product.backToHomepage')}
          </Link>
        </div>
      </div>
    );
  }

  const rating = product.rating || 4.5;
  const reviewsCount = product.reviewsCount || 0;

  const getLocalized = (obj: LocalizedString | string | undefined, defaultVal: string = '') => {
    if (typeof obj === 'string') return obj; // Fallback for non-localized strings
    return obj?.[locale as keyof LocalizedString] || defaultVal; // Access localized string
  };

  return (
    <div className="min-h-screen bg-white" dir={dir}> {/* Added dir prop */}
      <TrustBadges />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 pt-32">
        <Link
          href="/"
          className="text-black hover:text-gray-600 mb-8 inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('product.backToProducts')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* 3D Model Section */}
          <div className="h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            <Scene3D 
              modelPath={product.model3d} 
              category={product.category}
            />
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-gray-100 text-black rounded-full text-xs font-semibold uppercase tracking-wide border border-gray-200">
                {getLocalized(product.category, product.category)}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-3 text-gray-900">
              {getLocalized(product.name, product.name.en)}
            </h1>
            
            {product.tagline && (
              <p className="text-xl text-gray-600 mb-6 font-medium">
                {getLocalized(product.tagline, product.tagline.en)}
              </p>
            )}

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(rating)
                        ? 'fill-green-600 text-green-600'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900">{rating.toFixed(1)}</span>
              <span className="text-gray-600">{t('product.reviewsCount', { count: reviewsCount })}</span>
            </div>

            {/* Price */}
            <div className="mb-4">
              <p className="text-4xl font-bold text-black mb-2">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-lg text-gray-400 line-through">
                ${(product.price * 1.2).toFixed(2)}
              </p>
            </div>

            {/* Social Proof */}
            <div className="mb-4">
              <SocialProof productId={product._id} />
            </div>

            {/* Stock Indicator */}
            <div className="mb-4">
              <StockIndicator inStock={product.inStock} />
            </div>

            {/* Back in Stock Notification */}
            {!product.inStock && (
              <div className="mb-4">
                <BackInStock productId={product._id} productName={getLocalized(product.name, product.name.en)} />
              </div>
            )}

            {/* Social Share */}
            <div className="mb-6">
              <SocialShare
                productName={getLocalized(product.name, product.name.en)}
                productUrl={`/products/${product._id}`}
                productImage={product.image}
              />
            </div>

            {/* Shipping Calculator */}
            <div className="mb-6">
              <ShippingCalculator />
            </div>

            {/* Highlights */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-black" />
                  <h3 className="text-lg font-semibold text-black">{t('product.keyFeatures')}</h3>
                </div>
                <ul className="space-y-3">
                  {product.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{getLocalized(highlight, highlight.en)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Shipping & Warranty Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {product.shippingInfo && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <Truck className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-black text-sm">{t('product.shippingTitle')}</p>
                    <p className="text-sm text-gray-600">{getLocalized(product.shippingInfo, product.shippingInfo.en)}</p>
                  </div>
                </div>
              )}
              {product.warrantyYears && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <Shield className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-black text-sm">{t('product.warrantyTitle')}</p>
                    <p className="text-sm text-gray-600">{t('product.warrantyCoverage', { years: product.warrantyYears })}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('product.descriptionTitle')}</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                {getLocalized(product.description, product.description.en)}
              </p>
            </div>

            {/* Specifications */}
            {product.specifications && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{t('product.specificationsTitle')}</h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <dl className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                        <dt className="font-medium text-gray-700 capitalize">
                          {t(`product.specifications.${key}` as any) || key.replace(/([A-Z])/g, ' $1').trim()}
                        </dt>
                        <dd className="text-gray-900 font-semibold">{getLocalized(value, value.en)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className={`flex-1 px-8 py-4 rounded-full text-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  product.inStock
                    ? 'bg-green-600 text-white hover:bg-green-700 hover:shadow-xl hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!product.inStock}
              >
                <ShoppingCart className="w-5 h-5" />
                {product.inStock ? t('product.addToCart') : t('product.outOfStock')}
              </button>
              <button className="px-8 py-4 rounded-full text-lg font-semibold border-2 border-gray-300 hover:border-green-600 hover:text-green-600 transition-colors flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                {t('product.saveForLater')}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>{t('product.trial')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>{t('product.freeReturns')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>{t('product.whiteGloveSetup')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Frequently Bought Together */}
        {allProducts.length > 0 && product && (
          <FrequentlyBoughtTogether
            mainProduct={product}
            relatedProducts={allProducts
              .filter((p) => p._id !== product._id && p.category === product.category)
              .slice(0, 2)}
          />
        )}

        {/* Product Recommendations */}
        {allProducts.length > 0 && (
          <ProductRecommendations
            currentProductId={id}
            allProducts={allProducts}
            title={t('product.youMayAlsoLike')}
          />
        )}

        {/* Size Guide */}
        {product && (
          <div className="mb-12">
            <SizeGuide category={product.category as 'mattress' | 'furniture'} />
          </div>
        )}

        {/* Product Questions */}
        {product && (
          <div className="mb-12">
            <ProductQuestions productId={product._id} />
          </div>
        )}

        {/* Customer Reviews */}
        {product && (
          <CustomerReviews
            productId={product._id}
            averageRating={rating}
            reviewsCount={reviewsCount}
          />
        )}
      </div>

      <Footer />
      <LiveChat />
    </div>
  );
}
