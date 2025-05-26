import React, { useState } from 'react';
import { FormData } from './types/types';

interface Props {
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
  initialData?: FormData;
}

const PersonasForm: React.FC<Props> = ({ onSubmit, loading, initialData }) => {
  const [formData, setFormData] = useState<FormData>(initialData || {
    cedula: 0,
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    if (!initialData) resetForm();
  };

  const resetForm = () => {
    setFormData({
      cedula: 0,
      nombre: '',
      apellido: '',
      telefono: '',
      direccion: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Cédula</label>
          <input
            type="number"
            value={formData.cedula || ''}
            onChange={(e) => setFormData({ ...formData, cedula: parseInt(e.target.value) })}
            className="w-full bg-gray-600 border border-gray-500 rounded-md px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nombres</label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="w-full bg-gray-600 border border-gray-500 rounded-md px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Apellidos</label>
          <input
            type="text"
            value={formData.apellido}
            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
            className="w-full bg-gray-600 border border-gray-500 rounded-md px-3 py-2"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Teléfono</label>
          <input
            type="tel"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            className="w-full bg-gray-600 border border-gray-500 rounded-md px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Dirección</label>
          <input
            type="text"
            value={formData.direccion}
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            className="w-full bg-gray-600 border border-gray-500 rounded-md px-3 py-2"
            required
          />
        </div>
      </div>

      <div className="md:col-span-2 flex justify-end space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'} Persona
        </button>
      </div>
    </form>
  );
};

export default PersonasForm;