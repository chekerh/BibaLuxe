import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200 mb-4">404</h1>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="px-8 py-4 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all flex items-center justify-center gap-2 font-semibold"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link
            href="/#products"
            className="px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-all flex items-center justify-center gap-2 font-semibold"
          >
            <Search className="w-5 h-5" />
            Browse Products
          </Link>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
          <h3 className="text-xl font-semibold text-black mb-4">Popular Pages</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <Link
              href="/"
              className="p-4 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <p className="font-semibold text-black">Home</p>
              <p className="text-sm text-gray-600">Back to homepage</p>
            </Link>
            <Link
              href="/#products"
              className="p-4 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <p className="font-semibold text-black">Mattresses</p>
              <p className="text-sm text-gray-600">Browse our collection</p>
            </Link>
            <Link
              href="/#furniture"
              className="p-4 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <p className="font-semibold text-black">Furniture</p>
              <p className="text-sm text-gray-600">Modern furniture</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

