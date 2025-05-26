import React, { useState } from 'react';
import axios from 'axios';
import { Persona } from './Personas/types/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  persona: Persona;
}

const EmpleadoForm: React.FC<Props> = ({ isOpen, onClose, persona }) => {
  const [formData, setFormData] = useState({
    cargo: '',
    fecha_ingreso: '',
    salario: '',
    departamento: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8000/api/empleados/`, {
        ...formData,
        cedula: persona.cedula
      });
      onClose();
    } catch (error) {
      console.error('Error al crear empleado:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Agregar como Empleado a {persona.nombre}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cargo</label>
            <input
              type="text"
              value={formData.cargo}
              onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Fecha de Ingreso</label>
            <input
              type="date"
              value={formData.fecha_ingreso}
              onChange={(e) => setFormData({ ...formData, fecha_ingreso: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Salario</label>
            <input
              type="number"
              value={formData.salario}
              onChange={(e) => setFormData({ ...formData, salario: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Departamento</label>
            <select
              value={formData.departamento}
              onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
              required
            >
              <option value="">Seleccione un departamento</option>
              <option value="VENTAS">Ventas</option>
              <option value="LOGISTICA">Logística</option>
              <option value="ADMINISTRACION">Administración</option>
              <option value="OPERACIONES">Operaciones</option>
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
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            >
              Agregar Empleado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmpleadoForm;