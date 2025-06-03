import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import App from './App.tsx'; // app de consumo (la principal)
import HorariosApp from './components/Horarios.tsx'; // app de login/selección
import Kiosko01 from './components/Kiosko01.tsx'; // app de kiosko 01
import Kiosko02 from './components/Kiosko02.tsx'; // app de kiosko 02
import Kiosko03 from './components/Kiosko03.tsx'; // app de kiosko 03

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/horarios" element={<HorariosApp />} />
      <Route path="/kiosko01" element={<Kiosko01/>}/>
      <Route path="/kiosko02" element={<Kiosko02/>}/>
      <Route path="/kiosko03" element={<Kiosko03/>}/>
      //ruta 404
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  </BrowserRouter>
);
