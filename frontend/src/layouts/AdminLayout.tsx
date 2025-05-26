import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden hidden-scrollbar">
      {/* Sidebar scrolleable */}
      <div className="hidden lg:block h-full w-64 overflow-y-auto overflow-x-hidden">
        <AdminSidebar />
      </div>

      {/* Contenido principal scrolleable */}
      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
        <div className="flex-grow p-6 bg-gray-100 dark:bg-gray-900">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;