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
  Menu,
  UserPlus,
  DollarSign,
  Bell,
  CreditCard
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
import { useState } from "react";
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

interface AdminSidebarProps {
  onPageChange: (page: string) => void;
  currentPage: string;
}

const menuItems = [
  { title: "Dashboard", page: "dashboard", icon: Home },
  { title: "Clientes", page: "users", icon: Users },
  { title: "Revendas", page: "resellers", icon: Building2 },
  { title: "BootGram", page: "telegram", icon: UserPlus },
  { title: "Cobranças", page: "cobrancas", icon: DollarSign },
  { title: "WhatsApp", page: "whatsapp", icon: MessageSquare },
  { title: "Notificações", page: "notificacoes", icon: Bell },
  { title: "IA + Voz", page: "ai", icon: Brain },
  { title: "E-commerce", page: "ecommerce", icon: ShoppingCart },
  { title: "Gamificação", page: "games", icon: Gamepad2 },
  { title: "Gateways", page: "gateways", icon: Server },
  { title: "Análises", page: "analytics", icon: BarChart3 },
  { title: "Planos e Preços", page: "plans", icon: CreditCard },
  { title: "Configurações", page: "settings", icon: Settings },
];

export function AdminSidebar({ onPageChange, currentPage, isMobile = false, onClose }: AdminSidebarProps & { isMobile?: boolean, onClose?: () => void }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { userName, userEmail, avatar } = useUser();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const handleDrawerToggle = () => setDrawerOpen((open) => !open);

  const handlePageChange = (page: string) => {
    onPageChange(page);
    if (isMobile && onClose) onClose();
    setDrawerOpen(false); // Fecha o Drawer ao navegar
  };

  const sidebarContent = (
    <div className="flex flex-col h-full scrollbar-hide">
      <div className="p-3 sm:p-4">
        <div className="flex items-center space-x-2 mb-4 sm:mb-6">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          {!collapsed && <span className="text-lg sm:text-xl font-bold">Admin</span>}
        </div>
      </div>
      <SidebarGroup className="flex-1 overflow-y-auto scrollbar-hide">
        <SidebarGroupLabel>Administração</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  onClick={() => handlePageChange(item.page)}
                  className={`${currentPage === item.page ? "bg-primary text-primary-foreground" : "hover:bg-accent"} h-10 sm:h-auto`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {!collapsed && <span className="text-sm sm:text-base">{item.title}</span>}
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
              {/* Este div é um gatilho invisível, o clique principal está no contêiner acima */}
              <div className="w-full h-full absolute top-0 left-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" side="right" align="start">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handlePageChange('profile')}>
                Meu Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsAvatarModalOpen(true)}>
                Alterar Avatar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = '/'}>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" className="bg-[#1f2937] text-white border border-gray-700 h-10 w-10" onClick={handleDrawerToggle}>
              <Menu className="w-5 h-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="bg-[#232a36] text-white w-full h-full fixed left-0 top-0 rounded-none overflow-y-auto shadow-2xl z-[99999] flex flex-col border-2 sm:border-4 border-purple-700 scrollbar-hide">
            <div className="flex items-center justify-between p-3 sm:p-4 mb-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold">Admin</span>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="text-white h-8 w-8 sm:h-10 sm:w-10">
                  <span className="sr-only">Fechar menu</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </DrawerClose>
            </div>
            {/* Menu lateral real */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {sidebarContent}
            </div>
          </DrawerContent>
        </Drawer>
        <AvatarSelectionModal isOpen={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarTrigger className="m-2 self-end" />
        <SidebarContent className="scrollbar-hide">{sidebarContent}</SidebarContent>
      </Sidebar>
      <AvatarSelectionModal isOpen={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)} />
    </>
  );
}

export default AdminSidebar;