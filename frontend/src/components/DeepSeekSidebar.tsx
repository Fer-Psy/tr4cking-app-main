import { NavLink } from "react-router-dom";
import { Users, HandHelping, ReceiptText, ScrollText, PlaneTakeoff, Clock, Bus, Route, MapPinPlus, Armchair, MapPin, Building, ContactRound, UserCircle, Stamp } from "lucide-react";

const AdminSidebar = () => {
    const modules = [
      {
        name: "Gestión de Usuarios y Accesos",
        items: [
          { title: "Usuarios", path: "/admin/usuarios", icon: <Users className="size-5 opacity-75" /> },
          { title: "Empleados", path: "/admin/empleados", icon: <ContactRound className="size-5 opacity-75" /> },
          { title: "Clientes", path: "/admin/clientes", icon: <UserCircle className="size-5 opacity-75" /> },
          { title: "Tipos de Documento", path: "/admin/tipos-documento", icon: <ScrollText className="size-5 opacity-75" /> }
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
      // Tu implementación del sidebar usando los módulos
      // Por ejemplo:
      <div className="space-y-8">
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
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };
export default AdminSidebar;