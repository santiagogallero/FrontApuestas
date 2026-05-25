import { apiGet, apiPost } from './client';
import type { Subasta, SubastaTiming, PujaResponse, PujaHistorial } from '../types/subasta';

export async function apiGetSubastas(): Promise<Subasta[]> {
  return apiGet<Subasta[]>('/api/subastas');
}

export async function apiGetSubasta(id: number): Promise<Subasta> {
  return apiGet<Subasta>(`/api/subastas/${id}`);
}

export async function apiGetTiming(subastaId: number): Promise<SubastaTiming> {
  return apiGet<SubastaTiming>(`/api/auction-runtime/subasta/${subastaId}/timing`);
}

export async function apiConectarSubasta(subastaId: number): Promise<string> {
  return apiPost<string>('/api/auction-runtime/subasta/conectar', { subastaId }, true);
}

export async function apiPujar(
  subastaId: number,
  itemId: number,
  importe: number,
  moneda: string
): Promise<PujaResponse> {
  return apiPost<PujaResponse>('/api/auction-runtime/pujas', { subastaId, itemId, importe, moneda }, true);
}

export async function apiGetHistorialPujas(itemId: number): Promise<PujaHistorial[]> {
  return apiGet<PujaHistorial[]>(`/api/auction-runtime/pujas/historial/${itemId}`);
}
