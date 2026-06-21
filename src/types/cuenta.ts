export interface MedioPago {
  id: number;
  tipo: string;
  aliasDescripcion: string;
  moneda: string;
  montoGarantia?: number | null;
  verificado: boolean;
  activo: boolean;
}

export interface Metricas {
  categoria: string | null;
  subastasParticipadas: number;
  pujasRealizadas: number;
  subastasGanadas: number;
  totalOfertado: number;
  totalPagado: number;
}

export interface Adjudicacion {
  registroId: number | null;
  itemId: number | null;
  productoId: number | null;
  productoDescripcion: string | null;
  ganadorClienteId: number | null;
  ganadorNombre: string | null;
  importe: number;
  comision: number;
  costoEnvio: number;
  totalPagar: number;
  moneda: string;
  estado: string;
  mensaje: string;
  modalidadEntrega?: string | null;
  direccionEnvio?: string | null;
  seguroVigenteTrasEntrega?: boolean | null;
}

export interface EntregaRequest {
  deliveryOption: 'SHIPPED' | 'PICKUP';
  shippingAddress?: string;
}

export interface CuentaCobro {
  id: number;
  alias: string;
  currency: string;
  foreignAccount: boolean;
  bankName: string;
  accountNumberMasked: string;
  swiftCode: string | null;
  holderName: string;
  active: boolean;
}

export interface CuentaCobroRequest {
  alias: string;
  currency: string;
  foreignAccount?: boolean;
  bankName: string;
  accountNumber: string;
  swiftCode?: string;
  holderName: string;
}
