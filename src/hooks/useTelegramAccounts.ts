import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface TelegramBot {
    id: number;
    admin_id: string;
    name: string;
    token: string;
    username?: string;
    status: 'active' | 'inactive' | 'restricted' | 'error';
    max_messages_per_hour: number;
    max_messages_per_day: number;
    messages_sent_today: number;
    messages_sent_this_hour: number;
    last_validated_at?: string;
    validation_error?: string;
    created_at: string;
    updated_at: string;
}

export interface VerifyResult {
    bot_id: number;
    name: string;
    username?: string;
    status: 'active' | 'restricted' | 'banned' | 'invalid' | 'error';
    telegram_id?: number;
    can_join_groups?: boolean;
    can_read_messages?: boolean;
    error_message?: string;
    verified_at: string;
}

interface VerifySummary {
    total: number;
    active: number;
    restricted: number;
    banned: number;
    invalid: number;
    error: number;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

const ADMIN_ID = 'default';

export function useTelegramAccounts() {
    const [bots, setBots] = useState<TelegramBot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifyProgress, setVerifyProgress] = useState(0);
    const [lastVerification, setLastVerification] = useState<{
        results: VerifyResult[];
        summary: VerifySummary;
    } | null>(null);

    // Load bots from API
    const loadBots = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/telegram/verify?admin_id=${ADMIN_ID}`);
            const data: ApiResponse<TelegramBot[]> = await res.json();

            if (data.success && data.data) {
                setBots(data.data);
            }
        } catch (e) {
            console.error('[TelegramAccounts] Error loading:', e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        loadBots();
    }, [loadBots]);

    // Verify single bot
    const verifyBot = useCallback(async (botId: number): Promise<VerifyResult | null> => {
        try {
            const res = await fetch('/api/telegram/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ admin_id: ADMIN_ID, bot_id: botId }),
            });
            const data: ApiResponse<{ results: VerifyResult[]; summary: VerifySummary }> = await res.json();

            if (data.success && data.data && data.data.results.length > 0) {
                await loadBots(); // Reload to get updated status
                const result = data.data.results[0];

                if (result.status === 'active') {
                    toast.success(`${result.name} está ativo! ✅`);
                } else if (result.status === 'restricted') {
                    toast.warning(`${result.name} está com restrições ⚠️`);
                } else {
                    toast.error(`${result.name}: ${result.error_message || 'Erro'}`);
                }

                return result;
            }
            return null;
        } catch (e) {
            toast.error('Erro ao verificar bot');
            return null;
        }
    }, [loadBots]);

    // Verify all bots
    const verifyAllBots = useCallback(async (): Promise<{
        results: VerifyResult[];
        summary: VerifySummary;
    } | null> => {
        if (bots.length === 0) {
            toast.warning('Nenhum bot para verificar');
            return null;
        }

        setIsVerifying(true);
        setVerifyProgress(0);

        try {
            const res = await fetch('/api/telegram/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ admin_id: ADMIN_ID, verify_all: true }),
            });
            const data: ApiResponse<{ results: VerifyResult[]; summary: VerifySummary }> = await res.json();

            if (data.success && data.data) {
                setLastVerification(data.data);
                await loadBots(); // Reload to get updated statuses

                const { summary } = data.data;
                toast.success(
                    `Verificação concluída: ${summary.active} ativos, ${summary.restricted} restritos, ${summary.banned + summary.invalid + summary.error} com problemas`
                );

                return data.data;
            }
            return null;
        } catch (e) {
            toast.error('Erro ao verificar bots');
            return null;
        } finally {
            setIsVerifying(false);
            setVerifyProgress(100);
        }
    }, [bots.length, loadBots]);

    // Get status badge info
    const getStatusInfo = useCallback((status: string): {
        label: string;
        color: string;
        bgColor: string;
        icon: '✅' | '⚠️' | '❌' | '❓';
    } => {
        switch (status) {
            case 'active':
                return { label: 'Ativo', color: 'text-green-400', bgColor: 'bg-green-600', icon: '✅' };
            case 'restricted':
                return { label: 'Restrito', color: 'text-yellow-400', bgColor: 'bg-yellow-600', icon: '⚠️' };
            case 'banned':
            case 'invalid':
            case 'error':
                return { label: 'Erro', color: 'text-red-400', bgColor: 'bg-red-600', icon: '❌' };
            default:
                return { label: 'Não verificado', color: 'text-gray-400', bgColor: 'bg-gray-600', icon: '❓' };
        }
    }, []);

    // Stats
    const stats = {
        total: bots.length,
        active: bots.filter(b => b.status === 'active').length,
        restricted: bots.filter(b => b.status === 'restricted').length,
        error: bots.filter(b => b.status === 'error' || b.status === 'inactive').length,
        unverified: bots.filter(b => !b.last_validated_at).length,
    };

    return {
        // Data
        bots,
        stats,
        isLoading,
        isVerifying,
        verifyProgress,
        lastVerification,

        // Actions
        loadBots,
        verifyBot,
        verifyAllBots,

        // Helpers
        getStatusInfo,
    };
}
