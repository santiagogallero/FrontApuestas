import { useState, useEffect, useCallback } from 'react';
import { apiGetProductos } from '../api';
import type { Producto } from '../types/producto';

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetProductos();
      setProductos(data);
    } catch (e: any) {
      setError(e?.message || 'Error al cargar productos');
      setProductos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  return { productos, loading, error, refresh: fetchProductos };
}
