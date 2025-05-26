import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, ChevronDown } from "lucide-react";

const MobileNavbar = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const modules = [
    {
      name: "Gestión de Usuarios y Accesos",
      items: [
        { title: "Usuarios", path: "/admin/usuarios" },
        { title: "Empleados", path: "/admin/empleados" },
        { title: "Clientes", path: "/admin/clientes" },
      ],
    },
    {
      name: "Gestión de Transporte",
      items: [
        { title: "Buses", path: "/admin/buses" },
        { title: "Rutas", path: "/admin/rutas" },
        { title: "Paradas de Ruta", path: "/admin/paradas-ruta" },
        { title: "Asientos", path: "/admin/asientos" },
        { title: "Viajes", path: "/admin/viajes" },
        { title: "Horarios", path: "/admin/horarios" },
      ],
    },
    {
      name: "Gestión Comercial",
      items: [
        { title: "Encomiendas", path: "/admin/encomiendas" },
        { title: "Ventas", path: "/admin/facturacion" },
        { title: "Caja", path: "/admin/caja" },
      ],
    },
    {
      name: "Gestión Territorial",
      items: [
        { title: "Empresas", path: "/admin/empresas" },
        { title: "Agencias", path: "/admin/agencias" },
        { title: "Localidades", path: "/admin/localidades" },
      ],
    },
  ];

  const toggleDropdown = (moduleName: string) => {
    setOpenDropdown(openDropdown === moduleName ? null : moduleName);
  };

  return (
    <div className="lg:hidden bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          Tr<span className="text-blue-500">4</span>cking
        </span>
        <Menu className="size-6 text-gray-700 dark:text-gray-300" />
      </div>
      <div className="space-y-2">
        {modules.map((module) => (
          <div key={module.name} className="border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => toggleDropdown(module.name)}
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span>{module.name}</span>
              <ChevronDown
                className={`size-5 transition-transform ${
                  openDropdown === module.name ? "rotate-180" : ""
                }`}
              />
            </button>
            {openDropdown === module.name && (
              <div className="space-y-1 bg-gray-50 dark:bg-gray-900">
                {module.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block px-6 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileNavbar;