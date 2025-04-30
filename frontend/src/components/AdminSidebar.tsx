import { Link, NavLink } from "react-router-dom";
import { Users, Bus, Route, ReceiptText, 
  HandHelping, LogOut, Building, Clock, MapPin, 
  Stamp, UserCircle, MapPinPlus, Armchair, PlaneTakeoff,
   ContactRound } from "lucide-react";

const AdminSidebar = () => {
  const modules = [
    {
      name: "Gestión de Usuarios y Accesos",
      items: [
        { title: "Usuarios", path: "/admin/usuarios", icon: <Users className="size-5 opacity-75" /> },
        { title: "Empleados", path: "/admin/empleados", icon: <ContactRound className="size-5 opacity-75" /> },
        { title: "Clientes", path: "/admin/clientes", icon: <UserCircle className="size-5 opacity-75" /> },
      ]
    },
    {
      name: "Gestión de Transporte",
      items: [
        { title: "Buses", path: "/admin/buses", icon: <Bus className="size-5 opacity-75" /> },
        { title: "Rutas", path: "/admin/rutas", icon: <Route className="size-5 opacity-75" /> },
        { title: "Paradas de Ruta", path: "/admin/paradas-ruta", icon: <MapPinPlus className="size-5 opacity-75" /> },
        { title: "Asientos", path: "/admin/asientos", icon: <Armchair className="size-5 opacity-75" /> },
        { title: "Viajes", path: "/admin/viajes", icon: <PlaneTakeoff className="size-5 opacity-75" /> },
        { title: "Horarios", path: "/admin/horarios", icon: <Clock className="size-5 opacity-75" /> }
      ]
    },
    {
      name: "Gestión Comercial",
      items: [
        { title: "Servicios", path: "/admin/servicios", icon: <HandHelping className="size-5 opacity-75" /> },
        { title: "Ventas", path: "/admin/facturacion", icon: <ReceiptText className="size-5 opacity-75" /> },
        { title: "Timbrados", path: "/admin/timbrados", icon: <Stamp className="size-5 opacity-75" /> }
      ]
    },
    {
      name: "Gestión Territorial",
      items: [
        { title: "Empresas", path: "/admin/empresas", icon: <Building className="size-5 opacity-75" /> },
        { title: "Agencias", path: "/admin/agencias", icon: <Building className="size-5 opacity-75" /> },
        { title: "Localidades", path: "/admin/localidades", icon: <MapPin className="size-5 opacity-75" /> }
      ]
    }
  ];

  return (
    <div className="hidden lg:flex h-full w-full flex-col bg-white dark:bg-gray-800 border-e dark:border-gray-700">
      {/* Contenedor scrolleable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="flex items-center justify-center h-16 p-4">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            Tr<span className="text-blue-500">4</span>cking
          </span>
        </div>

        <div className="mt-4 space-y-8">
          {modules.map((module) => (
            <div key={module.name}>
              <h3 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                {module.name}
              </h3>
              <div className="mt-2 space-y-1">
                {module.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className="group flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección fija para el logout */}
      <div className="border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-2">
        <Link
          to="/logout"
          className="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
        >
          <LogOut className="size-5 opacity-75" />
          <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 dark:bg-gray-700 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
            Logout
          </span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;