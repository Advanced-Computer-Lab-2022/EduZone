import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import CurrencyData from './../../assets/country_currency.json';
export interface CurrencyState {
  country?: string;
  currency: string;
  conversion_rate: number;
}

const intialState: CurrencyState = {
  country: 'United States',
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
      state.country = findCountryByCurrency(action.payload.currency)?.country;
    },
  },
});

const findCountryByCurrency = (currency: string) => {
  const country = CurrencyData.find((item) => item.code === currency);
  return country;
};

export const { setCurrency } = currencySlice.actions;

export default currencySlice.reducer;
