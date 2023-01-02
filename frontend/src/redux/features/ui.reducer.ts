// auth reducer
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface Message {
  text: string;
  type: 'error' | 'success' | 'info';
}
export interface UIState {
  loading: boolean;
  message?: Message;
}

const initialState: UIState = {
  loading: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    showMessage: (state, action: PayloadAction<Message>) => {
      state.message = action.payload;
    },
    hideMessage: (state) => {
      state.message = undefined;
    },
  },
});

export const { startLoading, stopLoading, showMessage, hideMessage } =
  uiSlice.actions;

export default uiSlice.reducer;
