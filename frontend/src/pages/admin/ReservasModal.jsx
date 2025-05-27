import { useEffect, useState } from "react";
import createApi from "../../api/apiAll";
import { TablaAll } from "../../components/TablaAll";
import * as Dialog from "@radix-ui/react-dialog";

const reservasApi = createApi("reservas");

export function ReservasModal({ open, onClose, onSelect }) {
    const [reservas, setreservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!open) return;

        const cargar = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await reservasApi.getAll();
                setreservas(res.data);
            } catch (err) {
                console.error("Error al cargar reservas:", err);
                setError("No se pudo cargar la lista de reservas.");
            } finally {
                setLoading(false);
            }
        };

        cargar();
    }, [open]);

    const columns = [
        { header: "ID Reserva", accessorKey: "id_reserva" },
        { 
            header: "Cliente", 
            cell: ({ row }) => `${row.original.cliente_details.persona_details.nombre} ${row.original.cliente_details.persona_details.apellido}`
        },
        { 
            header: "Cédula", 
            cell: ({ row }) => row.original.cliente_details.persona_details.cedula
        },
        {
            header: "RUC",
            cell: ({ row }) => `${row.original.cliente_details.cedula}-${row.original.cliente_details.dv}`
        },
        { header: "Estado", accessorKey: "estado" },
        
        {
            header: "Acciones",
            id: "acciones",
            cell: ({ row }) => (
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded-md transition-colors duration-200"
                    onClick={() => {
                        onSelect(row.original);
                        onClose();
                    }}
                >
                    Seleccionar
                </button>
            ),
        },
    ];

    return (
        <Dialog.Root open={open} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
                <Dialog.Content
                    className="fixed left-1/2 top-20 z-50 w-full max-w-4xl -translate-x-1/2 rounded-md bg-white p-6 shadow-lg"
                    aria-describedby="dialog-description"
                >
                    {/* Título y descripción accesible */}
                    <Dialog.Title className="mb-4 text-lg font-semibold">
                        Lista de Reservas
                    </Dialog.Title>
                    <p id="dialog-description" className="sr-only">
                        Diálogo para seleccionar reservas de la lista.
                    </p>

                    {/* Estados: Loading, Error o Tabla */}
                    {loading && (
                        <p className="py-4 text-center text-gray-600">Cargando Reservas...</p>
                    )}
                    {error && (
                        <p className="py-4 text-center text-red-500">{error}</p>
                    )}
                    {!loading && !error && (
                        <TablaAll data={reservas} columns={columns} />
                    )}

                    {/* Botón de cierre */}
                    <div className="mt-4 flex justify-end">
                        <Dialog.Close asChild>
                            <button
                                className="rounded-md bg-gray-300 px-4 py-1 hover:bg-gray-400 transition-colors duration-200"
                            >
                                Cerrar
                            </button>
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}