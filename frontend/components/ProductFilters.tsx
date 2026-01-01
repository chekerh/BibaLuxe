'use client';

import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'name';
  onSortChange?: (sort: 'price-asc' | 'price-desc' | 'rating' | 'name') => void;
}

export default function ProductFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  minPrice,
  maxPrice,
  onPriceChange,
  minRating,
  onRatingChange,
  sortBy = 'rating',
  onSortChange,
}: ProductFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search mattresses, furniture..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter Toggle & Sort */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-full hover:border-green-600 transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="font-medium">Filters</span>
        </button>
        
        {onSortChange && (
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-600" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="px-4 py-2 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-sm font-medium"
            >
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        )}

        {(selectedCategory !== 'all' || minPrice > 0 || minRating > 0) && (
          <button
            onClick={() => {
              onCategoryChange('all');
              onPriceChange(0, 10000);
              onRatingChange(0);
            }}
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Category
            </label>
            <div className="flex flex-wrap gap-3">
              {['all', 'mattress', 'furniture'].map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Price Range: ${minPrice} - ${maxPrice}
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => onPriceChange(0, parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>$0</span>
                <span>$5,000+</span>
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Minimum Rating: {minRating > 0 ? `${minRating}+ stars` : 'Any'}
            </label>
            <div className="flex gap-2">
              {[0, 3, 4, 4.5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => onRatingChange(rating)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    minRating === rating
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {rating === 0 ? 'Any' : `${rating}+ ⭐`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

