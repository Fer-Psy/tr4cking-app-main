import { useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table';

export function TablaAll({ data, columns }) {
    const [sorting, setSorting] = useState([]);
    const [filtering, setFiltering] = useState("");
    

    const tabla = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: { sorting, globalFilter: filtering },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
        globalFilterFn: "includesString",
        initialState: {
            pagination: { pageSize: 10 }
        }
    });

    return (
        <div className="p-4">
            {/* Barra de búsqueda */}
            <input
                type="text"
                value={filtering}
                onChange={(e) => setFiltering(e.target.value)}
                placeholder="Buscar..."
                className="w-full p-2 mb-4 border border-gray-700 rounded-lg bg-gray-800 text-white"
            />

            <table className="min-w-full border border-gray-700 shadow-md rounded-lg">
                <thead className="bg-gray-800 text-white">
                    {tabla.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} className="text-left">
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                    className="px-4 py-2 border border-gray-700 cursor-pointer"
                                >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    {header.column.getIsSorted() && (
                                        <span className="ml-2">
                                            {header.column.getIsSorted() === 'asc' ? '⬆️' : '⬇️'}
                                        </span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="bg-gray-900 text-gray-300">
                    {tabla.getRowModel().rows.map(row => (
                        <tr key={row.id} className="hover:bg-gray-700 transition">
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="px-4 py-2 border border-gray-700 text-center">
                                    {flexRender(cell.column.columnDef.cell ?? cell.column.columnDef.header, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Paginación */}
            <div className="flex justify-center gap-4 mt-4">
                <button
                    onClick={() => tabla.setPageIndex(0)}
                    disabled={!tabla.getCanPreviousPage()}
                    className="bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                    Primera Página
                </button>
                <button
                    onClick={() => tabla.previousPage()}
                    disabled={!tabla.getCanPreviousPage()}
                    className="bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                    Página Anterior
                </button>
                <button
                    onClick={() => tabla.nextPage()}
                    disabled={!tabla.getCanNextPage()}
                    className="bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                    Página Siguiente
                </button>
                <button
                    onClick={() => tabla.setPageIndex(tabla.getPageCount() - 1)}
                    disabled={!tabla.getCanNextPage()}
                    className="bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                    Última Página
                </button>
            </div>
        </div>
    );
}