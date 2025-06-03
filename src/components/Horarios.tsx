import { useState } from "react";
import Login from "./Login";
import Seleccion from "./Seleccion";
import "./Horarios.css";

export default function Horarios(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

const handleLogin = async (username: string, password: string): Promise<void> => {// para manejar el inicio de sesión
  try {
const response = await fetch(import.meta.env.VITE_LOGIN_ENDPOINT, {// endpoint de autenticación
  method: "POST",// metodo POST para enviar las credenciales
  headers: {
    "Content-Type": "application/json",// tipo de contenido JSON
  },
  body: JSON.stringify({ user: username, password }),// convierte las credenciales a JSON
  credentials: "include", // si usas sesión
});



    if (response.ok) {//si todo sale bien
      setIsAuthenticated(true);// actualiza el estado de autenticación
    } else {//si no, y hay error
      alert("Credenciales incorrectas");// muestra alerta de error
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
