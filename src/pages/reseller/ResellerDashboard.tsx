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
        primary: "from-primary/20 to-primary/5 text-primary",
        green: "from-green-500/20 to-green-500/5 text-green-500",
        yellow: "from-yellow-500/20 to-yellow-500/5 text-yellow-500",
        red: "from-red-500/20 to-red-500/5 text-red-500",
    };

    return (
        <Card className="relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-50`} />
            <CardContent className="relative p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold mt-1">{value}</p>
                        {description && (
                            <p className="text-xs text-muted-foreground mt-1">{description}</p>
                        )}
                        {trend && (
                            <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {trend}
                            </p>
                        )}
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function ResellerDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Obter informações do plano do usuário
    const userPlan = user?.plan_name || 'Essencial';
    const maxClients = user?.max_clients || 5;

    // Cores do badge conforme o plano
    const planBadgeColors: Record<string, string> = {
        'Essencial': 'bg-gray-500/20 text-gray-400 border-gray-500/50',
        'Profissional': 'bg-purple-500/20 text-purple-400 border-purple-500/50',
        'Business': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
        'Elite': 'bg-amber-500/20 text-amber-400 border-amber-500/50',
    };

    // Placeholder data - will be replaced with real API calls
    const stats = {
        totalClientes: 0,
        clientesAtivos: 0,
        cobrancasPendentes: 0,
        receitaMensal: "R$ 0,00",
    };

    const recentActivities = [
        // Empty for now - will be populated from API
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Header with Plan Badge */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold">
                            Bem-vindo, {user?.name?.split(" ")[0] || "Revendedor"}! 👋
                        </h1>
                        <Badge className={`${planBadgeColors[userPlan] || planBadgeColors['Essencial']} border`}>
                            {userPlan}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">
                        Gerencie seus clientes e acompanhe suas vendas. <span className="text-xs text-gray-500">• Limite: {maxClients} clientes</span>
                    </p>
                </div>
                <Button
                    className="bg-green-600 hover:bg-green-700"
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
                />
                <StatCard
                    title="Clientes Ativos"
                    value={stats.clientesAtivos}
                    icon={CheckCircle2}
                    color="green"
                />
                <StatCard
                    title="Cobranças Pendentes"
                    value={stats.cobrancasPendentes}
                    icon={Clock}
                    color="yellow"
                />
                <StatCard
                    title="Receita Mensal"
                    value={stats.receitaMensal}
                    icon={CreditCard}
                    color="green"
                    trend="+0% este mês"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Getting Started Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-green-500" />
                            Primeiros Passos
                        </CardTitle>
                        <CardDescription>
                            Complete essas etapas para começar a vender
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">Criar sua conta</p>
                                <p className="text-sm text-muted-foreground">Concluído</p>
                            </div>
                            <Badge variant="outline" className="text-green-500 border-green-500">
                                Feito
                            </Badge>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                            <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                <AlertCircle className="w-4 h-4 text-yellow-500" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">Adicionar primeiro cliente</p>
                                <p className="text-sm text-muted-foreground">Cadastre seu primeiro cliente</p>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => navigate("/reseller/clientes")}>
                                Começar
                                <ArrowUpRight className="w-3 h-3 ml-1" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                <CreditCard className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">Configurar cobranças</p>
                                <p className="text-sm text-muted-foreground">Defina seus preços de venda</p>
                            </div>
                            <Button size="sm" variant="outline" disabled>
                                Em breve
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
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
                                {/* Activity items will go here */}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Help Card */}
            <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-bold text-lg">Precisa de ajuda?</h3>
                            <p className="text-muted-foreground">
                                Nossa equipe está pronta para te ajudar a ter sucesso nas vendas.
                            </p>
                        </div>
                        <Button
                            className="bg-green-600 hover:bg-green-700"
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
