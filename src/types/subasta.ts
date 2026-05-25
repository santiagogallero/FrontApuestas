export interface Subasta {
  id: number;
  fecha: string;
  hora: string;
  estado: string;
  categoria: string;
  ubicacion: string;
  capacidadAsistentes: number;
}

export interface SubastaTiming {
  subastaId: number;
  duracionMinutos: number;
  inicio: string;
  fin: string;
  estadoTemporal: string;
  minutosRestantes: number;
}

export interface PujaResponse {
  pujoId: number;
  itemId: number;
  ofertaAnterior: number;
  ofertaActual: number;
  minimoPermitido: number;
  maximoPermitido: number;
  mensaje: string;
}

export interface PujaHistorial {
  pujoId: number;
  asistenteId: number;
  numeroPostor: number;
  clienteId: number;
  nombreCliente: string;
  importe: number;
  ganador: boolean;
}
