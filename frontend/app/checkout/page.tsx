'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { CreditCard, Lock, Truck, MapPin, User, Mail, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TrustBadges from '@/components/TrustBadges';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/components/Toast';
import { useI18n } from '@/contexts/I18nContext';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const { showToast } = useToast();
  const { t } = useI18n();
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 pt-32 text-center">
          <h1 className="text-4xl font-bold text-black mb-4">{t('checkout.emptyCart')}</h1>
          <p className="text-gray-600 mb-8">{t('checkout.addProductsToCheckout')}</p>
          <Link
            href="/#products"
            className="inline-block px-8 py-4 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all font-semibold"
          >
            {t('cart.continueShopping')}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal > 500 ? 0 : 49.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate order processing
    showToast('Order placed successfully!', 'success');
    clearCart();
    // Redirect to order confirmation
  };

  return (
    <div className="min-h-screen bg-white">
      <TrustBadges />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 pt-32">
        <h1 className="text-4xl font-bold text-black mb-8">{t('checkout.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Truck className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-black">{t('checkout.shippingInformation')}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder={`${t('checkout.firstName')} *`}
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-black"
                  required
                />
                <input
                  type="text"
                  placeholder={`${t('checkout.lastName')} *`}
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-black"
                  required
                />
                <input
                  type="email"
                  placeholder={`${t('checkout.email')} *`}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-black"
                  required
                />
                <input
                  type="tel"
                  placeholder={`${t('checkout.phone')} *`}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-black"
                  required
                />
                <input
                  type="text"
                  placeholder={`${t('checkout.address')} *`}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="md:col-span-2 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-black"
                  required
                />
                <input
                  type="text"
                  placeholder={`${t('checkout.city')} *`}
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-black"
                  required
                />
                <input
                  type="text"
                  placeholder={`${t('checkout.state')} *`}
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-black"
                  required
                />
                <input
                  type="text"
                  placeholder={`${t('checkout.zipCode')} *`}
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-black"
                  required
                />
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-black">{t('checkout.paymentInformation')}</h2>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <button
                    onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      formData.paymentMethod === 'card'
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    {t('checkout.creditCard')}
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, paymentMethod: 'paypal' })}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      formData.paymentMethod === 'paypal'
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    {t('checkout.paypal')}
                  </button>
                </div>
                {formData.paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder={t('checkout.cardNumber')}
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-black"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder={t('checkout.expiryDate')}
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-black"
                      />
                      <input
                        type="text"
                        placeholder={t('checkout.cvv')}
                        value={formData.cvv}
                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                        className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-black"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder={t('checkout.nameOnCard')}
                      value={formData.nameOnCard}
                      onChange={(e) => setFormData({ ...formData, nameOnCard: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-black"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 sticky top-32">
              <h2 className="text-2xl font-bold text-black mb-6">{t('checkout.orderSummary')}</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    {item.image ? (
                      <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">
                          {item.category === 'mattress' ? '🛏️' : '🪑'}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-black truncate">{item.name}</p>
                      <p className="text-sm text-gray-600">{t('checkout.qty')}: {item.quantity}</p>
                      <p className="text-green-600 font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>{t('cart.subtotal')}</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('cart.shipping')}</span>
                  <span>{shipping === 0 ? t('cart.free') : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('cart.tax')}</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-black pt-4 border-t border-gray-200">
                  <span>{t('cart.total')}</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full px-6 py-4 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                {t('checkout.placeOrder')}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                {t('checkout.securePayment')}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

