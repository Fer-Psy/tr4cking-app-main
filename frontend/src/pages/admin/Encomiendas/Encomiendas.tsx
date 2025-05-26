import React, { useState } from 'react';
import EncomiendaForm from './EncomiendaForm';
import EncomiendaTable from './EncomiendaTable';
import EncomiendaModal from './EncomiendaModal';
import useEncomiendas from './useEncomiendas';

const Encomiendas: React.FC = () => {
  const {
  formData,
  setFormData,
  clientes,
  viajes,
  paradas,
  encomiendas,
  editingId,
  loading,
  error,
  handleChange,
  handleCheckboxChange,
  handleSubmit,
  resetForm,
  handleEdit,
  handleDelete,
  calcularTotal
} = useEncomiendas();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const handlePreview = (encomienda: any) => {
    const cliente = clientes.find(c => c.id === encomienda.cliente?.id || c.id === encomienda.cliente);
    const viaje = viajes.find(v => v.id_viaje === encomienda.viaje?.id_viaje || v.id_viaje === encomienda.viaje);
    const origenParada = paradas.find(p => p.id_parada === encomienda.origen?.parada?.id_parada || p.id_parada === encomienda.origen);
    const destinoParada = paradas.find(p => p.id_parada === encomienda.destino?.parada?.id_parada || p.id_parada === encomienda.destino);

    setPreviewData({
      ...encomienda,
      clienteData: cliente ? {
        nombre: cliente.razon_social,
        ruc: cliente.ruc,
        telefono: cliente.telefono,
        direccion: cliente.direccion
      } : null,
      viajeData: viaje ? {
        id: viaje.id_viaje,
        fecha: viaje.fecha,
        bus: viaje.bus ? {
          placa: viaje.bus.placa,
          empresa: viaje.bus.empresa?.nombre || 'N/A'
        } : null
      } : null,
      origenData: origenParada ? {
        nombre: origenParada.nombre,
        direccion: origenParada.direccion
      } : null,
      destinoData: destinoParada ? {
        nombre: destinoParada.nombre,
        direccion: destinoParada.direccion
      } : null,
      encomiendaData: {
        tipo: encomienda.tipo_envio,
        cantidadSobres: encomienda.cantidad_sobre,
        cantidadPaquetes: encomienda.cantidad_paquete,
        descripcion: encomienda.descripcion,
        remitente: encomienda.remitente,
        contacto: encomienda.numero_contacto,
        total: encomienda.flete
      },
      ruc_ci: encomienda.ruc_ci
    });
    setIsModalOpen(true);
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Gestión de Encomiendas</h2>

      <EncomiendaForm
        formData={formData}
        clientes={clientes}
        viajes={viajes}
        paradas={paradas}
        loading={loading}
        editingId={editingId}
        handleChange={handleChange}
        handleCheckboxChange={handleCheckboxChange} // ← AGREGAR
        handleSubmit={handleSubmit}
        resetForm={resetForm}
        calculateTotal={calcularTotal}
      />

      <EncomiendaTable
        encomiendas={encomiendas}
        clientes={clientes}
        viajes={viajes}
        paradas={paradas}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPreview={handlePreview}
      />

      <EncomiendaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        previewData={previewData}
      />
    </div>
  );
};

export default Encomiendas;
