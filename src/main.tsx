import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import App from './App.tsx'; // app de consumo (la principal)
import HorariosApp from './components/Horarios.tsx'; // app de login/selección

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/horarios" element={<HorariosApp />} />
    </Routes>
  </BrowserRouter>
);
