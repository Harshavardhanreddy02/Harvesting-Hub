# Deployment Guide

## Frontend Deployment (Vercel)

### 1. Environment Variables Setup
In your Vercel dashboard, add these environment variables:

```
VITE_BACKEND_URL=https://your-backend-domain.com
VITE_FIREBASE_API_KEY=AIzaSyDmGefl-5byyTnoobjVGyMoYMx4B4B3qDM
VITE_FIREBASE_AUTH_DOMAIN=harvest-hub-4978a.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=harvest-hub-4978a
VITE_FIREBASE_STORAGE_BUCKET=harvest-hub-4978a.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=681060957712
VITE_FIREBASE_APP_ID=1:681060957712:web:7b6c117e2f6d0c31541495
VITE_FIREBASE_MEASUREMENT_ID=G-JKLG4T18FP
```

### 2. Backend Deployment Options

#### Option A: Deploy to Railway/Render/Heroku
1. Create account on Railway.app, Render.com, or Heroku
2. Connect your GitHub repository
3. Set root directory to `backend`
4. Add environment variables:
   - `MONGODB_URI=your_mongodb_connection_string`
   - `JWT_SECRET=your_jwt_secret`
   - `NODE_ENV=production`

#### Option B: Deploy to Vercel as Serverless Functions
1. Move backend files to `api/` directory
2. Update vercel.json to include serverless functions

### 3. Update Frontend Backend URL
After deploying backend, update `VITE_BACKEND_URL` in Vercel environment variables to your backend URL.

## Current Status
- ✅ Fixed vercel.json configuration
- ✅ Created production environment template
- ⏳ Backend needs separate deployment
- ⏳ Environment variables need to be set in Vercel dashboard
