import './index.css';

import Home from './component/Home';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Home />
  </StrictMode>
);
