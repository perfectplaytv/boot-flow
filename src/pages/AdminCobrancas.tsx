import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Calendar, Plus, Search, Filter, Edit, Trash2, Eye, Copy, Mail, MessageSquare, BarChart3 } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import type { User } from '@/hooks/useUsers';

interface Cobranca {
  id: number;
  cliente: string;
  email: string;
  descricao: string;
  valor: number;
  vencimento: string;
  status: 'Pendente' | 'Vencida' | 'Paga';
}

// Gerar cobranças baseadas nos usuários
const generateCobrancasFromUsers = (users: User[]): Cobranca[] => {
  return users.map((user, index) => {
    const statuses: ('Pendente' | 'Vencida' | 'Paga')[] = ['Pendente', 'Vencida', 'Paga'];
    const descricoes = [
      'Renovação Básico - Plano Mensal',
      'Cobrança Básico - Mensal',
      'Serviço Básico - Renovação',
      'Manutenção Básico - Mensal',
      'Upgrade Mensal - Básico',
      'Cobrança Básico - Anual'
    ];
    
    // Gerar data de vencimento baseada no índice
    const hoje = new Date();
    const vencimento = new Date(hoje);
    vencimento.setDate(hoje.getDate() + (index * 7) + Math.floor(Math.random() * 30));
    
    return {
      id: user.id,
      cliente: user.name,
      email: user.email,
      descricao: descricoes[index % descricoes.length],
      valor: Math.floor(Math.random() * 50) + 90, // Valor entre 90 e 140
      vencimento: vencimento.toLocaleDateString('pt-BR'),
      status: statuses[index % statuses.length]
    };
  });
};

