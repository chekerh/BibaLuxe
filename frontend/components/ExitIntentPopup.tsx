'use client';

import { useEffect, useState } from 'react';
import { X, Percent, Mail } from 'lucide-react';
import { useToast } from './Toast';
import { useI18n } from '@/contexts/I18nContext';

export default function ExitIntentPopup() {
  const { t, dir } = useI18n();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    const consent = localStorage.getItem('exit-intent-shown');
    if (consent) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShow(true);
        localStorage.setItem('exit-intent-shown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast(t('exitIntent.invalidEmail'), 'error');
      return;
    }

    showToast(t('exitIntent.successMessage'), 'success');
    setEmail('');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full relative shadow-2xl">
        <button
          onClick={() => setShow(false)}
          className={`absolute top-4 ${dir === 'rtl' ? 'left-4' : 'right-4'} text-gray-400 hover:text-gray-600`}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Percent className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-black mb-2">{t('exitIntent.title')}</h2>
          <p className="text-gray-600 mb-4">
            {t('exitIntent.message')}
          </p>
          <p className="text-sm text-gray-500">
            {t('exitIntent.subMessage')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('exitIntent.emailPlaceholder')}
              className={`w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-black`}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-4 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-all"
          >
            {t('exitIntent.subscribe')}
          </button>
          <button
            type="button"
            onClick={() => setShow(false)}
            className="w-full text-sm text-gray-500 hover:text-gray-700"
          >
            {t('exitIntent.noThanks')}
          </button>
        </form>
      </div>
    </div>
  );
}

