'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '@/lib/api';
import { productsApi } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const searchProducts = async () => {
      try {
        const allProducts = await productsApi.getAll();
        const filtered = allProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase()) ||
            p.tagline?.toLowerCase().includes(query.toLowerCase()) ||
            p.highlights?.some((h) => h.toLowerCase().includes(query.toLowerCase()))
        );
        setResults(filtered.slice(0, 6));
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="absolute top-0 left-0 right-0 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for mattresses, furniture..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-lg"
            />
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Results */}
          {query && (
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Searching...</div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((product) => (
                    <Link
                      key={product._id}
                      href={`/products/${product._id}`}
                      onClick={onClose}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors group"
                    >
                      {product.image ? (
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">
                            {product.category === 'mattress' ? '🛏️' : '🪑'}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-black group-hover:text-green-600 transition-colors truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">{product.tagline}</p>
                        <p className="text-lg font-bold text-green-600">${product.price.toFixed(2)}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No products found for "{query}"
                </div>
              )}
            </div>
          )}

          {/* Popular Searches */}
          {!query && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-3">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Memory Foam Mattress', 'Sofa Set', 'Hybrid Mattress', 'Dining Table'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

