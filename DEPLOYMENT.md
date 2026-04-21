---

## 🚀 3-Step Automated Setup (Recommended)

This project is designed to be managed entirely via **GitHub Actions**. Follow these 3 steps to set up your free hosting.

### 1. Host the Backend (Render Free)
1. Create a free account at [Render.com](https://dashboard.render.com/).
2. Click **New +** > **Web Service** and connect this GitHub repository.
3. Configure:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
4. In Render Settings, find the **Deploy Hook** URL and copy it.

### 2. Host the Frontend (GitHub Pages)
1. In your GitHub repository, go to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.

### 3. Link everything in GitHub Secrets
Go to your GitHub repository **Settings** > **Secrets and variables** > **Actions** and add these two secrets:

| Secret Name | Value |
|-------------|-------|
| `REACT_APP_API_URL` | Your Render URL + `/api` (e.g., `https://my-app.onrender.com/api`) |
| `RENDER_DEPLOY_HOOK` | The **Deploy Hook** URL you copied from Render |

---

## 🛠️ Environment Variables Reference

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for auth (min 32 chars) |
| `FRONTEND_URL` | Your GitHub Pages URL (e.g., `https://user.github.io/repo`) |

---

### Deploy Backend to Railway

#### 1. Install Railway CLI (Optional)

```bash
npm install -g @railway/cli
railway login
```

#### 2. Deploy via Dashboard

1. Go to [Railway](https://railway.app/)
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Choose your repository
5. Configure:
   - **Root Directory**: `/backend`
   - **Start Command**: `npm start`

#### 3. Add Environment Variables

Add the same environment variables as Render.

#### 4. Generate Domain

1. Go to **Settings**
2. Click **Generate Domain**
3. Your API is available at the generated URL

---

### Deploy Backend to Heroku

#### 1. Install Heroku CLI

```bash
npm install -g heroku
heroku login
```

#### 2. Create Heroku App

```bash
cd backend
heroku create finance-tracker-api
```

#### 3. Set Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set JWT_REFRESH_SECRET=your_refresh_secret
heroku config:set FRONTEND_URL=your_frontend_url
```

#### 4. Create Procfile

Create `backend/Procfile`:
```
web: node server.js
```

#### 5. Deploy

```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

---

## Frontend Deployment

### Deploy Frontend to Vercel

#### 1. Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

#### 2. Deploy via Dashboard

1. Go to [Vercel](https://vercel.com/)
2. Click **Import Project**
3. Import from Git
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

#### 3. Add Environment Variables

Add in Vercel dashboard:

```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

#### 4. Deploy

1. Click **Deploy**
2. Your app will be available at: `https://your-app.vercel.app`

#### 5. Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

---

### Deploy Frontend to Netlify

#### 1. Deploy via Dashboard

1. Go to [Netlify](https://netlify.com/)
2. Click **Add new site** → **Import an existing project**
3. Connect to Git provider
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`

#### 2. Add Environment Variables

Go to **Site settings** → **Build & deploy** → **Environment**:

```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

#### 3. Deploy

Click **Deploy site** and wait for build to complete.

---

## Environment Variables

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key-min-32-chars` |
| `JWT_REFRESH_SECRET` | Refresh token secret | `your-refresh-secret-min-32-chars` |
| `JWT_EXPIRE` | Access token expiry | `15m` |
| `JWT_REFRESH_EXPIRE` | Refresh token expiry | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-app.vercel.app` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `https://api.example.com/api` |

---

## Post-Deployment

### 1. Test the Application

1. Open your frontend URL
2. Register a new account
3. Test all features:
   - Login/Logout
   - Create transactions
   - Set budgets
   - View dashboard
   - Generate reports

### 2. Monitor Performance

#### Backend Monitoring (Render)
- Check logs in Render dashboard
- Monitor response times
- Watch for errors

#### Frontend Monitoring (Vercel)
- Check build logs
- Monitor bundle size
- Check Core Web Vitals

### 3. Set Up Custom Domain (Optional)

#### For Backend (Render)
1. Go to **Settings** → **Custom Domain**
2. Add your domain (e.g., `api.yourapp.com`)
3. Update DNS records:
   ```
   Type: CNAME
   Name: api
   Value: finance-tracker-api.onrender.com
   ```

#### For Frontend (Vercel)
1. Go to **Settings** → **Domains**
2. Add your domain (e.g., `yourapp.com`)
3. Follow DNS configuration

### 4. Enable HTTPS

Both Render and Vercel provide automatic SSL certificates via Let's Encrypt.

### 5. Set Up CI/CD via GitHub Actions

This project includes a pre-configured GitHub Actions workflow for automated deployment.

#### 1. Configure GitHub Secrets
Go to your GitHub repository **Settings > Secrets and variables > Actions** and add:

- `REACT_APP_API_URL`: Your backend API URL (e.g., `https://api.yourapp.com/api`)
- `RENDER_DEPLOY_HOOK`: (Optional) Your Render Deploy Hook URL to trigger backend updates automatically.

#### 2. Enable GitHub Pages
1. Go to **Settings > Pages**.
2. Under **Build and deployment > Source**, select **GitHub Actions**.

#### 3. Automatic Deployment
Every time you push to the `main` branch, GitHub Actions will:
1. Build your frontend.
2. Deploy the static site to **GitHub Pages**.
3. Trigger your backend host to redeploy (if hook is provided).

```bash
git add .
git commit -m "Update feature"
git push origin main
```

### 6. Database Backups

#### MongoDB Atlas Backups
1. Go to **Backup** tab in Atlas
2. Enable **Cloud Backup**
3. Configure backup schedule

---

## Troubleshooting

### Common Issues

#### 1. CORS Errors

**Problem**: Frontend can't connect to backend

**Solution**: Ensure `FRONTEND_URL` environment variable is set correctly in backend

#### 2. Build Failures

**Problem**: Deployment build fails

**Solution**:
- Check Node.js version compatibility
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

#### 3. MongoDB Connection Errors

**Problem**: Can't connect to MongoDB Atlas

**Solution**:
- Verify connection string is correct
- Check IP whitelist (0.0.0.0/0 for all IPs)
- Ensure database user has correct permissions

#### 4. Environment Variables Not Working

**Problem**: App can't read environment variables

**Solution**:
- Restart the service after adding variables
- Check variable names match exactly
- For frontend, ensure variables start with `REACT_APP_`

#### 5. 502/503 Errors

**Problem**: Backend is down or unreachable

**Solution**:
- Check backend logs
- Verify backend is deployed and running
- Check if free tier has usage limits

---

## Performance Optimization

### Backend
- Enable response compression
- Implement Redis caching (optional)
- Optimize database queries
- Use indexes on MongoDB

### Frontend
- Code splitting
- Lazy loading routes
- Image optimization
- Enable CDN

---

## Security Checklist

- ✅ HTTPS enabled
- ✅ Environment variables secured
- ✅ CORS configured properly
- ✅ Rate limiting enabled
- ✅ MongoDB network restricted
- ✅ Strong JWT secrets
- ✅ Password hashing enabled
- ✅ Input validation implemented
- ✅ No sensitive data in logs
- ✅ Regular dependency updates

---

## Cost Estimation

### Free Tier Limits

**Render (Free)**
- 750 hours/month
- 512 MB RAM
- Sleeps after 15 minutes of inactivity

**Vercel (Free)**
- Unlimited deployments
- 100 GB bandwidth/month
- Serverless function execution

**MongoDB Atlas (Free - M0)**
- 512 MB storage
- Shared RAM
- No backup

**Upgrade Considerations**:
- Traffic > 10,000 requests/day
- Need 24/7 uptime
- Require automated backups
- Need more storage

---

## Support

For deployment issues:
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Railway: https://docs.railway.app
