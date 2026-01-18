# Setup Requirements for BibaLuxe Website

## ✅ No API Keys Required

The website does **NOT** require any API keys. Everything works out of the box!

## 🔧 What You Need to Set Up (Optional)

### 1. Backend Server (Optional)
The frontend has **fallback data** built-in, so it works even without the backend.

**To use the backend:**
```bash
cd backend
npm install
npm run start:dev
```

**Environment Variables (backend/.env):**
```env
MONGODB_URI=mongodb://localhost:27017/mattress-store
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 2. MongoDB (Optional)
Only needed if you want to use the backend API. The frontend works with fallback data.

**Options:**
- Local MongoDB: Install and run locally
- MongoDB Atlas: Free cloud database (get connection string)

### 3. Frontend Environment (Optional)
The frontend defaults to `http://localhost:3001` for the API.

**To customize (frontend/.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🚀 Quick Start (No Setup Required)

Just run:
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` - it will work with fallback data!

## ✅ What's Already Working

- ✅ Full website with all features
- ✅ 3 languages (English, French, Arabic)
- ✅ Language switcher with auto-detection
- ✅ All components translated
- ✅ Security measures implemented
- ✅ Conversion optimization features
- ✅ Fallback product data (works without backend)
- ✅ RTL support for Arabic

## 🔍 Troubleshooting

**If the website looks broken:**
1. Clear browser cache
2. Check browser console for errors
3. Make sure all dependencies are installed: `npm install` in frontend folder
4. Try rebuilding: `npm run build`

**If you see network errors:**
- This is normal if backend isn't running
- The website will use fallback data automatically
- No action needed!

## 📝 Summary

**You don't need to set up anything manually!** The website is fully functional with:
- Built-in fallback data
- All translations included
- All features working
- No API keys required
- No external services needed

Just install dependencies and run!

