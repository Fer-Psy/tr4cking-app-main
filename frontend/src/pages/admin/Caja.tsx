import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface MovimientoData {
  descripcion: string;
  monto: number;
  tipo: 'Ingreso' | 'Egreso';
  fecha: string;
}

interface CajaData {
  id: number;
  nombre: string;
  responsable: string;
  fechaApertura: string;
  fechaCierre: string;
  montoInicial: number;
  ingresos: number;
  egresos: number;
  montoFinal: number;
  montoRetirado: number;
  estado: 'Abierta' | 'Cerrada';
  movimientos: MovimientoData[];
}

const CajaReport: React.FC<{ data: CajaData }> = ({ data }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-center mb-6">Informe de Cierre de Caja</h2>

      {/* Datos generales */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Datos Generales</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><span className="font-semibold">Caja:</span> {data.nombre}</p>
          <p><span className="font-semibold">Responsable:</span> {data.responsable}</p>
          <p><span className="font-semibold">Fecha Apertura:</span> {data.fechaApertura}</p>
          <p><span className="font-semibold">Fecha Cierre:</span> {data.fechaCierre}</p>
          <p><span className="font-semibold">Estado:</span> {data.estado}</p>
        </div>
      </div>

      {/* Resumen financiero */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Resumen Financiero</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><span className="font-semibold">Monto Inicial:</span> Gs. {data.montoInicial.toLocaleString()}</p>
          <p><span className="font-semibold">Total Ingresos:</span> Gs. {data.ingresos.toLocaleString()}</p>
          <p><span className="font-semibold">Total Egresos:</span> Gs. {data.egresos.toLocaleString()}</p>
          <p><span className="font-semibold">Monto Final:</span> Gs. {data.montoFinal.toLocaleString()}</p>
          <p><span className="font-semibold">Monto Retirado:</span> Gs. {data.montoRetirado.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabla de movimientos */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Detalle de Movimientos</h3>
        <div className="overflow-auto">
          <table className="min-w-full bg-white border text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-4 py-2 border">Fecha</th>
                <th className="px-4 py-2 border">Tipo</th>
                <th className="px-4 py-2 border">Descripción</th>
                <th className="px-4 py-2 border">Monto</th>
              </tr>
            </thead>
            <tbody>
              {data.movimientos.map((mov, idx) => (
                <tr key={idx} className="text-gray-700">
                  <td className="px-4 py-2 border">{mov.fecha}</td>
                  <td className={`px-4 py-2 border ${mov.tipo === 'Ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                    {mov.tipo}
                  </td>
                  <td className="px-4 py-2 border">{mov.descripcion}</td>
                  <td className="px-4 py-2 border">Gs. {mov.monto.toLocaleString()}</td>
                </tr>
              ))}
              {data.movimientos.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center px-4 py-2 border text-gray-500">
                    No hay movimientos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Caja = () => {
  const [selectedCaja, setSelectedCaja] = useState<string | null>(null);
  const [montoInicial, setMontoInicial] = useState<number>(0);
  const [montoFinal, setMontoFinal] = useState<number>(0);
  const [montoRetirado, setMontoRetirado] = useState<number>(0);
  const [mensaje, setMensaje] = useState<string>('');
  const [cajaAbierta, setCajaAbierta] = useState<any>(null);
  const [totalIngresos, setTotalIngresos] = useState<number>(0);
  const [mostrarInforme, setMostrarInforme] = useState<boolean>(false);
  const [informeData, setInformeData] = useState<CajaData | null>(null);
  const [movimientos, setMovimientos] = useState<MovimientoData[]>([]);

  const EMPLEADO_ID = 1; // Simulado

  useEffect(() => {
    const fetchCajaAbierta = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/cabecera-caja/');
        const abiertas = response.data.filter(
          (c: any) => c.tipo_mov === 'Apertura' && c.monto_final === c.monto_inical
        );

        if (abiertas.length > 0) {
          const cabecera = abiertas[0];
          const cajaRes = await axios.get(`http://localhost:8000/api/cajas/${cabecera.caja}/`);
          const detallesRes = await axios.get(`http://localhost:8000/api/detalle-caja/`);

          const ingresos = detallesRes.data.filter(
            (d: any) =>
              d.cabecera_caja === cabecera.id &&
              d.tipo_transaccion.toLowerCase() === 'ingreso'
          );
          const suma = ingresos.reduce((acc: number, curr: any) => acc + curr.monto, 0);

          // Obtener todos los movimientos para el informe
          const movimientosCaja = detallesRes.data
            .filter((d: any) => d.cabecera_caja === cabecera.id)
            .map((d: any) => ({
              descripcion: d.descripcion,
              monto: d.monto,
              tipo: d.tipo_transaccion.toLowerCase() === 'ingreso' ? 'Ingreso' : 'Egreso',
              fecha: new Date(d.fecha_transaccion).toLocaleString()
            }));

          setMovimientos(movimientosCaja);
          setCajaAbierta({
            id: cabecera.id,
            nombre: cajaRes.data.nombre,
            caja: cabecera.caja,
            monto_inicial: cabecera.monto_inical,
          });
          setTotalIngresos(suma);
        } else {
          setCajaAbierta(null);
        }
      } catch (error) {
        console.error('Error al obtener cajas abiertas:', error);
      }
    };

    fetchCajaAbierta();
  }, []);

  const handleSeleccionCaja = (nombre: string) => {
    setSelectedCaja(nombre);
    setMensaje('');
  };

  const handleAbrirCaja = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaja) return;

    try {
      const cajaRes = await axios.post('http://localhost:8000/api/cajas/', {
        nombre: selectedCaja,
        estado: 'Abierta',
        fecha_creacion: new Date().toISOString().split('T')[0],
        monto_inicial: montoInicial,
      });

      const cajaId = cajaRes.data.id;

      const cabeceraRes = await axios.post('http://localhost:8000/api/cabecera-caja/', {
        tipo_mov: 'Apertura',
        fecha_mov: new Date().toISOString(),
        monto_inical: montoInicial,
        monto_final: montoInicial,
        caja: cajaId,
        empleado: EMPLEADO_ID,
      });

      await axios.post('http://localhost:8000/api/detalle-caja/', {
        descripcion: 'Apertura de caja',
        tipo_transaccion: 'Apertura',
        monto: montoInicial,
        fecha_transaccion: new Date().toISOString(),
        factura: null,
        cabecera_caja: cabeceraRes.data.id,
      });

      setMensaje(`✅ Caja ${selectedCaja} abierta correctamente.`);
      setCajaAbierta({
        id: cabeceraRes.data.id,
        nombre: selectedCaja,
        caja: cajaId,
        monto_inicial: montoInicial,
      });
      setSelectedCaja(null);
      setMontoInicial(0);
      setTotalIngresos(0);
      setMovimientos([{
        descripcion: 'Apertura de caja',
        monto: montoInicial,
        tipo: 'Ingreso',
        fecha: new Date().toLocaleString()
      }]);
    } catch (error) {
      console.error(error);
      setMensaje('❌ Error al abrir la caja.');
    }
  };

  const handleCerrarCaja = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const montoFinalReal = montoFinal - montoRetirado;
    const fechaCierre = new Date().toISOString();

    // Actualizar cabecera-caja (tipo_mov y monto_final)
    await axios.put(`http://localhost:8000/api/cabecera-caja/${cajaAbierta.id}/`, {
      tipo_mov: 'Cierre',
      fecha_mov: fechaCierre,
      monto_inical: cajaAbierta.monto_inicial,
      monto_final: montoFinalReal,
      caja: cajaAbierta.caja,
      empleado: EMPLEADO_ID,
    });

    // Crear detalle de cierre
    await axios.post('http://localhost:8000/api/detalle-caja/', {
      descripcion: `Cierre de caja - Retirado ${montoRetirado}`,
      tipo_transaccion: 'Cierre',
      monto: montoFinalReal,
      fecha_transaccion: fechaCierre,
      factura: null,
      cabecera_caja: cajaAbierta.id,
    });

    // ✅ Actualizar el estado de la caja a "Cerrada"
    await axios.patch(`http://localhost:8000/api/cajas/${cajaAbierta.caja}/`, {
      estado: 'Cerrada'
    });

    // Preparar datos para el informe
    const informe: CajaData = {
      id: cajaAbierta.id,
      nombre: cajaAbierta.nombre,
      responsable: `Empleado ${EMPLEADO_ID}`,
      fechaApertura: new Date().toLocaleString(), // Reemplazar con fecha real si la tienes
      fechaCierre: new Date(fechaCierre).toLocaleString(),
      montoInicial: cajaAbierta.monto_inicial,
      ingresos: totalIngresos,
      egresos: montoRetirado,
      montoFinal: montoFinalReal,
      montoRetirado: montoRetirado,
      estado: 'Cerrada',
      movimientos: [
        ...movimientos,
        {
          descripcion: `Cierre de caja - Retirado ${montoRetirado}`,
          monto: montoFinalReal,
          tipo: 'Egreso',
          fecha: new Date(fechaCierre).toLocaleString()
        }
      ]
    };

    setInformeData(informe);
    setMensaje('✅ Caja cerrada correctamente.');
    setMostrarInforme(true);
  } catch (error) {
    console.error('Error al cerrar la caja:', error);
    setMensaje('❌ Error al cerrar la caja.');
  }
};


  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white border rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Gestión de Caja</h2>

      {/* Botones de selección */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => !cajaAbierta && handleSeleccionCaja('Caja 1')}
          disabled={!!cajaAbierta}
          className={`px-6 py-2 rounded-xl font-medium transition ${
            cajaAbierta ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Caja 1
        </button>
        <button
          onClick={() => !cajaAbierta && handleSeleccionCaja('Caja 2')}
          disabled={!!cajaAbierta}
          className={`px-6 py-2 rounded-xl font-medium transition ${
            cajaAbierta ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          Caja 2
        </button>
      </div>

      {/* Formulario de apertura */}
      {selectedCaja && !cajaAbierta && (
        <form onSubmit={handleAbrirCaja} className="space-y-4">
          <p className="text-lg font-semibold text-gray-700">Apertura de: {selectedCaja}</p>
          <div>
            <label className="text-sm font-medium text-gray-600">Monto Inicial</label>
            <input
              type="number"
              value={montoInicial}
              onChange={(e) => setMontoInicial(parseFloat(e.target.value))}
              required
              className="mt-1 w-full px-4 py-2 border rounded-xl"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl font-semibold"
          >
            Abrir Caja
          </button>
        </form>
      )}

      {/* Formulario de cierre */}
      {cajaAbierta && !mostrarInforme && (
        <form onSubmit={handleCerrarCaja} className="space-y-4 mt-8 border-t pt-6">
          <p className="text-lg font-semibold text-gray-700">Cerrar: {cajaAbierta.nombre}</p>

          <div>
            <label className="text-sm font-medium text-gray-600">Monto Inicial</label>
            <input
              type="number"
              value={cajaAbierta?.monto_inicial ?? ''}
              readOnly
              className="mt-1 w-full px-4 py-2 bg-gray-100 border rounded-xl text-gray-700"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Total de Ingresos</label>
            <input
              type="number"
              value={totalIngresos}
              readOnly
              className="mt-1 w-full px-4 py-2 bg-gray-100 border rounded-xl text-gray-700"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Monto Final</label>
            <input
              type="number"
              value={montoFinal}
              onChange={(e) => setMontoFinal(parseFloat(e.target.value))}
              required
              className="mt-1 w-full px-4 py-2 border rounded-xl"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Monto a Retirar</label>
            <input
              type="number"
              value={montoRetirado}
              onChange={(e) => setMontoRetirado(parseFloat(e.target.value))}
              required
              className="mt-1 w-full px-4 py-2 border rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-semibold"
          >
            Cerrar Caja
          </button>
        </form>
      )}

      {/* Mensaje */}
      {mensaje && (
        <div className="mt-6 text-center text-sm font-medium text-gray-700">{mensaje}</div>
      )}

      {/* Informe de cierre */}
      {mostrarInforme && informeData && (
        <CajaReport data={informeData} />
      )}
    </div>
  );
};

export default Caja;