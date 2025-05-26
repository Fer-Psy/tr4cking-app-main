import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash } from "lucide-react";

interface Localidad {
  id_localidad: number;
  nombre: string;
  coordenadas: number | null;
}

const LOCALIDADES_API_URL = "http://127.0.0.1:8000/api/localidades/";

const Localidades = () => {
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [formData, setFormData] = useState({
    nombre: "",
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
    
    const dataToSend = {
      ...formData,
      coordenadas: formData.coordenadas ? Number(formData.coordenadas) : null
    };

    try {
      if (localidadEditando) {
        await axios.put(`${LOCALIDADES_API_URL}${localidadEditando}/`, dataToSend);
      } else {
        await axios.post(LOCALIDADES_API_URL, dataToSend);
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
      coordenadas: localidad.coordenadas?.toString() || "",
    });
    setLocalidadEditando(localidad.id_localidad);
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
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded shadow-md space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Nombre de la Localidad
            <input
              type="text"
              className="mt-1 w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Coordenadas (opcional)
            <input
              type="number"
              step="any"
              className="mt-1 w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
              value={formData.coordenadas}
              onChange={(e) => setFormData({ ...formData, coordenadas: e.target.value })}
              placeholder="Ej: -25.2867"
            />
          </label>
        </div>

        <div className="flex space-x-2">
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {localidadEditando ? "Actualizar" : "Agregar"}
          </button>
          {localidadEditando && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Tabla */}
      <div className="w-full overflow-x-auto py-4">
        <table className="table w-full border-collapse bg-white dark:bg-gray-800 shadow-md">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="p-2">Nombre</th>
              <th className="p-2">Coordenadas</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {localidades.map((localidad) => (
              <tr 
                key={localidad.id_localidad}
                className="border-t dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="p-2">{localidad.nombre}</td>
                <td className="p-2">{localidad.coordenadas ?? "-"}</td>
                <td className="p-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(localidad)}
                    className="text-yellow-500 hover:text-yellow-600"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(localidad.id_localidad)}
                    className="text-red-500 hover:text-red-600"
                    title="Eliminar"
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