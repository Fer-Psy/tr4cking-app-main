import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash } from "lucide-react";

interface Usuario {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Empresa {
  id_empresa: number;
  nombre: string;
}

interface Empleado {
  id_empleado: number;
  usuario?: number;
  empresa: number;
  fecha_contratacion: string;
  cargo: string;
}

const EMPLEADOS_API_URL = "http://127.0.0.1:8000/api/empleados/";
const USUARIOS_API_URL = "http://127.0.0.1:8000/api/users/";
const EMPRESAS_API_URL = "http://127.0.0.1:8000/api/empresas/";

const Empleados = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [formData, setFormData] = useState({
    usuario: null as number | null,
    empresa: null as number | null,
    fecha_contratacion: "",
    cargo: "",
  });
  const [empleadoEditando, setEmpleadoEditando] = useState<number | null>(null);

  useEffect(() => {
    fetchEmpleados();
    fetchUsuarios();
    fetchEmpresas();
  }, []);

  const fetchEmpleados = async () => {
    try {
      const response = await axios.get(EMPLEADOS_API_URL);
      if (Array.isArray(response.data)) {
        setEmpleados(response.data);
      } else {
        console.error('La respuesta no es un array:', response.data);
      }
    } catch (error) {
      console.error("Error al obtener empleados:", error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(USUARIOS_API_URL);
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const fetchEmpresas = async () => {
    try {
      const response = await axios.get(EMPRESAS_API_URL);
      setEmpresas(response.data);
    } catch (error) {
      console.error("Error al obtener empresas:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Enviando formData:', formData);

    try {
      let response;
      if (empleadoEditando) {
        response = await axios.put(`${EMPLEADOS_API_URL}${empleadoEditando}/`, formData);
      } else {
        response = await axios.post(EMPLEADOS_API_URL, formData);
      }
      
      console.log('Respuesta del servidor:', response.data);
      
      if (empleadoEditando) {
        setEmpleados(prevEmpleados => 
          prevEmpleados.map(empleado => 
            empleado.id_empleado === empleadoEditando ? response.data : empleado
          )
        );
      } else {
        setEmpleados(prevEmpleados => [...prevEmpleados, response.data]);
      }

      resetForm();
    } catch (error) {
      console.error("Error completo:", error);
      if (axios.isAxiosError(error)) {
        console.error("Datos del error:", error.response?.data);
      }
    }
  };

  const handleEdit = (empleado: Empleado) => {
    setFormData({
      usuario: empleado.usuario || null,
      empresa: empleado.empresa,
      fecha_contratacion: empleado.fecha_contratacion,
      cargo: empleado.cargo,
    });
    setEmpleadoEditando(empleado.id_empleado);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${EMPLEADOS_API_URL}${id}/`);
      fetchEmpleados();
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      usuario: null,
      empresa: null,
      fecha_contratacion: "",
      cargo: "",
    });
    setEmpleadoEditando(null);
  };

  return (
    <div className="p-2 dark:bg-gray-900 dark:text-white">
      <h2 className="text-xl font-bold text-blue-600 dark:text-white mb-4">
        Gestión de Empleados
      </h2>
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded shadow-md grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.usuario || ""}
          onChange={(e) => setFormData({ ...formData, usuario: e.target.value ? Number(e.target.value) : null })}
          required
        >
          <option value="">Seleccionar Usuario</option>
          {usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.first_name} {usuario.last_name} - {usuario.email}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.empresa || ""}
          onChange={(e) => setFormData({ ...formData, empresa: e.target.value ? Number(e.target.value) : null })}
          required
        >
          <option value="">Seleccionar Empresa</option>
          {empresas.map((empresa) => (
            <option key={empresa.id_empresa} value={empresa.id_empresa}>
              {empresa.nombre}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.fecha_contratacion}
          onChange={(e) => setFormData({ ...formData, fecha_contratacion: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Cargo"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.cargo}
          onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
          required
        />

        <div className="flex space-x-2 col-span-full">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {empleadoEditando ? "Actualizar" : "Agregar"}
          </button>
          {empleadoEditando && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="w-full overflow-x-auto py-4">
        <table className="table w-full border-collapse bg-white dark:bg-gray-800 shadow-md">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 dark:text-white">
              <th className="p-2">Usuario</th>
              <th className="p-2">Empresa</th>
              <th className="p-2">Fecha Contratación</th>
              <th className="p-2">Cargo</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado) => (
              <tr key={empleado.id_empleado} className="border-t dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="p-2">
                  {empleado.usuario ? 
                    (() => {
                      const usuarioEncontrado = usuarios.find(u => u.id === empleado.usuario);
                      return usuarioEncontrado ? 
                        `${usuarioEncontrado.first_name} ${usuarioEncontrado.last_name}` 
                        : "No encontrado";
                    })()
                    : "No asociado"}
                </td>
                <td className="p-2">
                  {empresas.find(e => e.id_empresa === empleado.empresa)?.nombre || "N/A"}
                </td>
                <td className="p-2">{empleado.fecha_contratacion}</td>
                <td className="p-2">{empleado.cargo}</td>
                <td className="p-2 flex space-x-2">
                  <button
                    className="btn btn-circle btn-text btn-sm text-yellow-500"
                    aria-label="Editar"
                    onClick={() => handleEdit(empleado)}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    className="btn btn-circle btn-text btn-sm text-red-500"
                    aria-label="Eliminar"
                    onClick={() => handleDelete(empleado.id_empleado)}
                  >
                    <Trash size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Empleados;