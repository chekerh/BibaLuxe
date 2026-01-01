// Analytics tracking utility
// In production, integrate with Google Analytics, Mixpanel, etc.

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  // Only track in browser
  if (typeof window === 'undefined') return;

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', eventName, properties);
  }

  // Google Analytics 4
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, properties);
  }

  // Facebook Pixel
  if (typeof window.fbq !== 'undefined') {
    window.fbq('track', eventName, properties);
  }

  // Custom analytics endpoint (if you have one)
  // fetch('/api/analytics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ event: eventName, properties }),
  // });
};

export const trackPageView = (path: string) => {
  trackEvent('page_view', { path });
};

export const trackProductView = (productId: string, productName: string) => {
  trackEvent('view_product', { product_id: productId, product_name: productName });
};

export const trackAddToCart = (productId: string, productName: string, price: number) => {
  trackEvent('add_to_cart', {
    product_id: productId,
    product_name: productName,
    price,
  });
};

export const trackPurchase = (orderId: string, total: number, items: any[]) => {
  trackEvent('purchase', {
    order_id: orderId,
    total,
    items_count: items.length,
  });
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

