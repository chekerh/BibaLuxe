'use client';

import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';

export default function LiveChat() {
  const { t, dir } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-50 bg-green-600 text-white p-4 rounded-full shadow-2xl hover:bg-green-700 transition-all hover:scale-110`}
        aria-label={t('liveChat.title')}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              1
            </span>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-24 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-50 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col`}>
          {/* Chat Header */}
          <div className={`bg-green-600 text-white p-4 rounded-t-2xl flex items-center ${dir === 'rtl' ? 'flex-row-reverse' : ''} justify-between`}>
            <div>
              <h3 className="font-semibold">{t('liveChat.title')}</h3>
              <p className="text-xs text-green-100">{t('liveChat.online')}</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                {t('liveChat.greeting')}
              </p>
            </div>
            <div className={dir === 'rtl' ? 'text-left' : 'text-right'}>
              <div className="bg-green-600 text-white rounded-lg p-3 inline-block">
                <p className="text-sm">{t('liveChat.sampleMessage')}</p>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t('liveChat.placeholder')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
              />
              <button className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-all">
                {t('liveChat.send')}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {t('liveChat.typicalReply')}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

