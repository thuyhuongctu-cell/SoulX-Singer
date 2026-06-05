import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import SoulXSinger from './SoulXSinger';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SoulXSinger />
  </StrictMode>,
);
