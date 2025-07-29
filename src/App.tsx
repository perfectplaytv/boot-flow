import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// UI Components
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Contexts
import { AuthProvider } from '@/contexts/AuthContext';

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Dashboards
import AdminDashboard from "./pages/dashboards/AdminDashboard";

// Internal Pages
import Settings from "./pages/Settings";
import HelpCenter from "./pages/HelpCenter";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Products from "./pages/Products";
import Statistics from "./pages/Statistics";
import Ecommerce from "./pages/Ecommerce";
import Channels from "./pages/Channels";
import VoiceCampaigns from "./pages/VoiceCampaigns";
import AIConfiguration from "./pages/AIConfiguration";
import AdminResellers from "./pages/AdminResellers";
import { WhatsAppStatusContext } from './pages/AdminWhatsApp';

const queryClient = new QueryClient();

// Componente para fornecer navegação ao AuthProvider
const AuthProviderWithNavigation = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  return <AuthProvider navigate={navigate}>{children}</AuthProvider>;
};

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProviderWithNavigation>
            <WhatsAppStatusContext.Provider value={{ isConnected, setIsConnected, connectionStatus, setConnectionStatus }}>
              <Routes>
                {/* Rotas públicas */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Signup />} />
                <Route path="/termos" element={<Terms />} />
                <Route path="/privacidade" element={<Privacy />} />
                <Route path="/ajuda" element={<HelpCenter />} />

                {/* Dashboard Admin - Acesso direto */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/revendedores" element={<AdminResellers />} />
                
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
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;