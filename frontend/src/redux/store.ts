import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import authReducer from './features/auth.reducer';
import currencyReducer from './features/currency.reducer';
import uiReducer from './features/ui.reducer';

const persistConfig = {
  key: 'root',
  storage,
};

// persist state: const persistedReducer = persistReducer(persistConfig, userReducer)

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedCurrencyReducer = persistReducer(persistConfig, currencyReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    currency: persistedCurrencyReducer,
    ui: uiReducer,
  },
  middleware: [thunk],
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
