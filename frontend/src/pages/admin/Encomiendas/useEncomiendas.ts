import { useState, useEffect } from 'react';
import createApi from '../../../api/apiEnc';





const encomiendasApi = createApi('encomiendas');
const clientesApi = createApi('clientes');
const viajesApi = createApi('viajes');
const paradasApi = createApi('paradas');

export interface FormData {
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

export const defaultFormData: FormData = {
  cliente: '',
  viaje: '',
  origen: '',
  destino: '',
  flete_sobre: '25000',
  flete_paquete: '40000',
  cantidad_sobre: '1',
  cantidad_paquete: '1',
  descripcion: '',
  remitente: '',
  ruc_ci: '',
  numero_contacto: '',
  es_sobre: false,
  es_paquete: false,
  total: '0'
};

export default function useEncomiendas() {
  const [formData, setFormData] = useState<FormData>({ ...defaultFormData });
  const [clientes, setClientes] = useState<any[]>([]);
  const [viajes, setViajes] = useState<any[]>([]);
  const [paradas, setParadas] = useState<any[]>([]);
  const [encomiendas, setEncomiendas] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const total = calcularTotal();
    setFormData(prev => ({ ...prev, total: total.toString() }));
  }, [
    formData.es_sobre,
    formData.es_paquete,
    formData.cantidad_sobre,
    formData.cantidad_paquete,
    formData.flete_sobre,
    formData.flete_paquete
  ]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [clientesRes, viajesRes, paradasRes, encomiendasRes] = await Promise.all([
        clientesApi.getAll(),
        viajesApi.getAll(),
        paradasApi.getAll(),
        encomiendasApi.getAll()
      ]);
      setClientes(clientesRes.data);
      setViajes(viajesRes.data);
      setParadas(paradasRes.data);
      setEncomiendas(encomiendasRes.data);
    } catch (err) {
      console.error('Error al cargar los datos', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const calcularTotal = () => {
    let total = 0;
    if (formData.es_sobre) {
      total += parseInt(formData.cantidad_sobre || '0') * parseInt(formData.flete_sobre || '0');
    }
    if (formData.es_paquete) {
      total += parseInt(formData.cantidad_paquete || '0') * parseInt(formData.flete_paquete || '0');
    }
    return total;
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (type === 'checkbox' && name === 'es_sobre' && !checked) {
      setFormData(prev => ({ ...prev, cantidad_sobre: '0' }));
    }
    if (type === 'checkbox' && name === 'es_paquete' && !checked) {
      setFormData(prev => ({ ...prev, cantidad_paquete: '0' }));
    }
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, checked } = e.target;

  setFormData(prev => ({
    ...prev,
    [name]: checked
  }));

  // Reiniciar cantidad si se desmarca
  if (name === 'es_sobre' && !checked) {
    setFormData(prev => ({ ...prev, cantidad_sobre: '0' }));
  }
  if (name === 'es_paquete' && !checked) {
    setFormData(prev => ({ ...prev, cantidad_paquete: '0' }));
  }
};


  const resetForm = () => {
    setFormData({ ...defaultFormData });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validaciones iniciales...
  if (!formData.es_sobre && !formData.es_paquete) {
    alert('Por favor seleccione al menos un tipo de envío (Sobre o Paquete)');
    return;
  }
  
  if (formData.es_sobre && parseInt(formData.cantidad_sobre) <= 0) {
    alert('La cantidad de sobres debe ser mayor que 0');
    return;
  }
  
  if (formData.es_paquete && parseInt(formData.cantidad_paquete) <= 0) {
    alert('La cantidad de paquetes debe ser mayor que 0');
    return;
  }

  // Convertir y validar IDs
  const viajeId = parseInt(formData.viaje) || null;
  const clienteId = parseInt(formData.cliente) || null;
  const origenId = parseInt(formData.origen) || null;
  const destinoId = parseInt(formData.destino) || null;

  // Verificar que todos los IDs sean válidos
  if (!viajeId || !clienteId || !origenId || !destinoId) {
    alert('Por favor seleccione todos los campos requeridos');
    return;
  }

  // Verificar que las paradas existan
  const origenExists = paradas.some(parada => parada.id_parada === origenId);
  const destinoExists = paradas.some(parada => parada.id_parada === destinoId);

  if (!origenExists || !destinoExists) {
    alert('Las paradas seleccionadas no son válidas');
    return;
  }

  const dataToSend = {
    viaje: viajeId,
    cliente: clienteId,
    origen: origenId,
    destino: destinoId,
    flete: calcularTotal(),
    remitente: formData.remitente.trim(),
    ruc_ci: formData.ruc_ci.trim(),
    numero_contacto: formData.numero_contacto.trim(),
    tipo_envio: formData.es_sobre && formData.es_paquete ? 'ambos' : formData.es_sobre ? 'sobre' : 'paquete',
    cantidad_sobre: formData.es_sobre ? parseInt(formData.cantidad_sobre) || 0 : 0,
    cantidad_paquete: formData.es_paquete ? parseInt(formData.cantidad_paquete) || 0 : 0,
    descripcion: formData.descripcion.trim()
  };

  console.log('Datos a enviar:', dataToSend);
  console.log('Paradas disponibles:', paradas);
  console.log('Origen ID:', origenId, 'Destino ID:', destinoId);

  try {
    setLoading(true);
    if (editingId) {
      await encomiendasApi.update(editingId, dataToSend as any);
    } else {
      await encomiendasApi.create(dataToSend);
    }
    await fetchData();
    resetForm();
  } catch (err: any) {
    console.error('Error completo:', err);
    console.error('Respuesta del servidor:', err.response?.data);
    let errorMessage = 'Error al guardar los datos';
    if (err.response?.data) {
      errorMessage = typeof err.response.data === 'object' 
        ? Object.entries(err.response.data)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n')
        : err.response.data;
    }
    alert(errorMessage);
  } finally {
    setLoading(false);
  }
};

  const handleEdit = (encomienda: any) => {
    const isSobre = encomienda.tipo_envio === 'sobre' || encomienda.tipo_envio === 'ambos';
    const isPaquete = encomienda.tipo_envio === 'paquete' || encomienda.tipo_envio === 'ambos';
    setFormData({
      cliente: encomienda.cliente?.id?.toString() || encomienda.cliente?.toString() || '',
      viaje: encomienda.viaje?.id_viaje?.toString() || encomienda.viaje?.toString() || '',
      origen: encomienda.origen?.id?.toString() || encomienda.origen?.toString() || '',
      destino: encomienda.destino?.id?.toString() || encomienda.destino?.toString() || '',
      flete_sobre: '25000',
      flete_paquete: '40000',
      cantidad_sobre: isSobre ? (encomienda.cantidad_sobre?.toString() || '1') : '0',
      cantidad_paquete: isPaquete ? (encomienda.cantidad_paquete?.toString() || '1') : '0',
      descripcion: encomienda.descripcion || '',
      remitente: encomienda.remitente || '',
      ruc_ci: encomienda.ruc_ci || '',
      numero_contacto: encomienda.numero_contacto || '',
      es_sobre: isSobre,
      es_paquete: isPaquete,
      total: encomienda.flete?.toString() || '0'
    });
    setEditingId(encomienda.id_encomienda);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar esta encomienda?')) return;
    try {
      setLoading(true);
      await encomiendasApi.delete(id);
      await fetchData();
      alert('Encomienda eliminada correctamente');
    } catch (err) {
      console.error('Error al eliminar', err);
      alert('Error al eliminar la encomienda');
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
