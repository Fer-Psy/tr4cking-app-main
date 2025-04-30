import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpiar errores
  
    try {
      const response = await axios.post("http://localhost:8000/api/", {
        username,
        password,
      });
  
      const { access, refresh, rol } = response.data;
  
      // Verificar si los datos están correctos
      if (access && refresh && rol) {
        // Guardar los tokens y el rol en localStorage
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user_role', rol);
  
        // Redirigir según el rol
        if (rol === "Administrador") {
          navigate("/admin");
        } else if (rol === "Empleado") {
          navigate("/empleado");
        } else {
          navigate("/cliente");
        }
      } else {
        throw new Error("Error en la autenticación");
      }
    } catch (error) {
      setError("Credenciales incorrectas");
    }
  };
  
  

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-blue-800">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-center text-xl font-bold text-blue-600 mb-4">INICIAR SESIÓN</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            className="w-full border p-2 rounded mb-4"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="w-full border p-2 rounded mb-4"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-500"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
