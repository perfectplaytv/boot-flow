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
  Building2,
  MessageSquare,
  Paintbrush,
  Server,
  Menu
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
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  onPageChange: (page: string) => void;
  currentPage: string;
}

const menuItems = [
  { title: "Dashboard", page: "dashboard", icon: Home },
  { title: "Usuários", page: "users", icon: Users },
  { title: "Revendas", page: "resellers", icon: Building2 },
  { title: "Sistema IPTV", page: "iptv", icon: Tv },
  { title: "WhatsApp", page: "whatsapp", icon: MessageSquare },
  { title: "Cobranças", page: "cobrancas", icon: BarChart3 },
  { title: "Notificações", page: "notificacoes", icon: MessageSquare },
  { title: "Customizar Marca", page: "branding", icon: Paintbrush },
  { title: "Gateways", page: "gateways", icon: Server },
  { title: "IA + Voz", page: "ai", icon: Brain },
  { title: "E-commerce", page: "ecommerce", icon: ShoppingCart },
  { title: "Gamificação", page: "games", icon: Gamepad2 },
  { title: "Analytics", page: "analytics", icon: BarChart3 },
  { title: "Configurações", page: "settings", icon: Settings },
];

export function AdminSidebar({ onPageChange, currentPage, isMobile = false, onClose }: AdminSidebarProps & { isMobile?: boolean, onClose?: () => void }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const handlePageChange = (page: string) => {
    onPageChange(page);
    if (isMobile && onClose) onClose();
  };

  const sidebarContent = (
    <>
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
    </>
  );

  if (isMobile) {
    return (
      <Drawer onOpenChange={onClose}>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon" className="bg-[#1f2937] text-white border border-gray-700">
            <Menu className="w-6 h-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-[#232a36] text-white w-full h-full fixed left-0 top-0 rounded-none overflow-y-auto shadow-2xl z-[99999] flex flex-col border-4 border-purple-700">
          <div className="flex items-center justify-between p-4 mb-2 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Admin</span>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <span className="sr-only">Fechar menu</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </DrawerClose>
          </div>
          {/* Menu lateral real */}
          <div className="flex-1 overflow-y-auto">
            {sidebarContent}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />
      <SidebarContent>{sidebarContent}</SidebarContent>
    </Sidebar>
  );
}

export default AdminSidebar;