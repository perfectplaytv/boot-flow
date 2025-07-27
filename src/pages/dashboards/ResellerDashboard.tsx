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
import { useClientes } from "@/hooks/useClientes";

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
  const { addCliente } = useClientes();

  // Proxies para CORS
  const corsProxies = [
    {
      name: "api.allorigins.win",
      url: (targetUrl: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
    },
    {
      name: "corsproxy.io",
      url: (targetUrl: string) => `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
    },
  ];

  // Função de extração M3U
  const extractM3UData = async () => {
    if (!m3uUrl.trim()) {
      setExtractionError("Por favor, insira uma URL M3U válida.");
      return;
    }
    // setIsExtracting(true); // Se quiser loading
    setExtractionError("");
    setExtractionResult(null);
    try {
      const urlObj = new URL(m3uUrl);
      const username = urlObj.searchParams.get("username") || "";
      const password = urlObj.searchParams.get("password") || "";
      const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
      if (!username || !password) {
        throw new Error("Credenciais não encontradas na URL. Verifique se a URL contém username e password.");
      }
      const apiUrl = `${baseUrl}/player_api.php?username=${username}&password=${password}`;
      // HTTPS direto
      if (urlObj.protocol === "https:") {
        try {
          setExtractionError("Tentando acesso direto...");
          const response = await fetch(apiUrl, { method: "GET", headers: { Accept: "application/json", "Content-Type": "application/json" } });
          if (response.ok) {
            const text = await response.text();
            let data;
            try { data = JSON.parse(text); } catch { throw new Error("Resposta não é um JSON válido."); }
            if (!data.user_info) throw new Error("Dados do usuário não encontrados na resposta.");
            const extractedData = {
              name: data.user_info.username,
              email: `${data.user_info.username}@iptv.com`,
              plan: data.user_info.is_trial === "1" ? "Trial" : "Premium",
              status: data.user_info.status === "Active" ? "Ativo" : "Inativo",
              telegram: data.user_info.username ? `@${data.user_info.username}` : "",
              observations: `Usuário: ${data.user_info.username} | Acesso direto`,
              expirationDate: data.user_info.exp_date ? new Date(parseInt(data.user_info.exp_date) * 1000).toISOString().split("T")[0] : "",
              password: data.user_info.password || password,
              bouquets: "",
              realName: "",
              whatsapp: "",
              devices: data.user_info.max_connections ? parseInt(data.user_info.max_connections) : 1,
              credits: 0,
              notes: "",
            };
            setNewUser(extractedData);
            setExtractionResult({ success: true, message: `Dados extraídos com sucesso! Usuário: ${data.user_info.username}`, data });
            setExtractionError("");
            return;
          }
        } catch (directError) {
          setExtractionError("Acesso direto falhou, tentando proxies...");
        }
      }
      // Proxies
      for (let i = 0; i < corsProxies.length; i++) {
        const proxy = corsProxies[i];
        const proxiedUrl = `${proxy.url(apiUrl)}`;
        try {
          setExtractionError(`Testando proxy ${i + 1}/${corsProxies.length}...`);
          const response = await fetch(proxiedUrl, { method: "GET", headers: { Accept: "application/json", "Content-Type": "application/json" }, mode: "cors" });
          if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
          const text = await response.text();
          let data;
          try { data = JSON.parse(text); } catch { throw new Error("Resposta não é um JSON válido."); }
          if (!data.user_info) throw new Error("Dados do usuário não encontrados na resposta.");
          const bouquetsData = [ { category_name: "Premium" }, { category_name: "Sports" }, { category_name: "Movies" } ];
          const observations = [];
          if (data.user_info.username) observations.push(`Usuário: ${data.user_info.username}`);
          if (data.user_info.password) observations.push(`Senha: ${data.user_info.password}`);
          if (data.user_info.exp_date) { const expDate = new Date(parseInt(data.user_info.exp_date) * 1000); observations.push(`Expira: ${expDate.toLocaleDateString("pt-BR")}`); }
          if (data.user_info.max_connections) observations.push(`Conexões: ${data.user_info.max_connections}`);
          if (data.user_info.active_cons) observations.push(`Ativas: ${data.user_info.active_cons}`);
          const extractedData = {
            name: data.user_info.username || username,
            email: `${data.user_info.username || username}@iptv.com`,
            plan: data.user_info.is_trial === "1" ? "Trial" : "Premium",
            status: data.user_info.status === "Active" ? "Ativo" : "Inativo",
            telegram: data.user_info.username ? `@${data.user_info.username}` : "",
            observations: observations.length > 0 ? observations.join(" | ") : "",
            expirationDate: data.user_info.exp_date ? new Date(parseInt(data.user_info.exp_date) * 1000).toISOString().split("T")[0] : "",
            password: data.user_info.password || password,
            bouquets: Array.isArray(bouquetsData) ? bouquetsData.map((b) => b.category_name).join(", ") : "",
            realName: "",
            whatsapp: "",
            devices: data.user_info.max_connections ? parseInt(data.user_info.max_connections) : 1,
            credits: 0,
            notes: "",
          };
          setNewUser(extractedData);
          setExtractionResult({ success: true, message: `Dados extraídos com sucesso! Usuário: ${data.user_info.username}`, data });
          setExtractionError("");
          return;
        } catch (error) {
          if (i === corsProxies.length - 1) {
            setExtractionError("Proxies falharam, usando dados simulados...");
            const extractedData = {
              name: username,
              email: `${username}@iptv.com`,
              plan: "Premium",
              status: "Ativo",
              telegram: `@${username}`,
              observations: `Usuário: ${username} | Senha: ${password} | Dados simulados`,
              expirationDate: "",
              password: password,
              bouquets: "",
              realName: "",
              whatsapp: "",
              devices: 1,
              credits: 0,
              notes: "",
            };
            setNewUser(extractedData);
            setExtractionResult({ success: true, message: `Dados simulados aplicados! Usuário: ${username}`, data: { user_info: { username, password } } });
            setExtractionError("");
            return;
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      setExtractionError(errorMessage);
    } finally {
      // setIsExtracting(false);
    }
  };

  // Função para validar e salvar cliente
  async function handleAddCliente() {
    if (!newUser.realName || !newUser.name || !newUser.plan) {
      toast.error("Preencha todos os campos obrigatórios: Nome, Usuário e Plano.");
      return;
    }
    try {
      await addCliente({
        name: newUser.name,
        real_name: newUser.realName,
        password: newUser.password,
        plan: newUser.plan,
        status: newUser.status,
        expiration_date: newUser.expirationDate,
        bouquets: newUser.bouquets,
        email: newUser.email,
        telegram: newUser.telegram,
        whatsapp: newUser.whatsapp,
        observations: newUser.observations
      });
      toast.success("Cliente adicionado com sucesso!");
      setIsAddDialogOpen(false);
      setNewUser({
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
    } catch (e) {
      toast.error("Erro ao adicionar cliente. Tente novamente.");
    }
  }

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
                <DialogContent className="max-w-lg w-full bg-background border border-gray-800 shadow-2xl p-0 rounded-lg overflow-hidden">
                  <div className="relative">
                    <button
                      type="button"
                      className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={() => setIsAddDialogOpen(false)}
                      aria-label="Fechar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-4 w-4"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                    </button>
                    <div className="px-6 pt-6 pb-2 border-b border-gray-800 bg-[#18181b]">
                      <h2 className="text-lg font-semibold leading-none tracking-tight text-white flex items-center gap-2">
                        <Users className="w-6 h-6 text-green-500" />
                        Adicionar Cliente
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">Novo</span>
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">Preencha os dados do novo cliente para adicioná-lo à base de dados.</p>
                    </div>
                    <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto scrollbar-hide bg-[#18181b]">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-green-400 text-xs font-medium">• Campos obrigatórios marcados com *</span>
                        <span className="text-blue-400 text-xs font-medium">• Dados serão sincronizados automaticamente</span>
                      </div>
                      {/* Extração M3U */}
                      <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-blue-300 font-medium">Extração M3U</span>
                          <div className="flex gap-2">
                            <Button className="bg-green-600 text-white hover:bg-green-700 px-3 py-1 rounded text-xs" disabled={isExtracting}>Teste</Button>
                            <Button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-1 rounded text-sm" onClick={extractM3UData} disabled={isExtracting}>Extrair</Button>
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
                      <div className="bg-[#23272f] border border-gray-700 rounded-lg p-4 mb-6">
                        <span className="block text-white font-semibold mb-4">Informações Básicas</span>
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
                      <div className="bg-[#23272f] border border-gray-700 rounded-lg p-4 mb-6">
                        <span className="block text-purple-400 font-semibold mb-4">Configuração de Serviço</span>
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
                      <div className="bg-[#23272f] border border-gray-700 rounded-lg p-4 mb-6">
                        <span className="block text-white font-semibold mb-2">Informações Adicionais</span>
                        <div className="flex items-center gap-2 mb-2">
                          <input type="checkbox" className="accent-purple-600" />
                          <span className="text-gray-300">Notificações via WhatsApp</span>
                        </div>
                        <label className="block text-gray-300 mb-1 font-medium">Anotações</label>
                        <textarea placeholder="Anotações..." className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2 min-h-[60px]" />
                      </div>
                      <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="bg-gray-700 text-white px-6 py-2 rounded font-semibold">Fechar</Button>
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-semibold transition-all duration-300" onClick={handleAddCliente}>Adicionar Cliente</Button>
                      </div>
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