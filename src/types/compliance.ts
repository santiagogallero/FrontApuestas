export interface PagoEstado {
  registroSubastaId: number;
  estadoPago: string;
  montoOfertado: number;
  montoMulta: number;
  fechaVencimiento: string;
  fechaLimiteRegularizacion: string;
  bloqueado: boolean;
}
