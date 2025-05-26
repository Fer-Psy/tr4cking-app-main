import React, { useState } from 'react';
import axios from 'axios';
import { Persona } from './Personas/types/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  persona: Persona;
}

const PasajeroForm: React.FC<Props> = ({ isOpen, onClose, persona }) => {
  const [formData, setFormData] = useState({
    tipo_pasajero: 'REGULAR',
    necesidades_especiales: '',
    contacto_emergencia: '',
    telefono_emergencia: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8000/api/pasajeros/`, {
        ...formData,
        cedula: persona.cedula
      });
      onClose();
    } catch (error) {
      console.error('Error al crear pasajero:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Agregar como Pasajero a {persona.nombre}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Pasajero</label>
            <select
              value={formData.tipo_pasajero}
              onChange={(e) => setFormData({ ...formData, tipo_pasajero: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
              required
            >
              <option value="REGULAR">Regular</option>
              <option value="FRECUENTE">Frecuente</option>
              <option value="VIP">VIP</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Necesidades Especiales</label>
            <textarea
              value={formData.necesidades_especiales}
              onChange={(e) => setFormData({ ...formData, necesidades_especiales: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contacto de Emergencia</label>
            <input
              type="text"
              value={formData.contacto_emergencia}
              onChange={(e) => setFormData({ ...formData, contacto_emergencia: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Teléfono de Emergencia</label>
            <input
              type="tel"
              value={formData.telefono_emergencia}
              onChange={(e) => setFormData({ ...formData, telefono_emergencia: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
            >
              Agregar Pasajero
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasajeroForm;