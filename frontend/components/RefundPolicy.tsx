'use client';

import { RotateCcw, Shield, Clock, Package, CheckCircle } from 'lucide-react';

export default function RefundPolicy() {
  return (
    <section className="py-20 px-4 md:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            Our Refund Policy
          </h2>
          <p className="text-lg text-gray-600">
            Your satisfaction is our priority. We make returns easy and hassle-free.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200">
          <div className="space-y-8">
            {/* 30-Day Return Window */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-black">30-Day Return Window</h3>
                <p className="text-gray-700 leading-relaxed">
                  You have 30 days from the date of delivery to return any item for a full refund. 
                  Items must be in original condition with all tags and packaging intact.
                </p>
              </div>
            </div>

            {/* Free Return Shipping */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-black">Free Return Shipping</h3>
                <p className="text-gray-700 leading-relaxed">
                  We cover all return shipping costs. Simply contact us to initiate a return, 
                  and we'll provide a prepaid shipping label.
                </p>
              </div>
            </div>

            {/* Quick Refund Processing */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <RotateCcw className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-black">Quick Refund Processing</h3>
                <p className="text-gray-700 leading-relaxed">
                  Once we receive your return, refunds are processed within 3-5 business days. 
                  The refund will appear in your original payment method within 5-10 business days.
                </p>
              </div>
            </div>

            {/* How to Return */}
            <div className="border-t border-gray-200 pt-8 mt-8">
              <h3 className="text-2xl font-bold mb-6 text-black">How to Return an Item</h3>
              <ol className="space-y-4">
                {[
                  'Contact our customer service team via phone or email',
                  'Receive your prepaid return shipping label',
                  'Package the item securely in its original packaging',
                  'Drop off at any shipping location or schedule a pickup',
                  'Track your return and receive confirmation',
                ].map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-gray-700 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Contact for Returns */}
            <div className="bg-gray-50 rounded-xl p-6 mt-8">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-black mb-2">Need Help with a Return?</p>
                  <p className="text-gray-700">
                    Call us at <a href="tel:+15551234567" className="text-black font-semibold hover:underline">+1 (555) 123-4567</a> or 
                    email <a href="mailto:returns@bibaluxe.com" className="text-black font-semibold hover:underline">returns@bibaluxe.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

