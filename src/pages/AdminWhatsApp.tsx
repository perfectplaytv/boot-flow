import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CheckCircle, MessageSquare, Clock, FileText, Zap, Settings, Trash2, Edit, Plus, Eye, Download, Upload, Users } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const templatesMock = [
  {
    id: 1,
    title: 'Confirmação de Agendamento',
    status: 'Ativo',
    tag: 'confirmação',
    content: 'Olá {{nome}}, seu agendamento para {{servico}} foi confirmado para {{data}} às {{hora}}. Aguardamos você! 📅',
    sent: 445,
    delivery: 96.8,
    variables: 3,
    read: true
  },
  {
    id: 2,
    title: 'Lembrete de Agendamento',
    status: 'Ativo',
    tag: 'lembrete',
    content: 'Oi {{nome}}! Lembrete: você tem um agendamento amanhã às {{hora}} para {{servico}}. Confirme sua presença! 📲',
    sent: 389,
    delivery: 94.2,
    variables: 3,
    read: true
  },
  {
    id: 3,
    title: 'Cancelamento de Agendamento',
    status: 'Ativo',
    tag: 'cancelamento',
    content: 'Olá {{nome}}, seu agendamento para {{servico}} em {{data}} foi cancelado conforme solicitado. Para reagendar, entre em contato.',
    sent: 67,
    delivery: 95.8,
    variables: 3,
    read: false
  },
  {
    id: 4,
    title: 'Promoção Especial',
    status: 'Inativo',
    tag: 'marketing',
    content: '{{nome}}, temos uma promoção especial para você! {{promocao}} com {{desconto}} de desconto. Válido até {{validade}}. 🎁',
    sent: 234,
    delivery: 95.1,
    variables: 4,
    read: false
  }
];

const initialForm = { id: null, title: '', status: 'Ativo', tag: '', content: '', variables: 1 };

