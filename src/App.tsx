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
import AdminUsers from "./pages/AdminUsers";
import AdminIPTV from "./pages/AdminIPTV";
import AdminRadio from "./pages/AdminRadio";
import AdminAI from "./pages/AdminAI";
import AdminEcommerce from "./pages/AdminEcommerce";
import AdminGames from "./pages/AdminGames";
import AdminAnalytics from "./pages/AdminAnalytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Dashboards */}
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/users" element={<AdminUsers />} />
          <Route path="/dashboard/admin/iptv" element={<AdminIPTV />} />
          <Route path="/dashboard/admin/radio" element={<AdminRadio />} />
          <Route path="/dashboard/admin/ai" element={<AdminAI />} />
          <Route path="/dashboard/admin/ecommerce" element={<AdminEcommerce />} />
          <Route path="/dashboard/admin/games" element={<AdminGames />} />
          <Route path="/dashboard/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/dashboard/reseller" element={<ResellerDashboard />} />
          <Route path="/dashboard/client" element={<ClientDashboard />} />
          
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
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;