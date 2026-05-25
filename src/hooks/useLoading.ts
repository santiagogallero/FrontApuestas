import { useState, useCallback } from 'react';

interface UseLoadingReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useLoading<T>(
  fn: (...args: any[]) => Promise<T>
): UseLoadingReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);
      try {
        const result = await fn(...args);
        setData(result);
        return result;
      } catch (e: any) {
        const msg = e?.message || 'Error inesperado';
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fn]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}
