// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// Transaction types
export interface Transaction {
  _id: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: Category;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionDto {
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  date?: string;
  description?: string;
}

// Category types
export interface Category {
  _id: string;
  userId?: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
}

export interface CreateCategoryDto {
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  color?: string;
}

// Budget types
export interface Budget {
  _id: string;
  userId: string;
  categoryId: Category;
  month: string;
  limit: number;
  spent: number;
  percentageUsed: number;
  remaining: number;
  status: 'good' | 'warning' | 'exceeded';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetDto {
  categoryId: string;
  month: string;
  limit: number;
}

// Dashboard types
export interface DashboardSummary {
  currentMonth: {
    income: number;
    expense: number;
    balance: number;
    transactions: number;
  };
  allTime: {
    income: number;
    expense: number;
    balance: number;
  };
  recentTransactions: Transaction[];
  budgetAlerts: Budget[];
}

export interface Analytics {
  categorySpending: CategorySpending[];
  monthlyTrends: MonthlyTrend[];
  incomeSources: IncomeSource[];
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  icon: string;
  color: string;
  total: number;
  count: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
}

export interface IncomeSource {
  categoryId: string;
  categoryName: string;
  icon: string;
  color: string;
  total: number;
  count: number;
}

// API Response types
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginatedResponse<T> {
  status: 'success';
  data: {
    [key: string]: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}
