'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQ() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const faqs: FAQItem[] = [
    {
      category: 'shipping',
      question: t('faq.questions.shippingTime'),
      answer: t('faq.questions.shippingTimeAnswer'),
    },
    {
      category: 'returns',
      question: t('faq.questions.returnPolicy'),
      answer: t('faq.questions.returnPolicyAnswer'),
    },
    {
      category: 'products',
      question: t('faq.questions.whiteGlove'),
      answer: t('faq.questions.whiteGloveAnswer'),
    },
    {
      category: 'warranty',
      question: t('faq.questions.warrantyOffer'),
      answer: t('faq.questions.warrantyOfferAnswer'),
    },
    {
      category: 'products',
      question: t('faq.questions.tryBeforeBuy'),
      answer: t('faq.questions.tryBeforeBuyAnswer'),
    },
    {
      category: 'shipping',
      question: t('faq.questions.internationalShipping'),
      answer: t('faq.questions.internationalShippingAnswer'),
    },
    {
      category: 'payment',
      question: t('faq.questions.paymentMethods'),
      answer: t('faq.questions.paymentMethodsAnswer'),
    },
    {
      category: 'products',
      question: t('faq.questions.chooseSize'),
      answer: t('faq.questions.chooseSizeAnswer'),
    },
    {
      category: 'returns',
      question: t('faq.questions.damagedProduct'),
      answer: t('faq.questions.damagedProductAnswer'),
    },
    {
      category: 'warranty',
      question: t('faq.questions.warrantyClaim'),
      answer: t('faq.questions.warrantyClaimAnswer'),
    },
  ];

  const categories = ['all', 'shipping', 'returns', 'products', 'warranty', 'payment'];
  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <section className="py-20 px-4 md:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            {t('faq.title')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('faq.findAnswers')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t(`faq.categories.${category}`)}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
              >
                <span className="font-semibold text-black pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-12 text-center bg-green-50 rounded-2xl p-8 border border-green-200">
          <h3 className="text-2xl font-bold text-black mb-4">{t('faq.stillHaveQuestions')}</h3>
          <p className="text-gray-600 mb-6">
            {t('faq.customerService24')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+15551234567"
              className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all font-semibold"
            >
              {t('faq.callUs')}
            </a>
            <a
              href="mailto:support@bibaluxe.com"
              className="px-6 py-3 bg-white text-green-600 rounded-full hover:bg-gray-100 transition-all font-semibold border-2 border-green-600"
            >
              {t('faq.emailSupport')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

