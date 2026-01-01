'use client';

import { useEffect, useState } from 'react';
import { Product, productsApi } from '@/lib/api';
import ProductCard from './ProductCard';

export default function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const viewed = localStorage.getItem('recently-viewed');
    if (viewed) {
      try {
        const productIds = JSON.parse(viewed);
        // Fetch products by IDs (simplified - in production, fetch from API)
        productsApi.getAll().then((allProducts) => {
          const viewedProducts = allProducts.filter((p) => productIds.includes(p._id));
          setProducts(viewedProducts.slice(0, 4));
        });
      } catch (error) {
        console.error('Error loading recently viewed:', error);
      }
    }
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black">Recently Viewed</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              name={product.name}
              tagline={product.tagline}
              price={product.price}
              image={product.image}
              category={product.category}
              rating={product.rating}
              reviewsCount={product.reviewsCount}
              shippingInfo={product.shippingInfo}
              inStock={product.inStock}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Helper to track product views
export function trackProductView(productId: string) {
  const viewed = localStorage.getItem('recently-viewed');
  let productIds: string[] = viewed ? JSON.parse(viewed) : [];
  
  // Remove if already exists and add to front
  productIds = productIds.filter((id) => id !== productId);
  productIds.unshift(productId);
  
  // Keep only last 10
  productIds = productIds.slice(0, 10);
  
  localStorage.setItem('recently-viewed', JSON.stringify(productIds));
}

