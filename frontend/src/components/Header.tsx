import { CircleUserRound } from "lucide-react";

const Header = () => {
    return(
      <header className="bg-white dark:bg-gray-700 shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold dark:text-white text-gray-700">Bienvenido al Sistema de Tr4cking App</h1>
        <div className="flex items-center gap-4">
          <button className="text-gray-500 flex items-center gap-2">
            <CircleUserRound className="mr-2" size={25} />Gabriel Sosa
          </button>
          <button type='submit' className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Cerrar sesión
          </button>
        </div>
      </header>
    );
};

export default Header; 