// code referenced from https://github.com/wass08/r3f-playroom-multiplayer-shooter-game/blob/main/src/main.jsx

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
