import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import customersReducer from './slices/customersSlice';
import billReducer from './slices/billSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customersReducer,
    bill: billReducer,
  },
});