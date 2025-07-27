import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from './contexts/UserContext';
import { AuthProvider } from './contexts/AuthContext';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Dashboards
import AdminLayout from "./pages/dashboards/AdminLayout";
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
import Channels from "./pages/Channels";
import Ecommerce from "./pages/Ecommerce";
import Export from "./pages/Export";
import Scheduling from "./pages/Scheduling";
import VoiceCampaigns from "./pages/VoiceCampaigns";
import ProtectedRoute from './components/ProtectedRoute';
import Auth from './pages/Auth';

import { WhatsAppStatusContext } from "./contexts/WhatsAppStatusContext";
import { useState } from "react";

const queryClient = new QueryClient();

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <UserProvider>
            <WhatsAppStatusContext.Provider value={{ isConnected, setIsConnected, connectionStatus, setConnectionStatus }}>
              <BrowserRouter>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/" element={<Index />} />
                  <Route path="/admin/*" element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  } />
                  <Route path="/reseller/*" element={
                    <ProtectedRoute>
                      <ResellerDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/client/*" element={
                    <ProtectedRoute>
                      <ClientDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route path="/payments" element={
                    <ProtectedRoute>
                      <Payments />
                    </ProtectedRoute>
                  } />
                  <Route path="/notifications" element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  } />
                  <Route path="/help" element={
                    <ProtectedRoute>
                      <HelpCenter />
                    </ProtectedRoute>
                  } />
                  <Route path="/products" element={
                    <ProtectedRoute>
                      <Products />
                    </ProtectedRoute>
                  } />
                  <Route path="/channels" element={
                    <ProtectedRoute>
                      <Channels />
                    </ProtectedRoute>
                  } />
                  <Route path="/ecommerce" element={
                    <ProtectedRoute>
                      <Ecommerce />
                    </ProtectedRoute>
                  } />
                  <Route path="/export" element={
                    <ProtectedRoute>
                      <Export />
                    </ProtectedRoute>
                  } />
                  <Route path="/scheduling" element={
                    <ProtectedRoute>
                      <Scheduling />
                    </ProtectedRoute>
                  } />
                  <Route path="/voice-campaigns" element={
                    <ProtectedRoute>
                      <VoiceCampaigns />
                    </ProtectedRoute>
                  } />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </WhatsAppStatusContext.Provider>
          </UserProvider>
        </AuthProvider>
      </TooltipProvider>
      <Toaster />
      <Sonner />
    </QueryClientProvider>
  );
}

export default App;