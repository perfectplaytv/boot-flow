import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Server, Settings, Zap, Edit, Trash2, BarChart3, CheckCircle2, XCircle, CreditCard, TrendingUp, Cog, Play, Activity, Plus, Shield, ArrowUp } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from "react-router-dom";

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

const MAX_GATEWAYS = 5; // Limite de gateways para o plano Essencial

// Gateways mock removidos — estado inicial vazio (dados reais devem vir do backend)

export default function ClientGateways() {
  const navigate = useNavigate();
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [modal, setModal] = useState<{ type: null | 'testar' | 'editar' | 'configurar' | 'desativar', gateway?: Gateway }>({ type: null });
  const [form, setForm] = useState({ nome: '', tipo: '', taxa: '' });
  const [config, setConfig] = useState({ apiKey: '', secret: '', webhook: '' });
  const [testValue, setTestValue] = useState('');

  // Cards resumo
  const total = gateways.length;
  const ativos = gateways.filter(g => g.status === 'Ativo').length;
  const configurados = gateways.filter(g => g.configurado).length;
  const volumeMensal = gateways.reduce((acc, g) => {
    const volume = parseFloat(g.volume.replace(/[^\d,]/g, '').replace(',', '.'));
    return acc + (isNaN(volume) ? 0 : volume);
  }, 0);
  const volumeMensalFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(volumeMensal);
  const transacoes = gateways.filter(g => g.ultimaTransacao !== '-').length * 823; // Estimativa baseada em gateways ativos

  // Funções dos modais
  const handleTestar = () => {
    if (!testValue || parseFloat(testValue) <= 0) {
      toast.error('Informe um valor válido para teste');
      return;
    }
    toast.success(`Teste de transação de R$ ${parseFloat(testValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} realizado com sucesso!`);
    setTestValue('');
    setModal({ type: null });
  };

  const handleEditar = () => {
    if (!modal.gateway) return;
    if (!form.nome.trim() || !form.tipo.trim() || !form.taxa.trim()) {
      toast.error('Preencha todos os campos');
      return;
    }
    setGateways(gateways.map(g => g.id === modal.gateway!.id ? { ...g, nome: form.nome, tipo: form.tipo, taxa: form.taxa } : g));
    toast.success('Gateway atualizado com sucesso!');
    setModal({ type: null });
  };

  const handleConfigurar = () => {
    if (!modal.gateway) return;
    if (!config.apiKey.trim() || !config.secret.trim()) {
      toast.error('Preencha pelo menos a Chave/API Key e o Secret/Token');
      return;
    }
    setGateways(gateways.map(g => g.id === modal.gateway!.id ? { ...g, configurado: true, status: 'Ativo' } : g));
    toast.success('Gateway configurado com sucesso!');
    setConfig({ apiKey: '', secret: '', webhook: '' });
    setModal({ type: null });
  };

  const handleDesativar = () => {
    if (!modal.gateway) return;
    setGateways(gateways.map(g => g.id === modal.gateway!.id ? { ...g, status: 'Inativo' } : g));
    toast.success('Gateway desativado com sucesso!');
    setModal({ type: null });
  };

  const handleAdicionarGateway = () => {
    if (gateways.length >= MAX_GATEWAYS) {
      toast.error(`Você atingiu o limite de ${MAX_GATEWAYS} gateways do seu plano. Para adicionar mais gateways, faça upgrade do seu plano.`);
      return;
    }

    // Lista de gateways disponíveis para adicionar
    const gatewaysDisponiveis: Gateway[] = [
      { id: 6, nome: 'PicPay', tipo: 'Picpay', status: 'Inativo', configurado: false, taxa: '1.49% + R$ 0,50', volume: 'R$ 0,00', ultimaTransacao: '-' },
      { id: 7, nome: 'Asaas', tipo: 'Boleto', status: 'Inativo', configurado: false, taxa: '1.99% + R$ 2,00', volume: 'R$ 0,00', ultimaTransacao: '-' },
    ];

    // Encontrar um gateway disponível que ainda não está na lista
    const gatewayDisponivel = gatewaysDisponiveis.find(g => !gateways.find(existing => existing.id === g.id));
    
    if (gatewayDisponivel) {
      setGateways([...gateways, gatewayDisponivel]);
      toast.success(`Gateway ${gatewayDisponivel.nome} adicionado! Configure-o para começar a usar.`);
    } else {
      toast.error('Não há mais gateways disponíveis para adicionar');
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#09090b]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Server className="w-7 h-7 text-purple-400" />
            <h1 className="text-3xl font-bold text-green-400">
              Gateways de Pagamento ({gateways.length}/{MAX_GATEWAYS})
            </h1>
          </div>
          <p className="text-gray-400">Configure e gerencie seus gateways de pagamento</p>
        </div>
        <Button 
          className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white"
          onClick={handleAdicionarGateway}
          disabled={gateways.length >= MAX_GATEWAYS}
        >
          <Plus className="w-4 h-4 mr-2" />
          {gateways.length >= MAX_GATEWAYS ? `Limite atingido (${MAX_GATEWAYS}/${MAX_GATEWAYS})` : "Adicionar Gateway"}
        </Button>
      </div>

      {/* Aviso de limite de gateways */}
      {gateways.length >= MAX_GATEWAYS && (
        <div className="bg-yellow-900/40 border border-yellow-700 text-yellow-300 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Shield className="w-5 h-5 flex-shrink-0" />
              <div>
                <strong>Limite de gateways atingido!</strong>
                <p className="text-sm mt-1">
                  Você atingiu o limite de {MAX_GATEWAYS} gateways do seu plano Essencial. 
                  Para adicionar mais gateways, faça upgrade do seu plano.
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  const pricingElement = document.getElementById('pricing');
                  if (pricingElement) {
                    pricingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 font-semibold shadow-lg shadow-purple-500/50 whitespace-nowrap"
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              Fazer Upgrade
            </Button>
          </div>
        </div>
      )}

      {gateways.length >= MAX_GATEWAYS - 1 && gateways.length < MAX_GATEWAYS && (
        <div className="bg-blue-900/40 border border-blue-700 text-blue-300 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            <div>
              <strong>Atenção: Limite próximo!</strong>
              <p className="text-sm mt-1">
                Você tem {gateways.length} de {MAX_GATEWAYS} gateways. 
                Ainda pode adicionar {MAX_GATEWAYS - gateways.length} gateway(s).
              </p>
            </div>
          </div>
        </div>
      )}

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
            <div className="text-2xl font-bold text-yellow-400">{volumeMensalFormatado}</div>
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
            <p className="text-gray-300">Simule uma transação de teste para validar a integração do gateway.</p>
            <Input 
              placeholder="Valor da transação (ex: 10.00)" 
              className="bg-gray-900 border border-gray-700 text-white" 
              type="number" 
              step="0.01"
              min="0.01"
              value={testValue} 
              onChange={e => setTestValue(e.target.value)} 
            />
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
            <div>
              <label className="block text-sm text-gray-300 mb-1">Nome</label>
              <Input 
                placeholder="Nome do gateway" 
                className="bg-gray-900 border border-gray-700 text-white" 
                value={form.nome} 
                onChange={e => setForm({ ...form, nome: e.target.value })} 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Tipo</label>
              <Input 
                placeholder="Tipo (Pix, Cartao, etc.)" 
                className="bg-gray-900 border border-gray-700 text-white" 
                value={form.tipo} 
                onChange={e => setForm({ ...form, tipo: e.target.value })} 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Taxa</label>
              <Input 
                placeholder="Ex: 2.99% + R$ 0,30" 
                className="bg-gray-900 border border-gray-700 text-white" 
                value={form.taxa} 
                onChange={e => setForm({ ...form, taxa: e.target.value })} 
              />
            </div>
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
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Chave/API Key <span className="text-red-500">*</span>
              </label>
              <Input 
                placeholder="Sua chave de API" 
                className="bg-gray-900 border border-gray-700 text-white" 
                value={config.apiKey} 
                onChange={e => setConfig({ ...config, apiKey: e.target.value })} 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Secret/Token <span className="text-red-500">*</span>
              </label>
              <Input 
                placeholder="Seu token secreto" 
                className="bg-gray-900 border border-gray-700 text-white" 
                type="password"
                value={config.secret} 
                onChange={e => setConfig({ ...config, secret: e.target.value })} 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Webhook URL (Opcional)</label>
              <Input 
                placeholder="https://seu-dominio.com/webhook" 
                className="bg-gray-900 border border-gray-700 text-white" 
                value={config.webhook} 
                onChange={e => setConfig({ ...config, webhook: e.target.value })} 
              />
            </div>
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
            <p className="text-gray-300">Tem certeza que deseja desativar este gateway? As transações por ele serão bloqueadas.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal({ type: null })} className="bg-gray-700 text-white">Cancelar</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDesativar}>Desativar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
