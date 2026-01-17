# Frontend Documentation

Next.js 16 frontend application for BibaLuxe e-commerce platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001` |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── app/                  # Next.js app router
│   ├── admin/           # Admin dashboard pages
│   ├── checkout/        # Checkout page
│   ├── order-tracking/  # Order tracking page
│   └── products/        # Product pages
├── components/          # React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── ...
├── contexts/            # React contexts
│   ├── CartContext.tsx
│   ├── I18nContext.tsx
│   └── WishlistContext.tsx
├── lib/                 # Utilities
│   ├── api.ts          # API client
│   └── analytics.ts    # Analytics
└── messages/           # i18n translations
    ├── en.json
    ├── ar.json
    └── fr.json
```

## Features

### Internationalization
The app supports three languages:
- English (en) - LTR
- Arabic (ar) - RTL
- French (fr) - LTR

Language switching is handled through `I18nContext` and stored in localStorage.

### Shopping Features
- Product browsing with filters
- Shopping cart with persistence
- Wishlist functionality
- Checkout flow with order creation
- Order tracking

### 3D Product Models
Products can have 3D models (GLB/GLTF format) displayed using Three.js and React Three Fiber.

### Admin Dashboard
Access at `/admin` (requires authentication):
- Product management
- User management
- AI Chat management
- Analytics dashboard

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variable `NEXT_PUBLIC_API_URL` to your backend URL
3. Deploy

The `vercel.json` file is configured for automatic deployments.

### Build Output
The production build creates a `.next` directory with optimized static assets.
