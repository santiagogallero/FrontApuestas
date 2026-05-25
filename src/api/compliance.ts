import { apiGet } from './client';
import type { PagoEstado } from '../types/compliance';

export async function apiGetMisPagos(): Promise<PagoEstado[]> {
  return apiGet<PagoEstado[]>('/api/compliance/mis-pagos');
}
