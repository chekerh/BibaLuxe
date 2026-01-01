'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Scene3D from '@/components/Scene3D';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import { productsApi, Product, LocalizedString } from '@/lib/api'; // Import LocalizedString
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useI18n } from '@/contexts/I18nContext';
import {
  ArrowRight,
  BadgeCheck,
  Heart,
  Quote,
  Shield,
  Sparkles,
  Star,
  Truck,
  Mail,
  Phone,
} from 'lucide-react';
import StoreFeatures from '@/components/StoreFeatures';
import RefundPolicy from '@/components/RefundPolicy';
import DeliveryInfo from '@/components/DeliveryInfo';
import UrgencyBanner from '@/components/UrgencyBanner';
import TrustBadges from '@/components/TrustBadges';
import LiveChat from '@/components/LiveChat';
import Footer from '@/components/Footer';
import { ProductCardSkeleton } from '@/components/LoadingSkeleton';
import Newsletter from '@/components/Newsletter';
import CookieConsent from '@/components/CookieConsent';
import RecentlyViewed from '@/components/RecentlyViewed';
import FAQ from '@/components/FAQ';
import ContactForm from '@/components/ContactForm';
import ExitIntentPopup from '@/components/ExitIntentPopup';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const { locale, t, dir } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [mattresses, setMattresses] = useState<Product[]>([]);
  const [furniture, setFurniture] = useState<Product[]>([]);
  const [filteredMattresses, setFilteredMattresses] = useState<Product[]>([]);
  const [filteredFurniture, setFilteredFurniture] = useState<Product[]>([]);
  const sceneRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null); // Ref for the consolidated header
  const [mainContentPaddingTop, setMainContentPaddingTop] = useState(0); // State for dynamic padding

  const [heroStats, setHeroStats] = useState<
    { label: string; value: string; detail: string }[]
  >([]);
  const [highlightPills, setHighlightPills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'name'>('rating');
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [minRating, setMinRating] = useState(0);

  const getLocalized = (obj: LocalizedString | string | undefined, defaultVal: string = '') => {
    if (typeof obj === 'string') return obj; 
    return obj?.[locale as keyof LocalizedString] || defaultVal;
  };

  // Sort products function
  const sortProducts = (productsToSort: Product[]) => {
    const sorted = [...productsToSort];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'name':
        return sorted.sort((a, b) => getLocalized(a.name, a.name.en).localeCompare(getLocalized(b.name, b.name.en)));
      default:
        return sorted;
    }
  };

  // Filter products based on search and filters
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          getLocalized(p.name, p.name.en).toLowerCase().includes(query) ||
          getLocalized(p.description, p.description.en).toLowerCase().includes(query) ||
          getLocalized(p.tagline, p.tagline?.en).toLowerCase().includes(query) ||
          p.highlights?.some((h) => getLocalized(h, h.en).toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange.min && p.price <= priceRange.max
    );

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter((p) => (p.rating || 0) >= minRating);
    }

    const mattresses = filtered.filter((p) => p.category === 'mattress');
    const furniture = filtered.filter((p) => p.category === 'furniture');
    
    setFilteredMattresses(sortProducts(mattresses));
    setFilteredFurniture(sortProducts(furniture));
  }, [products, searchQuery, selectedCategory, priceRange, minRating, sortBy, locale]);

  useEffect(() => {
    setLoading(true);
    productsApi
      .getAll(undefined, locale)
      .then((allProducts) => {
        setLoading(false);
        setProducts(allProducts);
        setMattresses(allProducts.filter((p) => p.category === 'mattress'));
        setFurniture(allProducts.filter((p) => p.category === 'furniture'));
        setFilteredMattresses(allProducts.filter((p) => p.category === 'mattress'));
        setFilteredFurniture(allProducts.filter((p) => p.category === 'furniture'));

        const averageRating =
          allProducts.length > 0
            ? allProducts.reduce(
                (sum, product) => sum + (product.rating ?? 4.5),
                0,
              ) / allProducts.length
            : 4.8;

        const totalReviews = allProducts.reduce(
          (sum, product) => sum + (product.reviewsCount ?? 0),
          0,
        );

        const bestWarranty =
          allProducts.reduce(
            (max, product) => Math.max(max, product.warrantyYears ?? 0),
            0,
          ) || 20;

        setHeroStats([
          {
            label: t('home.averageRating'),
            value: `${averageRating.toFixed(1)}/5`,
            detail: `${totalReviews.toLocaleString()}+ ${t('home.verifiedReviews')}`,
          },
          {
            label: t('home.fastDelivery'),
            value: t('home.daysDelivery'),
            detail: t('home.complimentaryOptions'),
          },
          {
            label: t('home.warranty'),
            value: `${bestWarranty}+ ${t('home.yearsCoverage')}`,
            detail: t('home.coverageOnEvery'),
          },
        ]);

        const pills = Array.from(
          new Set(
            allProducts.flatMap((product) => product.highlights?.map(h => getLocalized(h, h.en)) ?? []),
          ),
        ).slice(0, 6);
        setHighlightPills(pills);
      })
      .catch(console.error);
  }, [locale, t]);

  // Effect to dynamically calculate header height and apply padding
  useEffect(() => {
    console.log("Dynamic padding effect running.");
    if (headerRef.current) {
      const headerHeight = headerRef.current.offsetHeight;
      setMainContentPaddingTop(headerHeight);
      console.log("Header Height (Dynamic):", headerHeight);
      console.log("Main Content Padding Top (Dynamic):", headerHeight);
    }
  }, [products, searchQuery, selectedCategory, priceRange, minRating, sortBy, locale, t]); // Re-run if any of these change

  useEffect(() => {
    // Only run GSAP animations on the client side
    if (typeof window !== 'undefined' && sceneRef.current && contentRef.current) {
      gsap.to(sceneRef.current, {
        opacity: 0,
        scale: 0.8,
        y: -100,
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
          end: 'top 20%',
          scrub: true,
        },
      });

      gsap.from(contentRef.current, {
        opacity: 0,
        y: 50,
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
          end: 'top 50%',
          scrub: true,
        },
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-white" dir={dir}>
      {/* Consolidated Fixed Header */}
      <div ref={headerRef} className="fixed top-0 left-0 right-0 z-50 w-full">
        <UrgencyBanner />
        <Navbar />
        <TrustBadges />
      </div>

      {/* Main content wrapper with dynamic padding to prevent overlap */}
      <div style={{ paddingTop: `242px` }}>

        {/* Hero Section with 3D Models */}
        <section className="relative h-screen w-full overflow-hidden pt-20">
          <div ref={sceneRef} className="absolute inset-0 z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full p-8">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                <Scene3D 
                  modelPath="/models/mattress/mattress.glb" 
                  category="mattress"
                  position={[0, 0, 0]} 
                />
                <div className={`absolute bottom-4 ${dir === 'rtl' ? 'right-4' : 'left-4'} bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200`}>
                  <span className="text-sm font-semibold text-black">{t('home.premiumMattressLabel')}</span>
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                <Scene3D 
                  modelPath="/models/furniture/sofa_02_4k.gltf/sofa_02_4k.gltf"
                  category="furniture"
                  position={[0, 0, 0]} 
                />
                <div className={`absolute bottom-4 ${dir === 'rtl' ? 'right-4' : 'left-4'} bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200`}>
                  <span className="text-sm font-semibold text-black">{t('home.modernFurnitureLabel')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Overlay Text */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-b from-black/20 via-transparent to-white">
            <div className="text-center px-4">
              <h1 className="text-5xl md:text-8xl font-bold text-white mb-4 drop-shadow-2xl">
                {t('home.heroTitle')}
            </h1>
              <p className="text-xl md:text-3xl text-white/90 mb-8 drop-shadow-lg max-w-3xl mx-auto">
                {t('home.heroSubtitle')}
              </p>
              <div className={`flex flex-col ${dir === 'rtl' ? 'sm:flex-row-reverse' : 'sm:flex-row'} gap-4 justify-center`}>
                <Link
                  href="#products"
                  className={`px-8 py-4 bg-white text-black rounded-full text-lg font-semibold hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 flex items-center justify-center gap-2 border-2 border-green-600 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                >
                  {t('home.shopMattresses')} <ArrowRight className={`w-5 h-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </Link>
                <Link
                  href="#furniture"
                  className={`px-8 py-4 bg-green-600 text-white rounded-full text-lg font-semibold hover:bg-green-700 transition-all shadow-2xl hover:scale-105 flex items-center justify-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                >
                  {t('home.shopFurniture')} <ArrowRight className={`w-5 h-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </Link>
              </div>
              <div className={`mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-lg"
                  >
                    <p className="text-sm uppercase tracking-wide text-gray-500">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600">{stat.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <section className="bg-gray-50 py-8 border-y">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={`flex items-center ${dir === 'rtl' ? 'flex-row-reverse' : ''} gap-4`}>
                <div className="bg-green-50 p-3 rounded-full border border-green-200">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-black">{t('features.freeShipping')}</h3>
                  <p className="text-sm text-gray-600">{t('features.onOrdersOver')}</p>
                </div>
              </div>
              <div className={`flex items-center ${dir === 'rtl' ? 'flex-row-reverse' : ''} gap-4`}>
                <div className="bg-green-50 p-3 rounded-full border border-green-200">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-black">{t('features.yearWarranty')}</h3>
                  <p className="text-sm text-gray-600">{t('features.qualityGuaranteed')}</p>
                </div>
              </div>
              <div className={`flex items-center ${dir === 'rtl' ? 'flex-row-reverse' : ''} gap-4`}>
                <div className="bg-green-50 p-3 rounded-full border border-green-200">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-black">{t('features.satisfaction')}</h3>
                  <p className="text-sm text-gray-600">{t('features.moneyBack')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {highlightPills.length > 0 && (
          <section className="py-16 px-4 md:px-8 bg-white">
            <div className="max-w-6xl mx-auto text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-green-600 mb-2 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-green-600" />
                {t('home.whyBibaLuxe')}
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-10 text-black">
                {t('home.designedWithScience')}
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {highlightPills.map((pill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full bg-gray-100 text-sm font-medium text-black border border-gray-200 shadow-sm"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Mattresses Section */}
        <section id="products" ref={contentRef} className="py-20 px-4 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">
                {t('home.premiumMattresses')}
              </h2>
              <p className="text-center text-gray-600 text-lg max-w-2xl mx-auto">
                {t('home.premiumMattressesDesc')}
              </p>
            </div>

            <ProductFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              minPrice={priceRange.min}
              maxPrice={priceRange.max}
              onPriceChange={(min, max) => setPriceRange({ min, max })}
              minRating={minRating}
              onRatingChange={setMinRating}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredMattresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMattresses.map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    tagline={product.tagline}
                    price={product.price}
                    image={product.image}
                    category={product.category}
                    rating={product.rating}
                    reviewsCount={product.reviewsCount}
                    shippingInfo={product.shippingInfo}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {mattresses.length === 0
                    ? t('home.loadingProducts')
                    : t('home.noProductsMatch')}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Furniture Section */}
        <section id="furniture" className="py-20 px-4 md:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">
                {t('home.modernFurniture')}
              </h2>
              <p className="text-center text-gray-600 text-lg max-w-2xl mx-auto">
                {t('home.modernFurnitureDesc')}
              </p>
            </div>

            {filteredFurniture.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredFurniture.map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    tagline={product.tagline}
                    price={product.price}
                    image={product.image}
                    category={product.category}
                    rating={product.rating}
                    reviewsCount={product.reviewsCount}
                    shippingInfo={product.shippingInfo}
                    inStock={product.inStock}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {furniture.length === 0
                    ? t('home.loadingProducts')
                    : t('home.noProductsMatch')}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 px-4 md:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-widest text-black mb-2">
                {t('home.lovedBySleepers')}
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                {t('home.realSleepers')}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t('home.blendedData')}
            </p>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: t('home.testimonials.testimonial1.quote'),
                  name: t('home.testimonials.testimonial1.name'),
                  detail: t('home.testimonials.testimonial1.detail'),
                },
                {
                  quote: t('home.testimonials.testimonial2.quote'),
                  name: t('home.testimonials.testimonial2.name'),
                  detail: t('home.testimonials.testimonial2.detail'),
                },
                {
                  quote: t('home.testimonials.testimonial3.quote'),
                  name: t('home.testimonials.testimonial3.name'),
                  detail: t('home.testimonials.testimonial3.detail'),
                },
              ].map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="relative bg-gray-50 p-8 rounded-2xl shadow-inner"
                >
                  <Quote className={`w-10 h-10 text-gray-300 absolute -top-4 ${dir === 'rtl' ? '-right-2' : '-left-2'}`} />
                  <p className="text-gray-800 text-lg leading-relaxed mb-6">{testimonial.quote}</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4 md:px-8 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              {t('home.whyChoose')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-12">
              {t('home.whyChooseDesc')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
                <div className="text-5xl mb-4">🛏️</div>
                <h3 className="text-xl font-semibold mb-2 text-black">{t('home.premiumQuality')}</h3>
                <p className="text-gray-600">
                  {t('home.premiumQualityDesc')}
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
                <div className="text-5xl mb-4">🚚</div>
                <h3 className="text-xl font-semibold mb-2 text-black">{t('home.freeDelivery')}</h3>
                <p className="text-gray-600">
                  {t('home.freeDeliveryDesc')}
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-semibold mb-2 text-black">{t('home.warrantyTitle')}</h3>
                <p className="text-gray-600">
                  {t('home.warrantyDesc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Guarantee Banner */}
        <section className="py-16 px-4 md:px-8 bg-black text-white">
          <div className="max-w-5xl mx-auto text-center">
            <p className="uppercase tracking-[0.3em] text-sm font-semibold mb-4">
              {t('home.thePromise')}
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {t('home.promiseText')}
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              {t('home.promiseSubtext')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#products"
                className="px-8 py-4 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-all"
              >
                {t('home.shopMattresses')}
              </Link>
              <Link
                href="#furniture"
                className="px-8 py-4 border-2 border-green-600 rounded-full font-semibold hover:bg-green-600 hover:text-white transition-all"
              >
                {t('home.exploreFurniture')}
              </Link>
            </div>
          </div>
        </section>

        {/* Store Features Section */}
        <StoreFeatures 
          storePhone="+1 (555) 123-4567"
          storeOwnerName="Store Owner"
        />

        {/* Delivery Information Section */}
        <DeliveryInfo />

        {/* Refund Policy Section */}
        <RefundPolicy />

        {/* FAQ Section */}
        <FAQ />

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 md:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-black">
                {t('home.getInTouch')}
              </h2>
              <p className="text-lg text-gray-600">
                {t('home.haveQuestions')}
              </p>
            </div>
            <ContactForm />
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              {[
                {
                  label: t('home.callStoreOwner'),
                  value: '+1 (555) 123-4567',
                  icon: <Phone className="w-6 h-6 text-black" />,
                  action: () => window.location.href = 'tel:+15551234567',
                },
                {
                  label: t('home.emailSupport'),
                  value: 'support@bibaluxe.com',
                  icon: <Mail className="w-6 h-6 text-black" />,
                  action: () => window.location.href = 'mailto:support@bibaluxe.com',
                },
                {
                  label: t('home.storeHours'),
                  value: t('home.monSat'),
                  icon: <BadgeCheck className="w-6 h-6 text-black" />,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`bg-gray-50 rounded-2xl shadow-lg p-6 flex flex-col items-center gap-2 border border-gray-200 ${
                    item.action ? 'cursor-pointer hover:shadow-xl transition-all' : ''
                  }`}
                  onClick={item.action}
                >
                  {item.icon}
                  <p className="text-sm uppercase tracking-wide text-gray-500">
                    {item.label}
                  </p>
                  <p className="text-lg font-semibold text-black">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 px-4 md:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <Newsletter />
          </div>
        </section>

        {/* Recently Viewed */}
        <RecentlyViewed />

        <Footer />
        <LiveChat />
        <CookieConsent />
        <ExitIntentPopup />
      </div>
    </div>
  );
}
