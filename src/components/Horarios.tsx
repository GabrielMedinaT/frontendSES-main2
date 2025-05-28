import { useState } from "react";
import Login from "./Login";
import Seleccion from "./Seleccion";
import "./Horarios.css";

export default function Horarios(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

const handleLogin = async (username: string, password: string): Promise<void> => {
  try {
const response = await fetch(import.meta.env.VITE_LOGIN_ENDPOINT, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ user: username, password }),
  credentials: "include", // si usas sesión
});



    if (response.ok) {
      setIsAuthenticated(true);
    } else {
      alert("Credenciales incorrectas");
    }
  } catch (error) {
    console.error("Error en la autenticación:", error);
    alert("No se pudo conectar con el servidor");
  }
};

  return (
    <div>
      {isAuthenticated ? <Seleccion /> : <Login onLogin={handleLogin} />}
    </div>
  );
}
