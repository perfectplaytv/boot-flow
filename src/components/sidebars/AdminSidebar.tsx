import { NavLink, useLocation } from "react-router-dom";
import { 
  Brain, 
  Users, 
  Tv, 
  Radio, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  Gamepad2,
  Zap,
  Home,
  LogOut
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

export function AdminSidebar({ selectedPage, onSelectPage }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  // Mapear os títulos para as keys usadas no AdminDashboard
  const menuItems = [
    { key: "dashboard", title: "Dashboard", icon: Home },
    { key: "users", title: "Usuários", icon: Users },
    { key: "iptv", title: "Sistema IPTV", icon: Tv },
    { key: "radio", title: "Rádio Web", icon: Radio },
    { key: "ai", title: "IA + Voz", icon: Brain },
    { key: "ecommerce", title: "E-commerce", icon: ShoppingCart },
    { key: "games", title: "Gamificação", icon: Gamepad2 },
    { key: "analytics", title: "Analytics", icon: BarChart3 },
    { key: "settings", title: "Configurações", icon: Settings },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />
      <SidebarContent>
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            {!collapsed && <span className="text-xl font-bold">Admin</span>}
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    asChild={false}
                    onClick={() => onSelectPage(item.key)}
                    className={
                      selectedPage === item.key
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
      </SidebarContent>
    </Sidebar>
  );
}

export default AdminSidebar;