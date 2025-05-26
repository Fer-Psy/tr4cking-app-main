// types/encomiendas.d.ts
import { ReactNode } from 'react';

interface Cliente {
  id: number;
  razon_social: string;
  ruc: string;
  telefono?: string;
  direccion?: string;
}

interface Bus {
  placa: string;
  empresa: {
    nombre: string;
  };
}

interface Viaje {
  id_viaje: number;
  bus: Bus;
  fecha: string;
}

interface Parada {
  id_parada: number;
  nombre: string;
  direccion?: string;
}

interface FormDataEncomienda {
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

interface Encomienda {
  id_encomienda: number;
  cliente: Cliente | number;
  viaje: Viaje | number;
  origen: Parada | number;
  destino: Parada | number;
  tipo_envio: 'sobre' | 'paquete' | 'ambos';
  cantidad_sobre: number;
  cantidad_paquete: number;
  flete: number;
  remitente: string;
  ruc_ci: string;
  numero_contacto: string;
  descripcion: string;
}

interface PreviewData {
  clienteData?: {
    nombre: string;
    ruc: string;
    telefono?: string;
    direccion?: string;
  };
  viajeData?: {
    id?: number;
    fecha?: string;
    bus?: {
      placa: string;
      empresa: string;
    };
  };
  origenData?: {
    nombre: string;
    direccion?: string;
  };
  destinoData?: {
    nombre: string;
    direccion?: string;
  };
  encomiendaData?: {
    tipo: string;
    cantidadSobres: number;
    cantidadPaquetes: number;
    descripcion: string;
    remitente: string;
    contacto: string;
    total: number;
  };
  ruc_ci?: string;
}

// Primero definimos las interfaces necesarias
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface ClienteApi {
  getAll(): Promise<ApiResponse<Cliente[]>>;
  getOne(id: number): Promise<ApiResponse<Cliente>>;
}

interface ViajeApi {
  getAll(): Promise<ApiResponse<Viaje[]>>;
  getOne(id: number): Promise<ApiResponse<Viaje>>;
}

interface ParadaApi {
  getAll(): Promise<ApiResponse<Parada[]>>;
  getOne(id: number): Promise<ApiResponse<Parada>>;
}