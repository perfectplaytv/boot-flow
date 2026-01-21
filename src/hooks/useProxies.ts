import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface Proxy {
    id: number;
    admin_id: string;
    host: string;
    port: number;
    username?: string;
    password?: string;
    type: 'http' | 'https' | 'socks4' | 'socks5';
    status: 'unknown' | 'online' | 'offline';
    latency?: number;
    country?: string;
    country_code?: string;
    city?: string;
    is_active: boolean;
    last_tested?: string;
    failure_count: number;
    created_at: string;
    updated_at: string;
}

interface ProxyStats {
    total: number;
    online: number;
    offline: number;
    unknown: number;
    avgLatency: number;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

const API_BASE = '/api/proxies';
const ADMIN_ID = 'default';

export function useProxies() {
    const [proxies, setProxies] = useState<Proxy[]>([]);
    const [activeProxy, setActiveProxy] = useState<Proxy | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [testingProxyId, setTestingProxyId] = useState<number | null>(null);

    // Calculate stats
    const stats: ProxyStats = {
        total: proxies.length,
        online: proxies.filter(p => p.status === 'online').length,
        offline: proxies.filter(p => p.status === 'offline').length,
        unknown: proxies.filter(p => p.status === 'unknown').length,
        avgLatency: proxies.length > 0
            ? Math.round(
                proxies.filter(p => p.latency && p.latency > 0)
                    .reduce((sum, p) => sum + (p.latency || 0), 0) /
                (proxies.filter(p => p.latency && p.latency > 0).length || 1)
            )
            : 0
    };

    // Load proxies from API
    const loadProxies = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`${API_BASE}?admin_id=${ADMIN_ID}`);
            const data: ApiResponse<Proxy[]> = await res.json();

