import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/i18n/index.ts';
import { configureApiClient } from '@/helpers/configureApiClient.ts';
import App from './App.tsx';
import './index.css';

configureApiClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
