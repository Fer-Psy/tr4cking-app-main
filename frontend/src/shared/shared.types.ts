export interface UsuarioDTO {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
    groups: number[]; // IDs de grupos
    date_joined: string; // ISO 8601 DateTime
    last_login: string | null; // ISO 8601 DateTime
  }
  
  export interface Grupo {
    id: number;
    name: string;
    permissions: number[]; // IDs de permisos
  }
  
  export interface Permiso {
    id: number;
    name: string;
    codename: string;
    content_type: number; // ID del tipo de contenido
  }

export interface Empresa {
    id: number;
    nombre: string;
    ruc: string;
    telefono: string;
    direccion_legal: string;
  }
  
  export interface Localidad {
    id: number;
    nombre: string;
    tipo: "ciudad" | "pueblo" | "parada";
    es_terminal: boolean;
    coordenadas: string;
  }
  
  export interface Agencia {
    id: number;
    empresa: number; // ID de Empresa
    localidad: number; // ID de Localidad
    nombre: string;
    telefono: string;
    es_principal: boolean;
  }
  
  export interface Ruta {
    id: number;
    origen: number | null; // ID de Localidad
    destino: number | null; // ID de Localidad
    codigo: string;
    duracion_estimada: string; // ISO 8601 Duration
    distancia_km: number;
    precio_base: number;
    activo: boolean;
    fecha_actualizacion: string; // ISO 8601 DateTime
  }
  
  export interface ParadaRuta {
    id: number;
    ruta: number; // ID de Ruta
    localidad: number; // ID de Localidad
    orden: number;
    es_principal: boolean;
  }
  
  export interface Bus {
    id: number;
    agencia: number; // ID de Agencia
    placa: string;
    marca: string;
    modelo: string;
    capacidad: number;
    estado: "activo" | "mantenimiento" | "inactivo";
  }
  
  export interface Cliente {
    id: number;
    usuario: number | null; // ID de Usuario
    cedula: string;
    ruc: string | null;
    dv: string | null;
    telefono: string;
    direccion: string;
    fecha_registro: string; // ISO 8601 DateTime
    registrado_por_empleado: boolean;
  }
  
  export interface Empleado {
    id: number;
    usuario: number; // ID de Usuario
    agencia: number; // ID de Agencia
    cargo: string;
    fecha_contratacion: string; // ISO 8601 Date
  }
  
  export interface Asiento {
    id: number;
    bus: number; // ID de Bus
    numero_asiento: number;
    tipo: "ejecutivo" | "semi-cama" | "cama";
  }
  
  export interface Horario {
    id: number;
    ruta: number; // ID de Ruta
    hora_salida: string; // ISO 8601 Time
    dias_semana: string; // LMMJVSD (e.g., "1111100")
    activo: boolean;
  }
  
  export interface Viaje {
    id: number;
    ruta: number; // ID de Ruta
    bus: number; // ID de Bus
    fecha: string; // ISO 8601 Date
    estado: "programado" | "en_ruta" | "finalizado" | "cancelado";
  }
  
  export interface Servicio {
    id: number;
    cliente: number; // ID de Cliente
    viaje: number; // ID de Viaje
    tipo: "pasaje" | "encomienda";
    asiento: number | null; // ID de Asiento
    fecha_creacion: string; // ISO 8601 DateTime
    detalles: Record<string, any>; // JSON Field
  }
  
  export interface TipoDocumento {
    id: number;
    nombre: string;
    codigo: string;
    descripcion: string;
    requiere_cliente_registrado: boolean;
  }
  
  export interface Timbrado {
    id: number;
    numero_timbrado: string;
    fecha_inicio: string; // ISO 8601 Date
    fecha_fin: string; // ISO 8601 Date
    activo: boolean;
  }
  
  export interface CabeceraFactura {
    id: number;
    cliente: number | null; // ID de Cliente
    empleado: number; // ID de Empleado
    tipo_documento: number; // ID de TipoDocumento
    timbrado: number; // ID de Timbrado
    agencia: number; // ID de Agencia
    numero_factura: string;
    fecha_emision: string; // ISO 8601 DateTime
    monto_total: number;
    monto_iva_10: number;
    monto_iva_5: number;
    estado: "emitida" | "anulada";
  }
  
  export interface DetalleFactura {
    id: number;
    factura: number; // ID de CabeceraFactura
    servicio: number; // ID de Servicio
    cantidad: number;
    precio_unitario: number;
    descripcion: string;
    iva_porcentaje: number; // 10, 5, or 0
    subtotal: number;
  }