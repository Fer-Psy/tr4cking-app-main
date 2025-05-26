export type AsientoData = {
  numero: number;
  piso: number;
};

export type FilaDeAsientos = (AsientoData | null)[];
export type LayoutDeBus = FilaDeAsientos[];

export function generarLayout(
  tipo: '2-2' | '2-1',
  capacidad: number,
  piso: number
): LayoutDeBus {
  const layout: LayoutDeBus = [];
  let num = piso === 2 ? 100 : 1; // Separar numeración por piso

  const seatsPerRow = tipo === '2-2' ? 4 : 3;
  const filas = Math.ceil(capacidad / seatsPerRow);

  for (let i = 0; i < filas; i++) {
    const fila: FilaDeAsientos = [];

    if (tipo === '2-2') {
      fila.push({ numero: num++, piso });
      fila.push({ numero: num++, piso });
      fila.push(null); // pasillo
      fila.push({ numero: num++, piso });
      fila.push({ numero: num++, piso });
    } else if (tipo === '2-1') {
      fila.push({ numero: num++, piso });
      fila.push({ numero: num++, piso });
      fila.push(null); // pasillo
      fila.push({ numero: num++, piso });
    }

    layout.push(fila);
  }

  return layout;
}
