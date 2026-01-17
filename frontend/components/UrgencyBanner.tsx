'use client';

import { Clock, AlertCircle, TrendingDown, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useI18n } from '@/contexts/I18nContext';

export default function UrgencyBanner() {
  const { t } = useI18n();
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    // Set random visitor count only on client side after component mounts
    // Initial random visitor count set only on client side after component mounts
    if (visitorCount === null) {
      setVisitorCount(Math.floor(Math.random() * 50) + 20);
    }
  }, [visitorCount]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    // Update visitor count periodically
    const visitorTimer = setInterval(() => {
      setVisitorCount((prev) => {
        if (prev === null) return 20; // Default value if null
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(15, Math.min(80, prev + change));
      });
    }, 15000);

    return () => {
      clearInterval(timer);
      clearInterval(visitorTimer);
    };
  }, []);

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 text-center animate-pulse">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 animate-spin" />
          <span className="font-semibold">{t('urgency.limitedTime')}:</span>
          <span className="font-bold text-yellow-300">
            {String(timeLeft.hours).padStart(2, '0')}:
            {String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span>{t('urgency.endsIn')}</span>
        </div>
        <div className="hidden sm:block">|</div>
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4" />
          <span className="font-semibold">{t('urgency.upToOff')}</span>
        </div>
        <div className="hidden md:block">|</div>
        <div className="hidden md:flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-300" />
          <span>{visitorCount !== null && t('urgency.peopleViewing', { count: visitorCount })}</span>
        </div>
      </div>
    </div>
  );
}

