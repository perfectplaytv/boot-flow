
// Mock do useRealtime para não quebrar o build
export function useRealtime() {
    return { data: [], error: null, isConnected: false, refresh: async () => [] };
}
export function useRealtimeProfiles() { return useRealtime(); }
export function useRealtimeCobrancas() { return useRealtime(); }
export function useRealtimeClientes() { return useRealtime(); }
export function useRealtimeRevendas() { return useRealtime(); }
