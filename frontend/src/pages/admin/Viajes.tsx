import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash } from "lucide-react";

interface Bus {
  id_bus: number;
  placa: string;
  marca?: string;
  modelo?: string;
}

interface Ruta {
  id_ruta: number;
  duracion_total: number;
  distancia_km: number;
  precio_base: number;
}

interface Horario {
  id_horario: number;
  ruta: number;
  hora_salida: string;
  dias_semana: string;
  activo: boolean;
}

interface Viaje {
  id_viaje: number;
  horario: number;
  bus: number;
  fecha: string;
  activo: boolean;
  observaciones?: string;
}

const VIAJES_API_URL = "http://127.0.0.1:8000/api/viajes/";
const BUSES_API_URL = "http://127.0.0.1:8000/api/buses/";
const HORARIOS_API_URL = "http://127.0.0.1:8000/api/horarios/";
const RUTAS_API_URL = "http://127.0.0.1:8000/api/rutas/";

const Viajes = () => {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [viajeEditando, setViajeEditando] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    horario: null as number | null,
    bus: null as number | null,
    fecha: "",
    activo: true,
    observaciones: "",
  });

  useEffect(() => {
    fetchViajes();
    fetchBuses();
    fetchHorarios();
    fetchRutas();
  }, []);

  const fetchViajes = async () => {
    try {
      const response = await axios.get(VIAJES_API_URL);
      setViajes(response.data);
    } catch (error) {
      console.error("Error al obtener viajes:", error);
    }
  };

  const fetchBuses = async () => {
    try {
      const response = await axios.get(BUSES_API_URL);
      setBuses(response.data);
    } catch (error) {
      console.error("Error al obtener buses:", error);
    }
  };

  const fetchHorarios = async () => {
    try {
      const response = await axios.get(HORARIOS_API_URL);
      setHorarios(response.data);
    } catch (error) {
      console.error("Error al obtener horarios:", error);
    }
  };

  const fetchRutas = async () => {
    try {
      const response = await axios.get(RUTAS_API_URL);
      setRutas(response.data);
    } catch (error) {
      console.error("Error al obtener rutas:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (viajeEditando) {
        await axios.put(`${VIAJES_API_URL}${viajeEditando}/`, formData);
      } else {
        await axios.post(VIAJES_API_URL, formData);
      }
      fetchViajes();
      resetForm();
    } catch (error) {
      console.error("Error al guardar viaje:", error);
    }
  };

  const handleEdit = (viaje: Viaje) => {
    setFormData({
      horario: viaje.horario,
      bus: viaje.bus,
      fecha: viaje.fecha,
      activo: viaje.activo,
      observaciones: viaje.observaciones || "",
    });
    setViajeEditando(viaje.id_viaje);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Está seguro de eliminar este viaje?")) return;
    try {
      await axios.delete(`${VIAJES_API_URL}${id}/`);
      fetchViajes();
    } catch (error) {
      console.error("Error al eliminar viaje:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      horario: null,
      bus: null,
      fecha: "",
      activo: true,
      observaciones: "",
    });
    setViajeEditando(null);
  };

  return (
    <div className="p-2 dark:bg-gray-900 dark:text-white">
      <h2 className="text-xl font-bold text-blue-600 dark:text-white mb-4">
        Gestión de Viajes
      </h2>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded shadow-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Horario
              <select
                className="mt-1 w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
                value={formData.horario || ""}
                onChange={(e) => setFormData({ ...formData, horario: Number(e.target.value) })}
                required
              >
                <option value="">Seleccionar Horario</option>
                {horarios.map((horario) => {
                  const ruta = rutas.find(r => r.id_ruta === horario.ruta);
                  return (
                    <option key={horario.id_horario} value={horario.id_horario}>
                      {`${horario.hora_salida} - ${ruta ? `${ruta.distancia_km}km` : 'N/A'}`}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Bus
              <select
                className="mt-1 w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
                value={formData.bus || ""}
                onChange={(e) => setFormData({ ...formData, bus: Number(e.target.value) })}
                required
              >
                <option value="">Seleccionar Bus</option>
                {buses.map((bus) => (
                  <option key={bus.id_bus} value={bus.id_bus}>
                    {bus.placa} - {bus.marca} {bus.modelo}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Fecha
              <input
                type="date"
                className="mt-1 w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                required
              />
            </label>
          </div>

          <div className="flex items-center h-full pt-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                className="rounded"
              />
              <span>Viaje Activo</span>
            </label>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">
              Observaciones
              <textarea
                className="mt-1 w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                rows={3}
              />
            </label>
          </div>
        </div>

        <div className="flex space-x-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {viajeEditando ? "Actualizar Viaje" : "Crear Viaje"}
          </button>
          {viajeEditando && (
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

      <div className="w-full overflow-x-auto py-4">
        <table className="w-full border-collapse bg-white dark:bg-gray-800 shadow-md">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="p-2">Horario</th>
              <th className="p-2">Bus</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Observaciones</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {viajes.map((viaje) => (
              <tr key={viaje.id_viaje} className="border-t dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="p-2">
                  {horarios.find(h => h.id_horario === viaje.horario)?.hora_salida || 'N/A'}
                </td>
                <td className="p-2">
                  {buses.find(b => b.id_bus === viaje.bus)?.placa || 'N/A'}
                </td>
                <td className="p-2">{viaje.fecha}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    viaje.activo 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {viaje.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="p-2">{viaje.observaciones || '-'}</td>
                <td className="p-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(viaje)}
                    className="text-yellow-500 hover:text-yellow-600"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(viaje.id_viaje)}
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

export default Viajes;      