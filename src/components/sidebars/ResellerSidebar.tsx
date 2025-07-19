import { NavLink, useLocation } from "react-router-dom";
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
  MessageSquare
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
  { title: "Dashboard", url: "/dashboard/reseller", icon: Home },
  { title: "Clientes", url: "/dashboard/reseller/clients", icon: Users },
  { title: "Revendas", url: "/dashboard/reseller/resellers", icon: Users },
  { title: "Cobranças", url: "/dashboard/reseller/billing", icon: BarChart3 },
  { title: "Notificações", url: "/dashboard/reseller/notifications", icon: MessageSquare },
  { title: "WhatsApp", url: "/dashboard/reseller/whatsapp", icon: MessageSquare },
  { title: "Gateways", url: "/dashboard/reseller/gateways", icon: BarChart3 },
  { title: "Customizar Marca", url: "/dashboard/reseller/branding", icon: BarChart3 },
  { title: "E-commerce", url: "/dashboard/reseller/shop", icon: ShoppingCart },
  { title: "IA + Voz", url: "/dashboard/reseller/ai", icon: BarChart3 },
  { title: "Gamificação", url: "/dashboard/reseller/games", icon: BarChart3 },
  { title: "Analizes", url: "/dashboard/reseller/reports", icon: BarChart3 },
  { title: "Configurações", url: "/dashboard/reseller/settings", icon: Settings },
];

export function ResellerSidebar() {
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
            {!collapsed && <span className="text-xl font-bold">Revenda</span>}
          </div>
        </div>

        <SidebarGroup>
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