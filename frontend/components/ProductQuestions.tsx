'use client';

import { useState } from 'react';
import { MessageSquare, HelpCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

interface Question {
  id: string;
  question: string;
  answer: string;
  author: string;
  date: string;
  helpful: number;
}

interface ProductQuestionsProps {
  productId: string;
}

export default function ProductQuestions({ productId }: ProductQuestionsProps) {
  const { t } = useI18n();
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState('');
  const [questions] = useState<Question[]>([
    {
      id: '1',
      question: t('productQuestions.questions.firmness'),
      answer: t('productQuestions.questions.firmnessAnswer'),
      author: 'BibaLuxe Team',
      date: '2024-01-10',
      helpful: 12,
    },
    {
      id: '2',
      question: t('productQuestions.questions.foundation'),
      answer: t('productQuestions.questions.foundationAnswer'),
      author: 'BibaLuxe Team',
      date: '2024-01-08',
      helpful: 8,
    },
    {
      id: '3',
      question: t('productQuestions.questions.breakIn'),
      answer: t('productQuestions.questions.breakInAnswer'),
      author: 'BibaLuxe Team',
      date: '2024-01-05',
      helpful: 15,
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to backend
    setShowForm(false);
    setQuestion('');
  };

  return (
    <section className="py-12 border-t border-gray-200">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-black flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-green-600" />
            {t('productQuestions.title')}
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all font-semibold flex items-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            {t('productQuestions.askQuestion')}
          </button>
        </div>
        <p className="text-gray-600">
          {t('product.askQuestion')}
        </p>
      </div>

      {/* Ask Question Form */}
      {showForm && (
        <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
          <h3 className="font-semibold text-black mb-4">{t('productQuestions.askQuestion')}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t('productQuestions.questionPlaceholder')}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-black resize-none"
              required
            />
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all font-semibold"
              >
                {t('productQuestions.submit')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setQuestion('');
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all font-semibold"
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q) => (
          <div key={q.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-black mb-2">{q.question}</h3>
                <p className="text-gray-700 mb-3">{q.answer}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{t('productQuestions.answeredBy', { author: q.author })}</span>
                  <span>•</span>
                  <span>{q.date}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                {t('productQuestions.helpful')} ({q.helpful})
              </button>
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                <ThumbsDown className="w-4 h-4" />
                {t('productQuestions.notHelpful')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {questions.length === 0 && !showForm && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{t('productQuestions.noQuestions')}</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all font-semibold"
          >
            {t('productQuestions.askQuestion')}
          </button>
        </div>
      )}
    </section>
  );
}

