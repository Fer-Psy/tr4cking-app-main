import React from 'react';
import { Edit, Trash2, Eye, Loader2 } from 'lucide-react';

interface Cliente {
  id: number;
  razon_social: string;
}

interface Viaje {
  id_viaje: number;
  fecha: string;
  bus?: {
    placa?: string;
    empresa?: {
      nombre?: string;
    };
  };
}

interface Parada {
  id_parada: number;
  nombre: string;
}

interface Encomienda {
  id_encomienda: number;
  cliente: any;
  viaje: any;
  origen: any;
  destino: any;
  tipo_envio: string;
  cantidad_sobre: number;
  cantidad_paquete: number;
  flete: number;
  remitente: string;
  ruc_ci: string;
  numero_contacto: string;
  descripcion: string;
  fecha_creacion: string;  // Cambiado de fecha_registro a fecha_creacion
}

interface Props {
  encomiendas: Encomienda[];
  clientes: Cliente[];
  viajes: Viaje[];
  paradas: Parada[];
  loading: boolean;
  onEdit: (enc: Encomienda) => void;
  onDelete: (id: number) => void;
  onPreview: (enc: Encomienda) => void;
}

const EncomiendaTable: React.FC<Props> = ({
  encomiendas,
  clientes,
  viajes,
  paradas,
  loading,
  onEdit,
  onDelete,
  onPreview
}) => {
  // Función para formatear la fecha de manera segura
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Fecha inválida' : date.toLocaleDateString('es-PY', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Lista de Encomiendas
        </h3>
      </div>

      {loading && encomiendas.length === 0 ? (
        <div className="p-8 flex justify-center">
          <Loader2 className="animate-spin text-blue-500" size={24} />
        </div>
      ) : encomiendas.length === 0 ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          No hay encomiendas registradas
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Destinatario
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Origen/Destino
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Viaje
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tipo/Cantidad
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {encomiendas.map(enc => {
                const cliente = clientes.find(c => c.id === enc.cliente?.id || c.id === enc.cliente);
                const viaje = viajes.find(v => v.id_viaje === enc.viaje?.id_viaje || v.id_viaje === enc.viaje);
                const origenParada = paradas.find(p => p.id_parada === enc.origen?.parada?.id_parada || p.id_parada === enc.origen);
                const destinoParada = paradas.find(p => p.id_parada === enc.destino?.parada?.id_parada || p.id_parada === enc.destino);

                return (
                  <tr key={enc.id_encomienda} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {cliente?.razon_social || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {enc.remitente || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {enc.ruc_ci || 'Sin RUC/CI'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {enc.numero_contacto || 'Sin contacto'}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">De:</span> {origenParada?.nombre || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">A:</span> {destinoParada?.nombre || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {viaje?.bus?.empresa?.nombre && viaje?.bus?.placa 
                          ? `${viaje.bus.empresa.nombre} - ${viaje.bus.placa}`
                          : 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {viaje?.fecha || ''}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white capitalize">
                        {enc.tipo_envio}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {enc.tipo_envio === 'sobre' ? `${enc.cantidad_sobre} sobres` :
                         enc.tipo_envio === 'paquete' ? `${enc.cantidad_paquete} paquetes` :
                         `${enc.cantidad_sobre} sobres, ${enc.cantidad_paquete} paquetes`}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Gs. {Math.round(enc.flete).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                       {formatDate(enc.fecha_creacion)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onPreview(enc)}
                          disabled={loading}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Vista previa"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => onEdit(enc)}
                          disabled={loading}
                          className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => onDelete(enc.id_encomienda)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EncomiendaTable;