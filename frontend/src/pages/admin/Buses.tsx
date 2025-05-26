import { useState, useEffect } from "react";
import axios from "axios";
import { Trash, Armchair } from "lucide-react";

interface Empresa {
  id_empresa: number;
  nombre: string;
}

interface Bus {
  id_bus: number;
  placa: string;
  marca?: string;
  modelo?: string;
  capacidad: number;
  estado: 'Activo' | 'Mantenimiento' | 'Inactivo';
  empresa: number;
}

interface Asiento {
  id_asiento: number;
  bus: number;
  numero_asiento: number;
  estado: 'Disponible' | 'Reservado' | 'Ocupado';
  tipo_asiento: 'Ejecutivo' | 'Semi-cama' | 'Cama';
}

const BUSES_API_URL = "http://127.0.0.1:8000/api/buses/";
const EMPRESAS_API_URL = "http://127.0.0.1:8000/api/empresas/";
const ASIENTOS_API_URL = "http://127.0.0.1:8000/api/asientos/";

const Buses = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [asientos, setAsientos] = useState<Asiento[]>([]);
  const [busSeleccionado, setBusSeleccionado] = useState<number | null>(null);
  const [formDataBus, setFormDataBus] = useState({
    placa: "",
    marca: "",
    modelo: "",
    capacidad: 0,
    estado: "Activo" as Bus["estado"],
    empresa: null as number | null,
  });
  const [formDataAsiento, setFormDataAsiento] = useState({
    numero_asiento: 0,
    estado: "Disponible" as Asiento["estado"],
    tipo_asiento: "Ejecutivo" as Asiento["tipo_asiento"],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBuses();
    fetchEmpresas();
  }, []);

  useEffect(() => {
    if (busSeleccionado) {
      fetchAsientos(busSeleccionado);
    }
  }, [busSeleccionado]);

  const fetchBuses = async () => {
    try {
      const response = await axios.get(BUSES_API_URL);
      setBuses(response.data);
    } catch (error) {
      console.error("Error al obtener buses:", error);
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

  const fetchAsientos = async (busId: number) => {
    try {
      const response = await axios.get(`${ASIENTOS_API_URL}?bus=${busId}`);
      setAsientos(response.data);
    } catch (error) {
      console.error("Error al obtener asientos:", error);
    }
  };

  const handleCreateAsientos = async (busId: number, cantidad: number) => {
    try {
      // Verificar que el bus y la cantidad son válidos
      if (!busId || cantidad <= 0) {
        console.error('Bus ID o cantidad inválidos');
        return;
      }

      // Obtener asientos existentes para el bus
      const response = await axios.get(`${ASIENTOS_API_URL}?bus=${busId}`);
      const asientosExistentes = response.data;
      
      // Encontrar el número más alto de asiento existente
      const ultimoNumero = asientosExistentes.length > 0 
        ? Math.max(...asientosExistentes.map((a: Asiento) => a.numero_asiento))
        : 0;

      // Crear array solo para los asientos faltantes
      const asientosNuevos = Array.from(
        { length: cantidad - asientosExistentes.length }, 
        (_, index) => ({
          bus: busId,
          numero_asiento: ultimoNumero + index + 1,
          estado: "Disponible",
          tipo_asiento: "Semi-cama"
        })
      );

      // Solo crear nuevos asientos si es necesario
      if (asientosNuevos.length > 0) {
        for (const asiento of asientosNuevos) {
          await axios.post(ASIENTOS_API_URL, asiento);
        }
      }

      // Actualizar la lista de asientos
      await fetchAsientos(busId);
    } catch (error) {
      console.error("Error al crear asientos:", error);
      if (axios.isAxiosError(error)) {
        console.error('Detalles del error:', error.response?.data);
      }
    }
  };

  const handleSubmitBus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response;
      if (busSeleccionado) {
        response = await axios.put(`${BUSES_API_URL}${busSeleccionado}/`, formDataBus);
      } else {
        response = await axios.post(BUSES_API_URL, formDataBus);
      }
      fetchBuses();
      resetFormBus();
    } catch (error) {
      console.error("Error al guardar bus:", error);
    }
  };

  const handleSubmitAsiento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!busSeleccionado) return;

    try {
      await axios.post(ASIENTOS_API_URL, {
        ...formDataAsiento,
        bus: busSeleccionado
      });
      fetchAsientos(busSeleccionado);
      resetFormAsiento();
    } catch (error) {
      console.error("Error al guardar asiento:", error);
    }
  };

  const handleDeleteBus = async (id: number) => {
    try {
      await axios.delete(`${BUSES_API_URL}${id}/`);
      fetchBuses();
      if (busSeleccionado === id) {
        setBusSeleccionado(null);
        setAsientos([]);
      }
    } catch (error) {
      console.error("Error al eliminar bus:", error);
    }
  };

  const handleDeleteAsiento = async (id: number) => {
    try {
      await axios.delete(`${ASIENTOS_API_URL}${id}/`);
      if (busSeleccionado) {
        fetchAsientos(busSeleccionado);
      }
    } catch (error) {
      console.error("Error al eliminar asiento:", error);
    }
  };

  const resetFormBus = () => {
    setFormDataBus({
      placa: "",
      marca: "",
      modelo: "",
      capacidad: 0,
      estado: "Activo",
      empresa: null,
    });
    setBusSeleccionado(null);
  };

  const resetFormAsiento = () => {
    setFormDataAsiento({
      numero_asiento: 0,
      estado: "Disponible",
      tipo_asiento: "Ejecutivo",
    });
  };

  const handleOpenAsientos = (busId: number) => {
    setBusSeleccionado(busId);
    fetchAsientos(busId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setBusSeleccionado(null);
    setAsientos([]);
    setIsModalOpen(false);
    resetFormAsiento();
  };

  return (
    <div className="p-2 dark:bg-gray-900 dark:text-white">
      <div className="w-full">
        <h2 className="text-xl font-bold text-blue-600 dark:text-white mb-4">
          Gestión de Buses
        </h2>

        <form onSubmit={handleSubmitBus} className="bg-white dark:bg-gray-800 p-4 rounded shadow-md space-y-4">
          <select
            className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
            value={formDataBus.empresa || ""}
            onChange={(e) => setFormDataBus({ ...formDataBus, empresa: Number(e.target.value) })}
            required
          >
            <option value="">Seleccionar Empresa</option>
            {empresas.map((empresa) => (
              <option key={empresa.id_empresa} value={empresa.id_empresa}>
                {empresa.nombre}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Placa"
            className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
            value={formDataBus.placa}
            onChange={(e) => setFormDataBus({ ...formDataBus, placa: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Marca"
              className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
              value={formDataBus.marca}
              onChange={(e) => setFormDataBus({ ...formDataBus, marca: e.target.value })}
            />

            <input
              type="text"
              placeholder="Modelo"
              className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
              value={formDataBus.modelo}
              onChange={(e) => setFormDataBus({ ...formDataBus, modelo: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Capacidad"
              className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
              value={formDataBus.capacidad}
              onChange={(e) => setFormDataBus({ ...formDataBus, capacidad: Number(e.target.value) })}
              required
            />

            <select
              className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
              value={formDataBus.estado}
              onChange={(e) => setFormDataBus({ ...formDataBus, estado: e.target.value as Bus["estado"] })}
              required
            >
              <option value="Activo">Activo</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              {busSeleccionado ? "Actualizar" : "Agregar"}
            </button>
            {busSeleccionado && (
              <button
                type="button"
                onClick={resetFormBus}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="mt-4">
          <table className="w-full border-collapse bg-white dark:bg-gray-800 shadow-md">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-2">Placa</th>
                <th className="p-2">Empresa</th>
                <th className="p-2">Estado</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr key={bus.id_bus} className="border-t dark:border-gray-600">
                  <td className="p-2">{bus.placa}</td>
                  <td className="p-2">
                    {empresas.find(e => e.id_empresa === bus.empresa)?.nombre}
                  </td>
                  <td className="p-2">{bus.estado}</td>
                  <td className="p-2 flex space-x-2">
                    <button
                      onClick={() => handleOpenAsientos(bus.id_bus)}
                      className="text-blue-500"
                      title="Gestionar Asientos"
                    >
                      <Armchair size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteBus(bus.id_bus)}
                      className="text-red-500"
                      title="Eliminar Bus"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-blue-600 dark:text-white">
                    Gestión de Asientos - Bus {buses.find(b => b.id_bus === busSeleccionado)?.placa}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmitAsiento} className="space-y-4 mb-6">
                  <input
                    type="number"
                    placeholder="Número de Asiento"
                    className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
                    value={formDataAsiento.numero_asiento}
                    onChange={(e) => setFormDataAsiento({ ...formDataAsiento, numero_asiento: Number(e.target.value) })}
                    required
                  />

                  <select
                    className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
                    value={formDataAsiento.tipo_asiento}
                    onChange={(e) => setFormDataAsiento({ ...formDataAsiento, tipo_asiento: e.target.value as Asiento["tipo_asiento"] })}
                    required
                  >
                    <option value="Ejecutivo">Ejecutivo</option>
                    <option value="Semi-cama">Semi-cama</option>
                    <option value="Cama">Cama</option>
                  </select>

                  <select
                    className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
                    value={formDataAsiento.estado}
                    onChange={(e) => setFormDataAsiento({ ...formDataAsiento, estado: e.target.value as Asiento["estado"] })}
                    required
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Reservado">Reservado</option>
                    <option value="Ocupado">Ocupado</option>
                  </select>

                  <div className="flex justify-between">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                      Agregar Asiento
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const bus = buses.find(b => b.id_bus === busSeleccionado);
                        if (bus) handleCreateAsientos(bus.id_bus, bus.capacidad);
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Generar Todos los Asientos
                    </button>
                  </div>
                </form>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white dark:bg-gray-800 shadow-md">
                    <thead>
                      <tr className="bg-gray-200 dark:bg-gray-700">
                        <th className="p-2">Número</th>
                        <th className="p-2">Tipo</th>
                        <th className="p-2">Estado</th>
                        <th className="p-2">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {asientos.map((asiento) => (
                        <tr key={asiento.id_asiento} className="border-t dark:border-gray-600">
                          <td className="p-2">{asiento.numero_asiento}</td>
                          <td className="p-2">{asiento.tipo_asiento}</td>
                          <td className="p-2">{asiento.estado}</td>
                          <td className="p-2">
                            <button
                              onClick={() => handleDeleteAsiento(asiento.id_asiento)}
                              className="text-red-500"
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Buses;