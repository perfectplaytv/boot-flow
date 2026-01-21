import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useHeating } from "@/hooks/useHeating";
import type { CreateHeatingGroupForm, CreateHeatingBotForm, CreateHeatingCampaignForm, HeatingCampaign } from "@/types/heating";
import {
    Flame,
    Users,
    Bot,
    Megaphone,
    FileText,
    Plus,
    Play,
    Pause,
    Square,
    Copy,
    Trash2,
    RefreshCw,
    CheckCircle,
    XCircle,
    AlertCircle,
    Clock,
    Send,
    Settings,
    Eye,
    X,
    Loader2,
    Zap,
} from "lucide-react";

type SubTab = 'groups' | 'bots' | 'campaigns' | 'logs';

export function AquecerContasTab() {
    const {
        groups,
        bots,
        campaigns,
        logs,
        stats,
        isLoading,
        addGroup,
        deleteGroup,
        testGroup,
        addBot,
        deleteBot,
        revalidateBot,
        addCampaign,
        deleteCampaign,
        startCampaign,
        pauseCampaign,
        stopCampaign,
        duplicateCampaign,
        clearLogs,
    } = useHeating();

    // Sub-tab state
    const [subTab, setSubTab] = useState<SubTab>('campaigns');

    // Modal states
    const [showAddGroupModal, setShowAddGroupModal] = useState(false);
    const [showAddBotModal, setShowAddBotModal] = useState(false);
    const [showAddCampaignModal, setShowAddCampaignModal] = useState(false);
    const [showCampaignDetailsModal, setShowCampaignDetailsModal] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<HeatingCampaign | null>(null);

    // Form states
    const [newGroup, setNewGroup] = useState<CreateHeatingGroupForm>({
        name: '',
        chat_id: '',
        description: '',
        tags: '',
    });

    const [newBot, setNewBot] = useState<CreateHeatingBotForm>({
        name: '',
        token: '',
        max_messages_per_hour: 10,
        max_messages_per_day: 100,
    });

    const [newCampaign, setNewCampaign] = useState<CreateHeatingCampaignForm>({
        name: '',
        group_id: 0,
        bot_ids: [],
        messages: [''],
        send_mode: 'sequential',
        interval_min: 90,
        interval_max: 180,
        window_start: '09:00',
        window_end: '22:00',
        max_messages_per_bot_per_day: 50,
    });

    const [isValidatingBot, setIsValidatingBot] = useState(false);
    const [isTestingGroup, setIsTestingGroup] = useState<number | null>(null);

    // Log filter
    const [logFilter, setLogFilter] = useState<'all' | 'success' | 'error'>('all');

    // Handlers
    const handleAddGroup = async () => {
        if (!newGroup.name.trim() || !newGroup.chat_id.trim()) {
            toast.error('Preencha nome e chat_id do grupo');
            return;
        }
        const result = await addGroup(newGroup);
        if (result) {
            setNewGroup({ name: '', chat_id: '', description: '', tags: '' });
            setShowAddGroupModal(false);
        }
    };

    const handleAddBot = async () => {
        if (!newBot.name.trim() || !newBot.token.trim()) {
            toast.error('Preencha nome e token do bot');
            return;
        }
        setIsValidatingBot(true);
        const result = await addBot(newBot);
        setIsValidatingBot(false);
        if (result) {
            setNewBot({ name: '', token: '', max_messages_per_hour: 10, max_messages_per_day: 100 });
            setShowAddBotModal(false);
        }
    };

    const handleAddCampaign = async () => {
        if (!newCampaign.name.trim()) {
            toast.error('Digite o nome da campanha');
            return;
        }
        if (!newCampaign.group_id) {
            toast.error('Selecione um grupo');
            return;
        }
        if (newCampaign.bot_ids.length === 0) {
            toast.error('Selecione pelo menos um bot');
            return;
        }
        if (newCampaign.messages.filter(m => m.trim()).length === 0) {
            toast.error('Adicione pelo menos uma mensagem');
            return;
        }

        const result = await addCampaign(newCampaign);
        if (result) {
            setNewCampaign({
                name: '',
                group_id: 0,
                bot_ids: [],
                messages: [''],
                send_mode: 'sequential',
                interval_min: 90,
                interval_max: 180,
                window_start: '09:00',
                window_end: '22:00',
                max_messages_per_bot_per_day: 50,
            });
            setShowAddCampaignModal(false);
        }
    };

    const handleTestGroup = async (groupId: number) => {
        if (bots.length === 0) {
            toast.error('Adicione um bot primeiro para testar o grupo');
            return;
        }
        setIsTestingGroup(groupId);
        await testGroup(groupId, bots[0].token);
        setIsTestingGroup(null);
    };

    const addMessage = () => {
        setNewCampaign(prev => ({ ...prev, messages: [...prev.messages, ''] }));
    };

    const removeMessage = (index: number) => {
        setNewCampaign(prev => ({
            ...prev,
            messages: prev.messages.filter((_, i) => i !== index)
        }));
    };

    const updateMessage = (index: number, value: string) => {
        setNewCampaign(prev => ({
            ...prev,
            messages: prev.messages.map((m, i) => i === index ? value : m)
        }));
    };

    const toggleBotSelection = (botId: number) => {
        setNewCampaign(prev => ({
            ...prev,
            bot_ids: prev.bot_ids.includes(botId)
                ? prev.bot_ids.filter(id => id !== botId)
                : [...prev.bot_ids, botId]
        }));
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'running':
                return <Badge className="bg-green-600 animate-pulse"><Play className="w-3 h-3 mr-1" />Rodando</Badge>;
            case 'paused':
                return <Badge className="bg-yellow-600"><Pause className="w-3 h-3 mr-1" />Pausado</Badge>;
            case 'stopped':
                return <Badge className="bg-red-600"><Square className="w-3 h-3 mr-1" />Parado</Badge>;
            case 'completed':
                return <Badge className="bg-blue-600"><CheckCircle className="w-3 h-3 mr-1" />Concluído</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const filteredLogs = logFilter === 'all'
        ? logs
        : logs.filter(l => l.status === logFilter);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 rounded-lg p-4 text-white text-center">
                <h2 className="text-lg font-bold flex items-center justify-center gap-2">
                    <Flame className="w-5 h-5" />
                    Aqueça seus grupos com mensagens automáticas de múltiplos bots!
                </h2>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-700/40">
                    <CardContent className="pt-3 pb-2">
                        <div className="text-2xl font-bold text-orange-400">{stats.totalGroups}</div>
                        <div className="text-[10px] text-muted-foreground">Grupos</div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/40">
                    <CardContent className="pt-3 pb-2">
                        <div className="text-2xl font-bold text-blue-400">{stats.totalBots}</div>
                        <div className="text-[10px] text-muted-foreground">Bots</div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700/40">
                    <CardContent className="pt-3 pb-2">
                        <div className="text-2xl font-bold text-green-400">{stats.activeBots}</div>
                        <div className="text-[10px] text-muted-foreground">Bots Ativos</div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/40">
                    <CardContent className="pt-3 pb-2">
                        <div className="text-2xl font-bold text-purple-400">{stats.totalCampaigns}</div>
                        <div className="text-[10px] text-muted-foreground">Campanhas</div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 border-emerald-700/40">
                    <CardContent className="pt-3 pb-2">
                        <div className="text-2xl font-bold text-emerald-400">{stats.runningCampaigns}</div>
                        <div className="text-[10px] text-muted-foreground">Rodando</div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/30 border-cyan-700/40">
                    <CardContent className="pt-3 pb-2">
                        <div className="text-2xl font-bold text-cyan-400">{stats.totalMessagesSent}</div>
                        <div className="text-[10px] text-muted-foreground">Msgs Enviadas</div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-red-900/50 to-red-800/30 border-red-700/40">
                    <CardContent className="pt-3 pb-2">
                        <div className="text-2xl font-bold text-red-400">{stats.totalErrors}</div>
                        <div className="text-[10px] text-muted-foreground">Erros</div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-lime-900/50 to-lime-800/30 border-lime-700/40">
                    <CardContent className="pt-3 pb-2">
                        <div className="text-2xl font-bold text-lime-400">{stats.successRate}%</div>
                        <div className="text-[10px] text-muted-foreground">Taxa Sucesso</div>
                    </CardContent>
                </Card>
            </div>

            {/* Sub-tabs */}
            <div className="flex gap-2 border-b pb-2">
                {[
                    { id: 'campaigns' as const, label: '🎯 Campanhas', icon: Megaphone, count: campaigns.length },
                    { id: 'groups' as const, label: '👥 Grupos', icon: Users, count: groups.length },
                    { id: 'bots' as const, label: '🤖 Bots', icon: Bot, count: bots.length },
                    { id: 'logs' as const, label: '📜 Logs', icon: FileText, count: logs.length },
                ].map(tab => (
                    <Button
                        key={tab.id}
                        variant={subTab === tab.id ? 'default' : 'ghost'}
                        size="sm"
                        className="gap-1"
                        onClick={() => setSubTab(tab.id)}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                        <Badge variant="secondary" className="ml-1 text-[10px]">{tab.count}</Badge>
                    </Button>
                ))}
            </div>

            {/* Sub-tab: Campanhas */}
            {subTab === 'campaigns' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Megaphone className="w-5 h-5 text-orange-400" />
                            Campanhas de Aquecimento
                        </h3>
                        <Button
                            size="sm"
                            className="gap-1 bg-orange-600 hover:bg-orange-700"
                            onClick={() => setShowAddCampaignModal(true)}
                            disabled={groups.length === 0 || bots.length === 0}
                        >
                            <Plus className="w-4 h-4" />
                            Nova Campanha
                        </Button>
                    </div>

                    {groups.length === 0 || bots.length === 0 ? (
                        <Card className="bg-yellow-950/30 border-yellow-800/50">
                            <CardContent className="pt-6 text-center">
                                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-yellow-400" />
                                <p className="text-yellow-400 font-medium">Configuração Necessária</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {groups.length === 0 && "Adicione um grupo primeiro. "}
                                    {bots.length === 0 && "Adicione um bot primeiro."}
                                </p>
                            </CardContent>
                        </Card>
                    ) : campaigns.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="pt-6 text-center">
                                <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p className="text-muted-foreground">Nenhuma campanha criada</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Crie uma campanha para começar a aquecer seus grupos
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {campaigns.map(campaign => (
                                <Card key={campaign.id} className="hover:border-orange-600/50 transition-colors">
                                    <CardContent className="pt-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-orange-600/20 flex items-center justify-center">
                                                    <Flame className="w-5 h-5 text-orange-400" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">{campaign.name}</h4>
                                                    <p className="text-xs text-muted-foreground">
                                                        {campaign.group_name} • {campaign.bots?.length || 0} bots • {campaign.messages?.length || 0} msgs
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(campaign.status)}
                                                <div className="flex gap-1">
                                                    {campaign.status === 'paused' || campaign.status === 'stopped' ? (
                                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-400" onClick={() => startCampaign(campaign.id)}>
                                                            <Play className="w-4 h-4" />
                                                        </Button>
                                                    ) : (
                                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-yellow-400" onClick={() => pauseCampaign(campaign.id)}>
                                                            <Pause className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400" onClick={() => stopCampaign(campaign.id)}>
                                                        <Square className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => {
                                                        setSelectedCampaign(campaign);
                                                        setShowCampaignDetailsModal(true);
                                                    }}>
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => duplicateCampaign(campaign.id)}>
                                                        <Copy className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400" onClick={() => deleteCampaign(campaign.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4 mt-4 text-center text-xs">
                                            <div className="p-2 bg-muted/30 rounded">
                                                <div className="font-bold text-green-400">{campaign.total_messages_sent}</div>
                                                <div className="text-muted-foreground">Enviadas</div>
                                            </div>
                                            <div className="p-2 bg-muted/30 rounded">
                                                <div className="font-bold text-red-400">{campaign.total_errors}</div>
                                                <div className="text-muted-foreground">Erros</div>
                                            </div>
                                            <div className="p-2 bg-muted/30 rounded">
                                                <div className="font-bold text-blue-400">{campaign.interval_min}-{campaign.interval_max}s</div>
                                                <div className="text-muted-foreground">Intervalo</div>
                                            </div>
                                            <div className="p-2 bg-muted/30 rounded">
                                                <div className="font-bold text-purple-400">{campaign.window_start}-{campaign.window_end}</div>
                                                <div className="text-muted-foreground">Horário</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Sub-tab: Grupos */}
            {subTab === 'groups' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-400" />
                            Grupos do Telegram
                        </h3>
                        <Button size="sm" className="gap-1" onClick={() => setShowAddGroupModal(true)}>
                            <Plus className="w-4 h-4" />
                            Adicionar Grupo
                        </Button>
                    </div>

                    {groups.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="pt-6 text-center">
                                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p className="text-muted-foreground">Nenhum grupo cadastrado</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-3">
                            {groups.map(group => (
                                <Card key={group.id} className="hover:border-blue-600/50 transition-colors">
                                    <CardContent className="pt-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                                                    <Users className="w-5 h-5 text-blue-400" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">{group.name}</h4>
                                                    <p className="text-xs text-muted-foreground font-mono">{group.chat_id}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {group.test_status === 'success' && (
                                                    <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Testado</Badge>
                                                )}
                                                {group.test_status === 'failed' && (
                                                    <Badge className="bg-red-600"><XCircle className="w-3 h-3 mr-1" />Falhou</Badge>
                                                )}
                                                {group.test_status === 'pending' && (
                                                    <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Não testado</Badge>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8"
                                                    onClick={() => handleTestGroup(group.id)}
                                                    disabled={isTestingGroup === group.id || bots.length === 0}
                                                >
                                                    {isTestingGroup === group.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Send className="w-4 h-4" />
                                                    )}
                                                </Button>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400" onClick={() => deleteGroup(group.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Sub-tab: Bots */}
            {subTab === 'bots' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Bot className="w-5 h-5 text-purple-400" />
                            Bots (Identidades)
                        </h3>
                        <Button size="sm" className="gap-1" onClick={() => setShowAddBotModal(true)}>
                            <Plus className="w-4 h-4" />
                            Adicionar Bot
                        </Button>
                    </div>

                    <Card className="bg-blue-950/30 border-blue-800/50">
                        <CardContent className="pt-4 text-sm">
                            <p className="text-blue-300">
                                <strong>💡 Dica:</strong> Cada bot precisa ser criado via @BotFather e adicionado como administrador no grupo alvo.
                                Múltiplos bots criam a ilusão de várias pessoas conversando.
                            </p>
                        </CardContent>
                    </Card>

                    {bots.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="pt-6 text-center">
                                <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p className="text-muted-foreground">Nenhum bot cadastrado</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-3">
                            {bots.map(bot => (
                                <Card key={bot.id} className="hover:border-purple-600/50 transition-colors">
                                    <CardContent className="pt-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bot.status === 'active' ? 'bg-green-600/20' : bot.status === 'error' ? 'bg-red-600/20' : 'bg-gray-600/20'}`}>
                                                    <Bot className={`w-5 h-5 ${bot.status === 'active' ? 'text-green-400' : bot.status === 'error' ? 'text-red-400' : 'text-gray-400'}`} />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">{bot.name}</h4>
                                                    <p className="text-xs text-muted-foreground">@{bot.username}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {bot.status === 'active' && <Badge className="bg-green-600">Ativo</Badge>}
                                                {bot.status === 'inactive' && <Badge variant="outline">Inativo</Badge>}
                                                {bot.status === 'error' && <Badge className="bg-red-600">Erro</Badge>}
                                                <div className="text-xs text-muted-foreground">
                                                    {bot.messages_sent_today}/{bot.max_messages_per_day} hoje
                                                </div>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => revalidateBot(bot.id)}>
                                                    <RefreshCw className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400" onClick={() => deleteBot(bot.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Sub-tab: Logs */}
            {subTab === 'logs' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-400" />
                            Logs de Envio
                        </h3>
                        <div className="flex gap-2">
                            <Select value={logFilter} onValueChange={(v: typeof logFilter) => setLogFilter(v)} name="log-filter">
                                <SelectTrigger className="w-32 h-8" id="log-filter">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="success">Sucesso</SelectItem>
                                    <SelectItem value="error">Erros</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button size="sm" variant="outline" className="h-8" onClick={() => clearLogs()}>
                                <Trash2 className="w-4 h-4 mr-1" />
                                Limpar
                            </Button>
                        </div>
                    </div>

                    {filteredLogs.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="pt-6 text-center">
                                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p className="text-muted-foreground">Nenhum log registrado</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="p-0">
                                <div className="max-h-[400px] overflow-y-auto">
                                    {filteredLogs.slice(0, 100).map(log => (
                                        <div key={log.id} className="flex items-center gap-3 p-3 border-b last:border-0 hover:bg-muted/30">
                                            {log.status === 'success' ? (
                                                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                            ) : (
                                                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm truncate">
                                                    <span className="text-muted-foreground">Bot: </span>
                                                    <span className="font-medium">{log.bot_name}</span>
                                                    {log.message_preview && (
                                                        <span className="text-muted-foreground"> → "{log.message_preview}..."</span>
                                                    )}
                                                </p>
                                                {log.error_message && (
                                                    <p className="text-xs text-red-400">{log.error_message}</p>
                                                )}
                                            </div>
                                            <div className="text-xs text-muted-foreground flex-shrink-0">
                                                {new Date(log.sent_at).toLocaleTimeString('pt-BR')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Modal: Add Group */}
            {showAddGroupModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <Card className="w-full max-w-lg mx-4">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-blue-400" />
                                    Adicionar Grupo
                                </CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => setShowAddGroupModal(false)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="group-name">Nome do Grupo *</Label>
                                <Input
                                    id="group-name"
                                    name="group-name"
                                    placeholder="Ex: Grupo de Vendas"
                                    value={newGroup.name}
                                    onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="group-chat-id">Chat ID *</Label>
                                <Input
                                    id="group-chat-id"
                                    name="group-chat-id"
                                    placeholder="Ex: -1001234567890"
                                    value={newGroup.chat_id}
                                    onChange={(e) => setNewGroup(prev => ({ ...prev, chat_id: e.target.value }))}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Use @userinfobot no Telegram para descobrir o chat_id do grupo
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="group-description">Descrição</Label>
                                <Input
                                    id="group-description"
                                    name="group-description"
                                    placeholder="Descrição opcional"
                                    value={newGroup.description}
                                    onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="group-tags">Tags (separadas por vírgula)</Label>
                                <Input
                                    id="group-tags"
                                    name="group-tags"
                                    placeholder="Ex: vendas, promoções"
                                    value={newGroup.tags}
                                    onChange={(e) => setNewGroup(prev => ({ ...prev, tags: e.target.value }))}
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" className="flex-1" onClick={() => setShowAddGroupModal(false)}>
                                    Cancelar
                                </Button>
                                <Button className="flex-1 gap-1" onClick={handleAddGroup}>
                                    <Plus className="w-4 h-4" />
                                    Adicionar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Modal: Add Bot */}
            {showAddBotModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <Card className="w-full max-w-lg mx-4">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Bot className="w-5 h-5 text-purple-400" />
                                    Adicionar Bot
                                </CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => setShowAddBotModal(false)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="bot-name">Nome do Bot *</Label>
                                <Input
                                    id="bot-name"
                                    name="bot-name"
                                    placeholder="Ex: Bot Vendedor 1"
                                    value={newBot.name}
                                    onChange={(e) => setNewBot(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bot-token">Token do Bot *</Label>
                                <Input
                                    id="bot-token"
                                    name="bot-token"
                                    placeholder="Ex: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                                    value={newBot.token}
                                    onChange={(e) => setNewBot(prev => ({ ...prev, token: e.target.value }))}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Obtenha o token via @BotFather no Telegram
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bot-limit-hour">Limite/Hora</Label>
                                    <Input
                                        id="bot-limit-hour"
                                        name="bot-limit-hour"
                                        type="number"
                                        value={newBot.max_messages_per_hour}
                                        onChange={(e) => setNewBot(prev => ({ ...prev, max_messages_per_hour: parseInt(e.target.value) || 10 }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bot-limit-day">Limite/Dia</Label>
                                    <Input
                                        id="bot-limit-day"
                                        name="bot-limit-day"
                                        type="number"
                                        value={newBot.max_messages_per_day}
                                        onChange={(e) => setNewBot(prev => ({ ...prev, max_messages_per_day: parseInt(e.target.value) || 100 }))}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" className="flex-1" onClick={() => setShowAddBotModal(false)}>
                                    Cancelar
                                </Button>
                                <Button className="flex-1 gap-1" onClick={handleAddBot} disabled={isValidatingBot}>
                                    {isValidatingBot ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Plus className="w-4 h-4" />
                                    )}
                                    Adicionar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Modal: Add Campaign */}
            {showAddCampaignModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto py-8">
                    <Card className="w-full max-w-2xl mx-4">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Flame className="w-5 h-5 text-orange-400" />
                                    Nova Campanha de Aquecimento
                                </CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => setShowAddCampaignModal(false)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="space-y-2">
                                <Label htmlFor="campaign-name">Nome da Campanha *</Label>
                                <Input
                                    id="campaign-name"
                                    name="campaign-name"
                                    placeholder="Ex: Aquecimento Grupo Vendas"
                                    value={newCampaign.name}
                                    onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="campaign-group">Grupo Alvo *</Label>
                                <Select
                                    value={newCampaign.group_id.toString()}
                                    onValueChange={(v) => setNewCampaign(prev => ({ ...prev, group_id: parseInt(v) }))}
                                    name="campaign-group"
                                >
                                    <SelectTrigger id="campaign-group">
                                        <SelectValue placeholder="Selecione um grupo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {groups.map(group => (
                                            <SelectItem key={group.id} value={group.id.toString()}>
                                                {group.name} ({group.chat_id})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Bots (clique para selecionar) *</Label>
                                <div className="flex flex-wrap gap-2">
                                    {bots.map(bot => (
                                        <Badge
                                            key={bot.id}
                                            variant={newCampaign.bot_ids.includes(bot.id) ? 'default' : 'outline'}
                                            className="cursor-pointer transition-colors"
                                            onClick={() => toggleBotSelection(bot.id)}
                                        >
                                            @{bot.username || bot.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Mensagens *</Label>
                                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={addMessage}>
                                        <Plus className="w-3 h-3 mr-1" />
                                        Adicionar
                                    </Button>
                                </div>
                                {newCampaign.messages.map((msg, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Textarea
                                            id={`campaign-message-${index}`}
                                            name={`campaign-message-${index}`}
                                            placeholder={`Mensagem ${index + 1}...`}
                                            value={msg}
                                            onChange={(e) => updateMessage(index, e.target.value)}
                                            className="min-h-[60px]"
                                        />
                                        {newCampaign.messages.length > 1 && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-red-400 flex-shrink-0"
                                                onClick={() => removeMessage(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="campaign-send-mode">Modo de Envio</Label>
                                    <Select
                                        value={newCampaign.send_mode}
                                        onValueChange={(v: typeof newCampaign.send_mode) => setNewCampaign(prev => ({ ...prev, send_mode: v }))}
                                        name="campaign-send-mode"
                                    >
                                        <SelectTrigger id="campaign-send-mode">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sequential">Sequencial (1→2→3→repete)</SelectItem>
                                            <SelectItem value="random">Aleatório</SelectItem>
                                            <SelectItem value="no_repeat">Aleatório (sem repetir)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="campaign-max-msgs">Limite msgs/dia por bot</Label>
                                    <Input
                                        id="campaign-max-msgs"
                                        name="campaign-max-msgs"
                                        type="number"
                                        value={newCampaign.max_messages_per_bot_per_day}
                                        onChange={(e) => setNewCampaign(prev => ({ ...prev, max_messages_per_bot_per_day: parseInt(e.target.value) || 50 }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="campaign-interval-min">Intervalo Mín (seg)</Label>
                                    <Input
                                        id="campaign-interval-min"
                                        name="campaign-interval-min"
                                        type="number"
                                        value={newCampaign.interval_min}
                                        onChange={(e) => setNewCampaign(prev => ({ ...prev, interval_min: parseInt(e.target.value) || 90 }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="campaign-interval-max">Intervalo Máx (seg)</Label>
                                    <Input
                                        id="campaign-interval-max"
                                        name="campaign-interval-max"
                                        type="number"
                                        value={newCampaign.interval_max}
                                        onChange={(e) => setNewCampaign(prev => ({ ...prev, interval_max: parseInt(e.target.value) || 180 }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="campaign-window-start">Horário Início</Label>
                                    <Input
                                        id="campaign-window-start"
                                        name="campaign-window-start"
                                        type="time"
                                        value={newCampaign.window_start}
                                        onChange={(e) => setNewCampaign(prev => ({ ...prev, window_start: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="campaign-window-end">Horário Fim</Label>
                                    <Input
                                        id="campaign-window-end"
                                        name="campaign-window-end"
                                        type="time"
                                        value={newCampaign.window_end}
                                        onChange={(e) => setNewCampaign(prev => ({ ...prev, window_end: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="bg-yellow-950/30 border border-yellow-800/50 rounded-lg p-3 text-sm text-yellow-300">
                                <strong>⚠️ Importante:</strong> Use intervalos randomizados e limites diários para evitar banimentos.
                                Recomendamos começar com intervalos de 90-180s e no máximo 50 msgs/dia por bot.
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" className="flex-1" onClick={() => setShowAddCampaignModal(false)}>
                                    Cancelar
                                </Button>
                                <Button className="flex-1 gap-1 bg-orange-600 hover:bg-orange-700" onClick={handleAddCampaign}>
                                    <Flame className="w-4 h-4" />
                                    Criar Campanha
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Modal: Campaign Details */}
            {showCampaignDetailsModal && selectedCampaign && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <Card className="w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Eye className="w-5 h-5" />
                                    {selectedCampaign.name}
                                </CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => setShowCampaignDetailsModal(false)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground">Grupo</Label>
                                    <p className="font-medium">{selectedCampaign.group_name}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Status</Label>
                                    <div className="mt-1">{getStatusBadge(selectedCampaign.status)}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 text-center">
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-400">{selectedCampaign.total_messages_sent}</div>
                                    <div className="text-xs text-muted-foreground">Enviadas</div>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <div className="text-2xl font-bold text-red-400">{selectedCampaign.total_errors}</div>
                                    <div className="text-xs text-muted-foreground">Erros</div>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-400">{selectedCampaign.bots?.length || 0}</div>
                                    <div className="text-xs text-muted-foreground">Bots</div>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-400">{selectedCampaign.messages?.length || 0}</div>
                                    <div className="text-xs text-muted-foreground">Mensagens</div>
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs text-muted-foreground">Bots Selecionados</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedCampaign.bots?.map(bot => (
                                        <Badge key={bot.id} variant="outline">
                                            @{bot.bot_username || bot.bot_name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs text-muted-foreground">Mensagens</Label>
                                <div className="space-y-2 mt-2">
                                    {selectedCampaign.messages?.map((msg, i) => (
                                        <div key={msg.id} className="p-2 bg-muted/30 rounded text-sm">
                                            <span className="text-muted-foreground">#{i + 1}:</span> {msg.content}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <Label className="text-xs text-muted-foreground">Modo</Label>
                                    <p className="font-medium capitalize">{selectedCampaign.send_mode}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Intervalo</Label>
                                    <p className="font-medium">{selectedCampaign.interval_min}-{selectedCampaign.interval_max}s</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Janela</Label>
                                    <p className="font-medium">{selectedCampaign.window_start} - {selectedCampaign.window_end}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Limite/Dia/Bot</Label>
                                    <p className="font-medium">{selectedCampaign.max_messages_per_bot_per_day} msgs</p>
                                </div>
                            </div>

                            <Button className="w-full" onClick={() => setShowCampaignDetailsModal(false)}>
                                Fechar
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
