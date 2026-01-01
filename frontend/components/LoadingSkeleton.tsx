'use client';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
      <div className="w-full h-80 bg-gray-200" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
          ))}
        </div>
        <div className="h-8 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="h-[600px] bg-gray-200 rounded-2xl" />
        <div className="space-y-6">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-12 bg-gray-200 rounded w-3/4" />
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          <div className="h-8 bg-gray-200 rounded w-32" />
          <div className="h-24 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded w-full" />
        </div>
      </div>
    </div>
  );
}

