import React, { useState, useEffect } from 'react';
import { Edit, Trash, X, Eye, Printer } from "lucide-react";
import createApi from "../../api/apiAll";
import EncomiendasPDF from './EncomiendasPDF';
import Modal from 'react-modal';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

Modal.setAppElement('#root');

const encomiendasApi = createApi("encomiendas");

const Encomiendas = () => {
    const [formData, setFormData] = useState({
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
    });

    const [clientes, setClientes] = useState([]);
    const [viajes, setViajes] = useState([]);
    const [paradas, setParadas] = useState([]);
    const [encomiendas, setEncomiendas] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [previewData, setPreviewData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const clientesApi = createApi("clientes");
                const viajesApi = createApi("viajes");
                const paradasApi = createApi("paradas");
                const encomiendasApi = createApi("encomiendas");

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
                console.error('Error fetching data:', err);
                setError('Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const calcularTotal = () => {
        let total = 0;

        if (formData.es_sobre) {
            total += parseInt(formData.cantidad_sobre || 0) * parseInt(formData.flete_sobre || 0);
        }

        if (formData.es_paquete) {
            total += parseInt(formData.cantidad_paquete || 0) * parseInt(formData.flete_paquete || 0);
        }

        return total;
    };

    useEffect(() => {
        const nuevoTotal = calcularTotal();
        setFormData(prev => ({
            ...prev,
            total: nuevoTotal.toString()
        }));
    }, [
        formData.es_sobre,
        formData.es_paquete,
        formData.cantidad_sobre,
        formData.cantidad_paquete,
        formData.flete_sobre,
        formData.flete_paquete
    ]);

    const handleChange = (e) => {
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

    const resetForm = () => {
        setFormData({
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
        });
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.es_sobre && !formData.es_paquete) {
            alert('Debe seleccionar al menos un tipo de envío (Sobre o Paquete)');
            return;
        }

        try {
            setLoading(true);

            const dataToSend = {
                viaje: formData.viaje,
                cliente: formData.cliente,
                origen: formData.origen,
                destino: formData.destino,
                flete: parseFloat(formData.total),
                remitente: formData.remitente,
                ruc_ci: formData.ruc_ci,
                numero_contacto: formData.numero_contacto,
                tipo_envio: formData.es_sobre && formData.es_paquete ? 'ambos' :
                    formData.es_sobre ? 'sobre' : 'paquete',
                cantidad_sobre: formData.es_sobre ? parseInt(formData.cantidad_sobre) : 0,
                cantidad_paquete: formData.es_paquete ? parseInt(formData.cantidad_paquete) : 0,
                descripcion: formData.descripcion
            };

            if (editingId) {
                await encomiendasApi.update(editingId, dataToSend);
            } else {
                await encomiendasApi.create(dataToSend);
            }

            const response = await encomiendasApi.getAll();
            setEncomiendas(response.data);

            alert(editingId ? 'Encomienda actualizada correctamente' : 'Encomienda creada correctamente');
            resetForm();
        } catch (err) {
            console.error('Error saving data:', err);
            let errorMessage = 'Error al guardar los datos';
            if (err.response) {
                if (err.response.data) {
                    if (typeof err.response.data === 'object') {
                        errorMessage = Object.values(err.response.data).join('\n');
                    } else {
                        errorMessage += `: ${err.response.data}`;
                    }
                }
            }
            setError(errorMessage);
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (encomienda) => {
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

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar esta encomienda?')) {
            try {
                setLoading(true);
                await encomiendasApi.delete(id);
                const response = await encomiendasApi.getAll();
                setEncomiendas(response.data);
                alert('Encomienda eliminada correctamente');
            } catch (error) {
                console.error('Error deleting data:', error);
                setError('Error al eliminar la encomienda');
            } finally {
                setLoading(false);
            }
        }
    };

    const handlePreview = (encomienda) => {
        const cliente = clientes.find(c => c.id === encomienda.cliente?.id || c.id === encomienda.cliente);
        const viaje = viajes.find(v => v.id_viaje === encomienda.viaje?.id_viaje || v.id_viaje === encomienda.viaje);
        const origenParada = paradas.find(p => p.id_parada === encomienda.origen?.parada?.id_parada || p.id_parada === encomienda.origen);
        const destinoParada = paradas.find(p => p.id_parada === encomienda.destino?.parada?.id_parada || p.id_parada === encomienda.destino);

        setPreviewData({
            ...encomienda,
            clienteData: cliente ? {
                nombre: cliente.razon_social,
                ruc: cliente.ruc,
                telefono: cliente.telefono,
                direccion: cliente.direccion
            } : null,
            viajeData: viaje ? {
                id: viaje.id_viaje,
                fecha: viaje.fecha,
                bus: viaje.bus ? {
                    placa: viaje.bus.placa,
                    empresa: viaje.bus.empresa?.nombre || 'N/A'
                } : null
            } : null,
            origenData: origenParada ? {
                nombre: origenParada.nombre,
                direccion: origenParada.direccion
            } : null,
            destinoData: destinoParada ? {
                nombre: destinoParada.nombre,
                direccion: destinoParada.direccion
            } : null,
            encomiendaData: {
                tipo: encomienda.tipo_envio,
                cantidadSobres: encomienda.cantidad_sobre,
                cantidadPaquetes: encomienda.cantidad_paquete,
                descripcion: encomienda.descripcion,
                remitente: encomienda.remitente,
                contacto: encomienda.numero_contacto,
                total: encomienda.flete
            }
        });

        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="bg-gray-800 text-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Gestión de Encomiendas</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cliente y Viaje */}
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
                        {viajes.map((viaje) => (
                            <option key={viaje.id_viaje} value={viaje.id_viaje}>
                                {viaje.id_viaje} - Empresa: {viaje.bus.empresa.nombre} - Placa: {viaje.bus.placa.toUpperCase()} - Fecha: {viaje.fecha}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Información del Remitente */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Destinatario</label>
                        <input
                            type="text"
                            name="remitente"
                            value={formData.remitente}
                            onChange={handleChange}
                            placeholder="Nombre del Destinatario"
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">RUC/CI</label>
                        <input
                            type="text"
                            name="ruc_ci"
                            value={formData.ruc_ci}
                            onChange={handleChange}
                            placeholder="RUC o Cédula"
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Contacto</label>
                        <input
                            type="text"
                            name="numero_contacto"
                            value={formData.numero_contacto}
                            onChange={handleChange}
                            placeholder="Número de teléfono"
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Origen y Destino */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                {/* Tipo de envío */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Tipo de Envío</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Casilla de Sobre */}
                        <div className="p-3 border border-gray-600 rounded-md">
                            <div className="flex items-center space-x-2 mb-2">
                                <input
                                    type="checkbox"
                                    id="es_sobre"
                                    name="es_sobre"
                                    checked={formData.es_sobre}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-blue-500 rounded"
                                    disabled={loading}
                                />
                                <label htmlFor="es_sobre" className="font-medium">Sobre</label>
                            </div>

                            {formData.es_sobre && (
                                <div className="space-y-2 pl-7">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Monto por sobre</label>
                                        <input
                                            type="number"
                                            name="flete_sobre"
                                            value={formData.flete_sobre}
                                            onChange={handleChange}
                                            min="0"
                                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled={loading}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Cantidad de sobres</label>
                                        <input
                                            type="number"
                                            name="cantidad_sobre"
                                            value={formData.cantidad_sobre}
                                            onChange={handleChange}
                                            min="0"
                                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Casilla de Paquete */}
                        <div className="p-3 border border-gray-600 rounded-md">
                            <div className="flex items-center space-x-2 mb-2">
                                <input
                                    type="checkbox"
                                    id="es_paquete"
                                    name="es_paquete"
                                    checked={formData.es_paquete}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-blue-500 rounded"
                                    disabled={loading}
                                />
                                <label htmlFor="es_paquete" className="font-medium">Paquete</label>
                            </div>

                            {formData.es_paquete && (
                                <div className="space-y-2 pl-7">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Monto por paquete</label>
                                        <input
                                            type="number"
                                            name="flete_paquete"
                                            value={formData.flete_paquete}
                                            onChange={handleChange}
                                            min="0"
                                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled={loading}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Cantidad de paquetes</label>
                                        <input
                                            type="number"
                                            name="cantidad_paquete"
                                            value={formData.cantidad_paquete}
                                            onChange={handleChange}
                                            min="0"
                                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Total */}
                <div className="md:col-span-2 bg-gray-700 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">Total a Pagar:</span>
                        <span className="text-xl font-bold">
                            Gs. {parseInt(formData.total || 0).toLocaleString()}
                        </span>
                    </div>
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
                                    <th className="p-2 text-left">Tipo</th>
                                    <th className="p-2 text-left">Cantidad</th>
                                    <th className="p-2 text-left">Total</th>
                                    <th className="p-2 text-left">Destinatario</th>
                                    <th className="p-2 text-left">Contacto</th>
                                    <th className="p-2 text-left">Descripción</th>
                                    <th className="p-2 text-left">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {encomiendas.map((enc) => {
                                    const cliente = clientes.find(c => c.id === enc.cliente?.id || c.id === enc.cliente);
                                    const viaje = viajes.find(v => v.id_viaje === enc.viaje?.id_viaje || v.id_viaje === enc.viaje);
                                    const origenParada = paradas.find(p => p.id_parada === enc.origen?.parada?.id_parada || p.id_parada === enc.origen);
                                    const destinoParada = paradas.find(p => p.id_parada === enc.destino?.parada?.id_parada || p.id_parada === enc.destino);

                                    return (
                                        <tr key={enc.id_encomienda} className="border-t dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <td className="p-2">{cliente?.razon_social || 'N/A'}</td>
                                            <td className="p-2">
                                                {viaje ? `Bus ${viaje.bus.empresa.nombre || 'N/A'} - ${viaje.bus?.placa || 'N/A'} - ${viaje.fecha}` : 'N/A'}
                                            </td>
                                            <td className="p-2">{origenParada?.nombre || 'N/A'}</td>
                                            <td className="p-2">{destinoParada?.nombre || 'N/A'}</td>
                                            <td className="p-2 capitalize">{enc.tipo_envio || 'N/A'}</td>
                                            <td className="p-2">
                                                {enc.tipo_envio === 'sobre' ? enc.cantidad_sobre :
                                                    enc.tipo_envio === 'paquete' ? enc.cantidad_paquete :
                                                        `${enc.cantidad_sobre} sobres, ${enc.cantidad_paquete} paquetes`}
                                            </td>
                                            <td className="p-2">{enc.flete ? `Gs. ${parseInt(enc.flete).toLocaleString()}` : 'N/A'}</td>
                                            <td className="p-2">
                                                <div>{enc.remitente || 'N/A'}</div>
                                                <div className="text-sm text-gray-500">{enc.ruc_ci || ''}</div>
                                            </td>
                                            <td className="p-2">{enc.numero_contacto || 'N/A'}</td>
                                            <td className="p-2 max-w-xs truncate">{enc.descripcion || 'N/A'}</td>
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
                                                <button
                                                    className="text-blue-500 hover:text-blue-600 transition disabled:opacity-50"
                                                    aria-label="Vista previa"
                                                    onClick={() => handlePreview(enc)}
                                                    disabled={loading}
                                                >
                                                    <Eye size={16} />
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

            {/* Modal de vista previa */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Vista previa de encomienda"
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg w-[90%] max-w-4xl max-h-[90vh] overflow-auto outline-none shadow-xl border border-gray-200"
                overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-[1000] backdrop-blur-sm"
            >
                <div className="bg-white p-6 rounded-lg max-w-4xl mx-auto max-h-[80vh] overflow-auto">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Detalles de Encomienda</h2>
                        <button
                            onClick={closeModal}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {previewData && (
                        <>
                            {/* Sección de información */}
                            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Columna izquierda */}
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-lg text-gray-700 mb-2">Cliente</h3>
                                        <p className="text-gray-600">{previewData.clienteData?.nombre}</p>
                                        <p className="text-gray-600">RUC: {previewData.clienteData?.ruc}</p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-lg text-gray-700 mb-2">Viaje</h3>
                                        <p className="text-gray-600">Bus: {previewData.viajeData?.bus?.placa}</p>
                                        <p className="text-gray-600">Empresa: {previewData.viajeData?.bus?.empresa}</p>
                                        <p className="text-gray-600">Fecha: {previewData.viajeData?.fecha}</p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-lg text-gray-700 mb-2">Origen</h3>
                                        <p className="text-gray-600">{previewData.origenData?.nombre}</p>
                                        <p className="text-gray-600">{previewData.origenData?.direccion}</p>
                                    </div>
                                </div>

                                {/* Columna derecha */}
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-lg text-gray-700 mb-2">Destino</h3>
                                        <p className="text-gray-600">{previewData.destinoData?.nombre}</p>
                                        <p className="text-gray-600">{previewData.destinoData?.direccion}</p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-lg text-gray-700 mb-2">Detalles de Envío</h3>
                                        <p className="text-gray-600">Tipo: {previewData.encomiendaData?.tipo}</p>
                                        <p className="text-gray-600">Sobres: {previewData.encomiendaData?.cantidadSobres || 0}</p>
                                        <p className="text-gray-600">Paquetes: {previewData.encomiendaData?.cantidadPaquetes || 0}</p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-lg text-gray-700 mb-2">Destinatario</h3>
                                        <p className="text-gray-600">{previewData.encomiendaData?.remitente}</p>
                                        <p className="text-gray-600">Contacto: {previewData.encomiendaData?.contacto}</p>
                                        <p className="text-gray-600">RUC/CI: {previewData.ruc_ci}</p>
                                    </div>
                                </div>

                                {/* Descripción completa */}
                                <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-lg text-gray-700 mb-2">Descripción</h3>
                                    <p className="text-gray-600 whitespace-pre-line">{previewData.encomiendaData?.descripcion}</p>
                                </div>

                                {/* Total */}
                                <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <h3 className="font-semibold text-lg text-blue-700 mb-2">Total a Pagar</h3>
                                    <p className="text-2xl font-bold text-blue-600">
                                        Gs. {parseInt(previewData.encomiendaData?.total || 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Visor PDF */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-lg text-gray-700 mb-3">Vista Previa del Comprobante</h3>
                                <div className="h-[60vh] border rounded-md shadow-inner bg-gray-50">
                                    <PDFViewer width="100%" height="100%">
                                        <EncomiendasPDF data={previewData} />
                                    </PDFViewer>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Botones de acción */}
                    <div className="mt-6 flex justify-end gap-3 border-t pt-4">
                        <button
                            onClick={closeModal}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-5 py-2 rounded-md transition duration-200 flex items-center gap-2"
                        >
                            <X size={18} /> Cerrar
                        </button>

                        <PDFDownloadLink
                            document={<EncomiendasPDF data={previewData} />}
                            fileName={`encomienda_${previewData?.clienteData?.nombre || 'generica'}.pdf`}
                        >
                            {({ loading }) => (
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md transition duration-200 flex items-center gap-2 disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Generando...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Printer size={18} /> Descargar PDF
                                        </span>
                                    )}
                                </button>
                            )}
                        </PDFDownloadLink>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Encomiendas;