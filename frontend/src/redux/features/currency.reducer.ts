import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CurrencyState {
  currency: string;
  conversion_rate: number;
}

const intialState: CurrencyState = {
  currency: 'USD',
  conversion_rate: 1,
};

export const currencySlice = createSlice({
  name: 'currency',
  initialState: intialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<CurrencyState>) => {
      state.currency = action.payload.currency;
      state.conversion_rate = action.payload.conversion_rate;
    },
  },
});

export const { setCurrency } = currencySlice.actions;

export default currencySlice.reducer;
