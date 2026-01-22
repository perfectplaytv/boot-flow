import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import type {
    HeatingGroup,
    HeatingBot,
    HeatingCampaign,
    HeatingLog,
    HeatingStats,
    CreateHeatingGroupForm,
    CreateHeatingBotForm,
    CreateHeatingCampaignForm,
    TelegramBotInfo,
    TelegramSendMessageResponse,
} from '@/types/heating';

const API_BASE = '/api/heating';
const ADMIN_ID = 'default'; // Can be replaced with actual user ID

// API Response types
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

interface ApiListResponse<T> {
    success: boolean;
    data?: T[];
    error?: string;
}

interface SyncCheckResponse {
    success: boolean;
    data?: {
        hasData: boolean;
        groups: number;
        bots: number;
        campaigns: number;
    };
    error?: string;
}

interface SyncResponse {
    success: boolean;
    results?: {
        groups: { imported: number; errors: number };
        bots: { imported: number; errors: number };
        campaigns: { imported: number; errors: number };
    };
    error?: string;
}

interface ProcessResponse {
    success: boolean;
    results?: Array<{ status: string; campaign: string; message?: string }>;
    error?: string;
}

// Local storage keys for migration check
const STORAGE_KEYS = {
    groups: 'heating_groups',
    bots: 'heating_bots',
    campaigns: 'heating_campaigns',
    logs: 'heating_logs',
    migrated: 'heating_migrated_to_d1',
} as const;

