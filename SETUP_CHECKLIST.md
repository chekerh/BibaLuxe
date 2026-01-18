# Setup Checklist - What You Actually Need

## ✅ ZERO SETUP REQUIRED (Frontend Works Standalone)

The frontend works **immediately** with no configuration:
```bash
cd frontend
npm install
npm run dev
```
**That's it!** Visit http://localhost:3000

---

## 🔧 OPTIONAL: Backend Setup (Only if you want real database)

### What You Need:

#### 1. MongoDB Database (Free Options)

**Option A: MongoDB Atlas (Recommended - Free)**
- Go to: https://www.mongodb.com/cloud/atlas
- Sign up (free)
- Create cluster (free tier)
- Get connection string
- **Time: 5 minutes**

**Option B: Local MongoDB**
- Install MongoDB locally
- Start service
- **Time: 10-15 minutes**

#### 2. Create Backend Environment File

Create file: `backend/.env`
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**Replace with your actual MongoDB connection string**

#### 3. Start Backend

```bash
cd backend
npm install
npm run start:dev
```

#### 4. Add Sample Products (Optional)

```bash
cd backend
npm run seed
```

---

## 📝 Environment Variables Summary

### Frontend (Optional - Has Defaults)
- `NEXT_PUBLIC_API_URL` - Defaults to `http://localhost:3001`
- **File:** `frontend/.env.local` (create if needed)

### Backend (Required ONLY if using backend)
- `MONGODB_URI` - Your MongoDB connection string
- `PORT` - Defaults to 3001
- `FRONTEND_URL` - Defaults to http://localhost:3000
- **File:** `backend/.env` (create this file)

---

## 🎯 Quick Decision Guide

**Q: Do I need MongoDB?**
- **A:** NO - Frontend works without it (uses fallback data)

**Q: Do I need backend?**
- **A:** NO - Frontend works standalone

**Q: When do I need MongoDB?**
- **A:** Only if you want to:
  - Store real product data in database
  - Add/edit products via API
  - Use backend features

**Q: What's the minimum to run the website?**
- **A:** Just `cd frontend && npm install && npm run dev`

---

## ✅ Verification Steps

### Test Frontend (No Setup):
1. `cd frontend && npm install && npm run dev`
2. Open http://localhost:3000
3. Should see products (fallback data)
4. Language switcher should work
5. ✅ Success!

### Test Backend (If Setup):
1. Create `backend/.env` with MongoDB URI
2. `cd backend && npm install && npm run start:dev`
3. Should see: "Backend server running on port 3001"
4. Run `npm run seed` to add products
5. Frontend should now show real products
6. ✅ Success!

---

## 🚨 Common Setup Mistakes

1. **Wrong MongoDB URI format**
   - ✅ Correct: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`
   - ❌ Wrong: Missing password, wrong format

2. **.env file in wrong location**
   - ✅ Backend: `backend/.env`
   - ✅ Frontend: `frontend/.env.local`

3. **MongoDB Network Access**
   - If using Atlas: Must allow `0.0.0.0/0` in Network Access

4. **Port conflicts**
   - Backend uses 3001
   - Frontend uses 3000
   - Make sure nothing else is using these ports

---

## 📋 Complete Setup (If You Want Everything)

1. ✅ Create MongoDB Atlas account (free)
2. ✅ Get connection string
3. ✅ Create `backend/.env` file
4. ✅ Add MongoDB URI to `.env`
5. ✅ `cd backend && npm install`
6. ✅ `npm run start:dev`
7. ✅ `npm run seed` (add sample products)
8. ✅ `cd frontend && npm install`
9. ✅ `npm run dev`
10. ✅ Visit http://localhost:3000

**Total time: ~10-15 minutes**

---

## 🎉 Bottom Line

**You can run the website RIGHT NOW with zero setup:**
```bash
cd frontend
npm install
npm run dev
```

**MongoDB is ONLY needed if you want backend features!**

