'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import enMessages from '@/messages/en.json';
import frMessages from '@/messages/fr.json';
import arMessages from '@/messages/ar.json';

type Locale = 'en' | 'fr' | 'ar';
type Messages = typeof enMessages;

const messages: Record<Locale, Messages> = {
  en: enMessages,
  fr: frMessages,
  ar: arMessages,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  // Always start with 'en' to avoid SSR/hydration mismatch
  const [locale, setLocaleState] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only access localStorage after mount (client-side only)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('preferred-locale') as Locale;
      if (saved && ['en', 'fr', 'ar'].includes(saved)) {
        setLocaleState(saved);
      } else {
        // Detect from browser
        const browserLang = navigator.language || (navigator as any).userLanguage;
        if (browserLang.startsWith('fr')) {
          setLocaleState('fr');
        } else if (browserLang.startsWith('ar')) {
          setLocaleState('ar');
        }
      }
    }
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      // Update HTML lang and dir attributes
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
      // Save to localStorage
      localStorage.setItem('preferred-locale', locale);
    }
  }, [locale, mounted]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = messages[locale];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        // Fallback to English
        value = messages.en;
        for (const k2 of keys) {
          value = value?.[k2];
        }
        break;
      }
    }

    if (typeof value !== 'string') {
      return key; // Return key if translation not found
    }

    // Replace parameters
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  };

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // Always provide context, even during SSR
  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

