import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Settings,
    LogOut,
    Menu,
    X,
    Package,
    Bell,
    HelpCircle,
    BarChart,
    Bot,
} from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ThemeInjector } from "@/components/ThemeInjector";

// Definição dos temas por plano
const PLAN_THEMES: Record<string, { color: string; lightColor: string; borderColor: string; gradient: string }> = {
    'Essencial': {
        color: 'text-blue-500',
        lightColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
        gradient: 'from-blue-500 to-cyan-600'
    },
    'Profissional': {
        color: 'text-green-500',
        lightColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20',
        gradient: 'from-green-500 to-emerald-600'
    },
    'Business': {
        color: 'text-orange-500',
        lightColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/20',
        gradient: 'from-orange-500 to-amber-600'
    },
    'Elite': {
        color: 'text-purple-500',
        lightColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/20',
        gradient: 'from-purple-500 to-violet-600'
    },
    // Fallback
    'default': {
        color: 'text-primary',
        lightColor: 'bg-primary/10',
        borderColor: 'border-border',
        gradient: 'from-primary to-primary/80'
    }
};

// Menu items com nível de acesso
const ALL_MENU_ITEMS = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/reseller", plans: ['Essencial', 'Profissional', 'Business', 'Elite'] },
    { icon: Users, label: "Meus Clientes", path: "/reseller/clientes", plans: ['Essencial', 'Profissional', 'Business', 'Elite'] },
    { icon: CreditCard, label: "Cobranças", path: "/reseller/cobrancas", plans: ['Essencial', 'Profissional', 'Business', 'Elite'] },
    { icon: Package, label: "Planos", path: "/reseller/planos", plans: ['Profissional', 'Business', 'Elite'] },
    { icon: Bell, label: "Notificações", path: "/reseller/notificacoes", plans: ['Profissional', 'Business', 'Elite'] },
    { icon: BarChart, label: "Análises", path: "/reseller/analises", plans: ['Business', 'Elite'] },
    { icon: Bot, label: "BotGram", path: "/reseller/botgram", plans: ['Elite'] },
    { icon: Settings, label: "Configurações", path: "/reseller/configuracoes", plans: ['Essencial', 'Profissional', 'Business', 'Elite'] },
    { icon: HelpCircle, label: "Suporte", path: "/reseller/suporte", plans: ['Essencial', 'Profissional', 'Business', 'Elite'] },
];

export default function ResellerLayout() {
    const { user, signOut, token } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Interface para resposta da API
    interface PlanApiResponse {
        plan_name: string;
        max_clients?: number;
        features?: string[];
        [key: string]: any;
    }

    // Estado do plano atual (sincronizado)
    const [currentPlan, setCurrentPlan] = useState<string>(user?.plan_name || 'Essencial');
    const [currentPlanDetails, setCurrentPlanDetails] = useState<PlanApiResponse | null>(null);

    // Função para buscar o plano atualizado
    const fetchCurrentPlan = useCallback(async () => {
        if (!token) return;

        try {
            const response = await fetch('/api/resellers/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json() as PlanApiResponse;
                if (data.plan_name && data.plan_name !== currentPlan) {
                    console.log(`🔄 Plano atualizado detectado: ${data.plan_name}`);
                    setCurrentPlan(data.plan_name);
                }
                setCurrentPlanDetails(data);
            }
        } catch (error) {
            console.error('Erro ao sincronizar plano:', error);
        }
    }, [token, currentPlan]);

    // Polling a cada 5 segundos para atualizações rápidas
    useEffect(() => {
        fetchCurrentPlan(); // Busca inicial
        const interval = setInterval(fetchCurrentPlan, 5000);
        return () => clearInterval(interval);
    }, [fetchCurrentPlan]);

    // Atualizar quando mudar de rota também
    useEffect(() => {
        fetchCurrentPlan();
    }, [location.pathname, fetchCurrentPlan]);

    const handleLogout = async () => {
        await signOut();
        navigate("/login");
    };

    const isActive = (path: string) => {
        if (path === "/reseller") {
            return location.pathname === "/reseller";
        }
        return location.pathname.startsWith(path);
    };

    // Filtrar menus baseado no plano atual
    const filteredMenuItems = useMemo(() => {
        return ALL_MENU_ITEMS.filter(item => item.plans.includes(currentPlan || 'Essencial'));
    }, [currentPlan]);

    // Obter tema atual
    const theme = PLAN_THEMES[currentPlan || 'Essencial'] || PLAN_THEMES['default'];

    return (
        <div className="min-h-screen bg-background">
            <ThemeInjector />
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-16 flex items-center px-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
                <div className="flex items-center gap-2 ml-4">
                    <div className={`w-8 h-8 bg-gradient-to-br ${theme.gradient} rounded-lg flex items-center justify-center`}>
                        <Package className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-lg">BootFlow</span>
                    <span className={cn("text-xs px-2 py-0.5 rounded", theme.lightColor, theme.color)}>{currentPlan}</span>
                </div>
                <div className="ml-auto">
                    <ThemeToggle />
                </div>
            </header>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-40 h-full w-64 bg-card border-r transition-transform duration-300 lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full",
                    theme.borderColor
                )}
            >
                {/* Logo */}
                <div className={cn("h-16 flex items-center px-4 border-b", theme.borderColor)}>
                    <div className={`w-10 h-10 bg-gradient-to-br ${theme.gradient} rounded-xl flex items-center justify-center shadow-lg shadow-${theme.color.split('-')[1]}-500/20`}>
                        <Package className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3">
                        <span className="font-bold text-lg">BootFlow</span>
                        <div className="flex items-center gap-1.5">
                            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider", theme.lightColor, theme.color)}>
                                {currentPlan?.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div className={cn("p-4 border-b", theme.borderColor)}>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white font-bold ring-2 ring-background shadow-md`}>
                            {user?.name?.charAt(0) || user?.email?.charAt(0) || "R"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{user?.name || "Revendedor"}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {filteredMenuItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <Button
                                key={item.path}
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start gap-3 h-11 transition-all duration-200",
                                    active
                                        ? cn(theme.lightColor, theme.color, "font-semibold shadow-sm")
                                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                )}
                                onClick={() => {
                                    navigate(item.path);
                                    setSidebarOpen(false);
                                }}
                            >
                                <item.icon className={cn("w-5 h-5", active ? theme.color : "text-muted-foreground")} />
                                {item.label}
                            </Button>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-4 left-4 right-4">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5" />
                        Sair
                    </Button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen transition-all duration-300">
                {/* Desktop Header */}
                <header className={cn("hidden lg:flex h-16 items-center justify-between px-6 border-b bg-card/50 backdrop-blur sticky top-0 z-30", theme.borderColor)}>
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-semibold flex items-center gap-2">
                            {filteredMenuItems.find(item => isActive(item.path))?.icon && (
                                <div className={cn("p-1.5 rounded-md", theme.lightColor)}>
                                    {(() => {
                                        const Icon = filteredMenuItems.find(item => isActive(item.path))?.icon || LayoutDashboard;
                                        return <Icon className={cn("w-4 h-4", theme.color)} />;
                                    })()}
                                </div>
                            )}
                            {filteredMenuItems.find(item => isActive(item.path))?.label || "Dashboard"}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Button variant="outline" size="sm" onClick={handleLogout} className="hover:text-red-500 hover:border-red-200">
                            <LogOut className="w-4 h-4 mr-2" />
                            Sair
                        </Button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6">
                    <Outlet context={{ currentPlan, theme }} />
                </div>
            </main>
        </div>
    );
}
