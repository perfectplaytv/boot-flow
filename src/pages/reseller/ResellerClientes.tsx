import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Users,
    Plus,
    Search,
    MoreVertical,
    Mail,
    Phone,
    Calendar,
    UserPlus,
    Upload,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Theme {
    color: string;
    lightColor: string;
    borderColor: string;
    gradient: string;
}

interface Cliente {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    plano: string;
    status: "ativo" | "inativo" | "pendente" | "suspenso";
    dataExpiracao: string;
    criadoEm: string;
    servidor?: string;
}

export default function ResellerClientes() {
    const { theme } = useOutletContext<{ theme: Theme }>();
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Estado completo para novo cliente
    const [newCliente, setNewCliente] = useState({
        nome: "",
        email: "",
        telefone: "",
        plano: "",
        status: "Ativo",
        dataExpiracao: "",
        servidor: "",
        dispositivos: 1,
        creditos: 0,
        senha: "",
        bouquets: "",
        nomeReal: "",
        telegram: "",
        observacoes: "",
        notas: "",
        m3uUrl: ""
    });

    const filteredClientes = clientes.filter(
        (c) =>
            c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fetchClientes = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) return;

            const response = await fetch('/api/resellers/clients', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const data: any[] = await response.json();

                // Map backend data to frontend interface
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const mappedClientes: Cliente[] = data.map((item: any) => ({
                    id: item.id,
                    nome: item.name,
                    email: item.email,
                    telefone: item.whatsapp || item.phone || "",
                    plano: item.plan,
                    status: item.status?.toLowerCase() || "ativo",
                    dataExpiracao: item.expiration_date,
                    criadoEm: item.created_at,
                    servidor: item.server
                }));
                setClientes(mappedClientes);
            }
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
            toast.error("Erro ao carregar lista de clientes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const handleAddCliente = async () => {
        if (!newCliente.nome || !newCliente.email || !newCliente.plano || !newCliente.servidor || !newCliente.dataExpiracao) {
            toast.error("Preencha todos os campos obrigatórios (*)");
            return;
        }

        const token = localStorage.getItem('auth_token');
        if (!token) {
            toast.error("Sessão expirada. Faça login novamente.");
            return;
        }

        const toastId = toast.loading("Adicionando cliente...");

        try {
            const response = await fetch('/api/resellers/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newCliente)
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = await response.json() as any;

            if (!response.ok) {
                throw new Error(data.error || "Erro ao adicionar cliente");
            }

            toast.dismiss(toastId);
            toast.success("Cliente adicionado com sucesso!");

            // Refresh list
            fetchClientes();

            // Reset form
            setNewCliente({
                nome: "", email: "", telefone: "", plano: "", status: "Ativo",
                dataExpiracao: "", servidor: "", dispositivos: 1, creditos: 0,
                senha: "", bouquets: "", nomeReal: "", telegram: "", observacoes: "",
                notas: "", m3uUrl: ""
            });
            setIsAddModalOpen(false);

        } catch (error) {
            toast.dismiss(toastId);
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Erro ao salvar cliente");
        }
    };

    const handleExtractM3U = async () => {
        if (!newCliente.m3uUrl) {
            toast.error("Insira uma URL M3U válida");
            return;
        }

        const toastId = toast.loading("Extraindo dados da lista...");

        try {
            // Extrair credenciais da URL
            const urlObj = new URL(newCliente.m3uUrl);
            const username = urlObj.searchParams.get("username") || "";
            const password = urlObj.searchParams.get("password") || "";
            const baseUrl = `${urlObj.protocol}//${urlObj.host}`;

            if (!username || !password) {
                throw new Error("Credenciais não encontradas na URL (username/password).");
            }

            // Construir URLs da API
            const apiUrl = `${baseUrl}/player_api.php?username=${username}&password=${password}`;
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(apiUrl)}`;

            const response = await fetch(proxyUrl);
            if (!response.ok) throw new Error(`Erro ao acessar: ${response.status}`);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any = await response.json();

            if (!data.user_info) {
                throw new Error("Dados inválidos retornados pelo servidor.");
            }

            // Formatar data de expiração (timestamp -> YYYY-MM-DD)
            const expDate = data.user_info.exp_date
                ? new Date(parseInt(data.user_info.exp_date) * 1000).toISOString().split("T")[0]
                : "";

            // Atualizar formulário com dados reais
            setNewCliente(prev => ({
                ...prev,
                nome: data.user_info.username,
                email: `${data.user_info.username}@iptv.com`, // Email placeholder
                senha: password, // Usa a senha real do M3U
                plano: data.user_info.is_trial === "1" ? "Trial" : "Premium",
                status: data.user_info.status === "Active" ? "Ativo" : "Inativo",
                dataExpiracao: expDate,
                dispositivos: parseInt(data.user_info.max_connections) || 1,
                servidor: baseUrl,
                observacoes: `Importado via M3U em ${new Date().toLocaleDateString()}`
            }));

            toast.dismiss(toastId);
            toast.success("Dados extraídos com sucesso!");

        } catch (error) {
            console.error("Erro M3U:", error);
            toast.dismiss(toastId);
            toast.error(error instanceof Error ? error.message : "Erro ao extrair dados");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "ativo":
                return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">Ativo</Badge>;
            case "inativo":
                return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20">Inativo</Badge>;
            case "pendente":
                return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20">Pendente</Badge>;
            case "suspenso":
                return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20">Suspenso</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className={cn("text-2xl font-bold flex items-center gap-2", theme.color)}>
                        <Users className="w-6 h-6" />
                        Meus Clientes
                    </h1>
                    <p className="text-muted-foreground">
                        Gerencie seus clientes e suas assinaturas
                    </p>
                </div>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button className={cn("text-white shadow-md transition-all duration-200", theme.gradient.includes('from') ? `bg-gradient-to-r ${theme.gradient}` : "bg-primary")}>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Novo Cliente
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className={cn("text-2xl font-bold", theme.color)}>Adicionar um Cliente</DialogTitle>
                            <DialogDescription>
                                Preencha os dados completos do cliente
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex items-center gap-2 mb-4">
                            <span className={cn("text-xs font-medium", theme.color)}>• Campos obrigatórios marcados com *</span>
                            <span className="text-muted-foreground text-xs font-medium">• Dados serão sincronizados automaticamente</span>
                        </div>

                        {/* Extração M3U */}
                        <div className={cn("bg-muted/30 border rounded-lg p-4 mb-6", theme.borderColor)}>
                            <div className="flex items-center justify-between mb-2">
                                <span className={cn("font-medium flex items-center gap-2", theme.color)}>
                                    <Upload className="w-4 h-4" />
                                    Extração M3U
                                </span>
                                <Button
                                    size="sm"
                                    className={cn("text-white", theme.gradient.includes('from') ? `bg-gradient-to-r ${theme.gradient}` : "bg-primary")}
                                    onClick={handleExtractM3U}
                                >
                                    Extrair
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">Serve para importar dados automaticamente a partir de uma URL.</p>
                            <Input
                                className={cn("bg-background", theme.borderColor)}
                                placeholder="Insira a URL do M3U para extrair automaticamente os dados do cliente..."
                                value={newCliente.m3uUrl}
                                onChange={(e) => setNewCliente({ ...newCliente, m3uUrl: e.target.value })}
                            />
                        </div>

                        {/* Informações Básicas */}
                        <div className="bg-card border rounded-lg p-4 mb-6">
                            <span className="block font-semibold mb-4">Informações Básicas</span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <Label className="block mb-1 font-medium">Servidor *</Label>
                                    <Input
                                        placeholder="Digite o nome do servidor"
                                        value={newCliente.servidor}
                                        onChange={(e) => setNewCliente({ ...newCliente, servidor: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Label className="block mb-1 font-medium">Plano *</Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={newCliente.plano}
                                        onChange={(e) => setNewCliente({ ...newCliente, plano: e.target.value })}
                                    >
                                        <option value="">Selecione um plano</option>
                                        <option value="Mensal">Mensal</option>
                                        <option value="Bimestral">Bimestral</option>
                                        <option value="Trimestral">Trimestral</option>
                                        <option value="Semestral">Semestral</option>
                                        <option value="Anual">Anual</option>
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <Label className="block mb-1 font-medium">Nome *</Label>
                                    <Input
                                        placeholder="Nome completo do cliente"
                                        value={newCliente.nome}
                                        onChange={(e) => setNewCliente({ ...newCliente, nome: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Label className="block mb-1 font-medium">Email *</Label>
                                    <Input
                                        placeholder="email@exemplo.com"
                                        value={newCliente.email}
                                        onChange={(e) => setNewCliente({ ...newCliente, email: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Label className="block mb-1 font-medium">Status *</Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={newCliente.status}
                                        onChange={(e) => setNewCliente({ ...newCliente, status: e.target.value })}
                                    >
                                        <option value="Ativo">Ativo</option>
                                        <option value="Inativo">Inativo</option>
                                        <option value="Suspenso">Suspenso</option>
                                        <option value="Pendente">Pendente</option>
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <Label className="block mb-1 font-medium">Data de Expiração *</Label>
                                    <Input
                                        type="date"
                                        value={newCliente.dataExpiracao}
                                        onChange={(e) => setNewCliente({ ...newCliente, dataExpiracao: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Configuração de Serviço */}
                        <div className="bg-card border rounded-lg p-4 mb-6">
                            <span className="block font-semibold mb-4">Configuração de Serviço</span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <Label className="block mb-1 font-medium">Dispositivos</Label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={newCliente.dispositivos}
                                        onChange={(e) => setNewCliente({ ...newCliente, dispositivos: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Label className="block mb-1 font-medium">Créditos</Label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={newCliente.creditos}
                                        onChange={(e) => setNewCliente({ ...newCliente, creditos: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Label className="block mb-1 font-medium">Senha</Label>
                                    <Input
                                        placeholder="Senha do cliente"
                                        value={newCliente.senha}
                                        onChange={(e) => setNewCliente({ ...newCliente, senha: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Label className="block mb-1 font-medium">Bouquets</Label>
                                    <Input
                                        placeholder="Bouquets disponíveis"
                                        value={newCliente.bouquets}
                                        onChange={(e) => setNewCliente({ ...newCliente, bouquets: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Informações Adicionais */}
                        <div className="bg-card border rounded-lg p-4 mb-6">
                            <span className="block font-semibold mb-4">Informações Adicionais</span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <Label className="block mb-1 font-medium">Nome Real</Label>
                                    <Input
                                        placeholder="Nome real do cliente"
                                        value={newCliente.nomeReal}
                                        onChange={(e) => setNewCliente({ ...newCliente, nomeReal: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Label className="block mb-1 font-medium">WhatsApp</Label>
                                    <Input
                                        placeholder="+55 (11) 99999-9999"
                                        value={newCliente.telefone}
                                        onChange={(e) => setNewCliente({ ...newCliente, telefone: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Label className="block mb-1 font-medium">Telegram</Label>
                                    <Input
                                        placeholder="@username"
                                        value={newCliente.telegram}
                                        onChange={(e) => setNewCliente({ ...newCliente, telegram: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Label className="block mb-1 font-medium">Observações</Label>
                                    <Input
                                        placeholder="Observações sobre o cliente"
                                        value={newCliente.observacoes}
                                        onChange={(e) => setNewCliente({ ...newCliente, observacoes: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label className="block mb-1 font-medium">Notas</Label>
                                    <Textarea
                                        placeholder="Notas adicionais sobre o cliente..."
                                        className="resize-none"
                                        rows={3}
                                        value={newCliente.notas}
                                        onChange={(e) => setNewCliente({ ...newCliente, notas: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                                Cancelar
                            </Button>
                            <Button className={cn("text-white", theme.gradient.includes('from') ? `bg-gradient-to-r ${theme.gradient}` : "bg-primary")} onClick={handleAddCliente}>
                                Adicionar Cliente
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search and Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar clientes..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <Card className={cn("p-4 flex items-center gap-4 border shadow-sm", theme.borderColor)}>
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", theme.lightColor)}>
                        <Users className={cn("w-5 h-5", theme.color)} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{clientes.length}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                </Card>
                <Card className={cn("p-4 flex items-center gap-4 border shadow-sm", theme.borderColor)}>
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", theme.lightColor)}>
                        <Users className={cn("w-5 h-5", theme.color)} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{clientes.filter(c => c.status === 'ativo').length}</p>
                        <p className="text-xs text-muted-foreground">Ativos</p>
                    </div>
                </Card>
            </div>

            {/* Clients Table */}
            <Card className={cn("border shadow-sm", theme.borderColor)}>
                <CardHeader>
                    <CardTitle>Lista de Clientes</CardTitle>
                    <CardDescription>
                        {clientes.length === 0
                            ? "Você ainda não tem clientes cadastrados"
                            : `${filteredClientes.length} cliente(s) encontrado(s)`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {clientes.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                                <Users className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Nenhum cliente ainda</h3>
                            <p className="text-muted-foreground mb-4">
                                Comece adicionando seu primeiro cliente
                            </p>
                            <Button
                                className={cn("text-white", theme.gradient.includes('from') ? `bg-gradient-to-r ${theme.gradient}` : "bg-primary")}
                                onClick={() => setIsAddModalOpen(true)}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Adicionar Cliente
                            </Button>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Plano/Servidor</TableHead>
                                        <TableHead>E-mail/Telefone</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Expira em</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredClientes.map((cliente) => (
                                        <TableRow key={cliente.id}>
                                            <TableCell className="font-medium">{cliente.nome}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">{cliente.plano}</span>
                                                    <span className="text-xs text-muted-foreground">{cliente.servidor || 'Padrão'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1 text-xs">
                                                        <Mail className="w-3 h-3 text-muted-foreground" />
                                                        {cliente.email}
                                                    </div>
                                                    {cliente.telefone && (
                                                        <div className="flex items-center gap-1 text-xs">
                                                            <Phone className="w-3 h-3 text-muted-foreground" />
                                                            {cliente.telefone}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(cliente.status)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3 h-3 text-muted-foreground" />
                                                    {new Date(cliente.dataExpiracao).toLocaleDateString("pt-BR")}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
