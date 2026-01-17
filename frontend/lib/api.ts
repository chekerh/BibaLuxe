import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper to get current locale from localStorage (safe for SSR)
function getCurrentLocale(): string {
  // Default to 'en' for SSR, will be updated on client
  if (typeof window === 'undefined') {
    return 'en';
  }
  
  try {
    const saved = localStorage.getItem('preferred-locale');
    if (saved && ['en', 'fr', 'ar'].includes(saved)) {
      return saved;
    }
  } catch (e) {
    // localStorage might not be available
    console.warn('Could not access localStorage:', e);
  }
  
  return 'en';
}

// Helper to get JWT token from localStorage
function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    return localStorage.getItem('admin-token');
  } catch (e) {
    console.warn('Could not access localStorage:', e);
    return null;
  }
}

// Helper to clear auth token
function clearAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-user');
  }
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // CSRF protection indicator
  },
  timeout: 30000, // 30 second timeout for Render free tier
  withCredentials: true, // Match backend CORS credentials: true
});

// Add request interceptor for JWT token and debugging
api.interceptors.request.use(
  (config) => {
    // Add JWT token to all requests if available
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (process.env.NODE_ENV === 'development') {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling and security
api.interceptors.response.use(
  (response) => {
    // Security: Validate response structure
    if (response.data && typeof response.data === 'object') {
      // Sanitize response data (basic check)
      return response;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear invalid token
      clearAuthToken();
      
      // Redirect to login if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
      
      return Promise.reject(error);
    }

    // Security: Don't expose sensitive error details in production
    if (process.env.NODE_ENV === 'production') {
      if (error.response?.status >= 500) {
        error.message = 'Server error. Please try again later.';
      } else if (error.response?.status === 401) {
        error.message = 'Unauthorized. Please check your credentials.';
      } else if (error.response?.status === 403) {
        error.message = 'Access forbidden.';
      }
    }
    
    if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
      console.warn('Backend server is not running. Using fallback data.');
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export interface LocalizedString {
  en: string;
  ar: string;
  fr: string;
}

export interface Product {
  _id: string;
  name: LocalizedString;
  tagline?: LocalizedString;
  price: number;
  description: LocalizedString;
  category: string;
  image?: string;
  model3d?: string;
  highlights?: LocalizedString[];
  rating?: number;
  reviewsCount?: number;
  shippingInfo?: LocalizedString;
  warrantyYears?: number;
  specifications?: Record<string, LocalizedString>;
  inStock: boolean;
}

// Fallback sample data when backend is unavailable
const fallbackProducts: Product[] = [
  {
    _id: '1',
    name: {
      en: 'Luxury Memory Foam Mattress',
      ar: 'مرتبة إسفنجية فاخرة',
      fr: 'Matelas en mousse à mémoire de forme de luxe',
    },
    tagline: {
      en: 'Cooling support for deeper sleep',
      ar: 'دعم تبريد لنوم أعمق',
      fr: 'Support rafraîchissant pour un sommeil plus profond',
    },
    price: 1299.99,
    description: {
      en: 'Premium memory foam mattress with cooling gel layer for the ultimate sleep experience.',
      ar: 'مرتبة إسفنجية فاخرة مع طبقة جل مبردة لتجربة نوم مثالية.',
      fr: 'Matelas en mousse à mémoire de forme premium avec couche de gel rafraîchissant pour une expérience de sommeil ultime.',
    },
    category: 'mattress',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800',
    model3d: '/models/mattress/mattress.glb',
    highlights: [
      { en: 'Cooling gel layer', ar: 'طبقة جل مبردة', fr: 'Couche de gel rafraîchissant' },
      { en: 'Advanced pressure relief', ar: 'تخفيف متقدم للضغط', fr: 'Soulagement avancé de la pression' },
      { en: 'Zero motion transfer', ar: 'عدم نقل الحركة', fr: 'Transfert de mouvement nul' },
    ],
    rating: 4.8,
    reviewsCount: 842,
    shippingInfo: {
      en: 'Free 2–5 day delivery',
      ar: 'توصيل مجاني خلال 2-5 أيام',
      fr: 'Livraison gratuite en 2-5 jours',
    },
    warrantyYears: 15,
    specifications: {
      size: { en: 'King', ar: 'كينغ', fr: 'King' },
      material: { en: 'Memory Foam', ar: 'رغوة الذاكرة', fr: 'Mousse à mémoire de forme' },
      firmness: { en: 'Medium', ar: 'متوسطة', fr: 'Moyenne' },
    },
    inStock: true,
  },
  {
    _id: '2',
    name: {
      en: 'Hybrid Comfort Mattress',
      ar: 'مرتبة الراحة الهجينة',
      fr: 'Matelas Confort Hybride',
    },
    tagline: {
      en: 'The ultimate blend of plush comfort & responsive support',
      ar: 'المزيج الأمثل من الراحة الفخمة والدعم المتجاوب',
      fr: 'Le mélange ultime de confort moelleux et de soutien réactif',
    },
    price: 1499.99,
    description: {
      en: 'Best of both worlds - combines memory foam comfort with innerspring support.',
      ar: 'الأفضل من العالمين - يجمع بين راحة الإسفنج الذاكري ودعم النوابض الداخلية.',
      fr: 'Le meilleur des deux mondes - combine le confort de la mousse à mémoire de forme avec le soutien des ressorts ensachés.',
    },
    category: 'mattress',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    model3d: '/models/mattress/mattress.glb',
    highlights: [
      { en: 'Adaptive memory foam', ar: 'إسفنج ذاكرة متكيف', fr: 'Mousse à mémoire de forme adaptative' },
      { en: 'Pocketed coils', ar: 'نوابض مغلفة', fr: 'Ressorts ensachés' },
      { en: 'Breathable design', ar: 'تصميم قابل للتنفس', fr: 'Conception respirante' },
    ],
    rating: 4.9,
    reviewsCount: 1230,
    shippingInfo: {
      en: 'Free 2–5 day delivery',
      ar: 'توصيل مجاني خلال 2-5 أيام',
      fr: 'Livraison gratuite en 2-5 jours',
    },
    warrantyYears: 20,
    specifications: {
      size: { en: 'Cal King', ar: 'كال كينغ', fr: 'Cal King' },
      material: { en: 'Hybrid', ar: 'هجين', fr: 'Hybride' },
      firmness: { en: 'Medium-Firm', ar: 'متوسطة الصلابة', fr: 'Mi-ferme' },
    },
    inStock: true,
  },
  {
    _id: '3',
    name: {
      en: 'Modern Sofa Set',
      ar: 'طقم أريكة عصري',
      fr: 'Ensemble de canapé moderne',
    },
    tagline: {
      en: 'Elevate your living space with sleek design',
      ar: 'ارفع مستوى مساحة معيشتك بتصميم أنيق',
      fr: 'Rehaussez votre espace de vie avec un design élégant',
    },
    price: 2499.99,
    description: {
      en: 'Contemporary 3-piece sofa set with premium leather upholstery.',
      ar: 'طقم أريكة عصري مكون من 3 قطع مع تنجيد جلدي فاخر.',
      fr: 'Ensemble de canapé 3 pièces contemporain avec revêtement en cuir de première qualité.',
    },
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    model3d: '/models/furniture/sofa_02_4k.gltf/sofa_02_4k.gltf',
    highlights: [
      { en: 'Genuine Italian leather', ar: 'جلد إيطالي أصلي', fr: 'Cuir italien véritable' },
      { en: 'Solid hardwood frame', ar: 'إطار من الخشب الصلب', fr: 'Cadre en bois massif' },
      { en: 'Comfortable deep seating', ar: 'مقاعد عميقة ومريحة', fr: 'Assise profonde et confortable' },
    ],
    rating: 4.7,
    reviewsCount: 320,
    shippingInfo: {
      en: 'Free 5–10 day delivery',
      ar: 'توصيل مجاني خلال 5-10 أيام',
      fr: 'Livraison gratuite en 5-10 jours',
    },
    warrantyYears: 5,
    specifications: {
      pieces: { en: '3', ar: '3', fr: '3' },
      material: { en: 'Leather', ar: 'جلد', fr: 'Cuir' },
      color: { en: 'Brown', ar: 'بني', fr: 'Marron' },
    },
    inStock: true,
  },
];

export const productsApi = {
  getAll: async (category?: string, locale?: string): Promise<Product[]> => {
    try {
      const params: Record<string, string> = {};
      if (category) params.category = category;
      // Use provided locale or get from localStorage
      params.locale = locale || getCurrentLocale();
      
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error: any) {
      console.warn('Failed to fetch products from API, using fallback data:', error.message);
      // Return filtered fallback data if category is specified
      if (category) {
        return fallbackProducts.filter((p) => p.category === category);
      }
      return fallbackProducts;
    }
  },

  getById: async (id: string, locale?: string): Promise<Product> => {
    try {
      const params: Record<string, string> = {};
      // Use provided locale or get from localStorage
      params.locale = locale || getCurrentLocale();

      const response = await api.get(`/products/${id}`, { params });
      return response.data;
    } catch (error: any) {
      console.warn('Failed to fetch product from API, using fallback data:', error.message);
      // Return fallback product or throw error
      const fallback = fallbackProducts.find((p) => p._id === id);
      if (fallback) {
        return fallback;
      }
      throw new Error(`Product with id ${id} not found`);
    }
  },

  create: async (productData: Partial<Product>): Promise<Product> => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  update: async (id: string, productData: Partial<Product>): Promise<Product> => {
    const response = await api.patch(`/products/${id}`, productData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface TrackingInfo {
  status: string;
  date: string;
  location: string;
  description: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  trackingHistory: TrackingInfo[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderDto {
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod?: string;
}

export const ordersApi = {
  getAll: async (status?: string, paymentStatus?: string): Promise<Order[]> => {
    const params: Record<string, string> = {};
    if (status) params.status = status;
    if (paymentStatus) params.paymentStatus = paymentStatus;
    const response = await api.get('/orders', { params });
    return response.data;
  },

  create: async (orderData: CreateOrderDto): Promise<Order> => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  trackOrder: async (orderNumber: string): Promise<Order> => {
    const response = await api.get(`/orders/track/${orderNumber}`);
    return response.data;
  },

  updateStatus: async (id: string, status: string, trackingInfo?: TrackingInfo): Promise<Order> => {
    const response = await api.patch(`/orders/${id}/status`, { status, trackingInfo });
    return response.data;
  },

  updatePaymentStatus: async (id: string, paymentStatus: string): Promise<Order> => {
    const response = await api.patch(`/orders/${id}/payment-status`, { paymentStatus });
    return response.data;
  },
};

// Auth API
export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export const authApi = {
  login: async (credentials: LoginDto): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getProfile: async (): Promise<any> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Stats API
export interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
  paidOrders: number;
  recentOrders: Order[];
  lowStockProducts: number;
}

export interface SalesDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export const statsApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/stats/dashboard');
    return response.data;
  },

  getSalesData: async (days: number = 30): Promise<SalesDataPoint[]> => {
    const response = await api.get('/stats/sales', { params: { days } });
    return response.data;
  },
};

// Users API
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'customer';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'customer';
  isActive?: boolean;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'customer';
  isActive?: boolean;
}

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (userData: CreateUserDto): Promise<User> => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  update: async (id: string, userData: UpdateUserDto): Promise<User> => {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

// AI Chat API
export interface AiChatEntry {
  _id: string;
  question: string;
  answer: LocalizedString;
  tags?: string[];
  categories?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAiChatDto {
  question: string;
  answer: LocalizedString;
  tags?: string[];
  categories?: string[];
  isActive?: boolean;
}

export interface UpdateAiChatDto {
  question?: string;
  answer?: LocalizedString;
  tags?: string[];
  categories?: string[];
  isActive?: boolean;
}

export const aiChatApi = {
  getAll: async (locale?: string): Promise<AiChatEntry[]> => {
    const params: Record<string, string> = {};
    if (locale) params.locale = locale;
    const response = await api.get('/ai-chat', { params });
    return response.data;
  },

  getById: async (id: string, locale?: string): Promise<AiChatEntry> => {
    const params: Record<string, string> = {};
    if (locale) params.locale = locale;
    const response = await api.get(`/ai-chat/${id}`, { params });
    return response.data;
  },

  create: async (data: CreateAiChatDto): Promise<AiChatEntry> => {
    const response = await api.post('/ai-chat', data);
    return response.data;
  },

  update: async (id: string, data: UpdateAiChatDto): Promise<AiChatEntry> => {
    const response = await api.patch(`/ai-chat/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/ai-chat/${id}`);
  },
};
