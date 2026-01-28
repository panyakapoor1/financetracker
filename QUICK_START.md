# Quick Start Guide

Get your Finance Tracker up and running in 10 minutes!

## Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB Atlas Account** - [Sign up free](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended)

## Step-by-Step Setup

### 1. Clone or Download

If you haven't already:
```bash
cd c:\Users\panya\Documents\GitHub\financetracker
```

### 2. Backend Setup (5 minutes)

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` folder:

```bash
# Copy the example file
copy .env.example .env

# Edit .env with your details
```

Required variables in `.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/financetracker?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long_please_change_this
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_characters_long_change_this_too
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

**Important**: 
- Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your MongoDB Atlas credentials
- Generate secure random strings for JWT secrets (min 32 characters)
- Keep these secrets safe and never commit them to Git

#### Start Backend Server
```bash
npm run dev
```

You should see:
```
✅ MongoDB Atlas Connected Successfully
🚀 Server running in development mode on port 5000
📡 API available at http://localhost:5000/api
```

#### Test Backend
Open a new terminal and test:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "success",
  "message": "Finance Tracker API is running",
  "timestamp": "2026-01-28T..."
}
```

### 3. Frontend Setup (5 minutes)

Open a **new terminal window** (keep backend running):

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `frontend` folder:

```bash
# Copy the example file
copy .env.example .env
```

Content of `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### Start Frontend
```bash
npm start
```

Your browser should automatically open to `http://localhost:3000`

### 4. Create Your Account

1. Click **Sign up** or navigate to register page
2. Fill in:
   - **Name**: Your name
   - **Email**: your@email.com
   - **Password**: At least 6 characters
3. Click **Create Account**
4. You'll be automatically logged in and redirected to the dashboard!

### 5. Start Using the App

You're all set! You can now:
- ✅ View your dashboard
- ✅ Add transactions (income/expenses)
- ✅ Set monthly budgets
- ✅ Track spending by category
- ✅ View analytics and reports

---

## MongoDB Atlas Setup (Detailed)

If you haven't set up MongoDB Atlas yet:

### Step 1: Create Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **Try Free**
3. Sign up with email or Google

### Step 2: Create Cluster
1. Choose **M0 Free** tier
2. Select your cloud provider (AWS recommended)
3. Choose region closest to you
4. Cluster name: `Cluster0` (default is fine)
5. Click **Create Cluster** (takes 2-5 minutes)

### Step 3: Create Database User
1. Click **Database Access** (left sidebar)
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Username: `financeapp` (or your choice)
5. Password: Click **Autogenerate Secure Password** and **copy it**
6. User Privileges: **Atlas Admin** or **Read and write to any database**
7. Click **Add User**

### Step 4: Whitelist IP Address
1. Click **Network Access** (left sidebar)
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (for development)
   - This adds `0.0.0.0/0`
4. Click **Confirm**

### Step 5: Get Connection String
1. Click **Database** (left sidebar)
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. **Driver**: Node.js
5. **Version**: 4.1 or later
6. Copy the connection string
7. Replace `<password>` with your database user password
8. Replace `myFirstDatabase` with `financetracker`

Final string looks like:
```
mongodb+srv://financeapp:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/financetracker?retryWrites=true&w=majority
```

### Step 6: Test Connection
Paste this into your backend `.env` file as `MONGODB_URI` and start the backend.

---

## Troubleshooting

### Backend Issues

#### MongoDB Connection Failed
```
❌ MongoDB Connection Error: ...
```

**Solutions**:
1. Check your `MONGODB_URI` in `.env`
2. Verify password doesn't have special characters (or URL encode them)
3. Ensure IP is whitelisted in MongoDB Atlas
4. Check if cluster is active

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution**:
```bash
# Windows - Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Change port in backend/.env
PORT=5001
```

### Frontend Issues

#### Cannot Connect to Backend
```
Network Error or CORS error
```

**Solutions**:
1. Ensure backend is running on port 5000
2. Check `REACT_APP_API_URL` in frontend `.env`
3. Clear browser cache
4. Check browser console for errors

#### Module Not Found
```
Cannot find module 'react-router-dom'
```

**Solution**:
```bash
cd frontend
npm install
```

### Common Mistakes

1. **Forgot to create `.env` files**
   - Copy from `.env.example` in both folders

2. **Running backend/frontend in same terminal**
   - Use two separate terminal windows

3. **MongoDB Atlas IP not whitelisted**
   - Add `0.0.0.0/0` in Network Access

4. **Wrong connection string**
   - Make sure to replace `<password>` and database name

---

## Testing the API

### Using curl

```bash
# Health check
curl http://localhost:5000/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\"}"

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

### Using Postman

1. Import the collection (see [POSTMAN_GUIDE.md](POSTMAN_GUIDE.md))
2. Set environment variable `base_url` to `http://localhost:5000/api`
3. Test the endpoints

---

## Next Steps

### Development
- Read [README.md](README.md) for full documentation
- Check [SECURITY.md](SECURITY.md) for security details
- Review [POSTMAN_GUIDE.md](POSTMAN_GUIDE.md) for API testing

### Deployment
- Follow [DEPLOYMENT.md](DEPLOYMENT.md) to deploy to cloud
- Set up production environment variables
- Configure custom domain

### Customization
- Modify colors in `frontend/tailwind.config.js`
- Add new categories in `backend/src/models/Category.js`
- Customize dashboard in `frontend/src/pages/Dashboard.tsx`

---

## Support & Resources

### Documentation
- [Main README](README.md) - Full project documentation
- [API Guide](POSTMAN_GUIDE.md) - Complete API reference
- [Deployment Guide](DEPLOYMENT.md) - Deploy to production
- [Security](SECURITY.md) - Security implementation details

### Learn More
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [JWT.io](https://jwt.io/) - JWT debugger

### Get Help
- Check GitHub issues
- Review error logs in terminal
- Test with Postman
- MongoDB Atlas support

---

## Development Commands

### Backend
```bash
cd backend
npm run dev        # Start with hot reload (nodemon)
npm start          # Start in production mode
```

### Frontend
```bash
cd frontend
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

---

## Project Structure Quick Reference

```
financetracker/
├── backend/
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, validation, errors
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   └── utils/          # Helper functions
│   ├── .env.example        # Environment template
│   ├── package.json        # Dependencies
│   └── server.js           # Entry point
│
├── frontend/
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API calls
│   │   ├── store/          # Redux store
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx         # Main app component
│   │   └── index.tsx       # Entry point
│   ├── .env.example        # Environment template
│   └── package.json        # Dependencies
│
├── .gitignore              # Git ignore rules
├── README.md               # Project documentation
├── QUICK_START.md          # This file
├── POSTMAN_GUIDE.md        # API testing guide
├── DEPLOYMENT.md           # Deployment instructions
└── SECURITY.md             # Security documentation
```

---

## Success! 🎉

You now have a fully functional, secure Finance Tracker running locally!

**What's running:**
- ✅ Backend API: http://localhost:5000
- ✅ Frontend App: http://localhost:3000
- ✅ MongoDB Atlas: Cloud database

**You can now:**
- 💰 Track your income and expenses
- 📊 View financial analytics
- 🎯 Set and monitor budgets
- 📈 Generate reports

Happy tracking! 💵
