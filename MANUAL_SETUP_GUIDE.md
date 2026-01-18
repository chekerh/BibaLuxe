# Manual Setup Guide for BibaLuxe

## 🎯 IMPORTANT: What's Required vs Optional

### ✅ REQUIRED (Nothing!)
The frontend works **completely standalone** with built-in fallback data. No setup needed!

### 🔧 OPTIONAL (Only if you want backend features)

If you want to use the backend API (instead of fallback data), you need:

## Option 1: Frontend Only (No Setup Required) ⭐ RECOMMENDED

**Just run:**
```bash
cd frontend
npm install
npm run dev
```

**That's it!** The website works with built-in sample products.

---

## Option 2: Full Setup (Backend + Database)

### Step 1: MongoDB Setup

**Option A: MongoDB Atlas (Free Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`)

**Option B: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/mattress-store`

### Step 2: Backend Environment Variables

Create `backend/.env` file:
```env
MONGODB_URI=mongodb+srv://your-connection-string-here
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**Replace `your-connection-string-here` with your actual MongoDB connection string.**

### Step 3: Frontend Environment Variables (Optional)

Create `frontend/.env.local` file (only if backend is on different URL):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Note:** This is optional - frontend defaults to `http://localhost:3001` automatically.

### Step 4: Start Backend

```bash
cd backend
npm install
npm run start:dev
```

You should see:
```
Backend server running on port 3001
CORS enabled for: http://localhost:3000
```

### Step 5: Seed Database (Add Sample Products)

In a new terminal:
```bash
cd backend
npm run seed
```

This adds 6 sample products to your database.

### Step 6: Start Frontend

In another terminal:
```bash
cd frontend
npm install
npm run dev
```

---

## 🔍 What Each Component Does

### Frontend (Required)
- ✅ Works standalone with fallback data
- ✅ All features work (cart, wishlist, checkout)
- ✅ All languages work
- ✅ No setup needed

### Backend (Optional)
- Provides real product data from database
- Allows adding/editing products via API
- Only needed if you want dynamic product management

### MongoDB (Optional)
- Stores product data
- Only needed if using backend
- Free tier available on MongoDB Atlas

---

## 🚨 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:** 
- If using Atlas: Check Network Access allows `0.0.0.0/0`
- If local: Make sure MongoDB service is running
- Verify connection string is correct in `.env`

### Issue: "Backend won't start"
**Solution:**
- Check `.env` file exists in `backend/` folder
- Verify `MONGODB_URI` is correct
- Make sure port 3001 is not in use

### Issue: "Frontend shows network errors"
**Solution:**
- This is NORMAL if backend isn't running
- Frontend automatically uses fallback data
- No action needed - website still works!

### Issue: "No products showing"
**Solution:**
- If using backend: Run `npm run seed` in backend folder
- If not using backend: Products should show automatically (fallback data)

---

## 📋 Quick Checklist

**Minimum Setup (Frontend Only):**
- [ ] `cd frontend && npm install`
- [ ] `npm run dev`
- [ ] Done! ✅

**Full Setup (With Backend):**
- [ ] Create MongoDB Atlas account (or install local MongoDB)
- [ ] Create `backend/.env` with `MONGODB_URI`
- [ ] `cd backend && npm install && npm run start:dev`
- [ ] `cd backend && npm run seed` (add sample products)
- [ ] `cd frontend && npm install && npm run dev`
- [ ] Done! ✅

---

## 🎯 Recommendation

**For testing/demo:** Use Option 1 (Frontend Only) - no setup needed!

**For production:** Use Option 2 (Full Setup) - gives you real database and API.

---

## 💡 Summary

- **MongoDB:** Optional (only if using backend)
- **Backend:** Optional (frontend has fallback data)
- **Environment Variables:** Optional (defaults work)
- **API Keys:** Not needed
- **External Services:** Not needed

**The website works immediately with zero setup!**

