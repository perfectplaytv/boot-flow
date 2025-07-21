import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  Tv, 
  Radio, 
  Brain, 
  Settings, 
  Zap,
  Home,
  LogOut,
  MessageSquare,
  Gamepad2,
  ShoppingBag,
  Bell,
  User,
  BarChart3
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
import { AvatarSelectionModal } from "@/components/modals/AvatarSelectionModal";
import { useState } from 'react';

const menuItems = [
  { title: "Dashboard", url: "/dashboard/client", icon: Home },
  { title: "Clientes", url: "/dashboard/client/clients", icon: User },
  { title: "Revendas", url: "/dashboard/client/resellers", icon: User },
  { title: "Cobranças", url: "/dashboard/client/billing", icon: BarChart3 },
  { title: "Notificações", url: "/dashboard/client/notifications", icon: Bell },
  { title: "WhatsApp", url: "/dashboard/client/whatsapp", icon: MessageSquare },
  { title: "Gateways", url: "/dashboard/client/gateways", icon: BarChart3 },
  { title: "Customizar Marca", url: "/dashboard/client/branding", icon: BarChart3 },
  { title: "E-commerce", url: "/dashboard/client/shop", icon: ShoppingBag },
  { title: "IA + Voz", url: "/dashboard/client/ai", icon: Brain },
  { title: "Gamificação", url: "/dashboard/client/games", icon: Gamepad2 },
  { title: "Análises", url: "/dashboard/client/analytics", icon: BarChart3 },
  { title: "Configurações", url: "/dashboard/client/settings", icon: Settings },
];

export function ClientSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const { userName, userEmail, avatar } = useUser();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarTrigger className="m-2 self-end" />

        <SidebarContent>
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              {!collapsed && <span className="text-xl font-bold">Cliente</span>}
            </div>
          </div>

          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
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
        </SidebarContent>
      </Sidebar>
      <AvatarSelectionModal isOpen={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)} />
    </>
  );
}