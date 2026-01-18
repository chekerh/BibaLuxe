# Deployment Checklist

Use this checklist to ensure everything is set up correctly before and after deployment.

## Pre-Deployment

### Code Preparation
- [ ] Code is pushed to GitHub repository
- [ ] All files are committed
- [ ] No sensitive data in code (use environment variables)
- [ ] `.gitignore` is properly configured

### MongoDB Atlas Setup
- [ ] MongoDB Atlas account created
- [ ] Cluster created and running
- [ ] Database user created
- [ ] Connection string copied
- [ ] Network Access configured (allow `0.0.0.0/0` or specific IPs)
- [ ] Database name decided (e.g., `mattress-store`)

---

## Backend Deployment (Render)

### Render Configuration
- [ ] Render account created
- [ ] GitHub repository connected
- [ ] New Web Service created
- [ ] **Root Directory set to `backend`** ⚠️
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm run start:prod`
- [ ] Runtime: Node

### Environment Variables (Render)
- [ ] `NODE_ENV` = `production`
- [ ] `MONGODB_URI` = Your MongoDB Atlas connection string
- [ ] `PORT` = `3001` (optional, Render sets this automatically)
- [ ] `FRONTEND_URL` = (Leave empty for now, add after frontend deploys)

### Deployment
- [ ] Service deployed successfully
- [ ] Build logs show no errors
- [ ] Service is "Live" (green status)
- [ ] Backend URL copied (e.g., `https://your-backend.onrender.com`)

### Testing Backend
- [ ] Visit `https://your-backend.onrender.com/products` - returns `[]` or products
- [ ] Check Render logs - no errors
- [ ] Backend responds to API calls

---

## Frontend Deployment (Vercel)

### Vercel Configuration
- [ ] Vercel account created
- [ ] GitHub repository imported
- [ ] **Root Directory set to `frontend`** ⚠️
- [ ] Framework: Next.js (auto-detected)
- [ ] Build settings verified

### Environment Variables (Vercel)
- [ ] `NEXT_PUBLIC_API_URL` = Your Render backend URL (e.g., `https://your-backend.onrender.com`)

### Deployment
- [ ] Frontend deployed successfully
- [ ] Build logs show no errors
- [ ] Deployment is "Ready" (green status)
- [ ] Frontend URL copied (e.g., `https://your-app.vercel.app`)

### Testing Frontend
- [ ] Visit frontend URL - homepage loads
- [ ] 3D models display (or placeholders)
- [ ] No console errors in browser
- [ ] Products section loads (may be empty)

---

## Post-Deployment

### Update Backend CORS
- [ ] Go back to Render dashboard
- [ ] Update `FRONTEND_URL` environment variable with Vercel URL
- [ ] Save changes (triggers redeploy)
- [ ] Wait for redeploy to complete

### Seed Database
- [ ] Option 1: Use Render Shell to run `npm run seed`
- [ ] Option 2: Add products via API
- [ ] Option 3: Use local machine with Render backend URL
- [ ] Verify products appear in frontend

### Final Verification
- [ ] Frontend loads without errors
- [ ] Products display in catalog
- [ ] Product detail pages work
- [ ] API calls succeed (check browser Network tab)
- [ ] No CORS errors in browser console
- [ ] Backend logs show successful requests

---

## Common Issues & Solutions

### Issue: Backend build fails
**Solution:**
- Check Root Directory is `backend`
- Verify all dependencies in package.json
- Check build logs for specific errors

### Issue: Frontend can't connect to backend
**Solution:**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is running (Render dashboard)
- Verify CORS is configured correctly
- Check browser console for errors

### Issue: Database connection fails
**Solution:**
- Verify MongoDB connection string is correct
- Check Network Access in MongoDB Atlas
- Ensure password is URL-encoded if it has special characters
- Check backend logs for connection errors

### Issue: CORS errors
**Solution:**
- Verify `FRONTEND_URL` in Render matches Vercel URL exactly
- Check backend logs for CORS configuration
- Ensure no trailing slashes in URLs

---

## URLs to Save

After deployment, save these URLs:

- **Frontend (Vercel)**: `https://________________.vercel.app`
- **Backend (Render)**: `https://________________.onrender.com`
- **MongoDB Atlas**: `mongodb+srv://...`

---

## Next Steps After Deployment

- [ ] Add real 3D model files
- [ ] Customize styling
- [ ] Add more products
- [ ] Set up custom domain (optional)
- [ ] Configure analytics (optional)
- [ ] Set up monitoring (optional)

---

## Quick Reference

### Render Environment Variables
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
PORT=3001
FRONTEND_URL=https://your-app.vercel.app
```

### Vercel Environment Variables
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

---

✅ **All checked? Your app should be live and working!** 🎉

