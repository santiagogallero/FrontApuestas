import { useState, useCallback, useEffect, useRef } from 'react';
import { apiConectarSubasta, apiPujar, apiGetHistorialPujas } from '../api';
import { WS_BASE, loadToken } from '../api/client';
import type { PujaResponse, BidEvent } from '../types/subasta';

export function useDetalleSubasta(subastaId: number, itemId: number) {
  const [conectando, setConectando] = useState(false);
  const [conectado, setConectado] = useState(false);
  const [pujando, setPujando] = useState(false);
  const [lastPuja, setLastPuja] = useState<PujaResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Estado "en vivo" alimentado por el WebSocket (y por las pujas propias).
  const [mejorOferta, setMejorOferta] = useState(0);
  const [minimo, setMinimo] = useState(0);
  const [maximo, setMaximo] = useState(0);
  const [bids, setBids] = useState<BidEvent[]>([]);
  const [enVivo, setEnVivo] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);

  const aplicarEvento = useCallback(
    (evt: BidEvent) => {
      if (evt.tipo !== 'NUEVA_PUJA') return;
      if (itemId && evt.itemId !== itemId) return;
      setMejorOferta(evt.importe);
      setMinimo(evt.minimoPermitido ?? 0);
      setMaximo(evt.maximoPermitido ?? 0);
      setBids((prev) => [evt, ...prev].slice(0, 25));
    },
    [itemId]
  );

  const abrirWebSocket = useCallback(async () => {
    if (wsRef.current) return;
    const token = await loadToken();
    const url = `${WS_BASE}/ws/subastas?subastaId=${subastaId}&token=${encodeURIComponent(token ?? '')}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;
    ws.onopen = () => setEnVivo(true);
    ws.onclose = () => {
      setEnVivo(false);
      if (wsRef.current === ws) wsRef.current = null;
    };
    ws.onerror = () => setEnVivo(false);
    ws.onmessage = (e: { data: any }) => {
      try {
        aplicarEvento(JSON.parse(e.data as string) as BidEvent);
      } catch {
        // mensaje no parseable: se ignora
      }
    };
  }, [subastaId, aplicarEvento]);

  const conectar = useCallback(async () => {
    setConectando(true);
    setError(null);
    try {
      await apiConectarSubasta(subastaId);
      setConectado(true);
      // Sembrar la oferta actual con el historial existente.
      try {
        const historial = await apiGetHistorialPujas(itemId);
        if (historial.length > 0) {
          const mejor = historial.reduce((a, b) => (b.importe > a.importe ? b : a));
          setMejorOferta(mejor.importe);
        }
      } catch {
        // sin historial disponible: arranca en 0
      }
      await abrirWebSocket();
    } catch (e: any) {
      setError(e?.message || 'No se pudo conectar');
    } finally {
      setConectando(false);
    }
  }, [subastaId, itemId, abrirWebSocket]);

  const pujar = useCallback(
    async (item: number, importe: number, moneda: string) => {
      setPujando(true);
      setError(null);
      try {
        const res = await apiPujar(subastaId, item, importe, moneda);
        setLastPuja(res);
        // Fallback si el WS no esta activo: refleja la propia puja igualmente.
        if (!wsRef.current) {
          setMejorOferta(res.ofertaActual);
          setMinimo(res.minimoPermitido ?? 0);
          setMaximo(res.maximoPermitido ?? 0);
        }
        return res;
      } catch (e: any) {
        setError(e?.message || 'No se pudo registrar la puja');
        throw e;
      } finally {
        setPujando(false);
      }
    },
    [subastaId]
  );

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return {
    conectando,
    conectado,
    pujando,
    lastPuja,
    error,
    enVivo,
    mejorOferta,
    minimo,
    maximo,
    bids,
    conectar,
    pujar,
  };
}
