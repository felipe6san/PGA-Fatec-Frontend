import { useState, useEffect, useCallback } from 'react';
import api from '@lib/api';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseFetchReturn<T> extends FetchState<T> {
  fetch: (config?: AxiosRequestConfig) => Promise<void>;
  resetState: () => void;
}

export function useFetch<T = any>(
  url: string,
  options?: AxiosRequestConfig,
  executeImmediately = true
): UseFetchReturn<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: executeImmediately,
    error: null,
  });

  const fetch = useCallback(
    async (config?: AxiosRequestConfig) => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const mergedConfig = { ...options, ...config };
        const response: AxiosResponse<T> = await api(url, mergedConfig);
        
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
      } catch (err) {
        const error = err as Error | AxiosError;
        
        if ('response' in error) {
          const axiosError = error as AxiosError<any>;
          setState({
            data: null,
            loading: false,
            error: axiosError.response?.data?.message || 'Ocorreu um erro na requisição',
          });
        } else {
          setState({
            data: null,
            loading: false,
            error: error.message || 'Ocorreu um erro inesperado',
          });
        }
      }
    },
    [url, options]
  );

  const resetState = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    if (executeImmediately) {
      fetch();
    }
  }, [executeImmediately, fetch]);

  return {
    ...state,
    fetch,
    resetState,
  };
} 