# Vercel Backend Deployment Guide

## Environment Variables Setup

When deploying to Vercel, add these environment variables in your Vercel dashboard:

### Required Variables:
```
MONGODB_URI=mongodb+srv://harshavardhanreddyv22:harsha8485@cluster0.0gmulll.mongodb.net/harvesthub?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secure-jwt-secret-key-here
SESSION_SECRET=9a3f21c85c9441a3f1f4b4e8cb05396dc2be4ff27b77b0b8b78f7f8c5b62c33b4c1d16a3f4aa82327aa5d4a1e12cdbcc
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.vercel.app
```

### Optional Variables:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
MAX_FILE_SIZE=10mb
```

## Deployment Steps:

1. **Deploy Backend:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your repository
   - Set root directory to `backend`
   - Add all environment variables above
   - Deploy

2. **Update Frontend:**
   - After backend deployment, copy the backend URL
   - In your frontend Vercel project, set:
     ```
     VITE_BACKEND_URL=https://your-backend-domain.vercel.app
     ```

3. **Update CORS:**
   - After frontend deployment, update backend's `CLIENT_URL` to your frontend domain

## Important Notes:

- The serverless function is now optimized for Vercel
- File uploads may need external storage (like AWS S3) for production
- Redis functionality has been removed for serverless compatibility
- Database connections are cached to prevent timeout issues

## Troubleshooting:

If you still get errors:
1. Check Vercel function logs
2. Ensure all environment variables are set
3. Verify MongoDB Atlas allows connections from 0.0.0.0/0
4. Check that your MongoDB user has proper permissions
