import { useEffect, useState } from 'react';
import axios from 'axios';

const InformeCaja = () => {
  const [informe, setInforme] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchInforme = async () => {
      try {
        const cabecerasRes = await axios.get('http://localhost:8000/api/cabecera-caja/');
        const cierres = cabecerasRes.data.filter((c: any) => c.tipo_mov === 'Cierre');

        if (cierres.length === 0) {
          setError('No hay cierre de caja disponible.');
          return;
        }

        const ultimoCierre = cierres.sort((a: any, b: any) =>
          new Date(b.fecha_mov).getTime() - new Date(a.fecha_mov).getTime()
        )[0];

        const detallesRes = await axios.get('http://localhost:8000/api/detalle-caja/');
        const detalles = detallesRes.data.filter((d: any) => d.cabecera_caja === ultimoCierre.id);

        const ingresos = detalles.filter((d: any) => d.tipo_transaccion.toLowerCase() === 'ingreso');
        const egresos = detalles.filter((d: any) => d.tipo_transaccion.toLowerCase() === 'egreso');
        const retiro = detalles.find((d: any) => d.tipo_transaccion.toLowerCase() === 'cierre');

        const cajaRes = await axios.get(`http://localhost:8000/api/cajas/${ultimoCierre.caja}/`);
        const empleadoRes = await axios.get(`http://localhost:8000/api/empleados/${ultimoCierre.empleado}/`);

        setInforme({
          fecha: new Date(ultimoCierre.fecha_mov).toLocaleString(),
          caja: cajaRes.data.nombre,
          empleado: `${empleadoRes.data.nombre} ${empleadoRes.data.apellido || ''}`,
          montoInicial: ultimoCierre.monto_inical,
          montoFinal: ultimoCierre.monto_final,
          detalles,
          totalIngresos: ingresos.reduce((acc: number, d: any) => acc + d.monto, 0),
          totalEgresos: egresos.reduce((acc: number, d: any) => acc + d.monto, 0),
          montoRetirado: retiro ? (ingresos.reduce((acc: number, d: any) => acc + d.monto, 0) + ultimoCierre.monto_inical) - ultimoCierre.monto_final : 0,
        });
      } catch (err) {
        console.error(err);
        setError('Error al cargar el informe.');
      }
    };

    fetchInforme();
  }, []);

  if (error) return <div className="text-center mt-10 text-red-600 font-semibold">{error}</div>;
  if (!informe) return <div className="text-center mt-10 text-gray-600">Cargando informe...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Informe de Caja</h2>
      <div className="space-y-2 text-sm text-gray-700">
        <p><strong>Fecha:</strong> {informe.fecha}</p>
        <p><strong>Caja:</strong> {informe.caja}</p>
        <p><strong>Empleado:</strong> {informe.empleado}</p>
        <p><strong>Monto Inicial:</strong> {informe.montoInicial.toLocaleString()}</p>
        <p><strong>Total Ingresos:</strong> {informe.totalIngresos.toLocaleString()}</p>
        <p><strong>Total Egresos:</strong> {informe.totalEgresos.toLocaleString()}</p>
        <p><strong>Retiro de Caja:</strong> {informe.montoRetirado.toLocaleString()}</p>
        <p><strong>Monto Final:</strong> {informe.montoFinal.toLocaleString()}</p>
      </div>

      <hr className="my-4" />

      <h3 className="text-lg font-semibold text-gray-800 mb-2">Movimientos</h3>
      <ul className="space-y-2 max-h-60 overflow-auto">
        {informe.detalles.map((mov: any) => (
          <li key={mov.id} className="p-2 border rounded-lg bg-gray-50">
            <div className="flex justify-between">
              <span className="font-medium">{mov.tipo_transaccion} - {mov.descripcion}</span>
              <span className={`font-semibold ${mov.tipo_transaccion === 'Ingreso' ? 'text-green-600' : mov.tipo_transaccion === 'Egreso' ? 'text-red-600' : 'text-gray-600'}`}>
                {mov.monto.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {new Date(mov.fecha_transaccion).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InformeCaja;