export default function AdminCobrancas() {
  const { users, getActiveUsers } = useUsers();
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([]);

  // Gerar cobranças quando os usuários carregarem
  useEffect(() => {
    if (users.length > 0) {
      setCobrancas(generateCobrancasFromUsers(users));
    }
  }, [users]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string | null>(null);
  const [modalNova, setModalNova] = useState(false);
  const [modalVisualizar, setModalVisualizar] = useState<Cobranca | null>(null);
  const [modalEditar, setModalEditar] = useState<Cobranca | null>(null);
  const [modalExcluir, setModalExcluir] = useState<Cobranca | null>(null);
  const [modalCopia, setModalCopia] = useState<Cobranca | null>(null);
  const [modalEmail, setModalEmail] = useState<Cobranca | null>(null);
  const [modalWhats, setModalWhats] = useState<Cobranca | null>(null);
  const [nova, setNova] = useState({ 
    cliente: '', 
    nomeCliente: '', 
    email: '', 
    telefone: '', 
    descricao: '', 
    valor: '', 
    status: 'Pendente', 
    vencimento: '', 
    observacoes: '' 
  });
  const [edit, setEdit] = useState({ cliente: '', email: '', descricao: '', valor: '', vencimento: '', status: 'Pendente' });

  const total = cobrancas.length;
  const pagas = cobrancas.filter(c => c.status === 'Paga').length;
  const pendentes = cobrancas.filter(c => c.status === 'Pendente').length;
  const vencidas = cobrancas.filter(c => c.status === 'Vencida').length;
  const receitaMes = 0;

  const vencendo = cobrancas.filter(c => c.status === 'Pendente').slice(0,2); // Exemplo

  const filtradas = cobrancas.filter(c => {
    const buscaLower = busca.toLowerCase();
    const matchBusca = c.cliente.toLowerCase().includes(buscaLower) || c.email.toLowerCase().includes(buscaLower) || c.descricao.toLowerCase().includes(buscaLower);
    const matchStatus = !filtroStatus || c.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  // Funções auxiliares
  const handleSalvarNova = () => {
    if (!nova.cliente || !nova.nomeCliente || !nova.email || !nova.descricao || !nova.valor || !nova.vencimento) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }
    setCobrancas([
      ...cobrancas,
      {
        id: cobrancas.length + 1,
        cliente: nova.nomeCliente,
        email: nova.email,
        descricao: nova.descricao,
        valor: Number(nova.valor),
        vencimento: nova.vencimento,
        status: nova.status as 'Pendente' | 'Vencida' | 'Paga',
      },
    ]);
    setNova({ 
      cliente: '', 
      nomeCliente: '', 
      email: '', 
      telefone: '', 
      descricao: '', 
      valor: '', 
      status: 'Pendente', 
      vencimento: '', 
      observacoes: '' 
    });
    setModalNova(false);
  };
  const handleSalvarEdit = () => {
    setCobrancas(cobrancas.map(c => c.id === modalEditar?.id ? { ...c, ...edit, valor: Number(edit.valor) } : c));
    setModalEditar(null);
  };
  const handleExcluir = () => {
    setCobrancas(cobrancas.filter(c => c.id !== modalExcluir?.id));
    setModalExcluir(null);
  };
  const handleCopiar = (c: Cobranca) => {
    navigator.clipboard.writeText(`Cliente: ${c.cliente}\nEmail: ${c.email}\nDescrição: ${c.descricao}\nValor: R$ ${c.valor.toFixed(2)}\nVencimento: ${c.vencimento}`);
    setModalCopia(null);
  };

  // Função para preencher automaticamente os campos quando um cliente for selecionado
  const handleClienteChange = (clienteId: string) => {
    if (clienteId) {
      const selectedUser = users.find(user => user.id.toString() === clienteId);
      if (selectedUser) {
        setNova({
          ...nova,
          cliente: clienteId,
          nomeCliente: selectedUser.name,
          email: selectedUser.email,
          telefone: selectedUser.phone || ''
        });
      }
    } else {
      setNova({
        ...nova,
        cliente: '',
        nomeCliente: '',
        email: '',
        telefone: ''
      });
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#09090b]">
      <div className="flex items-center gap-3 mb-2">
        <BarChart3 className="w-7 h-7 text-purple-400" />
        <h1 className="text-3xl font-bold text-white">Cobranças</h1>
      </div>
      <p className="text-gray-400 mb-6">Gerencie todas as suas cobranças e faturamento</p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card className="bg-[#1f2937] border border-purple-700/40">
          <CardHeader>
            <CardTitle className="text-sm text-gray-300">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{total}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#1f2937] border border-green-700/40">
          <CardHeader>
            <CardTitle className="text-sm text-gray-300">Pagas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{pagas}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#1f2937] border border-yellow-700/40">
          <CardHeader>
            <CardTitle className="text-sm text-gray-300">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{pendentes}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#1f2937] border border-red-700/40">
          <CardHeader>
            <CardTitle className="text-sm text-gray-300">Vencidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{vencidas}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#1f2937] border border-blue-700/40">
          <CardHeader>
            <CardTitle className="text-sm text-gray-300">Receita Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">R$ {receitaMes.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
      {/* Alertas */}
      <div className="mb-4">
        {vencidas > 0 && (
          <div className="bg-red-900/80 text-red-200 rounded-lg px-4 py-3 mb-2 font-semibold">
            <span className="mr-2">⚠️</span> Você tem {vencidas} cobrança(s) vencida(s) totalizando R$ 300,00
          </div>
        )}
        {vencendo.length > 0 && (
          <div className="bg-yellow-900/80 text-yellow-200 rounded-lg px-4 py-3 font-semibold">
            <span className="mr-2">⏰</span> Você tem {vencendo.length} cobrança(s) vencendo nos próximos 7 dias
          </div>
        )}
      </div>
      {/* Filtros e busca */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="flex-1 flex items-center bg-[#1f2937] rounded-lg px-3">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <Input
            placeholder="Buscar por cliente, descrição ou email..."
            className="bg-transparent border-none text-white focus:ring-0"
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
        <select
          className="bg-[#1f2937] border border-gray-700 text-gray-300 rounded px-3 py-2"
          value={filtroStatus || ''}
          onChange={e => setFiltroStatus(e.target.value || null)}
        >
          <option value="">Todos</option>
          <option value="Pendente">Pendentes</option>
          <option value="Vencida">Vencidas</option>
          <option value="Paga">Pagas</option>
        </select>
        <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white" onClick={() => setModalNova(true)}>
          <Plus className="w-4 h-4 mr-2" /> Nova Cobrança
        </Button>
      </div>
      {/* Tabela de cobranças */}
      <Card className="bg-[#1f2937] border border-purple-700/40">
        <CardHeader>
          <CardTitle className="text-white text-lg">Lista de Cobranças ({filtradas.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtradas.map(c => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {c.cliente.split(' ').map(n => n[0]).join('').slice(0,2)}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{c.cliente}</div>
                        <div className="text-xs text-gray-400">{c.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">{c.descricao}</TableCell>
                  <TableCell className="font-bold text-white">R$ {c.valor.toFixed(2)}</TableCell>
                  <TableCell className="text-gray-300">{c.vencimento}</TableCell>
                  <TableCell>
                    {c.status === 'Vencida' && <Badge className="bg-red-700 text-red-200">Vencida</Badge>}
                    {c.status === 'Pendente' && <Badge className="bg-yellow-700 text-yellow-200">Pendente</Badge>}
                    {c.status === 'Paga' && <Badge className="bg-green-700 text-green-200">Paga</Badge>}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => setModalVisualizar(c)}><Eye className="w-4 h-4 text-blue-400" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => { setModalCopia(c); handleCopiar(c); }}><Copy className="w-4 h-4 text-purple-400" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => setModalEmail(c)}><Mail className="w-4 h-4 text-green-400" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => setModalWhats(c)}><MessageSquare className="w-4 h-4 text-blue-400" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => { setEdit({ ...c, valor: c.valor.toString() }); setModalEditar(c); }}><Edit className="w-4 h-4 text-yellow-400" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => setModalExcluir(c)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Modal Nova Cobrança */}
      <Dialog open={modalNova} onOpenChange={setModalNova}>
        <DialogContent className="bg-[#1f2937] text-white max-w-2xl w-full p-0 rounded-xl shadow-xl border border-gray-700">
          <div className="p-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Nova Cobrança</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setModalNova(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* Cliente */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Cliente <span className="text-red-500">*</span>
                </label>
                <select 
                  className="w-full bg-[#23272f] border border-gray-600 text-white rounded-lg px-3 py-2 focus:border-purple-500 focus:outline-none"
                  value={nova.cliente}
                  onChange={e => handleClienteChange(e.target.value)}
                >
                  <option value="">Selecione um cliente</option>
                  {getActiveUsers().map(user => (
                    <option key={user.id} value={user.id.toString()}>
                      {user.name} - {user.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nome do Cliente */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Nome do Cliente <span className="text-red-500">*</span>
                </label>
                <Input 
                  placeholder="Nome completo do cliente"
                  className="bg-[#23272f] border border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                  value={nova.nomeCliente}
                  onChange={e => setNova({ ...nova, nomeCliente: e.target.value })}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input 
                  placeholder="Email do cliente"
                  className="bg-[#23272f] border border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                  value={nova.email}
                  onChange={e => setNova({ ...nova, email: e.target.value })}
                />
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Telefone
                </label>
                <Input 
                  placeholder="(11) 99999-9999"
                  className="bg-[#23272f] border border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                  value={nova.telefone}
                  onChange={e => setNova({ ...nova, telefone: e.target.value })}
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Descrição <span className="text-red-500">*</span>
                </label>
                <textarea 
                  placeholder="Descrição da cobrança"
                  className="w-full bg-[#23272f] border border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 rounded-lg px-3 py-2 min-h-[80px] resize-none"
                  value={nova.descricao}
                  onChange={e => setNova({ ...nova, descricao: e.target.value })}
                />
              </div>

              {/* Valor */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Valor <span className="text-red-500">*</span>
                </label>
                <Input 
                  placeholder="R$ 0,00"
                  className="bg-[#23272f] border border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                  value={nova.valor}
                  onChange={e => setNova({ ...nova, valor: e.target.value })}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Status
                </label>
                <select 
                  className="w-full bg-[#23272f] border border-gray-600 text-white rounded-lg px-3 py-2 focus:border-purple-500 focus:outline-none"
                  value={nova.status}
                  onChange={e => setNova({ ...nova, status: e.target.value })}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Vencida">Vencida</option>
                  <option value="Paga">Paga</option>
                </select>
              </div>

              {/* Data de Vencimento */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Data de Vencimento <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input 
                    type="date"
                    className="bg-[#23272f] border border-gray-600 text-white focus:border-purple-500 pr-10"
                    value={nova.vencimento}
                    onChange={e => setNova({ ...nova, vencimento: e.target.value })}
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Observações
                </label>
                <textarea 
                  placeholder="Observações adicionais sobre a cobrança"
                  className="w-full bg-[#23272f] border border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 rounded-lg px-3 py-2 min-h-[100px] resize-y"
                  value={nova.observacoes}
                  onChange={e => setNova({ ...nova, observacoes: e.target.value })}
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-700">
              <Button 
                variant="outline" 
                onClick={() => setModalNova(false)}
                className="border-gray-600 text-gray-400 hover:text-white px-6 py-2"
              >
                Cancelar
              </Button>
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
                onClick={handleSalvarNova}
              >
                Criar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Modal Visualizar */}
      <Dialog open={!!modalVisualizar} onOpenChange={() => setModalVisualizar(null)}>
        <DialogContent className="bg-[#232a36] border border-purple-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Cobrança</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <div><b>Cliente:</b> {modalVisualizar?.cliente}</div>
            <div><b>E-mail:</b> {modalVisualizar?.email}</div>
            <div><b>Descrição:</b> {modalVisualizar?.descricao}</div>
            <div><b>Valor:</b> R$ {modalVisualizar?.valor.toFixed(2)}</div>
            <div><b>Vencimento:</b> {modalVisualizar?.vencimento}</div>
            <div><b>Status:</b> {modalVisualizar?.status}</div>
          </div>
          <DialogFooter>
            <Button onClick={() => setModalVisualizar(null)} className="bg-purple-600 hover:bg-purple-700 text-white">Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modal Editar */}
      <Dialog open={!!modalEditar} onOpenChange={() => setModalEditar(null)}>
        <DialogContent className="bg-[#232a36] border border-purple-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Cobrança</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input placeholder="Cliente" className="bg-gray-900 border border-gray-700 text-white" value={edit.cliente} onChange={e => setEdit({ ...edit, cliente: e.target.value })} />
            <Input placeholder="E-mail" className="bg-gray-900 border border-gray-700 text-white" value={edit.email} onChange={e => setEdit({ ...edit, email: e.target.value })} />
            <Input placeholder="Descrição" className="bg-gray-900 border border-gray-700 text-white" value={edit.descricao} onChange={e => setEdit({ ...edit, descricao: e.target.value })} />
            <Input placeholder="Valor" className="bg-gray-900 border border-gray-700 text-white" type="number" value={edit.valor} onChange={e => setEdit({ ...edit, valor: e.target.value })} />
            <Input placeholder="Vencimento" className="bg-gray-900 border border-gray-700 text-white" type="date" value={edit.vencimento} onChange={e => setEdit({ ...edit, vencimento: e.target.value })} />
            <select className="bg-gray-900 border border-gray-700 text-white rounded px-3 py-2" value={edit.status} onChange={e => setEdit({ ...edit, status: e.target.value })}>
              <option value="Pendente">Pendente</option>
              <option value="Vencida">Vencida</option>
              <option value="Paga">Paga</option>
            </select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalEditar(null)} className="bg-gray-700 text-white">Cancelar</Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleSalvarEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modal Excluir */}
      <Dialog open={!!modalExcluir} onOpenChange={() => setModalExcluir(null)}>
        <DialogContent className="bg-[#232a36] border border-purple-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir Cobrança</DialogTitle>
          </DialogHeader>
          <div className="py-4">Tem certeza que deseja excluir esta cobrança?</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalExcluir(null)} className="bg-gray-700 text-white">Cancelar</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleExcluir}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modal E-mail */}
      <Dialog open={!!modalEmail} onOpenChange={() => setModalEmail(null)}>
        <DialogContent className="bg-[#232a36] border border-purple-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar Cobrança por E-mail</DialogTitle>
          </DialogHeader>
          <div className="py-4">Cobrança enviada para <b>{modalEmail?.email}</b>!</div>
          <DialogFooter>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setModalEmail(null)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modal WhatsApp */}
      <Dialog open={!!modalWhats} onOpenChange={() => setModalWhats(null)}>
        <DialogContent className="bg-[#232a36] border border-purple-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar Cobrança por WhatsApp</DialogTitle>
          </DialogHeader>
          <div className="py-4">Cobrança enviada para <b>{modalWhats?.cliente}</b> via WhatsApp!</div>
          <DialogFooter>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setModalWhats(null)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 