import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash } from "lucide-react";

interface Empresa {
  id_empresa: number;
  nombre: string;
  ruc: string;
  telefono?: string;
  email?: string;
  direccion_legal?: string;
}

const EMPRESAS_API_URL = "http://127.0.0.1:8000/api/empresas/";

const Empresas = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [formData, setFormData] = useState({
    nombre: "",
    ruc: "",
    telefono: "",
    email: "",
    direccion_legal: "",
  });
  const [empresaEditando, setEmpresaEditando] = useState<number | null>(null);

  // Obtener empresas al cargar la página
  useEffect(() => {
    fetchEmpresas();
  }, []);

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

    try {
      let response;
      if (empresaEditando) {
        response = await axios.put(`${EMPRESAS_API_URL}${empresaEditando}/`, formData);
      } else {
        response = await axios.post(EMPRESAS_API_URL, formData);
      }
      
      console.log('Respuesta:', response.data);
      fetchEmpresas();
      resetForm();
    } catch (error) {
      console.error("Error al guardar empresa:", error);
    }
  };

  const handleEdit = (empresa: Empresa) => {
    setFormData({
      nombre: empresa.nombre,
      ruc: empresa.ruc,
      telefono: empresa.telefono || "",
      email: empresa.email || "",
      direccion_legal: empresa.direccion_legal || "",
    });
    setEmpresaEditando(empresa.id_empresa);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${EMPRESAS_API_URL}${id}/`);
      fetchEmpresas();
    } catch (error) {
      console.error("Error al eliminar empresa:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      ruc: "",
      telefono: "",
      email: "",
      direccion_legal: "",
    });
    setEmpresaEditando(null);
  };

  return (
    <div className="p-2 dark:bg-gray-900 dark:text-white">
      <h2 className="text-xl font-bold text-blue-600 dark:text-white mb-4">
        Gestión de Empresas
      </h2>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded shadow-md grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nombre"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
        />
        
        <input
          type="text"
          placeholder="RUC"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.ruc}
          onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Teléfono"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.telefono}
          onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <textarea
          placeholder="Dirección Legal"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 col-span-2"
          value={formData.direccion_legal}
          onChange={(e) => setFormData({ ...formData, direccion_legal: e.target.value })}
        />

        <div className="flex space-x-2 col-span-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {empresaEditando ? "Actualizar" : "Agregar"}
          </button>
          {empresaEditando && (
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
              <th className="p-2">Nombre</th>
              <th className="p-2">RUC</th>
              <th className="p-2">Teléfono</th>
              <th className="p-2">Email</th>
              <th className="p-2">Dirección Legal</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((empresa) => (
              <tr
                key={empresa.id_empresa}
                className="border-t dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="p-2">{empresa.nombre}</td>
                <td className="p-2">{empresa.ruc}</td>
                <td className="p-2">{empresa.telefono || "-"}</td>
                <td className="p-2">{empresa.email || "-"}</td>
                <td className="p-2">{empresa.direccion_legal || "-"}</td>
                <td className="p-2 flex space-x-2">
                  <button
                    className="btn btn-circle btn-text btn-sm text-yellow-500"
                    aria-label="Editar"
                    onClick={() => handleEdit(empresa)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="btn btn-circle btn-text btn-sm text-red-500"
                    aria-label="Eliminar"
                    onClick={() => handleDelete(empresa.id_empresa)}
                  >
                    <Trash size={16} />
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

export default Empresas;