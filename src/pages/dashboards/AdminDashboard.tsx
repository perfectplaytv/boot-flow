import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/sidebars/AdminSidebar";
import AdminUsers from "../AdminUsers";
import AdminIPTV from "../AdminIPTV";
import AdminRadio from "../AdminRadio";
import AdminAI from "../AdminAI";
import AdminEcommerce from "../AdminEcommerce";
import AdminGames from "../AdminGames";
import AdminAnalytics from "../AdminAnalytics";
import Settings from "../Settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Users,
  Tv,
  Radio,
  ShoppingCart,
  BarChart3,
  Settings as SettingsIcon,
  Gamepad2,
  Zap,
  DollarSign,
  TrendingUp
} from "lucide-react";

const pageComponents = {
  dashboard: (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Administrador</h1>
          <p className="text-muted-foreground">Gerencie toda a plataforma SaaS Pro</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="secondary">
            <Brain className="w-4 h-4 mr-2" />
            Configurar IA
          </Button>
          <Button>
            + Novo Revendedor
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.847</div>
            <p className="text-xs text-muted-foreground">+12.5% em relação ao mês passado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 487.230</div>
            <p className="text-xs text-muted-foreground">+15.3% em relação ao mês passado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revendedores Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">+8.2% em relação ao mês passado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interações IA</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.678</div>
            <p className="text-xs text-muted-foreground">+23.1% em relação ao mês passado</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Tv className="w-6 h-6 text-purple-500" />
              <CardTitle>Sistema IPTV</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Gerencie servidores, canais e configurações IPTV</p>
            <div className="flex justify-between text-sm">
              <span>Usuários Ativos:</span>
              <span className="font-semibold">8.934</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Servidores Online:</span>
              <span className="font-semibold text-green-500">12/12</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Radio className="w-6 h-6 text-blue-500" />
              <CardTitle>Rádio Web</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Configure rádios e integrações multicanal</p>
            <div className="flex justify-between text-sm">
              <span>Ouvintes Ativos:</span>
              <span className="font-semibold">12.456</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Rádios Online:</span>
              <span className="font-semibold text-green-500">8/8</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-6 h-6 text-green-500" />
              <CardTitle>E-commerce</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Gerencie produtos e vendas da plataforma</p>
            <div className="flex justify-between text-sm">
              <span>Produtos Ativos:</span>
              <span className="font-semibold">156</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Vendas Hoje:</span>
              <span className="font-semibold text-green-500">R$ 12.845</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Gamepad2 className="w-6 h-6 text-orange-500" />
              <CardTitle>Gamificação</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Configure regras de jogos e recompensas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-indigo-500" />
              <CardTitle>IA + Voz</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Configure assistentes e vozes da IA</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-red-500" />
              <CardTitle>Analytics</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Relatórios detalhados e métricas em tempo real</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Atividade Recente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Lista de atividades */}
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <Users className="w-4 h-4 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">João Silva</p>
                  <p className="text-xs text-muted-foreground">2 min atrás</p>
                </div>
                <Badge className="bg-zinc-800">client</Badge>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <DollarSign className="w-4 h-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Maria Santos</p>
                  <p className="text-xs text-muted-foreground">5 min atrás</p>
                </div>
                <Badge className="bg-zinc-800">reseller</Badge>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <Tv className="w-4 h-4 text-purple-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Pedro Oliveira</p>
                  <p className="text-xs text-muted-foreground">8 min atrás</p>
                </div>
                <Badge className="bg-zinc-800">client</Badge>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <Brain className="w-4 h-4 text-orange-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Ana Costa</p>
                  <p className="text-xs text-muted-foreground">12 min atrás</p>
                </div>
                <Badge className="bg-zinc-800">client</Badge>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Carlos Lima</p>
                  <p className="text-xs text-muted-foreground">15 min atrás</p>
                </div>
                <Badge className="bg-zinc-800">reseller</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Usuários Online</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Lista de usuários online */}
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">J</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">João Silva</p>
                  <p className="text-xs text-muted-foreground">Cliente • Agora</p>
                </div>
                <Badge className="bg-green-500">Online</Badge>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">M</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Maria Santos</p>
                  <p className="text-xs text-muted-foreground">Revendedor • Agora</p>
                </div>
                <Badge className="bg-green-500">Online</Badge>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">P</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Pedro Oliveira</p>
                  <p className="text-xs text-muted-foreground">Cliente • 5 min atrás</p>
                </div>
                <Badge variant="secondary">Ausente</Badge>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Ana Costa</p>
                  <p className="text-xs text-muted-foreground">Cliente • Agora</p>
                </div>
                <Badge className="bg-green-500">Online</Badge>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">C</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Carlos Lima</p>
                  <p className="text-xs text-muted-foreground">Revendedor • Agora</p>
                </div>
                <Badge className="bg-green-500">Online</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
  users: <AdminUsers />, 
  iptv: <AdminIPTV />, 
  radio: <AdminRadio />, 
  ai: <AdminAI />, 
  ecommerce: <AdminEcommerce />, 
  games: <AdminGames />, 
  analytics: <AdminAnalytics />, 
  settings: <Settings />
};

const menuKeys = [
  "dashboard",
  "users",
  "iptv",
  "radio",
  "ai",
  "ecommerce",
  "games",
  "analytics",
  "settings"
];

export default function AdminDashboard() {
  const [selectedPage, setSelectedPage] = useState("dashboard");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar selectedPage={selectedPage} onSelectPage={setSelectedPage} />
        <main className="flex-1 p-6">
          {pageComponents[selectedPage]}
        </main>
      </div>
    </SidebarProvider>
  );
}