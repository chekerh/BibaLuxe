'use client';

import { Ruler, Bed, Sofa, Table } from 'lucide-react';
import { useState } from 'react';

interface SizeGuideProps {
  category: 'mattress' | 'furniture';
}

export default function SizeGuide({ category }: SizeGuideProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');

  const mattressSizes = [
    { name: 'Twin', dimensions: '38" × 75"', area: '2,850 sq in' },
    { name: 'Twin XL', dimensions: '38" × 80"', area: '3,040 sq in' },
    { name: 'Full', dimensions: '54" × 75"', area: '4,050 sq in' },
    { name: 'Queen', dimensions: '60" × 80"', area: '4,800 sq in' },
    { name: 'King', dimensions: '76" × 80"', area: '6,080 sq in' },
    { name: 'Cal King', dimensions: '72" × 84"', area: '6,048 sq in' },
  ];

  const furnitureSizes = [
    { name: 'Sofa - Small', dimensions: '72" × 36" × 34"', seats: '2-3 people' },
    { name: 'Sofa - Medium', dimensions: '84" × 36" × 34"', seats: '3-4 people' },
    { name: 'Sofa - Large', dimensions: '96" × 36" × 34"', seats: '4-5 people' },
    { name: 'Sectional - 3-Piece', dimensions: '120" × 36" × 34"', seats: '5-6 people' },
    { name: 'Dining Table - 4 Seater', dimensions: '60" × 36" × 30"', seats: '4 people' },
    { name: 'Dining Table - 6 Seater', dimensions: '72" × 36" × 30"', seats: '6 people' },
  ];

  const sizes = category === 'mattress' ? mattressSizes : furnitureSizes;

  return (
    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        {category === 'mattress' ? (
          <Bed className="w-6 h-6 text-green-600" />
        ) : (
          <Sofa className="w-6 h-6 text-green-600" />
        )}
        <h3 className="text-2xl font-bold text-black">Size Guide</h3>
      </div>

      <p className="text-gray-600 mb-6">
        {category === 'mattress'
          ? 'Choose the right mattress size for your space and sleeping needs.'
          : 'Find the perfect furniture size for your room.'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {sizes.map((size) => (
          <button
            key={size.name}
            onClick={() => setSelectedSize(size.name)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              selectedSize === size.name
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <h4 className="font-semibold text-black mb-2">{size.name}</h4>
            <p className="text-sm text-gray-600 mb-1">
              <Ruler className="w-3 h-3 inline mr-1" />
              {size.dimensions}
            </p>
            {'area' in size ? (
              <p className="text-xs text-gray-500">Area: {size.area}</p>
            ) : (
              <p className="text-xs text-gray-500">Seats: {size.seats}</p>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="font-semibold text-black mb-4">Measuring Tips</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          {category === 'mattress' ? (
            <>
              <li>• Measure your bedroom space before ordering</li>
              <li>• Leave at least 2 feet of space around the bed for movement</li>
              <li>• Consider doorways and stairways for delivery</li>
              <li>• Standard ceiling height: 8-9 feet (ensure bed fits)</li>
            </>
          ) : (
            <>
              <li>• Measure your room dimensions before purchasing</li>
              <li>• Leave 30-36 inches of clearance for walkways</li>
              <li>• Consider existing furniture placement</li>
              <li>• Check door and hallway widths for delivery</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

