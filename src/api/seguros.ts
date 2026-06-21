import { apiGet } from './client';
import type { SeguroPoliza } from '../types/seguro';

export async function apiGetMisSeguros(): Promise<SeguroPoliza[]> {
  return apiGet<SeguroPoliza[]>('/api/seguros/mios');
}
