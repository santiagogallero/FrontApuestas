import { useState, useEffect, useCallback } from 'react';
import { apiGetMisPagos } from '../api';
import type { PagoEstado } from '../types/compliance';

export function usePagos() {
  const [pagos, setPagos] = useState<PagoEstado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPagos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetMisPagos();
      setPagos(data);
    } catch (e: any) {
      setError(e?.message || 'Error al cargar pagos');
      setPagos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPagos();
  }, [fetchPagos]);

  return { pagos, loading, error, refresh: fetchPagos };
}
