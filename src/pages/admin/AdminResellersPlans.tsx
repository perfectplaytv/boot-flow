
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Check, X, Shield, Zap, TrendingUp, Users } from "lucide-react";
import { toast } from 'sonner';

interface ResellerPlanData {
    id: number;
    name: string;
    email: string;
    plan_name: string;
    status: string;
    max_clients: number;
    usage: {
        clients: number;
        apps: number;
        charges: number;
    };
    feature_botgram: number; // SQLite boolean 0 or 1
    feature_analytics: number;
    feature_automation: number;
    support_level: string;
}

export default function AdminResellersPlans() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ResellerPlanData[]>([]);

    useEffect(() => {
        // Fetch dados do endpoint criado
        fetch('/api/admin/resellers-plans')
            .then(res => res.json())
            .then((res: any) => {
                if (res.success) {
                    setData(res.data);
                } else {
                    toast.error('Erro ao carregar planos: ' + res.error);
                }
            })
            .catch((e) => toast.error('Erro de conexão: ' + e.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-[50vh]">
            <Loader2 className="animate-spin w-8 h-8 text-primary" />
        </div>
    );

    // Cálculos de resumo
    const totalResellers = data.length;
    const activeResellers = data.filter(r => r.status === 'active' || r.status === 'ativo').length;
    const eliteResellers = data.filter(r => r.plan_name === 'Elite').length;

    return (
        <div className="space-y-6 pt-4">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Revendas & Planos</h2>
                <Badge variant="outline" className="text-base px-3 py-1">
                    Total: {totalResellers}
                </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revendas Ativas</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeResellers}</div>
                        <p className="text-xs text-muted-foreground">
                            {((activeResellers / totalResellers) * 100).toFixed(0)}% da base
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Assinantes Elite</CardTitle>
                        <Shield className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{eliteResellers}</div>
                    </CardContent>
                </Card>
                {/* Placeholder Cards */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Receita Estimada</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ --</div>
                        <p className="text-xs text-muted-foreground">Mensal</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Visão Geral de Assinaturas e Uso</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Revenda</TableHead>
                                <TableHead>Plano</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[200px]">Uso (Clientes)</TableHead>
                                <TableHead className="text-center">BotGram</TableHead>
                                <TableHead className="text-center">Analytics</TableHead>
                                <TableHead className="text-center">Suporte</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>
                                        <div className="font-medium">{row.name}</div>
                                        <div className="text-xs text-muted-foreground">{row.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            row.plan_name === 'Elite' ? 'default' :
                                                row.plan_name === 'Business' ? 'secondary' : 'outline'
                                        }>
                                            {row.plan_name || 'Essencial'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`
                                            ${row.status === 'active' || row.status === 'ativo' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500'}
                                        `}>
                                            {row.status || 'Active'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between text-xs">
                                                <span>{row.usage.clients} / {row.max_clients || '∞'}</span>
                                                <span className="text-muted-foreground">
                                                    {row.max_clients ? Math.round((row.usage.clients / row.max_clients) * 100) : 0}%
                                                </span>
                                            </div>
                                            <Progress
                                                value={row.max_clients ? (row.usage.clients / row.max_clients) * 100 : 0}
                                                className="h-2"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {row.feature_botgram ? (
                                            <Check className="mx-auto text-green-500 w-4 h-4" />
                                        ) : (
                                            <X className="mx-auto text-muted-foreground w-4 h-4 opacity-30" />
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {row.feature_analytics ? (
                                            <Check className="mx-auto text-green-500 w-4 h-4" />
                                        ) : (
                                            <X className="mx-auto text-muted-foreground w-4 h-4 opacity-30" />
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${row.support_level === 'vip' ? 'bg-yellow-100 text-yellow-700' :
                                                row.support_level === 'priority' ? 'bg-blue-100 text-blue-700' : 'text-muted-foreground'
                                            }`}>
                                            {row.support_level?.toUpperCase() || 'STD'}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
