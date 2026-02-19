import { useCallback, useEffect, useMemo, useState } from 'react';

export interface EdgeSyncOptions<T> {
  key: string;
  fetcher: () => Promise<T>;
  revalidateOnFocus?: boolean;
  revalidateInterval?: number;
  cache?: Map<string, T>;
}

export interface EdgeSyncResponse<T> {
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
  mutate: (updater?: T | ((current?: T) => T | Promise<T>)) => Promise<T | undefined>;
}

const defaultCache = new Map<string, unknown>();

const getCached = <T,>(cache: Map<string, unknown>, key: string) => cache.get(key) as T | undefined;

const setCached = <T,>(cache: Map<string, unknown>, key: string, value: T) => {
  cache.set(key, value);
};

export const useEdgeSync = <T,>(options: EdgeSyncOptions<T>): EdgeSyncResponse<T> => {
  const { key, fetcher, revalidateOnFocus = true, revalidateInterval, cache = defaultCache as Map<string, T> } = options;

  const [state, setState] = useState<{ data?: T; error?: Error; loading: boolean }>(() => {
    const cached = getCached<T>(cache as Map<string, unknown>, key);
    return {
      data: cached,
      error: undefined,
      loading: !cached,
    };
  });

  const mutate = useCallback<Required<EdgeSyncResponse<T>>['mutate']>(
    async (updater) => {
      try {
        let nextValue: T;
        if (typeof updater === 'function') {
          nextValue = await (updater as (current?: T) => T | Promise<T>)(state.data);
        } else if (updater !== undefined) {
          nextValue = updater;
        } else {
          nextValue = await fetcher();
        }

        setCached(cache as Map<string, unknown>, key, nextValue);
        setState({ data: nextValue, error: undefined, loading: false });
        return nextValue;
      } catch (error) {
        setState((current) => ({ ...current, error: error as Error, loading: false }));
        return undefined;
      }
    },
    [cache, fetcher, key, state.data],
  );

  useEffect(() => {
    let active = true;

    const load = async () => {
      setState((current) => ({ ...current, loading: true }));
      try {
        const data = await fetcher();
        if (!active) return;
        setCached(cache as Map<string, unknown>, key, data);
        setState({ data, error: undefined, loading: false });
      } catch (error) {
        if (!active) return;
        setState((current) => ({ ...current, error: error as Error, loading: false }));
      }
    };

    if (!state.data) {
      load();
    }

    if (revalidateInterval) {
      const id = window.setInterval(load, revalidateInterval);
      return () => {
        active = false;
        window.clearInterval(id);
      };
    }

    return () => {
      active = false;
    };
  }, [cache, fetcher, key, revalidateInterval, state.data]);

  useEffect(() => {
    if (!revalidateOnFocus) return;
    const handler = () => {
      void mutate();
    };
    window.addEventListener('focus', handler);
    return () => window.removeEventListener('focus', handler);
  }, [mutate, revalidateOnFocus]);

  return useMemo(
    () => ({
      data: state.data,
      error: state.error,
      isLoading: state.loading,
      mutate,
    }),
    [mutate, state.data, state.error, state.loading],
  );
};
