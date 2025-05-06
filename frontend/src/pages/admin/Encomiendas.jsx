import React, { useState, useEffect } from 'react';
import { Edit, Trash } from "lucide-react";
import axios from 'axios';

const Encomiendas = () => {
    const [formData, setFormData] = useState({
        cliente: '',
        viaje: '',
        origen: '',
        destino: '',
        flete: '',
        descripcion: ''
    });

    const [clientes, setClientes] = useState([]);
    const [viajes, setViajes] = useState([]);
    const [paradas, setParadas] = useState([]);
    const [encomiendas, setEncomiendas] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const [clientesRes, viajesRes, paradasRes, encomiendasRes] = await Promise.all([
                    axios.get('/api/clientes/'),
                    axios.get('/api/viajes/'),
                    axios.get('/api/paradas/'),
                    axios.get('/api/encomiendas/')
                ]);

                setClientes(clientesRes.data);
                setViajes(viajesRes.data);
                setParadas(paradasRes.data);
                setEncomiendas(encomiendasRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Error al cargar los datos. Por favor intente nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            if (editingId) {
                await axios.put(`/api/encomiendas/${editingId}/`, formData);
            } else {
                await axios.post('/api/encomiendas/', formData);
            }
            
            // Recargar datos después de guardar
            const encomiendasRes = await axios.get('/api/encomiendas/');
            setEncomiendas(encomiendasRes.data);
            resetForm();
        } catch (err) {
            console.error('Error saving data:', err);
            setError('Error al guardar los datos. Por favor intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (encomienda) => {
        setFormData({
            cliente: encomienda.cliente?.id || encomienda.cliente,
            viaje: encomienda.viaje?.id_viaje || encomienda.viaje,
            origen: encomienda.origen?.id || encomienda.origen,
            destino: encomienda.destino?.id || encomienda.destino,
            flete: encomienda.flete,
            descripcion: encomienda.descripcion
        });
        setEditingId(encomienda.id_encomienda);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta encomienda?')) {
            try {
                setLoading(true);
                await axios.delete(`/api/encomiendas/${id}/`);
                const encomiendasRes = await axios.get('/api/encomiendas/');
                setEncomiendas(encomiendasRes.data);
            } catch (err) {
                console.error('Error deleting data:', err);
                setError('Error al eliminar la encomienda. Por favor intente nuevamente.');
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            cliente: '',
            viaje: '',
            origen: '',
            destino: '',
            flete: '',
            descripcion: ''
        });
        setEditingId(null);
    };

    if (loading && !encomiendas.length) {
        return <div className="p-6 text-center">Cargando...</div>;
    }

    if (error) {
        return (
            <div className="p-6 text-center text-red-500">
                {error}
                <button 
                    onClick={() => window.location.reload()} 
                    className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
                >
                    Recargar
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 text-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Gestión de Encomiendas</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cliente */}
                <div>
                    <label className="block text-sm font-medium mb-1">Cliente</label>
                    <select
                        name="cliente"
                        value={formData.cliente}
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={loading}
                    >
                        <option value="">Seleccionar Cliente</option>
                        {clientes.map(c => (
                            <option key={c.id} value={c.id}>{c.razon_social}</option>
                        ))}
                    </select>
                </div>

                {/* Viaje */}
                <div>
                    <label className="block text-sm font-medium mb-1">Viaje</label>
                    <select
                        name="viaje"
                        value={formData.viaje}
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={loading}
                    >
                        <option value="">Seleccionar Viaje</option>
                        {paradas.map(p => (
                            <option key={p.id_parada} value={p.id_parada}>{p.nombre}</option>
                        ))}
                    </select>
                </div>

                {/* Origen */}
                <div>
                    <label className="block text-sm font-medium mb-1">Origen</label>
                    <select
                        name="origen"
                        value={formData.origen}
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={loading}
                    >
                        <option value="">Seleccionar Origen</option>
                        {paradas.map(p => (
                            <option key={p.id_parada} value={p.id_parada}>{p.nombre}</option>
                        ))}
                    </select>
                </div>

                {/* Destino */}
                <div>
                    <label className="block text-sm font-medium mb-1">Destino</label>
                    <select
                        name="destino"
                        value={formData.destino}
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={loading}
                    >
                        <option value="">Seleccionar Destino</option>
                        {paradas.map(p => (
                            <option key={p.id_parada} value={p.id_parada}>{p.nombre}</option>
                        ))}
                    </select>
                </div>

                {/* Flete */}
                <div>
                    <label className="block text-sm font-medium mb-1">Flete</label>
                    <input
                        type="number"
                        name="flete"
                        value={formData.flete}
                        onChange={handleChange}
                        placeholder="Gs."
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        min="0"
                        disabled={loading}
                    />
                </div>

                {/* Descripción */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Descripción</label>
                    <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Detalles del paquete..."
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={loading}
                    />
                </div>

                {/* Botones */}
                <div className="md:col-span-2 flex justify-end mt-2 space-x-2">
                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-2 rounded-md transition duration-200"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                    )}
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition duration-200"
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : editingId ? 'Actualizar' : 'Agregar'}
                    </button>
                </div>
            </form>

            {/* Tabla de encomiendas */}
            <div className="w-full overflow-x-auto py-6">
                <h3 className="text-lg font-semibold mb-2 text-white">Lista de Encomiendas</h3>
                {loading && encomiendas.length > 0 ? (
                    <p className="text-center py-4">Actualizando lista...</p>
                ) : encomiendas.length === 0 ? (
                    <p className="text-gray-400">No hay encomiendas registradas</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse bg-white dark:bg-gray-800 shadow-md">
                            <thead>
                                <tr className="bg-gray-200 dark:bg-gray-700 dark:text-white">
                                    <th className="p-2 text-left">Cliente</th>
                                    <th className="p-2 text-left">Viaje</th>
                                    <th className="p-2 text-left">Origen</th>
                                    <th className="p-2 text-left">Destino</th>
                                    <th className="p-2 text-left">Flete</th>
                                    <th className="p-2 text-left">Descripción</th>
                                    <th className="p-2 text-left">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {encomiendas.map((enc) => {
                                    const cliente = clientes.find(c => c.id === enc.cliente?.id || c.id === enc.cliente);
                                    const viaje = viajes.find(p => p.id_parada === enc.origen?.parada?.id_parada || p.id_parada === enc.origen);
                                    const origenParada = paradas.find(p => p.id_parada === enc.origen?.parada?.id_parada || p.id_parada === enc.origen);
                                    const destinoParada = paradas.find(p => p.id_parada === enc.destino?.parada?.id_parada || p.id_parada === enc.destino);

                                    return (
                                        <tr key={enc.id_encomienda} className="border-t dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <td className="p-2">{cliente?.razon_social || 'N/A'}</td>
                                            <td className="p-2">
                                                {viaje ? `Bus ${viaje.bus?.placa || 'N/A'} - ${viaje.fecha}` : 'N/A'}
                                            </td>
                                            <td className="p-2">{origenParada?.nombre || 'N/A'}</td>
                                            <td className="p-2">{destinoParada?.nombre || 'N/A'}</td>
                                            <td className="p-2">{enc.flete ? `Gs. ${parseInt(enc.flete).toLocaleString()}` : 'N/A'}</td>
                                            <td className="p-2">{enc.descripcion || 'N/A'}</td>
                                            <td className="p-2 flex space-x-2">
                                                <button
                                                    className="text-yellow-500 hover:text-yellow-600 transition disabled:opacity-50"
                                                    aria-label="Editar"
                                                    onClick={() => handleEdit(enc)}
                                                    disabled={loading}
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    className="text-red-500 hover:text-red-600 transition disabled:opacity-50"
                                                    aria-label="Eliminar"
                                                    onClick={() => handleDelete(enc.id_encomienda)}
                                                    disabled={loading}
                                                >
                                                    <Trash size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Encomiendas;