import apiClient from './api';
import {
  Transaction,
  CreateTransactionDto,
  PaginatedResponse,
  ApiResponse,
} from '../types';

export const transactionService = {
  async getTransactions(params?: {
    page?: number;
    limit?: number;
    type?: 'income' | 'expense';
    categoryId?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Transaction>> {
    const response = await apiClient.get<PaginatedResponse<Transaction>>(
      '/transactions',
      { params }
    );
    return response.data;
  },

  async getTransaction(id: string): Promise<ApiResponse<{ transaction: Transaction }>> {
    const response = await apiClient.get<ApiResponse<{ transaction: Transaction }>>(
      `/transactions/${id}`
    );
    return response.data;
  },

  async createTransaction(
    data: CreateTransactionDto
  ): Promise<ApiResponse<{ transaction: Transaction }>> {
    const response = await apiClient.post<ApiResponse<{ transaction: Transaction }>>(
      '/transactions',
      data
    );
    return response.data;
  },

  async updateTransaction(
    id: string,
    data: Partial<CreateTransactionDto>
  ): Promise<ApiResponse<{ transaction: Transaction }>> {
    const response = await apiClient.put<ApiResponse<{ transaction: Transaction }>>(
      `/transactions/${id}`,
      data
    );
    return response.data;
  },

  async deleteTransaction(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(`/transactions/${id}`);
    return response.data;
  },

  async getStats(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<
    ApiResponse<{
      income: { total: number; count: number };
      expense: { total: number; count: number };
      balance: number;
    }>
  > {
    const response = await apiClient.get('/transactions/stats/summary', { params });
    return response.data as any;
  },
};
