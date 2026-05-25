import { useState, useCallback } from 'react';
import { apiConectarSubasta, apiPujar } from '../api';
import type { PujaResponse } from '../types/subasta';

export function useDetalleSubasta(subastaId: number) {
  const [conectando, setConectando] = useState(false);
  const [conectado, setConectado] = useState(false);
  const [pujando, setPujando] = useState(false);
  const [lastPuja, setLastPuja] = useState<PujaResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const conectar = useCallback(async () => {
    setConectando(true);
    setError(null);
    try {
      await apiConectarSubasta(subastaId);
      setConectado(true);
    } catch (e: any) {
      setError(e?.message || 'No se pudo conectar');
    } finally {
      setConectando(false);
    }
  }, [subastaId]);

  const pujar = useCallback(async (itemId: number, importe: number, moneda: string) => {
    setPujando(true);
    setError(null);
    try {
      const res = await apiPujar(subastaId, itemId, importe, moneda);
      setLastPuja(res);
      return res;
    } catch (e: any) {
      setError(e?.message || 'No se pudo registrar la puja');
      throw e;
    } finally {
      setPujando(false);
    }
  }, [subastaId]);

  return { conectando, conectado, pujando, lastPuja, error, conectar, pujar };
}
