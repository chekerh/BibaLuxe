# BibaLuxe - E-commerce Website

A modern, multilingual e-commerce platform for premium mattresses and furniture, built with Next.js (frontend) and NestJS (backend).

## Features

- **Multilingual Support**: English, Arabic (RTL), and French
- **3D Product Visualization**: Interactive 3D models for products
- **Complete Shopping Experience**: Product catalog, cart, checkout, and order tracking
- **Admin Dashboard**: Product, user, and analytics management
- **AI Chat Integration**: Customer support chat functionality
- **Responsive Design**: Mobile-first, modern UI with Tailwind CSS

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Three.js (3D models)
- Ant Design
- Framer Motion

### Backend
- NestJS
- MongoDB with Mongoose
- JWT Authentication
- TypeScript
- Class Validator

## Project Structure

```
stehabibawebapp/
├── frontend/          # Next.js frontend application
│   ├── app/          # Next.js app router pages
│   ├── components/   # React components
│   ├── contexts/     # React contexts
│   ├── lib/          # API client and utilities
│   └── messages/     # i18n translation files
├── backend/          # NestJS backend API
│   └── src/
│       ├── products/ # Products module
│       ├── orders/   # Orders module
│       ├── users/    # Users module
│       ├── auth/     # Authentication module
│       └── ai-chat/  # AI Chat module
└── .github/          # GitHub Actions workflows
```

## Getting Started

### Prerequisites

- Node.js 20+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stehabibawebapp
```

2. Set up the backend:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and other settings
npm run start:dev
```

3. Set up the frontend:
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

4. Seed the database (optional):
```bash
cd backend
npm run seed
```

### Environment Variables

See `backend/.env.example` and `frontend/.env.example` for required environment variables.

## Development

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:3001`
- **Admin Dashboard**: `http://localhost:3000/admin`

## Deployment

### Backend (Render)
The backend is configured for deployment on Render. See `backend/render.yaml` for configuration.

### Frontend (Vercel)
The frontend is configured for deployment on Vercel. See `frontend/vercel.json` for configuration.

## Documentation

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)

## License

ISC
