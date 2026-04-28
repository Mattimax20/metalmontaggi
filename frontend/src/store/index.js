import { configureStore } from '@reduxjs/toolkit'
import { strapiApi } from './api/strapiApi'
import contactReducer from './slices/contactSlice'

export const store = configureStore({
  reducer: {
    [strapiApi.reducerPath]: strapiApi.reducer,
    contact: contactReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(strapiApi.middleware),
  devTools: import.meta.env.DEV,
})
