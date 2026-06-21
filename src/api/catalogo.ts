import { apiGet } from './client';
import type { CatalogoSubasta } from '../types/catalogo';

/** @param autenticado si es false no envia JWT: el backend oculta precioBase (visitante). */
export async function apiGetCatalogoSubasta(subastaId: number, autenticado = true): Promise<CatalogoSubasta> {
  return apiGet<CatalogoSubasta>(`/api/subastas/${subastaId}/catalogo`, autenticado);
}
