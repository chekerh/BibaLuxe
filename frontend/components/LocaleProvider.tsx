'use client';

import { useI18n } from '@/contexts/I18nContext';
import { useEffect, useState } from 'react';

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const { locale, dir } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only update HTML attributes after mount to avoid hydration issues
    if (mounted && typeof window !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = dir;
    }
  }, [locale, dir, mounted]);

  return <>{children}</>;
}

