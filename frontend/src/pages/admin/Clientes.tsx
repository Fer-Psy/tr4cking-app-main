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

interface Cliente {
  id_cliente: number;
  usuario?: number; // Cambiado de id_usuario a usuario (el ID)
  usuario_data?: Usuario; // El objeto usuario completo que viene del backend
  ruc: string;
  dv?: string;
  razon_social: string;
  telefono: string;
  direccion: string;
  fecha_registro: string;
}

const CLIENTES_API_URL = "http://127.0.0.1:8000/api/clientes/";
const USUARIOS_API_URL = "http://127.0.0.1:8000/api/users/"; // Añadir esta constante

const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]); // Añadir este estado
  const [formData, setFormData] = useState({
    ruc: "",
    dv: "",
    razon_social: "",
    telefono: "",
    direccion: "",
    usuario: null as number | null, // Cambiado de id_usuario a usuario
  });
  const [clienteEditando, setClienteEditando] = useState<number | null>(null);

  useEffect(() => {
    fetchClientes();
    fetchUsuarios(); // Añadir esta llamada
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await axios.get(CLIENTES_API_URL);
      console.log('Datos crudos de clientes:', response.data); // Debug
      
      // Validar que la respuesta tenga el formato esperado
      if (Array.isArray(response.data)) {
        setClientes(response.data);
      } else {
        console.error('La respuesta no es un array:', response.data);
      }
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  // Añadir esta función
  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(USUARIOS_API_URL);
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Enviando formData:', formData); // Debug

    try {
      let response;
      if (clienteEditando) {
        response = await axios.put(`${CLIENTES_API_URL}${clienteEditando}/`, formData);
      } else {
        response = await axios.post(CLIENTES_API_URL, formData);
      }
      
      console.log('Respuesta del servidor:', response.data); // Debug
      
      // Actualizar el estado directamente con la respuesta
      if (clienteEditando) {
        setClientes(prevClientes => 
          prevClientes.map(cliente => 
            cliente.id_cliente === clienteEditando ? response.data : cliente
          )
        );
      } else {
        setClientes(prevClientes => [...prevClientes, response.data]);
      }

      resetForm();
    } catch (error) {
      console.error("Error completo:", error);
      if (axios.isAxiosError(error)) {
        console.error("Datos del error:", error.response?.data);
      }
    }
  };

  const handleEdit = (cliente: Cliente) => {
    console.log('Cliente a editar:', cliente); // Debug
    setFormData({
      ruc: cliente.ruc,
      dv: cliente.dv || "",
      razon_social: cliente.razon_social,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      usuario: cliente.usuario || null,
    });
    setClienteEditando(cliente.id_cliente);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${CLIENTES_API_URL}${id}/`);
      fetchClientes();
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      ruc: "",
      dv: "",
      razon_social: "",
      telefono: "",
      direccion: "",
      usuario: null, // Cambiado de id_usuario a usuario
    });
    setClienteEditando(null);
  };

  return (
    <div className="p-2 dark:bg-gray-900 dark:text-white">
      <h2 className="text-xl font-bold text-blue-600 dark:text-white mb-4">
        Gestión de Clientes
      </h2>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded shadow-md grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.usuario || ""}
          onChange={(e) => setFormData({ ...formData, usuario: e.target.value ? Number(e.target.value) : null })}
        >
          <option value="">Usuario asociado (opcional)</option>
          {usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.first_name} {usuario.last_name} - {usuario.email}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="RUC/CI"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.ruc}
          onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="DV (opcional)"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.dv}
          onChange={(e) => setFormData({ ...formData, dv: e.target.value })}
        />

        <input
          type="text"
          placeholder="Razón Social"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.razon_social}
          onChange={(e) => setFormData({ ...formData, razon_social: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Teléfono"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.telefono}
          onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Dirección"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.direccion}
          onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
          required
        />

        <div className="flex space-x-2 col-span-full">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {clienteEditando ? "Actualizar" : "Agregar"}
          </button>
          {clienteEditando && (
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
              <th className="p-2">RUC/CI</th>
              <th className="p-2">DV</th>
              <th className="p-2">Razón Social</th>
              <th className="p-2">Teléfono</th>
              <th className="p-2">Dirección</th>
              <th className="p-2">Usuario</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id_cliente} className="border-t dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="p-2">{cliente.ruc}</td>
                <td className="p-2">{cliente.dv || "-"}</td>
                <td className="p-2">{cliente.razon_social}</td>
                <td className="p-2">{cliente.telefono}</td>
                <td className="p-2">{cliente.direccion}</td>
                <td className="p-2">
                  {cliente.usuario ? 
                    (() => {
                      const usuarioEncontrado = usuarios.find(u => u.id === cliente.usuario);
                      return usuarioEncontrado ? 
                        `${usuarioEncontrado.first_name} ${usuarioEncontrado.last_name}` 
                        : "No encontrado";
                    })()
                    : "No asociado"}
                </td>
                <td className="p-2 flex space-x-2">
                  <button
                    className="btn btn-circle btn-text btn-sm text-yellow-500"
                    aria-label="Editar"
                    onClick={() => handleEdit(cliente)}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    className="btn btn-circle btn-text btn-sm text-red-500"
                    aria-label="Eliminar"
                    onClick={() => handleDelete(cliente.id_cliente)}
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

export default Clientes;
