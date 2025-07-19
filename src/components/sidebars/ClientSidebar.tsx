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
  { title: "Analizes", url: "/dashboard/client/analytics", icon: BarChart3 },
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