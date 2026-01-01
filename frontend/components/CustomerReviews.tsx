'use client';

import { Star, ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
  helpful: number;
}

interface CustomerReviewsProps {
  productId: string;
  averageRating?: number;
  reviewsCount?: number;
}

export default function CustomerReviews({
  productId,
  averageRating = 4.5,
  reviewsCount = 0,
}: CustomerReviewsProps) {
  const { t } = useI18n();
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      author: 'Sarah M.',
      rating: 5,
      date: '2024-01-15',
      title: 'Best mattress I\'ve ever owned!',
      content: 'I\'ve had this mattress for 3 months now and it\'s absolutely amazing. The cooling gel layer really works, and I wake up feeling refreshed every morning.',
      verified: true,
      helpful: 24,
    },
    {
      id: '2',
      author: 'Michael T.',
      rating: 4,
      date: '2024-01-10',
      title: 'Great quality, minor complaint',
      content: 'The mattress is very comfortable and well-made. My only issue is that it took a bit longer to fully expand than expected, but it\'s perfect now.',
      verified: true,
      helpful: 12,
    },
    {
      id: '3',
      author: 'Emily R.',
      rating: 5,
      date: '2024-01-05',
      title: 'Exceeded expectations',
      content: 'I was skeptical about buying a mattress online, but this one is perfect. The delivery was fast and the setup was easy. Highly recommend!',
      verified: true,
      helpful: 18,
    },
  ]);

  return (
    <section className="py-12 border-t border-gray-200">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-black mb-4">{t('customerReviews.title')}</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${
                  i < Math.floor(averageRating)
                    ? 'fill-green-600 text-green-600'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-2xl font-bold text-black">{averageRating.toFixed(1)}</span>
          <span className="text-gray-600">{t('product.reviewsCount', { count: reviewsCount || reviews.length })}</span>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-black">{review.author}</h3>
                  {review.verified && (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      {t('customerReviews.verified')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'fill-green-600 text-green-600'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{review.date}</span>
                </div>
              </div>
            </div>
            <h4 className="font-semibold text-black mb-2">{review.title}</h4>
            <p className="text-gray-700 mb-4">{review.content}</p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                {t('customerReviews.helpful')} ({review.helpful})
              </button>
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-8 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all font-semibold">
        {t('customerReviews.writeReview')}
      </button>
    </section>
  );
}

