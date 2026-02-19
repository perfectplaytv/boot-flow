import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Tv, 
  Radio, 
  MessageSquare, 
  BarChart3, 
  Play,
  Pause,
  Settings,
  Brain,
  Gamepad2,
  Star
} from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ClientSidebar } from "@/components/sidebars/ClientSidebar";
import { ThemeToggle } from "@/components/theme-toggle";
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

const ClientDashboard = () => {
  const [currentPage, setCurrentPage] = useState<string>("dashboard");
  const [stats] = useState({
    iptvHours: 245,
    radioHours: 89,
    aiChats: 34,
    gamePoints: 1250
  });

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