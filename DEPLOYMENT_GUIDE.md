# Deployment Guide - Render & Vercel

This guide will walk you through deploying your mattress store application to Render (backend) and Vercel (frontend).

## Prerequisites

1. **GitHub Account** - Your code needs to be in a GitHub repository
2. **Render Account** - Sign up at [render.com](https://render.com) (free tier available)
3. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free tier available)
4. **MongoDB Atlas Account** - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) (free tier available)

---

## Step 1: Push Code to GitHub

If you haven't already, push your code to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Mattress store app"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## Step 2: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster (choose the free M0 tier)
4. Wait for the cluster to be created (takes a few minutes)
5. Click **"Connect"** on your cluster
6. Choose **"Connect your application"**
7. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
8. Replace `<password>` with your database user password
9. Add your database name at the end: `mongodb+srv://username:password@cluster.mongodb.net/mattress-store?retryWrites=true&w=majority`
10. **Important**: Go to **Network Access** and add `0.0.0.0/0` to allow connections from anywhere (or add Render's IP after deployment)

---

## Step 3: Deploy Backend to Render

### 3.1 Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if prompted
4. Select your repository
5. Configure the service:

   **Name**: `mattress-store-backend` (or any name you prefer)
   
   **Region**: Choose closest to you
   
   **Branch**: `main` (or your default branch)
   
   **Root Directory**: `backend` ⚠️ **IMPORTANT**: Set this to `backend`
   
   **Runtime**: `Node`
   
   **Build Command**: `npm install && npm run build`
   
   **Start Command**: `npm run start:prod`

### 3.2 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | |
| `MONGODB_URI` | Your MongoDB Atlas connection string | From Step 2 |
| `PORT` | `3001` | Render will override this, but include it |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` | **Add this AFTER deploying frontend** |

### 3.3 Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying
3. Wait for deployment to complete (5-10 minutes)
4. Once deployed, copy your backend URL (e.g., `https://mattress-store-backend.onrender.com`)

### 3.4 Test Backend

Visit your backend URL: `https://your-backend.onrender.com/products`

You should see an empty array `[]` (or products if you seeded the database).

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Create New Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:

   **Framework Preset**: Next.js (auto-detected)
   
   **Root Directory**: `frontend` ⚠️ **IMPORTANT**: Click "Edit" and set to `frontend`
   
   **Build Command**: `npm run build` (default)
   
   **Output Directory**: `.next` (default)
   
   **Install Command**: `npm install` (default)

### 4.2 Add Environment Variables

Before deploying, click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.onrender.com` (your Render backend URL from Step 3) |

### 4.3 Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your frontend
3. Wait for deployment to complete (2-5 minutes)
4. Once deployed, copy your frontend URL (e.g., `https://your-app.vercel.app`)

### 4.4 Update Backend CORS

Go back to Render and update the `FRONTEND_URL` environment variable:

1. Go to your Render service
2. Click **"Environment"** tab
3. Update `FRONTEND_URL` to your Vercel URL: `https://your-app.vercel.app`
4. Click **"Save Changes"**
5. Render will automatically redeploy

---

## Step 5: Seed the Database

After both are deployed, you can seed the database:

### Option 1: Using Render Shell (Recommended)

1. Go to your Render service
2. Click **"Shell"** tab
3. Run:
   ```bash
   cd backend
   npm run seed
   ```

### Option 2: Using Local Machine

1. Update your local `.env` with the Render backend URL
2. Run:
   ```bash
   cd backend
   npm run seed
   ```

### Option 3: Using API

You can also add products via API calls to your deployed backend.

---

## Step 6: Verify Deployment

1. **Frontend**: Visit your Vercel URL - you should see the homepage with 3D models
2. **Backend API**: Visit `https://your-backend.onrender.com/products` - should return products
3. **Integration**: Click on products in the frontend - they should load from the backend

---

## Troubleshooting

### Backend Issues

**Build fails:**
- Check that `Root Directory` is set to `backend`
- Verify all dependencies are in `package.json` (not just devDependencies)
- Check build logs in Render dashboard

**Database connection fails:**
- Verify MongoDB Atlas connection string is correct
- Check Network Access in MongoDB Atlas (should allow `0.0.0.0/0` or Render's IP)
- Ensure password in connection string doesn't have special characters (URL encode if needed)

**CORS errors:**
- Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
- Check backend logs for CORS errors

### Frontend Issues

**Can't fetch products:**
- Verify `NEXT_PUBLIC_API_URL` in Vercel matches your Render backend URL
- Check browser console for errors
- Ensure backend is running (check Render dashboard)

**Build fails:**
- Check that `Root Directory` is set to `frontend`
- Verify all dependencies are installed
- Check build logs in Vercel dashboard

**3D models not loading:**
- This is expected if you haven't added model files yet
- Models should be in `frontend/public/models/` directory
- Ensure model paths in database are correct

---

## Environment Variables Summary

### Render (Backend)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mattress-store?retryWrites=true&w=majority
PORT=3001
FRONTEND_URL=https://your-frontend.vercel.app
```

### Vercel (Frontend)
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

---

## Continuous Deployment

Both Render and Vercel automatically deploy when you push to your main branch:

1. Make changes locally
2. Commit and push to GitHub
3. Render and Vercel will automatically rebuild and redeploy

---

## Free Tier Limits

### Render
- 750 hours/month free (enough for 24/7 operation)
- Services spin down after 15 minutes of inactivity (freeze on first request)
- Automatic SSL certificates

### Vercel
- Unlimited deployments
- Automatic SSL certificates
- Global CDN
- No sleep/wake delays

### MongoDB Atlas
- 512MB storage (free tier)
- Shared cluster (may have performance limits)
- Perfect for development and small projects

---

## Next Steps

1. ✅ Both services deployed
2. ✅ Database seeded
3. ✅ Frontend connected to backend
4. 🎉 Your app is live!

You can now:
- Add real 3D model files
- Customize the design
- Add more products
- Set up custom domains (if needed)

---

## Support

If you encounter issues:
1. Check the deployment logs in Render/Vercel dashboards
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure MongoDB Atlas is accessible

Good luck with your deployment! 🚀

