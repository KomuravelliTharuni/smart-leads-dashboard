# Deployment Guide - Smart Leads Dashboard

## Prerequisites
- GitHub account (push your code first)
- Free accounts on Render (for backend) and Vercel (for frontend)

## Step 1: Push Code to GitHub

```bash
cd 'C:\Users\Neha\OneDrive\Desktop\Assignment Full Stack Intern'

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Smart Leads Dashboard - Complete MERN app with JWT auth, role-based access, filtering, pagination, CSV export, and dark mode"

# Add remote repository (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/smart-leads-dashboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Render

### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub account
3. Connect your GitHub repository

### 2.2 Deploy Server
1. Click "New +" button
2. Select "Web Service"
3. Connect your GitHub repo
4. Fill in details:
   - **Name**: `smart-leads-server`
   - **Environment**: Node
   - **Build Command**: `cd server && npm install && npm run build`
   - **Start Command**: `cd server && npm start`
   - **Runtime**: Node

5. Add Environment Variables:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER].mongodb.net/smartleads?retryWrites=true&w=majority
   JWT_SECRET=your-secure-secret-key-here-change-this
   CLIENT_URL=https://smart-leads-dashboard.vercel.app
   NODE_ENV=production
   ```

6. Select Free tier
7. Deploy

**Get MongoDB Atlas URI:**
- Go to https://www.mongodb.com/cloud/atlas
- Create free account
- Create cluster
- Get connection string from "Connect" > "Drivers"
- Replace USERNAME and PASSWORD

### 2.3 Update Server package.json
Ensure the "start" script exists in `server/package.json`:
```json
"scripts": {
  "dev": "ts-node-dev --respawn src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "seed": "ts-node src/seed.ts"
}
```

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Deploy Using Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." > "Project"
4. Import your GitHub repository
5. Fill in settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. Add Environment Variables:
   ```
   VITE_API_BASE_URL=https://smart-leads-server.onrender.com/api
   ```

7. Click "Deploy"

### 3.2 Update Client .env.example
Create/update `client/.env.example`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Update `client/src/api.ts` to use environment variable:
```typescript
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const api = axios.create({ baseURL })
```

---

## Step 4: Test Deployed Application

1. **Frontend URL**: https://smart-leads-dashboard.vercel.app
2. **Backend URL**: https://smart-leads-server.onrender.com/api

### Test Login
- Email: `admin@example.com`
- Password: `Password123`

If you need to seed the database on Render:
```bash
# In Render dashboard, go to your service
# Click "Shell" to open terminal
# Run:
cd server && npm run seed
```

---

## Alternative: Docker Deployment

### Deploy with Railway
1. Go to https://railway.app
2. Connect GitHub
3. Select your repository
4. Railway auto-detects `docker-compose.yml`
5. Add MongoDB Atlas URI to environment variables
6. Deploy

---

## Environment Variables Checklist

**Backend (.env)**
- [ ] PORT=5000
- [ ] MONGO_URI=mongodb+srv://...
- [ ] JWT_SECRET=strong-secret-key
- [ ] CLIENT_URL=your-frontend-url
- [ ] NODE_ENV=production

**Frontend (.env)**
- [ ] VITE_API_BASE_URL=your-backend-api-url

---

## Common Issues & Solutions

### Backend returns CORS error
Add frontend URL to `server/src/app.ts`:
```typescript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000'
}))
```

### MongoDB connection fails
- Verify connection string in Render env variables
- Add IP whitelist in MongoDB Atlas (allow 0.0.0.0/0)
- Check username and password don't have special characters

### Frontend can't connect to backend
- Update VITE_API_BASE_URL with correct backend URL
- Ensure backend is running and returns 200 on `/api/health`
- Check CORS settings on backend

---

## Final Submission

Once deployed, send email to: **ritik.yadav@servicehive.tech**

**Subject:** `MERN Internship Assignment Submission - [Your Name]`

**Body:**
```
Hi,

Please find my MERN Full Stack Internship Assignment submission:

GitHub Repository: https://github.com/YOUR-USERNAME/smart-leads-dashboard

Deployed Links:
- Frontend: https://smart-leads-dashboard.vercel.app
- Backend: https://smart-leads-server.onrender.com/api

Test Credentials:
- Email: admin@example.com
- Password: Password123

Features Implemented:
✅ JWT Authentication with Role-Based Access Control
✅ Complete Lead Management (CRUD)
✅ Advanced Filtering & Search
✅ Pagination (10 items per page)
✅ Dark Mode / Light Mode Toggle
✅ Success Messages on Auth
✅ CSV Export
✅ Responsive UI with Error & Loading States
✅ Docker Containerization
✅ TypeScript Throughout

Thank you for the opportunity!

Best regards,
[Your Name]
```

---

## Monitoring Deployed Application

### Render Dashboard
- View logs
- Monitor performance
- Restart services

### Vercel Dashboard
- View analytics
- Check deployment status
- Rollback if needed

---

## Local Testing Before Deployment

```bash
# Test with production build
cd client
npm run build
npm run preview

cd ../server
npm run build
npm start
```

---

Need help with any deployment step? Let me know!
