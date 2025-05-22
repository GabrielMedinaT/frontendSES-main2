import { useState } from 'react';
import Manyana from './Manyana';
import Tarde from './Tarde';

export default function Seleccion() {
  const [turno, setTurno] = useState<"manana" | "tarde" | null>(null);

  return (
    <div className="principal">
      <h1>Elije el turno 😡</h1>
      <div className="turno">
        <button onClick={() => setTurno("manana")}>Mañana</button>
        <button onClick={() => setTurno("tarde")}>Tarde</button>
      </div>

      <div className="contenido">
        {turno === "manana" && <Manyana />}
        {turno === "tarde" && <Tarde />}
      </div>
    </div>
  );
}
