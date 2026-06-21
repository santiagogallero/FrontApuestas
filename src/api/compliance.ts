import { apiGet, apiPost } from './client';
import type { EjecutarPagoRequest, EjecutarPagoResponse, PagoEstado } from '../types/compliance';

export async function apiGetMisPagos(): Promise<PagoEstado[]> {
  return apiGet<PagoEstado[]>('/api/compliance/mis-pagos');
}

export async function apiGetCheckout(registroSubastaId: number): Promise<PagoEstado> {
  return apiGet<PagoEstado>(`/api/compliance/pagos/checkout/${registroSubastaId}`);
}

export async function apiEjecutarPago(body: EjecutarPagoRequest): Promise<EjecutarPagoResponse> {
  return apiPost<EjecutarPagoResponse>('/api/compliance/pagos/ejecutar', body, true);
}
