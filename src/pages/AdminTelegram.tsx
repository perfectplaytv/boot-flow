import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useClientes } from "@/hooks/useClientes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Upload,
    Users,
    FileSpreadsheet,
    CheckCircle,
    XCircle,
    Download,
    Trash2,
    UserPlus,
    Send,
    AlertCircle,
    Link,
    Loader2,
    LogIn,
    LogOut,
    Key,
    Phone,
    RefreshCw,
    Save,
    FolderOpen,
    Filter,
    Zap,
    Shield,
    Clock,
    Calendar,
    Paperclip,
    Plus,
    Play,
    X,
    Bot,
    MessageSquare,
    Radio
} from "lucide-react";

interface TelegramMember {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    phone: string;
    selected: boolean;
}

// API Response Types
interface TelegramSession {
    phone: string;
    clean_phone: string;
    formatted_phone?: string;
    username?: string;
    first_name?: string;
    id: string;
    is_restricted?: boolean;
    restriction_reason?: string;
}

interface SessionsResponse {
    sessions: TelegramSession[];
    error?: string;
}

// Saved Audience type
interface SavedAudience {
    id: string;
    name: string;
    createdAt: string;
    source: string;
    totalMembers: number;
    withUsername: number;
    withPhone: number;
    members: TelegramMember[];
}

// Account status types
type AccountStatus = 'connected' | 'flood' | 'restricted' | 'free' | 'checking';

interface AccountStatusInfo {
    status: AccountStatus;
    lastCheck?: string;
    message?: string;
}

interface LoginResponse {
    success?: boolean;
    message?: string;
    detail?: string;
}

interface VerifyResponse {
    success?: boolean;
    message?: string;
    user?: { id: number; first_name: string; username: string };
    detail?: string;
}

interface ExtractMembersResponse {
    success: boolean;
    group?: string;
    total_members?: number;
    members?: Array<{
        id: string;
        username: string;
        first_name: string;
        last_name: string;
        phone: string;
        is_bot: boolean;
    }>;
    detail?: string;
}

// Phase 2: Send Private Response
interface SendPrivateResponse {
    success: boolean;
    sent_to?: string;
    account?: string;
    error?: 'FLOOD_WAIT' | 'RESTRICTED' | 'PEER_FLOOD' | 'UNKNOWN';
    message?: string;
}

// Phase 3: Campaign & Scheduling
interface Campaign {
    id: string;
    name: string;
    createdAt: string;
}

interface ScheduledMessage {
    id: string;
    name: string;
    campaignId: string;
    message: string;
    attachment?: string;
    buttons: Array<{ label: string, url: string }>;
    mode: 'scheduled' | 'cron' | 'manual';
    scheduledDate?: string;
    scheduledTime?: string;
    status: 'pending' | 'sent' | 'failed';
    createdAt: string;
}

// URL da API do Telegram (Railway) - Configure no .env
const TELEGRAM_API_URL = import.meta.env.VITE_TELEGRAM_API_URL || "";

