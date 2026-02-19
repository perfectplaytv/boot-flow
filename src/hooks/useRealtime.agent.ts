import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import { createAgentSupabaseClient, AgentSupabaseClient } from '@/lib/supabaseClient.agent';

export interface RealtimeOptions<T> {
  channel: string;
  event: string;
  initialValue?: T;
  enabled?: boolean;
  parser?: (payload: unknown) => T;
}

interface StoreState<T> {
  value: T | undefined;
}

type Listener<T> = (state: StoreState<T>) => void;

const createStore = <T,>(initial: StoreState<T>) => {
  let state = initial;
  const listeners = new Set<Listener<T>>();

  return {
    getState: () => state,
    setState: (next: StoreState<T>) => {
      state = next;
      listeners.forEach((listener) => listener(state));
    },
    subscribe: (listener: Listener<T>) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};

export const useRealtime = <T,>(options: RealtimeOptions<T>) => {
  const { channel, event, enabled = true, parser } = options;
  const clientRef = useRef<AgentSupabaseClient>();
  const store = useMemo(
    () =>
      createStore<T>({
        value: options.initialValue,
      }),
    [options.initialValue],
  );

  const subscribe = useMemo(
    () =>
      store.subscribe,
    [store],
  );

  const getSnapshot = () => store.getState().value as T;

  useEffect(() => {
    if (!enabled) return;

    if (!clientRef.current) {
      clientRef.current = createAgentSupabaseClient();
    }

    const unsubscribe = clientRef.current.listenRealtime(channel, event, (payload) => {
      const nextValue = parser ? parser(payload) : ((payload as unknown) as T);
      store.setState({ value: nextValue });
    });

    return () => unsubscribe();
  }, [channel, event, enabled, parser, store]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};

export const useRealtimeList = <T,>(
  options: RealtimeOptions<T[]>,
  reducer: (current: T[], payload: T) => T[],
) => {
  return useRealtime<T[]>({
    ...options,
    parser: (payload) => {
      const current = options.initialValue ?? [];
      const next = options.parser ? options.parser(payload) : (payload as T);
      return reducer(current, next);
    },
  });
};
