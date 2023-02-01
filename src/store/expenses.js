import { createSlice } from "@reduxjs/toolkit";

const initialCounterState = { expenses: [] };

const expenseSlice = createSlice({
  name: "expense",
  initialState: initialCounterState,
  reducers: {
    setExpenses(state, action) {
      state.expenses = action.payload;
    },
  },
});

export const expensesActions = expenseSlice.actions;

export default expenseSlice.reducer;
