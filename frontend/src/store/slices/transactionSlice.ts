import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction, Category } from '../../types';

interface TransactionState {
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: TransactionState = {
  transactions: [],
  selectedTransaction: null,
  loading: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactions: (
      state,
      action: PayloadAction<{
        transactions: Transaction[];
        pagination: typeof initialState.pagination;
      }>
    ) => {
      state.transactions = action.payload.transactions;
      state.pagination = action.payload.pagination;
      state.loading = false;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
      state.pagination.total += 1;
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex((t) => t._id === action.payload._id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
      if (state.selectedTransaction?._id === action.payload._id) {
        state.selectedTransaction = action.payload;
      }
    },
    removeTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter((t) => t._id !== action.payload);
      state.pagination.total -= 1;
      if (state.selectedTransaction?._id === action.payload) {
        state.selectedTransaction = null;
      }
    },
    setSelectedTransaction: (state, action: PayloadAction<Transaction | null>) => {
      state.selectedTransaction = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setTransactions,
  addTransaction,
  updateTransaction,
  removeTransaction,
  setSelectedTransaction,
  setLoading,
} = transactionSlice.actions;
export default transactionSlice.reducer;
