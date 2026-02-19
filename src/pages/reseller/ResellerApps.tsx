import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Server, AppWindow, Edit, Trash2, Settings, Search, Power, PowerOff, RefreshCw, Smartphone, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useServers, Servidor } from '@/hooks/useServers';
import { useApplications, Aplicativo } from '@/hooks/useApplications';
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Theme {
    color: string;
    lightColor: string;
    borderColor: string;
    gradient: string;
}

export default function ResellerApps() {
    const { theme } = useOutletContext<{ theme: Theme }>();
    const [activeTab, setActiveTab] = useState('servidor');
    const [busca, setBusca] = useState("");

    // Hook Data
    const { servers: servidores, addServer, updateServer, deleteServer } = useServers();
    const { applications: aplicativos, addApplication, updateApplication, deleteApplication } = useApplications();

    // Modal states
    const [modalNovoServidor, setModalNovoServidor] = useState(false);
    const [modalNovoAplicativo, setModalNovoAplicativo] = useState(false);
    const [modalEditarServidor, setModalEditarServidor] = useState<Servidor | null>(null);
    const [modalEditarAplicativo, setModalEditarAplicativo] = useState<Aplicativo | null>(null);
    const [modalExcluirServidor, setModalExcluirServidor] = useState<Servidor | null>(null);
    const [modalExcluirAplicativo, setModalExcluirAplicativo] = useState<Aplicativo | null>(null);

    // Form states
    const [novoServidor, setNovoServidor] = useState({ nome: '', ip: '', porta: '', tipo: '' });
    const [novoAplicativo, setNovoAplicativo] = useState({ nome: '', versao: '', servidor: '', tipo: '' });

    // Filtered data
    const servidoresFiltrados = servidores.filter(s =>
        s.nome.toLowerCase().includes(busca.toLowerCase()) ||
        s.ip.toLowerCase().includes(busca.toLowerCase())
    );

    const aplicativosFiltrados = aplicativos.filter(a =>
        a.nome.toLowerCase().includes(busca.toLowerCase()) ||
        a.servidor.toLowerCase().includes(busca.toLowerCase())
    );

    // Reuse Handlers or adapted for Reseller (assuming API works)
    const handleAdicionarServidor = async () => {
        if (!novoServidor.nome || !novoServidor.ip || !novoServidor.porta || !novoServidor.tipo) {
            toast.error('Preencha todos os campos obrigatórios');
            return;
        }
        const sucesso = await addServer({
            nome: novoServidor.nome,
            ip: novoServidor.ip,
            porta: parseInt(novoServidor.porta),
            status: 'offline',
            tipo: novoServidor.tipo,
            cpu: 0, memoria: 0, disco: 0,
            ultimaAtualizacao: new Date().toLocaleDateString('pt-BR'),
        });
        if (sucesso) {
            setNovoServidor({ nome: '', ip: '', porta: '', tipo: '' });
            setModalNovoServidor(false);
        }
    };

    const handleAdicionarAplicativo = async () => {
        // Logic for "Solicitar" could be here, but let's try direct implementation first
        if (!novoAplicativo.nome || !novoAplicativo.versao || !novoAplicativo.servidor || !novoAplicativo.tipo) {
            toast.error('Preencha todos os campos obrigatórios');
            return;
        }

        const sucesso = await addApplication({
            nome: novoAplicativo.nome,
            versao: novoAplicativo.versao,
            servidor: novoAplicativo.servidor,
            status: 'inativo',
            tipo: novoAplicativo.tipo,
            usuarios: 0,
            ultimaAtualizacao: new Date().toLocaleDateString('pt-BR'),
        });

        if (sucesso) {
            setNovoAplicativo({ nome: '', versao: '', servidor: '', tipo: '' });
            setModalNovoAplicativo(false);
        }
    };

    // Helper functions for styles
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': case 'ativo': return 'bg-green-700/80 text-green-100 hover:bg-green-700';
            case 'offline': case 'inativo': return 'bg-red-700/80 text-red-100 hover:bg-red-700';
            case 'manutencao': case 'atualizando': return 'bg-yellow-700/80 text-yellow-100 hover:bg-yellow-700';
            default: return 'bg-gray-700 text-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'online': return 'Online';
            case 'offline': return 'Offline';
            case 'manutencao': return 'Manutenção';
            case 'ativo': return 'Ativo';
            case 'inativo': return 'Inativo';
            case 'atualizando': return 'Atualizando';
            default: return status;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className={cn("text-2xl font-bold flex items-center gap-2", theme.color)}>
                        <Smartphone className="w-6 h-6" />
                        Meus Aplicativos
                    </h1>
                    <p className="text-muted-foreground">
                        Gerencie seus servidores e aplicativos personalizados.
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1">
                    <TabsTrigger value="servidor" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <Server className={cn("w-4 h-4 mr-2", activeTab === 'servidor' && theme.color)} />
                        Servidor
                    </TabsTrigger>
                    <TabsTrigger value="aplicativos" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <AppWindow className={cn("w-4 h-4 mr-2", activeTab === 'aplicativos' && theme.color)} />
                        Aplicativos
                    </TabsTrigger>
                </TabsList>

                {/* --- Tab Servidor --- */}
                <TabsContent value="servidor" className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-700/30">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Power className="w-4 h-4" /> Online
                                </CardTitle>
                            </CardHeader>
                            <CardContent><div className="text-2xl font-bold text-green-500">{servidores.filter(s => s.status === 'online').length}</div></CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-700/30">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                                    <PowerOff className="w-4 h-4" /> Offline
                                </CardTitle>
                            </CardHeader>
                            <CardContent><div className="text-2xl font-bold text-red-500">{servidores.filter(s => s.status === 'offline').length}</div></CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border-yellow-700/30">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Settings className="w-4 h-4" /> Manutenção
                                </CardTitle>
                            </CardHeader>
                            <CardContent><div className="text-2xl font-bold text-yellow-500">{servidores.filter(s => s.status === 'manutencao').length}</div></CardContent>
                        </Card>
                        <Card className={cn("bg-gradient-to-br from-primary/10 to-primary/5", theme.borderColor)}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Server className="w-4 h-4" /> Total
                                </CardTitle>
                            </CardHeader>
                            <CardContent><div className={cn("text-2xl font-bold", theme.color)}>{servidores.length}</div></CardContent>
                        </Card>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <div className="flex-1 flex items-center bg-muted/50 rounded-md px-3 border border-input focus-within:ring-1 focus-within:ring-ring">
                            <Search className="w-5 h-5 text-muted-foreground mr-2" />
                            <Input
                                placeholder="Buscar por nome ou IP..."
                                className="bg-transparent border-none focus-visible:ring-0 shadow-none h-10"
                                value={busca}
                                onChange={e => setBusca(e.target.value)}
                            />
                        </div>
                        <Button className={cn("text-white", theme.gradient.includes('from') ? `bg-gradient-to-r ${theme.gradient}` : "bg-primary")} onClick={() => setModalNovoServidor(true)}>
                            <Plus className="w-4 h-4 mr-2" /> Adicionar Servidor
                        </Button>
                    </div>

                    {/* Table */}
                    <Card className="border shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Lista de Servidores ({servidoresFiltrados.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>IP</TableHead>
                                        <TableHead>Porta</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {servidoresFiltrados.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nenhum servidor encontrado.</TableCell>
                                        </TableRow>
                                    ) : servidoresFiltrados.map(servidor => (
                                        <TableRow key={servidor.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white font-bold", theme.gradient.includes('from') ? `bg-gradient-to-r ${theme.gradient}` : "bg-primary")}>
                                                        <Server className="w-4 h-4" />
                                                    </div>
                                                    {servidor.nome}
                                                </div>
                                            </TableCell>
                                            <TableCell>{servidor.ip}</TableCell>
                                            <TableCell>{servidor.porta}</TableCell>
                                            <TableCell>{servidor.tipo}</TableCell>
                                            <TableCell><Badge className={getStatusColor(servidor.status)}>{getStatusLabel(servidor.status)}</Badge></TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-100/10" onClick={() => setModalEditarServidor(servidor)}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100/10" onClick={() => setModalExcluirServidor(servidor)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- Tab Aplicativos --- */}
                <TabsContent value="aplicativos" className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-700/30">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><Power className="w-4 h-4" /> Ativos</CardTitle>
                            </CardHeader>
                            <CardContent><div className="text-2xl font-bold text-green-500">{aplicativos.filter(a => a.status === 'ativo').length}</div></CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-700/30">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><PowerOff className="w-4 h-4" /> Inativos</CardTitle>
                            </CardHeader>
                            <CardContent><div className="text-2xl font-bold text-red-500">{aplicativos.filter(a => a.status === 'inativo').length}</div></CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border-yellow-700/30">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Atualizando</CardTitle>
                            </CardHeader>
                            <CardContent><div className="text-2xl font-bold text-yellow-500">{aplicativos.filter(a => a.status === 'atualizando').length}</div></CardContent>
                        </Card>
                        <Card className={cn("bg-gradient-to-br from-primary/10 to-primary/5", theme.borderColor)}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><AppWindow className="w-4 h-4" /> Total</CardTitle>
                            </CardHeader>
                            <CardContent><div className={cn("text-2xl font-bold", theme.color)}>{aplicativos.length}</div></CardContent>
                        </Card>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <div className="flex-1 flex items-center bg-muted/50 rounded-md px-3 border border-input focus-within:ring-1 focus-within:ring-ring">
                            <Search className="w-5 h-5 text-muted-foreground mr-2" />
                            <Input
                                placeholder="Buscar por nome ou servidor..."
                                className="bg-transparent border-none focus-visible:ring-0 shadow-none h-10"
                                value={busca}
                                onChange={e => setBusca(e.target.value)}
                            />
                        </div>
                        <Button className={cn("text-white", theme.gradient.includes('from') ? `bg-gradient-to-r ${theme.gradient}` : "bg-primary")} onClick={() => setModalNovoAplicativo(true)}>
                            <Plus className="w-4 h-4 mr-2" /> Solicitar Aplicativo
                        </Button>
                    </div>

                    {/* Table */}
                    <Card className="border shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Lista de Aplicativos ({aplicativosFiltrados.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Versão</TableHead>
                                        <TableHead>Servidor</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Usuários</TableHead>
                                        <TableHead>Última Atualização</TableHead>
                                        <TableHead>Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {aplicativosFiltrados.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Nenhum aplicativo encontrado.</TableCell>
                                        </TableRow>
                                    ) : aplicativosFiltrados.map(app => (
                                        <TableRow key={app.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white font-bold", theme.gradient.includes('from') ? `bg-gradient-to-r ${theme.gradient}` : "bg-primary")}>
                                                        <AppWindow className="w-4 h-4" />
                                                    </div>
                                                    {app.nome}
                                                </div>
                                            </TableCell>
                                            <TableCell>{app.versao}</TableCell>
                                            <TableCell>{app.servidor}</TableCell>
                                            <TableCell>{app.tipo}</TableCell>
                                            <TableCell><Badge className={getStatusColor(app.status)}>{getStatusLabel(app.status)}</Badge></TableCell>
                                            <TableCell>{app.usuarios}</TableCell>
                                            <TableCell>{app.ultimaAtualizacao}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-100/10" onClick={() => setModalEditarAplicativo(app)}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100/10" onClick={() => setModalExcluirAplicativo(app)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Modals (Simplified for Layout purposes) */}
            <Dialog open={modalNovoServidor} onOpenChange={setModalNovoServidor}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Servidor</DialogTitle>
                        <DialogDescription>Cadastre um novo servidor para seus aplicativos.</DialogDescription>
                    </DialogHeader>
                    {/* Simplified Form */}
                    <div className="space-y-4 py-4">
                        <Input placeholder="Nome" value={novoServidor.nome} onChange={e => setNovoServidor({ ...novoServidor, nome: e.target.value })} />
                        <Input placeholder="IP" value={novoServidor.ip} onChange={e => setNovoServidor({ ...novoServidor, ip: e.target.value })} />
                        <div className="flex gap-2">
                            <Input placeholder="Porta" className="w-1/3" value={novoServidor.porta} onChange={e => setNovoServidor({ ...novoServidor, porta: e.target.value })} />
                            <Select onValueChange={v => setNovoServidor({ ...novoServidor, tipo: v })}>
                                <SelectTrigger className="w-2/3"><SelectValue placeholder="Tipo" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="VPS">VPS</SelectItem>
                                    <SelectItem value="Dedicado">Dedicado</SelectItem>
                                    <SelectItem value="Local">Local</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setModalNovoServidor(false)}>Cancelar</Button>
                        <Button onClick={handleAdicionarServidor}>Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={modalNovoAplicativo} onOpenChange={setModalNovoAplicativo}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Solicitar/Adicionar Aplicativo</DialogTitle>
                        <DialogDescription>Configure um novo aplicativo..</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Input placeholder="Nome do App" value={novoAplicativo.nome} onChange={e => setNovoAplicativo({ ...novoAplicativo, nome: e.target.value })} />
                        <Input placeholder="Versão (ex: 1.0.0)" value={novoAplicativo.versao} onChange={e => setNovoAplicativo({ ...novoAplicativo, versao: e.target.value })} />
                        <Select onValueChange={v => setNovoAplicativo({ ...novoAplicativo, servidor: v })}>
                            <SelectTrigger><SelectValue placeholder="Servidor" /></SelectTrigger>
                            <SelectContent>
                                {servidores.map(s => <SelectItem key={s.id} value={s.nome}>{s.nome}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select onValueChange={v => setNovoAplicativo({ ...novoAplicativo, tipo: v })}>
                            <SelectTrigger><SelectValue placeholder="Tipo (Web, Mobile...)" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Mobile">Mobile Android</SelectItem>
                                <SelectItem value="Web">Web Player</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="w-full" onClick={() => window.open('https://wa.me/5511999999999', '_blank')}>
                            <MessageCircle className="w-4 h-4 mr-2" /> Solicitar via WhatsApp
                        </Button>
                        <Button onClick={handleAdicionarAplicativo}>Adicionar Manualmente</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
