import { useEffect, useState } from "react";
import createApi from "../../api/apiAll";
import { TablaAll } from "../../components/TablaAll";
import * as Dialog from "@radix-ui/react-dialog";

const clientesApi = createApi("clientes");

export function ClientesModal({ open, onClose, onSelect }) {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!open) return;

        const cargar = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await clientesApi.getAll();
                setClientes(res.data);
            } catch (err) {
                console.error("Error al cargar clientes:", err);
                setError("No se pudo cargar la lista de clientes.");
            } finally {
                setLoading(false);
            }
        };

        cargar();
    }, [open]);

    const columns = [
        { header: "ID", accessorKey: "id_cliente" },
        { header: "Razón Social", accessorKey: "razon_social" },
        { header: "Cédula", accessorKey: "cedula" },
        {
            header: "RUC",
            cell: ({ row }) => `${row.original.cedula}-${row.original.dv}`
        },

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
                        Lista de Clientes
                    </Dialog.Title>
                    <p id="dialog-description" className="sr-only">
                        Diálogo para seleccionar un cliente de la lista.
                    </p>

                    {/* Estados: Loading, Error o Tabla */}
                    {loading && (
                        <p className="py-4 text-center text-gray-600">Cargando clientes...</p>
                    )}
                    {error && (
                        <p className="py-4 text-center text-red-500">{error}</p>
                    )}
                    {!loading && !error && (
                        <TablaAll data={clientes} columns={columns} />
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