import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Server, AppWindow, Edit, Trash2, Settings, Search, Power, PowerOff, RefreshCw, HardDrive, Cpu, MemoryStick, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { useServers, Servidor } from '@/hooks/useServers';
import { useApplications, Aplicativo } from '@/hooks/useApplications';


export default function AdminAplicativos() {
    const [activeTab, setActiveTab] = useState('servidor');
    const [busca, setBusca] = useState("");

    const { servers: servidores, addServer, updateServer, deleteServer } = useServers();
    const { applications: aplicativos, addApplication, updateApplication, deleteApplication } = useApplications();

    // Modal states
    const [modalNovoServidor, setModalNovoServidor] = useState(false);
    const [modalNovoAplicativo, setModalNovoAplicativo] = useState(false);
    const [modalEditarServidor, setModalEditarServidor] = useState<Servidor | null>(null);
    const [modalEditarAplicativo, setModalEditarAplicativo] = useState<Aplicativo | null>(null);
    const [modalExcluirServidor, setModalExcluirServidor] = useState<Servidor | null>(null);
    const [modalExcluirAplicativo, setModalExcluirAplicativo] = useState<Aplicativo | null>(null);

    // Form states for new servidor
    const [novoServidor, setNovoServidor] = useState({
        nome: '',
        ip: '',
        porta: '',
        tipo: '',
    });

    // Form states for new aplicativo
    const [novoAplicativo, setNovoAplicativo] = useState({
        nome: '',
        versao: '',
        servidor: '',
        tipo: '',
    });

    // Filtered data
    const servidoresFiltrados = servidores.filter(s =>
        s.nome.toLowerCase().includes(busca.toLowerCase()) ||
        s.ip.toLowerCase().includes(busca.toLowerCase())
    );

    const aplicativosFiltrados = aplicativos.filter(a =>
        a.nome.toLowerCase().includes(busca.toLowerCase()) ||
        a.servidor.toLowerCase().includes(busca.toLowerCase())
    );

    // Handlers
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
            cpu: 0,
            memoria: 0,
            disco: 0,
            ultimaAtualizacao: new Date().toLocaleDateString('pt-BR'),
        });

        if (sucesso) {
            setNovoServidor({ nome: '', ip: '', porta: '', tipo: '' });
            setModalNovoServidor(false);
        }
    };

    const handleAdicionarAplicativo = async () => {
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

    const handleExcluirServidor = async () => {
        if (modalExcluirServidor) {
            const sucesso = await deleteServer(modalExcluirServidor.id);
            if (sucesso) {
                setModalExcluirServidor(null);
            }
        }
    };

    const handleExcluirAplicativo = async () => {
        if (modalExcluirAplicativo) {
            const sucesso = await deleteApplication(modalExcluirAplicativo.id);
            if (sucesso) {
                setModalExcluirAplicativo(null);
            }
        }
    };

    const handleSalvarEdicaoServidor = async () => {
        if (!modalEditarServidor) return;

        const sucesso = await updateServer(modalEditarServidor.id, modalEditarServidor);
        if (sucesso) {
            setModalEditarServidor(null);
        }
    };

    const handleSalvarEdicaoAplicativo = async () => {
        if (!modalEditarAplicativo) return;

        const sucesso = await updateApplication(modalEditarAplicativo.id, modalEditarAplicativo);
        if (sucesso) {
            setModalEditarAplicativo(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online':
            case 'ativo':
                return 'bg-green-700 text-green-200';
            case 'offline':
            case 'inativo':
                return 'bg-red-700 text-red-200';
            case 'manutencao':
            case 'atualizando':
                return 'bg-yellow-700 text-yellow-200';
            default:
                return 'bg-gray-700 text-gray-200';
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
        <div className="p-6 min-h-screen bg-background transition-colors duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <AppWindow className="w-7 h-7 text-purple-400" />
                        <h1 className="text-3xl font-bold text-white">Aplicativos</h1>
                    </div>
                    <p className="text-gray-400">Gerencie seus servidores e aplicativos</p>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-2 bg-[#1f2937]">
                    <TabsTrigger value="servidor" className="data-[state=active]:bg-purple-700 data-[state=active]:text-white">
                        <Server className="w-4 h-4 mr-2" />
                        Servidor
                    </TabsTrigger>
                    <TabsTrigger value="aplicativos" className="data-[state=active]:bg-purple-700 data-[state=active]:text-white">
                        <AppWindow className="w-4 h-4 mr-2" />
                        Aplicativos
                    </TabsTrigger>
                </TabsList>

                {/* Tab Servidor */}
                <TabsContent value="servidor" className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-700/40">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
                                    <Power className="w-4 h-4" />
                                    Online
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-400">
                                    {servidores.filter(s => s.status === 'online').length}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-red-900/50 to-red-800/30 border border-red-700/40">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
                                    <PowerOff className="w-4 h-4" />
                                    Offline
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-400">
                                    {servidores.filter(s => s.status === 'offline').length}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border border-yellow-700/40">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
                                    <Settings className="w-4 h-4" />
                                    Manutenção
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-400">
                                    {servidores.filter(s => s.status === 'manutencao').length}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-700/40">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
                                    <Server className="w-4 h-4" />
                                    Total
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-400">
                                    {servidores.length}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search and Add Button */}
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <div className="flex-1 flex items-center bg-[#1f2937] rounded-lg px-3">
                            <Search className="w-5 h-5 text-gray-400 mr-2" />
                            <Input
                                placeholder="Buscar por nome ou IP..."
                                className="bg-transparent border-none text-white focus:ring-0"
                                value={busca}
                                onChange={e => setBusca(e.target.value)}
                            />
                        </div>
                        <Button
                            className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white"
                            onClick={() => setModalNovoServidor(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Servidor
                        </Button>
                    </div>

                    {/* Servers Table */}
                    <Card className="bg-[#1f2937] border border-purple-700/40">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">Lista de Servidores ({servidoresFiltrados.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            {servidoresFiltrados.length === 0 ? (
                                <div className="text-center py-12">
                                    <Server className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                                    <p className="text-gray-400 text-lg mb-2">Nenhum servidor cadastrado</p>
                                    <p className="text-gray-500 text-sm mb-4">Adicione seu primeiro servidor para começar</p>
                                    <Button
                                        className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white"
                                        onClick={() => setModalNovoServidor(true)}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Adicionar Servidor
                                    </Button>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nome</TableHead>
                                            <TableHead>IP</TableHead>
                                            <TableHead>Porta</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>CPU</TableHead>
                                            <TableHead>Memória</TableHead>
                                            <TableHead>Disco</TableHead>
                                            <TableHead>Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {servidoresFiltrados.map(servidor => (
                                            <TableRow key={servidor.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                                            <Server className="w-4 h-4" />
                                                        </div>
                                                        <span className="font-semibold text-white">{servidor.nome}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-300">{servidor.ip}</TableCell>
                                                <TableCell className="text-gray-300">{servidor.porta}</TableCell>
                                                <TableCell className="text-gray-300">{servidor.tipo}</TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusColor(servidor.status)}>
                                                        {getStatusLabel(servidor.status)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-gray-300">{servidor.cpu}%</TableCell>
                                                <TableCell className="text-gray-300">{servidor.memoria}%</TableCell>
                                                <TableCell className="text-gray-300">{servidor.disco}%</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button size="icon" variant="ghost" onClick={() => setModalEditarServidor(servidor)}>
                                                            <Edit className="w-4 h-4 text-yellow-400" />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" onClick={() => setModalExcluirServidor(servidor)}>
                                                            <Trash2 className="w-4 h-4 text-red-400" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab Aplicativos */}
                <TabsContent value="aplicativos" className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-700/40">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
                                    <Power className="w-4 h-4" />
                                    Ativos
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-400">
                                    {aplicativos.filter(a => a.status === 'ativo').length}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-red-900/50 to-red-800/30 border border-red-700/40">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
                                    <PowerOff className="w-4 h-4" />
                                    Inativos
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-400">
                                    {aplicativos.filter(a => a.status === 'inativo').length}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border border-yellow-700/40">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4" />
                                    Atualizando
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-400">
                                    {aplicativos.filter(a => a.status === 'atualizando').length}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-700/40">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
                                    <AppWindow className="w-4 h-4" />
                                    Total
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-400">
                                    {aplicativos.length}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search and Add Button */}
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <div className="flex-1 flex items-center bg-[#1f2937] rounded-lg px-3">
                            <Search className="w-5 h-5 text-gray-400 mr-2" />
                            <Input
                                placeholder="Buscar por nome ou servidor..."
                                className="bg-transparent border-none text-white focus:ring-0"
                                value={busca}
                                onChange={e => setBusca(e.target.value)}
                            />
                        </div>
                        <Button
                            className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white"
                            onClick={() => setModalNovoAplicativo(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Aplicativos
                        </Button>
                    </div>

                    {/* Applications Table */}
                    <Card className="bg-[#1f2937] border border-purple-700/40">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">Lista de Aplicativos ({aplicativosFiltrados.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            {aplicativosFiltrados.length === 0 ? (
                                <div className="text-center py-12">
                                    <AppWindow className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                                    <p className="text-gray-400 text-lg mb-2">Nenhum aplicativo cadastrado</p>
                                    <p className="text-gray-500 text-sm mb-4">Adicione seu primeiro aplicativo para começar</p>
                                    <Button
                                        className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white"
                                        onClick={() => setModalNovoAplicativo(true)}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Adicionar Aplicativos
                                    </Button>
                                </div>
                            ) : (
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
                                        {aplicativosFiltrados.map(aplicativo => (
                                            <TableRow key={aplicativo.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                                            <AppWindow className="w-4 h-4" />
                                                        </div>
                                                        <span className="font-semibold text-white">{aplicativo.nome}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-300">{aplicativo.versao}</TableCell>
                                                <TableCell className="text-gray-300">{aplicativo.servidor}</TableCell>
                                                <TableCell className="text-gray-300">{aplicativo.tipo}</TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusColor(aplicativo.status)}>
                                                        {getStatusLabel(aplicativo.status)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-gray-300">{aplicativo.usuarios}</TableCell>
                                                <TableCell className="text-gray-300">{aplicativo.ultimaAtualizacao}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button size="icon" variant="ghost" onClick={() => setModalEditarAplicativo(aplicativo)}>
                                                            <Edit className="w-4 h-4 text-yellow-400" />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" onClick={() => setModalExcluirAplicativo(aplicativo)}>
                                                            <Trash2 className="w-4 h-4 text-red-400" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Modal Novo Servidor */}
            <Dialog open={modalNovoServidor} onOpenChange={setModalNovoServidor}>
                <DialogContent className="bg-[#1f2937] border border-purple-700/40 text-white max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Server className="w-5 h-5 text-purple-400" />
                            Adicionar Servidor
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Preencha os dados do novo servidor
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Nome do Servidor *</label>
                            <Input
                                placeholder="Ex: Servidor Principal"
                                className="bg-[#23272f] border-gray-600 text-white"
                                value={novoServidor.nome}
                                onChange={e => setNovoServidor({ ...novoServidor, nome: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Endereço IP *</label>
                                <Input
                                    placeholder="Ex: 192.168.1.1"
                                    className="bg-[#23272f] border-gray-600 text-white"
                                    value={novoServidor.ip}
                                    onChange={e => setNovoServidor({ ...novoServidor, ip: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Porta *</label>
                                <Input
                                    placeholder="Ex: 8080"
                                    type="number"
                                    className="bg-[#23272f] border-gray-600 text-white"
                                    value={novoServidor.porta}
                                    onChange={e => setNovoServidor({ ...novoServidor, porta: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Tipo *</label>
                            <Select value={novoServidor.tipo} onValueChange={value => setNovoServidor({ ...novoServidor, tipo: value })}>
                                <SelectTrigger className="bg-[#23272f] border-gray-600 text-white">
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#23272f] border-gray-600">
                                    <SelectItem value="VPS">VPS</SelectItem>
                                    <SelectItem value="Dedicado">Dedicado</SelectItem>
                                    <SelectItem value="Cloud">Cloud</SelectItem>
                                    <SelectItem value="Local">Local</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="border-gray-600 text-gray-400 hover:text-white" onClick={() => setModalNovoServidor(false)}>
                            Cancelar
                        </Button>
                        <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white" onClick={handleAdicionarServidor}>
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Novo Aplicativo */}
            <Dialog open={modalNovoAplicativo} onOpenChange={setModalNovoAplicativo}>
                <DialogContent className="bg-[#1f2937] border border-purple-700/40 text-white max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <AppWindow className="w-5 h-5 text-purple-400" />
                            Adicionar Aplicativo
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Preencha os dados do novo aplicativo
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Nome do Aplicativo *</label>
                            <Input
                                placeholder="Ex: BootFlow App"
                                className="bg-[#23272f] border-gray-600 text-white"
                                value={novoAplicativo.nome}
                                onChange={e => setNovoAplicativo({ ...novoAplicativo, nome: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Versão *</label>
                                <Input
                                    placeholder="Ex: 1.0.0"
                                    className="bg-[#23272f] border-gray-600 text-white"
                                    value={novoAplicativo.versao}
                                    onChange={e => setNovoAplicativo({ ...novoAplicativo, versao: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Servidor *</label>
                                <Select value={novoAplicativo.servidor} onValueChange={value => setNovoAplicativo({ ...novoAplicativo, servidor: value })}>
                                    <SelectTrigger className="bg-[#23272f] border-gray-600 text-white">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#23272f] border-gray-600">
                                        {servidores.length === 0 ? (
                                            <SelectItem value="none" disabled>Nenhum servidor disponível</SelectItem>
                                        ) : (
                                            servidores.map(s => (
                                                <SelectItem key={s.id} value={s.nome}>{s.nome}</SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Tipo *</label>
                            <Select value={novoAplicativo.tipo} onValueChange={value => setNovoAplicativo({ ...novoAplicativo, tipo: value })}>
                                <SelectTrigger className="bg-[#23272f] border-gray-600 text-white">
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#23272f] border-gray-600">
                                    <SelectItem value="Web">Web</SelectItem>
                                    <SelectItem value="Mobile">Mobile</SelectItem>
                                    <SelectItem value="Desktop">Desktop</SelectItem>
                                    <SelectItem value="API">API</SelectItem>
                                    <SelectItem value="Bot">Bot</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="border-gray-600 text-gray-400 hover:text-white" onClick={() => setModalNovoAplicativo(false)}>
                            Cancelar
                        </Button>
                        <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white" onClick={handleAdicionarAplicativo}>
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Editar Servidor */}
            <Dialog open={!!modalEditarServidor} onOpenChange={(open) => !open && setModalEditarServidor(null)}>
                <DialogContent className="bg-[#1f2937] border border-purple-700/40 text-white max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Edit className="w-5 h-5 text-purple-400" />
                            Editar Servidor
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Atualize os dados do servidor
                        </DialogDescription>
                    </DialogHeader>
                    {modalEditarServidor && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Nome do Servidor *</label>
                                <Input
                                    className="bg-[#23272f] border-gray-600 text-white"
                                    value={modalEditarServidor.nome}
                                    onChange={e => setModalEditarServidor({ ...modalEditarServidor, nome: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Endereço IP *</label>
                                    <Input
                                        className="bg-[#23272f] border-gray-600 text-white"
                                        value={modalEditarServidor.ip}
                                        onChange={e => setModalEditarServidor({ ...modalEditarServidor, ip: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Porta *</label>
                                    <Input
                                        type="number"
                                        className="bg-[#23272f] border-gray-600 text-white"
                                        value={modalEditarServidor.porta}
                                        onChange={e => setModalEditarServidor({ ...modalEditarServidor, porta: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Tipo *</label>
                                    <Select value={modalEditarServidor.tipo} onValueChange={value => setModalEditarServidor({ ...modalEditarServidor, tipo: value })}>
                                        <SelectTrigger className="bg-[#23272f] border-gray-600 text-white">
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#23272f] border-gray-600">
                                            <SelectItem value="VPS">VPS</SelectItem>
                                            <SelectItem value="Dedicado">Dedicado</SelectItem>
                                            <SelectItem value="Cloud">Cloud</SelectItem>
                                            <SelectItem value="Local">Local</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Status *</label>
                                    <Select value={modalEditarServidor.status} onValueChange={value => setModalEditarServidor({ ...modalEditarServidor, status: value as 'online' | 'offline' | 'manutencao' })}>
                                        <SelectTrigger className="bg-[#23272f] border-gray-600 text-white">
                                            <SelectValue placeholder="Selecione o status" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#23272f] border-gray-600">
                                            <SelectItem value="online">Online</SelectItem>
                                            <SelectItem value="offline">Offline</SelectItem>
                                            <SelectItem value="manutencao">Manutenção</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" className="border-gray-600 text-gray-400 hover:text-white" onClick={() => setModalEditarServidor(null)}>
                            Cancelar
                        </Button>
                        <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white" onClick={handleSalvarEdicaoServidor}>
                            Salvar Alterações
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Editar Aplicativo */}
            <Dialog open={!!modalEditarAplicativo} onOpenChange={(open) => !open && setModalEditarAplicativo(null)}>
                <DialogContent className="bg-[#1f2937] border border-purple-700/40 text-white max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Edit className="w-5 h-5 text-purple-400" />
                            Editar Aplicativo
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Atualize os dados do aplicativo
                        </DialogDescription>
                    </DialogHeader>
                    {modalEditarAplicativo && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Nome do Aplicativo *</label>
                                <Input
                                    className="bg-[#23272f] border-gray-600 text-white"
                                    value={modalEditarAplicativo.nome}
                                    onChange={e => setModalEditarAplicativo({ ...modalEditarAplicativo, nome: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Versão *</label>
                                    <Input
                                        className="bg-[#23272f] border-gray-600 text-white"
                                        value={modalEditarAplicativo.versao}
                                        onChange={e => setModalEditarAplicativo({ ...modalEditarAplicativo, versao: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Servidor *</label>
                                    <Select value={modalEditarAplicativo.servidor} onValueChange={value => setModalEditarAplicativo({ ...modalEditarAplicativo, servidor: value })}>
                                        <SelectTrigger className="bg-[#23272f] border-gray-600 text-white">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#23272f] border-gray-600">
                                            {servidores.map(s => (
                                                <SelectItem key={s.id} value={s.nome}>{s.nome}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Tipo *</label>
                                    <Select value={modalEditarAplicativo.tipo} onValueChange={value => setModalEditarAplicativo({ ...modalEditarAplicativo, tipo: value })}>
                                        <SelectTrigger className="bg-[#23272f] border-gray-600 text-white">
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#23272f] border-gray-600">
                                            <SelectItem value="Web">Web</SelectItem>
                                            <SelectItem value="Mobile">Mobile</SelectItem>
                                            <SelectItem value="Desktop">Desktop</SelectItem>
                                            <SelectItem value="API">API</SelectItem>
                                            <SelectItem value="Bot">Bot</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Status *</label>
                                    <Select value={modalEditarAplicativo.status} onValueChange={value => setModalEditarAplicativo({ ...modalEditarAplicativo, status: value as 'ativo' | 'inativo' | 'atualizando' })}>
                                        <SelectTrigger className="bg-[#23272f] border-gray-600 text-white">
                                            <SelectValue placeholder="Selecione o status" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#23272f] border-gray-600">
                                            <SelectItem value="ativo">Ativo</SelectItem>
                                            <SelectItem value="inativo">Inativo</SelectItem>
                                            <SelectItem value="atualizando">Atualizando</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" className="border-gray-600 text-gray-400 hover:text-white" onClick={() => setModalEditarAplicativo(null)}>
                            Cancelar
                        </Button>
                        <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white" onClick={handleSalvarEdicaoAplicativo}>
                            Salvar Alterações
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Excluir Servidor */}
            <Dialog open={!!modalExcluirServidor} onOpenChange={() => setModalExcluirServidor(null)}>
                <DialogContent className="bg-[#1f2937] border border-red-700/40 text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-red-400">Excluir Servidor</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Tem certeza que deseja excluir o servidor "{modalExcluirServidor?.nome}"? Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" className="border-gray-600 text-gray-400 hover:text-white" onClick={() => setModalExcluirServidor(null)}>
                            Cancelar
                        </Button>
                        <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleExcluirServidor}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Excluir Aplicativo */}
            <Dialog open={!!modalExcluirAplicativo} onOpenChange={() => setModalExcluirAplicativo(null)}>
                <DialogContent className="bg-[#1f2937] border border-red-700/40 text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-red-400">Excluir Aplicativo</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Tem certeza que deseja excluir o aplicativo "{modalExcluirAplicativo?.nome}"? Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" className="border-gray-600 text-gray-400 hover:text-white" onClick={() => setModalExcluirAplicativo(null)}>
                            Cancelar
                        </Button>
                        <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleExcluirAplicativo}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
