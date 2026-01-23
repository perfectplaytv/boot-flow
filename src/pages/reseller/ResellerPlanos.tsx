import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Plus, Check, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Theme {
    color: string;
    lightColor: string;
    borderColor: string;
    gradient: string;
}

export default function ResellerPlanos() {
    const { theme } = useOutletContext<{ theme: Theme }>();

    // Mock data for plans
    const plans = [
        {
            id: 1,
            name: "Plano Básico",
            price: 29.90,
            features: ["1 Usuário", "Suporte Básico", "Acesso Web"],
            active: true
        },
        {
            id: 2,
            name: "Plano Gold",
            price: 49.90,
            features: ["3 Usuários", "Suporte Prioritário", "Acesso Web + Mobile", "Backup Semanal"],
            active: true
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className={cn("text-2xl font-bold flex items-center gap-2", theme.color)}>
                        <Package className="w-6 h-6" />
                        Planos de Venda
                    </h1>
                    <p className="text-muted-foreground">
                        Crie e gerencie os planos que você oferece aos seus clientes
                    </p>
                </div>
                <Button
                    className={cn("text-white shadow-md transition-all", theme.gradient.includes('from') ? `bg-gradient-to-r ${theme.gradient}` : "bg-primary")}
                    onClick={() => toast.success("Novo plano", { description: "Modal de criação de plano será aberto." })}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Plano
                </Button>
            </div>

            <Card className={cn("border shadow-sm", theme.borderColor)}>
                <CardHeader>
                    <CardTitle>Seus Planos</CardTitle>
                    <CardDescription>
                        Lista de planos ativos para comercialização
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome do Plano</TableHead>
                                    <TableHead>Preço (Mensal)</TableHead>
                                    <TableHead>Recursos Incluídos</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {plans.map((plan) => (
                                    <TableRow key={plan.id}>
                                        <TableCell className="font-medium">{plan.name}</TableCell>
                                        <TableCell>R$ {plan.price.toFixed(2).replace('.', ',')}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {plan.features.slice(0, 2).map((feature, idx) => (
                                                    <Badge key={idx} variant="outline" className="text-xs">
                                                        {feature}
                                                    </Badge>
                                                ))}
                                                {plan.features.length > 2 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{plan.features.length - 2}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={cn("bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20")}>
                                                Ativo
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
