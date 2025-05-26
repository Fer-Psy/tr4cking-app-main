export interface Persona {
  cedula: number;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  fecha_registro: string;
  es_usuario?: boolean;
  es_cliente?: boolean;
  es_empleado?: boolean;
  es_pasajero?: boolean;
}

export interface FormData {
  cedula: number;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
}