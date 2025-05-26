import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash } from "lucide-react";

interface DiasSemana {
  L: boolean;
  M: boolean;
  X: boolean;
  J: boolean;
  V: boolean;
  S: boolean;
  D: boolean;
}

interface Horario {
  id_horario: number;
  ruta: number;
  hora_salida: string;
  dias_semana: string;
  activo: boolean;
}

interface Ruta {
  id_ruta: number;
  duracion_total: number;
  distancia_km: number;
  precio_base: number;
  activo: boolean;
}

const DIAS_LABELS = {
  L: 'Lunes',
  M: 'Martes',
  X: 'Miércoles',
  J: 'Jueves',
  V: 'Viernes',
  S: 'Sábado',
  D: 'Domingo'
};

const HORARIOS_API_URL = "http://127.0.0.1:8000/api/horarios/";
const RUTAS_API_URL = "http://127.0.0.1:8000/api/rutas/";

const Horarios = () => {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [formData, setFormData] = useState<Omit<Horario, "id_horario">>({
    ruta: 0,
    hora_salida: "",
    dias_semana: "1111100", // Lunes a Viernes por defecto
    activo: true,
  });
  const [horarioEditando, setHorarioEditando] = useState<number | null>(null);
  const [diasSeleccionados, setDiasSeleccionados] = useState<DiasSemana>({
    L: true,
    M: true,
    X: true,
    J: true,
    V: true,
    S: false,
    D: false
  });

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
    setDiasSeleccionados(stringToDias(horario.dias_semana));
    setHorarioEditando(horario.id_horario);
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

  // Función para convertir string binario a objeto de días
  const stringToDias = (diasString: string): DiasSemana => {
    const dias = diasString.split('');
    return {
      L: dias[0] === '1',
      M: dias[1] === '1',
      X: dias[2] === '1',
      J: dias[3] === '1',
      V: dias[4] === '1',
      S: dias[5] === '1',
      D: dias[6] === '1'
    };
  };

  // Función para convertir objeto de días a string binario
  const diasToString = (dias: DiasSemana): string => {
    return Object.values(dias).map(v => v ? '1' : '0').join('');
  };

  // Función para convertir string binario a texto legible
  const diasToText = (diasString: string): string => {
    const dias = stringToDias(diasString);
    return Object.entries(dias)
      .filter(([_, active]) => active)
      .map(([key, _]) => DIAS_LABELS[key as keyof DiasSemana])
      .join(', ');
  };

  const handleDiaChange = (dia: keyof DiasSemana) => {
    const nuevosDias = { ...diasSeleccionados, [dia]: !diasSeleccionados[dia] };
    setDiasSeleccionados(nuevosDias);
    setFormData({ ...formData, dias_semana: diasToString(nuevosDias) });
  };

  return (
    <div className="p-2 dark:bg-gray-900 dark:text-white">
      <h2 className="text-xl font-bold text-blue-600 dark:text-white mb-4">
        Gestión de Horarios
      </h2>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded shadow-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
            value={formData.ruta}
            onChange={(e) => setFormData({ ...formData, ruta: Number(e.target.value) })}
            required
          >
            <option value="">Seleccionar Ruta</option>
            {rutas.map((ruta) => (
              <option key={ruta.id_ruta} value={ruta.id_ruta}>
                {`Ruta ${ruta.id_ruta} - ${ruta.distancia_km}km`}
              </option>
            ))}
          </select>

          <input
            type="time"
            className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
            value={formData.hora_salida}
            onChange={(e) => setFormData({ ...formData, hora_salida: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Días de operación:</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(DIAS_LABELS).map(([key, label]) => (
              <label key={key} className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 p-2 rounded">
                <input
                  type="checkbox"
                  checked={diasSeleccionados[key as keyof DiasSemana]}
                  onChange={() => handleDiaChange(key as keyof DiasSemana)}
                  className="rounded text-blue-500"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.activo}
            onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
            className="rounded text-blue-500"
          />
          <span>Horario Activo</span>
        </div>

        <div className="flex space-x-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {horarioEditando ? "Actualizar" : "Agregar"}
          </button>
          {horarioEditando && (
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

      {/* Tabla de Horarios */}
      <div className="w-full overflow-x-auto py-4">
        <table className="w-full border-collapse bg-white dark:bg-gray-800 shadow-md">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="p-2">Ruta</th>
              <th className="p-2">Hora de Salida</th>
              <th className="p-2">Días de Operación</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {horarios.map((horario) => (
              <tr key={horario.id_horario} className="border-t dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="p-2">
                  {rutas.find(r => r.id_ruta === horario.ruta)?.id_ruta || 'N/A'}
                </td>
                <td className="p-2">{horario.hora_salida}</td>
                <td className="p-2">{diasToText(horario.dias_semana)}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    horario.activo 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {horario.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="p-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(horario)}
                    className="text-yellow-500 hover:text-yellow-600"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(horario.id_horario)}
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

export default Horarios;