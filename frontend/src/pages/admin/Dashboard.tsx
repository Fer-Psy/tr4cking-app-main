import Mapa from "../../components/Mapa";
const AdminDashboard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
            {/* Primera fila con 3 cards */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Ventas del Día */}
                <div className="bg-blue-500 text-white p-6 rounded shadow">
                    <h3 className="text-lg font-bold">Ventas del Día</h3>
                    <p className="text-2xl font-bold">Gs. 900,000</p>
                    <p className="text-sm">Total de ingresos generados hoy.</p>
                </div>

                {/* Clientes Nuevos */}
                <div className="bg-green-500 text-white p-6 rounded shadow">
                    <h3 className="text-lg font-bold">Clientes Nuevos</h3>
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-sm">Clientes registrados hoy.</p>
                </div>

                {/* Reservas de Pasajes */}
                <div className="bg-yellow-500 text-white p-6 rounded shadow">
                    <h3 className="text-lg font-bold">Reservas de Pasajes</h3>
                    <p className="text-2xl font-bold">25</p>
                    <p className="text-sm">Reservas activas en el sistema.</p>
                </div>
            </div>

            {/* Mapa - ocupa todo el ancho debajo de las cards */}
            <div className="md:col-span-3 bg-white dark:bg-blue-950 rounded-lg shadow p-4">
                <h2 className="text-lg font-bold mb-4 text-white dark:text-white">Ubicación en Tiempo Real</h2>
                <div className="h-[700px] w-full">
                    <Mapa />
                </div>
            </div>
        </div>
    );
};
export default AdminDashboard;