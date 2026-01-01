'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X, User, Heart } from 'lucide-react';
import SearchModal from './SearchModal';
import Cart from './Cart';
import { useWishlist } from '@/contexts/WishlistContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useI18n } from '@/contexts/I18nContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { getWishlistCount } = useWishlist();
  const { t, dir } = useI18n();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`relative z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-md'
      }`}
      dir={dir}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex ${dir === 'rtl' ? 'flex-row-reverse' : ''} justify-between items-center h-20`}>
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="text-3xl font-bold text-black">
              BibaLuxe
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-black hover:text-green-600 transition-colors font-medium text-sm"
            >
              {t('common.home')}
            </Link>
            <Link
              href="#products"
              className="text-black hover:text-green-600 transition-colors font-medium text-sm"
            >
              {t('common.mattresses')}
            </Link>
            <Link
              href="#furniture"
              className="text-black hover:text-green-600 transition-colors font-medium text-sm"
            >
              {t('common.furniture')}
            </Link>
            <Link
              href="#about"
              className="text-black hover:text-green-600 transition-colors font-medium text-sm"
            >
              {t('common.about')}
            </Link>
            <Link
              href="#contact"
              className="text-black hover:text-green-600 transition-colors font-medium text-sm"
            >
              {t('common.contact')}
            </Link>
          </div>

          {/* Right side icons */}
          <div className="hidden lg:flex items-center space-x-4">
            <LanguageSwitcher />
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-black hover:text-green-600 transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link
              href="/wishlist"
              className="p-2 text-black hover:text-green-600 transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {getWishlistCount() > 0 && (
                <span className={`absolute top-0 ${dir === 'rtl' ? 'left-0' : 'right-0'} bg-green-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center`}>
                  {getWishlistCount()}
                </span>
              )}
            </Link>
            <Cart />
            <button className="p-2 text-black hover:text-green-600 transition-colors">
              <User className="w-5 h-5" />
            </button>
            <Link
              href="/#products"
              className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-all font-medium text-sm"
            >
              {t('common.shopNow')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 ${dir === 'rtl' ? 'order-first' : 'order-last'}`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className={`lg:hidden py-4 border-t border-gray-200 ${dir === 'rtl' ? 'space-y-reverse' : ''}`}>
            <div className={`space-y-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              <Link
                href="/"
                className="block text-black hover:text-gray-600 transition-colors py-2"
              >
                {t('common.home')}
              </Link>
              <Link
                href="#products"
                className="block text-black hover:text-gray-600 transition-colors py-2"
              >
                {t('common.mattresses')}
              </Link>
              <Link
                href="#furniture"
                className="block text-black hover:text-gray-600 transition-colors py-2"
              >
                {t('common.furniture')}
              </Link>
              <Link
                href="#about"
                className="block text-black hover:text-gray-600 transition-colors py-2"
              >
                {t('common.about')}
              </Link>
              <Link
                href="#contact"
                className="block text-black hover:text-gray-600 transition-colors py-2"
              >
                {t('common.contact')}
              </Link>
              <div className={`flex ${dir === 'rtl' ? 'flex-row-reverse' : ''} pt-4`}>
                <button className="flex-1 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-all font-medium">
                  {t('common.shopNow')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
}
