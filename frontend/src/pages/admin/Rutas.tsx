import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash } from "lucide-react";
import { Ruta, Localidad } from "../../shared/shared.types";

const RUTAS_API_URL = "http://127.0.0.1:8000/api/rutas/";
const LOCALIDADES_API_URL = "http://127.0.0.1:8000/api/localidades/";

const Rutas = () => {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [formData, setFormData] = useState<Omit<Ruta, "id" | "fecha_actualizacion">>({
    origen: null,
    destino: null,
    codigo: "",
    duracion_estimada: "",
    distancia_km: 0,
    precio_base: 0,
    activo: true,
  });
  const [rutaEditando, setRutaEditando] = useState<number | null>(null);

  useEffect(() => {
    fetchRutas();
    fetchLocalidades();
  }, []);

  const fetchRutas = async () => {
    try {
      const response = await axios.get(RUTAS_API_URL);
      setRutas(response.data);
    } catch (error) {
      console.error("Error al obtener rutas:", error);
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
      if (rutaEditando) {
        await axios.put(`${RUTAS_API_URL}${rutaEditando}/`, formData);
      } else {
        await axios.post(RUTAS_API_URL, formData);
      }

      fetchRutas();
      resetForm();
    } catch (error) {
      console.error("Error al guardar ruta:", error);
    }
  };

  const handleEdit = (ruta: Ruta) => {
    setFormData({
      origen: ruta.origen,
      destino: ruta.destino,
      codigo: ruta.codigo,
      duracion_estimada: ruta.duracion_estimada,
      distancia_km: ruta.distancia_km,
      precio_base: ruta.precio_base,
      activo: ruta.activo,
    });
    setRutaEditando(ruta.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${RUTAS_API_URL}${id}/`);
      fetchRutas();
    } catch (error) {
      console.error("Error al eliminar ruta:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      origen: 0,
      destino: 0,
      codigo: "",
      duracion_estimada: "",
      distancia_km: 0,
      precio_base: 0,
      activo: true,
    });
    setRutaEditando(null);
  };

  return (
    <div className="p-2 dark:bg-gray-900 dark:text-white">
      <h2 className="text-xl font-bold text-blue-600 dark:text-white mb-4">
        Gestión de Rutas
      </h2>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-4 rounded shadow-md grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <select
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.origen ?? ""}
          onChange={(e) => setFormData({ ...formData, origen: Number(e.target.value) })}
          required
        >
          <option value="">Seleccionar Origen</option>
          {localidades.map((localidad) => (
            <option key={localidad.id} value={localidad.id}>
              {localidad.nombre}
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.destino ?? ""}
          onChange={(e) => setFormData({ ...formData, destino: Number(e.target.value) })}
          required
        >
          <option value="">Seleccionar Destino</option>
          {localidades.map((localidad) => (
            <option key={localidad.id} value={localidad.id}>
              {localidad.nombre}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Código"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.codigo}
          onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Duración Estimada (HH:MM:SS)"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.duracion_estimada}
          onChange={(e) => setFormData({ ...formData, duracion_estimada: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Distancia (km)"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.distancia_km}
          onChange={(e) => setFormData({ ...formData, distancia_km: Number(e.target.value) })}
          required
        />
        <input
          type="number"
          placeholder="Precio Base"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.precio_base}
          onChange={(e) => setFormData({ ...formData, precio_base: Number(e.target.value) })}
          required
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.activo}
            onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
          />
          <span>Activo</span>
        </label>
        <div className="flex space-x-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            {rutaEditando ? "Actualizar" : "Agregar"}
          </button>
          {rutaEditando && (
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

      {/* Tabla de Rutas */}
      <div className="w-full overflow-x-auto py-4">
        <table className="table w-full border-collapse bg-white dark:bg-gray-800 shadow-md">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 dark:text-white">
              <th className="p-2">Origen</th>
              <th className="p-2">Destino</th>
              <th className="p-2">Código</th>
              <th className="p-2">Duración</th>
              <th className="p-2">Distancia (km)</th>
              <th className="p-2">Precio Base</th>
              <th className="p-2">Activo</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rutas.map((ruta) => (
              <tr
                key={ruta.id}
                className="row-hover border-t dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="p-2">
                  {localidades.find((l) => l.id === ruta.origen)?.nombre || "N/A"}
                </td>
                <td className="p-2">
                  {localidades.find((l) => l.id === ruta.destino)?.nombre || "N/A"}
                </td>
                <td className="p-2">{ruta.codigo}</td>
                <td className="p-2">{ruta.duracion_estimada}</td>
                <td className="p-2">{ruta.distancia_km}</td>
                <td className="p-2">{ruta.precio_base}</td>
                <td className="p-2">{ruta.activo ? "Sí" : "No"}</td>
                <td className="p-2 flex space-x-2">
                  <button
                    className="btn btn-circle btn-text btn-sm text-yellow-500"
                    aria-label="Editar"
                    onClick={() => handleEdit(ruta)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="btn btn-circle btn-text btn-sm text-red-500"
                    aria-label="Eliminar"
                    onClick={() => handleDelete(ruta.id)}
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

export default Rutas;