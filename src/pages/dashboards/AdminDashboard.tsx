import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Brain, 
  Users, 
  Tv, 
  Radio, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  Plus,
  MessageSquare,
  Gamepad2,
  Zap,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  DollarSign,
  TrendingUp,
  Activity,
  Clock
} from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/sidebars/AdminSidebar";
import { AIModalManager } from "@/components/modals/AIModalManager";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [stats] = useState({
    totalUsers: 15847,
    totalRevenue: 487230,
    activeResellers: 234,
    activeClients: 15613,
    monthlyGrowth: 12.5,
    iptvUsers: 8934,
    radioListeners: 12456,
    aiInteractions: 45678
  });

  const [recentActivity] = useState([
    { id: 1, type: "user_registered", user: "João Silva", time: "2 min atrás", status: "client" },
    { id: 2, type: "payment_received", user: "Maria Santos", amount: 297, time: "5 min atrás", status: "reseller" },
    { id: 3, type: "iptv_activated", user: "Pedro Oliveira", time: "8 min atrás", status: "client" },
    { id: 4, type: "ai_chat_started", user: "Ana Costa", time: "12 min atrás", status: "client" },
    { id: 5, type: "reseller_upgraded", user: "Carlos Lima", time: "15 min atrás", status: "reseller" }
  ]);

  const [onlineUsers] = useState([
    { id: 1, name: "João Silva", type: "Cliente", status: "online", lastSeen: "Agora" },
    { id: 2, name: "Maria Santos", type: "Revendedor", status: "online", lastSeen: "Agora" },
    { id: 3, name: "Pedro Oliveira", type: "Cliente", status: "away", lastSeen: "5 min atrás" },
    { id: 4, name: "Ana Costa", type: "Cliente", status: "online", lastSeen: "Agora" },
    { id: 5, name: "Carlos Lima", type: "Revendedor", status: "online", lastSeen: "Agora" }
  ]);

  const handleModalOpen = (modalType: string) => {
    setActiveModal(modalType);
    toast.success(`Modal ${modalType} aberto com sucesso!`);
  };

  const handleModalClose = () => {
    setActiveModal(null);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_registered": return <Users className="w-4 h-4 text-blue-500" />;
      case "payment_received": return <DollarSign className="w-4 h-4 text-green-500" />;
      case "iptv_activated": return <Tv className="w-4 h-4 text-purple-500" />;
      case "ai_chat_started": return <Brain className="w-4 h-4 text-orange-500" />;
      case "reseller_upgraded": return <TrendingUp className="w-4 h-4 text-indigo-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online": return <Badge className="bg-green-500">Online</Badge>;
      case "away": return <Badge variant="secondary">Ausente</Badge>;
      case "offline": return <Badge variant="destructive">Offline</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Dashboard Administrador</h1>
                <p className="text-muted-foreground">Gerencie toda a plataforma SaaS Pro</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button onClick={() => handleModalOpen("ai_config")}>
                  <Brain className="w-4 h-4 mr-2" />
                  Configurar IA
                </Button>
                <Button onClick={() => handleModalOpen("add_reseller")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Revendedor
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-glow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +{stats.monthlyGrowth}% em relação ao mês passado
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-glow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ {stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +15.3% em relação ao mês passado
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-glow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revendedores Ativos</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeResellers}</div>
                  <p className="text-xs text-muted-foreground">
                    +8.2% em relação ao mês passado
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-glow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Interações IA</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.aiInteractions.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +23.1% em relação ao mês passado
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-glow transition-all duration-300" onClick={() => handleModalOpen("iptv_management")}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Tv className="w-6 h-6 text-purple-500" />
                    <CardTitle>Sistema IPTV</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Gerencie servidores, canais e configurações IPTV
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Usuários Ativos:</span>
                      <span className="text-sm font-semibold">{stats.iptvUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Servidores Online:</span>
                      <span className="text-sm font-semibold text-green-600">12/12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-glow transition-all duration-300" onClick={() => handleModalOpen("radio_management")}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Radio className="w-6 h-6 text-blue-500" />
                    <CardTitle>Rádio Web</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Configure rádios e integrações multicanal
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Ouvintes Ativos:</span>
                      <span className="text-sm font-semibold">{stats.radioListeners.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Rádios Online:</span>
                      <span className="text-sm font-semibold text-green-600">8/8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-glow transition-all duration-300" onClick={() => handleModalOpen("ecommerce_management")}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="w-6 h-6 text-green-500" />
                    <CardTitle>E-commerce</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Gerencie produtos e vendas da plataforma
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Produtos Ativos:</span>
                      <span className="text-sm font-semibold">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Vendas Hoje:</span>
                      <span className="text-sm font-semibold text-green-600">R$ 12.845</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-glow transition-all duration-300" onClick={() => handleModalOpen("gamification_management")}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Gamepad2 className="w-6 h-6 text-orange-500" />
                    <CardTitle>Gamificação</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Configure regras de jogos e recompensas
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Jogadores Ativos:</span>
                      <span className="text-sm font-semibold">3.245</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Recompensas Ativas:</span>
                      <span className="text-sm font-semibold text-green-600">24</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-glow transition-all duration-300" onClick={() => handleModalOpen("ai_voice_config")}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Brain className="w-6 h-6 text-indigo-500" />
                    <CardTitle>IA + Voz</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Configure assistentes e vozes da IA
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Conversas Ativas:</span>
                      <span className="text-sm font-semibold">1.876</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Taxa de Resposta:</span>
                      <span className="text-sm font-semibold text-green-600">98.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-glow transition-all duration-300" onClick={() => handleModalOpen("analytics_view")}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-6 h-6 text-red-500" />
                    <CardTitle>Analytics</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Relatórios detalhados e métricas em tempo real
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Eventos Hoje:</span>
                      <span className="text-sm font-semibold">45.678</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Conversão:</span>
                      <span className="text-sm font-semibold text-green-600">8.9%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Online Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Atividade Recente</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.user}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                        {getStatusBadge(activity.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Usuários Online</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {onlineUsers.map((user) => (
                      <div key={user.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.type} • {user.lastSeen}</p>
                        </div>
                        {getStatusBadge(user.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Modal Manager */}
        <AIModalManager 
          activeModal={activeModal} 
          onClose={handleModalClose}
        />
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;