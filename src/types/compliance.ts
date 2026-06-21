export interface PagoEstado {
  registroSubastaId: number;
  estadoPago: string;
  montoOfertado: number;
  montoTotal: number;
  montoMulta: number;
  multaPotencial: number;
  moneda: string;
  productoDescripcion: string | null;
  transaccionId: string | null;
  fechaVencimiento: string;
  fechaLimiteRegularizacion: string | null;
  bloqueado: boolean;
}

export interface EjecutarPagoRequest {
  registroSubastaId: number;
  medioPagoId: number;
}

export interface EjecutarPagoResponse {
  exito: boolean;
  transaccionId: string;
  montoPagado: number;
  moneda: string;
  productoDescripcion: string | null;
  medioPagoAlias: string;
  fechaPago: string;
}
