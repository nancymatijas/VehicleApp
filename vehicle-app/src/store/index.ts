import { configureStore } from '@reduxjs/toolkit';
import { vehicleMakeApi } from '../api/vehicleMakeApi';
import { vehicleModelApi } from '../api/vehicleModelApi';

export const store = configureStore({
  reducer: {
    [vehicleMakeApi.reducerPath]: vehicleMakeApi.reducer,
    [vehicleModelApi.reducerPath]: vehicleModelApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(vehicleMakeApi.middleware)
      .concat(vehicleModelApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
