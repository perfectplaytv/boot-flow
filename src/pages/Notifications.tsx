import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Send, MessageSquare, CheckCircle2, XCircle, TrendingUp, Users } from 'lucide-react';
import { useNeonUsers } from '@/hooks/useNeonUsers';
import { useNeonResellers } from '@/hooks/useNeonResellers';
import { toast } from 'sonner';
import { useWhatsAppStatus } from './AdminWhatsApp';

const templatesMock = [
  { id: 1, nome: 'Confirmação de Agendamento', texto: 'Olá {nome}, seu agendamento para {servico} foi confirmado para {data} às {hora}. Aguardamos você!', variaveis: ['nome', 'servico', 'data', 'hora'], status: 'Ativo', envios: 1247, taxa: 98.5 },
  { id: 2, nome: 'Lembrete de Agendamento', texto: 'Oi {nome}! Lembrete: você tem um agendamento amanhã às {hora} para {servico}. Confirme sua presença!', variaveis: ['nome', 'servico', 'hora'], status: 'Ativo', envios: 892, taxa: 97.2 },
  { id: 3, nome: 'Cobrança Pendente', texto: 'Olá {nome}, você tem uma cobrança pendente de {valor} para {servico}. Pague via PIX: {pix}. Obrigado!', variaveis: ['nome', 'valor', 'servico', 'pix'], status: 'Ativo', envios: 445, taxa: 96.8 },
  { id: 4, nome: 'Promoção Especial', texto: 'Olá {nome}, temos uma promoção especial para você! {promocao} com {desconto}% de desconto. Válido até {validade}.', variaveis: ['nome', 'promocao', 'desconto', 'validade'], status: 'Inativo', envios: 234, taxa: 95.1 },
  { id: 5, nome: 'Aniversário', texto: 'Parabéns {nome}! Que seu dia seja especial! Como presente, você tem {desconto}% de desconto em qualquer serviço. Aproveite!', variaveis: ['nome', 'desconto'], status: 'Ativo', envios: 67, taxa: 99.2 },
];

const historicoMock = [
  { id: 1, nome: 'Maria Silva', template: 'Confirmação de Agendamento', status: 'Entregue', data: '15/01/2025, 07:30' },
  { id: 2, nome: 'João Santos', template: 'Lembrete de Agendamento', status: 'Lido', data: '15/01/2025, 06:15' },
  { id: 3, nome: 'Ana Costa', template: 'Cobrança Pendente', status: 'Entregue', data: '15/01/2025, 05:45' },
  { id: 4, nome: 'Pedro Lima', template: 'Promoção Especial', status: 'Falha', data: '14/01/2025, 18:00' },
];

