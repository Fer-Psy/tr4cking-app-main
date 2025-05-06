import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash } from "lucide-react";

const PASAJES_API_URL = "http://127.0.0.1:8000/api/pasajes/";

interface PasajeDTO {
  id: number;
  cliente: string;
  bus: string;
  fecha_viaje: string;
  asiento: number;
}

const Pasajes = () => {
  const [pasajes, setPasajes] = useState<PasajeDTO[]>([]);
  const [formData, setFormData] = useState<Omit<PasajeDTO, "id">>({
    cliente: "",
    bus: "",
    fecha_viaje: "",
    asiento: 0,
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);

  useEffect(() => {
    fetchPasajes();
  }, []);

  const fetchPasajes = async () => {
    try {
      const response = await axios.get(PASAJES_API_URL);
      setPasajes(response.data);
    } catch (error) {
      console.error("Error al obtener pasajes:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await axios.put(`${PASAJES_API_URL}${editandoId}/`, formData);
      } else {
        await axios.post(PASAJES_API_URL, formData);
      }
      fetchPasajes();
      resetForm();
    } catch (error) {
      console.error("Error al guardar pasaje:", error);
    }
  };

  const handleEdit = (pasaje: PasajeDTO) => {
    setFormData({
      cliente: pasaje.cliente,
      bus: pasaje.bus,
      fecha_viaje: pasaje.fecha_viaje,
      asiento: pasaje.asiento,
    });
    setEditandoId(pasaje.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${PASAJES_API_URL}${id}/`);
      fetchPasajes();
    } catch (error) {
      console.error("Error al eliminar pasaje:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      cliente: "",
      bus: "",
      fecha_viaje: "",
      asiento: 0,
    });
    setEditandoId(null);
  };

  return (
    <div className="p-2 dark:bg-gray-900 dark:text-white">
      <h2 className="text-xl font-bold text-blue-600 dark:text-white mb-4">
        Gestión de Pasajes
      </h2>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-4 rounded shadow-md grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          placeholder="Cliente"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.cliente}
          onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Bus"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.bus}
          onChange={(e) => setFormData({ ...formData, bus: e.target.value })}
          required
        />
        <input
          type="date"
          placeholder="Fecha de Viaje"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.fecha_viaje}
          onChange={(e) => setFormData({ ...formData, fecha_viaje: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Asiento"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.asiento}
          onChange={(e) => setFormData({ ...formData, asiento: Number(e.target.value) })}
          required
          min={1}
        />

        <div className="flex space-x-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            {editandoId ? "Actualizar" : "Agregar"}
          </button>
          {editandoId && (
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

      {/* Tabla */}
      <div className="w-full overflow-x-auto py-4">
        <table className="table w-full border-collapse bg-white dark:bg-gray-800 shadow-md">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 dark:text-white">
              <th className="p-2">Cliente</th>
              <th className="p-2">Bus</th>
              <th className="p-2">Fecha de Viaje</th>
              <th className="p-2">Asiento</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pasajes.map((pasaje) => (
              <tr
                key={pasaje.id}
                className="row-hover border-t dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="p-2">{pasaje.cliente}</td>
                <td className="p-2">{pasaje.bus}</td>
                <td className="p-2">{pasaje.fecha_viaje}</td>
                <td className="p-2">{pasaje.asiento}</td>
                <td className="p-2 flex space-x-2">
                  <button
                    className="btn btn-circle btn-text btn-sm text-yellow-500"
                    aria-label="Editar"
                    onClick={() => handleEdit(pasaje)}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    className="btn btn-circle btn-text btn-sm text-red-500"
                    aria-label="Eliminar"
                    onClick={() => handleDelete(pasaje.id)}
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

export default Pasajes;
