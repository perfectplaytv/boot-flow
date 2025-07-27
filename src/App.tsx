import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Auth } from "./pages/Auth";
import { ProtectedRoute } from "./components/ProtectedRoute";

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
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard/admin" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/reseller" element={
                  <ProtectedRoute requiredRole="reseller">
                    <ResellerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/client" element={
                  <ProtectedRoute>
                    <ClientDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Internal Pages - Protected */}
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
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/products" element={
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                } />
                <Route path="/gamification" element={
                  <ProtectedRoute>
                    <Gamification />
                  </ProtectedRoute>
                } />
                <Route path="/scheduling" element={
                  <ProtectedRoute>
                    <Scheduling />
                  </ProtectedRoute>
                } />
                <Route path="/statistics" element={
                  <ProtectedRoute>
                    <Statistics />
                  </ProtectedRoute>
                } />
                <Route path="/ecommerce" element={
                  <ProtectedRoute>
                    <Ecommerce />
                  </ProtectedRoute>
                } />
                <Route path="/channels" element={
                  <ProtectedRoute>
                    <Channels />
                  </ProtectedRoute>
                } />
                <Route path="/voice-campaigns" element={
                  <ProtectedRoute>
                    <VoiceCampaigns />
                  </ProtectedRoute>
                } />
                <Route path="/export" element={
                  <ProtectedRoute>
                    <Export />
                  </ProtectedRoute>
                } />
                <Route path="/ai-config" element={
                  <ProtectedRoute requiredRole="admin">
                    <AIConfiguration />
                  </ProtectedRoute>
                } />
                <Route path="/admin/resellers" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminResellers />
                  </ProtectedRoute>
                } />
                
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