'use client';

import { useWishlist } from '@/contexts/WishlistContext';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 pt-32">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">My Wishlist</h1>
            <p className="text-gray-600">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              className="px-6 py-3 border-2 border-gray-300 rounded-full hover:border-red-600 hover:text-red-600 transition-colors font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-black mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Start adding products you love to your wishlist!</p>
            <Link
              href="/#products"
              className="inline-block px-8 py-4 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all font-semibold"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((product) => (
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
        )}
      </div>
      <Footer />
    </div>
  );
}

