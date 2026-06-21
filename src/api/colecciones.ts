import { apiGet } from './client';
import type { Coleccion, ColeccionResumen } from '../types/coleccion';

export async function apiGetColecciones(): Promise<ColeccionResumen[]> {
  return apiGet<ColeccionResumen[]>('/api/colecciones', false);
}

export async function apiGetColeccionPorSubasta(subastaId: number): Promise<Coleccion> {
  return apiGet<Coleccion>(`/api/colecciones/por-subasta/${subastaId}`, false);
}
