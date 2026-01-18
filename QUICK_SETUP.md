# Quick Setup Guide

## 🎯 TL;DR - What You Need

**Answer: Almost nothing! The website works without any setup.**

---

## ✅ Option 1: Run Frontend Only (Zero Setup)

**This works immediately:**
```bash
cd frontend
npm install
npm run dev
```

**Visit:** http://localhost:3000

✅ Website works with built-in sample products
✅ All features work (cart, checkout, languages)
✅ No MongoDB needed
✅ No backend needed

---

## 🔧 Option 2: Full Setup (If You Want Backend)

### Step 1: Get MongoDB (5 minutes)

**Free Option - MongoDB Atlas:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Create account
4. Create a cluster (free tier)
5. Click "Connect" → "Connect your application"
6. Copy the connection string

**Or use local MongoDB:**
- Install MongoDB locally
- Use: `mongodb://localhost:27017/mattress-store`

### Step 2: Create Backend .env File

Create file: `backend/.env`

```env
MONGODB_URI=your-connection-string-here
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**Replace `your-connection-string-here` with your MongoDB connection string**

### Step 3: Start Backend

```bash
cd backend
npm install
npm run start:dev
```

**You should see:**
```
Backend server running on port 3001
CORS enabled for: http://localhost:3000
```

### Step 4: Add Sample Products

```bash
cd backend
npm run seed
```

### Step 5: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📋 What Each File Does

### `backend/.env` (Required ONLY if using backend)
- `MONGODB_URI` - Your database connection
- `PORT` - Backend port (default: 3001)
- `FRONTEND_URL` - For CORS (default: http://localhost:3000)

### `frontend/.env.local` (Optional)
- `NEXT_PUBLIC_API_URL` - Backend URL (default: http://localhost:3001)
- Only needed if backend is on different URL

---

## 🚨 Troubleshooting

### "Cannot connect to MongoDB"
- **If using Atlas:** Check Network Access allows `0.0.0.0/0`
- **If local:** Make sure MongoDB service is running
- **Solution:** Frontend still works without backend!

### "Backend won't start"
- Check `backend/.env` file exists
- Verify `MONGODB_URI` is correct
- **Solution:** Just use frontend only - it works!

### "No products showing"
- If using backend: Run `npm run seed` in backend folder
- If not: Products should show automatically (fallback data)

---

## ✅ Minimum Setup (Recommended)

**Just run the frontend:**
```bash
cd frontend
npm install
npm run dev
```

**That's it!** Everything works.

---

## 📝 Summary

| Component | Required? | Setup Time |
|-----------|-----------|------------|
| Frontend | ✅ Yes | 0 minutes (just `npm install`) |
| Backend | ❌ No | 5 minutes (optional) |
| MongoDB | ❌ No | 5 minutes (optional) |
| Environment Files | ❌ No | 0 minutes (has defaults) |

**Total setup time: 0 minutes (frontend only) or 10 minutes (full setup)**

---

## 🎯 My Recommendation

**For testing/demo:** Just run frontend - no setup needed!

**For production:** Set up MongoDB Atlas (free) and backend for real data.