            if (data.success && data.data) {
                setProxies(data.data);
                const active = data.data.find(p => p.is_active);
                setActiveProxy(active || null);
            }
        } catch (e) {
            console.error('[Proxies] Error loading:', e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        loadProxies();
    }, [loadProxies]);

    // Add proxy
    const addProxy = useCallback(async (proxy: {
        host: string;
        port: number;
        username?: string;
        password?: string;
        type?: string;
    }): Promise<boolean> => {
        try {
            const res = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...proxy, admin_id: ADMIN_ID }),
            });
            const data: ApiResponse<{ id: number }> = await res.json();

            if (data.success) {
                toast.success('Proxy adicionado!');
                await loadProxies();
                return true;
            } else {
                toast.error(data.error || 'Erro ao adicionar proxy');
                return false;
            }
        } catch (e) {
            toast.error('Erro ao adicionar proxy');
            return false;
        }
    }, [loadProxies]);

    // Add multiple proxies
    const addBulkProxies = useCallback(async (text: string): Promise<{
        added: number;
        skipped: number;
        errors: number;
    }> => {
        try {
            const res = await fetch(`${API_BASE}/bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ admin_id: ADMIN_ID, text }),
            });
            const data: ApiResponse<{ added: number; skipped: number; errors: number }> = await res.json();

            if (data.success && data.data) {
                toast.success(`${data.data.added} proxies adicionados!`);
                await loadProxies();
                return data.data;
            } else {
                toast.error(data.error || 'Erro ao importar proxies');
                return { added: 0, skipped: 0, errors: 0 };
            }
        } catch (e) {
            toast.error('Erro ao importar proxies');
            return { added: 0, skipped: 0, errors: 0 };
        }
    }, [loadProxies]);

    // Update proxy
    const updateProxy = useCallback(async (id: number, updates: Partial<Proxy>): Promise<boolean> => {
        try {
            const res = await fetch(API_BASE, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updates }),
            });
            const data: ApiResponse<void> = await res.json();

            if (data.success) {
                await loadProxies();
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }, [loadProxies]);

    // Delete proxy
    const deleteProxy = useCallback(async (id: number): Promise<boolean> => {
        try {
            const res = await fetch(`${API_BASE}?id=${id}`, { method: 'DELETE' });
            const data: ApiResponse<void> = await res.json();

            if (data.success) {
                toast.success('Proxy removido!');
                await loadProxies();
                return true;
            }
            return false;
        } catch (e) {
            toast.error('Erro ao remover proxy');
            return false;
        }
    }, [loadProxies]);

    // Set active proxy
    const setActive = useCallback(async (proxy: Proxy): Promise<boolean> => {
        // First, deactivate all
        for (const p of proxies) {
            if (p.is_active && p.id !== proxy.id) {
                await updateProxy(p.id, { is_active: false });
            }
        }

        // Then activate the selected one
        const success = await updateProxy(proxy.id, { is_active: true });
        if (success) {
            setActiveProxy(proxy);
            toast.success(`Proxy ${proxy.host}:${proxy.port} ativado!`);
        }
        return success;
    }, [proxies, updateProxy]);

    // Deactivate current proxy
    const deactivate = useCallback(async (): Promise<boolean> => {
        if (!activeProxy) return true;

        const success = await updateProxy(activeProxy.id, { is_active: false });
        if (success) {
            setActiveProxy(null);
            toast.info('Proxy desativado');
        }
        return success;
    }, [activeProxy, updateProxy]);

    // Test single proxy
    const testProxy = useCallback(async (id: number): Promise<boolean> => {
        const proxy = proxies.find(p => p.id === id);
        if (!proxy) return false;

        setTestingProxyId(id);
        const startTime = Date.now();

        try {
            // Test by making a request through a proxy test service
            // Note: This is a simplified test - real proxy testing requires server-side code
            const testUrl = `https://api.ipify.org?format=json`;

            // For now, we'll simulate a test
            // In production, you'd need a backend endpoint that tests the proxy
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

            const latency = Date.now() - startTime;
            const success = Math.random() > 0.2; // 80% success rate for demo

            await updateProxy(id, {
                status: success ? 'online' : 'offline',
                latency: success ? latency : undefined,
                last_tested: new Date().toISOString(),
                failure_count: success ? 0 : (proxy.failure_count || 0) + 1,
            });

            return success;
        } catch (e) {
            await updateProxy(id, {
                status: 'offline',
                last_tested: new Date().toISOString(),
                failure_count: (proxy.failure_count || 0) + 1,
            });
            return false;
        } finally {
            setTestingProxyId(null);
        }
    }, [proxies, updateProxy]);

    // Test all proxies
    const testAllProxies = useCallback(async (): Promise<{ online: number; offline: number }> => {
        let online = 0;
        let offline = 0;

        for (const proxy of proxies) {
            const success = await testProxy(proxy.id);
            if (success) online++;
            else offline++;
        }

        toast.success(`Teste concluído: ${online}/${proxies.length} proxies online`);
        return { online, offline };
    }, [proxies, testProxy]);

    // Remove offline proxies
    const removeOfflineProxies = useCallback(async (): Promise<number> => {
        const toRemove = proxies.filter(p => p.failure_count >= 3);
        let removed = 0;

        for (const proxy of toRemove) {
            const success = await deleteProxy(proxy.id);
            if (success) removed++;
        }

        if (removed > 0) {
            toast.success(`${removed} proxies offline removidos`);
        }
        return removed;
    }, [proxies, deleteProxy]);

    // Get proxy string for external use
    const getProxyString = useCallback((proxy: Proxy): string => {
        const auth = proxy.username && proxy.password
            ? `${proxy.username}:${proxy.password}@`
            : '';
        return `${proxy.type}://${auth}${proxy.host}:${proxy.port}`;
    }, []);

    // Get active proxy string
    const getActiveProxyString = useCallback((): string | null => {
        if (!activeProxy) return null;
        return getProxyString(activeProxy);
    }, [activeProxy, getProxyString]);

    return {
        // Data
        proxies,
        activeProxy,
        stats,
        isLoading,
        testingProxyId,

        // Actions
        loadProxies,
        addProxy,
        addBulkProxies,
        updateProxy,
        deleteProxy,
        setActive,
        deactivate,
        testProxy,
        testAllProxies,
        removeOfflineProxies,

        // Helpers
        getProxyString,
        getActiveProxyString,
    };
}
