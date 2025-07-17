import { NavLink, useLocation } from "react-router-dom";
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
  User
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

const menuItems = [
  { title: "Minha Central", url: "/dashboard/client", icon: Home },
  { title: "IPTV", url: "/dashboard/client/iptv", icon: Tv },
  { title: "Rádio Web", url: "/dashboard/client/radio", icon: Radio },
  { title: "Chat IA", url: "/dashboard/client/ai", icon: Brain },
  { title: "Jogos", url: "/dashboard/client/games", icon: Gamepad2 },
  { title: "Loja", url: "/dashboard/client/shop", icon: ShoppingBag },
  { title: "Notificações", url: "/dashboard/client/notifications", icon: Bell },
  { title: "Perfil", url: "/dashboard/client/profile", icon: User },
  { title: "Configurações", url: "/dashboard/client/settings", icon: Settings },
];

export function ClientSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  return (
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

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" className="hover:bg-accent">
                    <LogOut className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Sair</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}