import { useState } from 'react';
import { generarLayout, LayoutDeBus } from './generarLayout';
import { Asiento } from './Asiento';

interface Props {
  tipo: '2-2' | '2-1';
  capacidad: number;
  ocupados: number[];
}

const pisosDisponibles = [1, 2];

export const AsientosSelector: React.FC<Props> = ({ tipo, capacidad, ocupados }) => {
  const [pisoActual, setPisoActual] = useState<1 | 2>(1);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);

  const layout: LayoutDeBus = generarLayout(tipo, capacidad, pisoActual);

  const handleClick = (num: number) => {
    if (ocupados.includes(num)) return;

    setSeleccionados((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  return (
    <div className="p-4 bg-white rounded shadow-lg">
      {/* Selector de Piso */}
      <div className="flex justify-center gap-4 mb-4">
        {pisosDisponibles.map((piso) => (
          <button
            key={piso}
            className={`px-4 py-2 rounded ${pisoActual === piso ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setPisoActual(piso as 1 | 2)}
          >
            Piso {piso}
          </button>
        ))}
      </div>

      {/* Leyenda */}
      <div className="flex justify-center gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-400 rounded" />
          Disponible
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 border border-blue-700 rounded" />
          Seleccionado
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-200 border border-red-500 rounded" />
          Ocupado
        </div>
      </div>

      {/* Asientos */}
      <div className="flex flex-col items-center gap-2">
        {layout.map((fila, idx) => (
          <div key={idx} className="flex justify-center gap-2">
            {fila.map((asiento, i) =>
              asiento ? (
                <Asiento
                  key={asiento.numero}
                  numero={asiento.numero}
                  estado={
                    ocupados.includes(asiento.numero)
                      ? 'ocupado'
                      : seleccionados.includes(asiento.numero)
                      ? 'seleccionado'
                      : 'disponible'
                  }
                  onClick={() => handleClick(asiento.numero)}
                />
              ) : (
                <div key={i} className="w-8" /> // espacio/pasillo
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
