import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClientes } from '@/hooks/useClientes';
import { useRevendas } from '@/hooks/useRevendas';
import { useRealtimeClientes, useRealtimeRevendas } from '@/hooks/useRealtime';
import useDashboardData from '@/hooks/useDashboardData';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
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
  Clock,
  Home,
  Paintbrush,
  UserPlus,
  Bell,
  RefreshCw,
  AlertCircle,
  Calendar
} from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ClientSidebar } from "@/components/sidebars/ClientSidebar";
import { AIModalManager } from "@/components/modals/AIModalManager";
import { ThemeToggle } from "@/components/theme-toggle";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Importando as páginas como componentes
import ClientClients from "../client/ClientClients";
import ClientResellers from "../client/ClientResellers";
import ClientBilling from "../client/ClientBilling";
import ClientNotifications from "../client/ClientNotifications";
import ClientWhatsApp from "../client/ClientWhatsApp";
import ClientGateways from "../client/ClientGateways";
import ClientBranding from "../client/ClientBranding";
import ClientShop from "../client/ClientShop";
import ClientAI from "../client/ClientAI";
import ClientGames from "../client/ClientGames";
import ClientAnalytics from "../client/ClientAnalytics";
import ClientSettings from "../client/ClientSettings";
import ClientProfile from "../client/ClientProfile";

// Wrapper para ClientResellers que aceita callback quando um revendedor é criado
const ClientResellersWrapper = ({ onResellerCreated, onCloseModal }: { onResellerCreated: () => void; onCloseModal: () => void }) => {
  useEffect(() => {
    const handleResellerCreated = () => {
      onResellerCreated();
    };
    
    const handleCloseModal = () => {
      onCloseModal();
    };
    
    // Escutar evento de revendedor criado
    window.addEventListener('reseller-created', handleResellerCreated);
    // Escutar evento para fechar modal
    window.addEventListener('close-reseller-modal', handleCloseModal);
    
    return () => {
      window.removeEventListener('reseller-created', handleResellerCreated);
      window.removeEventListener('close-reseller-modal', handleCloseModal);
    };
  }, [onResellerCreated, onCloseModal]);
  
  return <ClientResellers />;
};

