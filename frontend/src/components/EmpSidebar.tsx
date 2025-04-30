import { useState } from "react";
import { Link } from "react-router-dom";

const EmpSidebar = () => {
    const [pasajesOpen, setPasajesOpen] = useState(false);

    return (
    <div className="bg-blue-700 text-white w-64 min-h-screen">
        <h2 className="font-bold text-center text-2xl p-6 border-blue-600">
          <Link to="/empleado">
            Tr4cking
          </Link>
        </h2>
        <ul className="space-y-3 m-4 px-4">
          <li>
            <Link to="/empleado/clientes" className="flex items-center hover:text-yellow-300">
              <span className="material-symbols-outlined mr-2">group</span> Clientes
            </Link>
          </li>
  
          {/* Menú desplegable para Pasajes */}
          <li>
            <div
              className="flex items-center justify-between cursor-pointer hover:text-yellow-300"
              onClick={() => setPasajesOpen(!pasajesOpen)}
            >
              <div className="flex items-center">
                <span className="material-symbols-outlined mr-2">confirmation_number</span> Pasajes
              </div>
              <span className="material-symbols-outlined">
                {pasajesOpen ? "expand_less" : "expand_more"}
              </span>
            </div>
            {pasajesOpen && (
              <ul className="mt-2 space-y-2 pl-6">
                <li>
                  <Link to="/empleado/reservas" className="hover:text-yellow-300">Reservas</Link>
                </li>
                <li>
                  <Link to="/empleado/ventas" className="hover:text-yellow-300">Ventas</Link>
                </li>
              </ul>
            )}
          </li>
  
          <li>
            <Link to="/empleado/encomiendas" className="flex items-center hover:text-yellow-300">
              <span className="material-symbols-outlined mr-2">inventory_2</span> Encomiendas
            </Link>
          </li>
          <li>
            <Link to="/empleado/buses" className="flex items-center hover:text-yellow-300">
              <span className="material-symbols-outlined mr-2">directions_bus</span> Buses
            </Link>
          </li>
          <li>
            <Link to="/empleado/rutas" className="flex items-center hover:text-yellow-300">
              <span className="material-symbols-outlined mr-2">route</span> Rutas
            </Link>
          </li>
          <li>
            <Link to="/empleado/facturacion" className="flex items-center hover:text-yellow-300">
              <span className="material-symbols-outlined mr-2">receipt_long</span> Facturación
            </Link>
          </li>
        </ul>
        
        {/* Editar Perfil 
        <div className="text-center py-4 border-t border-blue-600">
          <span className="cursor-pointer hover:text-yellow-300">
            <span className="material-symbols-outlined mr-2">edit</span> Editar Perfil
          </span>
        </div> */}
    </div>
    );
};

export default EmpSidebar;