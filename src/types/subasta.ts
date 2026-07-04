export interface Subasta {
  id: number;
  fecha: string;
  hora: string;
  estado: string;
  categoria: string;
  ubicacion: string;
  capacidadAsistentes: number;
  streamingUrl?: string | null;
  depositoNombre?: string | null;
  depositoDireccion?: string | null;
}

export interface StreamingInfo {
  subastaId: number;
  streamingUrl: string | null;
}

export interface SubastaTiming {
  subastaId: number;
  duracionMinutos: number;
  inicio: string;
  fin: string;
  estadoTemporal: string;
  minutosRestantes: number;
  itemActualId: number | null;
  itemExpiraAt: string | null;
  segundosRestantesItem: number | null;
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

export interface BidEvent {
  tipo: string;
  subastaId: number;
  itemId: number;
  pujoId: number;
  numeroPostor: number;
  nombrePostor: string | null;
  importe: number;
  minimoPermitido: number;
  maximoPermitido: number | null;
  timestamp: string;
}
