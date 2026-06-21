export interface ColeccionResumen {
  id: number;
  nombre: string;
  subastaId: number;
  cantidadPiezas: number;
  duenioNombre: string | null;
}

export interface Coleccion {
  id: number;
  nombre: string;
  duenioId: number;
  duenioNombre: string | null;
  subastaId: number;
  productoIds: number[];
  cantidadPiezas: number;
}
