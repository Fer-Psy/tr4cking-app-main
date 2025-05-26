import React, { ChangeEvent, FormEvent } from 'react';

interface Cliente {
  id_cliente: number;
  razon_social: string;
}

interface Viaje {
  id_viaje: number;
  fecha: string;
  bus: {
    placa: string;
    empresa: {
      nombre: string;
    };
  };
}

interface Parada {
  id_parada: number;
  nombre: string;
}

interface FormData {
  cliente: string;
  viaje: string;
  origen: string;
  destino: string;
  flete_sobre: string;
  flete_paquete: string;
  cantidad_sobre: string;
  cantidad_paquete: string;
  descripcion: string;
  remitente: string;
  ruc_ci: string;
  numero_contacto: string;
  es_sobre: boolean;
  es_paquete: boolean;
  total: string;
}

interface EncomiendaFormProps {
  formData: FormData;
  clientes: Cliente[];
  viajes: Viaje[];
  paradas: Parada[];
  loading: boolean;
  editingId: number | null;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  resetForm: () => void;
  calculateTotal: () => void;
}

const EncomiendaForm: React.FC<EncomiendaFormProps> = ({
  formData,
  clientes,
  viajes,
  paradas,
  loading,
  editingId,
  handleChange,
  handleCheckboxChange,
  handleSubmit,
  resetForm,
  calculateTotal
}) => {
  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Cliente y Viaje */}
      <div>
        <label className="block text-sm font-medium mb-1">Cliente</label>
        <select
          name="cliente"
          value={formData.cliente}
          onChange={handleChange}
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
          required
          disabled={loading}
        >
          <option value="">Seleccionar Cliente</option>
          {clientes.map(c => (
            <option key={c.id_cliente} value={c.id_cliente}>{c.razon_social}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Viaje</label>
        <select
          name="viaje"
          value={formData.viaje}
          onChange={handleChange}
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
          required
          disabled={loading}
        >
          <option value="">Seleccionar Viaje</option>
          {viajes.map(viaje => (
            <option key={viaje.id_viaje} value={viaje.id_viaje}>
              {viaje.id_viaje} - 
              Empresa: {viaje.bus?.empresa?.nombre || 'N/A'} - 
              Placa: {viaje.bus?.placa?.toUpperCase() || 'N/A'} - 
              Fecha: {viaje.fecha || 'N/A'}
            </option>
          ))}
        </select>
      </div>
      {/* Destinatario  */}
      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Destinatario</label>
          <input
            type="text"
            name="remitente"
            value={formData.remitente}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">RUC/CI</label>
          <input
            type="text"
            name="ruc_ci"
            value={formData.ruc_ci}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contacto</label>
          <input
            type="text"
            name="numero_contacto"
            value={formData.numero_contacto}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
            required
            disabled={loading}
          />
        </div>
      </div>

      {/* Origen y Destino */}
      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Origen</label>
          <select
            name="origen"
            value={formData.origen}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
            required
            disabled={loading}
          >
            <option value="">Seleccionar Origen</option>
            {paradas.map(p => (
              <option key={p.id_parada} value={p.id_parada}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Destino</label>
          <select
            name="destino"
            value={formData.destino}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
            required
            disabled={loading}
          >
            <option value="">Seleccionar Destino</option>
            {paradas.map(p => (
              <option key={p.id_parada} value={p.id_parada}>{p.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tipo de envío */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">Tipo de Envío *</label>
        <div className="flex flex-wrap gap-4 mb-4">
          <label className={`flex items-center space-x-2 p-3 rounded-lg border-2 ${formData.es_sobre ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600'}`}>
            <input
              type="checkbox"
              name="es_sobre"
              checked={formData.es_sobre}
              onChange={handleCheckboxChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
            />
            <span className="font-medium">Sobres</span>
          </label>

          <label className={`flex items-center space-x-2 p-3 rounded-lg border-2 ${formData.es_paquete ? 'border-green-500 bg-green-500/10' : 'border-gray-600'}`}>
            <input
              type="checkbox"
              name="es_paquete"
              checked={formData.es_paquete}
              onChange={handleCheckboxChange}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-5 w-5"
            />
            <span className="font-medium">Paquetes</span>
          </label>
        </div>
      </div>
      {/* Cantidad y Flete */}
      {(formData.es_sobre || formData.es_paquete) && (
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.es_sobre && (
            <div className="space-y-4 bg-gray-700/50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-400">Sobres</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Cantidad</label>
                  <input
                    type="number"
                    name="cantidad_sobre"
                    value={formData.cantidad_sobre}
                    onChange={handleChange}
                    onBlur={calculateTotal}
                    min="1"
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Precio unitario</label>
                  <input
                    type="number"
                    name="flete_sobre"
                    value={formData.flete_sobre}
                    onChange={handleChange}
                    onBlur={calculateTotal}
                    min="0"
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          )}

          {formData.es_paquete && (
            <div className="space-y-4 bg-gray-700/50 p-4 rounded-lg">
              <h4 className="font-medium text-green-400">Paquetes</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Cantidad</label>
                  <input
                    type="number"
                    name="cantidad_paquete"
                    value={formData.cantidad_paquete}
                    onChange={handleChange}
                    onBlur={calculateTotal}
                    min="1"
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Precio unitario</label>
                  <input
                    type="number"
                    name="flete_paquete"
                    value={formData.flete_paquete}
                    onChange={handleChange}
                    onBlur={calculateTotal}
                    min="0"
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Total */}
      <div className="md:col-span-2 bg-gray-800 p-3 rounded-lg">
        <label className="block text-sm font-medium mb-1">Total a Pagar</label>
        <input
          type="text"
          name="total"
          value={formData.total}
          readOnly
          className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2 font-bold text-lg"
        />
      </div>

      {/* Descripción */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={2} 
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 resize-none"
          required
          disabled={loading}
        />
      </div>
      {/* Botones */}
      <div className="md:col-span-2 flex justify-end mt-2 space-x-2">
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-2 rounded-md"
            disabled={loading}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md"
          disabled={loading}
        >
          {loading ? 'Procesando...' : editingId ? 'Actualizar' : 'Agregar'}
        </button>
      </div>
    </form>
  );
};

export default EncomiendaForm;
