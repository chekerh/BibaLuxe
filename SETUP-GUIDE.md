# Complete Setup Guide - Step by Step

This guide will walk you through setting up the BibaLuxe project from scratch. Follow these steps in order.

## Prerequisites Check

Before starting, make sure you have:
- Node.js 20+ installed (`node --version`)
- npm installed (`npm --version`)
- Git installed
- A code editor (VS Code recommended)

## Step 1: Install Backend Dependencies

1. **Open your terminal** and navigate to the backend folder:
   ```bash
   cd /Users/mac/stehabiba/stehabibawebapp/backend
   ```

2. **Install all dependencies** (this will install the packages including the new monitoring ones):
   ```bash
   npm install
   ```
   
   This will:
   - Install all packages listed in `package.json`
   - Include the new packages: `@nestjs/terminus` and `prom-client`
   - Create a `node_modules` folder

3. **Wait for installation to complete** (may take 1-2 minutes)

4. **Verify installation** by checking if the new packages are installed:
   ```bash
   npm list @nestjs/terminus prom-client
   ```
   
   You should see both packages listed.

## Step 2: Test the Backend Builds Successfully

1. **Make sure you're still in the backend folder**:
   ```bash
   pwd
   ```
   Should show: `/Users/mac/stehabiba/stehabibawebapp/backend`

2. **Build the backend** to make sure everything compiles:
   ```bash
   npm run build
   ```
   
   This should:
   - Compile TypeScript to JavaScript
   - Create a `dist` folder with the compiled code
   - Show "Build successful" or similar

3. **Check for errors** - if you see any TypeScript errors, let me know and we'll fix them.

## Step 3: Install Frontend Dependencies

1. **Navigate to the frontend folder**:
   ```bash
   cd ../frontend
   ```
   (The `..` means "go up one folder", then `frontend` goes into the frontend folder)

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Wait for installation to complete**

4. **Test the frontend builds**:
   ```bash
   npm run build
   ```
   
   This may take a minute or two. You should see "Compiled successfully" at the end.

## Step 4: Set Up Environment Variables

### For Backend (Local Development)

1. **Navigate back to backend folder**:
   ```bash
   cd ../backend
   ```

2. **Create a `.env` file** (if it doesn't exist):
   ```bash
   touch .env
   ```

3. **Open the `.env` file** in your editor and add:
   ```env
   MONGODB_URI=mongodb://localhost:27017/bibaluxe
   JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-random
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Save the file**

### For Frontend (Local Development)

1. **Navigate to frontend folder**:
   ```bash
   cd ../frontend
   ```

2. **Create a `.env.local` file**:
   ```bash
   touch .env.local
   ```

3. **Open `.env.local`** and add:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Save the file**

## Step 5: Test Locally (Optional but Recommended)

### Option A: Test with Docker Compose (Easiest - includes MongoDB, monitoring)

1. **Go to the root folder**:
   ```bash
   cd ..
   ```
   (This takes you to `/Users/mac/stehabiba/stehabibawebapp`)

2. **Make sure Docker is running**:
   - Open Docker Desktop (if installed)
   - Or make sure Docker daemon is running

3. **Create environment file for Docker Compose**:
   ```bash
   cp .env.docker.example .env.docker 2>/dev/null || echo "Creating .env.docker manually..."
   ```

4. **Edit `.env.docker`** (create it if it doesn't exist):
   ```bash
   nano .env.docker
   # Or open it in your editor
   ```
   
   Add these values:
   ```env
   MONGO_ROOT_USERNAME=admin
   MONGO_ROOT_PASSWORD=changeme123
   MONGO_DATABASE=bibaluxe
   JWT_SECRET=your-jwt-secret-here
   FRONTEND_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:3001
   GRAFANA_USER=admin
   GRAFANA_PASSWORD=admin123
   ```

5. **Start all services**:
   ```bash
   docker-compose up -d
   ```
   
   This will:
   - Download MongoDB, Prometheus, Grafana images (first time only)
   - Build your backend and frontend Docker images
   - Start all services
   - The `-d` flag runs them in the background

6. **Check if everything is running**:
   ```bash
   docker-compose ps
   ```
   
   All services should show "Up" status.

7. **Seed the database** (add sample products):
   ```bash
   docker-compose exec backend npm run seed
   ```

8. **Access your services**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Grafana: http://localhost:3001 (port mapping)
   - Prometheus: http://localhost:9090

### Option B: Test without Docker (Manual Setup)

1. **Start MongoDB locally** (if you have it installed):
   ```bash
   mongod
   ```
   Or use MongoDB Atlas (cloud database) - update `MONGODB_URI` in backend `.env`

2. **Start the backend** (in backend folder):
   ```bash
   cd backend
   npm run start:dev
   ```
   
   You should see: "Backend server running on port 3001"

3. **In a new terminal**, start the frontend (in frontend folder):
   ```bash
   cd frontend
   npm run dev
   ```
   
   You should see: "Ready on http://localhost:3000"

4. **Open your browser** and go to http://localhost:3000

## Step 6: Deploy to Production (Render + Vercel)

### Backend Deployment on Render

1. **Go to Render.com** and sign in

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository**:
   - Click "Connect GitHub"
   - Authorize Render to access your repositories
   - Select `chekerh/BibaLuxe`

4. **Configure the service**:
   - **Name**: `bibaluxe-backend` (or your choice)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or `bibaluxe` if that's your main branch)
   - **Root Directory**: `backend` ← **IMPORTANT!**
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`

5. **Add Environment Variables** (click "Environment" tab):
   
   Click "Add Environment Variable" for each:
   
   - **Name**: `MONGODB_URI`
     **Value**: Your MongoDB Atlas connection string
     ```
     mongodb+srv://bibaluxe:YOUR_PASSWORD@cluster0.q5mskm3.mongodb.net/bibaluxe?retryWrites=true&w=majority
     ```
     (Replace `YOUR_PASSWORD` with your actual password)
   
   - **Name**: `JWT_SECRET`
     **Value**: `xK9mP2nQ5rT8vW1yZ4aB7cD0eF3gH6iJ9kL2mN5oP8qR1sT4uV7wX0yZ3aB6cD9eF`
     (Change a few characters if you want)
   
   - **Name**: `FRONTEND_URL`
     **Value**: For now, use `http://localhost:3000` (update after frontend is deployed)
   
   - **Name**: `NODE_ENV`
     **Value**: `production`

6. **Click "Create Web Service"**

7. **Wait for deployment** (takes 3-5 minutes)
   - Render will install dependencies
   - Build your backend
   - Start the service
   - You'll see logs in the Render dashboard

8. **Copy your backend URL** (looks like: `https://bibaluxe-backend.onrender.com`)

### Frontend Deployment on Vercel

1. **Go to vercel.com** and sign in

2. **Click "Add New" → "Project"**

3. **Import your GitHub repository**:
   - Find `chekerh/BibaLuxe`
   - Click "Import"

4. **Configure the project**:
   - **Project Name**: `bibaluxe-frontend` (or your choice)
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: Click "Edit" and set to `frontend` ← **IMPORTANT!**
   - **Build Command**: Leave default (`npm run build`)
   - **Output Directory**: Leave default (`.next`)
   - **Install Command**: Leave default (`npm install`)

5. **Add Environment Variable**:
   - Click "Environment Variables"
   - Click "Add"
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: Your Render backend URL (from step above)
     Example: `https://bibaluxe-backend.onrender.com`
   - Click "Save"

6. **Click "Deploy"**

7. **Wait for deployment** (takes 2-3 minutes)
   - Vercel will build your frontend
   - You'll see build progress
   - When done, you'll get a URL like: `https://bibaluxe-frontend.vercel.app`

8. **Update Backend Environment Variable**:
   - Go back to Render dashboard
   - Edit your backend service
   - Update `FRONTEND_URL` to your Vercel URL
   - Save and redeploy

### Seed the Production Database

1. **Option 1: Using local MongoDB connection** (if you have MongoDB CLI):
   ```bash
   cd backend
   # Update .env with your production MongoDB URI
   MONGODB_URI="your-production-mongodb-uri" npm run seed
   ```

2. **Option 2: Using MongoDB Compass** (GUI tool):
   - Download MongoDB Compass
   - Connect to your MongoDB Atlas cluster
   - Go to your `bibaluxe` database
   - The seed script will create products automatically

3. **Option 3: Create a temporary endpoint** (for one-time seeding):
   - We can create a `/seed` endpoint that runs once
   - Call it via your browser or Postman
   - Then remove/secure it

## Step 7: Verify Everything Works

1. **Test the frontend**: Visit your Vercel URL
   - You should see the homepage
   - Products should load (if database is seeded)

2. **Test the backend**: Visit `https://your-backend.onrender.com/products`
   - Should return JSON with products (or empty array if not seeded)

3. **Test health endpoint**: Visit `https://your-backend.onrender.com/health`
   - Should return JSON with health status

## Common Issues & Solutions

### "Cannot find module @nestjs/terminus"
**Solution**: Run `npm install` in the backend folder again

### "Build failed on Render"
**Solution**: 
- Check Render logs for specific errors
- Make sure Root Directory is set to `backend`
- Verify all environment variables are set

### "Frontend can't connect to backend"
**Solution**:
- Check `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Make sure backend URL is correct (no trailing slash)
- Check CORS settings in backend (should allow your Vercel domain)

### "MongoDB connection failed"
**Solution**:
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0` (all IPs) for Render
- Check connection string is correct
- Make sure database user has correct permissions

## What Each Command Does

- `npm install` - Downloads and installs all packages your project needs
- `npm run build` - Compiles TypeScript/Next.js code into production-ready JavaScript
- `npm run start:dev` - Starts development server with auto-reload on file changes
- `npm run start:prod` - Starts production server (optimized, no auto-reload)
- `docker-compose up -d` - Starts all services defined in docker-compose.yml
- `docker-compose ps` - Shows status of all running containers

## Quick Reference

**To start local development:**
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

**To test with Docker:**
```bash
docker-compose up -d
```

**To check what's running:**
```bash
docker-compose ps
```

**To stop Docker services:**
```bash
docker-compose down
```

## Need Help?

If you get stuck at any step:
1. Check the error message carefully
2. Look at the logs (Render/Vercel logs, or terminal output)
3. Verify you're in the correct folder
4. Make sure you've completed the previous steps

Let me know which step you're on and what error (if any) you're seeing!
