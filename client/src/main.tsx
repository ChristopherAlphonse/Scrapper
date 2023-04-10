import './index.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { StrictMode } from 'react';

import { AnimatePresence } from 'framer-motion';
import App from './App';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  </StrictMode>
);
