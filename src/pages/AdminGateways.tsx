import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Server, Settings, Zap, Edit, Trash2, BarChart3, CheckCircle2, XCircle, CreditCard, TrendingUp, Cog, Play, Activity, Plus } from 'lucide-react';

interface Gateway {
  id: number;
  nome: string;
  tipo: string;
  status: 'Ativo' | 'Inativo';
  configurado: boolean;
  taxa: string;
  volume: string;
  ultimaTransacao: string;
}

// Gateways mock removidos — estado inicial vazio (valores reais devem vir do backend)

export default function AdminGateways() {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [modal, setModal] = useState<{ type: null | 'testar' | 'editar' | 'configurar' | 'desativar' | 'configurar-geral', gateway?: Gateway }>({ type: null });
  const [form, setForm] = useState({ nome: '', tipo: '', taxa: '' });
  const [configGeral, setConfigGeral] = useState({
    gatewayPadrao: '',
    moedaPadrao: 'BRL',
    notificacoes: true,
    processamentoAutomatico: false,
    validacaoCartao: true,
    webhookUrl: '',
    apiTimeout: 30
  });

  // Cards resumo
  const total = gateways.length;
  const ativos = gateways.filter(g => g.status === 'Ativo').length;
  const configurados = gateways.filter(g => g.configurado).length;
  const volumeMensal = '0';
  const transacoes = 0;

  // Funções dos modais
  const handleTestar = () => {
    setTestValue('');
    setModal({ type: null });
  };
  const handleEditar = () => {
    if (!modal.gateway) return;
    setGateways(gateways.map(g => g.id === modal.gateway!.id ? { ...g, nome: form.nome, tipo: form.tipo, taxa: form.taxa } : g));
    setModal({ type: null });
  };
  const handleConfigurar = () => {
    if (!modal.gateway) return;
    setGateways(gateways.map(g => g.id === modal.gateway!.id ? { ...g, configurado: true, status: 'Ativo' } : g));
    setConfig({ apiKey: '', secret: '', webhook: '' });
    setModal({ type: null });
  };

  const handleConfigurarGateways = () => {
    setModal({ type: 'configurar-geral' });
  };

  const handleSalvarConfigGeral = () => {
    // Aqui seria implementada a lógica para salvar no backend
    console.log('Salvando configurações gerais:', configGeral);
    // TODO: Implementar chamada para API
    setModal({ type: null });
  };
  const handleDesativar = () => {
    if (!modal.gateway) return;
    setGateways(gateways.map(g => g.id === modal.gateway!.id ? { ...g, status: 'Inativo' } : g));
    setModal({ type: null });
  };

  return (
    <div className="p-6 min-h-screen bg-[#09090b]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Server className="w-7 h-7 text-purple-400" />
          <h1 className="text-3xl font-bold text-green-400">Gateways de Pagamento</h1>
        </div>
        <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white" onClick={handleConfigurarGateways}>
          <Settings className="w-4 h-4 mr-2" />
          Configurar Gateways
        </Button>
      </div>
      <p className="text-gray-400 mb-6">Configure e gerencie seus gateways de pagamento</p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-700/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-300">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{total}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-700/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-300">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{ativos}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-700/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-300">Configurados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{configurados}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border border-yellow-700/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-300">Volume Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{volumeMensal}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-pink-900/50 to-pink-800/30 border border-pink-700/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-300">Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-400">{transacoes}</div>
          </CardContent>
        </Card>
      </div>
      {/* Tabela de gateways */}
      <Card className="bg-[#181e29] border border-purple-700/40">
        <CardHeader>
          <CardTitle className="text-white text-lg">Gateways Configurados</CardTitle>
          <p className="text-gray-400 text-sm">Gerencie seus métodos de pagamento</p>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gateway</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Taxa</TableHead>
                <TableHead>Volume Mensal</TableHead>
                <TableHead>Última Transação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gateways.map(g => (
                <TableRow key={g.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white font-bold">
                        <CheckCircle2 className={g.configurado ? 'text-green-400' : 'text-gray-400'} />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{g.nome}</div>
                        <div className="text-xs text-gray-400">{g.configurado ? 'Configurado' : 'Não configurado'}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">{g.tipo}</TableCell>
                  <TableCell>
                    {g.status === 'Ativo' && <Badge className="bg-green-700 text-green-200">Ativo</Badge>}
                    {g.status === 'Inativo' && <Badge className="bg-gray-700 text-gray-300">Inativo</Badge>}
                  </TableCell>
                  <TableCell className="text-gray-300">{g.taxa}</TableCell>
                  <TableCell className="font-bold text-white">{g.volume}</TableCell>
                  <TableCell className="text-gray-300">{g.ultimaTransacao}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {g.configurado ? (
                        <>
                          <Button size="sm" variant="outline" className="border-blue-600 text-blue-400" onClick={() => { setModal({ type: 'testar', gateway: g }); setTestValue(''); }}>
                            <Play className="w-4 h-4 mr-1" /> Testar
                          </Button>
                          <Button size="sm" variant="outline" className="border-yellow-600 text-yellow-400" onClick={() => { setModal({ type: 'editar', gateway: g }); setForm({ nome: g.nome, tipo: g.tipo, taxa: g.taxa }); }}>
                            <Cog className="w-4 h-4 mr-1" /> Editar
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-600 text-red-400" onClick={() => setModal({ type: 'desativar', gateway: g })}>
                            <XCircle className="w-4 h-4 mr-1" /> Desativar
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white" onClick={() => { setModal({ type: 'configurar', gateway: g }); setConfig({ apiKey: '', secret: '', webhook: '' }); }}>
                          Configurar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Modal Testar Gateway */}
      <Dialog open={modal.type === 'testar'} onOpenChange={() => setModal({ type: null })}>
        <DialogContent className="bg-[#232a36] border border-purple-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Testar Gateway: {modal.gateway?.nome}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p>Simule uma transação de teste para validar a integração do gateway.</p>
            <Input placeholder="Valor da transação" className="bg-gray-900 border border-gray-700 text-white" type="number" value={testValue} onChange={e => setTestValue(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal({ type: null })} className="bg-gray-700 text-white">Cancelar</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleTestar}>Testar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modal Editar Gateway */}
      <Dialog open={modal.type === 'editar'} onOpenChange={() => setModal({ type: null })}>
        <DialogContent className="bg-[#232a36] border border-purple-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Gateway: {modal.gateway?.nome}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input placeholder="Nome" className="bg-gray-900 border border-gray-700 text-white" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
            <Input placeholder="Tipo" className="bg-gray-900 border border-gray-700 text-white" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} />
            <Input placeholder="Taxa" className="bg-gray-900 border border-gray-700 text-white" value={form.taxa} onChange={e => setForm({ ...form, taxa: e.target.value })} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal({ type: null })} className="bg-gray-700 text-white">Cancelar</Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleEditar}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modal Configurar Gateway */}
      <Dialog open={modal.type === 'configurar'} onOpenChange={() => setModal({ type: null })}>
        <DialogContent className="bg-[#232a36] border border-purple-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar Gateway: {modal.gateway?.nome}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input placeholder="Chave/API Key" className="bg-gray-900 border border-gray-700 text-white" value={config.apiKey} onChange={e => setConfig({ ...config, apiKey: e.target.value })} />
            <Input placeholder="Secret/Token" className="bg-gray-900 border border-gray-700 text-white" value={config.secret} onChange={e => setConfig({ ...config, secret: e.target.value })} />
            <Input placeholder="Webhook URL" className="bg-gray-900 border border-gray-700 text-white" value={config.webhook} onChange={e => setConfig({ ...config, webhook: e.target.value })} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal({ type: null })} className="bg-gray-700 text-white">Cancelar</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleConfigurar}>Salvar Configuração</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modal Desativar Gateway */}
      <Dialog open={modal.type === 'desativar'} onOpenChange={() => setModal({ type: null })}>
        <DialogContent className="bg-[#232a36] border border-purple-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Desativar Gateway: {modal.gateway?.nome}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p>Tem certeza que deseja desativar este gateway? As transações por ele serão bloqueadas.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal({ type: null })} className="bg-gray-700 text-white">Cancelar</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDesativar}>Desativar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modal Configurar Gateways Geral */}
      <Dialog open={modal.type === 'configurar-geral'} onOpenChange={() => setModal({ type: null })}>
        <DialogContent className="bg-[#232a36] border border-purple-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-400" />
              Configuração Geral de Gateways
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Gateway Padrão</label>
                <select className="w-full bg-gray-900 border border-gray-700 text-white rounded px-3 py-2" aria-label="Selecionar gateway padrão" value={configGeral.gatewayPadrao} onChange={(e) => setConfigGeral({ ...configGeral, gatewayPadrao: e.target.value })}>
                  <option value="">Selecionar gateway...</option>
                  <option value="stripe">Stripe</option>
                  <option value="paypal">PayPal</option>
                  <option value="mercado-pago">Mercado Pago</option>
                  <option value="pagseguro">PagSeguro</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Moeda Padrão</label>
                <select className="w-full bg-gray-900 border border-gray-700 text-white rounded px-3 py-2" aria-label="Selecionar moeda padrão" value={configGeral.moedaPadrao} onChange={(e) => setConfigGeral({ ...configGeral, moedaPadrao: e.target.value })}>
                  <option value="BRL">BRL (R$)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">URL do Webhook Global</label>
                <Input 
                  placeholder="https://seudominio.com/webhook/pagamentos" 
                  className="bg-gray-900 border border-gray-700 text-white"
                  value={configGeral.webhookUrl}
                  onChange={(e) => setConfigGeral({ ...configGeral, webhookUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Timeout da API (segundos)</label>
                <Input 
                  type="number" 
                  placeholder="30" 
                  className="bg-gray-900 border border-gray-700 text-white"
                  value={configGeral.apiTimeout}
                  onChange={(e) => setConfigGeral({ ...configGeral, apiTimeout: parseInt(e.target.value) || 30 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Configurações Avançadas</label>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-purple-500" checked={configGeral.notificacoes} onChange={(e) => setConfigGeral({ ...configGeral, notificacoes: e.target.checked })} />
                  <span className="text-sm text-gray-300">Habilitar notificações de pagamento</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-purple-500" checked={configGeral.processamentoAutomatico} onChange={(e) => setConfigGeral({ ...configGeral, processamentoAutomatico: e.target.checked })} />
                  <span className="text-sm text-gray-300">Processar pagamentos automaticamente</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-purple-500" checked={configGeral.validacaoCartao} onChange={(e) => setConfigGeral({ ...configGeral, validacaoCartao: e.target.checked })} />
                  <span className="text-sm text-gray-300">Validar dados do cartão</span>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal({ type: null })} className="bg-gray-700 text-white">Cancelar</Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleSalvarConfigGeral}>Salvar Configurações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 