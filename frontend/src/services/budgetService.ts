import apiClient from './api';
import { ApiResponse } from '../types';
import { Category } from './categoryService';

export interface Budget {
  _id: string;
  userId: string;
  categoryId: Category;
  amount: number;
  spent: number;
  month: string;
  createdAt: string;
}

export interface CreateBudgetDto {
  categoryId: string;
  amount: number;
  month: string; // YYYY-MM
}

export const budgetService = {
  async getBudgets(month?: string): Promise<ApiResponse<{ budgets: Budget[] }>> {
    const response = await apiClient.get<ApiResponse<{ budgets: Budget[] }>>('/budgets', {
      params: { month },
    });
    return response.data;
  },

  async createBudget(data: CreateBudgetDto): Promise<ApiResponse<{ budget: Budget }>> {
    const response = await apiClient.post<ApiResponse<{ budget: Budget }>>('/budgets', data);
    return response.data;
  },

  async updateBudget(id: string, data: Partial<CreateBudgetDto>): Promise<ApiResponse<{ budget: Budget }>> {
    const response = await apiClient.put<ApiResponse<{ budget: Budget }>>(`/budgets/${id}`, data);
    return response.data;
  },

  async deleteBudget(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(`/budgets/${id}`);
    return response.data;
  },
};
