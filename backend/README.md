# Backend API Documentation

NestJS backend API for BibaLuxe e-commerce platform.

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
MONGODB_URI=mongodb://localhost:27017/mattress-store
JWT_SECRET=your-secret-key-here
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

4. Start development server:
```bash
npm run start:dev
```

5. Seed database (optional):
```bash
npm run seed
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/mattress-store` |
| `JWT_SECRET` | Secret key for JWT tokens | `supersecretjwtkey` |
| `PORT` | Server port | `3001` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `NODE_ENV` | Environment (development/production) | `development` |

## API Endpoints

### Products
- `GET /products` - Get all products (supports `?category=mattress|furniture` and `?locale=en|ar|fr`)
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (admin only)
- `PATCH /products/:id` - Update product (admin only)
- `DELETE /products/:id` - Delete product (admin only)

### Orders
- `POST /orders` - Create a new order
- `GET /orders/:id` - Get order by ID
- `GET /orders/track/:orderNumber` - Track order by order number

### Authentication
- `POST /auth/login` - Admin login
- `POST /auth/register` - Admin registration (if enabled)

### Users (Admin)
- `GET /users` - Get all users
- `POST /users` - Create user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### AI Chat
- `GET /ai-chat` - Get all chat entries
- `POST /ai-chat` - Create chat entry
- `PATCH /ai-chat/:id` - Update chat entry
- `DELETE /ai-chat/:id` - Delete chat entry

## Scripts

- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run start:dev` - Start development server with watch mode
- `npm run start:prod` - Start production server (built)
- `npm run seed` - Seed database with sample products

## Security Features

- Helmet.js for HTTP security headers
- CORS configuration
- Rate limiting (100 requests/minute)
- Input validation with class-validator
- JWT authentication for admin routes
- Password hashing with bcrypt

## Database Schema

The application uses MongoDB with Mongoose. Main schemas:
- **Product**: Product information with multilingual fields
- **Order**: Order details, shipping, and tracking
- **User**: User accounts for admin access
- **AiChat**: AI chat training data
