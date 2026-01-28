# Installation Commands Reference

Quick reference for all installation and setup commands.

## Initial Setup

### 1. Navigate to Project
```bash
cd c:\Users\panya\Documents\GitHub\financetracker
```

### 2. Backend Installation
```bash
cd backend
npm install
```

**Dependencies installed** (automatically):
- express
- mongoose
- bcryptjs
- jsonwebtoken
- joi
- dotenv
- cors
- helmet
- express-rate-limit
- express-mongo-sanitize
- cookie-parser
- morgan
- express-async-handler
- nodemon (dev dependency)

### 3. Frontend Installation
```bash
cd ../frontend
npm install
```

**Dependencies installed** (automatically):
- react
- react-dom
- react-router-dom
- axios
- chart.js
- react-chartjs-2
- @reduxjs/toolkit
- react-redux
- react-hook-form
- react-hot-toast
- date-fns
- lucide-react
- TypeScript and types
- tailwindcss

## Environment Configuration

### Backend .env
```bash
cd backend
copy .env.example .env
notepad .env
```

Required values:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/financetracker
JWT_SECRET=minimum_32_characters_long_secret_key_please_change
JWT_REFRESH_SECRET=minimum_32_characters_long_refresh_key_change
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Frontend .env
```bash
cd frontend
copy .env.example .env
notepad .env
```

Required value:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```

Output should show:
```
✅ MongoDB Atlas Connected Successfully
🚀 Server running in development mode on port 5000
📡 API available at http://localhost:5000/api
```

### Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```

Browser opens automatically to: `http://localhost:3000`

## Development Commands

### Backend
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### Frontend
```bash
# Development server
npm start

# Production build
npm run build

# Run tests
npm test

# Eject (not recommended)
npm run eject
```

## Testing Commands

### Backend Health Check
```bash
curl http://localhost:5000/health
```

### Register User (curl)
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

### Login (curl)
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

## Git Commands

### Initialize (already done)
```bash
git init
git add .
git commit -m "Initial commit: Secure Finance Tracker SaaS"
```

### Create Branches
```bash
git checkout -b dev
git checkout -b feature/transactions
```

### Regular Workflow
```bash
git status
git add .
git commit -m "Add feature: description"
git push origin main
```

## Troubleshooting Commands

### Check Running Processes
```bash
# Windows - Find process on port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F
```

### Clear npm Cache
```bash
npm cache clean --force
```

### Reinstall Dependencies
```bash
# Backend
cd backend
rmdir /s /q node_modules
del package-lock.json
npm install

# Frontend
cd frontend
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Update Dependencies
```bash
npm update
npm audit fix
```

## Production Build Commands

### Backend
```bash
cd backend
npm install --production
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Creates optimized production build in build/
```

## Deployment Commands

### Deploy to Render (via CLI)
```bash
# Install Render CLI
npm install -g @render/cli

# Login
render login

# Deploy
render deploy
```

### Deploy to Vercel (via CLI)
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel
```

### Deploy to Railway (via CLI)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

## Database Commands

### MongoDB Atlas via mongosh
```bash
# Install MongoDB Shell
# Download from: https://www.mongodb.com/try/download/shell

# Connect
mongosh "mongodb+srv://cluster.mongodb.net/financetracker" --username <username>

# List databases
show dbs

# Use database
use financetracker

# List collections
show collections

# Query users
db.users.find()

# Count transactions
db.transactions.countDocuments()
```

## Useful Development Scripts

### Create Production Build
```bash
# Full production build
cd backend && npm install --production
cd ../frontend && npm run build
```

### Run All Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Generate JWT Secret
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Check Ports
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Check if port 3000 is in use
netstat -ano | findstr :3000
```

## Package Management

### View Installed Packages
```bash
npm list --depth=0
```

### Update Specific Package
```bash
npm update <package-name>
```

### Check for Outdated Packages
```bash
npm outdated
```

### Security Audit
```bash
npm audit
npm audit fix
npm audit fix --force  # Use carefully
```

## Quick Command Reference

| Task | Command |
|------|---------|
| Install backend | `cd backend && npm install` |
| Install frontend | `cd frontend && npm install` |
| Start backend dev | `cd backend && npm run dev` |
| Start frontend dev | `cd frontend && npm start` |
| Build frontend | `cd frontend && npm run build` |
| Test health | `curl http://localhost:5000/health` |
| Check errors | `npm audit` |
| Clean install | `rm -rf node_modules && npm install` |
| Generate secret | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

## Environment Variables Quick Reference

### Development
```env
# Backend
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=dev_secret_32_chars
FRONTEND_URL=http://localhost:3000

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
```

### Production
```env
# Backend
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=prod_secret_32_chars_change_me
FRONTEND_URL=https://your-app.vercel.app

# Frontend
REACT_APP_API_URL=https://your-api.onrender.com/api
```

## First Time Setup Checklist

- [ ] Install Node.js (v16+)
- [ ] Clone/navigate to project
- [ ] Install backend dependencies
- [ ] Install frontend dependencies
- [ ] Create MongoDB Atlas cluster
- [ ] Configure backend .env
- [ ] Configure frontend .env
- [ ] Start backend server
- [ ] Start frontend app
- [ ] Create test account
- [ ] Test all features
- [ ] Review documentation

## Common Issues & Solutions

### Issue: Cannot find module
```bash
# Solution: Reinstall dependencies
npm install
```

### Issue: Port already in use
```bash
# Solution: Kill process or change port
netstat -ano | findstr :5000
taskkill /PID <PID> /F
# Or change PORT in .env
```

### Issue: MongoDB connection failed
```bash
# Solution: Check connection string
# Verify IP whitelist in MongoDB Atlas
# Check network connectivity
```

### Issue: CORS error
```bash
# Solution: Check FRONTEND_URL in backend .env
# Ensure backend is running
# Clear browser cache
```

## Performance Optimization

### Analyze Bundle Size
```bash
cd frontend
npm run build
# Check build/static/js for file sizes
```

### Cache Clear
```bash
# npm cache
npm cache clean --force

# Browser cache
# Ctrl + Shift + Delete in browser
```

## Backup Commands

### Backup Database
```bash
# MongoDB Atlas provides automatic backups
# Or use mongodump
mongodump --uri="mongodb+srv://..." --out=./backup
```

### Restore Database
```bash
mongorestore --uri="mongodb+srv://..." ./backup
```

---

**Need Help?**
- Review [QUICK_START.md](QUICK_START.md) for detailed setup
- Check [README.md](README.md) for full documentation
- See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment help
