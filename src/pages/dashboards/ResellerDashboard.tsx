import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Tv, 
  Radio, 
  ShoppingCart, 
  BarChart3, 
  Plus,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Activity,
  Play,
  Pause,
  Settings
} from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ResellerSidebar } from "@/components/sidebars/ResellerSidebar";
import { toast } from "sonner";

const ResellerDashboard = () => {
  const [stats] = useState({
    totalClients: 156,
    monthlyRevenue: 12450,
    iptvUsers: 89,
    radioListeners: 234,
    conversionRate: 8.5
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ResellerSidebar />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Dashboard Revendedor</h1>
                <p className="text-muted-foreground">Gerencie seus clientes e vendas</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Cliente
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-glow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalClients}</div>
                  <p className="text-xs text-muted-foreground">+12% este mês</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-glow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ {stats.monthlyRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+15% este mês</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-glow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuários IPTV</CardTitle>
                  <Tv className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.iptvUsers}</div>
                  <p className="text-xs text-muted-foreground">57% dos clientes</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-glow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.conversionRate}%</div>
                  <p className="text-xs text-muted-foreground">+2.1% este mês</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Tv className="w-6 h-6 text-purple-500" />
                    <CardTitle>IPTV Pro</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Gerencie listas IPTV dos seus clientes
                  </p>
                  <Badge className="bg-green-500">Ativo</Badge>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Radio className="w-6 h-6 text-blue-500" />
                    <CardTitle>Rádio Web</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Configure rádios para seus clientes
                  </p>
                  <Badge className="bg-green-500">Ativo</Badge>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-glow transition-all duration-300 opacity-50">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="w-6 h-6 text-green-500" />
                    <CardTitle>E-commerce</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Venda produtos aos seus clientes
                  </p>
                  <Badge variant="outline">Upgrade Necessário</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ResellerDashboard;