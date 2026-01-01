'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">BibaLuxe</h3>
            <p className="text-gray-400 mb-4">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-green-600 transition-colors">
                  {t('common.home')}
                </Link>
              </li>
              <li>
                <Link href="#products" className="hover:text-green-600 transition-colors">
                  {t('common.mattresses')}
                </Link>
              </li>
              <li>
                <Link href="#furniture" className="hover:text-green-600 transition-colors">
                  {t('common.furniture')}
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-green-600 transition-colors">
                  {t('common.about')}
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-green-600 transition-colors">
                  {t('common.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.customerService')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-green-600 transition-colors">
                  {t('footer.shippingInfo')}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-green-600 transition-colors">
                  {t('footer.returnsRefunds')}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-green-600 transition-colors">
                  {t('footer.warranty')}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-green-600 transition-colors">
                  {t('footer.faq')}
                </Link>
              </li>
              <li>
                <Link href="/order-tracking" className="hover:text-green-600 transition-colors">
                  {t('footer.trackOrder')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.contactUs')}</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-600" />
                <span>1-800-BIBALUXE</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-600" />
                <span>support@bibaluxe.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-green-600 mt-1" />
                <span>123 Sleep Street<br />Comfort City, CC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} BibaLuxe. {t('footer.allRightsReserved')}
          </p>
          <div className="flex gap-6 mt-4 md:mt-0 text-sm text-gray-400">
            <Link href="#" className="hover:text-green-600 transition-colors">
              {t('footer.privacyPolicy')}
            </Link>
            <Link href="#" className="hover:text-green-600 transition-colors">
              {t('footer.termsOfService')}
            </Link>
            <Link href="#" className="hover:text-green-600 transition-colors">
              {t('footer.cookiePolicy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

