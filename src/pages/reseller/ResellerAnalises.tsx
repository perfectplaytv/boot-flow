import { useState, useRef, useEffect, type HTMLAttributes } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Users, DollarSign, Eye, Download, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Theme {
    color: string;
    lightColor: string;
    borderColor: string;
    gradient: string;
}

type WidthBarProps = {
    width: string;
    className?: string;
} & HTMLAttributes<HTMLDivElement>;

function WidthBar({ width, className, ...rest }: WidthBarProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (ref.current) ref.current.style.width = width;
    }, [width]);
    return <div ref={ref} className={className} {...rest} />;
}

export default function ResellerAnalises() {
    const { theme } = useOutletContext<{ theme: Theme }>();
    const [timeRange, setTimeRange] = useState("7d");

    const metrics = {
        totalClients: 154,
        activeClients: 142,
        revenue: 4250.00,
        growth: 12.5,
        newClients: 18,
        conversionRate: 8.5
    };

    const topPlans = [
        { name: "Plano Mensal", users: 85, growth: 12 },
        { name: "Plano Trimestral", users: 45, growth: 5 },
        { name: "Plano Anual", users: 24, growth: -2 },
    ];

    const monthlyRevenue = [
        { month: "Jan", value: 3200 },
        { month: "Fev", value: 3500 },
        { month: "Mar", value: 4250 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className={cn("text-2xl font-bold flex items-center gap-2", theme.color)}>
                        <BarChart3 className="w-6 h-6" />
                        Análises
                    </h1>
                    <p className="text-muted-foreground">
                        Acompanhe o desempenho do seu negócio em tempo real
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Selecione o período" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1d">Hoje</SelectItem>
                            <SelectItem value="7d">Últimos 7 dias</SelectItem>
                            <SelectItem value="30d">Últimos 30 dias</SelectItem>
                            <SelectItem value="90d">Últimos 3 meses</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className={cn("gap-2", theme.color)}>
                        <Download className="w-4 h-4" />
                        Exportar Relatório
                    </Button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className={cn("border shadow-sm", theme.borderColor)}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                        <DollarSign className={cn("h-4 w-4", theme.color)} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ {metrics.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowUpRight className="w-3 h-3 text-emerald-500 mr-1" />
                            <span className="text-emerald-500 font-medium">+{metrics.growth}%</span>
                            <span className="ml-1">vs. mês anterior</span>
                        </p>
                    </CardContent>
                </Card>
                <Card className={cn("border shadow-sm", theme.borderColor)}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
                        <Users className={cn("h-4 w-4", theme.color)} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.activeClients}</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowUpRight className="w-3 h-3 text-emerald-500 mr-1" />
                            <span className="text-emerald-500 font-medium">+8%</span>
                            <span className="ml-1">novos clientes</span>
                        </p>
                    </CardContent>
                </Card>
                <Card className={cn("border shadow-sm", theme.borderColor)}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
                        <Eye className={cn("h-4 w-4", theme.color)} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2,350</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowDownRight className="w-3 h-3 text-red-500 mr-1" />
                            <span className="text-red-500 font-medium">-2%</span>
                            <span className="ml-1">vs. semana anterior</span>
                        </p>
                    </CardContent>
                </Card>
                <Card className={cn("border shadow-sm", theme.borderColor)}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                        <TrendingUp className={cn("h-4 w-4", theme.color)} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowUpRight className="w-3 h-3 text-emerald-500 mr-1" />
                            <span className="text-emerald-500 font-medium">+1.2%</span>
                            <span className="ml-1">melhoria</span>
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Plans */}
                <Card className={cn("border shadow-sm", theme.borderColor)}>
                    <CardHeader>
                        <CardTitle>Planos Mais Vendidos</CardTitle>
                        <CardDescription>
                            Distribuição de clientes por plano
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topPlans.map((plan, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className={cn("font-medium", theme.color)}>{plan.name}</span>
                                            <span className="text-muted-foreground">({plan.users} usuários)</span>
                                        </div>
                                        <span className={cn("text-xs font-medium", plan.growth >= 0 ? "text-emerald-500" : "text-red-500")}>
                                            {plan.growth >= 0 ? '+' : ''}{plan.growth}%
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <WidthBar
                                            width={`${(plan.users / 100) * 100}%`}
                                            className={cn("h-full rounded-full transition-all duration-500", theme.gradient)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Revenue Simple Chart */}
                <Card className={cn("border shadow-sm", theme.borderColor)}>
                    <CardHeader>
                        <CardTitle>Crescimento de Receita</CardTitle>
                        <CardDescription>
                            Evolução financeira nos últimos meses
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] flex items-end justify-between gap-4 pt-4">
                            {monthlyRevenue.map((item, index) => (
                                <div key={index} className="flex flex-col items-center gap-2 w-full group">
                                    <div className="relative w-full flex justify-end flex-col items-center h-[150px]">
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 transition-opacity text-xs font-bold mb-1 bg-background px-2 py-1 rounded shadow border whitespace-nowrap z-10">
                                            R$ {item.value}
                                        </div>
                                        <WidthBar
                                            width="50%" // Using WidthBar as HeightBar essentially by rotating or just styling
                                            className={cn("w-full lg:w-16 rounded-t-md transition-all duration-500 opacity-80 group-hover:opacity-100", theme.lightColor.replace('bg-', 'bg-').replace('/10', '/60'))}
                                            style={{ height: `${(item.value / 5000) * 100}%`, width: '40%' }}
                                        />
                                    </div>
                                    <span className="text-xs font-medium text-muted-foreground">{item.month}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
