# Backend Setup Guide

## Quick Start

To fix the "Network Error", you need to start the backend server:

### 1. Start the Backend Server

```bash
cd backend
npm install  # If you haven't already
npm run start:dev
```

The backend should start on `http://localhost:3001`

### 2. Verify Backend is Running

You should see:
```
Backend server running on port 3001
CORS enabled for: http://localhost:3000
```

### 3. Check MongoDB Connection

Make sure MongoDB is running:
- **Local MongoDB**: `mongodb://localhost:27017/mattress-store`
- **MongoDB Atlas**: Set `MONGODB_URI` environment variable

### 4. Seed the Database (Optional)

```bash
cd backend
npm run seed
```

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
MONGODB_URI=mongodb://localhost:27017/mattress-store
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## Troubleshooting

### Network Error
- ✅ Check if backend is running on port 3001
- ✅ Check if MongoDB is running
- ✅ Verify CORS is enabled (should allow localhost:3000)
- ✅ Check browser console for specific error messages

### Fallback Mode
The frontend now has fallback data, so it will work even if the backend is down, but you'll see sample products instead of real data.

## Production Setup

For production (Render/Vercel):
- Set `NEXT_PUBLIC_API_URL` in Vercel to your Render backend URL
- Set `FRONTEND_URL` in Render to your Vercel frontend URL
- Set `MONGODB_URI` in Render to your MongoDB Atlas connection string

