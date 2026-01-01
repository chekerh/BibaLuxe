'use client';

import { Product } from '@/lib/api';
import ProductCard from './ProductCard';

interface ProductRecommendationsProps {
  currentProductId: string;
  allProducts: Product[];
  title?: string;
}

export default function ProductRecommendations({
  currentProductId,
  allProducts,
  title = 'You May Also Like',
}: ProductRecommendationsProps) {
  // Filter out current product and get 4 random products
  const recommendations = allProducts
    .filter((p) => p._id !== currentProductId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  if (recommendations.length === 0) return null;

  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black text-center">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((product) => (
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
            />
          ))}
        </div>
      </div>
    </section>
  );
}