export default function AdminTelegram() {
    const { addCliente } = useClientes();

    const [members, setMembers] = useState<TelegramMember[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [importConfig, setImportConfig] = useState({
        defaultPlan: "Mensal",
        defaultStatus: "Ativo",
        defaultServer: "",
    });
    const [importResults, setImportResults] = useState<{
        success: number;
        failed: number;
        errors: string[];
    } | null>(null);

    // Estados para extração automática
    const [groupLink, setGroupLink] = useState("");
    const [isExtracting, setIsExtracting] = useState(false);

    // Multi-account state
    const [sessions, setSessions] = useState<TelegramSession[]>([]);
    const [activeSessionPhone, setActiveSessionPhone] = useState<string>("");
    const [isAddingAccount, setIsAddingAccount] = useState(false);

    const [loginPhone, setLoginPhone] = useState("");
    const [loginCode, setLoginCode] = useState("");
    const [loginStep, setLoginStep] = useState<"phone" | "code">("phone");
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Phase 1: New states
    const [savedAudiences, setSavedAudiences] = useState<SavedAudience[]>([]);
    const [accountStatuses, setAccountStatuses] = useState<Record<string, AccountStatusInfo>>({});
    const [isVerifyingAccounts, setIsVerifyingAccounts] = useState(false);
    const [verifyProgress, setVerifyProgress] = useState(0);
    const [memberFilter, setMemberFilter] = useState<'all' | 'with_username' | 'without_username' | 'with_phone'>('all');
    const [showSavedAudiences, setShowSavedAudiences] = useState(false);
    const [audienceName, setAudienceName] = useState("");

    // Phase 2: Bulk Send States
    const [showBulkSend, setShowBulkSend] = useState(false);
    const [bulkSendConfig, setBulkSendConfig] = useState({
        messages: [""],  // Message variations
        intervalMin: 30,
        intervalMax: 60,
        dailyLimit: 50,
        useAllAccounts: true
    });
    const [isSending, setIsSending] = useState(false);
    const [sendProgress, setSendProgress] = useState({ current: 0, total: 0, success: 0, failed: 0 });
    const [sendLogs, setSendLogs] = useState<Array<{ time: string; user: string; status: string; message?: string }>>([]);

    // Phase 3: Campaign States
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
    const [newSchedule, setNewSchedule] = useState({
        name: '',
        campaignId: '',
        message: '',
        attachment: '',
        buttons: [] as Array<{ label: string, url: string }>,
        mode: 'scheduled' as 'scheduled' | 'cron' | 'manual',
        scheduledDate: '',
        scheduledTime: ''
    });
    const [newCampaignName, setNewCampaignName] = useState('');
    const [showAddButton, setShowAddButton] = useState(false);
    const [newButton, setNewButton] = useState({ label: '', url: '' });

    // Phase 3: Cron Schedule Grid State
    const [cronSchedule, setCronSchedule] = useState<Record<string, Record<number, boolean>>>({
        seg: {}, ter: {}, qua: {}, qui: {}, sex: {}, sab: {}, dom: {}
    });
    const [cronStartDate, setCronStartDate] = useState('');
    const [cronEndDate, setCronEndDate] = useState('');
    const [useStartDate, setUseStartDate] = useState(false);
    const [useEndDate, setUseEndDate] = useState(false);

    // Phase 3: Toggle cell in cron grid
    const toggleCronCell = (day: string, hour: number) => {
        setCronSchedule(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [hour]: !prev[day][hour]
            }
        }));
    };

    // Phase 3: Count total scheduled slots
    const countScheduledSlots = () => {
        let count = 0;
        Object.values(cronSchedule).forEach(hours => {
            count += Object.values(hours).filter(Boolean).length;
        });
        return count;
    };

    // Phase 4: ChatBot States
    interface ChatbotSequence {
        id: string;
        message: string;
        delay: number;
        buttons: Array<{ label: string, url: string }>;
    }

    interface ChatbotRule {
        id: string;
        name: string;
        applyTo: 'private' | 'group' | 'channel';
        keywords: string[];
        compareMethod: 'equal' | 'contains' | 'startsWith';
        flowId: string;
        sendOnNewChat: boolean;
        pausePerLead: boolean;
        active: boolean;
        sequences: ChatbotSequence[];
        createdAt: string;
    }

    const [chatbotRules, setChatbotRules] = useState<ChatbotRule[]>([]);
    const [currentRule, setCurrentRule] = useState<Partial<ChatbotRule>>({
        name: '',
        applyTo: 'private',
        keywords: [],
        compareMethod: 'equal',
        flowId: '',
        sendOnNewChat: false,
        pausePerLead: false,
        active: true,
        sequences: [{ id: '1', message: '', delay: 10, buttons: [] }]
    });
    const [keywordsInput, setKeywordsInput] = useState('');
    const [activeSequence, setActiveSequence] = useState(0);
    const [showSeqButton, setShowSeqButton] = useState(false);
    const [newSeqButton, setNewSeqButton] = useState({ label: '', url: '' });

    // Phase 4: Add sequence to chatbot
    const addChatbotSequence = () => {
        setCurrentRule(prev => ({
            ...prev,
            sequences: [
                ...(prev.sequences || []),
                { id: Date.now().toString(), message: '', delay: 10, buttons: [] }
            ]
        }));
        setActiveSequence((currentRule.sequences?.length || 1));
    };

    // Phase 4: Update sequence message
    const updateSequenceMessage = (index: number, message: string) => {
        setCurrentRule(prev => ({
            ...prev,
            sequences: prev.sequences?.map((seq, i) =>
                i === index ? { ...seq, message: message.slice(0, 4096) } : seq
            ) || []
        }));
    };

    // Phase 4: Update sequence delay
    const updateSequenceDelay = (index: number, delay: number) => {
        setCurrentRule(prev => ({
            ...prev,
            sequences: prev.sequences?.map((seq, i) =>
                i === index ? { ...seq, delay } : seq
            ) || []
        }));
    };

    // Phase 4: Add button to sequence
    const addButtonToSequence = (index: number) => {
        if (!newSeqButton.label.trim() || !newSeqButton.url.trim()) {
            toast.error("Preencha o texto e URL do botão");
            return;
        }
        setCurrentRule(prev => ({
            ...prev,
            sequences: prev.sequences?.map((seq, i) =>
                i === index ? { ...seq, buttons: [...seq.buttons, newSeqButton] } : seq
            ) || []
        }));
        setNewSeqButton({ label: '', url: '' });
        setShowSeqButton(false);
    };

    // Phase 4: Remove sequence
    const removeSequence = (index: number) => {
        if ((currentRule.sequences?.length || 0) <= 1) {
            toast.error("Deve haver pelo menos uma sequência");
            return;
        }
        setCurrentRule(prev => ({
            ...prev,
            sequences: prev.sequences?.filter((_, i) => i !== index) || []
        }));
        setActiveSequence(Math.max(0, activeSequence - 1));
    };

    // Phase 4: Save chatbot rule
    const saveChatbotRule = () => {
        if (!currentRule.name?.trim()) {
            toast.error("Digite um nome para a regra");
            return;
        }
        if (!keywordsInput.trim()) {
            toast.error("Digite as palavras-chave");
            return;
        }

        const rule: ChatbotRule = {
            id: Date.now().toString(),
            name: currentRule.name || '',
            applyTo: currentRule.applyTo || 'private',
            keywords: keywordsInput.split(',').map(k => k.trim()).filter(Boolean),
            compareMethod: currentRule.compareMethod || 'equal',
            flowId: currentRule.flowId || '',
            sendOnNewChat: currentRule.sendOnNewChat || false,
            pausePerLead: currentRule.pausePerLead || false,
            active: currentRule.active ?? true,
            sequences: currentRule.sequences || [],
            createdAt: new Date().toISOString()
        };

        const updated = [...chatbotRules, rule];
        setChatbotRules(updated);
        localStorage.setItem('telegram_chatbot_rules', JSON.stringify(updated));

        // Reset form
        setCurrentRule({
            name: '',
            applyTo: 'private',
            keywords: [],
            compareMethod: 'equal',
            flowId: '',
            sendOnNewChat: false,
            pausePerLead: false,
            active: true,
            sequences: [{ id: '1', message: '', delay: 10, buttons: [] }]
        });
        setKeywordsInput('');
        setActiveSequence(0);

        toast.success(`Regra "${rule.name}" salva!`);
    };

    // Phase 4: Load chatbot rules from localStorage
    useEffect(() => {
        const savedRules = localStorage.getItem('telegram_chatbot_rules');
        if (savedRules) {
            try { setChatbotRules(JSON.parse(savedRules)); } catch (e) { console.error(e); }
        }
    }, []);

    // Phase 5: Private Send States
    const [privateSendConfig, setPrivateSendConfig] = useState({
        name: '',
        sourceType: 'group' as 'group' | 'audience',
        sourceId: '',
        filterActive: true,
        filterBy: 'days' as 'status' | 'days',
        lastSeenDays: 7,
        messages: [''],
        selectedAccounts: [] as string[],
        intervalMin: 10,
        intervalMax: 20,
        dailyLimit: 25,
        scheduleEnabled: false,
        scheduleDate: '',
        scheduleTime: ''
    });
    const [activeMessageIndex, setActiveMessageIndex] = useState(0);

    // Phase 5: Add message variation for private send
    const privateAddMessageVariation = () => {
        setPrivateSendConfig(prev => ({
            ...prev,
            messages: [...prev.messages, '']
        }));
        setActiveMessageIndex(privateSendConfig.messages.length);
    };

    // Phase 5: Update message variation for private send
    const privateUpdateMessageVariation = (index: number, text: string) => {
        setPrivateSendConfig(prev => ({
            ...prev,
            messages: prev.messages.map((m, i) => i === index ? text.slice(0, 4096) : m)
        }));
    };

    // Phase 5: Remove message variation for private send
    const privateRemoveMessageVariation = (index: number) => {
        if (privateSendConfig.messages.length <= 1) {
            toast.error("Deve haver pelo menos uma variação");
            return;
        }
        setPrivateSendConfig(prev => ({
            ...prev,
            messages: prev.messages.filter((_, i) => i !== index)
        }));
        setActiveMessageIndex(Math.max(0, activeMessageIndex - 1));
    };

    // Phase 5: Toggle account selection
    const toggleAccountSelection = (phone: string) => {
        setPrivateSendConfig(prev => ({
            ...prev,
            selectedAccounts: prev.selectedAccounts.includes(phone)
                ? prev.selectedAccounts.filter(p => p !== phone)
                : [...prev.selectedAccounts, phone]
        }));
    };

    // Phase 5: Select all accounts
    const selectAllAccounts = () => {
        const allPhones = sessions.map(s => s.clean_phone);
        setPrivateSendConfig(prev => ({
            ...prev,
            selectedAccounts: prev.selectedAccounts.length === allPhones.length ? [] : allPhones
        }));
    };

    // Phase 5: Insert variable into message
    const privateInsertVariable = (variable: string) => {
        const currentMsg = privateSendConfig.messages[activeMessageIndex] || '';
        privateUpdateMessageVariation(activeMessageIndex, currentMsg + `{${variable}}`);
    };

    // Phase 6: Broadcast States
    const [broadcastConfig, setBroadcastConfig] = useState({
        name: '',
        chatbotId: '',
        targetType: 'all' as 'all' | 'custom',
        scheduleEnabled: false,
        scheduleDate: '',
        scheduleTime: '',
        message: '',
        buttons: [] as Array<{ label: string, url: string }>,
        interval: 5
    });
    const [showBroadcastButton, setShowBroadcastButton] = useState(false);
    const [newBroadcastButton, setNewBroadcastButton] = useState({ label: '', url: '' });

    // Phase 6: Insert variable into broadcast message
    const broadcastInsertVariable = (variable: string) => {
        setBroadcastConfig(prev => ({
            ...prev,
            message: prev.message + `{${variable}}`
        }));
    };

    // Phase 6: Add button to broadcast
    const addBroadcastButton = () => {
        if (!newBroadcastButton.label.trim() || !newBroadcastButton.url.trim()) {
            toast.error("Preencha o texto e URL do botão");
            return;
        }
        setBroadcastConfig(prev => ({
            ...prev,
            buttons: [...prev.buttons, newBroadcastButton]
        }));
        setNewBroadcastButton({ label: '', url: '' });
        setShowBroadcastButton(false);
    };

    // Phase 6: Remove button from broadcast
    const removeBroadcastButton = (index: number) => {
        setBroadcastConfig(prev => ({
            ...prev,
            buttons: prev.buttons.filter((_, i) => i !== index)
        }));
    };

    // Phase 6: Save broadcast
    const saveBroadcast = () => {
        if (!broadcastConfig.name.trim()) {
            toast.error("Digite um nome para o broadcast");
            return;
        }
        if (!broadcastConfig.message.trim()) {
            toast.error("Digite uma mensagem para o broadcast");
            return;
        }

        // Save to localStorage for now
        const broadcasts = JSON.parse(localStorage.getItem('telegram_broadcasts') || '[]');
        broadcasts.push({
            ...broadcastConfig,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('telegram_broadcasts', JSON.stringify(broadcasts));

        toast.success(`Broadcast "${broadcastConfig.name}" salvo!`);

        // Reset form
        setBroadcastConfig({
            name: '',
            chatbotId: '',
            targetType: 'all',
            scheduleEnabled: false,
            scheduleDate: '',
            scheduleTime: '',
            message: '',
            buttons: [],
            interval: 5
        });
    };

    const fetchSessions = useCallback(async () => {
        try {
            const response = await fetch(`${TELEGRAM_API_URL}/sessions`);
            const data = await response.json() as SessionsResponse;

            if (data.sessions) {
                setSessions(data.sessions);
                // Select first session if none selected
                if (data.sessions.length > 0) {
                    setActiveSessionPhone(prev => prev || data.sessions[0].clean_phone);
                }
            }
        } catch (error) {
            console.error("Erro ao buscar sessões:", error);
        }
    }, []);

    // Verificar status da sessão ao carregar
    useEffect(() => {
        if (TELEGRAM_API_URL) {
            fetchSessions();
        }
    }, [fetchSessions]);

    // Iniciar login
    const handleStartLogin = async () => {
        if (!loginPhone) {
            toast.error("Digite seu número de telefone");
            return;
        }

        setIsLoggingIn(true);
        try {
            const response = await fetch(`${TELEGRAM_API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: loginPhone }),
            });

            const data = await response.json() as LoginResponse;

            if (response.ok) {
                toast.success(data.message || "Código enviado!");
                setLoginStep("code");
            } else {
                toast.error(data.detail || "Erro ao enviar código");
            }
        } catch (error) {
            toast.error("Erro de conexão com o serviço Telegram");
        } finally {
            setIsLoggingIn(false);
        }
    };

    // Verificar código
    const handleVerifyCode = async () => {
        if (!loginCode) {
            toast.error("Digite o código recebido");
            return;
        }

        setIsLoggingIn(true);
        try {
            const response = await fetch(`${TELEGRAM_API_URL}/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: loginPhone, code: loginCode }),
            });

            const data = await response.json() as VerifyResponse;

            if (response.ok) {
                toast.success("Login realizado com sucesso!");
                await fetchSessions(); // Refresh list
                setIsAddingAccount(false);
                setLoginCode("");
                setLoginPhone("");
                setLoginStep("phone");
            } else {
                toast.error(data.detail || "Código inválido");
            }
        } catch (error) {
            toast.error("Erro ao verificar código");
        } finally {
            setIsLoggingIn(false);
        }
    };

    // Logout
    const handleLogout = async (phone: string) => {
        try {
            await fetch(`${TELEGRAM_API_URL}/logout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone })
            });
            toast.success("Desconectado");
            await fetchSessions();
        } catch (error) {
            toast.error("Erro ao desconectar");
        }
    };

    // Extrair membros via link
    const handleExtractFromLink = async () => {
        if (!groupLink) {
            toast.error("Cole o link do grupo");
            return;
        }

        if (sessions.length === 0 || !activeSessionPhone) {
            toast.error("Selecione uma conta conectada primeiro");
            return;
        }

        setIsExtracting(true);
        setImportResults(null);

        try {
            const response = await fetch(`${TELEGRAM_API_URL}/extract-members`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    group_link: groupLink,
                    phone: activeSessionPhone
                }),
            });

            const data = await response.json() as ExtractMembersResponse;

            if (response.ok && data.success && data.members) {
                const parsed: TelegramMember[] = data.members.map((m) => ({
                    id: String(m.id),
                    username: String(m.username || ""),
                    firstName: String(m.first_name || ""),
                    lastName: String(m.last_name || ""),
                    phone: String(m.phone || ""),
                    selected: true,
                }));

                setMembers(parsed);
                toast.success(`${parsed.length} membros extraídos do grupo ${data.group || 'desconhecido'}!`);
            } else {
                toast.error(data.detail || "Erro ao extrair membros");
            }
        } catch (error) {
            toast.error("Erro de conexão. Verifique se o serviço está rodando.");
        } finally {
            setIsExtracting(false);
        }
    };

    // Parse CSV content
    const parseCSV = (content: string): TelegramMember[] => {
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length < 2) return [];

        const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
        const usernameIdx = headers.findIndex(h => h.includes('username') || h.includes('user'));
        const firstNameIdx = headers.findIndex(h => h.includes('first') || h.includes('nome'));
        const lastNameIdx = headers.findIndex(h => h.includes('last') || h.includes('sobrenome'));
        const phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('telefone') || h.includes('celular'));
        const idIdx = headers.findIndex(h => h.includes('id') || h.includes('user_id'));

        return lines.slice(1).map((line, index) => {
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
            return {
                id: idIdx >= 0 ? values[idIdx] : `member_${index}`,
                username: usernameIdx >= 0 ? values[usernameIdx]?.replace('@', '') : '',
                firstName: firstNameIdx >= 0 ? values[firstNameIdx] : '',
                lastName: lastNameIdx >= 0 ? values[lastNameIdx] : '',
                phone: phoneIdx >= 0 ? values[phoneIdx] : '',
                selected: true,
            };
        }).filter(m => m.username || m.firstName || m.phone);
    };

    // Parse JSON content
    const parseJSON = (content: string): TelegramMember[] => {
        try {
            const data = JSON.parse(content);
            const items = Array.isArray(data) ? data : data.members || data.users || data.data || [];

            return items.map((item: Record<string, unknown>, index: number) => ({
                id: String(item.id || item.user_id || `member_${index}`),
                username: String(item.username || item.user || '').replace('@', ''),
                firstName: String(item.first_name || item.firstName || item.name || ''),
                lastName: String(item.last_name || item.lastName || ''),
                phone: String(item.phone || item.phone_number || item.telefone || ''),
                selected: true,
            })).filter((m: TelegramMember) => m.username || m.firstName || m.phone);
        } catch {
            return [];
        }
    };

    // Handle file upload
    const handleFileUpload = useCallback((file: File) => {
        setIsLoading(true);
        setImportResults(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            let parsed: TelegramMember[] = [];

            if (file.name.endsWith('.csv')) {
                parsed = parseCSV(content);
            } else if (file.name.endsWith('.json')) {
                parsed = parseJSON(content);
            } else {
                parsed = parseJSON(content);
                if (parsed.length === 0) {
                    parsed = parseCSV(content);
                }
            }

            if (parsed.length > 0) {
                setMembers(parsed);
                toast.success(`${parsed.length} membros encontrados no arquivo!`);
            } else {
                toast.error("Nenhum membro encontrado. Verifique o formato do arquivo.");
            }
            setIsLoading(false);
        };

        reader.onerror = () => {
            toast.error("Erro ao ler o arquivo.");
            setIsLoading(false);
        };

        reader.readAsText(file);
    }, []);

    // Drag and drop handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    // Toggle member selection
    const toggleMember = (id: string) => {
        setMembers(prev => prev.map(m =>
            m.id === id ? { ...m, selected: !m.selected } : m
        ));
    };

    // Select/Deselect all
    const toggleAll = (selected: boolean) => {
        setMembers(prev => prev.map(m => ({ ...m, selected })));
    };

    // Import selected members as clients
    const handleImport = async () => {
        const selectedMembers = members.filter(m => m.selected);

        if (selectedMembers.length === 0) {
            toast.error("Selecione pelo menos um membro para importar.");
            return;
        }

        setIsLoading(true);
        const results = { success: 0, failed: 0, errors: [] as string[] };

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        const expDateStr = expirationDate.toISOString().split('T')[0];

        for (const member of selectedMembers) {
            try {
                const clientData = {
                    name: `${member.firstName} ${member.lastName}`.trim() || member.username,
                    email: member.username ? `${member.username}@telegram.user` : `${member.id}@telegram.user`,
                    telegram: member.username ? `@${member.username}` : '',
                    whatsapp: member.phone || '',
                    phone: member.phone || '',
                    plan: importConfig.defaultPlan,
                    status: importConfig.defaultStatus,
                    expiration_date: expDateStr,
                    server: importConfig.defaultServer,
                    observations: `Importado do Telegram - ID: ${member.id}`,
                    password: '',
                    m3u_url: '',
                    bouquets: '',
                    real_name: `${member.firstName} ${member.lastName}`.trim(),
                    devices: 1,
                    credits: 0,
                    notes: '',
                };

                const success = await addCliente(clientData);

                if (success) {
                    results.success++;
                } else {
                    results.failed++;
                    results.errors.push(`${member.username || member.firstName}: Erro ao adicionar`);
                }
            } catch (error) {
                results.failed++;
                results.errors.push(`${member.username || member.firstName}: ${error instanceof Error ? error.message : 'Erro'}`);
            }
        }

        setImportResults(results);
        setIsLoading(false);

        if (results.success > 0) {
            toast.success(`${results.success} cliente(s) importado(s) com sucesso!`);
            setMembers(prev => prev.filter(m => !m.selected));
        }

        if (results.failed > 0) {
            toast.error(`${results.failed} falha(s) na importação.`);
        }
    };

    // Clear all
    const handleClear = () => {
        setMembers([]);
        setImportResults(null);
    };

    // Export members to CSV
    const handleExportCSV = () => {
        const selectedMembers = members.filter(m => m.selected);
        if (selectedMembers.length === 0) {
            toast.error("Selecione pelo menos um membro para exportar.");
            return;
        }

        const headers = ['ID', 'Username', 'Nome', 'Sobrenome', 'Telefone'];
        const csvData = selectedMembers.map(m => [
            m.id,
            m.username ? `@${m.username}` : '',
            m.firstName,
            m.lastName,
            m.phone
        ]);

        const csvContent = [headers, ...csvData]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `telegram_membros_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);

        toast.success(`${selectedMembers.length} membros exportados!`);
    };

    // Phase 1: Verify all accounts in batch
    const handleVerifyAllAccounts = async () => {
        if (sessions.length === 0) {
            toast.error("Nenhuma conta para verificar");
            return;
        }

        setIsVerifyingAccounts(true);
        setVerifyProgress(0);

        const newStatuses: Record<string, AccountStatusInfo> = {};

        for (let i = 0; i < sessions.length; i++) {
            const session = sessions[i];
            const progress = Math.round(((i + 1) / sessions.length) * 100);
            setVerifyProgress(progress);

            try {
                // Check if restricted based on session data
                if (session.is_restricted) {
                    newStatuses[session.clean_phone] = {
                        status: 'restricted',
                        lastCheck: new Date().toISOString(),
                        message: session.restriction_reason || 'Conta restrita'
                    };
                } else {
                    // Try to make a simple API call to verify
                    newStatuses[session.clean_phone] = {
                        status: 'free',
                        lastCheck: new Date().toISOString(),
                        message: 'Livre para uso'
                    };
                }
            } catch (error) {
                newStatuses[session.clean_phone] = {
                    status: 'flood',
                    lastCheck: new Date().toISOString(),
                    message: 'Erro ao verificar'
                };
            }

            // Small delay between checks
            await new Promise(r => setTimeout(r, 500));
        }

        setAccountStatuses(newStatuses);
        setIsVerifyingAccounts(false);
        toast.success("Verificação concluída!");
    };

    // Phase 1: Save current members as audience
    const handleSaveAudience = () => {
        if (members.length === 0) {
            toast.error("Nenhum membro para salvar");
            return;
        }

        if (!audienceName.trim()) {
            toast.error("Digite um nome para o público");
            return;
        }

        const newAudience: SavedAudience = {
            id: Date.now().toString(),
            name: audienceName.trim(),
            createdAt: new Date().toISOString(),
            source: groupLink || 'Upload manual',
            totalMembers: members.length,
            withUsername: members.filter(m => m.username).length,
            withPhone: members.filter(m => m.phone).length,
            members: [...members]
        };

        const updatedAudiences = [...savedAudiences, newAudience];
        setSavedAudiences(updatedAudiences);
        localStorage.setItem('telegram_saved_audiences', JSON.stringify(updatedAudiences));
        setAudienceName("");
        toast.success(`Público "${newAudience.name}" salvo com ${newAudience.totalMembers} membros!`);
    };

    // Phase 1: Load saved audiences from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('telegram_saved_audiences');
        if (saved) {
            try {
                setSavedAudiences(JSON.parse(saved));
            } catch (e) {
                console.error('Error loading saved audiences:', e);
            }
        }
    }, []);

    // Phase 1: Load audience into members
    const handleLoadAudience = (audience: SavedAudience) => {
        setMembers(audience.members);
        setShowSavedAudiences(false);
        toast.success(`Público "${audience.name}" carregado!`);
    };

    // Phase 1: Delete saved audience
    const handleDeleteAudience = (audienceId: string) => {
        const updatedAudiences = savedAudiences.filter(a => a.id !== audienceId);
        setSavedAudiences(updatedAudiences);
        localStorage.setItem('telegram_saved_audiences', JSON.stringify(updatedAudiences));
        toast.success("Público excluído!");
    };

    // Phase 1: Get filtered members
    const getFilteredMembers = () => {
        switch (memberFilter) {
            case 'with_username':
                return members.filter(m => m.username);
            case 'without_username':
                return members.filter(m => !m.username);
            case 'with_phone':
                return members.filter(m => m.phone);
            default:
                return members;
        }
    };

    // Phase 1: Get status badge color
    const getStatusBadge = (status?: AccountStatus) => {
        switch (status) {
            case 'free':
                return <Badge className="bg-green-600 text-white"><Zap className="w-3 h-3 mr-1" />Livre</Badge>;
            case 'restricted':
                return <Badge className="bg-red-600 text-white"><Shield className="w-3 h-3 mr-1" />Restrito</Badge>;
            case 'flood':
                return <Badge className="bg-yellow-600 text-white"><Clock className="w-3 h-3 mr-1" />Flood</Badge>;
            case 'checking':
                return <Badge className="bg-blue-600 text-white"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Verificando</Badge>;
            default:
                return <Badge className="bg-gray-600 text-white">Não verificado</Badge>;
        }
    };

    const filteredMembers = getFilteredMembers();

    const selectedCount = members.filter(m => m.selected).length;
    const apiConfigured = !!TELEGRAM_API_URL;

    // Phase 2: Replace variables in message
    const replaceVariables = (message: string, member: TelegramMember) => {
        return message
            .replace(/{nome}/g, member.firstName || '')
            .replace(/{sobrenome}/g, member.lastName || '')
            .replace(/{username}/g, member.username || '')
            .replace(/{id}/g, member.id);
    };

    // Phase 2: Add message variation
    const addMessageVariation = () => {
        setBulkSendConfig(prev => ({
            ...prev,
            messages: [...prev.messages, ""]
        }));
    };

    // Phase 2: Remove message variation
    const removeMessageVariation = (index: number) => {
        setBulkSendConfig(prev => ({
            ...prev,
            messages: prev.messages.filter((_, i) => i !== index)
        }));
    };

    // Phase 2: Update message variation
    const updateMessageVariation = (index: number, value: string) => {
        setBulkSendConfig(prev => ({
            ...prev,
            messages: prev.messages.map((m, i) => i === index ? value : m)
        }));
    };

    // Phase 2: Bulk send messages
    const handleBulkSend = async () => {
        const selectedMembers = members.filter(m => m.selected);
        if (selectedMembers.length === 0) {
            toast.error("Selecione pelo menos um membro para enviar");
            return;
        }

        const validMessages = bulkSendConfig.messages.filter(m => m.trim());
        if (validMessages.length === 0) {
            toast.error("Digite pelo menos uma mensagem");
            return;
        }

        const accountsToUse = bulkSendConfig.useAllAccounts
            ? sessions.filter(s => !s.is_restricted).map(s => s.clean_phone)
            : [activeSessionPhone];

        if (accountsToUse.length === 0) {
            toast.error("Nenhuma conta disponível para envio");
            return;
        }

        setIsSending(true);
        setSendProgress({ current: 0, total: selectedMembers.length, success: 0, failed: 0 });
        setSendLogs([]);

        let currentAccountIndex = 0;
        let successCount = 0;
        let failedCount = 0;
        const accountUsage: Record<string, number> = {};

        for (let i = 0; i < selectedMembers.length; i++) {
            const member = selectedMembers[i];

            // Rotate accounts if current one reached limit
            let currentAccount = accountsToUse[currentAccountIndex];
            let attempts = 0;
            while ((accountUsage[currentAccount] || 0) >= bulkSendConfig.dailyLimit && attempts < accountsToUse.length) {
                currentAccountIndex = (currentAccountIndex + 1) % accountsToUse.length;
                currentAccount = accountsToUse[currentAccountIndex];
                attempts++;
            }

            if (attempts >= accountsToUse.length) {
                toast.error("Todas as contas atingiram o limite diário");
                break;
            }

            // Select random message variation
            const messageTemplate = validMessages[Math.floor(Math.random() * validMessages.length)];
            const finalMessage = replaceVariables(messageTemplate, member);

            try {
                const response = await fetch(`${TELEGRAM_API_URL}/send-private`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        phone: currentAccount,
                        target_user_id: member.id,
                        message: finalMessage
                    })
                });

                const result = await response.json() as SendPrivateResponse;

                if (result.success) {
                    successCount++;
                    accountUsage[currentAccount] = (accountUsage[currentAccount] || 0) + 1;
                    setSendLogs(prev => [...prev, {
                        time: new Date().toLocaleTimeString('pt-BR'),
                        user: member.username || member.firstName || member.id,
                        status: 'success'
                    }]);
                } else {
                    failedCount++;
                    setSendLogs(prev => [...prev, {
                        time: new Date().toLocaleTimeString('pt-BR'),
                        user: member.username || member.firstName || member.id,
                        status: 'error',
                        message: result.error
                    }]);

                    // Handle flood - switch account
                    if (result.error === 'FLOOD_WAIT' || result.error === 'PEER_FLOOD') {
                        accountUsage[currentAccount] = bulkSendConfig.dailyLimit; // Mark as exhausted
                        currentAccountIndex = (currentAccountIndex + 1) % accountsToUse.length;
                    }
                }
            } catch (error) {
                failedCount++;
                setSendLogs(prev => [...prev, {
                    time: new Date().toLocaleTimeString('pt-BR'),
                    user: member.username || member.firstName || member.id,
                    status: 'error',
                    message: 'Erro de conexão'
                }]);
            }

            setSendProgress({ current: i + 1, total: selectedMembers.length, success: successCount, failed: failedCount });

            // Random delay between min and max interval
            if (i < selectedMembers.length - 1) {
                const delay = bulkSendConfig.intervalMin + Math.random() * (bulkSendConfig.intervalMax - bulkSendConfig.intervalMin);
                await new Promise(r => setTimeout(r, delay * 1000));
            }
        }

        setIsSending(false);
        toast.success(`Envio concluído! ${successCount} enviados, ${failedCount} falhas`);
    };

    // Phase 2: Stop sending
    const handleStopSending = () => {
        setIsSending(false);
        toast.info("Envio interrompido");
    };

    // Phase 3: Load campaigns and schedules from localStorage
    useEffect(() => {
        const savedCampaigns = localStorage.getItem('telegram_campaigns');
        const savedSchedules = localStorage.getItem('telegram_scheduled_messages');
        if (savedCampaigns) {
            try { setCampaigns(JSON.parse(savedCampaigns)); } catch (e) { console.error(e); }
        }
        if (savedSchedules) {
            try { setScheduledMessages(JSON.parse(savedSchedules)); } catch (e) { console.error(e); }
        }
    }, []);

    // Phase 3: Create campaign
    const handleCreateCampaign = () => {
        if (!newCampaignName.trim()) {
            toast.error("Digite o nome da campanha");
            return;
        }
        const campaign: Campaign = {
            id: Date.now().toString(),
            name: newCampaignName.trim(),
            createdAt: new Date().toISOString()
        };
        const updated = [...campaigns, campaign];
        setCampaigns(updated);
        localStorage.setItem('telegram_campaigns', JSON.stringify(updated));
        setNewCampaignName('');
        toast.success(`Campanha "${campaign.name}" criada!`);
    };

    // Phase 3: Save scheduled message
    const handleSaveSchedule = () => {
        if (!newSchedule.name.trim()) {
            toast.error("Digite o nome do disparo");
            return;
        }
        if (!newSchedule.message.trim()) {
            toast.error("Digite a mensagem");
            return;
        }
        if (newSchedule.mode === 'scheduled' && (!newSchedule.scheduledDate || !newSchedule.scheduledTime)) {
            toast.error("Defina a data e horário");
            return;
        }

        const schedule: ScheduledMessage = {
            id: Date.now().toString(),
            name: newSchedule.name.trim(),
            campaignId: newSchedule.campaignId,
            message: newSchedule.message,
            attachment: newSchedule.attachment,
            buttons: newSchedule.buttons,
            mode: newSchedule.mode,
            scheduledDate: newSchedule.scheduledDate,
            scheduledTime: newSchedule.scheduledTime,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        const updated = [...scheduledMessages, schedule];
        setScheduledMessages(updated);
        localStorage.setItem('telegram_scheduled_messages', JSON.stringify(updated));

        // Reset form
        setNewSchedule({
            name: '',
            campaignId: '',
            message: '',
            attachment: '',
            buttons: [],
            mode: 'scheduled',
            scheduledDate: '',
            scheduledTime: ''
        });

        toast.success(`Disparo "${schedule.name}" salvo!`);
    };

    // Phase 3: Add button to message
    const handleAddButton = () => {
        if (!newButton.label.trim() || !newButton.url.trim()) {
            toast.error("Preencha o texto e URL do botão");
            return;
        }
        setNewSchedule(prev => ({
            ...prev,
            buttons: [...prev.buttons, { label: newButton.label, url: newButton.url }]
        }));
        setNewButton({ label: '', url: '' });
        setShowAddButton(false);
    };

    // Phase 3: Remove button from message
    const handleRemoveButton = (index: number) => {
        setNewSchedule(prev => ({
            ...prev,
            buttons: prev.buttons.filter((_, i) => i !== index)
        }));
    };

    // Phase 3: Delete scheduled message
    const handleDeleteSchedule = (id: string) => {
        const updated = scheduledMessages.filter(s => s.id !== id);
        setScheduledMessages(updated);
        localStorage.setItem('telegram_scheduled_messages', JSON.stringify(updated));
        toast.success("Disparo excluído!");
    };

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                        <Send className="w-7 h-7 text-blue-500" />
                        Importar do Telegram 🤖
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Importe membros de grupos do Telegram como clientes
                    </p>
                </div>
            </div>

            {/* Tabs para métodos de importação */}
            <Tabs defaultValue="automatic" className="w-full">
                <TabsList className="grid w-full grid-cols-6 mb-6">
                    <TabsTrigger value="automatic" className="flex items-center gap-1 text-[10px]">
                        <Link className="w-3 h-3" />
                        Extração
                    </TabsTrigger>
                    <TabsTrigger value="campaigns" className="flex items-center gap-1 text-[10px]">
                        <Calendar className="w-3 h-3" />
                        Campanhas
                    </TabsTrigger>
                    <TabsTrigger value="buttons" className="flex items-center gap-1 text-[10px]">
                        <Link className="w-3 h-3" />
                        Botões
                    </TabsTrigger>
                    <TabsTrigger value="chatbots" className="flex items-center gap-1 text-[10px]">
                        <Bot className="w-3 h-3" />
                        ChatBots
                    </TabsTrigger>
                    <TabsTrigger value="private" className="flex items-center gap-1 text-[10px]">
                        <Send className="w-3 h-3" />
                        Privado
                    </TabsTrigger>
                    <TabsTrigger value="broadcast" className="flex items-center gap-1 text-[10px]">
                        <Radio className="w-3 h-3" />
                        Broadcast
                    </TabsTrigger>
                </TabsList>

                {/* Tab: Extração Automática */}
                <TabsContent value="automatic" className="space-y-6">
                    {!apiConfigured ? (
                        <Card className="bg-yellow-950/30 border-yellow-800/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-yellow-400">
                                    <AlertCircle className="w-5 h-5" />
                                    Configuração Necessária
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <p>Para usar a extração automática, você precisa:</p>
                                <ol className="list-decimal list-inside space-y-2 ml-4">
                                    <li>Deploy do serviço Python no Railway (veja <code>telegram-service/README.md</code>)</li>
                                    <li>Configurar a variável de ambiente <code>VITE_TELEGRAM_API_URL</code> no seu <code>.env</code></li>
                                    <li>Reiniciar o servidor de desenvolvimento</li>
                                </ol>
                                <div className="bg-gray-900 p-3 rounded font-mono text-xs">
                                    VITE_TELEGRAM_API_URL=https://seu-app.railway.app
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Accounts Table Card - Full Width */}
                            <Card className="lg:col-span-3">
                                <CardHeader className="pb-3">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="flex items-center gap-2 text-xl">
                                                    <Users className="w-6 h-6" />
                                                    Gerenciar Contas
                                                    {sessions.length > 0 && (
                                                        <Badge variant="secondary" className="text-sm">{sessions.length}</Badge>
                                                    )}
                                                </CardTitle>
                                                <CardDescription>
                                                    Conecte múltiplas contas para automação
                                                </CardDescription>
                                            </div>
                                        </div>

                                        {/* Action Bar */}
                                        <div className="flex flex-wrap gap-2">
                                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => setIsAddingAccount(true)}>
                                                <UserPlus className="w-4 h-4 mr-1" />
                                                Adicionar
                                            </Button>
                                            <Button size="sm" variant="destructive" disabled={sessions.length === 0}>
                                                <Trash2 className="w-4 h-4 mr-1" />
                                                Remover
                                            </Button>
                                            <Button size="sm" variant="outline" disabled={sessions.length === 0}>
                                                <Download className="w-4 h-4 mr-1" />
                                                Exportar
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                <Upload className="w-4 h-4 mr-1" />
                                                Importar
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="bg-blue-600 hover:bg-blue-700"
                                                onClick={handleVerifyAllAccounts}
                                                disabled={isVerifyingAccounts || sessions.length === 0}
                                            >
                                                <RefreshCw className={`w-4 h-4 mr-1 ${isVerifyingAccounts ? 'animate-spin' : ''}`} />
                                                Verificar contas ({sessions.length})
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Verification Progress Modal */}
                                    {isVerifyingAccounts && (
                                        <div className="bg-blue-950/30 border border-blue-800/50 rounded-lg p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium">Verificando contas</h4>
                                                <span className="text-sm text-muted-foreground">{verifyProgress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-3">
                                                <div
                                                    className="bg-green-500 h-3 rounded-full transition-all duration-300"
                                                    style={{ width: `${verifyProgress}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-muted-foreground">
                                                    Verificando conta {Math.ceil((verifyProgress / 100) * sessions.length)}/{sessions.length}...
                                                </span>
                                                <Button size="sm" variant="destructive" onClick={() => setIsVerifyingAccounts(false)}>
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Accounts Table */}
                                    {sessions.length > 0 ? (
                                        <div className="rounded-md border overflow-hidden">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-muted/50">
                                                        <TableHead className="w-12">Cód.</TableHead>
                                                        <TableHead>Nº Telefone</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead>Nome</TableHead>
                                                        <TableHead>Última Verificação</TableHead>
                                                        <TableHead>Detalhes</TableHead>
                                                        <TableHead className="w-20">Ações</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {sessions.map((session, index) => {
                                                        const status = accountStatuses[session.clean_phone];
                                                        return (
                                                            <TableRow
                                                                key={session.clean_phone}
                                                                className={activeSessionPhone === session.clean_phone ? 'bg-blue-950/30' : ''}
                                                            >
                                                                <TableCell className="font-mono text-xs">{index + 1}</TableCell>
                                                                <TableCell className="font-mono">{session.phone}</TableCell>
                                                                <TableCell>
                                                                    {session.is_restricted ? (
                                                                        <Badge className="bg-red-600">Restrito</Badge>
                                                                    ) : status?.status === 'flood' ? (
                                                                        <Badge className="bg-yellow-600">Flood</Badge>
                                                                    ) : (
                                                                        <Badge className="bg-green-600">Conectada</Badge>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {session.first_name || '-'} {session.username ? `(@${session.username})` : ''}
                                                                </TableCell>
                                                                <TableCell className="text-xs text-muted-foreground">
                                                                    {status?.lastCheck
                                                                        ? new Date(status.lastCheck).toLocaleString('pt-BR')
                                                                        : '-'
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    {session.is_restricted ? (
                                                                        <span className="flex items-center gap-1 text-red-400 text-xs">
                                                                            <AlertCircle className="w-3 h-3" />
                                                                            Conta com restrição
                                                                        </span>
                                                                    ) : status?.status === 'flood' ? (
                                                                        <span className="flex items-center gap-1 text-yellow-400 text-xs">
                                                                            <Clock className="w-3 h-3" />
                                                                            Restrição temporária
                                                                        </span>
                                                                    ) : (
                                                                        <span className="flex items-center gap-1 text-green-400 text-xs">
                                                                            <CheckCircle className="w-3 h-3" />
                                                                            A conta está livre para uso
                                                                        </span>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex gap-1">
                                                                        {activeSessionPhone !== session.clean_phone && (
                                                                            <Button
                                                                                size="icon"
                                                                                variant="ghost"
                                                                                className="h-7 w-7"
                                                                                onClick={() => setActiveSessionPhone(session.clean_phone)}
                                                                                title="Selecionar"
                                                                            >
                                                                                <CheckCircle className="w-4 h-4 text-blue-400" />
                                                                            </Button>
                                                                        )}
                                                                        <Button
                                                                            size="icon"
                                                                            variant="ghost"
                                                                            className="h-7 w-7 text-red-500 hover:text-red-400"
                                                                            onClick={() => handleLogout(session.clean_phone)}
                                                                            title="Remover"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                            <p>Nenhuma conta conectada</p>
                                            <p className="text-xs">Clique em "Adicionar" para conectar sua primeira conta</p>
                                        </div>
                                    )}

                                    {/* Add Account Form */}
                                    {isAddingAccount && (
                                        <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="text-sm font-medium">Nova Conexão</h4>
                                                <Button size="sm" variant="ghost" onClick={() => setIsAddingAccount(false)}>Cancel</Button>
                                            </div>

                                            {loginStep === "phone" && (
                                                <div className="space-y-3">
                                                    <div className="space-y-2">
                                                        <Label>Número de Telefone</Label>
                                                        <Input placeholder="+55..." value={loginPhone} onChange={e => setLoginPhone(e.target.value)} />
                                                    </div>
                                                    <Button onClick={handleStartLogin} disabled={isLoggingIn} className="w-full">
                                                        {isLoggingIn && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                                        Enviar Código
                                                    </Button>
                                                </div>
                                            )}

                                            {loginStep === "code" && (
                                                <div className="space-y-3">
                                                    <div className="space-y-2">
                                                        <Label>Código</Label>
                                                        <Input placeholder="12345" value={loginCode} onChange={e => setLoginCode(e.target.value)} />
                                                    </div>
                                                    <Button onClick={handleVerifyCode} disabled={isLoggingIn} className="w-full">
                                                        {isLoggingIn && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                                        Verificar
                                                    </Button>
                                                    <Button variant="ghost" onClick={() => setLoginStep("phone")} className="w-full">Voltar</Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Extraction Card */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Link className="w-5 h-5" />
                                        Extrair Membros do Grupo
                                    </CardTitle>
                                    <CardDescription>
                                        Cole o link do grupo para extrair automaticamente os membros
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Link do Grupo</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="https://t.me/meugrupo ou @meugrupo"
                                                value={groupLink}
                                                onChange={(e) => setGroupLink(e.target.value)}
                                                className="flex-1"
                                            />
                                            <Button
                                                onClick={handleExtractFromLink}
                                                disabled={isExtracting || sessions.length === 0 || !activeSessionPhone}
                                                className="bg-gradient-to-r from-blue-600 to-purple-600"
                                            >
                                                {isExtracting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                                {isExtracting ? "Extraindo..." : "Extrair Membros"}
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Formatos aceitos: t.me/grupo, @grupo, telegram.me/grupo
                                        </p>
                                    </div>

                                    {(sessions.length === 0 || !activeSessionPhone) ? (
                                        <div className="bg-yellow-950/30 border border-yellow-800/50 rounded-lg p-3">
                                            <p className="text-sm text-yellow-400">
                                                ⚠️ Selecione uma conta conectada para extrair membros
                                            </p>
                                        </div>
                                    ) : (
                                        sessions.find(s => s.clean_phone === activeSessionPhone)?.is_restricted && (
                                            <div className="bg-red-950/30 border border-red-800/50 rounded-lg p-3">
                                                <div className="flex items-center gap-2 text-red-400 mb-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span className="font-medium text-sm">Conta Restrita</span>
                                                </div>
                                                <p className="text-xs text-red-300">
                                                    Esta conta possui restrições do Telegram. A extração pode falhar ou ser limitada.
                                                </p>
                                            </div>
                                        )
                                    )}

                                    <div className="border-t pt-4">
                                        <h4 className="font-medium mb-2">⚠️ Importante</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Você precisa ser membro do grupo para extrair</li>
                                            <li>• Grupos privados requerem acesso</li>
                                            <li>• Alguns grupos limitam a visualização de membros</li>
                                            <li>• Use com moderação para evitar limites do Telegram</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </TabsContent>

                {/* Tab: Campanhas / Agendamento */}
                <TabsContent value="campaigns" className="space-y-6">
                    {/* Banner Informativo */}
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-4 text-white text-center">
                        <p className="text-lg font-medium">
                            📅 Agende todos os envios, ligue o piloto automático e mantenha seu grupo ou canal sempre movimentado!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Formulário de Agendamento */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Send className="w-5 h-5" />
                                    Envio de mensagens para grupos
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Nome do Disparo */}
                                <div className="space-y-2">
                                    <Label>Nome do disparo:</Label>
                                    <Input
                                        placeholder="Ex: Recursos da Versão"
                                        value={newSchedule.name}
                                        onChange={(e) => setNewSchedule(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>

                                {/* Campanha */}
                                <div className="space-y-2">
                                    <Label>Campanha:</Label>
                                    <div className="flex gap-2">
                                        <Select
                                            value={newSchedule.campaignId}
                                            onValueChange={(v) => setNewSchedule(prev => ({ ...prev, campaignId: v }))}
                                        >
                                            <SelectTrigger className="flex-1">
                                                <SelectValue placeholder="Selecione uma campanha" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {campaigns.map(c => (
                                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <div className="flex gap-1">
                                            <Input
                                                placeholder="Nova campanha..."
                                                value={newCampaignName}
                                                onChange={(e) => setNewCampaignName(e.target.value)}
                                                className="w-40"
                                            />
                                            <Button size="icon" onClick={handleCreateCampaign}>
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Mensagem de envio */}
                                <div className="space-y-2">
                                    <Label>Mensagem de envio:</Label>
                                    <textarea
                                        className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        placeholder="Digite sua mensagem aqui..."
                                        value={newSchedule.message}
                                        onChange={(e) => setNewSchedule(prev => ({ ...prev, message: e.target.value.slice(0, 1024) }))}
                                        maxLength={1024}
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>{newSchedule.message.length}/1024 caracteres</span>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" className="h-7">
                                                <Paperclip className="w-3 h-3 mr-1" />
                                                Anexar
                                            </Button>
                                            <Button size="sm" variant="outline" className="h-7" onClick={() => setShowAddButton(true)}>
                                                Botão
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Botões da mensagem */}
                                {newSchedule.buttons.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {newSchedule.buttons.map((btn, i) => (
                                            <Badge key={i} variant="secondary" className="flex items-center gap-1">
                                                {btn.label}
                                                <button onClick={() => handleRemoveButton(i)} className="ml-1 hover:text-red-400">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {/* Modal Adicionar Botão */}
                                {showAddButton && (
                                    <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
                                        <h4 className="font-medium text-sm">Adicionar Botão</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                placeholder="Texto do botão"
                                                value={newButton.label}
                                                onChange={(e) => setNewButton(prev => ({ ...prev, label: e.target.value }))}
                                            />
                                            <Input
                                                placeholder="https://..."
                                                value={newButton.url}
                                                onChange={(e) => setNewButton(prev => ({ ...prev, url: e.target.value }))}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={handleAddButton}>Adicionar</Button>
                                            <Button size="sm" variant="ghost" onClick={() => setShowAddButton(false)}>Cancelar</Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Configurações de Execução */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Modo de execução:
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Radio Buttons */}
                                <div className="space-y-2">
                                    {(['scheduled', 'cron', 'manual'] as const).map((mode) => (
                                        <label key={mode} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="mode"
                                                value={mode}
                                                checked={newSchedule.mode === mode}
                                                onChange={() => setNewSchedule(prev => ({ ...prev, mode }))}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm">
                                                {mode === 'scheduled' && 'Agendado'}
                                                {mode === 'cron' && 'Cronograma'}
                                                {mode === 'manual' && 'Manual'}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                {/* Data e Hora (se agendado) */}
                                {newSchedule.mode === 'scheduled' && (
                                    <div className="space-y-3 pt-3 border-t">
                                        <div className="space-y-2">
                                            <Label>Data de início:</Label>
                                            <Input
                                                type="date"
                                                value={newSchedule.scheduledDate}
                                                onChange={(e) => setNewSchedule(prev => ({ ...prev, scheduledDate: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Horário:</Label>
                                            <Input
                                                type="time"
                                                value={newSchedule.scheduledTime}
                                                onChange={(e) => setNewSchedule(prev => ({ ...prev, scheduledTime: e.target.value }))}
                                            />
                                        </div>
                                        <p className="text-xs text-yellow-400 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            O computador precisa estar ligado e conectado durante o horário agendado.
                                        </p>
                                    </div>
                                )}

                                {/* Grid de Cronograma (se cronograma) */}
                                {newSchedule.mode === 'cron' && (
                                    <div className="space-y-4 pt-3 border-t">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium text-sm">Programação de envio da mensagem</h4>
                                            <Badge variant="secondary">{countScheduledSlots()} slots</Badge>
                                        </div>

                                        {/* Grid Table */}
                                        <div className="overflow-x-auto">
                                            <div className="min-w-[600px]">
                                                {/* Header - Hours */}
                                                <div className="flex">
                                                    <div className="w-12 flex-shrink-0"></div>
                                                    {Array.from({ length: 24 }, (_, i) => (
                                                        <div key={i} className="flex-1 text-center text-[10px] text-muted-foreground font-mono">
                                                            {i}h
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Days */}
                                                {[
                                                    { key: 'seg', label: 'Seg' },
                                                    { key: 'ter', label: 'Ter' },
                                                    { key: 'qua', label: 'Qua' },
                                                    { key: 'qui', label: 'Qui' },
                                                    { key: 'sex', label: 'Sex' },
                                                    { key: 'sab', label: 'Sab' },
                                                    { key: 'dom', label: 'Dom' }
                                                ].map(({ key, label }) => (
                                                    <div key={key} className="flex items-center">
                                                        <div className="w-12 flex-shrink-0 text-xs font-medium text-muted-foreground">
                                                            {label}
                                                        </div>
                                                        {Array.from({ length: 24 }, (_, hour) => (
                                                            <button
                                                                key={hour}
                                                                type="button"
                                                                onClick={() => toggleCronCell(key, hour)}
                                                                className={`flex-1 h-6 border border-gray-700 transition-all ${cronSchedule[key]?.[hour]
                                                                    ? 'bg-blue-500 hover:bg-blue-600'
                                                                    : 'bg-gray-800 hover:bg-gray-700'
                                                                    }`}
                                                                title={`${label} ${hour}h`}
                                                            />
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Date Range Options */}
                                        <div className="grid grid-cols-2 gap-4 pt-3">
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={useStartDate}
                                                        onChange={(e) => setUseStartDate(e.target.checked)}
                                                        className="w-4 h-4"
                                                    />
                                                    Definir data de início
                                                </label>
                                                {useStartDate && (
                                                    <Input
                                                        type="date"
                                                        value={cronStartDate}
                                                        onChange={(e) => setCronStartDate(e.target.value)}
                                                    />
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={useEndDate}
                                                        onChange={(e) => setUseEndDate(e.target.checked)}
                                                        className="w-4 h-4"
                                                    />
                                                    Definir data de término
                                                </label>
                                                {useEndDate && (
                                                    <Input
                                                        type="date"
                                                        value={cronEndDate}
                                                        onChange={(e) => setCronEndDate(e.target.value)}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        {/* Banner */}
                                        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-3 text-white text-center text-sm">
                                            Crie uma programação de postagens automática. Antecipe a postagem de toda a semana! Menos esforço e Mais tempo livre!
                                        </div>
                                    </div>
                                )}

                                {/* Botões de Ação */}
                                <div className="flex gap-2 pt-4">
                                    <Button variant="outline" className="flex-1 gap-1">
                                        <Play className="w-4 h-4" />
                                        Enviar agora
                                    </Button>
                                    <Button className="flex-1 gap-1" onClick={handleSaveSchedule}>
                                        <Save className="w-4 h-4" />
                                        Salvar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Lista de Agendamentos Salvos */}
                    {scheduledMessages.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Disparos Agendados
                                    <Badge variant="secondary">{scheduledMessages.length}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nome</TableHead>
                                            <TableHead>Campanha</TableHead>
                                            <TableHead>Modo</TableHead>
                                            <TableHead>Data/Hora</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {scheduledMessages.map((schedule) => (
                                            <TableRow key={schedule.id}>
                                                <TableCell className="font-medium">{schedule.name}</TableCell>
                                                <TableCell>{campaigns.find(c => c.id === schedule.campaignId)?.name || '-'}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {schedule.mode === 'scheduled' && 'Agendado'}
                                                        {schedule.mode === 'cron' && 'Cronograma'}
                                                        {schedule.mode === 'manual' && 'Manual'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {schedule.scheduledDate && schedule.scheduledTime
                                                        ? `${schedule.scheduledDate} ${schedule.scheduledTime}`
                                                        : '-'
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={
                                                        schedule.status === 'pending' ? 'bg-yellow-600' :
                                                            schedule.status === 'sent' ? 'bg-green-600' : 'bg-red-600'
                                                    }>
                                                        {schedule.status === 'pending' && 'Pendente'}
                                                        {schedule.status === 'sent' && 'Enviado'}
                                                        {schedule.status === 'failed' && 'Falhou'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDeleteSchedule(schedule.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Tab: Botões */}
                <TabsContent value="buttons" className="space-y-6">
                    {/* Banner Informativo */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 text-white text-center">
                        <p className="text-lg font-medium">
                            🔘 Crie menus personalizados com botões, e agende os disparos sempre que quiser.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Formulário de Mensagem com Botões */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Send className="w-5 h-5" />
                                    Mensagem com Botões
                                </CardTitle>
                                <CardDescription>
                                    Crie mensagens interativas com botões clicáveis
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Nome do Disparo */}
                                <div className="space-y-2">
                                    <Label>Nome do disparo:</Label>
                                    <Input
                                        placeholder="Ex: Menu com botões"
                                        value={newSchedule.name}
                                        onChange={(e) => setNewSchedule(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>

                                {/* Campanha */}
                                <div className="space-y-2">
                                    <Label>Campanha:</Label>
                                    <Select
                                        value={newSchedule.campaignId}
                                        onValueChange={(v) => setNewSchedule(prev => ({ ...prev, campaignId: v }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione uma campanha" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {campaigns.map(c => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Mensagem de envio */}
                                <div className="space-y-2">
                                    <Label>Mensagem de envio:</Label>
                                    <textarea
                                        className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        placeholder="🔔 Suas Definições de Vendas no Automático Foram Atualizadas!"
                                        value={newSchedule.message}
                                        onChange={(e) => setNewSchedule(prev => ({ ...prev, message: e.target.value.slice(0, 1024) }))}
                                        maxLength={1024}
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>{newSchedule.message.length}/1024 caracteres</span>
                                    </div>
                                </div>

                                {/* Botões Adicionados */}
                                {newSchedule.buttons.length > 0 && (
                                    <div className="space-y-2">
                                        <Label>Botões da mensagem:</Label>
                                        <div className="space-y-2">
                                            {newSchedule.buttons.map((btn, i) => (
                                                <div key={i} className="flex items-center gap-2 p-2 bg-blue-950/30 rounded border border-blue-800/50">
                                                    <span className="flex-1 text-sm">
                                                        [{btn.label} - {btn.url}]
                                                    </span>
                                                    <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500" onClick={() => handleRemoveButton(i)}>
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Adicionar Botão */}
                                {showAddButton ? (
                                    <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
                                        <h4 className="font-medium text-sm">Adicionar Botão</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                placeholder="📞 Fale comigo"
                                                value={newButton.label}
                                                onChange={(e) => setNewButton(prev => ({ ...prev, label: e.target.value }))}
                                            />
                                            <Input
                                                placeholder="https://seusite.com"
                                                value={newButton.url}
                                                onChange={(e) => setNewButton(prev => ({ ...prev, url: e.target.value }))}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={handleAddButton}>Adicionar</Button>
                                            <Button size="sm" variant="ghost" onClick={() => setShowAddButton(false)}>Cancelar</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <Button variant="outline" className="w-full border-dashed" onClick={() => setShowAddButton(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Adicionar Botão
                                    </Button>
                                )}

                                {/* Anexo */}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Paperclip className="w-4 h-4" />
                                    <span>Anexar arquivo (opcional)</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Configurações e Resumo */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Modo de execução:
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Radio Buttons */}
                                <div className="flex gap-4">
                                    {(['scheduled', 'cron', 'manual'] as const).map((mode) => (
                                        <label key={mode} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="buttonMode"
                                                value={mode}
                                                checked={newSchedule.mode === mode}
                                                onChange={() => setNewSchedule(prev => ({ ...prev, mode }))}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm">
                                                {mode === 'scheduled' && 'Agendado'}
                                                {mode === 'cron' && 'Cronograma'}
                                                {mode === 'manual' && 'Manual'}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                {/* Resumo do Cronograma */}
                                <div className="bg-muted/30 rounded-lg p-4">
                                    <h4 className="font-medium text-sm mb-3">Resumo do cronograma</h4>
                                    <div className="space-y-1 text-xs text-muted-foreground">
                                        {[
                                            { day: 'Seg', key: 'seg' },
                                            { day: 'Ter', key: 'ter' },
                                            { day: 'Qua', key: 'qua' },
                                            { day: 'Qui', key: 'qui' },
                                            { day: 'Sex', key: 'sex' },
                                            { day: 'Sáb', key: 'sab' },
                                            { day: 'Dom', key: 'dom' }
                                        ].map(({ day, key }) => {
                                            const hours = Object.entries(cronSchedule[key] || {})
                                                .filter(([_, active]) => active)
                                                .map(([hour]) => `${hour}:00`)
                                                .join(', ');
                                            return hours ? (
                                                <div key={key} className="flex">
                                                    <span className="w-10 font-medium">{day}</span>
                                                    <span>- {hours}</span>
                                                </div>
                                            ) : null;
                                        })}
                                        {countScheduledSlots() === 0 && (
                                            <p className="text-center py-4">Nenhum horário configurado</p>
                                        )}
                                    </div>
                                </div>

                                {/* Status do Cronograma */}
                                {countScheduledSlots() > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-green-600">Cronograma: Ativo</Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {countScheduledSlots()} horários configurados
                                        </span>
                                    </div>
                                )}

                                {/* Aviso */}
                                <p className="text-xs text-yellow-400 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    O computador precisa estar ligado e conectado durante o horário agendado.
                                </p>

                                {/* Botões de Ação */}
                                <div className="flex gap-2 pt-4">
                                    <Button variant="outline" className="flex-1 gap-1">
                                        <Play className="w-4 h-4" />
                                        Enviar agora
                                    </Button>
                                    <Button className="flex-1 gap-1" onClick={handleSaveSchedule}>
                                        <Save className="w-4 h-4" />
                                        Salvar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Tab: ChatBots */}
                <TabsContent value="chatbots" className="space-y-6">
                    {/* Banner Informativo */}
                    <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-4 text-white text-center">
                        <p className="text-lg font-medium">
                            🤖 Construa um funil de mensagens usando o chatbot do BootFlow.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Configuração de Regras */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bot className="w-5 h-5" />
                                    Regra do Chatbot
                                </CardTitle>
                                <CardDescription>
                                    Configure palavras-chave e fluxos de resposta
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Nome da Regra */}
                                <div className="space-y-2">
                                    <Label>Nome da regra:</Label>
                                    <Input
                                        placeholder="Ex: Boas-vindas"
                                        value={currentRule.name || ''}
                                        onChange={(e) => setCurrentRule(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>

                                {/* Aplicar em */}
                                <div className="space-y-2">
                                    <Label>Aplicar em mensagens originais:</Label>
                                    <Select
                                        value={currentRule.applyTo}
                                        onValueChange={(v: 'private' | 'group' | 'channel') => setCurrentRule(prev => ({ ...prev, applyTo: v }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="private">Conversa Privada</SelectItem>
                                            <SelectItem value="group">Grupo</SelectItem>
                                            <SelectItem value="channel">Canal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Palavras-chave */}
                                <div className="space-y-2">
                                    <Label>Palavras-chave (Separe por vírgula):</Label>
                                    <Input
                                        placeholder="oi, olá, bom dia, boa tarde"
                                        value={keywordsInput}
                                        onChange={(e) => setKeywordsInput(e.target.value)}
                                    />
                                </div>

                                {/* Método de comparação */}
                                <div className="space-y-2">
                                    <Label>Método de comparação:</Label>
                                    <Select
                                        value={currentRule.compareMethod}
                                        onValueChange={(v: 'equal' | 'contains' | 'startsWith') => setCurrentRule(prev => ({ ...prev, compareMethod: v }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="equal">Igual</SelectItem>
                                            <SelectItem value="contains">Contém</SelectItem>
                                            <SelectItem value="startsWith">Começa com</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* ID de Fluxo */}
                                <div className="space-y-2">
                                    <Label>ID de Fluxo (Não obrigatório):</Label>
                                    <Input
                                        placeholder="sim"
                                        value={currentRule.flowId || ''}
                                        onChange={(e) => setCurrentRule(prev => ({ ...prev, flowId: e.target.value }))}
                                    />
                                </div>

                                {/* Toggles */}
                                <div className="space-y-3 pt-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={currentRule.sendOnNewChat || false}
                                            onChange={(e) => setCurrentRule(prev => ({ ...prev, sendOnNewChat: e.target.checked }))}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm">Enviar mensagem ao iniciar novo chat</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={currentRule.pausePerLead || false}
                                            onChange={(e) => setCurrentRule(prev => ({ ...prev, pausePerLead: e.target.checked }))}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm">Pausar regra por Lead</span>
                                    </label>
                                </div>

                                {/* Toggle Ativo */}
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <span className="text-sm font-medium">Status da regra:</span>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <span className="text-xs text-muted-foreground">Off</span>
                                        <input
                                            type="checkbox"
                                            checked={currentRule.active ?? true}
                                            onChange={(e) => setCurrentRule(prev => ({ ...prev, active: e.target.checked }))}
                                            className="w-10 h-5 rounded-full appearance-none bg-gray-600 checked:bg-green-500 transition-colors relative before:content-[''] before:absolute before:w-4 before:h-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 checked:before:left-5 before:transition-all"
                                        />
                                        <span className="text-xs text-muted-foreground">On</span>
                                    </label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sequências de Mensagens */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5" />
                                    Sequência de Mensagens
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Tabs de Sequências */}
                                <div className="flex gap-2 flex-wrap">
                                    {currentRule.sequences?.map((_, index) => (
                                        <Button
                                            key={index}
                                            size="sm"
                                            variant={activeSequence === index ? "default" : "outline"}
                                            onClick={() => setActiveSequence(index)}
                                            className="relative"
                                        >
                                            Seq. {index + 1}
                                            {(currentRule.sequences?.length || 0) > 1 && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); removeSequence(index); }}
                                                    className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 text-[10px] flex items-center justify-center"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </Button>
                                    ))}
                                    <Button size="sm" variant="ghost" onClick={addChatbotSequence}>
                                        <Plus className="w-3 h-3 mr-1" />
                                        Nova
                                    </Button>
                                </div>

                                {/* Área da Sequência Ativa */}
                                {currentRule.sequences?.[activeSequence] && (
                                    <div className="space-y-3">
                                        <textarea
                                            className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            placeholder="legal né?! se você quer ter acesso a outras demonstrações, estratégias e dicas. é Só participar do nosso grupo gratuito no telegram."
                                            value={currentRule.sequences[activeSequence].message}
                                            onChange={(e) => updateSequenceMessage(activeSequence, e.target.value)}
                                            maxLength={4096}
                                        />

                                        {/* Botões da Sequência */}
                                        {currentRule.sequences[activeSequence].buttons.length > 0 && (
                                            <div className="space-y-1">
                                                {currentRule.sequences[activeSequence].buttons.map((btn, i) => (
                                                    <div key={i} className="text-sm p-2 bg-blue-950/30 rounded border border-blue-800/50">
                                                        [{btn.label} - {btn.url}]
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Info */}
                                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                                            <span>{currentRule.sequences[activeSequence].message.length}/4096 caracteres</span>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3 h-3" />
                                                <Input
                                                    type="number"
                                                    value={currentRule.sequences[activeSequence].delay}
                                                    onChange={(e) => updateSequenceDelay(activeSequence, parseInt(e.target.value) || 0)}
                                                    className="w-16 h-6 text-xs"
                                                />
                                                <span>s</span>
                                            </div>
                                        </div>

                                        {/* Adicionar Botão à Sequência */}
                                        {showSeqButton ? (
                                            <div className="border rounded-lg p-3 bg-muted/30 space-y-2">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Input
                                                        placeholder="Entrar no Grupo"
                                                        value={newSeqButton.label}
                                                        onChange={(e) => setNewSeqButton(prev => ({ ...prev, label: e.target.value }))}
                                                        className="h-8 text-sm"
                                                    />
                                                    <Input
                                                        placeholder="https://t.me/..."
                                                        value={newSeqButton.url}
                                                        onChange={(e) => setNewSeqButton(prev => ({ ...prev, url: e.target.value }))}
                                                        className="h-8 text-sm"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="sm" onClick={() => addButtonToSequence(activeSequence)}>Adicionar</Button>
                                                    <Button size="sm" variant="ghost" onClick={() => setShowSeqButton(false)}>Cancelar</Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" onClick={() => { }}>
                                                    + Variável
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => setShowSeqButton(true)}>
                                                    Botão
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Botão Salvar */}
                                <div className="pt-4">
                                    <Button className="w-full gap-1" onClick={saveChatbotRule}>
                                        <Save className="w-4 h-4" />
                                        Salvar Regra
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Lista de Regras Salvas */}
                    {chatbotRules.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bot className="w-5 h-5" />
                                    Regras Configuradas
                                    <Badge variant="secondary">{chatbotRules.length}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nome</TableHead>
                                            <TableHead>Aplicar em</TableHead>
                                            <TableHead>Palavras-chave</TableHead>
                                            <TableHead>Sequências</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {chatbotRules.map((rule) => (
                                            <TableRow key={rule.id}>
                                                <TableCell className="font-medium">{rule.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {rule.applyTo === 'private' && 'Privado'}
                                                        {rule.applyTo === 'group' && 'Grupo'}
                                                        {rule.applyTo === 'channel' && 'Canal'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="max-w-[150px] truncate">
                                                    {rule.keywords.join(', ')}
                                                </TableCell>
                                                <TableCell>{rule.sequences.length}</TableCell>
                                                <TableCell>
                                                    <Badge className={rule.active ? 'bg-green-600' : 'bg-gray-600'}>
                                                        {rule.active ? 'Ativo' : 'Inativo'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="text-red-500"
                                                        onClick={() => {
                                                            const updated = chatbotRules.filter(r => r.id !== rule.id);
                                                            setChatbotRules(updated);
                                                            localStorage.setItem('telegram_chatbot_rules', JSON.stringify(updated));
                                                            toast.success("Regra excluída!");
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Tab: Envio no Privado */}
                <TabsContent value="private" className="space-y-6">
                    {/* Banner Informativo */}
                    <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-4 text-white text-center">
                        <p className="text-lg font-medium">
                            📩 Dispare mensagens em massa para os membros do grupo ou para uma lista com seus contatos @usernames.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Coluna 1: Configuração do Disparo */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Configuração do Disparo</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Nome do disparo */}
                                <div className="space-y-2">
                                    <Label className="text-xs">Nome do disparo:</Label>
                                    <Input
                                        placeholder="Mensagem no PV"
                                        value={privateSendConfig.name}
                                        onChange={(e) => setPrivateSendConfig(prev => ({ ...prev, name: e.target.value }))}
                                        className="h-8 text-sm"
                                    />
                                </div>

                                {/* Enviar para membros de */}
                                <div className="space-y-2">
                                    <Label className="text-xs">Enviar mensagens para membros de:</Label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={privateSendConfig.sourceType === 'group'}
                                                onChange={() => setPrivateSendConfig(prev => ({ ...prev, sourceType: 'group' }))}
                                                className="w-3 h-3"
                                            />
                                            <span className="text-xs">Grupo cadastrado</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={privateSendConfig.sourceType === 'audience'}
                                                onChange={() => setPrivateSendConfig(prev => ({ ...prev, sourceType: 'audience' }))}
                                                className="w-3 h-3"
                                            />
                                            <span className="text-xs">Público Salvo</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Selecione grupo/público */}
                                <div className="space-y-2">
                                    <Label className="text-xs">
                                        {privateSendConfig.sourceType === 'group' ? 'Selecione um grupo:' : 'Selecione um público:'}
                                    </Label>
                                    <Select
                                        value={privateSendConfig.sourceId}
                                        onValueChange={(v) => setPrivateSendConfig(prev => ({ ...prev, sourceId: v }))}
                                    >
                                        <SelectTrigger className="h-8 text-sm">
                                            <SelectValue placeholder="Selecione..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {privateSendConfig.sourceType === 'audience'
                                                ? savedAudiences.map(a => (
                                                    <SelectItem key={a.id} value={a.id}>{a.name} ({a.members.length})</SelectItem>
                                                ))
                                                : <SelectItem value="extracted">Membros extraídos ({members.length})</SelectItem>
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Filtros */}
                                <div className="space-y-3 pt-2 border-t">
                                    <Label className="text-xs font-medium">Filtros</Label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={privateSendConfig.filterActive}
                                            onChange={(e) => setPrivateSendConfig(prev => ({ ...prev, filterActive: e.target.checked }))}
                                            className="w-3 h-3"
                                        />
                                        <span className="text-xs">Filtrar membros ativos</span>
                                    </label>

                                    {privateSendConfig.filterActive && (
                                        <>
                                            <div className="flex gap-4 ml-5">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        checked={privateSendConfig.filterBy === 'status'}
                                                        onChange={() => setPrivateSendConfig(prev => ({ ...prev, filterBy: 'status' }))}
                                                        className="w-3 h-3"
                                                    />
                                                    <span className="text-xs">Por status</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        checked={privateSendConfig.filterBy === 'days'}
                                                        onChange={() => setPrivateSendConfig(prev => ({ ...prev, filterBy: 'days' }))}
                                                        className="w-3 h-3"
                                                    />
                                                    <span className="text-xs">Por dias</span>
                                                </label>
                                            </div>

                                            {privateSendConfig.filterBy === 'days' && (
                                                <Select
                                                    value={privateSendConfig.lastSeenDays.toString()}
                                                    onValueChange={(v) => setPrivateSendConfig(prev => ({ ...prev, lastSeenDays: parseInt(v) }))}
                                                >
                                                    <SelectTrigger className="h-8 text-xs ml-5">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="7">Visto na última semana (até 07 dias)</SelectItem>
                                                        <SelectItem value="15">Últimos 15 dias</SelectItem>
                                                        <SelectItem value="30">Últimos 30 dias</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Info extração */}
                                <div className="text-xs text-muted-foreground flex items-center gap-1 pt-2">
                                    <Zap className="w-3 h-3 text-yellow-500" />
                                    Extração padrão: Será realizada uma extração para obter o máximo de membros com Username
                                </div>
                            </CardContent>
                        </Card>

                        {/* Coluna 2: Variações de Mensagem */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Variações de Mensagem</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {/* Tabs de mensagens */}
                                <div className="flex gap-1 flex-wrap">
                                    {privateSendConfig.messages.map((_, index) => (
                                        <Button
                                            key={index}
                                            size="sm"
                                            variant={activeMessageIndex === index ? "default" : "outline"}
                                            onClick={() => setActiveMessageIndex(index)}
                                            className="h-7 text-xs relative"
                                        >
                                            Msg {index + 1}
                                            {privateSendConfig.messages.length > 1 && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); privateRemoveMessageVariation(index); }}
                                                    className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3 text-[8px] flex items-center justify-center"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </Button>
                                    ))}
                                </div>

                                {/* Textarea */}
                                <textarea
                                    className="w-full min-h-[180px] rounded-md border border-input bg-background px-3 py-2 text-xs"
                                    placeholder="Oi, {nome}! Vi que você está no mesmo grupo que eu, {var5}. Passando aqui rapidinho para te dizer que, se estiver buscando uma ferramenta de ENVIO DE MENSAGEM em massa para os membros do seu GRUPO ou CANAL, o BLASTSEND é, sem dúvida, a melhor opção."
                                    value={privateSendConfig.messages[activeMessageIndex] || ''}
                                    onChange={(e) => privateUpdateMessageVariation(activeMessageIndex, e.target.value)}
                                    maxLength={4096}
                                />

                                {/* Info e botões */}
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-muted-foreground">
                                        {(privateSendConfig.messages[activeMessageIndex] || '').length}/4096 caracteres
                                    </span>
                                </div>

                                {/* Botões de ação */}
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => privateInsertVariable('nome')}>
                                        + Variável
                                    </Button>
                                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={privateAddMessageVariation}>
                                        Nova variação
                                    </Button>
                                </div>

                                {/* Dica */}
                                <p className="text-[10px] text-muted-foreground">
                                    💡 Dica: crie variações da mensagem para evitar disparos repetidos
                                </p>
                            </CardContent>
                        </Card>

                        {/* Coluna 3: Contas e Configurações */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Contas & Configurações</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Lista de contas */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-xs">Selecione as contas para disparo:</Label>
                                        <Button size="sm" variant="ghost" className="h-6 text-[10px]" onClick={selectAllAccounts}>
                                            {privateSendConfig.selectedAccounts.length === sessions.length ? 'Desmarcar' : 'Selecionar'} todos
                                        </Button>
                                    </div>
                                    <div className="max-h-[120px] overflow-y-auto border rounded p-2 space-y-1">
                                        {sessions.length === 0 ? (
                                            <p className="text-xs text-muted-foreground text-center py-2">Nenhuma conta conectada</p>
                                        ) : (
                                            sessions.map(session => (
                                                <label key={session.clean_phone} className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1 rounded">
                                                    <input
                                                        type="checkbox"
                                                        checked={privateSendConfig.selectedAccounts.includes(session.clean_phone)}
                                                        onChange={() => toggleAccountSelection(session.clean_phone)}
                                                        className="w-3 h-3"
                                                    />
                                                    <span className="text-xs">{session.formatted_phone || session.phone}</span>
                                                </label>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Intervalo dinâmico */}
                                <div className="space-y-2">
                                    <Label className="text-xs">Intervalo dinâmico entre cada mensagem:</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            value={privateSendConfig.intervalMin}
                                            onChange={(e) => setPrivateSendConfig(prev => ({ ...prev, intervalMin: parseInt(e.target.value) || 0 }))}
                                            className="h-7 w-16 text-xs text-center"
                                        />
                                        <span className="text-xs">à</span>
                                        <Input
                                            type="number"
                                            value={privateSendConfig.intervalMax}
                                            onChange={(e) => setPrivateSendConfig(prev => ({ ...prev, intervalMax: parseInt(e.target.value) || 0 }))}
                                            className="h-7 w-16 text-xs text-center"
                                        />
                                    </div>
                                </div>

                                {/* Limite diário */}
                                <div className="space-y-2">
                                    <Label className="text-xs">Limite de mensagens diárias por conta:</Label>
                                    <Input
                                        type="number"
                                        value={privateSendConfig.dailyLimit}
                                        onChange={(e) => setPrivateSendConfig(prev => ({ ...prev, dailyLimit: parseInt(e.target.value) || 0 }))}
                                        className="h-7 text-xs"
                                    />
                                </div>

                                {/* Ativar agendamento */}
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={privateSendConfig.scheduleEnabled}
                                        onChange={(e) => setPrivateSendConfig(prev => ({ ...prev, scheduleEnabled: e.target.checked }))}
                                        className="w-3 h-3"
                                    />
                                    <span className="text-xs">Ativar agendamento</span>
                                </label>

                                {/* Aviso */}
                                <p className="text-[10px] text-yellow-400 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    O computador precisa estar ligado e conectado durante o horário agendado.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <Button variant="outline" className="gap-1">
                                <Download className="w-4 h-4" />
                                Exportar
                            </Button>
                            <Button variant="outline" className="gap-1">
                                <Upload className="w-4 h-4" />
                                Importar
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="gap-1">
                                <Play className="w-4 h-4" />
                                Enviar agora
                            </Button>
                            <Button className="gap-1">
                                <Save className="w-4 h-4" />
                                Salvar
                            </Button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Saved Audiences Section */}
            <Card className="border-dashed">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <FolderOpen className="w-5 h-5" />
                                Públicos Salvos
                                {savedAudiences.length > 0 && (
                                    <Badge variant="secondary">{savedAudiences.length}</Badge>
                                )}
                            </CardTitle>
                            <CardDescription>
                                Reutilize extrações salvas anteriormente
                            </CardDescription>
                        </div>
                        {members.length > 0 && (
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Nome do público..."
                                    value={audienceName}
                                    onChange={(e) => setAudienceName(e.target.value)}
                                    className="w-48"
                                />
                                <Button onClick={handleSaveAudience} variant="outline" className="gap-2">
                                    <Save className="w-4 h-4" />
                                    Salvar
                                </Button>
                            </div>
                        )}
                    </div>
                </CardHeader>
                {savedAudiences.length > 0 && (
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {savedAudiences.map((audience) => (
                                <div key={audience.id} className="border rounded-lg p-4 space-y-3 bg-muted/30">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-sm">{audience.name}</h4>
                                        <Badge variant="outline">{audience.totalMembers}</Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground space-y-1">
                                        <p>📅 {new Date(audience.createdAt).toLocaleDateString('pt-BR')}</p>
                                        <p>📂 {audience.source}</p>
                                        <p>✓ {audience.withUsername} com username | 📞 {audience.withPhone} com telefone</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleLoadAudience(audience)}
                                            className="flex-1"
                                        >
                                            <Download className="w-3 h-3 mr-1" />
                                            Carregar
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-red-500"
                                            onClick={() => handleDeleteAudience(audience.id)}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Phase 2: Bulk Send Section */}
            {members.length > 0 && selectedCount > 0 && (
                <Card className="border-blue-800/50 bg-blue-950/10">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Send className="w-5 h-5" />
                                    Envio no Privado
                                    <Badge className="bg-blue-600">{selectedCount} selecionados</Badge>
                                </CardTitle>
                                <CardDescription>
                                    Envie mensagens privadas para os membros selecionados
                                </CardDescription>
                            </div>
                            <Button
                                variant={showBulkSend ? "secondary" : "default"}
                                onClick={() => setShowBulkSend(!showBulkSend)}
                            >
                                {showBulkSend ? "Fechar" : "Configurar Envio"}
                            </Button>
                        </div>
                    </CardHeader>

                    {showBulkSend && (
                        <CardContent className="space-y-6">
                            {/* Message Variations */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-base font-medium">Variações de Mensagem (Anti-Bloqueio)</Label>
                                    <Button size="sm" variant="outline" onClick={addMessageVariation}>
                                        + Adicionar Variação
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Variáveis disponíveis: {"{nome}"}, {"{sobrenome}"}, {"{username}"}, {"{id}"}
                                </p>
                                {bulkSendConfig.messages.map((msg, index) => (
                                    <div key={index} className="flex gap-2">
                                        <textarea
                                            className="flex-1 min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            placeholder={`Mensagem ${index + 1}...`}
                                            value={msg}
                                            onChange={(e) => updateMessageVariation(index, e.target.value)}
                                        />
                                        {bulkSendConfig.messages.length > 1 && (
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-red-500"
                                                onClick={() => removeMessageVariation(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Send Configuration */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                                <div className="space-y-2">
                                    <Label>Intervalo Mín (seg)</Label>
                                    <Input
                                        type="number"
                                        value={bulkSendConfig.intervalMin}
                                        onChange={(e) => setBulkSendConfig(prev => ({ ...prev, intervalMin: parseInt(e.target.value) || 30 }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Intervalo Máx (seg)</Label>
                                    <Input
                                        type="number"
                                        value={bulkSendConfig.intervalMax}
                                        onChange={(e) => setBulkSendConfig(prev => ({ ...prev, intervalMax: parseInt(e.target.value) || 60 }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Limite Diário/Conta</Label>
                                    <Input
                                        type="number"
                                        value={bulkSendConfig.dailyLimit}
                                        onChange={(e) => setBulkSendConfig(prev => ({ ...prev, dailyLimit: parseInt(e.target.value) || 50 }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Contas</Label>
                                    <Select
                                        value={bulkSendConfig.useAllAccounts ? "all" : "selected"}
                                        onValueChange={(v) => setBulkSendConfig(prev => ({ ...prev, useAllAccounts: v === "all" }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Usar Todas ({sessions.filter(s => !s.is_restricted).length})</SelectItem>
                                            <SelectItem value="selected">Apenas Selecionada</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Send Progress */}
                            {isSending && (
                                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Enviando...</span>
                                        <Button size="sm" variant="destructive" onClick={handleStopSending}>
                                            Parar
                                        </Button>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-3">
                                        <div
                                            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                                            style={{ width: `${(sendProgress.current / sendProgress.total) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>{sendProgress.current} / {sendProgress.total}</span>
                                        <span className="text-green-400">✓ {sendProgress.success}</span>
                                        <span className="text-red-400">✗ {sendProgress.failed}</span>
                                    </div>
                                </div>
                            )}

                            {/* Send Logs */}
                            {sendLogs.length > 0 && (
                                <div className="max-h-[200px] overflow-auto bg-gray-900 rounded-lg p-3 font-mono text-xs">
                                    {sendLogs.slice(-20).map((log, i) => (
                                        <div key={i} className={`py-1 ${log.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                            [{log.time}] {log.user}: {log.status === 'success' ? '✓ Enviado' : `✗ ${log.message}`}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Send Button */}
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button variant="outline" onClick={() => setShowBulkSend(false)}>
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleBulkSend}
                                    disabled={isSending || selectedCount === 0}
                                    className="gap-2"
                                >
                                    {isSending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Iniciar Envio ({selectedCount})
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    )}
                </Card>
            )}

            {/* Import Config - Always visible when there are members */}
            {members.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Configurações de Importação</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Member Statistics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-950/30 border border-blue-800/50 rounded-lg p-4 text-center">
                                <p className="text-2xl font-bold text-blue-400">{members.length}</p>
                                <p className="text-xs text-muted-foreground">Total Extraídos</p>
                            </div>
                            <div className="bg-green-950/30 border border-green-800/50 rounded-lg p-4 text-center">
                                <p className="text-2xl font-bold text-green-400">{members.filter(m => m.username).length}</p>
                                <p className="text-xs text-muted-foreground">Com Username ✓</p>
                            </div>
                            <div className="bg-yellow-950/30 border border-yellow-800/50 rounded-lg p-4 text-center">
                                <p className="text-2xl font-bold text-yellow-400">{members.filter(m => !m.username).length}</p>
                                <p className="text-xs text-muted-foreground">Sem Username</p>
                            </div>
                            <div className="bg-purple-950/30 border border-purple-800/50 rounded-lg p-4 text-center">
                                <p className="text-2xl font-bold text-purple-400">{members.filter(m => m.phone).length}</p>
                                <p className="text-xs text-muted-foreground">Com Telefone</p>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="text-sm font-medium mb-4">Configurações Padrão</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Plano Padrão</Label>
                                    <Select
                                        value={importConfig.defaultPlan}
                                        onValueChange={(v) => setImportConfig(prev => ({ ...prev, defaultPlan: v }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Mensal">Mensal</SelectItem>
                                            <SelectItem value="Trimestral">Trimestral</SelectItem>
                                            <SelectItem value="Semestral">Semestral</SelectItem>
                                            <SelectItem value="Anual">Anual</SelectItem>
                                            <SelectItem value="Vitalício">Vitalício</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Status Padrão</Label>
                                    <Select
                                        value={importConfig.defaultStatus}
                                        onValueChange={(v) => setImportConfig(prev => ({ ...prev, defaultStatus: v }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Ativo">Ativo</SelectItem>
                                            <SelectItem value="Inativo">Inativo</SelectItem>
                                            <SelectItem value="Pendente">Pendente</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Servidor</Label>
                                    <Input
                                        placeholder="Ex: server1.exemplo.com"
                                        value={importConfig.defaultServer}
                                        onChange={(e) => setImportConfig(prev => ({ ...prev, defaultServer: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Members Table - Always visible when there are members */}
            {members.length > 0 && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Membros Encontrados
                                <Badge variant="secondary">{filteredMembers.length}</Badge>
                                {memberFilter !== 'all' && (
                                    <Badge variant="outline" className="text-xs">
                                        Filtrado de {members.length}
                                    </Badge>
                                )}
                            </CardTitle>
                            <CardDescription>
                                {selectedCount} de {filteredMembers.length} selecionados
                            </CardDescription>
                        </div>

                        <div className="flex gap-2 items-center">
                            {/* Filter Dropdown */}
                            <Select value={memberFilter} onValueChange={(v: typeof memberFilter) => setMemberFilter(v)}>
                                <SelectTrigger className="w-40">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="with_username">Com Username</SelectItem>
                                    <SelectItem value="without_username">Sem Username</SelectItem>
                                    <SelectItem value="with_phone">Com Telefone</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button variant="outline" size="sm" onClick={() => toggleAll(true)}>
                                Selecionar Todos
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => toggleAll(false)}>
                                Desmarcar Todos
                            </Button>
                            <Button variant="secondary" size="sm" onClick={handleExportCSV}>
                                <Download className="w-4 h-4 mr-1" />
                                Exportar CSV
                            </Button>
                            <Button variant="destructive" size="sm" onClick={handleClear}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-[400px] overflow-auto rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={selectedCount === filteredMembers.length}
                                                onCheckedChange={(checked) => toggleAll(!!checked)}
                                            />
                                        </TableHead>
                                        <TableHead>Username</TableHead>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Telefone</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMembers.map((member) => (
                                        <TableRow key={member.id} className={member.selected ? '' : 'opacity-50'}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={member.selected}
                                                    onCheckedChange={() => toggleMember(member.id)}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {member.username ? `@${member.username}` : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {`${member.firstName} ${member.lastName}`.trim() || '-'}
                                            </TableCell>
                                            <TableCell>{member.phone || '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Import Button */}
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                {selectedCount} membro(s) será(ão) importado(s)
                            </div>
                            <Button
                                onClick={handleImport}
                                disabled={isLoading || selectedCount === 0}
                                className="bg-gradient-to-r from-blue-600 to-purple-600"
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                {isLoading ? 'Importando...' : `Importar ${selectedCount} Cliente(s)`}
                            </Button>
                        </div>

                        {/* Import Results */}
                        {importResults && (
                            <div className="mt-4 p-4 rounded-lg bg-muted/50 space-y-2">
                                <h4 className="font-medium">Resultado da Importação</h4>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2 text-green-500">
                                        <CheckCircle className="w-4 h-4" />
                                        {importResults.success} sucesso
                                    </div>
                                    <div className="flex items-center gap-2 text-red-500">
                                        <XCircle className="w-4 h-4" />
                                        {importResults.failed} falha(s)
                                    </div>
                                </div>
                                {importResults.errors.length > 0 && (
                                    <div className="text-sm text-red-400 mt-2">
                                        <p className="font-medium">Erros:</p>
                                        <ul className="list-disc list-inside">
                                            {importResults.errors.slice(0, 5).map((err, i) => (
                                                <li key={i}>{err}</li>
                                            ))}
                                            {importResults.errors.length > 5 && (
                                                <li>... e mais {importResults.errors.length - 5} erros</li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )
            }
        </div >
    );
}
