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
    Edit,
    Trash2,
    UserPlus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Cliente {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    plano: string;
    status: "ativo" | "inativo" | "pendente";
    dataExpiracao: string;
    criadoEm: string;
}

export default function ResellerClientes() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newCliente, setNewCliente] = useState({
        nome: "",
        email: "",
        telefone: "",
        plano: "básico",
    });

    const filteredClientes = clientes.filter(
        (c) =>
            c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddCliente = () => {
        if (!newCliente.nome || !newCliente.email) {
            toast.error("Nome e email são obrigatórios");
            return;
        }

        const novoCliente: Cliente = {
            id: Date.now(),
            nome: newCliente.nome,
            email: newCliente.email,
            telefone: newCliente.telefone,
            plano: newCliente.plano,
            status: "pendente",
            dataExpiracao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            criadoEm: new Date().toISOString(),
        };

        setClientes([...clientes, novoCliente]);
        setNewCliente({ nome: "", email: "", telefone: "", plano: "básico" });
        setIsAddModalOpen(false);
        toast.success("Cliente adicionado com sucesso!");
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "ativo":
                return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Ativo</Badge>;
            case "inativo":
                return <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30">Inativo</Badge>;
            case "pendente":
                return <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30">Pendente</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Users className="w-6 h-6 text-green-500" />
                        Meus Clientes
                    </h1>
                    <p className="text-muted-foreground">
                        Gerencie seus clientes e suas assinaturas
                    </p>
                </div>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Novo Cliente
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                            <DialogDescription>
                                Preencha os dados do cliente para cadastrá-lo
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="nome">Nome Completo *</Label>
                                <Input
                                    id="nome"
                                    placeholder="João da Silva"
                                    value={newCliente.nome}
                                    onChange={(e) => setNewCliente({ ...newCliente, nome: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="joao@email.com"
                                    value={newCliente.email}
                                    onChange={(e) => setNewCliente({ ...newCliente, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="telefone">Telefone/WhatsApp</Label>
                                <Input
                                    id="telefone"
                                    placeholder="(11) 99999-9999"
                                    value={newCliente.telefone}
                                    onChange={(e) => setNewCliente({ ...newCliente, telefone: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                                Cancelar
                            </Button>
                            <Button className="bg-green-600 hover:bg-green-700" onClick={handleAddCliente}>
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
                <Card className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{clientes.length}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{clientes.filter(c => c.status === 'ativo').length}</p>
                        <p className="text-xs text-muted-foreground">Ativos</p>
                    </div>
                </Card>
            </div>

            {/* Clients Table */}
            <Card>
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
                                className="bg-green-600 hover:bg-green-700"
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
                                        <TableHead>E-mail</TableHead>
                                        <TableHead>Telefone</TableHead>
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
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-3 h-3 text-muted-foreground" />
                                                    {cliente.email}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-3 h-3 text-muted-foreground" />
                                                    {cliente.telefone || "-"}
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
