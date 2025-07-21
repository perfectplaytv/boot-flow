import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Dashboards
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import ResellerDashboard from "./pages/dashboards/ResellerDashboard";
import ClientDashboard from "./pages/dashboards/ClientDashboard";

// Internal Pages
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Payments from "./pages/Payments";
import Notifications from "./pages/Notifications";
import HelpCenter from "./pages/HelpCenter";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Products from "./pages/Products";
import Gamification from "./pages/Gamification";
import Scheduling from "./pages/Scheduling";
import Statistics from "./pages/Statistics";
import Ecommerce from "./pages/Ecommerce";
import Channels from "./pages/Channels";
import VoiceCampaigns from "./pages/VoiceCampaigns";
import Export from "./pages/Export";
import AIConfiguration from "./pages/AIConfiguration";
import AdminResellers from "./pages/AdminResellers";
import { WhatsAppStatusContext } from './pages/AdminWhatsApp';
import { useState } from 'react';
import { UserProvider } from "./contexts/UserContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";


const queryClient = new QueryClient();

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserProvider>
          <Toaster />
          <Sonner />
          <WhatsAppStatusContext.Provider value={{ isConnected, connectionStatus, setIsConnected, setConnectionStatus }}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                
                {/* Dashboards */}
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
                <Route path="/dashboard/reseller" element={<ResellerDashboard />} />
                <Route path="/dashboard/client" element={<ClientDashboard />} />
                {/* Login e Cadastro */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Internal Pages */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/products" element={<Products />} />
                <Route path="/gamification" element={<Gamification />} />
                <Route path="/scheduling" element={<Scheduling />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/ecommerce" element={<Ecommerce />} />
                <Route path="/channels" element={<Channels />} />
                <Route path="/voice-campaigns" element={<VoiceCampaigns />} />
                <Route path="/export" element={<Export />} />
                <Route path="/ai-config" element={<AIConfiguration />} />
                <Route path="/admin/resellers" element={<AdminResellers />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </WhatsAppStatusContext.Provider>
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;