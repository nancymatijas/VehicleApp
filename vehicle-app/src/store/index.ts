import { configureStore } from '@reduxjs/toolkit';
import { vehicleApi } from '../api/vehicleApi';

export const store = configureStore({
  reducer: {
    [vehicleApi.reducerPath]: vehicleApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(vehicleApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
