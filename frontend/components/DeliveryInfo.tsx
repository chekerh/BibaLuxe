'use client';

import { Truck, MapPin, Clock, Package, CheckCircle } from 'lucide-react';

export default function DeliveryInfo() {
  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            Delivery & Livraison
          </h2>
          <p className="text-lg text-gray-600">
            Fast, reliable delivery to your door
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Delivery Options */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-black p-3 rounded-full">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black">Delivery Options</h3>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Standard Delivery', time: '5-7 business days', price: 'Free over $500' },
                { name: 'Express Delivery', time: '2-3 business days', price: '$49' },
                { name: 'White-Glove Service', time: '7-10 business days', price: '$149' },
              ].map((option, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-black">{option.name}</p>
                    <p className="text-sm text-gray-600">{option.time}</p>
                    <p className="text-sm font-medium text-gray-700 mt-1">{option.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Features */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-black p-3 rounded-full">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black">What's Included</h3>
            </div>
            <div className="space-y-4">
              {[
                { icon: <MapPin className="w-5 h-5" />, text: 'Real-time tracking updates' },
                { icon: <Clock className="w-5 h-5" />, text: 'Scheduled delivery windows' },
                { icon: <CheckCircle className="w-5 h-5 text-green-600" />, text: 'Room-of-choice placement' },
                { icon: <Package className="w-5 h-5" />, text: 'Packaging removal & setup (White-Glove)' },
                { icon: <Truck className="w-5 h-5" />, text: 'Old furniture haul-away available' },
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="text-black">{feature.icon}</div>
                  <span className="text-gray-700">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery Areas */}
        <div className="mt-8 bg-black text-white rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Delivery Areas</h3>
          <p className="text-lg mb-4">
            We deliver nationwide with special services available in major metropolitan areas.
          </p>
          <p className="text-gray-300">
            Contact us for specific delivery options in your area
          </p>
        </div>
      </div>
    </section>
  );
}

