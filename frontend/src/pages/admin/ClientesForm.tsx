import React, { useState } from 'react';
import axios from 'axios';
import { Persona } from './Personas/types/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  persona: Persona;
}

const ClienteForm: React.FC<Props> = ({ isOpen, onClose, persona }) => {
  const [formData, setFormData] = useState({
    ruc: '',
    razon_social: '',
    tipo_cliente: 'REGULAR'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8000/api/clientes/`, {
        ...formData,
        cedula: persona.cedula
      });
      onClose();
    } catch (error) {
      console.error('Error al crear cliente:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Agregar como Cliente a {persona.nombre}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">RUC</label>
            <input
              type="text"
              value={formData.ruc}
              onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Razón Social</label>
            <input
              type="text"
              value={formData.razon_social}
              onChange={(e) => setFormData({ ...formData, razon_social: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Cliente</label>
            <select
              value={formData.tipo_cliente}
              onChange={(e) => setFormData({ ...formData, tipo_cliente: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
            >
              <option value="REGULAR">Regular</option>
              <option value="VIP">VIP</option>
              <option value="CORPORATIVO">Corporativo</option>
            </select>
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
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Agregar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteForm;