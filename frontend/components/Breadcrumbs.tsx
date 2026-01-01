'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-green-600 transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.href ? (
            <Link href={item.href} className="hover:text-green-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-black font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