export function useHeating() {
    // States
    const [groups, setGroups] = useState<HeatingGroup[]>([]);
    const [bots, setBots] = useState<HeatingBot[]>([]);
    const [campaigns, setCampaigns] = useState<HeatingCampaign[]>([]);
    const [logs, setLogs] = useState<HeatingLog[]>([]);
    const [stats, setStats] = useState<HeatingStats>({
        totalGroups: 0,
        totalBots: 0,
        activeBots: 0,
        totalCampaigns: 0,
        runningCampaigns: 0,
        totalMessagesSent: 0,
        totalErrors: 0,
        successRate: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMigrating, setIsMigrating] = useState(false);

    // ========== API HELPERS ==========

    const apiGet = async <T>(endpoint: string): Promise<T[]> => {
        const res = await fetch(`${API_BASE}/${endpoint}?admin_id=${ADMIN_ID}`);
        const data: ApiListResponse<T> = await res.json();
        if (!data.success) throw new Error(data.error || 'Unknown error');
        return data.data || [];
    };

    const apiPost = async <T>(endpoint: string, body: unknown): Promise<T> => {
        const res = await fetch(`${API_BASE}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...body as object, admin_id: ADMIN_ID }),
        });
        const data: ApiResponse<T> = await res.json();
        if (!data.success) throw new Error(data.error || 'Unknown error');
        return data.data as T;
    };

    const apiPut = async (endpoint: string, body: unknown): Promise<void> => {
        const res = await fetch(`${API_BASE}/${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data: ApiResponse<void> = await res.json();
        if (!data.success) throw new Error(data.error || 'Unknown error');
    };

    const apiDelete = async (endpoint: string, id: number): Promise<void> => {
        const res = await fetch(`${API_BASE}/${endpoint}?id=${id}`, {
            method: 'DELETE',
        });
        const data: ApiResponse<void> = await res.json();
        if (!data.success) throw new Error(data.error || 'Unknown error');
    };

    // ========== LOAD DATA FROM API ==========

    const loadFromAPI = useCallback(async () => {
        try {
            setIsLoading(true);
            const [groupsData, botsData, campaignsData, logsData] = await Promise.all([
                apiGet<HeatingGroup>('groups'),
                apiGet<HeatingBot>('bots'),
                apiGet<HeatingCampaign>('campaigns'),
                apiGet<HeatingLog>('logs'),
            ]);

            setGroups(groupsData);
            setBots(botsData);
            setCampaigns(campaignsData);
            setLogs(logsData);

            console.log('[Heating] Loaded from API:', {
                groups: groupsData.length,
                bots: botsData.length,
                campaigns: campaignsData.length,
                logs: logsData.length,
            });
        } catch (e) {
            console.error('[Heating] Error loading from API:', e);
            setError(e instanceof Error ? e.message : 'Error loading data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ========== MIGRATION ==========

    const migrateToD1 = useCallback(async () => {
        const alreadyMigrated = localStorage.getItem(STORAGE_KEYS.migrated);
        if (alreadyMigrated) return;

        // Check if there's local data to migrate
        const localGroups = localStorage.getItem(STORAGE_KEYS.groups);
        const localBots = localStorage.getItem(STORAGE_KEYS.bots);
        const localCampaigns = localStorage.getItem(STORAGE_KEYS.campaigns);

        if (!localGroups && !localBots && !localCampaigns) {
            localStorage.setItem(STORAGE_KEYS.migrated, 'true');
            return;
        }

        // Check if D1 already has data
        try {
            const checkRes = await fetch(`${API_BASE}/sync?admin_id=${ADMIN_ID}`);
            const checkData: SyncCheckResponse = await checkRes.json();

            if (checkData.success && checkData.data?.hasData) {
                console.log('[Heating] D1 already has data, skipping migration');
                localStorage.setItem(STORAGE_KEYS.migrated, 'true');
                return;
            }
        } catch (e) {
            console.error('[Heating] Error checking D1:', e);
            return;
        }

        // Migrate data
        setIsMigrating(true);
        toast.info('Migrando dados para a nuvem...');

        try {
            const groups = localGroups ? JSON.parse(localGroups) : [];
            const bots = localBots ? JSON.parse(localBots) : [];
            const campaigns = localCampaigns ? JSON.parse(localCampaigns) : [];

            const res = await fetch(`${API_BASE}/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminId: ADMIN_ID,
                    groups,
                    bots,
                    campaigns,
                }),
            });

            const data: SyncResponse = await res.json();

            if (data.success && data.results) {
                localStorage.setItem(STORAGE_KEYS.migrated, 'true');
                toast.success(`Migração concluída! ${data.results.groups.imported} grupos, ${data.results.bots.imported} bots, ${data.results.campaigns.imported} campanhas`);
                console.log('[Heating] Migration completed:', data.results);

                // Reload data from API
                await loadFromAPI();
            } else {
                throw new Error(data.error || 'Migration failed');
            }
        } catch (e) {
            console.error('[Heating] Migration error:', e);
            toast.error('Erro na migração. Usando dados locais.');
        } finally {
            setIsMigrating(false);
        }
    }, [loadFromAPI]);

    // ========== INITIAL LOAD ==========

    useEffect(() => {
        const init = async () => {
            await migrateToD1();
            await loadFromAPI();
        };
        init();
    }, [migrateToD1, loadFromAPI]);

    // ========== CALCULATE STATS ==========

    const calculateStats = useCallback(() => {
        const runningCampaigns = campaigns.filter(c => c.status === 'running').length;
        const activeBots = bots.filter(b => b.status === 'active').length;
        const totalSent = campaigns.reduce((acc, c) => acc + c.total_messages_sent, 0);
        const totalErrors = campaigns.reduce((acc, c) => acc + c.total_errors, 0);
        const successRate = totalSent > 0 ? Math.round(((totalSent - totalErrors) / totalSent) * 100) : 100;

        setStats({
            totalGroups: groups.length,
            totalBots: bots.length,
            activeBots,
            totalCampaigns: campaigns.length,
            runningCampaigns,
            totalMessagesSent: totalSent,
            totalErrors,
            successRate,
        });
    }, [groups, bots, campaigns]);

    useEffect(() => {
        calculateStats();
    }, [calculateStats]);

    // ========== AUTOMATIC SENDING LOOP ==========

    const lastSendTimeRef = useRef<Record<number, number>>({});
    const sendingRef = useRef<boolean>(false);

    const isWithinTimeWindow = useCallback((windowStart: string, windowEnd: string): boolean => {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const [startH, startM] = windowStart.split(':').map(Number);
        const [endH, endM] = windowEnd.split(':').map(Number);

        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;

        return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    }, []);

    const getRandomInterval = useCallback((min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }, []);

    // ========== MANUAL & AUTO PROCESS ==========

    const forceProcess = useCallback(async (manual = false) => {
        if (sendingRef.current) return;

        // Se for manual, não checar campanhas rodando localmente antes de tentar,
        // pois o estado local pode estar desatualizado
        if (!manual) {
            const runningCampaigns = campaigns.filter(c => c.status === 'running');
            if (runningCampaigns.length === 0) return;
        }

        sendingRef.current = true;
        if (manual) toast.info("Forçando execução do aquecimento...");

        try {
            const res = await fetch(`${API_BASE}/process`, { method: 'POST' });
            const data: ProcessResponse = await res.json();

            if (data.success && data.results) {
                const sentCount = data.results.filter(r => r.status === 'sent').length;
                if (sentCount > 0) {
                    console.log(`[Heating] Processed: ${sentCount} messages sent`);
                    if (manual) toast.success(`${sentCount} mensagens enviadas!`);
                    await loadFromAPI();
                } else if (manual) {
                    toast.info("Processo rodou, mas nenhuma mensagem estava na fila.");
                }
            } else if (manual) {
                toast.warning("Processo rodou, mas retorno foi vazio.");
            }
        } catch (e) {
            console.error('[Heating] Process error:', e);
            if (manual) toast.error("Erro ao executar processo.");
        } finally {
            sendingRef.current = false;
        }
    }, [campaigns, loadFromAPI]);

    // Automatic polling
    useEffect(() => {
        const interval = setInterval(() => forceProcess(false), 30000);
        return () => clearInterval(interval);
    }, [forceProcess]);

    // ========== GROUP OPERATIONS ==========

    const addGroup = useCallback(async (data: CreateHeatingGroupForm): Promise<HeatingGroup | null> => {
        try {
            const result = await apiPost<{ id: number }>('groups', {
                name: data.name,
                chat_id: data.chat_id,
                description: data.description,
                tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
            });

            toast.success(`Grupo "${data.name}" adicionado!`);
            await loadFromAPI();
            return groups.find(g => g.id === result.id) || null;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao adicionar grupo';
            toast.error(msg);
            return null;
        }
    }, [loadFromAPI, groups]);

    const updateGroup = useCallback(async (id: number, data: Partial<HeatingGroup>): Promise<boolean> => {
        try {
            await apiPut('groups', { id, ...data });
            toast.success('Grupo atualizado!');
            await loadFromAPI();
            return true;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao atualizar grupo';
            toast.error(msg);
            return false;
        }
    }, [loadFromAPI]);

    const deleteGroup = useCallback(async (id: number): Promise<boolean> => {
        try {
            await apiDelete('groups', id);
            toast.success('Grupo removido!');
            await loadFromAPI();
            return true;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao remover grupo';
            toast.error(msg);
            return false;
        }
    }, [loadFromAPI]);

    const testGroup = useCallback(async (groupId: number, token: string): Promise<boolean> => {
        try {
            const group = groups.find(g => g.id === groupId);
            if (!group) throw new Error('Grupo não encontrado');

            const url = `https://api.telegram.org/bot${token}/sendMessage`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: group.chat_id,
                    text: '✅ Teste de conexão - BootFlow Aquecer Contas',
                    disable_notification: true,
                }),
            });

            const data: TelegramSendMessageResponse = await res.json();
            const status = data.ok ? 'success' : 'failed';

            await updateGroup(groupId, {
                test_status: status,
                last_test_at: new Date().toISOString(),
            });

            if (data.ok) {
                toast.success('Teste enviado com sucesso!');
                return true;
            } else {
                toast.error(`Falha no teste: ${data.description}`);
                return false;
            }
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro no teste';
            toast.error(msg);
            return false;
        }
    }, [groups, updateGroup]);

    const checkGroupStatus = useCallback(async (groupId: number): Promise<void> => {
        try {
            toast.loading("Verificando status do grupo...");
            const res = await fetch(`${API_BASE}/check-group?id=${groupId}`);
            const data = await res.json();

            toast.dismiss();

            if (data.success) {
                const { status, details, bot_used, chat_info } = data.data;

                // Update local state is handled by reloading from API or updating manually if needed
                // But loadFromAPI is safer to sync everything
                await loadFromAPI();

                if (status === 'active') {
                    toast.success(`Grupo Ativo! (${details})`);
                } else if (status === 'blocked' || status === 'kicked') {
                    toast.error(`Grupo Bloqueado/Banido: ${details}`);
                } else if (status === 'not_found') {
                    toast.error(`Grupo não encontrado: ${details}`);
                } else {
                    toast.warning(`Status: ${status} - ${details}`);
                }

                if (chat_info) {
                    console.log("[Heating] Chat Info:", chat_info);
                }

            } else {
                throw new Error(data.error || "Erro desconhecido");
            }
        } catch (e) {
            toast.dismiss();
            toast.error(`Erro ao verificar: ${e instanceof Error ? e.message : 'Desconhecido'}`);
        }
    }, [loadFromAPI]);

    // ========== BOT OPERATIONS ==========

    const validateBotToken = useCallback(async (token: string): Promise<TelegramBotInfo | null> => {
        try {
            const url = `https://api.telegram.org/bot${token}/getMe`;
            const res = await fetch(url);
            const data: TelegramBotInfo = await res.json();
            return data;
        } catch {
            return null;
        }
    }, []);

    const addBot = useCallback(async (data: CreateHeatingBotForm): Promise<HeatingBot | null> => {
        try {
            // Validate token first
            const validation = await validateBotToken(data.token);
            if (!validation?.ok) {
                toast.error('Token inválido');
                return null;
            }

            const result = await apiPost<{ id: number }>('bots', {
                name: data.name,
                token: data.token,
                username: validation.result?.username,
                max_messages_per_hour: data.max_messages_per_hour,
                max_messages_per_day: data.max_messages_per_day,
            });

            toast.success(`Bot "${data.name}" adicionado!`);
            await loadFromAPI();
            return bots.find(b => b.id === result.id) || null;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao adicionar bot';
            toast.error(msg);
            return null;
        }
    }, [validateBotToken, loadFromAPI, bots]);

    const updateBot = useCallback(async (id: number, data: Partial<HeatingBot>): Promise<boolean> => {
        try {
            await apiPut('bots', { id, ...data });
            await loadFromAPI();
            return true;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao atualizar bot';
            toast.error(msg);
            return false;
        }
    }, [loadFromAPI]);

    const deleteBot = useCallback(async (id: number): Promise<boolean> => {
        try {
            await apiDelete('bots', id);
            toast.success('Bot removido!');
            await loadFromAPI();
            return true;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao remover bot';
            toast.error(msg);
            return false;
        }
    }, [loadFromAPI]);

    const revalidateBot = useCallback(async (id: number): Promise<boolean> => {
        const bot = bots.find(b => b.id === id);
        if (!bot) return false;

        const validation = await validateBotToken(bot.token);
        if (validation?.ok) {
            await updateBot(id, {
                username: validation.result?.username,
                status: 'active',
                last_validated_at: new Date().toISOString(),
                validation_error: undefined,
            });
            toast.success('Bot revalidado!');
            return true;
        } else {
            await updateBot(id, {
                status: 'error',
                validation_error: validation?.description || 'Token inválido',
            });
            toast.error('Falha na revalidação');
            return false;
        }
    }, [bots, validateBotToken, updateBot]);

    // ========== CAMPAIGN OPERATIONS ==========

    const addCampaign = useCallback(async (data: CreateHeatingCampaignForm): Promise<HeatingCampaign | null> => {
        try {
            if (!data.group_id || data.bot_ids.length === 0 || data.messages.length === 0) {
                toast.error('Preencha todos os campos obrigatórios');
                return null;
            }

            const result = await apiPost<{ id: number }>('campaigns', {
                name: data.name,
                group_id: data.group_id,
                bot_ids: data.bot_ids,
                messages: data.messages.filter(m => m.trim()),
                send_mode: data.send_mode,
                interval_min: data.interval_min,
                interval_max: data.interval_max,
                window_start: data.window_start,
                window_end: data.window_end,
                max_messages_per_bot_per_day: data.max_messages_per_bot_per_day,
            });

            toast.success(`Campanha "${data.name}" criada!`);
            await loadFromAPI();
            return campaigns.find(c => c.id === result.id) || null;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao criar campanha';
            toast.error(msg);
            return null;
        }
    }, [loadFromAPI, campaigns]);

    const updateCampaign = useCallback(async (id: number, data: Partial<HeatingCampaign>): Promise<boolean> => {
        try {
            await apiPut('campaigns', { id, ...data });
            await loadFromAPI();
            return true;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao atualizar campanha';
            toast.error(msg);
            return false;
        }
    }, [loadFromAPI]);

    const deleteCampaign = useCallback(async (id: number): Promise<boolean> => {
        try {
            await apiDelete('campaigns', id);
            toast.success('Campanha removida!');
            await loadFromAPI();
            return true;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao remover campanha';
            toast.error(msg);
            return false;
        }
    }, [loadFromAPI]);

    const startCampaign = useCallback(async (id: number): Promise<boolean> => {
        const success = await updateCampaign(id, { status: 'running' });
        if (success) toast.success('Campanha iniciada!');
        return success;
    }, [updateCampaign]);

    const pauseCampaign = useCallback(async (id: number): Promise<boolean> => {
        const success = await updateCampaign(id, { status: 'paused' });
        if (success) toast.info('Campanha pausada');
        return success;
    }, [updateCampaign]);

    const stopCampaign = useCallback(async (id: number): Promise<boolean> => {
        const success = await updateCampaign(id, { status: 'stopped' });
        if (success) toast.info('Campanha parada');
        return success;
    }, [updateCampaign]);

    const duplicateCampaign = useCallback(async (id: number): Promise<HeatingCampaign | null> => {
        const original = campaigns.find(c => c.id === id);
        if (!original) return null;

        return addCampaign({
            name: `${original.name} (cópia)`,
            group_id: original.group_id,
            bot_ids: original.bots?.map(b => b.bot_id) || [],
            messages: original.messages?.map(m => m.content) || [],
            send_mode: original.send_mode,
            interval_min: original.interval_min,
            interval_max: original.interval_max,
            window_start: original.window_start,
            window_end: original.window_end,
            max_messages_per_bot_per_day: original.max_messages_per_bot_per_day,
        });
    }, [campaigns, addCampaign]);

    // ========== LOG OPERATIONS ==========

    const addLog = useCallback(async (logData: Omit<HeatingLog, 'id' | 'sent_at'>): Promise<void> => {
        // Logs are added by the backend, this is just for compatibility
        console.log('[Heating] Log would be added:', logData);
    }, []);

    const clearLogs = useCallback(async (campaignId?: number): Promise<void> => {
        try {
            const url = campaignId
                ? `${API_BASE}/logs?campaign_id=${campaignId}`
                : `${API_BASE}/logs`;
            await fetch(url, { method: 'DELETE' });
            toast.success('Logs limpos!');
            await loadFromAPI();
        } catch (e) {
            toast.error('Erro ao limpar logs');
        }
    }, [loadFromAPI]);

    const getLogsByCampaign = useCallback((campaignId: number, limit = 100): HeatingLog[] => {
        return logs.filter(l => l.campaign_id === campaignId).slice(0, limit);
    }, [logs]);

    // ========== SEND MESSAGE (for testing) ==========

    const sendMessage = useCallback(async (
        campaign: HeatingCampaign,
        bot: HeatingBot,
        message: { id: number; content: string }
    ): Promise<boolean> => {
        try {
            const group = groups.find(g => g.id === campaign.group_id);
            if (!group) throw new Error('Grupo não encontrado');

            const url = `https://api.telegram.org/bot${bot.token}/sendMessage`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: group.chat_id,
                    text: message.content,
                    disable_web_page_preview: true,
                }),
            });

            const data: TelegramSendMessageResponse = await res.json();

            // Reload to get updated stats
            await loadFromAPI();

            return data.ok;
        } catch (e) {
            console.error('[Heating] Send message error:', e);
            return false;
        }
    }, [groups, loadFromAPI]);

    return {
        // Data
        groups,
        bots,
        campaigns,
        logs,
        stats,
        isLoading,
        isMigrating,
        error,

        // Group operations
        addGroup,
        updateGroup,
        deleteGroup,
        testGroup,
        checkGroupStatus,

        // Bot operations
        addBot,
        updateBot,
        deleteBot,
        revalidateBot,
        validateBotToken,

        // Campaign operations
        addCampaign,
        updateCampaign,
        deleteCampaign,
        startCampaign,
        pauseCampaign,
        stopCampaign,
        duplicateCampaign,

        // Log operations
        addLog,
        clearLogs,
        getLogsByCampaign,

        // Actions
        sendMessage,
        loadFromAPI,
        forceProcess,
    };
}
