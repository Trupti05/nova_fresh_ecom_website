import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducer/index.js'

const store = configureStore({
  reducer: rootReducer,
})

createRoot(document.getElementById('root')).render(
  // <StrictMode >
  <Provider store={store}>
    <App />
  </Provider>
  // </StrictMode>,
)
