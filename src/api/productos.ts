import { apiGet, apiPost } from './client';
import type {
  Producto,
  Articulo,
  PublicarArticuloRequest,
  InspeccionRequest,
} from '../types/producto';

export async function apiGetProductos(): Promise<Producto[]> {
  return apiGet<Producto[]>('/api/productos');
}

export async function apiPublicarArticulo(
  payload: PublicarArticuloRequest
): Promise<Articulo> {
  return apiPost<Articulo>('/api/articulos', payload, true);
}

export async function apiGetMisArticulos(): Promise<Articulo[]> {
  return apiGet<Articulo[]>('/api/articulos/mios');
}

export async function apiGetArticulosPendientes(): Promise<Articulo[]> {
  return apiGet<Articulo[]>('/api/articulos/pendientes');
}

export async function apiInspeccionarArticulo(
  id: number,
  payload: InspeccionRequest
): Promise<Articulo> {
  return apiPost<Articulo>(`/api/articulos/${id}/inspeccion`, payload, true);
}
