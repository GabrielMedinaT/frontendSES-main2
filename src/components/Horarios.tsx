import React, { useState } from "react";
import Login from "./Login";
import Seleccion from "./Seleccion"; // el componente que quieres mostrar tras login
import "./Horarios.css";

export default function Horarios() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (username, password) => {
    if (username === "admin" && password === "1234") {
      setIsAuthenticated(true);
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div>
      {isAuthenticated ? <Seleccion /> : <Login onLogin={handleLogin} />}
    </div>
  );
}
