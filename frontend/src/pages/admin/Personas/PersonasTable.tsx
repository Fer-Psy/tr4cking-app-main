import React from 'react';
import { Edit, Trash2, UserPlus, Building2, BadgeCheck, Users } from 'lucide-react';
import { Persona } from './types/types';

interface Props {
  personas: Persona[];
  loading?: boolean;
  onUsuarioClick: (persona: Persona) => void;
  onClienteClick: (persona: Persona) => void;
  onEmpleadoClick: (persona: Persona) => void;
  onPasajeroClick: (persona: Persona) => void;
  onEdit: (id: number, persona: Partial<Persona>) => void;
  onDelete: (id: number) => void;
}

const PersonasTable: React.FC<Props> = ({
  personas,
  loading,
  onUsuarioClick,
  onClienteClick,
  onEmpleadoClick,
  onPasajeroClick,
  onEdit,
  onDelete
}) => {
  if (loading) {
    return <div className="text-center py-4">Cargando...</div>;
  }

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-600">
            <th className="px-4 py-3 text-left">Cédula</th>
            <th className="px-4 py-3 text-left">Nombre Completo</th>
            <th className="px-4 py-3 text-left">Teléfono</th>
            <th className="px-4 py-3 text-left">Dirección</th>
            <th className="px-4 py-3 text-left">Roles</th>
            <th className="px-4 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {personas.map((persona) => (
            <tr key={persona.cedula} className="border-t border-gray-600 hover:bg-gray-600">
              <td className="px-4 py-3">{persona.cedula}</td>
              <td className="px-4 py-3">
                {persona.nombre} {persona.apellido}
              </td>
              <td className="px-4 py-3">{persona.telefono}</td>
              <td className="px-4 py-3">{persona.direccion}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {persona.es_usuario && (
                    <span className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-400">
                      Usuario
                    </span>
                  )}
                  {persona.es_cliente && (
                    <span className="px-2 py-1 text-xs rounded bg-green-500/20 text-green-400">
                      Cliente
                    </span>
                  )}
                  {persona.es_empleado && (
                    <span className="px-2 py-1 text-xs rounded bg-yellow-500/20 text-yellow-400">
                      Empleado
                    </span>
                  )}
                  {persona.es_pasajero && (
                    <span className="px-2 py-1 text-xs rounded bg-purple-500/20 text-purple-400">
                      Pasajero
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-center gap-2">
                  {!persona.es_usuario && (
                    <button
                      onClick={() => onUsuarioClick(persona)}
                      className="text-blue-400 hover:text-blue-300"
                      title="Crear Usuario"
                    >
                      <UserPlus size={20} />
                    </button>
                  )}
                  {!persona.es_cliente && (
                    <button
                      onClick={() => onClienteClick(persona)}
                      className="text-green-400 hover:text-green-300"
                      title="Agregar como Cliente"
                    >
                      <Building2 size={20} />
                    </button>
                  )}
                  {!persona.es_empleado && (
                    <button
                      onClick={() => onEmpleadoClick(persona)}
                      className="text-yellow-400 hover:text-yellow-300"
                      title="Agregar como Empleado"
                    >
                      <BadgeCheck size={20} />
                    </button>
                  )}
                  {!persona.es_pasajero && (
                    <button
                      onClick={() => onPasajeroClick(persona)}
                      className="text-purple-400 hover:text-purple-300"
                      title="Agregar como Pasajero"
                    >
                      <Users size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(persona.cedula, persona)}
                    className="text-yellow-400 hover:text-yellow-300"
                    title="Editar"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => onDelete(persona.cedula)}
                    className="text-red-400 hover:text-red-300"
                    title="Eliminar"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PersonasTable;