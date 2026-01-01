'use client';

import { Eye, Users, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';

interface SocialProofProps {
  productId?: string;
}

export default function SocialProof({ productId }: SocialProofProps) {
  const { t } = useI18n();
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 15) + 5);
  const [recentPurchases, setRecentPurchases] = useState(Math.floor(Math.random() * 8) + 2);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);

  useEffect(() => {
    // Simulate dynamic updates
    const interval = setInterval(() => {
      setViewers((prev) => {
        const change = Math.floor(Math.random() * 3) - 1;
        return Math.max(3, Math.min(20, prev + change));
      });
      
      // Add recent activity
      const activities = [
        'Sarah from New York just purchased',
        'Mike from California added to cart',
        'Emma from Texas is viewing',
        'John from Florida just purchased',
      ];
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setRecentActivity((prev) => [randomActivity, ...prev.slice(0, 2)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600 bg-green-50 px-3 py-1.5 rounded-full">
          <Eye className="w-4 h-4 text-green-600" />
          <span>
            <span className="font-semibold text-black">{viewers}</span> {t('urgency.peopleViewing', { count: viewers }).replace(`${viewers} `, '')}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 bg-green-50 px-3 py-1.5 rounded-full">
          <ShoppingBag className="w-4 h-4 text-green-600" />
          <span>
            <span className="font-semibold text-black">{recentPurchases}</span> {t('urgency.recentlyPurchased', { count: recentPurchases }).replace(`${recentPurchases} `, '')}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 bg-green-50 px-3 py-1.5 rounded-full">
          <Users className="w-4 h-4 text-green-600" />
          <span>
            <span className="font-semibold text-black">1,234</span> happy customers
          </span>
        </div>
      </div>
      {recentActivity.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-gray-500 animate-fade-in">
          <CheckCircle2 className="w-3 h-3 text-green-600" />
          <span className="italic">{recentActivity[0]}</span>
        </div>
      )}
    </div>
  );
}

