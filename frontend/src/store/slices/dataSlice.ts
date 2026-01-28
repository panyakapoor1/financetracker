import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, Budget } from '../../types';

interface DataState {
  categories: Category[];
  budgets: Budget[];
  loading: boolean;
}

const initialState: DataState = {
  categories: [],
  budgets: [],
  loading: false,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      state.loading = false;
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex((c) => c._id === action.payload._id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter((c) => c._id !== action.payload);
    },
    setBudgets: (state, action: PayloadAction<Budget[]>) => {
      state.budgets = action.payload;
      state.loading = false;
    },
    addBudget: (state, action: PayloadAction<Budget>) => {
      state.budgets.push(action.payload);
    },
    updateBudget: (state, action: PayloadAction<Budget>) => {
      const index = state.budgets.findIndex((b) => b._id === action.payload._id);
      if (index !== -1) {
        state.budgets[index] = action.payload;
      }
    },
    removeBudget: (state, action: PayloadAction<string>) => {
      state.budgets = state.budgets.filter((b) => b._id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setCategories,
  addCategory,
  updateCategory,
  removeCategory,
  setBudgets,
  addBudget,
  updateBudget,
  removeBudget,
  setLoading,
} = dataSlice.actions;
export default dataSlice.reducer;