const AdminWhatsApp: React.FC = () => {
  const [autoReply, setAutoReply] = useState(false);
  const [templates, setTemplates] = useState(templatesMock);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [templateToDelete, setTemplateToDelete] = useState<any>(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [configTab, setConfigTab] = useState('geral');
  const [config, setConfig] = useState({
    provider: 'Meta Cloud API',
    number: '',
    webhook: '',
    autoReply: false,
    apiToken: '',
    apiEndpoint: '',
    logsDetalhados: false,
    modoProducao: false
  });

  // Abrir modal para novo template
  const handleNewTemplate = () => {
    setEditing(false);
    setForm({ ...initialForm, id: null });
    setModalOpen(true);
  };

  // Abrir modal para editar
  const handleEditTemplate = (tpl: any) => {
    setEditing(true);
    setForm({ ...tpl });
    setModalOpen(true);
  };

  // Salvar novo ou editar
  const handleSaveTemplate = () => {
    if (!form.title.trim() || !form.tag.trim() || !form.content.trim()) {
      toast.error('Preencha todos os campos obrigatórios!');
      return;
    }
    if (editing) {
      setTemplates((prev) => prev.map((tpl) => tpl.id === form.id ? { ...form } : tpl));
      toast.success('Template atualizado com sucesso!');
    } else {
      setTemplates((prev) => [
        ...prev,
        { ...form, id: Date.now(), sent: 0, delivery: 0, variables: form.variables || 1, status: 'Ativo', read: false }
      ]);
      toast.success('Template criado com sucesso!');
    }
    setModalOpen(false);
  };

  // Abrir modal de confirmação de exclusão
  const handleDeleteTemplate = (tpl: any) => {
    setTemplateToDelete(tpl);
    setDeleteModalOpen(true);
  };

  // Confirmar exclusão
  const confirmDeleteTemplate = () => {
    setTemplates((prev) => prev.filter((tpl) => tpl.id !== templateToDelete.id));
    setDeleteModalOpen(false);
    toast.success('Template excluído com sucesso!');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-8 h-8 text-green-500" />
            <h1 className="text-3xl font-bold text-green-400">WhatsApp <span className="text-white">Business</span></h1>
          </div>
          <p className="text-gray-400 mt-1">Gerencie integrações, templates e automações do WhatsApp</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700" onClick={() => setConfigModalOpen(true)}><Settings className="w-4 h-4 mr-2" />Configurar</Button>
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleNewTemplate}><Plus className="w-4 h-4 mr-2" />Novo Template</Button>
        </div>
      </div>

      {/* Modal de Configuração */}
      <Dialog open={configModalOpen} onOpenChange={setConfigModalOpen}>
        <DialogContent className="bg-[#1f2937] text-white max-w-2xl w-full p-0 rounded-xl shadow-xl border border-gray-700">
          <div className="p-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-6 h-6 text-green-500" />
              <span className="text-lg font-semibold text-white">Configurar WhatsApp Business</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">Envio de mensagens via WhatsApp</p>
            {/* Status da Conexão */}
            <div className="bg-[#23272f] border border-gray-700 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-300 font-medium">Status da Integração</span>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded" 
                  size="sm"
                  onClick={handleTestConnection}
                >
                  Testar Conexão
                </Button>
              </div>
              
              {isConnected ? (
                <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold border border-green-500/30">
                  Conectado
                </span>
              ) : (
                <div className="space-y-4">
                  <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
                    <p className="text-orange-400 text-sm font-medium mb-1">
                      Desconectado! Seu WhatsApp não está conectado no momento
                    </p>
                    <p className="text-orange-300 text-xs">
                      Clique na imagem abaixo para recarregar o QR Code.
                    </p>
                  </div>
                  
                  {/* QR Code Area */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="bg-white p-4 rounded-lg shadow-lg">
                        {qrCodeData ? (
                          <img 
                            src={qrCodeData} 
                            alt="QR Code WhatsApp" 
                            className="w-48 h-48 cursor-pointer"
                            onClick={handleRefreshQR}
                          />
                        ) : (
                          <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
                              <p className="text-gray-500 text-xs">Gerando QR Code...</p>
                            </div>
                          </div>
                        )}
                        <button 
                          onClick={handleRefreshQR}
                          className="absolute -bottom-2 -right-2 bg-gray-800 text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Help Section */}
                  <div className="mt-4">
                    <h4 className="text-gray-300 font-medium mb-3">Ajuda:</h4>
                    <div className="space-y-2">
                      <div className="bg-[#1f2937] border-l-4 border-blue-500 p-3 rounded-r-lg cursor-pointer hover:bg-[#374151] transition-colors">
                        <p className="text-gray-300 text-sm">QR Code não aparece.</p>
                      </div>
                      <div className="bg-[#1f2937] border-l-4 border-blue-500 p-3 rounded-r-lg cursor-pointer hover:bg-[#374151] transition-colors">
                        <p className="text-gray-300 text-sm">WhatsApp não conecta</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1 font-medium">Token do WhatsApp Business</label>
              <Input 
                value={config.apiToken || ''} 
                onChange={e => setConfig({ ...config, apiToken: e.target.value })} 
                placeholder="Insira sua chave/token..." 
                className="bg-[#23272f] border border-gray-600 text-white placeholder-gray-400 focus:border-green-500" 
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-300 mb-1 font-medium">URL do Webhook</label>
              <Input 
                value={config.apiEndpoint || ''} 
                onChange={e => setConfig({ ...config, apiEndpoint: e.target.value })} 
                placeholder="https://sua-api.com/webhook" 
                className="bg-[#23272f] border border-gray-600 text-white placeholder-gray-400 focus:border-green-500" 
              />
            </div>
            <div className="bg-[#23272f] border border-gray-700 rounded-lg p-4 mb-6">
              <span className="block text-white font-semibold mb-3">Configurações Avançadas</span>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="block text-gray-300 font-medium">Auto-resposta</span>
                  <span className="block text-xs text-gray-400">Respostas automáticas quando offline</span>
                </div>
                <Switch checked={config.autoReply} onCheckedChange={v => setConfig({ ...config, autoReply: v })} />
              </div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="block text-gray-300 font-medium">Logs detalhados</span>
                  <span className="block text-xs text-gray-400">Registrar todas as interações</span>
                </div>
                <Switch checked={config.logsDetalhados || false} onCheckedChange={v => setConfig({ ...config, logsDetalhados: v })} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-gray-300 font-medium">Modo de produção</span>
                  <span className="block text-xs text-gray-400">Usar configurações de produção</span>
                </div>
                <Switch checked={config.modoProducao || false} onCheckedChange={v => setConfig({ ...config, modoProducao: v })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setConfigModalOpen(false)} 
                className="border-gray-600 text-gray-400 hover:text-white px-6 py-2 rounded font-semibold"
              >
                Cancelar
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold">
                Salvar Integração
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-gray-700" style={{ backgroundColor: '#1F2937' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Mensagens</CardTitle>
            <MessageSquare className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{templates.reduce((acc, t) => acc + t.sent, 0)}</div>
          </CardContent>
        </Card>
        <Card className="border-gray-700" style={{ backgroundColor: '#1F2937' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Taxa de Entrega</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{templates.length ? (templates.reduce((acc, t) => acc + t.delivery, 0) / templates.length).toFixed(1) : '0'}%</div>
          </CardContent>
        </Card>
        <Card className="border-gray-700" style={{ backgroundColor: '#1F2937' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Taxa de Leitura</CardTitle>
            <Eye className="h-5 w-5 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">86.1%</div>
          </CardContent>
        </Card>
        <Card className="border-gray-700" style={{ backgroundColor: '#1F2937' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Tempo Médio</CardTitle>
            <Clock className="h-5 w-5 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">2.3min</div>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal: Templates */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-gray-700" style={{ backgroundColor: '#1F2937' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-green-400" />
                <CardTitle className="text-white">Templates de Mensagem</CardTitle>
              </div>
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleNewTemplate}><Plus className="w-4 h-4 mr-2" />Novo Template</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {templates.map((tpl) => (
                <div key={tpl.id} className="rounded-lg border border-gray-700 p-4 bg-[#232a36]">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-base font-semibold ${tpl.status === 'Ativo' ? 'text-green-400' : 'text-gray-400'}`}>{tpl.title}</span>
                      <Badge className={tpl.status === 'Ativo' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>{tpl.status}</Badge>
                      <Badge className="bg-gray-700 text-gray-300 border-gray-600">{tpl.tag}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-green-400" onClick={() => handleEditTemplate(tpl)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300" onClick={() => handleDeleteTemplate(tpl)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <div className="text-gray-300 mb-2 text-sm">{tpl.content}</div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span><MessageSquare className="inline w-4 h-4 mr-1 text-green-400" />{tpl.sent} enviadas</span>
                    <span><CheckCircle className="inline w-4 h-4 mr-1 text-green-400" />{tpl.delivery}% entrega</span>
                    <span><FileText className="inline w-4 h-4 mr-1 text-blue-400" />{tpl.variables} variáveis</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Coluna lateral: Status, Ações, Informações */}
        <div className="space-y-6">
          {/* Status da Conexão */}
          <Card className="border-gray-700" style={{ backgroundColor: '#1F2937' }}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><Zap className="w-5 h-5 text-green-400" /> Status da Conexão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">API Status</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Conectado</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Webhook</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Auto-resposta</span>
                <Switch checked={autoReply} onCheckedChange={setAutoReply} />
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700 mt-2">Testar Conexão</Button>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card className="border-gray-700" style={{ backgroundColor: '#1F2937' }}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><Settings className="w-5 h-5 text-purple-400" /> Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full border-gray-700 bg-gray-900 text-white hover:bg-gray-800 flex items-center justify-start"><Eye className="w-4 h-4 mr-2 text-blue-400" />Ver Histórico</Button>
              <Button variant="outline" className="w-full border-gray-700 bg-gray-900 text-white hover:bg-gray-800 flex items-center justify-start"><Zap className="w-4 h-4 mr-2 text-green-400" />Configurar Webhook</Button>
              <Button variant="outline" className="w-full border-gray-700 bg-gray-900 text-white hover:bg-gray-800 flex items-center justify-start"><Download className="w-4 h-4 mr-2 text-purple-400" />Exportar Relatórios</Button>
              <Button variant="outline" className="w-full border-gray-700 bg-gray-900 text-white hover:bg-gray-800 flex items-center justify-start"><Upload className="w-4 h-4 mr-2 text-green-400" />Importar Templates</Button>
            </CardContent>
          </Card>

          {/* Informações */}
          <Card className="border-gray-700" style={{ backgroundColor: '#1F2937' }}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><Users className="w-5 h-5 text-blue-400" /> Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center justify-between"><span>Clientes Ativos</span><span className="font-bold text-white">234</span></div>
              <div className="flex items-center justify-between"><span>Templates Ativos</span><span className="font-bold text-white">{templates.filter(t => t.status === 'Ativo').length}</span></div>
              <div className="flex items-center justify-between"><span>Última Sincronização</span><span className="text-gray-400">2min atrás</span></div>
              <div className="flex items-center justify-between"><span>Próximo Backup</span><span className="text-gray-400">23:00</span></div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Criar/Editar Template */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#232a36] border-gray-700 text-white max-w-lg">
          <DialogHeader>
            <CardTitle className="text-xl font-bold">{editing ? 'Editar Template' : 'Novo Template'}</CardTitle>
            <DialogDescription className="text-gray-400">Preencha os campos obrigatórios</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Título *</label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Tag *</label>
              <Input value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Conteúdo *</label>
              <Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="bg-gray-700 border-gray-600 text-white min-h-[80px]" />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Variáveis</label>
              <Input type="number" min={1} value={form.variables} onChange={e => setForm({ ...form, variables: Number(e.target.value) })} className="bg-gray-700 border-gray-600 text-white w-24" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveTemplate} className="bg-green-600 hover:bg-green-700">{editing ? 'Salvar' : 'Criar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="bg-[#232a36] border-gray-700 text-white max-w-md">
          <DialogHeader>
            <CardTitle className="text-xl font-bold">Excluir Template</CardTitle>
            <DialogDescription className="text-gray-400">Tem certeza que deseja excluir este template?</DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <span className="font-semibold text-green-400">{templateToDelete?.title}</span>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancelar</Button>
            <Button onClick={confirmDeleteTemplate} className="bg-red-600 hover:bg-red-700">Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminWhatsApp; 