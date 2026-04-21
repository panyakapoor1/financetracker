import apiClient from './api';
import {
  Category,
  CreateCategoryDto,
  Budget,
  CreateBudgetDto,
  DashboardSummary,
  Analytics,
  ApiResponse,
} from '../types';

export const categoryService = {
  async getCategories(type?: 'income' | 'expense'): Promise<ApiResponse<{ categories: Category[] }>> {
    const response = await apiClient.get<ApiResponse<{ categories: Category[] }>>(
      '/categories',
      { params: { type } }
    );
    return response.data;
  },

  async createCategory(data: CreateCategoryDto): Promise<ApiResponse<{ category: Category }>> {
    const response = await apiClient.post<ApiResponse<{ category: Category }>>(
      '/categories',
      data
    );
    return response.data;
  },

  async updateCategory(
    id: string,
    data: Partial<CreateCategoryDto>
  ): Promise<ApiResponse<{ category: Category }>> {
    const response = await apiClient.put<ApiResponse<{ category: Category }>>(
      `/categories/${id}`,
      data
    );
    return response.data;
  },

  async deleteCategory(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(`/categories/${id}`);
    return response.data;
  },
};

export const budgetService = {
  async getBudgets(month?: string): Promise<ApiResponse<{ budgets: Budget[] }>> {
    const response = await apiClient.get<ApiResponse<{ budgets: Budget[] }>>(
      '/budgets',
      { params: { month } }
    );
    return response.data;
  },

  async createBudget(data: CreateBudgetDto): Promise<ApiResponse<{ budget: Budget }>> {
    const response = await apiClient.post<ApiResponse<{ budget: Budget }>>(
      '/budgets',
      data
    );
    return response.data;
  },

  async updateBudget(id: string, limit: number): Promise<ApiResponse<{ budget: Budget }>> {
    const response = await apiClient.put<ApiResponse<{ budget: Budget }>>(
      `/budgets/${id}`,
      { limit }
    );
    return response.data;
  },

  async deleteBudget(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(`/budgets/${id}`);
    return response.data;
  },

  async getAlerts(): Promise<ApiResponse<{ alerts: Budget[]; count: number }>> {
    const response = await apiClient.get<ApiResponse<{ alerts: Budget[]; count: number }>>(
      '/budgets/alerts'
    );
    return response.data;
  },
};

export const dashboardService = {
  async getSummary(): Promise<ApiResponse<DashboardSummary>> {
    const response = await apiClient.get<ApiResponse<DashboardSummary>>('/dashboard/summary');
    return response.data;
  },

  async getAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    period?: 'monthly' | 'daily';
  }): Promise<ApiResponse<Analytics>> {
    const response = await apiClient.get<ApiResponse<Analytics>>(
      '/dashboard/analytics',
      { params }
    );
    return response.data;
  },
};

export const reportService = {
  async exportCSV(params?: {
    startDate?: string;
    endDate?: string;
    type?: 'income' | 'expense';
  }): Promise<Blob> {
    const response = await apiClient.get('/reports/csv', {
      params,
      responseType: 'blob',
    });
    return response.data as Blob;
  },

  async getSummary(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/reports/summary', { params });
    return response.data as any;
  },

  async getIncomeExpenseReport(year?: number): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/reports/income-expense', {
      params: { year },
    });
    return response.data as any;
  },
};

export const recurringService = {
  async getAll(): Promise<ApiResponse<{ recurringTransactions: any[] }>> {
    const response = await apiClient.get<ApiResponse<{ recurringTransactions: any[] }>>('/recurring');
    return response.data;
  },

  async create(data: {
    amount: number;
    type: 'income' | 'expense';
    categoryId: string;
    description?: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    nextDate: string;
  }): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/recurring', data);
    return response.data as any;
  },

  async update(id: string, data: any): Promise<ApiResponse<any>> {
    const response = await apiClient.put(`/recurring/${id}`, data);
    return response.data as any;
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(`/recurring/${id}`);
    return response.data;
  },
};

export const savingsService = {
  async getGoals(): Promise<ApiResponse<{ goals: any[] }>> {
    const response = await apiClient.get<ApiResponse<{ goals: any[] }>>('/savings');
    return response.data;
  },

  async createGoal(data: {
    name: string;
    targetAmount: number;
    currentAmount?: number;
    deadline?: string;
    icon?: string;
    color?: string;
  }): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/savings', data);
    return response.data as any;
  },

  async updateGoal(id: string, data: any): Promise<ApiResponse<any>> {
    const response = await apiClient.put(`/savings/${id}`, data);
    return response.data as any;
  },

  async deleteGoal(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(`/savings/${id}`);
    return response.data;
  },

  async fundGoal(id: string, amount: number): Promise<ApiResponse<any>> {
    const response = await apiClient.post(`/savings/${id}/fund`, { amount });
    return response.data as any;
  },
};

export const achievementService = {
  async getAchievements(): Promise<ApiResponse<{ achievements: any[] }>> {
    const response = await apiClient.get<ApiResponse<{ achievements: any[] }>>('/achievements');
    return response.data;
  },

  async evaluateAchievements(): Promise<ApiResponse<{ newUnlocks: any[] }>> {
    const response = await apiClient.post('/achievements/evaluate');
    return response.data as any;
  }
};

