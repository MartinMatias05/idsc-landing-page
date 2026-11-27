import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/tokens.css';
import './styles/base.css';
import './styles/header.css';
import './styles/home.css';
import './styles/footer.css';
import './styles/figma-home-three-sections-v2.css';
import './styles/idsc-motion-restart.css';

import './styles/nav-and-post-animations.css';
import './styles/hero-underline-sequence.css';
import './lib/hero-underline-sequence.js';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
