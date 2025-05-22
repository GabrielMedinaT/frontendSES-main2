import { useState } from "react";
import Login from "./Login";
import Seleccion from "./Seleccion";
import "./Horarios.css";

export default function Horarios() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleLogin = (username: string, password: string): void => {
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
