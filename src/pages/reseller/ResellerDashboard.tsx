import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
    Users,
    CreditCard,
    TrendingUp,
    Package,
    Plus,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";

// Stats Card Component
function StatCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    color = "primary"
}: {
    title: string;
    value: string | number;
    description?: string;
    icon: React.ElementType;
    trend?: string;
    color?: "primary" | "green" | "yellow" | "red";
}) {
    const colorClasses = {
        primary: "from-blue-500/20 to-blue-500/5 text-blue-500",
        green: "from-emerald-500/20 to-emerald-500/5 text-emerald-500",
        yellow: "from-amber-500/20 to-amber-500/5 text-amber-500",
        red: "from-red-500/20 to-red-500/5 text-red-500",
    };

    return (
        <Card className="relative overflow-hidden border shadow-sm">
            <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-50`} />
            <CardContent className="relative p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">{title}</p>
                        <p className="text-3xl font-bold mt-1">{value}</p>
                        {description && (
                            <p className="text-xs text-muted-foreground mt-1">{description}</p>
                        )}
                        {trend && (
                            <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1 font-medium">
                                <TrendingUp className="w-3 h-3" />
                                {trend}
                            </p>
                        )}
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br shadow-inner ${colorClasses[color]}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Interface do contexto do layout
interface ResellerContextType {
    currentPlan: string;
    theme: {
        color: string;
        lightColor: string;
        borderColor: string;
        gradient: string;
    };
}

interface Activity {
    id: number;
    action: string;
    time: string;
    user: string;
}

export default function ResellerDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Obter dados atualizados do contexto do Layout
    const context = useOutletContext<ResellerContextType>();

    // Fallback seguro caso o contexto não esteja disponível (ex: teste isolado)
    const userPlan = context?.currentPlan || user?.plan_name || 'Essencial';
    const theme = context?.theme;

    const maxClients = user?.max_clients || 5;

    // Cores do badge sincronizadas com o layout
    const planBadgeColors: Record<string, string> = {
        'Essencial': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        'Profissional': 'bg-green-500/10 text-green-500 border-green-500/20',
        'Business': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
        'Elite': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    };

    // Placeholder data - initialized to zero/empty
    const stats = {
        totalClientes: 0,
        clientesAtivos: 0,
        cobrancasPendentes: 0,
        receitaMensal: "R$ 0,00",
    };

    const recentActivities: Activity[] = [];

    return (
        <div className="space-y-6">
            {/* Welcome Header with Plan Badge */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className={cn("text-2xl font-bold", theme?.color)}>
                            Bem-vindo, {user?.name?.split(" ")[0] || "Revendedor"}! 👋
                        </h1>
                        <Badge className={cn("border px-3 py-1 text-sm shadow-sm hover:bg-opacity-80 transition-colors", planBadgeColors[userPlan] || planBadgeColors['Essencial'])}>
                            {userPlan}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">
                        Gerencie seus clientes e acompanhe suas vendas. <span className="text-xs text-muted-foreground/80">• Limite: {maxClients} clientes</span>
                    </p>
                </div>
                <Button
                    className={cn("text-white shadow-md transition-all hover:scale-105", theme?.gradient?.includes('from') ? `bg-gradient-to-r ${theme.gradient}` : "bg-primary")}
                    onClick={() => navigate("/reseller/clientes")}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Cliente
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total de Clientes"
                    value={stats.totalClientes}
                    icon={Users}
                    color="primary"
                    trend="+4 novos"
                />
                <StatCard
                    title="Clientes Ativos"
                    value={stats.clientesAtivos}
                    icon={CheckCircle2}
                    color="green"
                    trend="90% ativos"
                />
                <StatCard
                    title="Cobranças Pendentes"
                    value={stats.cobrancasPendentes}
                    icon={Clock}
                    color="yellow"
                    description="Vencem em breve"
                />
                <StatCard
                    title="Receita Mensal"
                    value={stats.receitaMensal}
                    icon={CreditCard}
                    color="green"
                    trend="+12% este mês"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Getting Started Card */}
                <Card className={cn("border shadow-sm", theme?.borderColor)}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className={cn("w-5 h-5", theme?.color)} />
                            Primeiros Passos
                        </CardTitle>
                        <CardDescription>
                            Complete essas etapas para começar a vender
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-emerald-700 dark:text-emerald-400">Criar sua conta</p>
                                <p className="text-sm text-emerald-600/80 dark:text-emerald-500/80">Concluído</p>
                            </div>
                            <Badge variant="outline" className="text-emerald-500 border-emerald-500 bg-emerald-500/10">
                                Feito
                            </Badge>
                        </div>

                        <div className={cn("flex items-center gap-4 p-4 rounded-lg border", theme?.lightColor, theme?.borderColor)}>
                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center bg-background/50", theme?.color)}>
                                <AlertCircle className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">Adicionar primeiro cliente</p>
                                <p className="text-sm text-muted-foreground">Cadastre seu primeiro cliente</p>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => navigate("/reseller/clientes")} className={cn("border", theme?.borderColor, theme?.color)}>
                                Começar
                                <ArrowUpRight className="w-3 h-3 ml-1" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-muted">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                <CreditCard className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-muted-foreground">Configurar cobranças</p>
                                <p className="text-sm text-muted-foreground">Defina seus preços de venda</p>
                            </div>
                            <Button size="sm" variant="outline" disabled>
                                Em breve
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className={cn("border shadow-sm", theme?.borderColor)}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className={cn("w-5 h-5", theme?.color)} />
                            Atividade Recente
                        </CardTitle>
                        <CardDescription>
                            Últimas ações na sua conta
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentActivities.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                                    <Clock className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground">Nenhuma atividade recente</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Suas ações aparecerão aqui
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                                        <div className={cn("w-2 h-2 mt-2 rounded-full", theme?.color ? theme.color.replace('text-', 'bg-') : 'bg-primary')} />
                                        <div>
                                            <p className="text-sm font-medium">{activity.action}</p>
                                            <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Help Card */}
            <Card className={cn("border shadow-sm", theme?.lightColor, theme?.borderColor)}>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 className={cn("font-bold text-lg", theme?.color)}>Precisa de ajuda?</h3>
                            <p className="text-muted-foreground">
                                Nossa equipe está pronta para te ajudar a ter sucesso nas vendas.
                            </p>
                        </div>
                        <Button
                            className={cn("text-white shadow-sm", theme?.gradient?.includes('from') ? `bg-gradient-to-r ${theme.gradient}` : "bg-primary")}
                            onClick={() => navigate("/reseller/suporte")}
                        >
                            Falar com Suporte
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
