# Finance Tracker

A full-stack personal finance tracking application built with the MERN stack (MongoDB, Express, React, Node.js). Features a modern glassmorphism UI, real-time data persistence, and a comprehensive set of tools for managing your money.

## Features

### Core
- **Dashboard** — At-a-glance summary of income, expenses, balance, budget alerts, and recent transactions.
- **Transactions** — Create, view, search, filter, and delete income/expense records. Supports filtering by type, category, and free-text search.
- **Budgets** — Set monthly spending limits per category with visual progress bars that turn yellow at 80% and red when exceeded.
- **Reports & Analytics** — Interactive charts (line, doughnut) powered by Chart.js showing income vs expense trends, spending by category, savings rate, and a detailed category breakdown table.
- **CSV Export** — Download all your transaction data as a CSV file, with optional date range filtering.

### Advanced
- **Recurring Transactions** — Automate tracking of regular bills and income (rent, subscriptions, salary). Set frequency (daily/weekly/monthly/yearly), pause/resume at any time.
- **Savings Goals** — Set financial targets (emergency fund, vacation, new car) with custom icons, colors, deadlines, and a deposit/withdraw system to track progress.
- **Achievements** — Gamified experience with unlockable badges (e.g., "100 Club", "Budget Master") based on your financial milestones and habits.
- **Transaction Search & Filters** — Instantly search transactions by category name, description, or amount. Filter by type (income/expense) and category.

### Security
- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Input validation with Joi
- Rate limiting, Helmet security headers, CORS protection
- NoSQL injection prevention with express-mongo-sanitize

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, TypeScript, Tailwind CSS, Chart.js, React Router, Redux Toolkit, Framer Motion, Lucide Icons |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB Atlas |
| Auth | JWT (access + refresh tokens), bcrypt |

## Getting Started

### Prerequisites
- Node.js v16+
- A MongoDB Atlas cluster (free tier works fine)
- npm or yarn

### 1. Clone & install

```bash
git clone <repository-url>
cd financetracker

# Backend
cd backend
npm install
cp .env.example .env   # then edit with your MongoDB URI and JWT secrets

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment variables

**Backend** (`backend/.env`):
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/finance-tracker
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env`):
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Run

```bash
# Terminal 1 — Backend
cd backend
npm run dev        # starts on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm start          # starts on http://localhost:3000
```

## API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | List transactions (paginated, filterable) |
| POST | `/api/transactions` | Create a transaction |
| GET | `/api/transactions/:id` | Get a single transaction |
| PUT | `/api/transactions/:id` | Update a transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |
| GET | `/api/transactions/stats/summary` | Get income/expense stats |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List categories |
| POST | `/api/categories` | Create a category |
| PUT | `/api/categories/:id` | Update a category |
| DELETE | `/api/categories/:id` | Delete a category |

### Budgets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/budgets` | List budgets (filterable by month) |
| POST | `/api/budgets` | Create a budget |
| PUT | `/api/budgets/:id` | Update a budget |
| DELETE | `/api/budgets/:id` | Delete a budget |
| GET | `/api/budgets/alerts` | Get over-budget alerts |

### Recurring Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recurring` | List recurring transactions |
| POST | `/api/recurring` | Create a recurring transaction |
| PUT | `/api/recurring/:id` | Update (or pause/resume) |
| DELETE | `/api/recurring/:id` | Delete |

### Savings Goals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/savings` | List savings goals |
| POST | `/api/savings` | Create a goal |
| PUT | `/api/savings/:id` | Update a goal |
| DELETE | `/api/savings/:id` | Delete a goal |
| POST | `/api/savings/:id/fund` | Deposit or withdraw funds |

### Achievements
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/achievements` | List all badges and their status |
| POST | `/api/achievements/evaluate` | Trigger recalculation of unlocked badges |

### Dashboard & Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/summary` | Dashboard summary |
| GET | `/api/dashboard/analytics` | Analytics (trends, category spending) |
| GET | `/api/reports/csv` | Export transactions as CSV |
| GET | `/api/reports/summary` | Report summary with savings rate |
| GET | `/api/reports/income-expense` | Monthly income vs expense for a year |

## Project Structure

```
financetracker/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/         # Auth, error handling
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # Express route definitions
│   │   └── utils/              # Helpers
│   ├── server.js               # Express app entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         # Layout, PrivateRoute
│   │   ├── pages/              # Dashboard, Transactions, Budgets, Reports, Recurring, SavingsGoals, Achievements, Calendar
│   │   ├── services/           # API client and service modules
│   │   ├── store/              # Redux store and slices
│   │   └── types/              # TypeScript interfaces
│   └── package.json
└── README.md
```

## Deployment

### Backend (Render / Railway)
1. Create a new web service and connect your repository.
2. Set build command: `cd backend && npm install`
3. Set start command: `cd backend && npm start`
4. Add all environment variables from `.env`.

### Frontend (Vercel / Netlify)
1. Create a new project and connect your repository.
2. Set build command: `cd frontend && npm run build`
3. Set publish directory: `frontend/build`
4. Set `REACT_APP_API_URL` to your deployed backend URL.

## License

MIT
