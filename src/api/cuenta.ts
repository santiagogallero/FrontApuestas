import { apiGet, apiPost } from './client';
import type { MedioPago, Metricas, Adjudicacion, EntregaRequest } from '../types/cuenta';

export async function apiGetPaymentMethods(): Promise<MedioPago[]> {
  return apiGet<MedioPago[]>('/api/auth/payment-methods');
}

export async function apiGetMetrics(): Promise<Metricas> {
  return apiGet<Metricas>('/api/metrics/me');
}

export async function apiGetMisAdjudicaciones(): Promise<Adjudicacion[]> {
  return apiGet<Adjudicacion[]>('/api/auction-runtime/mis-adjudicaciones');
}

export async function apiSeleccionarEntrega(registroId: number, body: EntregaRequest): Promise<Adjudicacion> {
  return apiPost<Adjudicacion>(`/api/auction-runtime/adjudicaciones/${registroId}/entrega`, body, true);
}
