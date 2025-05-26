import React from 'react';
import Modal from 'react-modal';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { X, Printer, Loader2 } from 'lucide-react';
import EncomiendasPDF from './EncomiendasPDF';

Modal.setAppElement('#root');

interface ClienteData {
  nombre: string;
  ruc: string;
  telefono?: string;
  direccion?: string;
}

interface ViajeData {
  id: number;
  fecha: string;
  bus?: {
    placa: string;
    empresa: string;
  };
}

interface ParadaData {
  nombre: string;
  direccion: string;
}

interface EncomiendaData {
  tipo: string;
  cantidadSobres: number;
  cantidadPaquetes: number;
  descripcion: string;
  remitente: string;
  contacto: string;
  total: number;
}

interface PreviewData {
  clienteData?: ClienteData;
  viajeData?: ViajeData;
  origenData?: ParadaData;
  destinoData?: ParadaData;
  encomiendaData?: EncomiendaData;
  ruc_ci?: string;
  fechaEmision?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  previewData: PreviewData | null;
  isLoading?: boolean;
}

const EncomiendaModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  previewData,
  isLoading = false 
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Vista previa de encomienda"
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg w-[90%] max-w-4xl max-h-[90vh] overflow-auto outline-none shadow-xl border border-gray-200"
      overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-[1000] backdrop-blur-sm"
    >
      <div className="bg-white p-6 rounded-lg max-w-4xl mx-auto max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Detalles de Encomienda</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : previewData ? (
          <>
            {/* Sección de información - Reorganizada según el orden solicitado */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. Cliente y Destinatario */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg text-gray-700 mb-2">Cliente</h3>
                  <p className="text-gray-600">{previewData.clienteData?.nombre}</p>
                  <p className="text-gray-600">RUC: {previewData.clienteData?.ruc}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg text-gray-700 mb-2">Destinatario</h3>
                  <p className="text-gray-600">{previewData.encomiendaData?.remitente}</p>
                  <p className="text-gray-600">Contacto: {previewData.encomiendaData?.contacto}</p>
                  <p className="text-gray-600">RUC/CI: {previewData.ruc_ci}</p>
                </div>
              </div>

              {/* 2. Origen y Destino */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg text-gray-700 mb-2">Origen</h3>
                  <p className="text-gray-600">{previewData.origenData?.nombre}</p>
                  <p className="text-gray-600">{previewData.origenData?.direccion}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg text-gray-700 mb-2">Destino</h3>
                  <p className="text-gray-600">{previewData.destinoData?.nombre}</p>
                  <p className="text-gray-600">{previewData.destinoData?.direccion}</p>
                </div>
              </div>

              {/* 3. Viaje y Detalle de Envío */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg text-gray-700 mb-2">Viaje</h3>
                  <p className="text-gray-600">Bus: {previewData.viajeData?.bus?.placa}</p>
                  <p className="text-gray-600">Empresa: {previewData.viajeData?.bus?.empresa}</p>
                  <p className="text-gray-600">Fecha: {previewData.viajeData?.fecha}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg text-gray-700 mb-2">Detalle de Envío</h3>
                  <p className="text-gray-600">Tipo: {previewData.encomiendaData?.tipo}</p>
                  <p className="text-gray-600">Sobres: {previewData.encomiendaData?.cantidadSobres || 0}</p>
                  <p className="text-gray-600">Paquetes: {previewData.encomiendaData?.cantidadPaquetes || 0}</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    Total: Gs. {Number(previewData.encomiendaData?.total || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* 4. Descripción (ocupa todo el ancho) */}
              <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-700 mb-2">Descripción</h3>
                <p className="text-gray-600 whitespace-pre-line">{previewData.encomiendaData?.descripcion}</p>
              </div>
            </div>

            {/* Visor PDF */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg text-gray-700 mb-3">Vista Previa del Comprobante</h3>
              <div className="h-[60vh] border rounded-md shadow-inner bg-gray-50">
                <PDFViewer width="100%" height="100%">
                  <EncomiendasPDF data={previewData} />
                </PDFViewer>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center p-8 text-gray-500">
            No hay datos para mostrar
          </div>
        )}

        {/* Botones de acción */}
        <div className="mt-6 flex justify-end gap-3 border-t pt-4">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-5 py-2 rounded-md transition duration-200 flex items-center gap-2"
          >
            <X size={18} /> Cerrar
          </button>
          
          {previewData && (
            <PDFDownloadLink
              document={<EncomiendasPDF data={previewData} />}
              fileName={`encomienda_${previewData.viajeData?.id || 'generica'}.pdf`}
            >
              {({ loading }) => (
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md transition duration-200 flex items-center gap-2 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Printer size={18} /> Descargar PDF
                    </>
                  )}
                </button>
              )}
            </PDFDownloadLink>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EncomiendaModal;