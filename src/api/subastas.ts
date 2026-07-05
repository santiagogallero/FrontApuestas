import { apiGet, apiPost, apiDelete } from './client';
import type { Subasta, SubastaTiming, PujaResponse, PujaHistorial, StreamingInfo } from '../types/subasta';

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

export async function apiDesconectarSubasta(): Promise<void> {
  return apiDelete('/api/auction-runtime/subasta/desconectar', true);
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

export async function apiGetStreaming(subastaId: number): Promise<StreamingInfo> {
  return apiGet<StreamingInfo>(`/api/auction-runtime/subasta/${subastaId}/streaming`);
}

export async function apiIniciarSubasta(subastaId: number, duracionItemMinutos?: number): Promise<string> {
  return apiPost<string>(`/api/auction-runtime/subasta/${subastaId}/iniciar`, duracionItemMinutos ? { duracionItemMinutos } : {}, true);
}

export async function apiCerrarSubasta(subastaId: number): Promise<unknown> {
  return apiPost<unknown>(`/api/auction-runtime/subasta/${subastaId}/cerrar`, {}, true);
}

export interface CrearSubastaResponse {
  subastaId: number;
  ubicacion: string;
  categoria: string;
  estado: string;
  duracionItemMinutos: number;
  productos: string[];
}

export async function apiCrearSubasta(payload: {
  ubicacion: string;
  categoria: string;
  items: { productoId: number; precioBase: number }[];
}): Promise<CrearSubastaResponse> {
  return apiPost<CrearSubastaResponse>('/api/auction-runtime/subasta/crear', payload, true);
}
