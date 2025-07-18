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
  LogOut,
  Building2
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

interface AdminSidebarProps {
  onPageChange: (page: string) => void;
  currentPage: string;
}

const menuItems = [
  { title: "Dashboard", page: "dashboard", icon: Home },
  { title: "Usuários", page: "users", icon: Users },
  { title: "Revendas", page: "resellers", icon: Building2 },
  { title: "Sistema IPTV", page: "iptv", icon: Tv },
  { title: "Rádio Web", page: "radio", icon: Radio },
  { title: "IA + Voz", page: "ai", icon: Brain },
  { title: "E-commerce", page: "ecommerce", icon: ShoppingCart },
  { title: "Gamificação", page: "games", icon: Gamepad2 },
  { title: "Analytics", page: "analytics", icon: BarChart3 },
  { title: "Configurações", page: "settings", icon: Settings },
];

export function AdminSidebar({ onPageChange, currentPage }: AdminSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const handlePageChange = (page: string) => {
    onPageChange(page);
  };

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
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => handlePageChange(item.page)}
                    className={currentPage === item.page ? "bg-primary text-primary-foreground" : "hover:bg-accent"}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
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
                <SidebarMenuButton className="hover:bg-accent">
                  <LogOut className="mr-2 h-4 w-4" />
                  {!collapsed && <span>Sair</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AdminSidebar;