import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Users,
  Tv,
  Radio,
  ShoppingCart,
  BarChart3,
  Settings,
  Zap,
  Home,
  LogOut,
  MessageSquare,
  CreditCard,
  Bell,
  Palette,
  Bot,
  Gamepad2,
  PieChart,
  Headphones
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { AvatarSelectionModal } from "@/components/modals/AvatarSelectionModal";
import { useState, useMemo, useEffect, useCallback } from 'react';

// Definição de níveis de plano (menor = mais básico)
const PLAN_LEVELS: Record<string, number> = {
  'Essencial': 1,
  'Profissional': 2,
  'Business': 3,
  'Elite': 4
};

// MenuItem com nível mínimo de plano requerido
interface MenuItem {
  title: string;
  url: string;
  icon: React.ElementType;
  minPlan: number; // 1=Essencial, 2=Profissional, 3=Business, 4=Elite
}

const allMenuItems: MenuItem[] = [
  { title: "Dashboard", url: "/reseller", icon: Home, minPlan: 1 },
  { title: "Meus Clientes", url: "/reseller/clientes", icon: Users, minPlan: 1 },
  { title: "Cobranças", url: "/reseller/cobrancas", icon: CreditCard, minPlan: 1 },
  { title: "Planos", url: "/reseller/planos", icon: BarChart3, minPlan: 2 },
  { title: "Notificações", url: "/reseller/notificacoes", icon: Bell, minPlan: 2 },
  { title: "Configurações", url: "/reseller/configuracoes", icon: Settings, minPlan: 1 },
  { title: "Suporte", url: "/reseller/suporte", icon: Headphones, minPlan: 1 },
  // Recursos avançados (Business+)
  { title: "WhatsApp", url: "/reseller/whatsapp", icon: MessageSquare, minPlan: 3 },
  { title: "Gateways", url: "/reseller/gateways", icon: BarChart3, minPlan: 3 },
  { title: "E-commerce", url: "/reseller/shop", icon: ShoppingCart, minPlan: 3 },
  // Recursos Elite
  { title: "IA + Voz", url: "/reseller/ai", icon: Bot, minPlan: 4 },
  { title: "Gamificação", url: "/reseller/gamificacao", icon: Gamepad2, minPlan: 4 },
  { title: "Análises", url: "/reseller/analises", icon: PieChart, minPlan: 4 },
  { title: "Customizar Marca", url: "/reseller/branding", icon: Palette, minPlan: 4 },
];

export function ResellerSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const { userName, userEmail, avatar } = useUser();
  const { user, token } = useAuth();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Estado para plano atualizado do banco de dados
  const [currentPlan, setCurrentPlan] = useState<string>(user?.plan_name || 'Essencial');
  const [maxClients, setMaxClients] = useState<number>(user?.max_clients || 5);

  // Buscar plano atualizado do banco de dados
  const fetchCurrentPlan = async () => {
    if (!token) return;

    try {
      const response = await fetch('/api/resellers/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json() as { plan_name?: string; max_clients?: number };
        if (data.plan_name) {
          setCurrentPlan(data.plan_name);
        }
        if (data.max_clients !== undefined) {
          setMaxClients(data.max_clients);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar plano:', error);
    }
  };

  // Buscar plano ao montar e quando a rota mudar
  useEffect(() => {
    fetchCurrentPlan();
  }, [token, location.pathname]);

  // Polling a cada 30 segundos para manter o plano atualizado
  useEffect(() => {
    const interval = setInterval(fetchCurrentPlan, 30000);
    return () => clearInterval(interval);
  }, [token]);

  // Obter nível do plano do usuário
  const userPlanLevel = PLAN_LEVELS[currentPlan] || 1;

  // Filtrar menu items baseado no plano
  const menuItems = useMemo(() => {
    return allMenuItems.filter(item => item.minPlan <= userPlanLevel);
  }, [userPlanLevel]);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarTrigger className="m-2 self-end" />

        <SidebarContent className="scrollbar-hide">
          <div className="flex flex-col h-full">
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                {!collapsed && (
                  <div className="flex flex-col">
                    <span className="text-xl font-bold">Revenda</span>
                    <span className="text-xs text-gray-400">{currentPlan}</span>
                  </div>
                )}
              </div>
            </div>

            <SidebarGroup className="flex-1 overflow-y-auto scrollbar-hide">
              <SidebarGroupLabel>Revendedor</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          className={({ isActive }) =>
                            isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                          }
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-auto">
              <SidebarGroupContent>
                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={avatar} alt={`@${userName}`} />
                    <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">{userName}</span>
                      <span className="text-xs text-gray-400">{userEmail}</span>
                    </div>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="w-full h-full absolute top-0 left-0" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" side="right" align="start">
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleProfileClick}>
                      Meu Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsAvatarModalOpen(true)}>
                      Alterar Avatar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/')}>
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        </SidebarContent>
      </Sidebar>
      <AvatarSelectionModal isOpen={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)} />
    </>
  );
}