import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PersonasForm from './PersonasForm';
import PersonasTable from './PersonasTable';
import UsuarioForm from '../UsuariosForm';
import ClienteForm from '../ClientesForm';
import EmpleadoForm from '../EmpleadosForm';
import PasajeroForm from '../PasajerosForm';
import { Persona } from './types/types';

const PERSONAS_API_URL = 'http://localhost:8000/api/personas/';

const Personas = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [isUsuarioModalOpen, setIsUsuarioModalOpen] = useState(false);
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);
  const [isEmpleadoModalOpen, setIsEmpleadoModalOpen] = useState(false);
  const [isPasajeroModalOpen, setIsPasajeroModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener todas las personas
  const fetchPersonas = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Persona[]>(PERSONAS_API_URL);
      setPersonas(response.data);
      setError(null);
    } catch (err) {
      console.error('Error al obtener personas:', err);
      setError('Error al cargar las personas');
    } finally {
      setLoading(false);
    }
  };

  // Función para crear una nueva persona
  const handleCreate = async (personaData: any) => {
    try {
      setLoading(true);
      // Si personaData no tiene fecha_registro, agregarla
      if (!personaData.fecha_registro) {
        personaData.fecha_registro = new Date().toISOString();
      }
      await axios.post(PERSONAS_API_URL, personaData);
      fetchPersonas(); // Recargar la lista después de crear
      setError(null);
    } catch (err) {
      console.error('Error al crear persona:', err);
      setError('Error al crear la persona');
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar una persona
  const handleUpdate = async (cedula: number, personaData: Partial<Persona>) => {
    try {
      setLoading(true);
      await axios.put(`${PERSONAS_API_URL}${cedula}/`, personaData);
      fetchPersonas(); // Recargar la lista después de actualizar
      setError(null);
    } catch (err) {
      console.error('Error al actualizar persona:', err);
      setError('Error al actualizar la persona');
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar una persona
  const handleDelete = async (cedula: number) => {
    if (!window.confirm('¿Está seguro de eliminar esta persona?')) return;
    
    try {
      setLoading(true);
      await axios.delete(`${PERSONAS_API_URL}${cedula}/`);
      fetchPersonas(); // Recargar la lista después de eliminar
      setError(null);
    } catch (err) {
      console.error('Error al eliminar persona:', err);
      setError('Error al eliminar la persona');
    } finally {
      setLoading(false);
    }
  };

  // Cargar personas al montar el componente
  useEffect(() => {
    fetchPersonas();
  }, []);

  return (
    <div className="bg-gray-800 text-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Gestión de Personas</h2>
      
      {error && (
        <div className="bg-red-500 text-white p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <PersonasForm 
        onSubmit={handleCreate}
        loading={loading}
      />
      
      <PersonasTable 
        personas={personas}
        loading={loading}
        onUsuarioClick={(persona: Persona) => {
          setSelectedPersona(persona);
          setIsUsuarioModalOpen(true);
        }}
        onClienteClick={(persona: Persona) => {
          setSelectedPersona(persona);
          setIsClienteModalOpen(true);
        }}
        onEmpleadoClick={(persona: Persona) => {
          setSelectedPersona(persona);
          setIsEmpleadoModalOpen(true);
        }}
        onPasajeroClick={(persona: Persona) => {
          setSelectedPersona(persona);
          setIsPasajeroModalOpen(true);
        }}
        onEdit={handleUpdate}
        onDelete={handleDelete}
      />

      {selectedPersona && (
        <>
          <UsuarioForm 
            isOpen={isUsuarioModalOpen}
            onClose={() => setIsUsuarioModalOpen(false)}
            persona={selectedPersona}
          />
          <ClienteForm
            isOpen={isClienteModalOpen} 
            onClose={() => setIsClienteModalOpen(false)}
            persona={selectedPersona}
          />
          <EmpleadoForm
            isOpen={isEmpleadoModalOpen}
            onClose={() => setIsEmpleadoModalOpen(false)}
            persona={selectedPersona}
          />
          <PasajeroForm
            isOpen={isPasajeroModalOpen}
            onClose={() => setIsPasajeroModalOpen(false)}
            persona={selectedPersona}
          />
        </>
      )}
    </div>
  );
};

export default Personas;