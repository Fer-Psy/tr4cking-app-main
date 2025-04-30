import { Link } from "react-router-dom";
import { Users, Package, Bus, Route, FileText, LayoutDashboard, LogOut } from "lucide-react";

const AdminSidebar = () => {
  return (
    <div className="flex h-screen w-16 flex-col justify-between border-e bg-white dark:bg-gray-800 dark:border-gray-700">
      <div>
        <div className="inline-flex size-16 items-center justify-center">
          <span className="grid size-10 place-content-center rounded-lg">
            <img src="../src/assets/react.svg" alt="logo" />
          </span>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700">
          <div className="px-2">
            <div className="py-4">
              <Link
                to="/admin"
                className="group relative flex justify-center rounded-sm px-2 py-1.5 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
              >
                <LayoutDashboard className="size-5 opacity-75" />
                <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 dark:bg-gray-700 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                  General
                </span>
              </Link>
            </div>

            <ul className="space-y-1 border-t border-gray-100 dark:border-gray-700 pt-4">
              <li>
                <Link
                  to="/admin/usuarios"
                  className="group relative flex justify-center rounded-sm px-2 py-1.5 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
                >
                  <Users className="size-5 opacity-75" />
                  <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 dark:bg-gray-700 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                    Usuarios
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/admin/encomiendas"
                  className="group relative flex justify-center rounded-sm px-2 py-1.5 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
                >
                  <Package className="size-5 opacity-75" />
                  <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 dark:bg-gray-700 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                    Encomiendas
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/admin/buses"
                  className="group relative flex justify-center rounded-sm px-2 py-1.5 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
                >
                  <Bus className="size-5 opacity-75" />
                  <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 dark:bg-gray-700 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                    Buses
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/admin/rutas"
                  className="group relative flex justify-center rounded-sm px-2 py-1.5 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
                >
                  <Route className="size-5 opacity-75" />
                  <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 dark:bg-gray-700 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                    Rutas
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/admin/facturacion"
                  className="group relative flex justify-center rounded-sm px-2 py-1.5 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
                >
                  <FileText className="size-5 opacity-75" />
                  <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 dark:bg-gray-700 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                    Facturación
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-2">
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