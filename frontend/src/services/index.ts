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
    return response.data;
  },

  async getSummary(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/reports/summary', { params });
    return response.data;
  },

  async getIncomeExpenseReport(year?: number): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/reports/income-expense', {
      params: { year },
    });
    return response.data;
  },
};
