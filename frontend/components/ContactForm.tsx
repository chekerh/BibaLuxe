'use client';

import { useState } from 'react';
import { Send, Mail, Phone, MessageSquare, User } from 'lucide-react';
import { useToast } from './Toast';
import { useI18n } from '@/contexts/I18nContext';

export default function ContactForm() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      showToast(t('contactForm.successMessage'), 'success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      showToast(t('contactForm.errorMessage'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-200">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">{t('contactForm.title')}</h2>
        <p className="text-gray-600">
          {t('home.haveQuestions')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-black mb-2">
              <User className="w-4 h-4 inline mr-2" />
              {t('contactForm.name')} *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-black"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              {t('contactForm.email')} *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-black"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-black mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              {t('checkout.phone')}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-black"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-semibold text-black mb-2">
              {t('contactForm.subject')} *
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-black"
            >
              <option value="">{t('contactForm.selectSubject')}</option>
              <option value="general">{t('contactForm.subjects.general')}</option>
              <option value="product">{t('contactForm.subjects.product')}</option>
              <option value="order">{t('contactForm.subjects.order')}</option>
              <option value="shipping">{t('contactForm.subjects.shipping')}</option>
              <option value="return">{t('contactForm.subjects.return')}</option>
              <option value="warranty">{t('contactForm.subjects.warranty')}</option>
              <option value="other">{t('contactForm.subjects.other')}</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-black mb-2">
            <MessageSquare className="w-4 h-4 inline mr-2" />
            {t('contactForm.message')} *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-black resize-none"
            placeholder="Tell us how we can help you..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-8 py-4 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
          {isSubmitting ? t('contactForm.sending') : t('contactForm.send')}
        </button>

        <p className="text-xs text-gray-500 text-center">
          {t('contactForm.privacyNotice')}
        </p>
      </form>
    </div>
  );
}

