import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Bot, Power, Save, RefreshCw, MessageSquare, Settings2, ShieldCheck, Zap,
    Play, Pause, Link, Loader2, Users, Download, Upload, Trash2,
    Calendar, Clock, CheckCircle, AlertCircle, Plus, X, Search, Filter,
    FileSpreadsheet, Send, FileText, Megaphone, Flame, Copy, Eye, MoveRight
} from "lucide-react";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

// Hooks
import { useProxies } from "@/hooks/useProxies";
import { useTelegramAccounts } from "@/hooks/useTelegramAccounts";
import { useHeating } from "@/hooks/useHeating";
import { useClientes } from "@/hooks/useClientes";

// Components
import { AquecerContasTab } from "@/components/telegram/AquecerContasTab";

interface Theme {
    color: string;
    lightColor: string;
    borderColor: string;
    gradient: string;
}

export default function ResellerBotGram() {
    // Theme Context for Reseller styling
    const { theme } = useOutletContext<{ theme: Theme }>();

    // Tab State
    const [activeTab, setActiveTab] = useState("dashboard");

    // ==========================================
    // INTEGRATED HOOKS FROM ADMIN TELEGRAM
    // ==========================================

    const { addCliente } = useClientes();

    // Proxies Hook
    const {
        proxies,
        activeProxy,
        stats: proxyStats,
        isLoading: proxiesLoading,
        addProxy,
        deleteProxy,
        testAllProxies,
        removeOfflineProxies,
    } = useProxies();

    // Telegram Accounts Hook
    const {
        bots: telegramBots,
        stats: botsStats,
        isLoading: botsLoading,
        verifyAllBots,
        getStatusInfo: getBotStatusInfo,
    } = useTelegramAccounts();

    // Heating Hook
    const heating = useHeating();

    // ==========================================
    // LOCAL STATES FOR UI LOGIC
    // ==========================================

    // Extraction Tab States
    const [extractLink, setExtractLink] = useState("");
    const [isExtracting, setIsExtracting] = useState(false);
    const [members, setMembers] = useState<any[]>([]);

    // Groups Tab States
    const [groups, setGroups] = useState<any[]>([]);
    const [showAddGroup, setShowAddGroup] = useState(false);

    // Private Message Tab States
    const [privateMsg, setPrivateMsg] = useState("");
    const [isSpending, setIsSending] = useState(false);

    // Bot Config States
    const [botToken, setBotToken] = useState("");
    const [isBotActive, setIsBotActive] = useState(false);

    // AI Copy States
    const [aiPrompt, setAiPrompt] = useState("");
    const [aiResult, setAiResult] = useState("");
    const [isGeneratingAi, setIsGeneratingAi] = useState(false);

    // ==========================================
    // HANDLERS (Simplified for Reseller Context)
    // ==========================================

    const handleExtract = () => {
        if (!extractLink) return toast.error("Insira um link válido");
        setIsExtracting(true);
        // Simulation
        setTimeout(() => {
            setIsExtracting(false);
            setMembers(Array(15).fill(0).map((_, i) => ({
                id: i,
                username: `user_${Math.random().toString(36).substring(7)}`,
                name: `Membro ${i + 1}`,
                phone: i % 3 === 0 ? "+551199999999" : ""
            })));
            toast.success("15 membros extraídos com sucesso!");
        }, 2000);
    };

    const handleGenerateCopy = () => {
        if (!aiPrompt) return toast.error("Digite um comando para a IA");
        setIsGeneratingAi(true);
        setTimeout(() => {
            setAiResult(`🚀 **Oportunidade Imperdível!**\n\nOlá! Vi que você tem interesse em... ${aiPrompt}\n\nNão perca essa chance de alavancar seus resultados com a nossa plataforma exclusiva. 👇\n\n[Clique aqui para saber mais]`);
            setIsGeneratingAi(false);
            toast.success("Copy gerada com sucesso!");
        }, 1500);
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">BotGram Elite</h2>
                    <p className="text-muted-foreground">Sistema avançado de automação e gestão de Telegram.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant={isBotActive ? "default" : "secondary"} className={cn("text-sm px-3 py-1", isBotActive ? "bg-green-600 hover:bg-green-700" : "")}>
                        {isBotActive ? "Sistema Online" : "Sistema Pausado"}
                    </Badge>
                    <Button
                        size="sm"
                        variant={isBotActive ? "destructive" : "default"}
                        className={cn("gap-2", isBotActive ? "" : "bg-gradient-to-r " + theme.gradient)}
                        onClick={() => setIsBotActive(!isBotActive)}
                    >
                        <Power className="w-4 h-4" />
                        {isBotActive ? "Pausar Tudo" : "Iniciar Sistema"}
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className={cn("border-l-4", "border-l-blue-500")}>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-blue-500">{telegramBots.length}</div>
                        <p className="text-xs text-muted-foreground">Contas Conectadas</p>
                    </CardContent>
                </Card>
                <Card className={cn("border-l-4", "border-l-green-500")}>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-green-500">{proxyStats.online}</div>
                        <p className="text-xs text-muted-foreground">Proxies Online</p>
                    </CardContent>
                </Card>
                <Card className={cn("border-l-4", "border-l-orange-500")}>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-orange-500">{heating.stats.activeBots}</div>
                        <p className="text-xs text-muted-foreground">Bots Aquecendo</p>
                    </CardContent>
                </Card>
                <Card className={cn("border-l-4", "border-l-purple-500")}>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-purple-500">{heating.campaigns.length}</div>
                        <p className="text-xs text-muted-foreground">Campanhas Ativas</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="dashboard" className="space-y-4" onValueChange={setActiveTab}>
                <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent justify-start p-0">
                    {[
                        { id: "dashboard", label: "Dashboard", icon: Zap },
                        { id: "accounts", label: "Contas & Proxies", icon: ShieldCheck },
                        { id: "extraction", label: "Extração", icon: Link },
                        { id: "heating", label: "Aquecer", icon: Flame },
                        { id: "groups", label: "Encher Grupos", icon: Users },
                        { id: "private", label: "Envio Privado", icon: Send },
                        { id: "chatbots", label: "ChatBots", icon: Bot },
                        { id: "ai_copy", label: "IA Copy", icon: MessageSquare },
                    ].map(tab => (
                        <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className={cn(
                                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 border border-muted",
                                activeTab === tab.id ? theme.gradient.replace("from-", "bg-").replace("to-", "") : "bg-card hover:bg-muted"
                            )}
                            style={activeTab === tab.id ? {
                                background: `linear-gradient(to right, ${theme.color}, ${theme.lightColor})`,
                                borderColor: theme.color,
                                color: 'white'
                            } : {}}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* TAB: DASHBOARD */}
                <TabsContent value="dashboard" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Bem-vindo ao Painel Elite</CardTitle>
                            <CardDescription>Gerencie suas operações de Telegram em um só lugar com o poder da automação.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-muted/50 border border-dashed flex items-center justify-center min-h-[200px] flex-col gap-4 text-center">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Bot className="w-8 h-8 text-primary" style={{ color: theme.color }} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Seu assistente está pronto</h3>
                                        <p className="text-muted-foreground max-w-md mx-auto">
                                            Selecione uma ferramenta no menu acima para começar. Recomendamos começar conectando suas contas e proxies na aba "Contas & Proxies".
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB: CONTAS E PROXIES */}
                <TabsContent value="accounts" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Gerenciador de Proxies */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5" style={{ color: theme.color }} />
                                        Meus Proxies
                                    </CardTitle>
                                    <CardDescription>Essencial para evitar bloqueios</CardDescription>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => addProxy({ host: '127.0.0.1', port: 8080, type: 'socks5' })}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Adicionar
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {proxies.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                                        <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>Nenhum proxy configurado</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {proxies.map(p => (
                                            <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("w-2 h-2 rounded-full", p.status === 'online' ? "bg-green-500" : "bg-red-500")} />
                                                    <div className="text-sm font-medium">{p.host}:{p.port}</div>
                                                </div>
                                                <Badge variant="outline">{p.type}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Gerenciador de Contas */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="w-5 h-5" style={{ color: theme.color }} />
                                        Contas Telegram
                                    </CardTitle>
                                    <CardDescription>Gerencie suas sessões conectadas</CardDescription>
                                </div>
                                <Button size="sm" variant="outline">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Conectar
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {telegramBots.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                                        <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>Nenhuma conta conectada</p>
                                    </div>
                                ) : (
                                    <div>
                                        {/* Lista simplificada de contas */}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* TAB: EXTRAÇÃO */}
                <TabsContent value="extraction" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Link className="w-5 h-5" style={{ color: theme.color }} />
                                Extrator de Membros
                            </CardTitle>
                            <CardDescription>Extraia leads qualificados de grupos públicos do Telegram</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex gap-4">
                                <Input
                                    placeholder="Link do grupo (ex: https://t.me/grupo)"
                                    value={extractLink}
                                    onChange={e => setExtractLink(e.target.value)}
                                />
                                <Button
                                    onClick={handleExtract}
                                    disabled={isExtracting}
                                    style={{ background: isExtracting ? undefined : `linear-gradient(to right, ${theme.color}, ${theme.lightColor})` }}
                                    className="min-w-[150px] text-white"
                                >
                                    {isExtracting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Extraindo...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4 mr-2" />
                                            Começar
                                        </>
                                    )}
                                </Button>
                            </div>

                            {members.length > 0 && (
                                <div className="border rounded-md">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Username</TableHead>
                                                <TableHead>Nome</TableHead>
                                                <TableHead>Telefone</TableHead>
                                                <TableHead className="text-right">Ação</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {members.map((member) => (
                                                <TableRow key={member.id}>
                                                    <TableCell className="font-mono text-xs">@{member.username}</TableCell>
                                                    <TableCell>{member.name}</TableCell>
                                                    <TableCell>{member.phone || '-'}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button size="icon" variant="ghost" className="h-6 w-6">
                                                            <Copy className="w-3 h-3" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <div className="p-4 border-t bg-muted/20 flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">{members.length} membros encontrados</span>
                                        <Button size="sm" variant="outline">
                                            <Download className="w-4 h-4 mr-2" />
                                            Exportar CSV
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB: AQUECER (Component Reused) */}
                <TabsContent value="heating">
                    {/* Reuse the complex component but wrap it in reseller styling context if needed */}
                    <div className="telegram-admin-wrapper">
                        <AquecerContasTab />
                    </div>
                </TabsContent>

                {/* TAB: ENCHER GRUPOS */}
                <TabsContent value="groups" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Adicionar Membros
                                </CardTitle>
                                <CardDescription>Transfira membros extraídos para seu grupo</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Grupo de Destino</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione seu grupo..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="g1">Meus Clientes VIP</SelectItem>
                                            <SelectItem value="g2">Canal de Ofertas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Configuração de Velocidade</Label>
                                    <div className="flex gap-4">
                                        <div className="flex-1 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                            <div className="font-medium text-sm mb-1">🔥 Turbo</div>
                                            <div className="text-xs text-muted-foreground">Mais rápido, maior risco</div>
                                        </div>
                                        <div className="flex-1 p-3 border rounded-lg cursor-pointer bg-primary/5 border-primary">
                                            <div className="font-medium text-sm mb-1">🛡️ Seguro</div>
                                            <div className="text-xs text-muted-foreground">Lento, evita bloqueios</div>
                                        </div>
                                    </div>
                                </div>

                                <Button className="w-full" style={{ background: `linear-gradient(to right, ${theme.color}, ${theme.lightColor})` }}>
                                    <Play className="w-4 h-4 mr-2" />
                                    Iniciar Adição em Massa
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Monitoramento em Tempo Real</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-center min-h-[200px] border border-dashed rounded-lg bg-muted/20">
                                    <div className="text-center text-muted-foreground">
                                        <ActivityLogIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                        <p>Nenhuma tarefa ativa no momento</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* TAB: ENVIO PRIVADO */}
                <TabsContent value="private" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Send className="w-5 h-5" style={{ color: theme.color }} />
                                Disparo em Massa (Direct)
                            </CardTitle>
                            <CardDescription>Envie mensagens diretas para sua lista de leads</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Sua Mensagem</Label>
                                        <Textarea
                                            placeholder="Olá! Vi que você tem interesse em..."
                                            className="min-h-[150px]"
                                            value={privateMsg}
                                            onChange={e => setPrivateMsg(e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground text-right">{privateMsg.length} caracteres</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1">Anexar Imagem</Button>
                                        <Button variant="outline" size="sm" className="flex-1">Adicionar Botão</Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Lista de Destinatários</Label>
                                        <div className="border rounded-md p-4 min-h-[100px] bg-muted/20">
                                            {members.length > 0 ? (
                                                <p className="text-sm">{members.length} destinatários selecionados da extração anterior.</p>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full gap-2">
                                                    <p className="text-xs text-muted-foreground">Nenhuma lista carregada</p>
                                                    <Button variant="secondary" size="sm" onClick={() => setActiveTab("extraction")}>
                                                        Ir para Extração
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full h-12 text-lg"
                                        disabled={isSpending || members.length === 0}
                                        style={{ background: isSpending ? undefined : `linear-gradient(to right, ${theme.color}, ${theme.lightColor})` }}
                                        onClick={() => {
                                            if (!privateMsg) return toast.error("Escreva uma mensagem");
                                            setIsSending(true);
                                            setTimeout(() => {
                                                setIsSending(false);
                                                toast.success("Envio iniciado em segundo plano!");
                                            }, 2000);
                                        }}
                                    >
                                        {isSpending ? "Enviando..." : "🚀 Disparar Agora"}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB: CHATBOTS */}
                <TabsContent value="chatbots" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bot className="w-5 h-5" style={{ color: theme.color }} />
                                Bot de Auto-Resposta
                            </CardTitle>
                            <CardDescription>Configure respostas automáticas para palavras-chave</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12 border rounded-lg border-dashed">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Settings2 className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-medium mb-2">Configuração Simplificada</h3>
                                <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                                    Crie regras simples: "Se o cliente disser X, responda Y". Suporta botões e mídia.
                                </p>
                                <Button variant="outline">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Criar Nova Regra
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB: IA COPY */}
                <TabsContent value="ai_copy" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5" style={{ color: theme.color }} />
                                Gerador de Copywritng (IA)
                            </CardTitle>
                            <CardDescription>Crie textos persuasivos para suas campanhas em segundos</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Sobre o que você quer vender/falar?</Label>
                                <Input
                                    placeholder="Ex: Venda de planos de TV, Promoção de IPTV, Grupo de Apostas..."
                                    value={aiPrompt}
                                    onChange={e => setAiPrompt(e.target.value)}
                                />
                            </div>
                            <Button
                                onClick={handleGenerateCopy}
                                disabled={isGeneratingAi}
                                style={{ background: isGeneratingAi ? undefined : `linear-gradient(to right, ${theme.color}, ${theme.lightColor})` }}
                                className="w-full text-white"
                            >
                                {isGeneratingAi ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        A Mágica está acontecendo...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-4 h-4 mr-2" />
                                        Gerar Texto Persuasivo
                                    </>
                                )}
                            </Button>

                            {aiResult && (
                                <div className="mt-6 space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <Label>Resultado Gerado:</Label>
                                    <Textarea
                                        className="min-h-[200px] font-mono text-sm"
                                        value={aiResult}
                                        readOnly
                                    />
                                    <Button variant="secondary" className="w-full" onClick={() => {
                                        navigator.clipboard.writeText(aiResult);
                                        toast.success("Copiado para a área de transferência!");
                                    }}>
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copiar Texto
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Simple Icon Component for Placeholder
function ActivityLogIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
        </svg>
    )
}
