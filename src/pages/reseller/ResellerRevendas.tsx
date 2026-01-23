import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Plus, Search, Edit, Trash2, Eye, Store, CheckCircle, Shield, Calendar } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Interface for Reseller (same as Admin)
interface Reseller {
    id: string | number;
    username: string;
    password?: string;
    force_password_change: boolean;
    permission: 'subreseller'; // Resellers can only create subresellers
    credits: number;
    servers?: string;
    master_reseller?: string;
    disable_login_days: number;
    monthly_reseller: boolean;
    personal_name?: string;
    email?: string;
    telegram?: string;
    whatsapp?: string;
    observations?: string;
    status: string;
    created_at?: string;
}

export default function ResellerRevendas() {
    const { theme, currentPlan } = useOutletContext<{ theme: any, currentPlan: string }>();

    // States
    const [revendas, setRevendas] = useState<Reseller[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Dialog States
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isAddingReseller, setIsAddingReseller] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // Form State
    const [newReseller, setNewReseller] = useState({
        username: "",
        password: "",
        force_password_change: false,
        permission: "subreseller", // Fixed
        credits: 10,
        servers: "",
        master_reseller: "", // Will be auto-filled
        disable_login_days: 0,
        monthly_reseller: false,
        personal_name: "",
        email: "",
        telegram: "",
        whatsapp: "",
        observations: ""
    });

    // Fetch Sub-Resellers
    const fetchRevendas = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('supabase.auth.token')
                ? JSON.parse(localStorage.getItem('supabase.auth.token')!).currentSession.access_token
                : null;

            if (!token) throw new Error("Não autenticado");

            const response = await fetch('/api/resellers/sub-resellers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setRevendas(Array.isArray(data) ? data : []);
                setError(null);
            } else {
                const err = await response.json() as any;
                throw new Error(err.error || "Erro ao buscar revendas");
            }
        } catch (err) {
            console.error(err);
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRevendas();
    }, []);

    // Create Reseller
    const handleAddRevenda = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setIsAddingReseller(true);

        try {
            const token = localStorage.getItem('supabase.auth.token')
                ? JSON.parse(localStorage.getItem('supabase.auth.token')!).currentSession.access_token
                : null;

            const response = await fetch('/api/resellers/sub-resellers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newReseller)
            });

            if (response.ok) {
                toast.success("Sub-revenda criada com sucesso!");
                setIsAddDialogOpen(false);
                fetchRevendas();
                // Reset form
                setNewReseller({
                    username: "",
                    password: "",
                    force_password_change: false,
                    permission: "subreseller",
                    credits: 10,
                    servers: "",
                    master_reseller: "",
                    disable_login_days: 0,
                    monthly_reseller: false,
                    personal_name: "",
                    email: "",
                    telegram: "",
                    whatsapp: "",
                    observations: ""
                });
            } else {
                const data = await response.json() as any;
                setFormError(data.error || "Erro ao criar revenda");
                toast.error(data.error || "Erro ao criar revenda");
            }
        } catch (err) {
            setFormError((err as Error).message);
            toast.error("Erro desconhecido ao criar revenda");
        } finally {
            setIsAddingReseller(false);
        }
    };

    const filteredRevendas = revendas.filter(r =>
        r.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.personal_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Helpers
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Ativo": case "active": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "Inativo": case "inactive": return "bg-red-500/10 text-red-500 border-red-500/20";
            default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Store className={cn("w-6 h-6", theme.color)} />
                        Minhas Revendas
                    </h1>
                    <p className="text-muted-foreground">
                        Gerencie seus sub-revendedores e acompanhe o desempenho.
                    </p>
                </div>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className={cn("text-white shadow-md transition-all", theme.gradient.includes('from') ? `bg-gradient-to-r ${theme.gradient}` : "bg-primary")}>
                            <Plus className="w-4 h-4 mr-2" />
                            Nova Revenda
                        </Button>
                    </DialogTrigger>
                    <DialogContent className={cn("max-w-4xl w-full p-0 overflow-hidden border bg-[#1a1d24]", theme.borderColor)}>
                        <div className="flex flex-col h-[90vh]">
                            {/* Header */}
                            <div className={cn("p-6 border-b", theme.borderColor)}>
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                        <Plus className={cn("w-6 h-6", theme.color)} />
                                        Criar Nova Sub-Revenda
                                    </DialogTitle>
                                    <DialogDescription>
                                        Preencha os dados abaixo para cadastrar um novo sub-revendedor vinculado à sua conta.
                                    </DialogDescription>
                                </DialogHeader>
                            </div>

                            {/* Form */}
                            <div className="flex-1 overflow-y-auto p-6 bg-[#14161b]">
                                <form onSubmit={handleAddRevenda} className="space-y-6">
                                    {formError && (
                                        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200 flex items-center gap-2">
                                            <Shield className="w-4 h-4" />
                                            {formError}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="modal-username" className="text-sm font-medium">
                                                Usuário <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="modal-username"
                                                className={cn("bg-[#1f2229] border-gray-700/50 focus:border-opacity-100 transition-colors", `focus:border-${theme.color.split('-')[1]}-500/50`)}
                                                placeholder="Ex: joaosilva"
                                                value={newReseller.username}
                                                onChange={(e) => setNewReseller({ ...newReseller, username: e.target.value })}
                                                required
                                            />
                                            <div className="text-xs text-muted-foreground">
                                                Mínimo 6 caracteres, apenas letras e números.
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="modal-password" data-id="password-label" className="text-sm font-medium">
                                                Senha <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="modal-password"
                                                type="password"
                                                className="bg-[#1f2229] border-gray-700/50"
                                                placeholder="••••••••"
                                                value={newReseller.password}
                                                onChange={(e) => setNewReseller({ ...newReseller, password: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="forcePasswordChange"
                                            className={cn("rounded bg-[#1f2229] border-gray-700 text-primary focus:ring-offset-0", `text-${theme.color.split('-')[1]}-500`)}
                                            checked={newReseller.force_password_change}
                                            onChange={(e) => setNewReseller({ ...newReseller, force_password_change: e.target.checked })}
                                        />
                                        <Label htmlFor="forcePasswordChange" className="text-sm font-normal text-gray-400">
                                            Forçar troca de senha no próximo login
                                        </Label>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-800">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">
                                                Permissão
                                            </Label>
                                            <div className="px-3 py-2 rounded-md bg-gray-800/50 border border-gray-700 text-gray-400 text-sm">
                                                Sub-Revendedor (Padrão)
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">
                                                Créditos Iniciais
                                            </Label>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-9 w-9 border-gray-700 bg-[#1f2229]"
                                                    onClick={() => setNewReseller({ ...newReseller, credits: Math.max(0, newReseller.credits - 10) })}
                                                >
                                                    -
                                                </Button>
                                                <Input
                                                    type="number"
                                                    className="bg-[#1f2229] border-gray-700/50 text-center"
                                                    value={newReseller.credits}
                                                    onChange={(e) => setNewReseller({ ...newReseller, credits: parseInt(e.target.value) || 0 })}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-9 w-9 border-gray-700 bg-[#1f2229]"
                                                    onClick={() => setNewReseller({ ...newReseller, credits: newReseller.credits + 10 })}
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-gray-800">
                                        <h3 className={cn("text-base font-medium flex items-center gap-2", theme.color)}>
                                            <Users className="w-4 h-4" />
                                            Informações Pessoais (Opcional)
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>Nome Completo</Label>
                                                <Input
                                                    className="bg-[#1f2229] border-gray-700/50"
                                                    placeholder="Nome do cliente"
                                                    value={newReseller.personal_name}
                                                    onChange={(e) => setNewReseller({ ...newReseller, personal_name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Email</Label>
                                                <Input
                                                    className="bg-[#1f2229] border-gray-700/50"
                                                    placeholder="cliente@email.com"
                                                    value={newReseller.email}
                                                    onChange={(e) => setNewReseller({ ...newReseller, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>WhatsApp</Label>
                                                <Input
                                                    className="bg-[#1f2229] border-gray-700/50"
                                                    placeholder="(11) 99999-9999"
                                                    value={newReseller.whatsapp}
                                                    onChange={(e) => setNewReseller({ ...newReseller, whatsapp: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 flex justify-end gap-3 border-t border-gray-800 bg-[#14161b] sticky bottom-0">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsAddDialogOpen(false)}
                                            className="border-gray-700 hover:bg-gray-800 text-gray-300"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isAddingReseller}
                                            className={cn("text-white min-w-[120px]", theme.gradient.includes('from') ? `bg-gradient-to-r ${theme.gradient}` : "bg-primary")}
                                        >
                                            {isAddingReseller ? "Criando..." : "Criar Revenda"}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className={cn("bg-card/50 border shadow-sm", theme.borderColor)}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Sub-Revendas</CardTitle>
                        <Store className={cn("h-4 w-4", theme.color)} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{revendas.length}</div>
                    </CardContent>
                </Card>
                <Card className={cn("bg-card/50 border shadow-sm", theme.borderColor)}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revendas Ativas</CardTitle>
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{revendas.filter(r => r.status === 'active' || r.status === 'Ativo').length}</div>
                    </CardContent>
                </Card>
                <Card className={cn("bg-card/50 border shadow-sm", theme.borderColor)}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Última Criação</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium text-muted-foreground">
                            {revendas.length > 0 ? new Date(revendas[revendas.length - 1].created_at || Date.now()).toLocaleDateString() : "-"}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* List */}
            <Card className="bg-card/50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Meus Sub-revendedores</CardTitle>
                            <CardDescription>
                                Lista de todos os revendedores gerenciados por você.
                            </CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar revendedor..."
                                className="pl-8 bg-background/50 border-gray-700"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredRevendas.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
                            <div className={cn("p-4 rounded-full mb-4", theme.lightColor)}>
                                <Users className={cn("w-8 h-8 opacity-50", theme.color)} />
                            </div>
                            <p>Nenhuma revenda encontrada.</p>
                            <p className="text-sm">Clique em "Nova Revenda" para começar a expandir seu negócio.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Usuário</TableHead>
                                    <TableHead>Créditos</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Criado em</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRevendas.map((revenda) => (
                                    <TableRow key={revenda.id}>
                                        <TableCell>
                                            <div className="font-medium">{revenda.username}</div>
                                            <div className="text-xs text-muted-foreground">{revenda.email}</div>
                                        </TableCell>
                                        <TableCell>{revenda.credits}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getStatusColor(revenda.status)}>
                                                {revenda.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {revenda.created_at && new Date(revenda.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <Edit className="w-4 h-4 text-muted-foreground" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
