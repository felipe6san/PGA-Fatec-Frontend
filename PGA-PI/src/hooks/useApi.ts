import { useState, useEffect } from 'react';

interface UseApiOptions {
  immediate?: boolean; // Se deve executar imediatamente
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: () => Promise<void>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions = { immediate: true }
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro na API:', err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
}

// Hook específico para múltiplas chamadas de API
export function useMultipleApi<T extends Record<string, any>>(
  apiCalls: Record<keyof T, () => Promise<any>>,
  options: UseApiOptions = { immediate: true }
) {
  const [data, setData] = useState<Partial<T>>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const execute = async () => {
    try {
      setLoading(true);
      setErrors({});
      
      const promises = Object.entries(apiCalls).map(async ([key, apiFunction]) => {
        try {
          const result = await apiFunction();
          return { key, result, error: null };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
          return { key, result: null, error: errorMessage };
        }
      });

      const results = await Promise.all(promises);
      
      const newData: Partial<T> = {};
      const newErrors: Record<string, string> = {};

      results.forEach(({ key, result, error }) => {
        if (error) {
          newErrors[key] = error;
        } else {
          newData[key as keyof T] = result;
        }
      });

      setData(newData);
      setErrors(newErrors);
    } catch (err) {
      console.error('Erro geral nas chamadas de API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, []);

  return {
    data,
    loading,
    errors,
    execute,
    hasErrors: Object.keys(errors).length > 0
  };
} 