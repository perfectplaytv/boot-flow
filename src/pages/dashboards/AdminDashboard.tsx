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
  Clock,
  Home
} from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/sidebars/AdminSidebar";
import { AIModalManager } from "@/components/modals/AIModalManager";
import { toast } from "sonner";

// Importando as páginas como componentes
import AdminUsers from "../AdminUsers";
import AdminResellers from "../AdminResellers";
import AdminIPTV from "../AdminIPTV";
import AdminRadio from "../AdminRadio";
import AdminAI from "../AdminAI";
import AdminEcommerce from "../AdminEcommerce";
import AdminGames from "../AdminGames";
import AdminAnalytics from "../AdminAnalytics";
import Settings from "../Settings";

const AdminDashboard = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<string>("dashboard");
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

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
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

  // Função para renderizar o conteúdo da página atual
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <div className="space-y-6">
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
                    Configure estações de rádio e streaming
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Ouvintes Ativos:</span>
                      <span className="text-sm font-semibold">{stats.radioListeners.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Estações Ativas:</span>
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
                    Gerencie produtos, vendas e configurações
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Vendas Hoje:</span>
                      <span className="text-sm font-semibold">R$ 12.450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Produtos Ativos:</span>
                      <span className="text-sm font-semibold text-green-600">24</span>
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
                    Sistema de pontos, conquistas e rankings
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Usuários Ativos:</span>
                      <span className="text-sm font-semibold">8.234</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Conquistas:</span>
                      <span className="text-sm font-semibold text-green-600">15</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-glow transition-all duration-300" onClick={() => handleModalOpen("analytics_management")}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-6 h-6 text-indigo-500" />
                    <CardTitle>Analytics</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Métricas, relatórios e insights
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Visualizações:</span>
                      <span className="text-sm font-semibold">45.678</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Conversão:</span>
                      <span className="text-sm font-semibold text-green-600">3.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-glow transition-all duration-300" onClick={() => handleModalOpen("ai_voice_config")}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Brain className="w-6 h-6 text-pink-500" />
                    <CardTitle>IA + Voz</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Configurações de inteligência artificial
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Interações:</span>
                      <span className="text-sm font-semibold">{stats.aiInteractions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Status:</span>
                      <span className="text-sm font-semibold text-green-600">Ativo</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Online Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.user}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                        <Badge variant="outline">{activity.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usuários Online</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {onlineUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(user.status)}
                          <p className="text-xs text-muted-foreground">{user.lastSeen}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "users":
        return <AdminUsers />;
      case "iptv":
        return <AdminIPTV />;
      case "radio":
        return <AdminRadio />;
      case "ai":
        return <AdminAI />;
      case "ecommerce":
        return <AdminEcommerce />;
      case "games":
        return <AdminGames />;
      case "analytics":
        return <AdminAnalytics />;
      case "settings":
        return <Settings />;
      default:
        return <div>Página não encontrada</div>;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar onPageChange={handlePageChange} currentPage={currentPage} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderCurrentPage()}
          </div>
        </main>

        {/* Modals */}
        <AIModalManager activeModal={activeModal} onClose={handleModalClose} />
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;