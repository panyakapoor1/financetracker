# Finance Tracker SaaS Platform

A secure, production-ready finance tracking application built with the MERN stack.

## 🚀 Features

- **Secure Authentication**: JWT-based auth with refresh tokens
- **Transaction Management**: Track income and expenses
- **Budget Tracking**: Set and monitor monthly budgets
- **Analytics Dashboard**: Visual insights into spending patterns
- **Reports**: Export data as CSV/PDF
- **Role-based Access**: User and admin roles

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with Joi
- Rate limiting
- Helmet security headers
- CORS protection
- NoSQL injection prevention
- XSS protection

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd financetracker
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB Atlas credentials
npm run dev
```

Backend runs on: http://localhost:5000

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

Frontend runs on: http://localhost:3000

## 🌍 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📚 API Documentation

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/refresh` - Refresh access token
- POST `/api/auth/logout` - Logout user

### Transactions
- GET `/api/transactions` - Get all transactions (paginated)
- POST `/api/transactions` - Create transaction
- GET `/api/transactions/:id` - Get transaction by ID
- PUT `/api/transactions/:id` - Update transaction
- DELETE `/api/transactions/:id` - Delete transaction

### Categories
- GET `/api/categories` - Get all categories
- POST `/api/categories` - Create category
- PUT `/api/categories/:id` - Update category
- DELETE `/api/categories/:id` - Delete category

### Budgets
- GET `/api/budgets` - Get all budgets
- POST `/api/budgets` - Create budget
- GET `/api/budgets/:id` - Get budget by ID
- PUT `/api/budgets/:id` - Update budget
- DELETE `/api/budgets/:id` - Delete budget

### Dashboard
- GET `/api/dashboard/summary` - Get financial summary
- GET `/api/dashboard/analytics` - Get analytics data

### Reports
- GET `/api/reports/csv` - Export as CSV
- GET `/api/reports/pdf` - Export as PDF

## 🧪 Testing with Postman

Import the Postman collection from `/postman/Finance-Tracker-API.postman_collection.json`

Set environment variables:
- `base_url`: http://localhost:5000/api
- `token`: (will be set automatically after login)

## 🚀 Deployment

### Backend (Render/Railway)
1. Create new web service
2. Connect your repository
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Create new project
2. Connect your repository
3. Set build command: `cd frontend && npm run build`
4. Set publish directory: `frontend/build`
5. Set environment variables
6. Deploy

## 📁 Project Structure

```
financetracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── validators/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
└── README.md
```

## 🔒 Security Best Practices

- Never commit `.env` files
- Use strong JWT secrets
- Implement rate limiting
- Validate all inputs
- Use HTTPS in production
- Keep dependencies updated
- Implement proper error handling
- Use security headers

## 📝 License

MIT

## 👥 Contributing

Pull requests are welcome. For major changes, please open an issue first.
