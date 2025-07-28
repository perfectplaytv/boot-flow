import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// UI Components
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

// Context Providers
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
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

const queryClient = new QueryClient();

// Componente para rotas protegidas
const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: JSX.Element, 
  requiredRole?: 'admin' | 'reseller' | 'client' 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se não há usuário autenticado, redireciona para login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Verifica se o usuário tem a role necessária
  // Você pode personalizar essa lógica conforme suas necessidades
  const userRole = user.user_metadata?.role || 'client';
  const hasRequiredRole = !requiredRole || userRole === requiredRole;
  
  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Layout para rotas autenticadas
const AuthenticatedLayout = () => {
  return (
    <UserProvider>
      <Outlet />
    </UserProvider>
  );
};

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WhatsAppStatusContext.Provider value={{ isConnected, connectionStatus, setIsConnected, setConnectionStatus }}>
  <BrowserRouter>
    <AuthProvider>
      <Toaster />
      <Sonner />
              <Routes>
                {/* Rotas Públicas */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                
                {/* Rotas Autenticadas */}
                <Route element={<AuthenticatedLayout />}>
                  {/* Dashboards */}
                  <Route 
                    path="/dashboard/admin" 
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard/reseller" 
                    element={
                      <ProtectedRoute requiredRole="reseller">
                        <ResellerDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard/client" 
                    element={
                      <ProtectedRoute requiredRole="client">
                        <ClientDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Páginas Internas */}
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
                  <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                  <Route path="/help" element={<ProtectedRoute><HelpCenter /></ProtectedRoute>} />
                  <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                  <Route path="/gamification" element={<ProtectedRoute><Gamification /></ProtectedRoute>} />
                  <Route path="/scheduling" element={<ProtectedRoute><Scheduling /></ProtectedRoute>} />
                  <Route path="/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
                  <Route path="/ecommerce" element={<ProtectedRoute><Ecommerce /></ProtectedRoute>} />
                  <Route path="/channels" element={<ProtectedRoute><Channels /></ProtectedRoute>} />
                  <Route path="/voice-campaigns" element={<ProtectedRoute><VoiceCampaigns /></ProtectedRoute>} />
                  <Route path="/export" element={<ProtectedRoute><Export /></ProtectedRoute>} />
                  <Route path="/ai-config" element={<ProtectedRoute><AIConfiguration /></ProtectedRoute>} />
                  <Route 
                    path="/admin/resellers" 
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminResellers />
                      </ProtectedRoute>
                    } 
                  />
                </Route>
                
                {/* Rota de redirecionamento para usuários não autenticados */}
                <Route path="/unauthorized" element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold mb-4">Acesso não autorizado</h1>
                      <p>Você não tem permissão para acessar esta página.</p>
                      <Button className="mt-4" onClick={() => window.history.back()}>
                        Voltar
                      </Button>
                    </div>
                  </div>
                } />
                
                {/* Rota de página não encontrada */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </WhatsAppStatusContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;