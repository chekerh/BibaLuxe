'use client';

import { AlertCircle, CheckCircle } from 'lucide-react';

interface StockIndicatorProps {
  inStock: boolean;
  stockCount?: number;
}

export default function StockIndicator({ inStock, stockCount }: StockIndicatorProps) {
  if (!inStock) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm font-semibold">Out of Stock</span>
      </div>
    );
  }

  if (stockCount && stockCount < 10) {
    return (
      <div className="flex items-center gap-2 text-orange-600">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm font-semibold">Only {stockCount} left in stock</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-green-600">
      <CheckCircle className="w-4 h-4" />
      <span className="text-sm font-semibold">In Stock</span>
      {stockCount && stockCount > 10 && (
        <span className="text-xs text-gray-600">({stockCount} available)</span>
      )}
    </div>
  );
}