export default function Notifications() {
  const [templates, setTemplates] = useState(templatesMock);
  const [historico, setHistorico] = useState(historicoMock);
  const [modal, setModal] = useState<{ type: null | 'novo' | 'editar' | 'enviar', template?: any }>({ type: null });
  const [form, setForm] = useState({ nome: '', texto: '', variaveis: '', status: 'Ativo' });
  const { users } = useNeonUsers();
  const { resellers } = useNeonResellers();
  const [selectedDest, setSelectedDest] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const { isConnected, connectionStatus } = useWhatsAppStatus();

  // Cards resumo
  const enviados = historico.length;
  const entregues = historico.filter(h => h.status === 'Entregue').length;
  const lidos = historico.filter(h => h.status === 'Lido').length;
  const falhas = historico.filter(h => h.status === 'Falha').length;
  const taxaEntrega = enviados ? ((entregues / enviados) * 100).toFixed(1) : '0.0';

  // Funções dos modais
  const handleNovo = () => {
    setTemplates([...templates, { id: templates.length + 1, nome: form.nome, texto: form.texto, variaveis: form.variaveis.split(','), status: form.status, envios: 0, taxa: 0 }]);
    setForm({ nome: '', texto: '', variaveis: '', status: 'Ativo' });
    setModal({ type: null });
  };
  const handleEditar = () => {
    setTemplates(templates.map(t => t.id === modal.template.id ? { ...t, ...form, variaveis: form.variaveis.split(',') } : t));
    setModal({ type: null });
  };
  const handleEnviar = () => {
    setHistorico([{ id: historico.length + 1, nome: 'Cliente Exemplo', template: modal.template.nome, status: 'Entregue', data: new Date().toLocaleString('pt-BR') }, ...historico]);
    setModal({ type: null });
  };

  const variaveisSugeridas = ['nome', 'servico', 'data', 'hora', 'valor', 'pix', 'promocao', 'desconto', 'validade'];

  const searchValue = typeof selectedDest === 'string' ? selectedDest : '';

  return (
    <div className="p-6 min-h-screen bg-[#09090b]">
      <div className="flex items-center gap-3 mb-2">
        <MessageSquare className="w-7 h-7 text-purple-400" />
        <h1 className="text-3xl font-bold text-purple-300">Notificações WhatsApp</h1>
      </div>
      <p className="text-gray-400 mb-6">Gerencie templates e envie notificações para seus clientes</p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card className="bg-[#1f2937] border border-purple-700/40">
          <CardHeader>
            <CardTitle className="text-sm text-gray-300">Total Enviados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{enviados}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#1f2937] border border-green-700/40">
          <CardHeader>
            <CardTitle className="text-sm text-gray-300">Entregues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{entregues}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#1f2937] border border-blue-700/40">
          <CardHeader>
            <CardTitle className="text-sm text-gray-300">Lidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{lidos}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#1f2937] border border-red-700/40">
          <CardHeader>
            <CardTitle className="text-sm text-gray-300">Falhas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{falhas}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#1f2937] border border-yellow-700/40">
          <CardHeader>
            <CardTitle className="text-sm text-gray-300">Taxa Entrega</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{taxaEntrega}%</div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-end gap-2 mb-4">
        <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white" onClick={() => setModal({ type: 'novo' })}><Plus className="w-4 h-4 mr-2" /> Novo Template</Button>
        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => { setModal({ type: 'enviar' }); setSelectedDest(null); setSelectedTemplate(templates[0]); }}><Send className="w-4 h-4 mr-2" /> Enviar Notificação</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Templates */}
        <Card className="bg-[#1f2937] border border-purple-700/40">
          <CardHeader>
            <CardTitle className="text-white text-lg">Templates de Mensagem</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {templates.map(t => (
              <div key={t.id} className="bg-[#232a36] rounded-xl p-4 border border-purple-700/30 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-white">{t.nome}</div>
                  <Badge className={t.status === 'Ativo' ? 'bg-green-700 text-green-200' : 'bg-gray-700 text-gray-300'}>{t.status}</Badge>
                </div>
                <div className="text-gray-300 text-sm">{t.texto}</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {t.variaveis.map((v: string) => (
                    <span key={v} className="bg-gray-800 text-purple-300 rounded-full px-3 py-1 text-xs">{v}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span>{t.envios} envios</span>
                  <span>{t.taxa}% entrega</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" className="border-yellow-600 text-yellow-400" onClick={() => { setModal({ type: 'editar', template: t }); setForm({ nome: t.nome, texto: t.texto, variaveis: t.variaveis.join(','), status: t.status }); }}>Editar</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        {/* Histórico */}
        <Card className="bg-[#1f2937] border border-purple-700/40">
          <CardHeader>
            <CardTitle className="text-white text-lg">Histórico de Envios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {historico.map(h => (
              <div key={h.id} className="bg-[#232a36] rounded-xl p-4 border border-purple-700/30 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-white">{h.nome}</div>
                  <Badge className={h.status === 'Entregue' ? 'bg-green-700 text-green-200' : h.status === 'Lido' ? 'bg-blue-700 text-blue-200' : 'bg-red-700 text-red-200'}>{h.status}</Badge>
                </div>
                <div className="text-gray-300 text-xs">{h.template}</div>
                <div className="text-gray-400 text-xs">{h.data}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      {/* Modal Novo Template */}
      <Dialog open={modal.type === 'novo'} onOpenChange={() => setModal({ type: null })}>
        <DialogContent className="bg-gradient-to-br from-[#232a36] to-[#1f1930] border border-purple-700 text-white max-w-lg shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-purple-300 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-purple-400" /> Novo Template
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input placeholder="Nome do Template" className="bg-gray-900 border border-gray-700 text-white rounded-lg" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
            {/* Variáveis sugeridas para inserir */}
            <div className="flex flex-wrap gap-2 mb-1">
              {variaveisSugeridas.map(v => (
                <button
                  key={v}
                  type="button"
                  className="bg-purple-900/60 text-purple-200 rounded-full px-3 py-1 text-xs font-semibold border border-purple-700 hover:bg-purple-800 hover:text-white transition"
                  onClick={() => {
                    const textarea = document.getElementById('template-textarea') as HTMLTextAreaElement;
                    if (textarea) {
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const before = form.texto.substring(0, start);
                      const after = form.texto.substring(end);
                      const insert = `{${v}}`;
                      setForm({ ...form, texto: before + insert + after });
                      setTimeout(() => {
                        textarea.focus();
                        textarea.selectionStart = textarea.selectionEnd = start + insert.length;
                      }, 0);
                    } else {
                      setForm({ ...form, texto: form.texto + ` {${v}}` });
                    }
                  }}
                >
                  {'{'}{v}{'}'}
                </button>
              ))}
            </div>
            <textarea id="template-textarea" placeholder="Texto da Mensagem (use {variaveis})" rows={3} className="bg-gray-900 border border-gray-700 text-white rounded-lg w-full p-2" value={form.texto} onChange={e => setForm({ ...form, texto: e.target.value })} />
            {/* Variáveis detectadas automaticamente */}
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set((form.texto.match(/\{(.*?)\}/g) || []).map(v => v.replace(/[{}]/g, '')))).length > 0 ? (
                Array.from(new Set((form.texto.match(/\{(.*?)\}/g) || []).map(v => v.replace(/[{}]/g, '')))).map(v => (
                  <span key={v} className="bg-purple-900/60 text-purple-200 rounded-full px-3 py-1 text-xs font-semibold border border-purple-700">{'{'}{v}{'}'}</span>
                ))
              ) : (
                <span className="text-xs text-gray-400">Nenhuma variável detectada. Use {'{nome}'} por exemplo.</span>
              )}
            </div>
            {/* Visualização ao vivo da mensagem */}
            <div className="bg-[#181825] border border-purple-800 rounded-lg p-3 text-sm text-gray-200 mt-2">
              <div className="font-semibold text-purple-300 mb-1">Visualização:</div>
              <div className="whitespace-pre-line">{form.texto || 'Sua mensagem aparecerá aqui...'}</div>
            </div>
            <select className="bg-gray-900 border border-gray-700 text-white rounded px-3 py-2" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal({ type: null })} className="bg-gray-700 text-white">Cancelar</Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleNovo}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modal Editar Template */}
      <Dialog open={modal.type === 'editar'} onOpenChange={() => setModal({ type: null })}>
        <DialogContent className="bg-[#232a36] border border-purple-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input placeholder="Nome do Template" className="bg-gray-900 border border-gray-700 text-white" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
            <Input placeholder="Texto da Mensagem" className="bg-gray-900 border border-gray-700 text-white" value={form.texto} onChange={e => setForm({ ...form, texto: e.target.value })} />
            <Input placeholder="Variáveis (separadas por vírgula)" className="bg-gray-900 border border-gray-700 text-white" value={form.variaveis} onChange={e => setForm({ ...form, variaveis: e.target.value })} />
            <select className="bg-gray-900 border border-gray-700 text-white rounded px-3 py-2" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal({ type: null })} className="bg-gray-700 text-white">Cancelar</Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleEditar}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modal Enviar Notificação */}
      <Dialog open={modal.type === 'enviar'} onOpenChange={() => setModal({ type: null })}>
        <DialogContent className="bg-[#232a36] border border-purple-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar Notificação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-xs font-semibold">WhatsApp {isConnected ? 'Conectado' : 'Desconectado'} ({connectionStatus})</span>
            </div>
            <div>
              <label className="block text-gray-300 mb-1 font-medium">Destinatário</label>
              <Input placeholder="Buscar cliente ou revenda..." className="mb-2 bg-gray-900 border border-gray-700 text-white" onChange={e => setSelectedDest(e.target.value)} />
              <div className="max-h-40 overflow-y-auto rounded border border-gray-700 bg-[#181825] divide-y divide-gray-800">
                <div className="px-2 py-1 text-xs text-purple-400 font-bold">Clientes Ativos</div>
                {users.filter(u => (u.status || '').toLowerCase() === 'ativo' && (!searchValue || (u.real_name || u.name).toLowerCase().includes(searchValue.toLowerCase()))).length > 0 ? (
                  users.filter(u => (u.status || '').toLowerCase() === 'ativo' && (!searchValue || (u.real_name || u.name).toLowerCase().includes(searchValue.toLowerCase()))).map(u => (
                    <div key={u.id} className="px-3 py-2 hover:bg-purple-900/30 cursor-pointer flex items-center gap-2" onClick={() => setSelectedDest({ tipo: 'cliente', ...u })}>
                      <Users className="w-4 h-4 text-purple-400" /> <span>{u.real_name || u.name} <span className="text-xs text-gray-400">({u.email})</span></span>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-xs text-gray-500">Nenhum cliente encontrado.</div>
                )}
              </div>
              <div className="max-h-40 overflow-y-auto rounded border border-gray-700 bg-[#181825] divide-y divide-gray-800 mt-2">
                <div className="px-2 py-1 text-xs text-green-400 font-bold">Revendas Ativas</div>
                {resellers.filter(r => (r.status || '').toLowerCase() === 'active' && (!searchValue || (r.personal_name || r.username).toLowerCase().includes(searchValue.toLowerCase()))).length > 0 ? (
                  resellers.filter(r => (r.status || '').toLowerCase() === 'active' && (!searchValue || (r.personal_name || r.username).toLowerCase().includes(searchValue.toLowerCase()))).map(r => (
                    <div key={r.id} className="px-3 py-2 hover:bg-green-900/30 cursor-pointer flex items-center gap-2" onClick={() => setSelectedDest({ tipo: 'revenda', ...r })}>
                      <Users className="w-4 h-4 text-green-400" /> <span>{r.personal_name || r.username} <span className="text-xs text-gray-400">({r.email})</span></span>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-xs text-gray-500">Nenhuma revenda encontrada.</div>
                )}
              </div>
            </div>
            {selectedDest && (
              <div className="bg-[#181825] border border-purple-800 rounded-lg p-3 text-sm text-gray-200 mt-2">
                <div className="font-semibold text-purple-300 mb-1">Mensagem:</div>
                <div className="whitespace-pre-line">{selectedTemplate ? selectedTemplate.texto.replace(/\{(.*?)\}/g, (m, v) => selectedDest[v] || `{${v}}`) : ''}</div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal({ type: null })} className="bg-gray-700 text-white">Cancelar</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" disabled={!selectedDest || !isConnected} onClick={() => {
              if (!isConnected) {
                toast.error('O WhatsApp não está conectado!');
                return;
              }
              toast.success('Notificação enviada para ' + (selectedDest?.real_name || selectedDest?.personal_name || selectedDest?.name));
              setModal({ type: null });
            }}>Enviar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}