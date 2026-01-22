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
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { ThemeInjector } from "@/components/ThemeInjector";
// Menu items for reseller panel
const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/reseller" },
    { icon: Users, label: "Meus Clientes", path: "/reseller/clientes" },
    { icon: CreditCard, label: "Cobranças", path: "/reseller/cobrancas" },
    { icon: Package, label: "Planos", path: "/reseller/planos" },
    { icon: Bell, label: "Notificações", path: "/reseller/notificacoes" },
    { icon: Settings, label: "Configurações", path: "/reseller/configuracoes" },
    { icon: HelpCircle, label: "Suporte", path: "/reseller/suporte" },
];

export default function ResellerLayout() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-lg">BootFlow</span>
                    <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded">Revenda</span>
                </div>
                <div className="ml-auto">
                    <ThemeToggle />
                </div>
            </header>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-40 h-full w-64 bg-card border-r border-border transition-transform duration-300 lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Logo */}
                <div className="h-16 flex items-center px-4 border-b border-border">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3">
                        <span className="font-bold text-lg">BootFlow</span>
                        <span className="ml-2 text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded">Revenda</span>
                    </div>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
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
                    {menuItems.map((item) => (
                        <Button
                            key={item.path}
                            variant={isActive(item.path) ? "secondary" : "ghost"}
                            className={cn(
                                "w-full justify-start gap-3 h-11",
                                isActive(item.path) && "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                            )}
                            onClick={() => {
                                navigate(item.path);
                                setSidebarOpen(false);
                            }}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Button>
                    ))}
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
            <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
                {/* Desktop Header */}
                <header className="hidden lg:flex h-16 items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-semibold">
                            {menuItems.find(item => isActive(item.path))?.label || "Dashboard"}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Sair
                        </Button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
