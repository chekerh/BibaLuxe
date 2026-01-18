# Quick Deployment Reference

## 🚀 Quick Steps

### 1. MongoDB Atlas
- Create cluster → Get connection string
- Network Access: Allow `0.0.0.0/0` (or Render IPs for production)
- Create admin user manually (see below)

### 2. Cloudinary
- Create account at cloudinary.com
- Get Cloud Name, API Key, and API Secret from Dashboard

### 3. Render (Backend)
- New Web Service → Connect GitHub repo
- **Root Directory**: `backend` ⚠️
- **Build**: `npm install && npm run build`
- **Start**: `npm run start:prod`
- **Environment Variables** (see below)
- Copy backend URL

### 4. Vercel (Frontend)
- New Project → Import GitHub repo
- **Root Directory**: `frontend` ⚠️
- **Env Var**: `NEXT_PUBLIC_API_URL` = your Render backend URL
- Copy frontend URL

### 5. Update Backend CORS
- Go back to Render
- Update `FRONTEND_URL` = your Vercel URL
- Save (auto-redeploys)

---

## 📋 Environment Variables

### Render (Backend) - REQUIRED

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/bibaluxe?retryWrites=true&w=majority` |
| `JWT_SECRET` | JWT signing secret (32+ chars, random) | `your-very-long-random-secret-string-here-32chars` |
| `FRONTEND_URL` | Your Vercel frontend URL | `https://bibaluxe.vercel.app` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-api-secret` |

**Generate secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Vercel (Frontend) - REQUIRED

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Your Render backend URL | `https://bibaluxe-backend.onrender.com` |

---

## 👤 Create Admin User in MongoDB Atlas

Since admin registration is disabled, create the admin user directly in MongoDB Atlas:

1. Go to MongoDB Atlas → Browse Collections → `users` collection
2. Click "Insert Document"
3. Insert this document (replace values):

```json
{
  "username": "admin",
  "email": "admin@yourdomain.com",
  "passwordHash": "$2b$10$YOUR_BCRYPT_HASH_HERE",
  "role": "admin",
  "isActive": true,
  "createdAt": { "$date": "2026-01-18T00:00:00.000Z" },
  "updatedAt": { "$date": "2026-01-18T00:00:00.000Z" }
}
```

**Generate bcrypt hash for your password:**
```bash
# Using Node.js (run in backend folder after npm install)
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('YOUR_PASSWORD', 10).then(console.log)"
```

Or use an online bcrypt generator with cost factor 10.

---

## ⚠️ Critical Settings

- **Render Root Directory**: Must be `backend`
- **Vercel Root Directory**: Must be `frontend`
- **MongoDB Network Access**: Must allow Render IPs (or 0.0.0.0/0 for testing)
- **JWT_SECRET**: Must be 32+ characters, NOT the default value
- **CORS**: Update `FRONTEND_URL` after frontend deploys

---

## ✅ Deployment Checklist

### Before Deployment
- [ ] MongoDB Atlas cluster created
- [ ] Cloudinary account created
- [ ] Generated secure JWT_SECRET (32+ chars)
- [ ] Admin user created in MongoDB Atlas

### Render Setup
- [ ] Root directory set to `backend`
- [ ] `NODE_ENV` = `production`
- [ ] `MONGODB_URI` set (with correct password)
- [ ] `JWT_SECRET` set (32+ chars, random)
- [ ] `FRONTEND_URL` set (update after Vercel deploys)
- [ ] `CLOUDINARY_CLOUD_NAME` set
- [ ] `CLOUDINARY_API_KEY` set
- [ ] `CLOUDINARY_API_SECRET` set

### Vercel Setup
- [ ] Root directory set to `frontend`
- [ ] `NEXT_PUBLIC_API_URL` set to Render backend URL

### Post-Deployment
- [ ] Backend health check: `https://your-backend.onrender.com/health`
- [ ] Admin login works: `https://your-frontend.vercel.app/admin/login`
- [ ] Product listing works
- [ ] Image upload works (admin panel)
- [ ] Checkout flow works (COD)

---

## 🔗 Full Guide

See `DEPLOYMENT_GUIDE.md` for detailed instructions.
