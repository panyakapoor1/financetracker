import apiClient from './api';
import { ApiResponse } from '../types';

export interface Category {
  _id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
  userId?: string;
  isDefault: boolean;
}

export const categoryService = {
  async getCategories(type?: 'income' | 'expense'): Promise<ApiResponse<{ categories: Category[] }>> {
    const response = await apiClient.get<ApiResponse<{ categories: Category[] }>>('/categories', {
      params: { type },
    });
    return response.data;
  },

  async createCategory(data: Omit<Category, '_id' | 'isDefault'>): Promise<ApiResponse<{ category: Category }>> {
    const response = await apiClient.post<ApiResponse<{ category: Category }>>('/categories', data);
    return response.data;
  },
};
