export interface Producto {
  id: number;
  fecha: string;
  disponible: boolean;
  descripcionCatalogo: string;
  descripcionCompleta: string;
}

export type EstadoInspeccion = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';

export interface Articulo {
  id: number;
  titulo: string | null;
  categoria: string | null;
  descripcionCatalogo: string | null;
  descripcionCompleta: string | null;
  historia: string | null;
  estadoInspeccion: EstadoInspeccion;
  motivoRechazo: string | null;
  disponible: boolean;
  fecha: string | null;
  fechaInspeccion: string | null;
  duenioNombre: string | null;
  revisorNombre: string | null;
  cantidadFotos: number;
  declaraPropiedad: boolean;
  origenLicit: boolean;
  vendido: boolean;
  importeVenta: number | null;
  comisionVenta: number | null;
}

export interface PublicarArticuloRequest {
  titulo: string;
  categoria: string;
  descripcionCompleta: string;
  historia: string;
  fotos: string[];
  declaraPropiedad: boolean;
  origenLicit: boolean;
}

export interface InspeccionRequest {
  aprobado: boolean;
  motivo?: string;
}
