import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider, TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import allReducers from './Reducers/Index';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

//needed to save the large paint drawings
const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false,
  immutableCheck: false
})

const store = configureStore({ 
  reducer: allReducers,
  middleware: customizedMiddleware,
 })

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

root.render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
      <App />
    {/* </React.StrictMode> */}
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
