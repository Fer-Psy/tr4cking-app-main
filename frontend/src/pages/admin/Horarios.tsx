import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash } from "lucide-react";
import { Horario, Ruta } from "../../shared/shared.types";

const HORARIOS_API_URL = "http://127.0.0.1:8000/api/horarios/";
const RUTAS_API_URL = "http://127.0.0.1:8000/api/rutas/";

const Horarios = () => {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [formData, setFormData] = useState<Omit<Horario, "id">>({
    ruta: 0,
    hora_salida: "",
    dias_semana: "1111100", // Lunes a Viernes por defecto
    activo: true,
  });
  const [horarioEditando, setHorarioEditando] = useState<number | null>(null);

  useEffect(() => {
    fetchHorarios();
    fetchRutas();
  }, []);

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
      if (horarioEditando) {
        await axios.put(`${HORARIOS_API_URL}${horarioEditando}/`, formData);
      } else {
        await axios.post(HORARIOS_API_URL, formData);
      }

      fetchHorarios();
      resetForm();
    } catch (error) {
      console.error("Error al guardar horario:", error);
    }
  };

  const handleEdit = (horario: Horario) => {
    setFormData({
      ruta: horario.ruta,
      hora_salida: horario.hora_salida,
      dias_semana: horario.dias_semana,
      activo: horario.activo,
    });
    setHorarioEditando(horario.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${HORARIOS_API_URL}${id}/`);
      fetchHorarios();
    } catch (error) {
      console.error("Error al eliminar horario:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      ruta: 0,
      hora_salida: "",
      dias_semana: "1111100",
      activo: true,
    });
    setHorarioEditando(null);
  };

  return (
    <div className="p-2 dark:bg-gray-900 dark:text-white">
      <h2 className="text-xl font-bold text-blue-600 dark:text-white mb-4">
        Gestión de Horarios
      </h2>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-4 rounded shadow-md grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <select
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.ruta}
          onChange={(e) => setFormData({ ...formData, ruta: Number(e.target.value) })}
          required
        >
          <option value="">Seleccionar Ruta</option>
          {rutas.map((ruta) => (
            <option key={ruta.id} value={ruta.id}>
              {ruta.codigo}
            </option>
          ))}
        </select>
        <input
          type="time"
          placeholder="Hora de Salida"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.hora_salida}
          onChange={(e) => setFormData({ ...formData, hora_salida: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Días de la Semana (LMMJVSD)"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.dias_semana}
          onChange={(e) => setFormData({ ...formData, dias_semana: e.target.value })}
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
            {horarioEditando ? "Actualizar" : "Agregar"}
          </button>
          {horarioEditando && (
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

      {/* Tabla de Horarios */}
      <div className="w-full overflow-x-auto py-4">
        <table className="table w-full border-collapse bg-white dark:bg-gray-800 shadow-md">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 dark:text-white">
              <th className="p-2">Ruta</th>
              <th className="p-2">Hora de Salida</th>
              <th className="p-2">Días de la Semana</th>
              <th className="p-2">Activo</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {horarios.map((horario) => (
              <tr
                key={horario.id}
                className="row-hover border-t dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="p-2">
                  {rutas.find((r) => r.id === horario.ruta)?.codigo || "N/A"}
                </td>
                <td className="p-2">{horario.hora_salida}</td>
                <td className="p-2">{horario.dias_semana}</td>
                <td className="p-2">{horario.activo ? "Sí" : "No"}</td>
                <td className="p-2 flex space-x-2">
                  <button
                    className="btn btn-circle btn-text btn-sm text-yellow-500"
                    aria-label="Editar"
                    onClick={() => handleEdit(horario)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="btn btn-circle btn-text btn-sm text-red-500"
                    aria-label="Eliminar"
                    onClick={() => handleDelete(horario.id)}
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

export default Horarios;