const ClientDashboard = () => {
  // Obter o cliente logado para filtrar dados
  const { user } = useAuth();
  
  // --- Estados para integração APIBrasil QR Code ---
  const [apiBrasilConfig, setApiBrasilConfig] = useState(() => {
    const saved = localStorage.getItem('apiBrasilConfig');
    return saved ? JSON.parse(saved) : { bearerToken: '', profileId: '' };
  });
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isLoadingQR, setIsLoadingQR] = useState(false);
  // --- Fim estados integração APIBrasil ---
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [clientModal, setClientModal] = useState(false);
  const [resellerModal, setResellerModal] = useState(false);
  const [brandingModal, setBrandingModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'kanban'>('grid');
  // Usando o hook personalizado para gerenciar os dados do dashboard
  const { stats, loading: loadingStats, error: statsError, refresh: refreshStats } = useDashboardData();

  // Estados para o modal de cliente
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    plan: "",
    price: "",
    status: "Ativo",
    telegram: "",
    observations: "",
    expirationDate: "",
    password: "",
    bouquets: "",
    realName: "",
    whatsapp: "",
    devices: 0,
    credits: 0,
    notes: "",
    server: "",
    m3u_url: "",
  });

  // Estados para o modal de revendedor
  const [newReseller, setNewReseller] = useState({
    username: "",
    password: "",
    force_password_change: false,
    permission: "",
    credits: 10,
    servers: "",
    master_reseller: "",
    disable_login_days: 0,
    monthly_reseller: false,
    personal_name: "",
    email: "",
    telegram: "",
    whatsapp: "",
    observations: ""
  });

  const [isAddingReseller, setIsAddingReseller] = useState(false);

  // Estados para a extração M3U
  const [m3uUrl, setM3uUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<any>(null);
  const [extractionError, setExtractionError] = useState("");
  const [isAddingUser, setIsAddingUser] = useState(false);

  // Hooks para dados de usuários e revendedores com atualização em tempo real
  const { data: realtimeClientes, error: clientesError, isConnected: clientesConnected } = useRealtimeClientes();
  const { data: realtimeRevendas, error: revendasError, isConnected: revendasConnected } = useRealtimeRevendas();
  
  // Hooks para funções de atualização e dados
  const { clientes: clientesFromHook, fetchClientes, addCliente: addClienteHook } = useClientes();
  const { revendas: revendasFromHook, fetchRevendas } = useRevendas();
  
  // Estados locais para os dados
  const [clientes, setClientes] = useState<any[]>([]);
  const [revendas, setRevendas] = useState<any[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [loadingRevendas, setLoadingRevendas] = useState(true);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#09090b]">
        <ClientSidebar onPageChange={setCurrentPage} currentPage={currentPage} />
        
        <main className="flex-1 p-6">
          {currentPage === "dashboard" && (
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard Cliente</h1>
                <p className="text-gray-400 text-sm sm:text-base">Visão geral do sistema</p>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat IA
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-[#1f2937] hover:shadow-glow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Horas IPTV</CardTitle>
                  <Tv className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.iptvHours}h</div>
                  <p className="text-xs text-gray-400">Este mês</p>
                </CardContent>
              </Card>

              <Card className="bg-[#1f2937] hover:shadow-glow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Horas Rádio</CardTitle>
                  <Radio className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.radioHours}h</div>
                  <p className="text-xs text-gray-400">Este mês</p>
                </CardContent>
              </Card>

              <Card className="bg-[#1f2937] hover:shadow-glow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Conversas IA</CardTitle>
                  <Brain className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.aiChats}</div>
                  <p className="text-xs text-gray-400">Este mês</p>
                </CardContent>
              </Card>

              <Card className="bg-[#1f2937] hover:shadow-glow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Pontos Game</CardTitle>
                  <Gamepad2 className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.gamePoints}</div>
                  <p className="text-xs text-gray-400">Nível 5</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-[#1f2937] cursor-pointer hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Tv className="w-6 h-6 text-purple-500" />
                    <CardTitle className="text-white">IPTV Player</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">
                    Assista seus canais favoritos
                  </p>
                  <Button className="w-full bg-[#7e22ce] hover:bg-[#6d1bb7] text-white">
                    <Play className="w-4 h-4 mr-2" />
                    Abrir Player
                  </Button>
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
                    Ouça suas rádios favoritas
                  </p>
                  <Button className="w-full bg-[#7e22ce] hover:bg-[#6d1bb7] text-white">
                    <Play className="w-4 h-4 mr-2" />
                    Ouvir Agora
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-[#1f2937] cursor-pointer hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Gamepad2 className="w-6 h-6 text-orange-500" />
                    <CardTitle className="text-white">Startup Game</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">
                    Construa seu império digital
                  </p>
                  <div className="flex items-center space-x-2 mb-4">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-white">Nível 5 - CEO</span>
                  </div>
                  <Button className="w-full bg-[#7e22ce] hover:bg-[#6d1bb7] text-white">
                    <Play className="w-4 h-4 mr-2" />
                    Jogar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          )}
          
          {currentPage === "clients" && <ClientClients />}
          {currentPage === "resellers" && <ClientResellers />}
          {currentPage === "billing" && <ClientBilling />}
          {currentPage === "notifications" && <ClientNotifications />}
          {currentPage === "whatsapp" && <ClientWhatsApp />}
          {currentPage === "gateways" && <ClientGateways />}
          {currentPage === "branding" && <ClientBranding />}
          {currentPage === "shop" && <ClientShop />}
          {currentPage === "ai" && <ClientAI />}
          {currentPage === "games" && <ClientGames />}
          {currentPage === "analytics" && <ClientAnalytics />}
          {currentPage === "settings" && <ClientSettings />}
          {currentPage === "profile" && <ClientProfile />}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ClientDashboard;