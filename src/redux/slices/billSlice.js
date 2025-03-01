import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  client: '',
  number: '',
  year: new Date().getFullYear().toString(),
  status: 'Draft',
  note: '',
  date: '',
  expireDate: '',
  currency: 'USD', // Default currency
  exchangeRate: 75, // Default exchange rate (1 USD = 75 INR)
  items: [
    {
      id: 1,
      item: '',
      description: '',
      quantity: 1,
      price: 0,
      total: 0,
    },
  ],
  subTotal: 0,
  taxRate: 19,
  taxAmount: 0,
  total: 0,
  showSuccessModal: false,
};

const billSlice = createSlice({
  name: 'bill',
  initialState,
  reducers: {
    setBillField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    addItem: (state) => {
      const newItem = {
        id: state.items.length + 1,
        item: '',
        description: '',
        quantity: 1,
        price: 0,
        total: 0,
      };
      state.items.push(newItem);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateItem: (state, action) => {
      const { id, field, value } = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === id);
      
      if (itemIndex !== -1) {
        state.items[itemIndex][field] = value;
        
        // Update the total for this item
        if (field === 'quantity' || field === 'price') {
          const item = state.items[itemIndex];
          state.items[itemIndex].total = item.quantity * item.price;
        }
      }
      
      // Recalculate subtotal, tax and total
      state.subTotal = state.items.reduce((sum, item) => sum + item.total, 0);
      state.taxAmount = (state.subTotal * state.taxRate) / 100;
      state.total = state.subTotal + state.taxAmount;
    },
    calculateTotals: (state) => {
      state.subTotal = state.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      state.taxAmount = (state.subTotal * state.taxRate) / 100;
      state.total = state.subTotal + state.taxAmount;
    },
    resetBill: (state) => {
      return {
        ...initialState,
        year: new Date().getFullYear().toString(), // Preserve current year
        exchangeRate: state.exchangeRate, // Preserve current exchange rate
      };
    },
    setShowSuccessModal: (state, action) => {
      state.showSuccessModal = action.payload;
    },
    setCurrency: (state, action) => {
      const newCurrency = action.payload;
      const oldCurrency = state.currency;
      
      if (newCurrency !== oldCurrency) {
        state.currency = newCurrency;
        
        // Convert all prices based on the currency change
        if (newCurrency === 'INR' && oldCurrency === 'USD') {
          // Convert from USD to INR
          state.items = state.items.map(item => ({
            ...item,
            price: parseFloat((item.price * state.exchangeRate).toFixed(2)),
            total: parseFloat((item.quantity * item.price * state.exchangeRate).toFixed(2))
          }));
        } else if (newCurrency === 'USD' && oldCurrency === 'INR') {
          // Convert from INR to USD
          state.items = state.items.map(item => ({
            ...item,
            price: parseFloat((item.price / state.exchangeRate).toFixed(2)),
            total: parseFloat((item.quantity * item.price / state.exchangeRate).toFixed(2))
          }));
        }
        
        // Recalculate totals after currency conversion
        state.subTotal = state.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        state.taxAmount = (state.subTotal * state.taxRate) / 100;
        state.total = state.subTotal + state.taxAmount;
      }
    },
    setExchangeRate: (state, action) => {
      state.exchangeRate = action.payload;
    },
  },
});

export const { 
  setBillField, 
  addItem, 
  removeItem, 
  updateItem, 
  calculateTotals, 
  resetBill,
  setShowSuccessModal,
  setCurrency,
  setExchangeRate
} = billSlice.actions;

export default billSlice.reducer;