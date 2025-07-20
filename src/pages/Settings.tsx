import { useState } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const perfisMock = {
  nome: 'João',
  sobrenome: 'Silva',
  email: 'joao@exemplo.com',
  empresa: 'Minha Empresa LTDA',
  telefone: '+55 11 99999-9999',
  fuso: 'América/São Paulo',
};

export default function Settings() {
  const [tab, setTab] = useState('perfil');
  const [perfil, setPerfil] = useState(perfisMock);
  // Notificações
  const [notificacoes, setNotificacoes] = useState({ email: true, whatsapp: true, push: false, sms: false, clientes: true, cobrancas: true, promocoes: false });
  // Integrações
  const [integracoes, setIntegracoes] = useState({ whatsapp: false, google: false, zapier: false });
  const [modalIntegracao, setModalIntegracao] = useState<string | null>(null);
  // Faturamento
  const [plano, setPlano] = useState('Pro');
  const [faturas] = useState([
    { id: 1, data: '10/06/2024', valor: 'R$ 99,90', status: 'Paga' },
    { id: 2, data: '10/05/2024', valor: 'R$ 99,90', status: 'Paga' },
    { id: 3, data: '10/04/2024', valor: 'R$ 99,90', status: 'Paga' },
  ]);
  // Segurança
  const [senha, setSenha] = useState({ atual: '', nova: '', confirmar: '' });
  const [modal2FA, setModal2FA] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const handleChange = (e: any) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#09090b] p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Configurações</h1>
            <p className="text-gray-400 text-sm sm:text-base">Gerencie sua conta e integrações</p>
          </div>
          <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white px-4 sm:px-6 py-2 rounded font-semibold h-10 sm:h-auto">Salvar Alterações</Button>
        </div>
        <Tabs value={tab} onValueChange={setTab} className="mb-6">
          <TabsList className="flex flex-wrap bg-[#1f2937] rounded-lg w-full">
            <TabsTrigger value="perfil" className="flex-1 min-w-0 text-xs sm:text-sm data-[state=active]:bg-[#7e22ce] data-[state=active]:text-white">Perfil</TabsTrigger>
            <TabsTrigger value="notificacoes" className="flex-1 min-w-0 text-xs sm:text-sm data-[state=active]:bg-[#7e22ce] data-[state=active]:text-white">Notificações</TabsTrigger>
            <TabsTrigger value="integracoes" className="flex-1 min-w-0 text-xs sm:text-sm data-[state=active]:bg-[#7e22ce] data-[state=active]:text-white">Integrações</TabsTrigger>
            <TabsTrigger value="faturamento" className="flex-1 min-w-0 text-xs sm:text-sm data-[state=active]:bg-[#7e22ce] data-[state=active]:text-white">Faturamento</TabsTrigger>
            <TabsTrigger value="seguranca" className="flex-1 min-w-0 text-xs sm:text-sm data-[state=active]:bg-[#7e22ce] data-[state=active]:text-white">Segurança</TabsTrigger>
          </TabsList>
          <TabsContent value="perfil">
            <div className="bg-[#1f2937] rounded-xl p-3 sm:p-6 border border-purple-700/40 mt-4">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2">👤 Informações Pessoais</h2>
              <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">Atualize suas informações básicas</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div>
                  <label className="block text-gray-300 mb-1 font-medium">Nome</label>
                  <Input name="nome" value={perfil.nome} onChange={handleChange} className="bg-[#1f2937] border border-gray-700 text-white" />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 font-medium">Sobrenome</label>
                  <Input name="sobrenome" value={perfil.sobrenome} onChange={handleChange} className="bg-[#1f2937] border border-gray-700 text-white" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-1 font-medium">Email</label>
                <Input name="email" value={perfil.email} onChange={handleChange} className="bg-[#1f2937] border border-gray-700 text-white" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-1 font-medium">Empresa</label>
                <Input name="empresa" value={perfil.empresa} onChange={handleChange} className="bg-[#1f2937] border border-gray-700 text-white" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-1 font-medium">Telefone</label>
                <Input name="telefone" value={perfil.telefone} onChange={handleChange} className="bg-[#1f2937] border border-gray-700 text-white" />
              </div>
              <div className="mb-2">
                <label className="block text-gray-300 mb-1 font-medium">Fuso Horário</label>
                <Input name="fuso" value={perfil.fuso} onChange={handleChange} className="bg-[#1f2937] border border-gray-700 text-white" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="notificacoes">
            <div className="bg-[#1f2937] rounded-xl p-3 sm:p-6 border border-purple-700/40 mt-4">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Notificações</h2>
              <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">Gerencie como deseja ser avisado</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">E-mail</span>
                  <Switch checked={notificacoes.email} onCheckedChange={v => setNotificacoes(n => ({ ...n, email: v }))} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">WhatsApp</span>
                  <Switch checked={notificacoes.whatsapp} onCheckedChange={v => setNotificacoes(n => ({ ...n, whatsapp: v }))} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Push</span>
                  <Switch checked={notificacoes.push} onCheckedChange={v => setNotificacoes(n => ({ ...n, push: v }))} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">SMS</span>
                  <Switch checked={notificacoes.sms} onCheckedChange={v => setNotificacoes(n => ({ ...n, sms: v }))} />
                </div>
              </div>
              <div className="mb-4">
                <span className="block text-gray-300 font-medium mb-2">Alertas</span>
                <div className="flex items-center gap-4 mb-2">
                  <Switch checked={notificacoes.clientes} onCheckedChange={v => setNotificacoes(n => ({ ...n, clientes: v }))} />
                  <span className="text-gray-300">Novos clientes</span>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <Switch checked={notificacoes.cobrancas} onCheckedChange={v => setNotificacoes(n => ({ ...n, cobrancas: v }))} />
                  <span className="text-gray-300">Cobranças</span>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <Switch checked={notificacoes.promocoes} onCheckedChange={v => setNotificacoes(n => ({ ...n, promocoes: v }))} />
                  <span className="text-gray-300">Promoções</span>
                </div>
              </div>
              <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white mt-4">Salvar Preferências</Button>
            </div>
          </TabsContent>
          <TabsContent value="integracoes">
            <div className="bg-[#1f2937] rounded-xl p-6 border border-purple-700/40 mt-4">
              <h2 className="text-xl font-bold text-white mb-2">Integrações</h2>
              <p className="text-gray-400 mb-6">Conecte com outros sistemas</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">WhatsApp</span>
                  <Button size="sm" className={integracoes.whatsapp ? 'bg-green-600' : 'bg-[#1f2937] text-white'} onClick={() => setModalIntegracao('whatsapp')}>{integracoes.whatsapp ? 'Desconectar' : 'Conectar'}</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Google Calendar</span>
                  <Button size="sm" className={integracoes.google ? 'bg-green-600' : 'bg-[#1f2937] text-white'} onClick={() => setModalIntegracao('google')}>{integracoes.google ? 'Desconectar' : 'Conectar'}</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Zapier</span>
                  <Button size="sm" className={integracoes.zapier ? 'bg-green-600' : 'bg-[#1f2937] text-white'} onClick={() => setModalIntegracao('zapier')}>{integracoes.zapier ? 'Desconectar' : 'Conectar'}</Button>
                </div>
              </div>
              <Dialog open={!!modalIntegracao} onOpenChange={() => setModalIntegracao(null)}>
                <DialogContent className="bg-[#1f2937] border border-purple-700 text-white max-w-md">
                  <DialogHeader>
                    <DialogTitle>Configurar Integração</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <Input placeholder="Token/API Key" className="bg-[#1f2937] border border-gray-700 text-white" />
                  </div>
                  <DialogFooter>
                    <Button className="bg-[#1f2937] text-white" onClick={() => setModalIntegracao(null)}>Cancelar</Button>
                    <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white" onClick={() => { setIntegracoes(i => ({ ...i, [modalIntegracao!]: !i[modalIntegracao!] })); setModalIntegracao(null); }}>{integracoes[modalIntegracao!] ? 'Desconectar' : 'Conectar'}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
          <TabsContent value="faturamento">
            <div className="bg-[#1f2937] rounded-xl p-6 border border-purple-700/40 mt-4">
              <h2 className="text-xl font-bold text-white mb-2">Faturamento</h2>
              <p className="text-gray-400 mb-6">Gerencie seu plano e pagamentos</p>
              <div className="mb-4">
                <span className="block text-gray-300 font-medium mb-1">Plano Atual</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#7e22ce] font-bold">{plano}</span>
                  <Button size="sm" variant="outline" className="border-[#7e22ce] text-[#7e22ce]">Alterar Plano</Button>
                </div>
              </div>
              <div className="mb-4">
                <span className="block text-gray-300 font-medium mb-1">Histórico de Faturas</span>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-gray-400">
                        <th className="px-2 py-1 text-left">Data</th>
                        <th className="px-2 py-1 text-left">Valor</th>
                        <th className="px-2 py-1 text-left">Status</th>
                        <th className="px-2 py-1 text-left">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faturas.map(f => (
                        <tr key={f.id} className="border-b border-gray-700/20">
                          <td className="px-2 py-1 text-white">{f.data}</td>
                          <td className="px-2 py-1 text-white">{f.valor}</td>
                          <td className="px-2 py-1 text-white">{f.status}</td>
                          <td className="px-2 py-1"><Button size="sm" variant="outline" className="border-blue-600 text-blue-600">Download</Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white">Atualizar Dados de Pagamento</Button>
            </div>
          </TabsContent>
          <TabsContent value="seguranca">
            <div className="bg-[#1f2937] rounded-xl p-6 border border-purple-700/40 mt-4">
              <h2 className="text-xl font-bold text-white mb-2">Segurança</h2>
              <p className="text-gray-400 mb-6">Proteja sua conta</p>
              <div className="mb-4">
                <span className="block text-gray-300 font-medium mb-1">Alterar Senha</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                  <Input type="password" placeholder="Senha Atual" value={senha.atual} onChange={e => setSenha(s => ({ ...s, atual: e.target.value }))} />
                  <Input type="password" placeholder="Nova Senha" value={senha.nova} onChange={e => setSenha(s => ({ ...s, nova: e.target.value }))} />
                  <Input type="password" placeholder="Confirmar Nova Senha" value={senha.confirmar} onChange={e => setSenha(s => ({ ...s, confirmar: e.target.value }))} />
                </div>
                <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white">Salvar Nova Senha</Button>
              </div>
              <div className="mb-4">
                <span className="block text-gray-300 font-medium mb-1">Autenticação 2FA</span>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setModal2FA(true)}>Ativar 2FA</Button>
              </div>
              <div className="mb-4">
                <span className="block text-gray-300 font-medium mb-1">Exportar Dados</span>
                <Button className="bg-[#1f2937] text-white">Exportar</Button>
              </div>
              <div className="mb-4">
                <span className="block text-red-600 font-medium mb-1">Excluir Conta</span>
                <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setModalExcluir(true)}>Excluir Conta</Button>
              </div>
              {/* Modal 2FA */}
              <Dialog open={modal2FA} onOpenChange={setModal2FA}>
                <DialogContent className="bg-[#232a36] border border-purple-700 text-white max-w-md">
                  <DialogHeader>
                    <DialogTitle>Ativar Autenticação 2FA</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">Escaneie o QR Code no seu app autenticador.</div>
                  <DialogFooter>
                    <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white" onClick={() => setModal2FA(false)}>OK</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {/* Modal Excluir Conta */}
              <Dialog open={modalExcluir} onOpenChange={setModalExcluir}>
                <DialogContent className="bg-[#232a36] border border-purple-700 text-white max-w-md">
                  <DialogHeader>
                    <DialogTitle>Excluir Conta</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.</div>
                  <DialogFooter>
                    <Button className="bg-[#1f2937] text-white" onClick={() => setModalExcluir(false)}>Cancelar</Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setModalExcluir(false)}>Excluir</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}