interface AsientoProps {
  numero: number;
  estado: 'disponible' | 'ocupado' | 'seleccionado';
  onClick: () => void;
}

export const Asiento: React.FC<AsientoProps> = ({ numero, estado, onClick }) => {
  const base = 'w-10 h-10 m-1 flex items-center justify-center rounded-md text-sm font-bold cursor-pointer transition-all';

  const colores = {
    disponible: 'bg-green-100 hover:bg-green-200 text-green-800 border border-green-400',
    ocupado: 'bg-red-200 text-red-800 cursor-not-allowed border border-red-500',
    seleccionado: 'bg-blue-500 text-white border border-blue-700',
  };

  return (
    <button
      onClick={onClick}
      disabled={estado === 'ocupado'}
      className={`${base} ${colores[estado]}`}
    >
      {numero}
    </button>
  );
};
