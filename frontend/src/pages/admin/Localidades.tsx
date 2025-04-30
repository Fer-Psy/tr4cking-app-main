import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash } from "lucide-react";
import { Localidad } from "../../shared/shared.types";

const LOCALIDADES_API_URL = "http://127.0.0.1:8000/api/localidades/";

const Localidades = () => {
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [formData, setFormData] = useState<Omit<Localidad, "id">>({
    nombre: "",
    tipo: "ciudad",
    es_terminal: false,
    coordenadas: "",
  });
  const [localidadEditando, setLocalidadEditando] = useState<number | null>(null);

  useEffect(() => {
    fetchLocalidades();
  }, []);

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
      if (localidadEditando) {
        await axios.put(`${LOCALIDADES_API_URL}${localidadEditando}/`, formData);
      } else {
        await axios.post(LOCALIDADES_API_URL, formData);
      }

      fetchLocalidades();
      resetForm();
    } catch (error) {
      console.error("Error al guardar localidad:", error);
    }
  };

  const handleEdit = (localidad: Localidad) => {
    setFormData({
      nombre: localidad.nombre,
      tipo: localidad.tipo,
      es_terminal: localidad.es_terminal,
      coordenadas: localidad.coordenadas,
    });
    setLocalidadEditando(localidad.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${LOCALIDADES_API_URL}${id}/`);
      fetchLocalidades();
    } catch (error) {
      console.error("Error al eliminar localidad:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      tipo: "ciudad",
      es_terminal: false,
      coordenadas: "",
    });
    setLocalidadEditando(null);
  };

  return (
    <div className="p-2 dark:bg-gray-900 dark:text-white">
      <h2 className="text-xl font-bold text-blue-600 dark:text-white mb-4">
        Gestión de Localidades
      </h2>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-4 rounded shadow-md grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          placeholder="Nombre"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
        />
        <select
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.tipo}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value as Localidad["tipo"] })}
        >
          <option value="ciudad">Ciudad</option>
          <option value="pueblo">Pueblo</option>
          <option value="parada">Parada Rural</option>
        </select>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.es_terminal}
            onChange={(e) => setFormData({ ...formData, es_terminal: e.target.checked })}
          />
          <span>Es terminal</span>
        </label>
        <input
          type="text"
          placeholder="Coordenadas"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.coordenadas}
          onChange={(e) => setFormData({ ...formData, coordenadas: e.target.value })}
        />
        <div className="flex space-x-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            {localidadEditando ? "Actualizar" : "Agregar"}
          </button>
          {localidadEditando && (
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

      {/* Tabla de Localidades */}
      <div className="w-full overflow-x-auto py-4">
        <table className="table w-full border-collapse bg-white dark:bg-gray-800 shadow-md">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 dark:text-white">
              <th className="p-2">Nombre</th>
              <th className="p-2">Tipo</th>
              <th className="p-2">Es Terminal</th>
              <th className="p-2">Coordenadas</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {localidades.map((localidad) => (
              <tr
                key={localidad.id}
                className="row-hover border-t dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="p-2">{localidad.nombre}</td>
                <td className="p-2">{localidad.tipo}</td>
                <td className="p-2">{localidad.es_terminal ? "Sí" : "No"}</td>
                <td className="p-2">{localidad.coordenadas}</td>
                <td className="p-2 flex space-x-2">
                  <button
                    className="btn btn-circle btn-text btn-sm text-yellow-500"
                    aria-label="Editar"
                    onClick={() => handleEdit(localidad)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="btn btn-circle btn-text btn-sm text-red-500"
                    aria-label="Eliminar"
                    onClick={() => handleDelete(localidad.id)}
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

export default Localidades;