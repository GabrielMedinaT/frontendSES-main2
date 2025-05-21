import { useState } from "react";

export default function Manyana() {
  const [encendido, setEncendido] = useState("");
  const [apagado, setApagado] = useState("");
  const [error, setError] = useState("");
  const [kioskoSeleccionado, setKioskoSeleccionado] = useState("default");
  const [horarioActual, setHorarioActual] = useState(null);

  const idMap = {
    kiosko1: 1,
    kiosko2: 3,
    kiosko3: 5,
  };

  const compararHoras = (h1, h2) => {
    const [h1h, h1m] = h1.split(":").map(Number);
    const [h2h, h2m] = h2.split(":").map(Number);
    return h1h * 60 + h1m - (h2h * 60 + h2m);
  };

  const cargarHorario = (kiosko) => {
    const id = idMap[kiosko];
    fetch(`http://2.139.196.172:3306/api/powers/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener horario");
        return res.json();
      })
      .then((data) => {
        setHorarioActual(data);
        setEncendido(data.startTime);
        setApagado(data.endTime);
      })
      .catch((err) => {
        console.error(err);
        setHorarioActual(null);
      });
  };

  const handleGuardar = () => {
    setError("");

    if (!encendido || !apagado) {
      setError("Selecciona ambas horas.");
      return;
    }

    const minHora = "07:45";
    const maxHora = "14:15";

    if (encendido < minHora) {
      setError("La hora mínima de encendido es 07:45.");
      return;
    }

    if (apagado > maxHora) {
      setError("La hora máxima de apagado es 14:15.");
      return;
    }

    const diff = compararHoras(encendido, apagado);

    if (diff === 0) {
      setError("La hora de encendido y apagado no pueden ser iguales.");
      return;
    }

    if (diff > 0) {
      setError("La hora de encendido no puede ser posterior a la de apagado.");
      return;
    }

    if (kioskoSeleccionado === "default") {
      setError("Selecciona un kiosko.");
      return;
    }

    const id = idMap[kioskoSeleccionado];

    fetch(`http://2.139.196.172:3306/api/powers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        device: kioskoSeleccionado,
        startTime: encendido,
        endTime: apagado,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al guardar");
        return res.json();
      })
      .then((data) => {
        alert(
          `Horario actualizado:\nEncendido: ${data.startTime}\nApagado: ${data.endTime}`
        );
        setHorarioActual(data);
      })
      .catch((err) => {
        setError("Error al guardar los datos en el servidor.");
        console.error(err);
      });
  };

  const handleSeleccion = (e) => {
    const kiosko = e.target.value;
    setKioskoSeleccionado(kiosko);
    if (kiosko !== "default") {
      cargarHorario(kiosko);
    } else {
      setHorarioActual(null);
    }
  };

  return (
    <div>
      <div className="kioskos">
        <h1>Mañana</h1>
        <select
          className="selectKiosko"
          name="kiosko"
          onChange={handleSeleccion}
        >
          <option value="default">Seleccione kiosko</option>
          <option value="kiosko1">Kiosko edificio principal</option>
          <option value="kiosko2">Ni idea de donde está</option>
          <option value="kiosko3">Vete a saber donde mierdas está</option>
        </select>
        <div className="horarios">
          <input
            className="timeInput"
            type="time"
            value={encendido}
            onChange={(e) => setEncendido(e.target.value)}
            min="07:45"
            max="14:15"
          />
          <input
            className="timeInput"
            type="time"
            value={apagado}
            onChange={(e) => setApagado(e.target.value)}
            min="07:45"
            max="14:15"
          />
        </div>
        <button onClick={handleGuardar}>Guardar</button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {horarioActual && (
        <div style={{ marginTop: "20px" }}>
          <h3>Horario actual</h3>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Dispositivo</th>
                <th>Hora encendido</th>
                <th>Hora apagado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{horarioActual.device}</td>
                <td>{horarioActual.startTime}</td>
                <td>{horarioActual.endTime}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
