import React, { useState } from 'react';
import { BrowserRouter, HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Detecta se está rodando no Electron (file:// protocol)
const isElectron = window.location.protocol === 'file:' ||
  (typeof window !== 'undefined' && window.navigator.userAgent.includes('Electron'));

// Usa HashRouter para Electron (file://) e BrowserRouter para web
const Router = isElectron ? HashRouter : BrowserRouter;

// UI Components
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Contexts
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/components/theme-provider';

// Pages
import Landing from "./pages/Landing";
import Checkout from "./pages/Checkout";
import Pagamento from "./pages/Pagamento";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
// import AuthCallback from "./pages/AuthCallback"; // Removido
import NotFound from "./pages/NotFound";
import AcompanhamentoPedido from "./pages/AcompanhamentoPedido";
import Sobre from "./pages/empresa/Sobre";
import Blog from "./pages/empresa/Blog";

// Dashboards
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import ResellerDashboard from "./pages/dashboards/ResellerDashboard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Unauthorized from "@/pages/Unauthorized";
import ClientDashboard from "./pages/dashboards/ClientDashboard";


// Internal Pages
import Settings from "./pages/Settings";
import HelpCenter from "./pages/HelpCenter";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import API from "./pages/API";
import Documentacao from "./pages/Documentacao";
import Integracoes from "./pages/Integracoes";
import Demo from "./pages/Demo";
import Products from "./pages/Products";
import Statistics from "./pages/Statistics";
import Ecommerce from "./pages/Ecommerce";
import Channels from "./pages/Channels";
import VoiceCampaigns from "./pages/VoiceCampaigns";
import AdminResellersPlans from '@/pages/admin/AdminResellersPlans';
import AdminTelegram from '@/pages/AdminTelegram';
import AIConfiguration from "./pages/AIConfiguration";
import AdminResellers from "./pages/AdminResellers";
import { WhatsAppStatusContext } from './pages/AdminWhatsApp';

const queryClient = new QueryClient();

// Reseller Pages
import ResellerLayout from './layouts/ResellerLayout';
import ResellerDashboardIndex from './pages/reseller/ResellerDashboard';
import ResellerClientes from './pages/reseller/ResellerClientes';
import ResellerCobrancas from './pages/reseller/ResellerCobrancas';
import ResellerPlanos from './pages/reseller/ResellerPlanos';
import ResellerNotificacoes from './pages/reseller/ResellerNotificacoes';
import ResellerConfiguracoes from './pages/reseller/ResellerConfiguracoes';
import ResellerSuporte from './pages/reseller/ResellerSuporte';

// Componente para fornecer navegação ao AuthProvider
const AuthProviderWithNavigation = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  return <AuthProvider navigate={navigate}>{children}</AuthProvider>;
};

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="bootflow-ui-theme">
        <TooltipProvider>
          <Router>
            <AuthProviderWithNavigation>
              <WhatsAppStatusContext.Provider value={{ isConnected, setIsConnected, connectionStatus, setConnectionStatus }}>
                <Routes>
                  {/* Rotas públicas */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/preco" element={<Landing />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/pagamento" element={<Pagamento />} />
                  <Route path="/pedido" element={<AcompanhamentoPedido />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/cadastro" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/termos" element={<Terms />} />
                  <Route path="/privacidade" element={<Privacy />} />
                  <Route path="/ajuda" element={<HelpCenter />} />
                  <Route path="/api" element={<API />} />
                  <Route path="/documentacao" element={<Documentacao />} />
                  <Route path="/integracoes" element={<Integracoes />} />
                  <Route path="/demo" element={<Demo />} />
                  <Route path="/empresa/sobre" element={<Sobre />} />
                  <Route path="/empresa/blog" element={<Blog />} />

                  {/* Dashboard Admin - Acesso direto */}
                  <Route path="/admin" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />

                  {/* Nova Dashboard Revendedor - Layout Separado */}
                  <Route path="/reseller" element={
                    <ProtectedRoute requiredRole="reseller">
                      <ResellerLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<ResellerDashboardIndex />} />
                    <Route path="clientes" element={<ResellerClientes />} />
                    <Route path="cobrancas" element={<ResellerCobrancas />} />
                    <Route path="notificacoes" element={<ResellerNotificacoes />} />
                    <Route path="configuracoes" element={<ResellerConfiguracoes />} />
                    <Route path="suporte" element={<ResellerSuporte />} />
                  </Route>

                  {/* Mantendo rota antiga para compatibilidade temporária (redirecionar depois) */}
                  <Route path="/dashboard/revendas" element={
                    <ProtectedRoute requiredRole="reseller">
                      <ResellerLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<ResellerDashboardIndex />} />
                  </Route>
                  {/* Página de acesso negado */}
                  <Route path="/unauthorized" element={<Unauthorized />} />

                  {/* Rotas Admin */}
                  <Route path="/admin/revendedores" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminResellers />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/plans" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminResellersPlans />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/bootgram" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminTelegram />
                    </ProtectedRoute>
                  } />

                  {/* Dashboard Cliente */}
                  <Route path="/dashboard/client" element={<ClientDashboard />} />

                  {/* Redirecionamento para /dashboard */}
                  <Route path="/dashboard" element={<ClientDashboard />} />

                  {/* Outras rotas */}
                  <Route path="/configuracoes" element={<Settings />} />
                  <Route path="/produtos" element={<Products />} />
                  <Route path="/estatisticas" element={<Statistics />} />
                  <Route path="/ecommerce" element={<Ecommerce />} />
                  <Route path="/canais" element={<Channels />} />
                  <Route path="/campanhas-voz" element={<VoiceCampaigns />} />
                  <Route path="/ia-config" element={<AIConfiguration />} />

                  {/* Rota 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </WhatsAppStatusContext.Provider>
            </AuthProviderWithNavigation>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
