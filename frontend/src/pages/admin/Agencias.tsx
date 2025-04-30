import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash } from "lucide-react";
import { Agencia, Empresa, Localidad } from "../../shared/shared.types";

const AGENCIAS_API_URL = "http://127.0.0.1:8000/api/agencias/";
const EMPRESAS_API_URL = "http://127.0.0.1:8000/api/empresas/";
const LOCALIDADES_API_URL = "http://127.0.0.1:8000/api/localidades/";

const Agencias = () => {
  const [agencias, setAgencias] = useState<Agencia[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [formData, setFormData] = useState<Omit<Agencia, "id">>({
    empresa: 0,
    localidad: 0,
    nombre: "",
    telefono: "",
    es_principal: false,
  });
  const [agenciaEditando, setAgenciaEditando] = useState<number | null>(null);

  useEffect(() => {
    fetchAgencias();
    fetchEmpresas();
    fetchLocalidades();
  }, []);

  const fetchAgencias = async () => {
    try {
      const response = await axios.get(AGENCIAS_API_URL);
      setAgencias(response.data);
    } catch (error) {
      console.error("Error al obtener agencias:", error);
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

  const fetchLocalidades = async () => {
    try {
      const response = await axios.get(LOCALIDADES_API_URL);
      setLocalidades(response.data);
    } catch (error) {
      console.error("Error al obtener localidades:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (agenciaEditando) {
        await axios.put(`${AGENCIAS_API_URL}${agenciaEditando}/`, formData);
      } else {
        await axios.post(AGENCIAS_API_URL, formData);
      }

      fetchAgencias();
      resetForm();
    } catch (error) {
      console.error("Error al guardar agencia:", error);
    }
  };

  const handleEdit = (agencia: Agencia) => {
    setFormData({
      empresa: agencia.empresa,
      localidad: agencia.localidad,
      nombre: agencia.nombre,
      telefono: agencia.telefono,
      es_principal: agencia.es_principal,
    });
    setAgenciaEditando(agencia.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${AGENCIAS_API_URL}${id}/`);
      fetchAgencias();
    } catch (error) {
      console.error("Error al eliminar agencia:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      empresa: 0,
      localidad: 0,
      nombre: "",
      telefono: "",
      es_principal: false,
    });
    setAgenciaEditando(null);
  };

  return (
    <div className="p-2 dark:bg-gray-900 dark:text-white">
      <h2 className="text-xl font-bold text-blue-600 dark:text-white mb-4">
        Gestión de Agencias
      </h2>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-4 rounded shadow-md grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <select
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.empresa}
          onChange={(e) => setFormData({ ...formData, empresa: Number(e.target.value) })}
          required
        >
          <option value="">Seleccionar Empresa</option>
          {empresas.map((empresa) => (
            <option key={empresa.id} value={empresa.id}>
              {empresa.nombre}
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.localidad}
          onChange={(e) => setFormData({ ...formData, localidad: Number(e.target.value) })}
          required
        >
          <option value="">Seleccionar Localidad</option>
          {localidades.map((localidad) => (
            <option key={localidad.id} value={localidad.id}>
              {localidad.nombre}
            </option>
          ))}
        </select>
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
          placeholder="Teléfono"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.telefono}
          onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.es_principal}
            onChange={(e) => setFormData({ ...formData, es_principal: e.target.checked })}
          />
          <span>Es Principal</span>
        </label>
        <div className="flex space-x-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            {agenciaEditando ? "Actualizar" : "Agregar"}
          </button>
          {agenciaEditando && (
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

      {/* Tabla de Agencias */}
      <div className="w-full overflow-x-auto py-4">
        <table className="table w-full border-collapse bg-white dark:bg-gray-800 shadow-md">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 dark:text-white">
              <th className="p-2">Empresa</th>
              <th className="p-2">Localidad</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Teléfono</th>
              <th className="p-2">Es Principal</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {agencias.map((agencia) => (
              <tr
                key={agencia.id}
                className="row-hover border-t dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="p-2">{empresas.find((e) => e.id === agencia.empresa)?.nombre || "N/A"}</td>
                <td className="p-2">{localidades.find((l) => l.id === agencia.localidad)?.nombre || "N/A"}</td>
                <td className="p-2">{agencia.nombre}</td>
                <td className="p-2">{agencia.telefono}</td>
                <td className="p-2">{agencia.es_principal ? "Sí" : "No"}</td>
                <td className="p-2 flex space-x-2">
                  <button
                    className="btn btn-circle btn-text btn-sm text-yellow-500"
                    aria-label="Editar"
                    onClick={() => handleEdit(agencia)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="btn btn-circle btn-text btn-sm text-red-500"
                    aria-label="Eliminar"
                    onClick={() => handleDelete(agencia.id)}
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

export default Agencias;