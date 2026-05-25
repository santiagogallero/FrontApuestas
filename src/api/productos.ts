import { apiGet } from './client';
import type { Producto } from '../types/producto';

export async function apiGetProductos(): Promise<Producto[]> {
  return apiGet<Producto[]>('/api/productos');
}
