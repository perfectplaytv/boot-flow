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
  Home,
  Paintbrush,
  UserPlus
} from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/sidebars/AdminSidebar";
import { AIModalManager } from "@/components/modals/AIModalManager";
import { toast } from "sonner";
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Importando as páginas como componentes
import AdminUsers from "../AdminUsers";
import AdminResellers from "../AdminResellers";
import AdminIPTV from "../AdminIPTV";
import AdminRadio from "../AdminRadio";
import AdminAI from "../AdminAI";
import AdminEcommerce from "../AdminEcommerce";
import AdminGames from "../AdminGames";
import AdminAnalytics from "../AdminAnalytics";
import SettingsPage from "../Settings";
import AdminWhatsApp from '../AdminWhatsApp';
import AdminBranding from '../AdminBranding';
import AdminGateways from "../AdminGateways";
import AdminCobrancas from "../AdminCobrancas";
import Notifications from "../Notifications";

const AdminDashboard = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<string>("dashboard");
  const [resellers, setResellers] = useState<any[]>([]);
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

  const [brandingModal, setBrandingModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'grid'>('kanban');

  const handleModalOpen = (modalType: string) => {
    setActiveModal(modalType);
  };

  const handleModalClose = () => {
    setActiveModal(null);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setDrawerOpen(false); // Fecha o Drawer no mobile
  };

  const handleAddReseller = (reseller: any) => {
    setResellers([...resellers, reseller]);
    toast.success("Revendedor adicionado com sucesso!");
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

  // Kanban columns state
  const [kanbanColumns, setKanbanColumns] = useState({
    'servicos': {
      id: 'servicos',
      title: 'Serviços Principais',
      color: 'bg-blue-600',
      cards: [
    {
      id: 'iptv',
      content: (
        <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-500 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Tv className="w-6 h-6 text-purple-200" />
            <CardTitle className="text-white">Sistema IPTV</CardTitle>
          </div>
        </CardHeader>
      ),
      body: (
        <CardContent className="bg-[#1f2937] rounded-b-lg">
          <p className="text-gray-300 mb-4">Gerencie servidores, canais e configurações IPTV</p>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-sm text-gray-400">Usuários Ativos:</span><span className="text-sm font-semibold text-white">{stats.iptvUsers.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-400">Servidores Online:</span><span className="text-sm font-semibold text-green-400">12/12</span></div>
          </div>
        </CardContent>
      ),
          onClick: () => handleModalOpen("iptv")
    },
    {
      id: 'ecommerce',
      content: (
        <CardHeader className="bg-gradient-to-r from-green-700 to-green-500 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-6 h-6 text-green-200" />
            <CardTitle className="text-white">E-commerce</CardTitle>
          </div>
        </CardHeader>
      ),
      body: (
        <CardContent className="bg-[#1f2937] rounded-b-lg">
          <p className="text-gray-300 mb-4">Gerencie produtos, vendas e configurações</p>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-sm text-gray-400">Vendas Hoje:</span><span className="text-sm font-semibold text-white">R$ 12.450</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-400">Produtos Ativos:</span><span className="text-sm font-semibold text-green-400">24</span></div>
          </div>
        </CardContent>
      ),
          onClick: () => handleModalOpen("ecommerce")
        }
      ]
    },
    'personalizacao': {
      id: 'personalizacao',
      title: 'Personalização',
      color: 'bg-purple-600',
      cards: [
    {
          id: 'branding',
      content: (
            <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-t-lg">
          <div className="flex items-center space-x-2">
                <Paintbrush className="w-6 h-6 text-blue-200" />
                <CardTitle className="text-white">Customizar Marca</CardTitle>
          </div>
        </CardHeader>
      ),
      body: (
        <CardContent className="bg-[#1f2937] rounded-b-lg">
              <p className="text-gray-300 mb-4">Personalize a aparência, identidade visual e configurações white label da sua plataforma</p>
          <div className="space-y-2">
                <div className="flex justify-between"><span className="text-sm text-gray-400">Logo, cores, domínio, rodapé, etc.</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-400">Configurações WhiteLabel exclusivas</span></div>
          </div>
        </CardContent>
      ),
          onClick: () => handleModalOpen("branding")
        }
      ]
    },
    'analytics': {
      id: 'analytics',
      title: 'Analytics & IA',
      color: 'bg-red-600',
      cards: [
        {
          id: 'analytics-card',
      content: (
        <CardHeader className="bg-gradient-to-r from-red-700 to-red-500 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-red-200" />
            <CardTitle className="text-white">Analytics</CardTitle>
          </div>
        </CardHeader>
      ),
      body: (
        <CardContent className="bg-[#1f2937] rounded-b-lg">
          <p className="text-gray-300 mb-4">Métricas, relatórios e insights</p>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-sm text-gray-400">Visualizações:</span><span className="text-sm font-semibold text-white">45.678</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-400">Conversão:</span><span className="text-sm font-semibold text-green-400">3.2%</span></div>
          </div>
        </CardContent>
      ),
          onClick: () => handleModalOpen("analytics")
    },
    {
      id: 'ai',
      content: (
        <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-gray-200" />
            <CardTitle className="text-white">IA + Voz</CardTitle>
          </div>
        </CardHeader>
      ),
      body: (
        <CardContent className="bg-[#1f2937] rounded-b-lg">
          <p className="text-gray-300 mb-4">Configurações de inteligência artificial</p>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-sm text-gray-400">Interações:</span><span className="text-sm font-semibold text-white">45.678</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-400">Status:</span><span className="text-sm font-semibold text-green-400">Ativo</span></div>
          </div>
        </CardContent>
      ),
          onClick: () => handleModalOpen("ai")
        }
      ]
    },
    'gamificacao': {
      id: 'gamificacao',
      title: 'Gamificação',
      color: 'bg-yellow-600',
      cards: [
        {
          id: 'gamificacao-card',
          content: (
            <CardHeader className="bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-t-lg">
              <div className="flex items-center space-x-2">
                <Gamepad2 className="w-6 h-6 text-yellow-100" />
                <CardTitle className="text-white">Gamificação</CardTitle>
              </div>
            </CardHeader>
          ),
          body: (
            <CardContent className="bg-[#1f2937] rounded-b-lg">
              <p className="text-gray-300 mb-4">Sistema de pontos, conquistas e rankings</p>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-sm text-gray-400">Usuários Ativos:</span><span className="text-sm font-semibold text-white">8.234</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-400">Conquistas:</span><span className="text-sm font-semibold text-green-400">15</span></div>
              </div>
            </CardContent>
          ),
          onClick: () => handleModalOpen("gamificacao")
    }
      ]
    }
  });

  // Legacy kanban cards for backward compatibility
  const initialKanbanCards = Object.values(kanbanColumns).flatMap(column => column.cards);
  const [kanbanCards, setKanbanCards] = useState(initialKanbanCards);

  // Componente SortableCard
  function SortableCard({ id, content, body, onClick }: any) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 50 : 1,
      opacity: isDragging ? 0.8 : 1,
      cursor: isDragging ? 'grabbing' : 'grab',
    };
    
    const handleClick = (e: React.MouseEvent) => {
      // Prevenir clique durante o drag
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      
      // Adicionar log para debug
      console.log('Card clicked:', id, 'isDragging:', isDragging);
      
      if (onClick) {
        onClick();
        // Mostrar toast de confirmação
        toast.success(`Abrindo ${id}...`, {
          description: `Modal aberto com sucesso`,
          duration: 1500,
        });
      }
    };
    
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        {...attributes} 
        className="select-none touch-manipulation"
        data-card-id={id}
      >
        <Card 
          className={`cursor-grab active:cursor-grabbing hover:shadow-glow hover:scale-105 transition-all duration-300 transform relative group ${
            isDragging ? 'shadow-2xl scale-110 rotate-2 z-50' : ''
          }`} 
          onClick={handleClick} 
          onMouseDown={(e) => {
            // Aplicar listeners de drag apenas no mouse down
            if (listeners.onMouseDown) {
              listeners.onMouseDown(e);
            }
          }}
          onTouchStart={(e) => {
            // Aplicar listeners de touch apenas no touch start
            if (listeners.onTouchStart) {
              listeners.onTouchStart(e);
            }
          }}
          tabIndex={0} 
          role="button" 
          aria-pressed="false"
          style={{
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >
          {content}
          {body}
          {/* Drag indicator */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="w-6 h-6 bg-gray-600/80 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 6h8v2H8V6zm0 5h8v2H8v-2zm0 5h8v2H8v-2z"/>
              </svg>
            </div>
          </div>
          
          {/* Click indicator */}
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="w-6 h-6 bg-blue-600/80 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
          {/* Drag overlay */}
          {isDragging && (
            <div className="absolute inset-0 bg-blue-500/20 rounded-lg border-2 border-blue-500 border-dashed pointer-events-none"></div>
          )}
          {/* Hover effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 hover:from-blue-500/10 hover:to-purple-500/10 rounded-lg transition-all duration-300 pointer-events-none"></div>
          
          {/* Click effect */}
          <div className="absolute inset-0 bg-blue-500/0 hover:bg-blue-500/5 rounded-lg transition-all duration-200 pointer-events-none"></div>
          
          {/* Border highlight on hover */}
          <div className="absolute inset-0 border-2 border-transparent hover:border-blue-500/30 rounded-lg transition-all duration-300 pointer-events-none"></div>
        </Card>
      </div>
    );
  }

  // Função para renderizar o conteúdo da página atual
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard Admin</h1>
                <p className="text-gray-400 text-sm sm:text-base">Visão geral do sistema</p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-2">
                <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white h-10 sm:h-auto" onClick={() => handlePageChange("resellers")}> 
                  <Plus className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Novo Revenda</span>
                  <span className="sm:hidden">Revenda</span>
                </Button>
                <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white h-10 sm:h-auto" onClick={() => handlePageChange("users")}> 
                  <UserPlus className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Novo Cliente</span>
                  <span className="sm:hidden">Cliente</span>
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <Card className="hover:shadow-glow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Total de Usuários</CardTitle>
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <div className="text-lg sm:text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +{stats.monthlyGrowth}% em relação ao mês passado
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-glow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Receita Total</CardTitle>
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <div className="text-lg sm:text-2xl font-bold">R$ {stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +15.3% em relação ao mês passado
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-glow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Revendedores Ativos</CardTitle>
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <div className="text-lg sm:text-2xl font-bold">{stats.activeResellers}</div>
                  <p className="text-xs text-muted-foreground">
                    +8.2% em relação ao mês passado
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-glow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Interações IA</CardTitle>
                  <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <div className="text-lg sm:text-2xl font-bold">{stats.aiInteractions.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +23.1% em relação ao mês passado
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Cards Section */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {viewMode === 'kanban' ? 'Sistema Kanban' : 'Serviços do Sistema'}
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-base">
                    {viewMode === 'kanban' 
                      ? 'Organize seus serviços por categoria' 
                      : 'Acesse todos os serviços do sistema'
                    }
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    onClick={() => setViewMode('grid')}
                    className="bg-[#1f2937] text-white border border-gray-700 hover:bg-[#23272f] h-10 sm:h-auto"
                  >
                    <svg className="w-4 h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span className="hidden sm:inline">Grid</span>
                  </Button>
                  <Button
                    variant={viewMode === 'kanban' ? 'default' : 'outline'}
                    onClick={() => setViewMode('kanban')}
                    className="bg-[#1f2937] text-white border border-gray-700 hover:bg-[#23272f] h-10 sm:h-auto"
                  >
                    <svg className="w-4 h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="hidden sm:inline">Kanban</span>
                  </Button>
                  {viewMode === 'kanban' && (
                    <>
                      <Badge className="bg-blue-600 text-white flex items-center gap-1 animate-pulse text-xs">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                        <span className="hidden sm:inline">Arraste para reorganizar</span>
                        <span className="sm:hidden">Arrastar</span>
                      </Badge>
                      <Badge className="bg-green-600 text-white flex items-center gap-1 text-xs">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="hidden sm:inline">Clique para abrir modal</span>
                        <span className="sm:hidden">Clique</span>
                      </Badge>
                      <Badge className="bg-purple-600 text-white flex items-center gap-1 text-xs">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="hidden sm:inline">Modais Funcionais</span>
                        <span className="sm:hidden">Modais</span>
                      </Badge>
                    </>
                  )}
                </div>
              </div>
              
              {viewMode === 'kanban' ? (
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={Object.values(kanbanColumns).flatMap(column => column.cards).map(card => card.id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                      {Object.values(kanbanColumns).map(column => (
                        <div key={column.id} className="space-y-4">
                          {/* Column Header */}
                          <div className={`${column.color} rounded-lg p-4 text-white shadow-lg`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{column.title}</h3>
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                              <Badge className="bg-white/20 text-white font-medium">{column.cards.length}</Badge>
                            </div>
                          </div>
                          
                          {/* Column Cards */}
                          <div 
                            className="space-y-4 min-h-[200px] bg-[#1f2937]/50 rounded-lg p-4 border border-gray-700 transition-all duration-200 hover:border-gray-600"
                            data-column-id={column.id}
                            data-droppable="true"
                          >
                            {column.cards.map(card => (
                              <SortableCard 
                                key={card.id} 
                                id={card.id} 
                                content={card.content} 
                                body={card.body} 
                                onClick={card.onClick} 
                              />
                            ))}
                            {column.cards.length === 0 && (
                              <div 
                                className="flex items-center justify-center h-32 text-gray-500 border-2 border-dashed border-gray-600 rounded-lg transition-all duration-200 hover:border-blue-500 hover:text-blue-400 group"
                                data-droppable="true"
                                data-column-id={column.id}
                              >
                                <div className="text-center">
                                  <svg className="w-8 h-8 mx-auto mb-2 text-gray-600 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                  </svg>
                                  <p className="text-sm group-hover:text-blue-400 transition-colors">Solte um card aqui</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                /* Layout Grid Original */
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={Object.values(kanbanColumns).flatMap(column => column.cards).map(card => card.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                      {Object.values(kanbanColumns).flatMap(column => column.cards).map(card => (
                        <SortableCard 
                          key={card.id} 
                          id={card.id} 
                          content={card.content} 
                          body={card.body} 
                          onClick={card.onClick} 
                        />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
              )}
            </div>

            {/* Recent Activity & Online Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{activity.user}</p>
                          <p className="text-xs text-gray-400">{activity.time}</p>
                        </div>
                        <Badge variant="outline">{activity.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Usuários Online</CardTitle>
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
                            <p className="text-sm font-medium text-white">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(user.status)}
                          <p className="text-xs text-gray-400">{user.lastSeen}</p>
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
      case "resellers":
        return <AdminResellers />;
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
        return <SettingsPage />;
      case "whatsapp":
        return <AdminWhatsApp />;
      case "branding":
        return <AdminBranding />;
      case "gateways":
        return <AdminGateways />;
      case "cobrancas":
        return <AdminCobrancas />;
      case "notificacoes":
        return <Notifications />;
      default:
        return <div>Página não encontrada</div>;
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (!active || !over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    console.log('Drag ended:', { activeId, overId }); // Debug log
    
    // Se o card foi solto sobre outro card ou área vazia
    if (activeId !== overId) {
      setKanbanColumns(prevColumns => {
        const newColumns = { ...prevColumns };
        
        // Encontrar a coluna de origem
        let sourceColumnId = null;
        let sourceCardIndex = -1;
        
        Object.keys(newColumns).forEach(columnId => {
          const cardIndex = newColumns[columnId].cards.findIndex(card => card.id === activeId);
          if (cardIndex !== -1) {
            sourceColumnId = columnId;
            sourceCardIndex = cardIndex;
          }
        });
        
        if (!sourceColumnId) {
          console.log('Source column not found for card:', activeId);
          return newColumns;
        }
        
        const cardToMove = newColumns[sourceColumnId].cards[sourceCardIndex];
        console.log('Moving card:', cardToMove.id, 'from column:', sourceColumnId);
        
        // Remover da coluna de origem
        newColumns[sourceColumnId].cards.splice(sourceCardIndex, 1);
        
        // Verificar se foi solto sobre outro card
        let targetColumnId = null;
        let targetCardIndex = -1;
        
        Object.keys(newColumns).forEach(columnId => {
          const cardIndex = newColumns[columnId].cards.findIndex(card => card.id === overId);
          if (cardIndex !== -1) {
            targetColumnId = columnId;
            targetCardIndex = cardIndex;
          }
        });
        
        if (targetColumnId) {
          // Solto sobre outro card
          console.log('Dropped on card in column:', targetColumnId, 'at position:', targetCardIndex);
          if (sourceColumnId === targetColumnId) {
            // Mesma coluna, reordenar
            newColumns[targetColumnId].cards.splice(targetCardIndex, 0, cardToMove);
          } else {
            // Colunas diferentes, adicionar na posição do card de destino
            newColumns[targetColumnId].cards.splice(targetCardIndex, 0, cardToMove);
          }
        } else {
          // Solto em área vazia - tentar encontrar a coluna pelo data-column-id
          const columnElement = over.data?.current?.columnId || over.id;
          console.log('Dropped in empty area, trying column:', columnElement);
          
          if (columnElement && newColumns[columnElement]) {
            // Adicionar no final da coluna
            newColumns[columnElement].cards.push(cardToMove);
            console.log('Added to column:', columnElement);
          } else {
            // Se não encontrou coluna válida, voltar para a origem
            console.log('No valid column found, returning to source');
            newColumns[sourceColumnId].cards.splice(sourceCardIndex, 0, cardToMove);
          }
        }
        
        console.log('New columns state:', newColumns);
        
        // Mostrar toast de sucesso
        toast.success(`Card movido com sucesso!`, {
          description: `Card reorganizado no sistema Kanban`,
          duration: 2000,
        });
        
        return newColumns;
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#09090b]">
        {/* Menu lateral desktop */}
        <div className="hidden lg:block">
          <AdminSidebar onPageChange={handlePageChange} currentPage={currentPage} />
        </div>
        {/* Menu mobile com Drawer/hamburguer */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <AdminSidebar onPageChange={handlePageChange} currentPage={currentPage} isMobile onClose={() => setDrawerOpen(false)} />
        </div>
        
        <main className="flex-1 p-6 max-w-full w-full overflow-x-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {currentPage === "dashboard" && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
                    <p className="text-gray-400">Visão geral do sistema</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white" onClick={() => handlePageChange("resellers")}> 
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Revenda
                    </Button>
                    <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white" onClick={() => handlePageChange("users")}> 
                      <UserPlus className="w-4 h-4 mr-2" />
                      Novo Cliente
                    </Button>
                  </div>
                </div>
                {/* Cards de métricas do Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
                  <Card className="bg-[#1f2937] text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Total de Usuários</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
                      <p className="text-xs text-blue-400 mt-1">+12.5% em relação ao mês passado</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-[#1f2937] text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Receita Total</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">R$ {stats.totalRevenue.toLocaleString()}</div>
                      <p className="text-xs text-blue-400 mt-1">+15.3% em relação ao mês passado</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-[#1f2937] text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Revendedores Ativos</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{stats.activeResellers}</div>
                      <p className="text-xs text-blue-400 mt-1">+8.2% em relação ao mês passado</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-[#1f2937] text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Interações IA</CardTitle>
                      <Brain className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{stats.aiInteractions.toLocaleString()}</div>
                      <p className="text-xs text-blue-400 mt-1">+23.1% em relação ao mês passado</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Cards Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {viewMode === 'kanban' ? 'Sistema Kanban' : 'Serviços do Sistema'}
                      </h2>
                      <p className="text-gray-400">
                        {viewMode === 'kanban' 
                          ? 'Organize seus serviços por categoria' 
                          : 'Acesse todos os serviços do sistema'
                        }
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        onClick={() => setViewMode('grid')}
                        className="bg-[#1f2937] text-white border border-gray-700 hover:bg-[#23272f] h-10 sm:h-auto"
                      >
                        <svg className="w-4 h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        <span className="hidden sm:inline">Grid</span>
                      </Button>
                      <Button
                        variant={viewMode === 'kanban' ? 'default' : 'outline'}
                        onClick={() => setViewMode('kanban')}
                        className="bg-[#1f2937] text-white border border-gray-700 hover:bg-[#23272f] h-10 sm:h-auto"
                      >
                        <svg className="w-4 h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="hidden sm:inline">Kanban</span>
                      </Button>
                      {viewMode === 'kanban' && (
                        <>
                          <Badge className="bg-blue-600 text-white flex items-center gap-1 animate-pulse">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                            Arraste para reorganizar
                          </Badge>
                          <Badge className="bg-green-600 text-white flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Clique para abrir modal
                          </Badge>
                          <Badge className="bg-purple-600 text-white flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Modais Funcionais
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {viewMode === 'kanban' ? (
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={Object.values(kanbanColumns).flatMap(column => column.cards).map(card => card.id)} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {Object.values(kanbanColumns).map(column => (
                            <div key={column.id} className="space-y-4">
                              {/* Column Header */}
                              <div className={`${column.color} rounded-lg p-4 text-white shadow-lg`}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-lg">{column.title}</h3>
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  </div>
                                  <Badge className="bg-white/20 text-white font-medium">{column.cards.length}</Badge>
                                </div>
                              </div>
                              
                              {/* Column Cards */}
                              <div 
                                className="space-y-4 min-h-[200px] bg-[#1f2937]/50 rounded-lg p-4 border border-gray-700 transition-all duration-200 hover:border-gray-600"
                                data-column-id={column.id}
                              >
                                {column.cards.map(card => (
                                  <SortableCard 
                                    key={card.id} 
                                    id={card.id} 
                                    content={card.content} 
                                    body={card.body} 
                                    onClick={card.onClick} 
                                  />
                                ))}
                                {column.cards.length === 0 && (
                                  <div className="flex items-center justify-center h-32 text-gray-500 border-2 border-dashed border-gray-600 rounded-lg transition-all duration-200 hover:border-blue-500 hover:text-blue-400">
                                    <div className="text-center">
                                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                      </svg>
                                      <p className="text-sm">Solte um card aqui</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
                  ) : (
                    /* Layout Grid Original */
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={Object.values(kanbanColumns).flatMap(column => column.cards).map(card => card.id)} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {Object.values(kanbanColumns).flatMap(column => column.cards).map(card => (
                            <SortableCard 
                              key={card.id} 
                              id={card.id} 
                              content={card.content} 
                              body={card.body} 
                              onClick={card.onClick} 
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-[#1f2937]">
                    <CardHeader>
                      <CardTitle className="text-white">Atividade Recente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-center space-x-3">
                            {getActivityIcon(activity.type)}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white">{activity.user}</p>
                              <p className="text-xs text-gray-400">{activity.time}</p>
                            </div>
                            <Badge variant="outline">{activity.status}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-[#1f2937]">
                    <CardHeader>
                      <CardTitle className="text-white">Usuários Online</CardTitle>
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
                                <p className="text-sm font-medium text-white">{user.name}</p>
                                <p className="text-xs text-gray-400">{user.type}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(user.status)}
                              <p className="text-xs text-gray-400">{user.lastSeen}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
            {/* Renderização das outras páginas continua igual */}
            {currentPage === "users" && <AdminUsers />}
            {currentPage === "resellers" && <AdminResellers resellers={resellers} onAddReseller={handleAddReseller} />}
            {currentPage === "iptv" && <AdminIPTV />}
            {currentPage === "radio" && <AdminRadio />}
            {currentPage === "ai" && <AdminAI />}
            {currentPage === "ecommerce" && <AdminEcommerce />}
            {currentPage === "games" && <AdminGames />}
            {currentPage === "analytics" && <AdminAnalytics />}
            {currentPage === "settings" && <SettingsPage />}
            {currentPage === "whatsapp" && <AdminWhatsApp />}
            {currentPage === "branding" && <AdminBranding />}
            {currentPage === "gateways" && <AdminGateways />}
            {currentPage === "cobrancas" && <AdminCobrancas />}
            {currentPage === "notificacoes" && <Notifications />}
          </div>
        </main>

        {/* Modals */}
        <AIModalManager 
          activeModal={activeModal} 
          onClose={handleModalClose} 
          onAddReseller={handleAddReseller}
        />

        {/* Modal Customizar Marca */}
        <Dialog open={brandingModal} onOpenChange={setBrandingModal}>
          <DialogContent className="max-w-4xl bg-[#232a36] border border-purple-700 text-white p-0">
            <div className="overflow-y-auto max-h-[80vh]">
              <AdminBranding />
            </div>
          </DialogContent>
        </Dialog>

        {/* Modais dos cards Kanban */}
        <Dialog open={activeModal === 'iptv_management'} onOpenChange={handleModalClose}>
          <DialogContent className="max-w-2xl bg-[#232a36] text-white">
            <div className="font-bold text-xl mb-2">Gestão de IPTV</div>
            <AdminIPTV />
          </DialogContent>
        </Dialog>
        <Dialog open={activeModal === 'ecommerce_management'} onOpenChange={handleModalClose}>
          <DialogContent className="max-w-2xl bg-[#232a36] text-white">
            <div className="font-bold text-xl mb-2">Gestão de E-commerce</div>
            <AdminEcommerce />
          </DialogContent>
        </Dialog>
        <Dialog open={activeModal === 'gamification_management'} onOpenChange={handleModalClose}>
          <DialogContent className="max-w-2xl bg-[#232a36] text-white">
            <div className="font-bold text-xl mb-2">Gestão de Gamificação</div>
            <AdminGames />
          </DialogContent>
        </Dialog>
        <Dialog open={activeModal === 'analytics_management'} onOpenChange={handleModalClose}>
          <DialogContent className="max-w-2xl bg-[#232a36] text-white">
            <div className="font-bold text-xl mb-2">Resumo de Analytics</div>
            <AdminAnalytics />
          </DialogContent>
        </Dialog>
        <Dialog open={activeModal === 'ai_voice_config'} onOpenChange={handleModalClose}>
          <DialogContent className="max-w-2xl bg-[#232a36] text-white">
            <div className="font-bold text-xl mb-2">Configurações de IA + Voz</div>
            <AdminAI />
          </DialogContent>
        </Dialog>
        <Dialog open={activeModal === 'branding_management'} onOpenChange={handleModalClose}>
          <DialogContent className="max-w-2xl bg-[#232a36] text-white">
            <div className="font-bold text-xl mb-2">Customizar Marca</div>
            <AdminBranding />
          </DialogContent>
        </Dialog>

        {/* Modais para cada card */}
        <Dialog open={activeModal === 'iptv'} onOpenChange={() => setActiveModal(null)}>
          <DialogContent className="bg-[#1f2937] text-white max-w-2xl w-full p-0 rounded-xl shadow-xl border border-gray-700 flex flex-col items-center justify-center max-h-[80vh] overflow-y-auto scrollbar-hide">
            <div className="p-6 w-full flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-2 text-center">Sistema IPTV</h2>
              <p className="text-gray-400 mb-4 text-center">Gerencie canais, servidores e configurações do IPTV.</p>
              <div className="w-full max-w-lg space-y-2 mb-4">
                <div className="flex justify-between"><span className="text-gray-300">Servidor:</span><span className="font-semibold">SaaS Pro IPTV</span></div>
                <div className="flex justify-between"><span className="text-gray-300">URL:</span><span className="font-semibold">http://iptv.saaspro.com.br</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Máx. Conexões:</span><span className="font-semibold">5</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Filmes:</span><span className="font-semibold text-green-400">Ativado</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Séries:</span><span className="font-semibold text-green-400">Ativado</span></div>
                <div className="flex justify-between"><span className="text-gray-300">TV ao Vivo:</span><span className="font-semibold text-green-400">Ativado</span></div>
              </div>
              <div className="w-full max-w-lg mb-4">
                <h3 className="text-lg font-semibold mb-2">Canais</h3>
                <div className="overflow-x-auto rounded border border-gray-700">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-[#23272f]">
                      <tr>
                        <th className="px-2 py-1 text-gray-400 font-medium">Nome</th>
                        <th className="px-2 py-1 text-gray-400 font-medium">Categoria</th>
                        <th className="px-2 py-1 text-gray-400 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">Globo</td>
                        <td className="px-2 py-1">Entretenimento</td>
                        <td className="px-2 py-1"><span className="text-green-400">Ativo</span></td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">SBT</td>
                        <td className="px-2 py-1">Entretenimento</td>
                        <td className="px-2 py-1"><span className="text-green-400">Ativo</span></td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">Record</td>
                        <td className="px-2 py-1">Entretenimento</td>
                        <td className="px-2 py-1"><span className="text-red-400">Inativo</span></td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">Band</td>
                        <td className="px-2 py-1">Entretenimento</td>
                        <td className="px-2 py-1"><span className="text-green-400">Ativo</span></td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">CNN Brasil</td>
                        <td className="px-2 py-1">Notícias</td>
                        <td className="px-2 py-1"><span className="text-green-400">Ativo</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <Button className="mt-2 bg-purple-600 hover:bg-purple-700 text-white w-40" onClick={() => setActiveModal(null)}>Fechar</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={activeModal === 'branding'} onOpenChange={() => setActiveModal(null)}>
          <DialogContent className="bg-[#1f2937] text-white max-w-2xl w-full p-0 rounded-xl shadow-xl border border-gray-700 flex flex-col items-center justify-center max-h-[80vh] overflow-y-auto scrollbar-hide">
            <div className="p-6 w-full flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-2 text-center">Customizar Marca</h2>
              <p className="text-gray-400 mb-4 text-center">Personalize a aparência, identidade visual e configurações white label da sua plataforma.</p>
              <div className="w-full max-w-lg space-y-2 mb-4">
                <div className="flex justify-between"><span className="text-gray-300">Empresa:</span><span className="font-semibold">Sua Empresa Ltda</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Slogan:</span><span className="font-semibold">Seu slogan aqui</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Website:</span><span className="font-semibold">https://suaempresa.com</span></div>
                <div className="flex justify-between"><span className="text-gray-300">E-mail:</span><span className="font-semibold">contato@suaempresa.com</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Telefone:</span><span className="font-semibold">99999-9999</span></div>
              </div>
              <div className="w-full max-w-lg mb-4 flex gap-4 justify-center">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-400 mb-1">Logo</span>
                  <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center">
                    <span className="text-gray-500">Logo</span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-400 mb-1">Favicon</span>
                  <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center">
                    <span className="text-gray-500">Favicon</span>
                  </div>
                </div>
              </div>
              <div className="w-full max-w-lg mb-4">
                <h3 className="text-lg font-semibold mb-2">Preview</h3>
                <div className="bg-[#181e29] rounded-lg p-4 flex flex-col items-center">
                  <div className="flex gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-gray-400" />
                    <div className="w-4 h-4 rounded-full bg-gray-600" />
                  </div>
                  <span className="text-white font-bold">Sua Empresa Ltda</span>
                  <span className="text-gray-400 text-xs">Seu slogan aqui</span>
                </div>
              </div>
              <Button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white w-40" onClick={() => setActiveModal(null)}>Fechar</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={activeModal === 'ecommerce'} onOpenChange={() => setActiveModal(null)}>
          <DialogContent className="bg-[#1f2937] text-white max-w-2xl w-full p-0 rounded-xl shadow-xl border border-gray-700 flex flex-col items-center justify-center max-h-[80vh] overflow-y-auto scrollbar-hide">
            <div className="p-6 w-full flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-2 text-center">E-commerce</h2>
              <p className="text-gray-400 mb-4 text-center">Gerencie produtos, vendas e configurações da loja.</p>
              <div className="w-full max-w-lg space-y-2 mb-4">
                <div className="flex justify-between"><span className="text-gray-300">Loja:</span><span className="font-semibold">SaaS Pro Store</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Moeda:</span><span className="font-semibold">BRL</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Taxa de Imposto:</span><span className="font-semibold">10%</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Avaliações:</span><span className="font-semibold text-green-400">Ativado</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Lista de Desejos:</span><span className="font-semibold text-green-400">Ativado</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Cupons:</span><span className="font-semibold text-green-400">Ativado</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Estoque Automático:</span><span className="font-semibold text-green-400">Ativado</span></div>
              </div>
              <div className="w-full max-w-lg mb-4">
                <h3 className="text-lg font-semibold mb-2">Produtos</h3>
                <div className="overflow-x-auto rounded border border-gray-700">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-[#23272f]">
                      <tr>
                        <th className="px-2 py-1 text-gray-400 font-medium">Nome</th>
                        <th className="px-2 py-1 text-gray-400 font-medium">Categoria</th>
                        <th className="px-2 py-1 text-gray-400 font-medium">Preço</th>
                        <th className="px-2 py-1 text-gray-400 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">Plano Básico</td>
                        <td className="px-2 py-1">Planos</td>
                        <td className="px-2 py-1">R$ 29,90</td>
                        <td className="px-2 py-1"><span className="text-green-400">Ativo</span></td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">Plano Pro</td>
                        <td className="px-2 py-1">Planos</td>
                        <td className="px-2 py-1">R$ 59,90</td>
                        <td className="px-2 py-1"><span className="text-green-400">Ativo</span></td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">Plano Enterprise</td>
                        <td className="px-2 py-1">Planos</td>
                        <td className="px-2 py-1">R$ 99,90</td>
                        <td className="px-2 py-1"><span className="text-green-400">Ativo</span></td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">Suporte Premium</td>
                        <td className="px-2 py-1">Serviços</td>
                        <td className="px-2 py-1">R$ 149,90</td>
                        <td className="px-2 py-1"><span className="text-green-400">Ativo</span></td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">Consultoria</td>
                        <td className="px-2 py-1">Serviços</td>
                        <td className="px-2 py-1">R$ 299,90</td>
                        <td className="px-2 py-1"><span className="text-green-400">Ativo</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="w-full max-w-lg mb-4">
                <h3 className="text-lg font-semibold mb-2">Vendas Recentes</h3>
                <div className="overflow-x-auto rounded border border-gray-700">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-[#23272f]">
                      <tr>
                        <th className="px-2 py-1 text-gray-400 font-medium">Cliente</th>
                        <th className="px-2 py-1 text-gray-400 font-medium">Produto</th>
                        <th className="px-2 py-1 text-gray-400 font-medium">Valor</th>
                        <th className="px-2 py-1 text-gray-400 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">João Silva</td>
                        <td className="px-2 py-1">Plano Pro</td>
                        <td className="px-2 py-1">R$ 59,90</td>
                        <td className="px-2 py-1"><span className="text-green-400">Pago</span></td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">Maria Santos</td>
                        <td className="px-2 py-1">Plano Básico</td>
                        <td className="px-2 py-1">R$ 29,90</td>
                        <td className="px-2 py-1"><span className="text-green-400">Pago</span></td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">Pedro Oliveira</td>
                        <td className="px-2 py-1">Suporte Premium</td>
                        <td className="px-2 py-1">R$ 149,90</td>
                        <td className="px-2 py-1"><span className="text-yellow-400">Pendente</span></td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">Ana Costa</td>
                        <td className="px-2 py-1">Plano Enterprise</td>
                        <td className="px-2 py-1">R$ 99,90</td>
                        <td className="px-2 py-1"><span className="text-green-400">Pago</span></td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">Carlos Lima</td>
                        <td className="px-2 py-1">Consultoria</td>
                        <td className="px-2 py-1">R$ 299,90</td>
                        <td className="px-2 py-1"><span className="text-green-400">Pago</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <Button className="mt-2 bg-green-600 hover:bg-green-700 text-white w-40" onClick={() => setActiveModal(null)}>Fechar</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={activeModal === 'gamificacao'} onOpenChange={() => setActiveModal(null)}>
          <DialogContent className="bg-[#1f2937] text-white max-w-2xl w-full p-0 rounded-xl shadow-xl border border-gray-700 flex flex-col items-center justify-center max-h-[80vh] overflow-y-auto scrollbar-hide">
            <div className="p-6 w-full flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-2 text-center">Gamificação</h2>
              <p className="text-gray-400 mb-4 text-center">Gerencie sistema de pontos, conquistas e rankings.</p>
              <div className="w-full max-w-lg space-y-2 mb-4">
                <div className="flex justify-between"><span className="text-gray-300">Gamificação:</span><span className="font-semibold text-green-400">Ativada</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Pontos por Login:</span><span className="font-semibold">10</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Pontos por Compra:</span><span className="font-semibold">50</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Pontos por Suporte:</span><span className="font-semibold">30</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Ranking:</span><span className="font-semibold text-green-400">Ativado</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Conquistas:</span><span className="font-semibold text-green-400">Ativado</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Níveis:</span><span className="font-semibold text-green-400">Ativado</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Nível Máximo:</span><span className="font-semibold">100</span></div>
              </div>
              <div className="w-full max-w-lg mb-4">
                <h3 className="text-lg font-semibold mb-2">Conquistas Recentes</h3>
                <div className="overflow-x-auto rounded border border-gray-700">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-[#23272f]">
                      <tr>
                        <th className="px-2 py-1 text-gray-400 font-medium">Nome</th>
                        <th className="px-2 py-1 text-gray-400 font-medium">Descrição</th>
                        <th className="px-2 py-1 text-gray-400 font-medium">Pontos</th>
                        <th className="px-2 py-1 text-gray-400 font-medium">Desbloqueios</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">Primeiro Login</td>
                        <td className="px-2 py-1">Faça seu primeiro login no sistema</td>
                        <td className="px-2 py-1">10</td>
                        <td className="px-2 py-1">156</td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">Comprador Frequente</td>
                        <td className="px-2 py-1">Realize 10 compras</td>
                        <td className="px-2 py-1">50</td>
                        <td className="px-2 py-1">45</td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">Suporte Ativo</td>
                        <td className="px-2 py-1">Use o suporte 5 vezes</td>
                        <td className="px-2 py-1">30</td>
                        <td className="px-2 py-1">78</td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">Streamer</td>
                        <td className="px-2 py-1">Assista 100 horas de conteúdo</td>
                        <td className="px-2 py-1">100</td>
                        <td className="px-2 py-1">23</td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">Mestre da IA</td>
                        <td className="px-2 py-1">Interaja 50 vezes com a IA</td>
                        <td className="px-2 py-1">75</td>
                        <td className="px-2 py-1">12</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <Button className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white w-40" onClick={() => setActiveModal(null)}>Fechar</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={activeModal === 'analytics'} onOpenChange={() => setActiveModal(null)}>
          <DialogContent className="bg-[#1f2937] text-white max-w-2xl w-full p-0 rounded-xl shadow-xl border border-gray-700 flex flex-col items-center justify-center max-h-[80vh] overflow-y-auto scrollbar-hide">
            <div className="p-6 w-full flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-2 text-center">Analytics</h2>
              <p className="text-gray-400 mb-4 text-center">Acompanhe métricas e performance do sistema.</p>
              <div className="w-full max-w-lg space-y-2 mb-4">
                <div className="flex justify-between"><span className="text-gray-300">Total de Usuários:</span><span className="font-semibold">1.256</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Usuários Ativos:</span><span className="font-semibold">892</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Receita:</span><span className="font-semibold">R$ 45.678,90</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Visualizações:</span><span className="font-semibold">45.678</span></div>
                <div className="flex justify-between"><span className="text-gray-300">Taxa de Conversão:</span><span className="font-semibold text-green-400">3,2%</span></div>
              </div>
              <div className="w-full max-w-lg mb-4">
                <h3 className="text-lg font-semibold mb-2">Páginas Mais Visitadas</h3>
                <div className="overflow-x-auto rounded border border-gray-700">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-[#23272f]">
                      <tr>
                        <th className="px-2 py-1 text-gray-400 font-medium">Página</th>
                        <th className="px-2 py-1 text-gray-400 font-medium">Visualizações</th>
                        <th className="px-2 py-1 text-gray-400 font-medium">Crescimento</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">Dashboard</td>
                        <td className="px-2 py-1">1.234</td>
                        <td className="px-2 py-1 text-green-400">+15,2%</td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">Produtos</td>
                        <td className="px-2 py-1">987</td>
                        <td className="px-2 py-1 text-green-400">+8,7%</td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">Suporte</td>
                        <td className="px-2 py-1">756</td>
                        <td className="px-2 py-1 text-red-400">-2,1%</td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">Perfil</td>
                        <td className="px-2 py-1">654</td>
                        <td className="px-2 py-1 text-green-400">+12,3%</td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">Configurações</td>
                        <td className="px-2 py-1">432</td>
                        <td className="px-2 py-1 text-green-400">+5,6%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="w-full max-w-lg mb-4">
                <h3 className="text-lg font-semibold mb-2">Atividade por Hora</h3>
                <div className="overflow-x-auto rounded border border-gray-700">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-[#23272f]">
                      <tr>
                        <th className="px-2 py-1 text-gray-400 font-medium">Hora</th>
                        <th className="px-2 py-1 text-gray-400 font-medium">Usuários Ativos</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">00:00</td>
                        <td className="px-2 py-1">45</td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">04:00</td>
                        <td className="px-2 py-1">23</td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">08:00</td>
                        <td className="px-2 py-1">156</td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">12:00</td>
                        <td className="px-2 py-1">234</td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">16:00</td>
                        <td className="px-2 py-1">198</td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">20:00</td>
                        <td className="px-2 py-1">167</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <Button className="mt-2 bg-red-600 hover:bg-red-700 text-white w-40" onClick={() => setActiveModal(null)}>Fechar</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={activeModal === 'add_reseller'} onOpenChange={() => setActiveModal(null)}>
          <DialogContent className="bg-[#1f2937] text-white max-w-4xl w-full p-0 rounded-xl shadow-xl border border-gray-700 flex flex-col max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="p-6 w-full">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Adicionar um Revenda</h2>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </Button>
                </div>
              </div>

              {/* Form */}
              <form className="space-y-6">
                {/* Primeira linha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Usuário */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                      Usuário <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      placeholder="Obrigatório" 
                      className="bg-[#23272f] border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-blue-400 text-xs">
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        <span>O campo usuário só pode conter letras, números e traços.</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-400 text-xs">
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        <span>O usuário precisa ter no mínimo 6 caracteres.</span>
                      </div>
                    </div>
                  </div>

                  {/* Senha */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                      Senha <span className="text-red-500">*</span>
                    </label>
                                         <div className="flex gap-2">
                       <Input 
                         placeholder="Digite a senha"
                         className="bg-[#23272f] border-gray-600 text-white flex-1 placeholder-gray-400 focus:border-blue-500"
                       />
                      <Button type="button" variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-blue-400 text-xs">
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        <span>A senha precisa ter no mínimo 8 caracteres.</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-400 text-xs">
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        <span>Pelo menos 8 caracteres de comprimento, mas 14 ou mais é melhor.</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-400 text-xs">
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        <span>Uma combinação de letras maiúsculas, letras minúsculas, números e símbolos.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkbox Forçar mudança de senha */}
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="forcePasswordChange" className="rounded border-gray-600 bg-[#23272f] text-blue-500 focus:ring-blue-500" />
                  <label htmlFor="forcePasswordChange" className="text-sm text-gray-300">
                    Forçar revenda a mudar a senha no próximo login
                  </label>
                </div>

                {/* Segunda linha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Permissão */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                      Permissão <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full bg-[#23272f] border border-gray-600 text-white rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none">
                      <option value="">Selecione</option>
                      <option value="admin">Administrador</option>
                      <option value="reseller">Revendedor</option>
                      <option value="subreseller">Sub-Revendedor</option>
                    </select>
                  </div>

                  {/* Créditos */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                      Créditos <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </Button>
                                             <Input 
                         placeholder="0"
                         className="bg-[#23272f] border-gray-600 text-white text-center placeholder-gray-400 focus:border-blue-500"
                       />
                      <Button type="button" variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </Button>
                    </div>
                    <div className="text-blue-400 text-xs">Mínimo de 10 créditos</div>
                  </div>
                </div>

                {/* Servidores */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Servidores (Opcional)</label>
                  <select className="w-full bg-[#23272f] border border-gray-600 text-white rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none">
                    <option value="">Opcional</option>
                    <option value="server1">Servidor 1</option>
                    <option value="server2">Servidor 2</option>
                    <option value="server3">Servidor 3</option>
                  </select>
                  <div className="text-blue-400 text-xs">
                    Selecione os servidores que esse revenda pode ter acesso. Deixe em branco para permitir todos os servidores. Essa configuração afeta tanto a revenda quanto as subrevendas.
                  </div>
                </div>

                {/* Terceira linha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Revenda Master */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Revenda Master</label>
                                         <Input 
                       placeholder="Nome da revenda master"
                       className="bg-[#23272f] border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                     />
                  </div>

                  {/* Desativar login se não recarregar */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                      Desativar login se não recarregar - em dias
                    </label>
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </Button>
                                             <Input 
                         placeholder="0"
                         className="bg-[#23272f] border-gray-600 text-white text-center placeholder-gray-400 focus:border-blue-500"
                       />
                      <Button type="button" variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </Button>
                    </div>
                    <div className="text-blue-400 text-xs">Deixe 0 para desativar essa opção</div>
                  </div>
                </div>

                {/* Configuração de Revenda Mensalista */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="monthlyReseller" className="rounded border-gray-600 bg-[#23272f] text-blue-500 focus:ring-blue-500" />
                    <label htmlFor="monthlyReseller" className="text-sm text-gray-300">
                      Configuração de Revenda Mensalista
                    </label>
                  </div>
                  <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-3">
                    <div className="text-green-400 text-sm">
                      Apenas você pode visualizar os detalhes pessoais deste revenda.
                    </div>
                  </div>
                </div>

                {/* Informações Pessoais */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Informações Pessoais (Opcional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Nome</label>
                      <Input 
                        placeholder="Nome completo"
                        className="bg-[#23272f] border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">E-mail</label>
                      <Input 
                        placeholder="email@exemplo.com"
                        className="bg-[#23272f] border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Telegram</label>
                      <Input 
                        placeholder="@usuario"
                        className="bg-[#23272f] border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">WhatsApp</label>
                      <Input 
                        placeholder="55 11 99999 3333"
                        className="bg-[#23272f] border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      />
                      <div className="text-blue-400 text-xs">
                        Incluindo o código do país - com ou sem espaço e traços - ex. 55 11 99999 3333
                      </div>
                    </div>
                  </div>
                </div>

                {/* Observações */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Observações (Opcional)</label>
                  <textarea 
                    rows={4}
                    placeholder="Adicione observações sobre este revendedor..."
                    className="w-full bg-[#23272f] border border-gray-600 text-white rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none placeholder-gray-400 resize-none"
                  />
                </div>

                {/* Botões */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveModal(null)}
                    className="border-gray-600 text-gray-400 hover:text-white"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Salvar
                  </Button>
                </div>
              </form>

              {/* Footer */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700 text-xs text-gray-500">
                <span>2025© ALLEZCONECCT v3.50</span>
                <span>Powered by Sigma | Notificações</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={activeModal === 'ai'} onOpenChange={() => setActiveModal(null)}>
          <DialogContent className="bg-[#1f2937] text-white max-w-2xl w-full p-0 rounded-xl shadow-xl border border-gray-700 flex flex-col items-center justify-center max-h-[80vh] overflow-y-auto scrollbar-hide">
            <div className="p-6 w-full flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-2 text-center">IA + Voz</h2>
              <p className="text-gray-400 mb-4 text-center">Crie vozes personalizadas e processe áudios com IA.</p>
              <div className="w-full max-w-lg mb-4">
                <h3 className="text-lg font-semibold mb-2">Estúdio de Voz</h3>
                <div className="bg-[#23272f] rounded-lg p-4 mb-2">
                  <span className="block text-gray-300 mb-1">Text-to-Speech</span>
                  <span className="block text-xs text-gray-400 mb-2">Converta texto em áudio com vozes personalizadas.</span>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-gray-400">Selecione uma voz, digite o texto e gere o áudio.</span>
                    <span className="text-xs text-gray-400">Ajuste velocidade e tom conforme necessário.</span>
                  </div>
                </div>
              </div>
              <div className="w-full max-w-lg mb-4">
                <h3 className="text-lg font-semibold mb-2">Perfis de Voz</h3>
                <div className="overflow-x-auto rounded border border-gray-700">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-[#23272f]">
                      <tr>
                        <th className="px-2 py-1 text-gray-400 font-medium">Nome</th>
                        <th className="px-2 py-1 text-gray-400 font-medium">Gênero</th>
                        <th className="px-2 py-1 text-gray-400 font-medium">Tom</th>
                        <th className="px-2 py-1 text-gray-400 font-medium">Uso</th>
                        <th className="px-2 py-1 text-gray-400 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">Maria - Vendas</td>
                        <td className="px-2 py-1">Feminina</td>
                        <td className="px-2 py-1">Profissional</td>
                        <td className="px-2 py-1">1247</td>
                        <td className="px-2 py-1"><span className="text-green-400">Ativa</span></td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">João - Suporte</td>
                        <td className="px-2 py-1">Masculina</td>
                        <td className="px-2 py-1">Amigável</td>
                        <td className="px-2 py-1">856</td>
                        <td className="px-2 py-1"><span className="text-green-400">Ativa</span></td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">Ana - Corporativo</td>
                        <td className="px-2 py-1">Feminina</td>
                        <td className="px-2 py-1">Formal</td>
                        <td className="px-2 py-1">432</td>
                        <td className="px-2 py-1"><span className="text-green-400">Ativa</span></td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">Pedro - Executivo</td>
                        <td className="px-2 py-1">Masculina</td>
                        <td className="px-2 py-1">Autoritativo</td>
                        <td className="px-2 py-1">298</td>
                        <td className="px-2 py-1"><span className="text-green-400">Ativa</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="w-full max-w-lg mb-4">
                <h3 className="text-lg font-semibold mb-2">Transcrições Recentes</h3>
                <div className="overflow-x-auto rounded border border-gray-700">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-[#23272f]">
                      <tr>
                        <th className="px-2 py-1 text-gray-400 font-medium">Nome</th>
                        <th className="px-2 py-1 text-gray-400 font-medium">Tempo</th>
                        <th className="px-2 py-1 text-gray-400 font-medium">Status</th>
                        <th className="px-2 py-1 text-gray-400 font-medium">Resumo</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">cliente_reclamacao_001.mp3</td>
                        <td className="px-2 py-1">2:34</td>
                        <td className="px-2 py-1"><span className="text-green-400">Processado</span></td>
                        <td className="px-2 py-1">Cliente reclama sobre atraso na entrega</td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">feedback_positivo_002.mp3</td>
                        <td className="px-2 py-1">1:45</td>
                        <td className="px-2 py-1"><span className="text-yellow-400">Processando</span></td>
                        <td className="px-2 py-1">---</td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="px-2 py-1">duvida_produto_003.mp3</td>
                        <td className="px-2 py-1">3:12</td>
                        <td className="px-2 py-1"><span className="text-green-400">Processado</span></td>
                        <td className="px-2 py-1">Interessado no plano Pro, quer detalhes sobre IA</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <Button className="mt-2 bg-gray-700 hover:bg-gray-800 text-white w-40" onClick={() => setActiveModal(null)}>Fechar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;