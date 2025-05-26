export interface PDFData {
  clienteData?: {
    nombre: string;
    ruc: string;
    telefono?: string;
    direccion?: string;
  };
  viajeData?: {
    fecha: string;
    bus?: {
      placa: string;
      empresa: string;
    };
  };
  encomiendaData?: {
    tipo: string;
    remitente: string;
    total: number;
    cantidadSobres?: number;
    cantidadPaquetes?: number;
    descripcion?: string;
    contacto?: string;
  };
}