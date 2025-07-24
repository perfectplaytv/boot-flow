import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Tv, 
  Radio, 
  ShoppingCart, 
  BarChart3, 
  Plus,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Activity,
  Play,
  Pause,
  Settings
} from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ResellerSidebar } from "@/components/sidebars/ResellerSidebar";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { useState } from "react";

const ResellerDashboard = () => {
  const [stats] = useState({
    totalClients: 156,
    monthlyRevenue: 12450,
    iptvUsers: 89,
    radioListeners: 234,
    conversionRate: 8.5
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [m3uUrl, setM3uUrl] = useState("");
  const [extractionError, setExtractionError] = useState("");
  const [extractionResult, setExtractionResult] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    realName: "",
    password: "",
    plan: "",
    status: "Ativo",
    expirationDate: "",
    bouquets: "",
    email: "",
    telegram: "",
    whatsapp: "",
    observations: ""
  });
  const isExtracting = false; // Substitua pela lógica real se necessário

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#09090b]">
        <ResellerSidebar />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Dashboard Revendedor</h1>
                <p className="text-gray-400">Gerencie seus clientes e vendas</p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Cliente
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-[#232a36] border border-purple-700 text-white p-0">
                  <DialogTitle>Adicionar Cliente</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do novo cliente para adicioná-lo à base de dados.
                  </DialogDescription>
                  <div className="p-2 sm:p-6 max-h-[80vh] overflow-y-auto scrollbar-hide">
                    {/* Extração M3U */}
                    <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-blue-300 font-medium">Extração M3U</span>
                        <div className="flex gap-2">
                          <Button className="bg-green-600 text-white hover:bg-green-700 px-3 py-1 rounded text-xs" disabled={isExtracting}>Teste</Button>
                          <Button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-1 rounded text-sm" disabled={isExtracting}>Extrair</Button>
                        </div>
                      </div>
                      <p className="text-xs text-blue-300 mb-2">Serve para importar dados automaticamente a partir de uma URL.</p>
                      <Input placeholder="Insira a URL do M3U para extrair automaticamente os dados do cliente..." className="bg-[#1f2937] border border-blue-800 text-white mb-2" value={m3uUrl} onChange={e => setM3uUrl(e.target.value)} />
                      {extractionError && (
                        <div className="bg-red-900/40 border border-red-700 text-red-300 text-xs rounded p-2 mb-2">❌ {extractionError}</div>
                      )}
                      {extractionResult && !extractionError && (
                        <div className="bg-green-900/40 border border-green-700 text-green-300 text-xs rounded p-2 mb-2">✅ {extractionResult.message}</div>
                      )}
                    </div>
                    {/* Informações Básicas */}
                    <div className="bg-[#1f2937] border border-gray-700 rounded-lg p-4 mb-4">
                      <span className="block text-white font-semibold mb-2">Informações Básicas</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-1">
                          <label className="block text-gray-300 mb-1 font-medium">Servidor *</label>
                          <select disabled className="w-full bg-[#23272f] border border-gray-700 text-gray-400 rounded px-3 py-2">
                            <option>IPTV 2</option>
                          </select>
                        </div>
                        <div className="col-span-1">
                          <label className="block text-gray-300 mb-1 font-medium">Plano *</label>
                          <select className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2" value={newUser.plan} onChange={e => setNewUser({ ...newUser, plan: e.target.value })}>
                            <option value="">Selecione um plano</option>
                            <option value="Trial">🟧 TESTE - COMPLETO</option>
                            <option value="Premium">🟦 PREMIUM - COMPLETO</option>
                            <option value="Basic">🟩 BÁSICO</option>
                          </select>
                        </div>
                        <div className="col-span-1">
                          <label className="block text-gray-300 mb-1 font-medium">Usuário *</label>
                          <input placeholder="Usuário" className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2 pr-8" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-gray-300 mb-1 font-medium">Senha</label>
                          <input type="text" placeholder="Senha" className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2 pr-8" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                          <div className="bg-blue-900/40 border border-blue-700 text-blue-300 text-xs rounded mt-2 p-2 space-y-1">Senha extraída automaticamente da URL M3U</div>
                        </div>
                        <div className="col-span-1">
                          <label className="block text-gray-300 mb-1 font-medium">Status</label>
                          <select className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2" value={newUser.status} onChange={e => setNewUser({ ...newUser, status: e.target.value })}>
                            <option value="Ativo">🟢 Ativo</option>
                            <option value="Inativo">🔴 Inativo</option>
                            <option value="Pendente">🟡 Pendente</option>
                          </select>
                        </div>
                        <div className="col-span-1">
                          <label className="block text-gray-300 mb-1 font-medium">Vencimento (Opcional)</label>
                          <input type="date" className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2" value={newUser.expirationDate} onChange={e => setNewUser({ ...newUser, expirationDate: e.target.value })} />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-gray-300 mb-1 font-medium">Bouquets</label>
                          <input placeholder="Bouquets extraídos automaticamente" className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2" value={newUser.bouquets} onChange={e => setNewUser({ ...newUser, bouquets: e.target.value })} />
                          <div className="bg-green-900/40 border border-green-700 text-green-400 text-xs rounded mt-2 p-2">Bouquets extraídos automaticamente da conta IPTV</div>
                        </div>
                        <div className="col-span-1">
                          <label className="block text-gray-300 mb-1 font-medium">Nome *</label>
                          <input placeholder="Digite o nome completo" className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2" value={newUser.realName} onChange={e => setNewUser({ ...newUser, realName: e.target.value })} required />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-gray-300 mb-1 font-medium">E-mail</label>
                          <input placeholder="Opcional" className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-gray-300 mb-1 font-medium">Telegram</label>
                          <input placeholder="Opcional" className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2" value={newUser.telegram} onChange={e => setNewUser({ ...newUser, telegram: e.target.value })} />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-gray-300 mb-1 font-medium">WhatsApp</label>
                          <input placeholder="Opcional" className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2" value={newUser.whatsapp} onChange={e => setNewUser({ ...newUser, whatsapp: e.target.value })} />
                          <span className="text-xs text-gray-400 mt-1 block">Incluindo o código do país - com ou sem espaço e traços - ex. 55 11 99999 3333</span>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-gray-300 mb-1 font-medium">Observações</label>
                          <textarea placeholder="Opcional" className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2 min-h-[60px]" value={newUser.observations} onChange={e => setNewUser({ ...newUser, observations: e.target.value })} />
                        </div>
                      </div>
                    </div>
                    {/* Configuração de Serviço */}
                    <div className="bg-[#1f2937] border border-gray-700 rounded-lg p-4 mb-4">
                      <span className="block text-purple-400 font-semibold mb-2">Configuração de Serviço</span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                        <div>
                          <label className="block text-gray-300 mb-1 font-medium">Classe de Serviço</label>
                          <select className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2">
                            <option value="">Selecione</option>
                            <option value="basico">Básico</option>
                            <option value="premium">Premium</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-1 font-medium">Plano</label>
                          <select className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2">
                            <option value="mensal">Mensal</option>
                            <option value="anual">Anual</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-1 font-medium">Status</label>
                          <select value={newUser.status} onChange={e => setNewUser({ ...newUser, status: e.target.value })} className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2">
                            <option value="Ativo">Ativo</option>
                            <option value="Inativo">Inativo</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-gray-300 mb-1 font-medium">Data de Renovação</label>
                          <input type="date" className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2" />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-1 font-medium">Número de Dispositivos</label>
                          <input type="number" min="1" className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2" />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-1 font-medium">Créditos</label>
                          <input type="number" min="0" className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2" />
                        </div>
                      </div>
                    </div>
                    {/* Informações Adicionais */}
                    <div className="bg-[#1f2937] border border-gray-700 rounded-lg p-4 mb-4">
                      <span className="block text-white font-semibold mb-2">Informações Adicionais</span>
                      <div className="flex items-center gap-2 mb-2">
                        <input type="checkbox" className="accent-purple-600" />
                        <span className="text-gray-300">Notificações via WhatsApp</span>
                      </div>
                      <label className="block text-gray-300 mb-1 font-medium">Anotações</label>
                      <textarea placeholder="Anotações..." className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2 min-h-[60px]" />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Fechar</Button>
                      <Button className="bg-green-600 text-white hover:bg-green-700">Adicionar Cliente</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-[#1f2937] hover:shadow-glow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Total de Clientes</CardTitle>
                  <Users className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalClients}</div>
                  <p className="text-xs text-gray-400">+12% este mês</p>
                </CardContent>
              </Card>

              <Card className="bg-[#1f2937] hover:shadow-glow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Receita Mensal</CardTitle>
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">R$ {stats.monthlyRevenue.toLocaleString()}</div>
                  <p className="text-xs text-gray-400">+15% este mês</p>
                </CardContent>
              </Card>

              <Card className="bg-[#1f2937] hover:shadow-glow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Usuários IPTV</CardTitle>
                  <Tv className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.iptvUsers}</div>
                  <p className="text-xs text-gray-400">57% dos clientes</p>
                </CardContent>
              </Card>

              <Card className="bg-[#1f2937] hover:shadow-glow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Taxa de Conversão</CardTitle>
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.conversionRate}%</div>
                  <p className="text-xs text-gray-400">+2.1% este mês</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-[#1f2937] cursor-pointer hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Tv className="w-6 h-6 text-purple-500" />
                    <CardTitle className="text-white">IPTV Pro</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">
                    Gerencie listas IPTV dos seus clientes
                  </p>
                  <Badge className="bg-green-500">Ativo</Badge>
                </CardContent>
              </Card>

              <Card className="bg-[#1f2937] cursor-pointer hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Radio className="w-6 h-6 text-blue-500" />
                    <CardTitle className="text-white">Rádio Web</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">
                    Configure rádios para seus clientes
                  </p>
                  <Badge className="bg-green-500">Ativo</Badge>
                </CardContent>
              </Card>

              <Card className="bg-[#1f2937] cursor-pointer hover:shadow-glow transition-all duration-300 opacity-50">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="w-6 h-6 text-green-500" />
                    <CardTitle className="text-white">E-commerce</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">
                    Venda produtos aos seus clientes
                  </p>
                  <Badge variant="outline">Upgrade Necessário</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ResellerDashboard;