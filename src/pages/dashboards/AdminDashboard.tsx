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
  Paintbrush
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
    const { attributes, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 50 : 1,
      opacity: isDragging ? 0.8 : 1,
      cursor: isDragging ? 'grabbing' : 'grab',
    };
    return (
      <div ref={setNodeRef} style={style} {...attributes} className="select-none">
        <Card 
          className={`cursor-pointer hover:shadow-glow hover:scale-105 transition-all duration-300 transform relative ${
            isDragging ? 'shadow-2xl scale-110 rotate-2' : ''
          }`} 
          onClick={onClick} 
          tabIndex={0} 
          role="button" 
          aria-pressed="false"
        >
          {content}
          {body}
          {/* Drag indicator */}
          <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
            <div className="w-3 h-3 bg-gray-400 rounded-full flex items-center justify-center">
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 6h8v2H8V6zm0 5h8v2H8v-2zm0 5h8v2H8v-2z"/>
              </svg>
            </div>
          </div>
          {/* Drag overlay */}
          {isDragging && (
            <div className="absolute inset-0 bg-blue-500/20 rounded-lg border-2 border-blue-500 border-dashed"></div>
          )}
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
                <p className="text-gray-400">Visão geral do sistema</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white" onClick={() => handleModalOpen("ai_config")}> 
                  <Brain className="w-4 h-4 mr-2" />
                  Configurar IA
                </Button>
                <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white" onClick={() => handleModalOpen("add_reseller")}> 
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
                    className="bg-[#1f2937] text-white border border-gray-700 hover:bg-[#23272f]"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'kanban' ? 'default' : 'outline'}
                    onClick={() => setViewMode('kanban')}
                    className="bg-[#1f2937] text-white border border-gray-700 hover:bg-[#23272f]"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Kanban
                  </Button>
                  {viewMode === 'kanban' && (
                    <>
                      <Badge className="bg-blue-600 text-white flex items-center gap-1">
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
                        Clique para abrir
                      </Badge>
                    </>
                  )}
                </div>
              </div>
              
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
        return <AdminResellers resellers={resellers} onAddReseller={handleAddReseller} />;
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
        
        if (!sourceColumnId) return newColumns;
        
        const cardToMove = newColumns[sourceColumnId].cards[sourceCardIndex];
        
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
          if (sourceColumnId === targetColumnId) {
            // Mesma coluna, reordenar
            newColumns[targetColumnId].cards.splice(targetCardIndex, 0, cardToMove);
          } else {
            // Colunas diferentes, adicionar na posição do card de destino
            newColumns[targetColumnId].cards.splice(targetCardIndex, 0, cardToMove);
          }
        } else {
          // Solto em área vazia - verificar se foi solto sobre uma coluna
          const columnElement = over.data?.current?.columnId;
          if (columnElement && newColumns[columnElement]) {
            // Adicionar no final da coluna
            newColumns[columnElement].cards.push(cardToMove);
          } else {
            // Se não encontrou coluna válida, voltar para a origem
            newColumns[sourceColumnId].cards.splice(sourceCardIndex, 0, cardToMove);
          }
        }
        
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
                    <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white" onClick={() => handleModalOpen("ai_config")}> 
                      <Brain className="w-4 h-4 mr-2" />
                      Configurar IA
                    </Button>
                    <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white" onClick={() => handleModalOpen("add_reseller")}> 
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Revendedor
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