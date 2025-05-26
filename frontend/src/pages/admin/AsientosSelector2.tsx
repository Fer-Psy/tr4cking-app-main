import { useState } from 'react';

interface AsientoProps {
  numero: number;
  estado: 'disponible' | 'ocupado' | 'seleccionado';
  onClick: (numero: number) => void;
}

interface AsientosSelectorProps {
  asientosOcupados: number[];
  asientoSeleccionado: number | null;
  onAsientoClick: (numero: number) => void;
  filas?: number;
  columnas?: number;
}

const Asiento: React.FC<AsientoProps> = ({ numero, estado, onClick }) => {
  const baseClasses = "w-12 h-12 m-1 rounded-lg flex items-center justify-center cursor-pointer transition-colors";
  const stateClasses = {
    disponible: "bg-green-100 hover:bg-green-200 text-green-800 border-2 border-green-300",
    ocupado: "bg-red-100 text-red-800 cursor-not-allowed border-2 border-red-300",
    seleccionado: "bg-blue-500 text-white border-2 border-blue-600"
  };

  return (
    <button
      className={`${baseClasses} ${stateClasses[estado]}`}
      onClick={() => estado !== 'ocupado' && onClick(numero)}
      disabled={estado === 'ocupado'}
    >
      {numero}
    </button>
  );
};

const AsientosSelector: React.FC<AsientosSelectorProps> = ({
  asientosOcupados,
  asientoSeleccionado,
  onAsientoClick,
  filas = 10,
  columnas = 4
}) => {
  const renderAsientos = () => {
    const asientos = [];
    for (let fila = 0; fila < filas; fila++) {
      const asientosFila = [];
      for (let col = 0; col < columnas; col++) {
        const numero = fila * columnas + col + 1;
        const estado = asientosOcupados.includes(numero)
          ? 'ocupado'
          : numero === asientoSeleccionado
          ? 'seleccionado'
          : 'disponible';

        asientosFila.push(
          <Asiento
            key={numero}
            numero={numero}
            estado={estado}
            onClick={onAsientoClick}
          />
        );
      }
      asientos.push(
        <div key={fila} className="flex justify-center space-x-2">
          {asientosFila.slice(0, columnas/2)}
          <div className="w-8" /> {/* Pasillo */}
          {asientosFila.slice(columnas/2)}
        </div>
      );
    }
    return asientos;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="mb-4 flex justify-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded mr-2" />
            <span>Disponible</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded mr-2" />
            <span>Ocupado</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 border-2 border-blue-600 rounded mr-2" />
            <span>Seleccionado</span>
          </div>
        </div>
      </div>
      
      <div className="bus-container">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-8 bg-gray-400 rounded-t-xl" />
        </div>
        {renderAsientos()}
      </div>
    </div>
  );
};

export default AsientosSelector;