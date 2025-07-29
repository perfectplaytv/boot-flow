import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// UI Components
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Landing from "./pages/Landing";
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

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WhatsAppStatusContext.Provider value={{ isConnected, setIsConnected, connectionStatus, setConnectionStatus }}>
          <BrowserRouter>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<Landing />} />
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
          </BrowserRouter>
        </WhatsAppStatusContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;