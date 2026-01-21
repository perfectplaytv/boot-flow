import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import type {
    HeatingGroup,
    HeatingBot,
    HeatingCampaign,
    HeatingMessage,
    HeatingLog,
    HeatingStats,
    CreateHeatingGroupForm,
    CreateHeatingBotForm,
    CreateHeatingCampaignForm,
    TelegramBotInfo,
    TelegramSendMessageResponse,
} from '@/types/heating';

const API_BASE = '/api/heating';

// Local storage keys for offline/demo mode - defined outside hook to avoid dependency issues
const STORAGE_KEYS = {
    groups: 'heating_groups',
    bots: 'heating_bots',
    campaigns: 'heating_campaigns',
    logs: 'heating_logs',
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

    // Load data from localStorage (fallback for demo mode)
    const loadFromLocalStorage = useCallback(() => {
        try {
            const savedGroups = localStorage.getItem(STORAGE_KEYS.groups);
            const savedBots = localStorage.getItem(STORAGE_KEYS.bots);
            const savedCampaigns = localStorage.getItem(STORAGE_KEYS.campaigns);
            const savedLogs = localStorage.getItem(STORAGE_KEYS.logs);

            if (savedGroups) setGroups(JSON.parse(savedGroups));
            if (savedBots) setBots(JSON.parse(savedBots));
            if (savedCampaigns) setCampaigns(JSON.parse(savedCampaigns));
            if (savedLogs) setLogs(JSON.parse(savedLogs));
        } catch (e) {
            console.error('Error loading from localStorage:', e);
        }
    }, []);

    // Save to localStorage
    const saveToLocalStorage = useCallback((key: string, data: unknown) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    }, []);

    // Calculate stats
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

    // Initial load
    useEffect(() => {
        loadFromLocalStorage();
        setIsLoading(false);
    }, [loadFromLocalStorage]);

    // Recalculate stats when data changes
    useEffect(() => {
        calculateStats();
    }, [calculateStats]);

    // Track last send time per campaign to respect intervals
    const lastSendTimeRef = useRef<Record<number, number>>({});
    const sendingRef = useRef<boolean>(false);

    // Helper: Check if current time is within campaign window
    const isWithinTimeWindow = useCallback((windowStart: string, windowEnd: string): boolean => {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const [startH, startM] = windowStart.split(':').map(Number);
        const [endH, endM] = windowEnd.split(':').map(Number);

        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;

        return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    }, []);

    // Helper: Get random interval between min and max
    const getRandomInterval = useCallback((min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }, []);

    // Automatic sending loop for running campaigns
    useEffect(() => {
        const runSendingLoop = async () => {
            if (sendingRef.current) return; // Prevent concurrent runs
            sendingRef.current = true;

            try {
                const runningCampaigns = campaigns.filter(c => c.status === 'running');

                for (const campaign of runningCampaigns) {
                    // Check time window
                    if (!isWithinTimeWindow(campaign.window_start, campaign.window_end)) {
                        continue;
                    }

                    // Check if enough time has passed since last send
                    const lastSend = lastSendTimeRef.current[campaign.id] || 0;
                    const now = Date.now();
                    const minInterval = campaign.interval_min * 1000;
                    const maxInterval = campaign.interval_max * 1000;
                    const requiredInterval = getRandomInterval(minInterval, maxInterval);

                    if (now - lastSend < requiredInterval) {
                        continue;
                    }

                    // Get available bots for this campaign
                    const campaignBots = campaign.bots || [];
                    if (campaignBots.length === 0) continue;

                    // Pick a random bot
                    const randomBotData = campaignBots[Math.floor(Math.random() * campaignBots.length)];
                    const bot = bots.find(b => b.id === randomBotData.bot_id);
                    if (!bot || bot.status !== 'active') continue;

                    // Check daily limit for bot
                    if (bot.messages_sent_today >= campaign.max_messages_per_bot_per_day) continue;

                    // Get messages for this campaign
                    const campaignMessages = campaign.messages || [];
                    if (campaignMessages.length === 0) continue;

                    // Pick message based on send mode
                    let messageIndex = 0;
                    if (campaign.send_mode === 'sequential') {
                        const currentIndex = (campaign.current_message_index || 0) % campaignMessages.length;
                        messageIndex = currentIndex;
                    } else {
                        messageIndex = Math.floor(Math.random() * campaignMessages.length);
                    }

                    const message = campaignMessages[messageIndex];
                    if (!message) continue;

                    // Get group
                    const group = groups.find(g => g.id === campaign.group_id);
                    if (!group) continue;

                    // SEND THE MESSAGE
                    try {
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

                        // Update last send time
                        lastSendTimeRef.current[campaign.id] = Date.now();

                        // Add log
                        const newLog: HeatingLog = {
                            id: Date.now(),
                            campaign_id: campaign.id,
                            bot_id: bot.id,
                            bot_name: bot.name,
                            message_id: message.id,
                            message_preview: message.content.slice(0, 50),
                            status: data.ok ? 'success' : 'error',
                            error_message: data.ok ? undefined : data.description,
                            telegram_message_id: data.result?.message_id?.toString(),
                            sent_at: new Date().toISOString(),
                        };

                        setLogs(prev => {
                            const updated = [newLog, ...prev].slice(0, 500);
                            saveToLocalStorage(STORAGE_KEYS.logs, updated);
                            return updated;
                        });

                        // Update campaign stats
                        setCampaigns(prev => {
                            const updated = prev.map(c => {
                                if (c.id === campaign.id) {
                                    return {
                                        ...c,
                                        total_messages_sent: c.total_messages_sent + (data.ok ? 1 : 0),
                                        total_errors: c.total_errors + (data.ok ? 0 : 1),
                                        current_message_index: (c.current_message_index || 0) + 1,
                                        last_sent_at: new Date().toISOString(),
                                    };
                                }
                                return c;
                            });
                            saveToLocalStorage(STORAGE_KEYS.campaigns, updated);
                            return updated;
                        });

                        // Update bot message count
                        setBots(prev => {
                            const updated = prev.map(b => {
                                if (b.id === bot.id) {
                                    return {
                                        ...b,
                                        messages_sent_today: (b.messages_sent_today || 0) + 1,
                                    };
                                }
                                return b;
                            });
                            saveToLocalStorage(STORAGE_KEYS.bots, updated);
                            return updated;
                        });

                        if (data.ok) {
                            console.log(`✅ Mensagem enviada: ${bot.name} -> ${group.name}`);
                        } else {
                            console.error(`❌ Erro: ${data.description}`);
                        }
                    } catch (err) {
                        console.error('Erro ao enviar mensagem:', err);
                    }
                }
            } finally {
                sendingRef.current = false;
            }
        };

        // Run every 10 seconds
        const interval = setInterval(runSendingLoop, 10000);

        // Run immediately on mount
        runSendingLoop();

        return () => clearInterval(interval);
    }, [campaigns, bots, groups, isWithinTimeWindow, getRandomInterval, saveToLocalStorage]);

    // ========== GROUP OPERATIONS ==========

    const addGroup = useCallback(async (data: CreateHeatingGroupForm): Promise<HeatingGroup | null> => {
        try {
            const newGroup: HeatingGroup = {
                id: Date.now(),
                admin_id: 'local',
                name: data.name,
                chat_id: data.chat_id,
                description: data.description,
                tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
                is_active: true,
                test_status: 'pending',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            const updated = [...groups, newGroup];
            setGroups(updated);
            saveToLocalStorage(STORAGE_KEYS.groups, updated);
            toast.success(`Grupo "${newGroup.name}" adicionado!`);
            return newGroup;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao adicionar grupo';
            toast.error(msg);
            setError(msg);
            return null;
        }
    }, [groups, saveToLocalStorage]);

    const updateGroup = useCallback(async (id: number, data: Partial<HeatingGroup>): Promise<boolean> => {
        try {
            const updated = groups.map(g =>
                g.id === id ? { ...g, ...data, updated_at: new Date().toISOString() } : g
            );
            setGroups(updated);
            saveToLocalStorage(STORAGE_KEYS.groups, updated);
            toast.success('Grupo atualizado!');
            return true;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao atualizar grupo';
            toast.error(msg);
            return false;
        }
    }, [groups, saveToLocalStorage]);

    const deleteGroup = useCallback(async (id: number): Promise<boolean> => {
        try {
            const updated = groups.filter(g => g.id !== id);
            setGroups(updated);
            saveToLocalStorage(STORAGE_KEYS.groups, updated);
            toast.success('Grupo removido!');
            return true;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao remover grupo';
            toast.error(msg);
            return false;
        }
    }, [groups, saveToLocalStorage]);

    const testGroup = useCallback(async (groupId: number, token: string): Promise<boolean> => {
        try {
            const group = groups.find(g => g.id === groupId);
            if (!group) throw new Error('Grupo não encontrado');

            // Send test message via Telegram API
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
            const errorMsg = data.ok ? undefined : data.description;

            await updateGroup(groupId, {
                test_status: status,
                last_test_at: new Date().toISOString(),
            });

            if (data.ok) {
                toast.success('Teste enviado com sucesso!');
                return true;
            } else {
                toast.error(`Falha no teste: ${errorMsg}`);
                return false;
            }
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro no teste';
            toast.error(msg);
            return false;
        }
    }, [groups, updateGroup]);

    // ========== BOT OPERATIONS ==========

    const validateBotToken = useCallback(async (token: string): Promise<TelegramBotInfo> => {
        const url = `https://api.telegram.org/bot${token}/getMe`;
        const res = await fetch(url);
        return res.json();
    }, []);

    const addBot = useCallback(async (data: CreateHeatingBotForm): Promise<HeatingBot | null> => {
        try {
            // Validate token first
            const validation = await validateBotToken(data.token);
            if (!validation.ok) {
                toast.error(`Token inválido: ${validation.description}`);
                return null;
            }

            const newBot: HeatingBot = {
                id: Date.now(),
                admin_id: 'local',
                name: data.name,
                token: data.token,
                username: validation.result?.username,
                status: 'active',
                max_messages_per_hour: data.max_messages_per_hour,
                max_messages_per_day: data.max_messages_per_day,
                messages_sent_today: 0,
                messages_sent_this_hour: 0,
                last_validated_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            const updated = [...bots, newBot];
            setBots(updated);
            saveToLocalStorage(STORAGE_KEYS.bots, updated);
            toast.success(`Bot @${newBot.username} adicionado!`);
            return newBot;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao adicionar bot';
            toast.error(msg);
            return null;
        }
    }, [bots, saveToLocalStorage, validateBotToken]);

    const updateBot = useCallback(async (id: number, data: Partial<HeatingBot>): Promise<boolean> => {
        try {
            const updated = bots.map(b =>
                b.id === id ? { ...b, ...data, updated_at: new Date().toISOString() } : b
            );
            setBots(updated);
            saveToLocalStorage(STORAGE_KEYS.bots, updated);
            toast.success('Bot atualizado!');
            return true;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao atualizar bot';
            toast.error(msg);
            return false;
        }
    }, [bots, saveToLocalStorage]);

    const deleteBot = useCallback(async (id: number): Promise<boolean> => {
        try {
            const updated = bots.filter(b => b.id !== id);
            setBots(updated);
            saveToLocalStorage(STORAGE_KEYS.bots, updated);
            toast.success('Bot removido!');
            return true;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao remover bot';
            toast.error(msg);
            return false;
        }
    }, [bots, saveToLocalStorage]);

    const revalidateBot = useCallback(async (id: number): Promise<boolean> => {
        try {
            const bot = bots.find(b => b.id === id);
            if (!bot) throw new Error('Bot não encontrado');

            const validation = await validateBotToken(bot.token);
            await updateBot(id, {
                status: validation.ok ? 'active' : 'error',
                username: validation.result?.username,
                last_validated_at: new Date().toISOString(),
                validation_error: validation.ok ? undefined : validation.description,
            });

            if (validation.ok) {
                toast.success(`Bot @${validation.result?.username} validado!`);
                return true;
            } else {
                toast.error(`Erro na validação: ${validation.description}`);
                return false;
            }
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro na validação';
            toast.error(msg);
            return false;
        }
    }, [bots, validateBotToken, updateBot]);

    // ========== CAMPAIGN OPERATIONS ==========

    const addCampaign = useCallback(async (data: CreateHeatingCampaignForm): Promise<HeatingCampaign | null> => {
        try {
            const group = groups.find(g => g.id === data.group_id);
            if (!group) throw new Error('Grupo não encontrado');

            const newCampaign: HeatingCampaign = {
                id: Date.now(),
                admin_id: 'local',
                name: data.name,
                group_id: data.group_id,
                group_name: group.name,
                status: 'paused',
                send_mode: data.send_mode,
                interval_min: data.interval_min,
                interval_max: data.interval_max,
                window_start: data.window_start,
                window_end: data.window_end,
                max_messages_per_bot_per_day: data.max_messages_per_bot_per_day,
                message_index: 0,
                total_messages_sent: 0,
                total_errors: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                bots: data.bot_ids.map(botId => {
                    const bot = bots.find(b => b.id === botId);
                    return {
                        id: Date.now() + botId,
                        campaign_id: Date.now(),
                        bot_id: botId,
                        bot_name: bot?.name,
                        bot_username: bot?.username,
                        messages_sent_today: 0,
                    };
                }),
                messages: data.messages.filter(m => m.trim()).map((content, index) => ({
                    id: Date.now() + index,
                    campaign_id: Date.now(),
                    content,
                    order_index: index,
                    times_sent: 0,
                    created_at: new Date().toISOString(),
                })),
            };

            const updated = [...campaigns, newCampaign];
            setCampaigns(updated);
            saveToLocalStorage(STORAGE_KEYS.campaigns, updated);
            toast.success(`Campanha "${newCampaign.name}" criada!`);
            return newCampaign;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao criar campanha';
            toast.error(msg);
            return null;
        }
    }, [groups, bots, campaigns, saveToLocalStorage]);

    const updateCampaign = useCallback(async (id: number, data: Partial<HeatingCampaign>): Promise<boolean> => {
        try {
            const updated = campaigns.map(c =>
                c.id === id ? { ...c, ...data, updated_at: new Date().toISOString() } : c
            );
            setCampaigns(updated);
            saveToLocalStorage(STORAGE_KEYS.campaigns, updated);
            return true;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao atualizar campanha';
            toast.error(msg);
            return false;
        }
    }, [campaigns, saveToLocalStorage]);

    const deleteCampaign = useCallback(async (id: number): Promise<boolean> => {
        try {
            const updated = campaigns.filter(c => c.id !== id);
            setCampaigns(updated);
            saveToLocalStorage(STORAGE_KEYS.campaigns, updated);
            toast.success('Campanha removida!');
            return true;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao remover campanha';
            toast.error(msg);
            return false;
        }
    }, [campaigns, saveToLocalStorage]);

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
        if (success) toast.warning('Campanha parada');
        return success;
    }, [updateCampaign]);

    const duplicateCampaign = useCallback(async (id: number): Promise<HeatingCampaign | null> => {
        const original = campaigns.find(c => c.id === id);
        if (!original) {
            toast.error('Campanha não encontrada');
            return null;
        }

        const copy: HeatingCampaign = {
            ...original,
            id: Date.now(),
            name: `${original.name} (cópia)`,
            status: 'paused',
            total_messages_sent: 0,
            total_errors: 0,
            message_index: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        const updated = [...campaigns, copy];
        setCampaigns(updated);
        saveToLocalStorage(STORAGE_KEYS.campaigns, updated);
        toast.success('Campanha duplicada!');
        return copy;
    }, [campaigns, saveToLocalStorage]);

    // ========== LOG OPERATIONS ==========

    const addLog = useCallback((log: Omit<HeatingLog, 'id' | 'sent_at'>): void => {
        const newLog: HeatingLog = {
            ...log,
            id: Date.now(),
            sent_at: new Date().toISOString(),
        };
        const updated = [newLog, ...logs].slice(0, 1000); // Keep last 1000 logs
        setLogs(updated);
        saveToLocalStorage(STORAGE_KEYS.logs, updated);
    }, [logs, saveToLocalStorage]);

    const clearLogs = useCallback((campaignId?: number): void => {
        const updated = campaignId ? logs.filter(l => l.campaign_id !== campaignId) : [];
        setLogs(updated);
        saveToLocalStorage(STORAGE_KEYS.logs, updated);
        toast.success('Logs limpos!');
    }, [logs, saveToLocalStorage]);

    const getLogsByCampaign = useCallback((campaignId: number, limit = 100): HeatingLog[] => {
        return logs.filter(l => l.campaign_id === campaignId).slice(0, limit);
    }, [logs]);

    // ========== SEND MESSAGE ==========

    const sendMessage = useCallback(async (
        campaign: HeatingCampaign,
        bot: HeatingBot,
        message: HeatingMessage
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

            // Add log
            addLog({
                campaign_id: campaign.id,
                bot_id: bot.id,
                bot_name: bot.name,
                message_id: message.id,
                message_preview: message.content.slice(0, 50),
                status: data.ok ? 'success' : 'error',
                error_message: data.ok ? undefined : data.description,
                telegram_message_id: data.result?.message_id?.toString(),
            });

            // Update campaign stats
            await updateCampaign(campaign.id, {
                total_messages_sent: campaign.total_messages_sent + (data.ok ? 1 : 0),
                total_errors: campaign.total_errors + (data.ok ? 0 : 1),
                last_sent_at: new Date().toISOString(),
            });

            return data.ok;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao enviar mensagem';
            addLog({
                campaign_id: campaign.id,
                bot_id: bot.id,
                bot_name: bot.name,
                message_id: message.id,
                status: 'error',
                error_message: msg,
            });
            return false;
        }
    }, [groups, addLog, updateCampaign]);

    return {
        // Data
        groups,
        bots,
        campaigns,
        logs,
        stats,
        isLoading,
        error,

        // Group operations
        addGroup,
        updateGroup,
        deleteGroup,
        testGroup,

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
    };
}
