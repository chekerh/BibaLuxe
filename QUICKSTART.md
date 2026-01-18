# Quick Start Guide

Get your mattress and furniture store up and running in minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB running (local or Atlas)

## Step 1: Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/mattress-store
PORT=3001
FRONTEND_URL=http://localhost:3000
```

Start the backend:
```bash
npm run start:dev
```

The backend should now be running on `http://localhost:3001`

## Step 2: Seed the Database

In a new terminal, run:
```bash
cd backend
npm run seed
```

This adds 6 sample products to your database.

## Step 3: Frontend Setup

In a new terminal:
```bash
cd frontend
npm install
```

Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Start the frontend:
```bash
npm run dev
```

## Step 4: Open Your Browser

Visit `http://localhost:3000` to see your store!

## What You'll See

- **Homepage**: Interactive 3D models that fade as you scroll
- **Products Section**: Grid of products fetched from the backend
- **Product Details**: Click any product to see details with 3D viewer

## Next Steps

1. Add your own 3D models (`.glb` or `.gltf` files) to `frontend/public/models/`
2. Update products via the API or add new ones
3. Customize the styling in the components
4. Deploy to Vercel (frontend) and Render (backend)

## Troubleshooting

**Backend won't start:**
- Make sure MongoDB is running
- Check your `.env` file has the correct `MONGODB_URI`

**Frontend can't fetch products:**
- Ensure backend is running on port 3001
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

**3D models not showing:**
- The current implementation uses placeholder geometric shapes
- To use real 3D models, add `.glb` files to `frontend/public/models/` and update product `model3d` field

