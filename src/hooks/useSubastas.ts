import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiGetSubastas } from '../api';
import type { Subasta } from '../types/subasta';

export function useSubastas() {
  const [subastas, setSubastas] = useState<Subasta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('Todas');

  const fetchSubastas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetSubastas();
      setSubastas(data);
    } catch (e: any) {
      setError(e?.message || 'Error al cargar subastas');
      setSubastas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubastas();
  }, [fetchSubastas]);

  const filtered = useMemo(() => {
    if (filter === 'Todas') return subastas;
    return subastas.filter((s) => s.categoria?.toLowerCase() === filter.toLowerCase());
  }, [subastas, filter]);

  return { subastas, filtered, loading, error, filter, setFilter, refresh: fetchSubastas };
}
