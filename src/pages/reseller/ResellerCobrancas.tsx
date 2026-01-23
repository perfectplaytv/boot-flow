import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Plus, Search, Filter, MoreVertical, FileText, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Theme {
    color: string;
    lightColor: string;
    borderColor: string;
    gradient: string;
}

export default function ResellerCobrancas() {
    const { theme } = useOutletContext<{ theme: Theme }>();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className={cn("text-2xl font-bold flex items-center gap-2", theme.color)}>
                        <CreditCard className="w-6 h-6" />
                        Cobranças
                    </h1>
                    <p className="text-muted-foreground">
                        Gerencie as cobranças e faturas dos seus clientes
                    </p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className={cn("text-white shadow-md transition-all duration-200", theme.gradient.includes('from') ? `bg-gradient-to-r ${theme.gradient}` : "bg-primary")}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nova Cobrança
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Nova Cobrança</DialogTitle>
                            <DialogDescription>
                                Crie uma nova cobrança manual para um cliente.
                            </DialogDescription>
                        </DialogHeader>
                        <form className="space-y-4" onSubmit={(e) => {
                            e.preventDefault();
                            toast.success("Cobrança criada com sucesso!");
                        }}>
                            <div className="space-y-2">
                                <Label htmlFor="client">Cliente</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um cliente" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">João Silva</SelectItem>
                                        <SelectItem value="2">Maria Santos</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amount">Valor (R$)</Label>
                                <Input id="amount" type="number" placeholder="0,00" step="0.01" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dueDate">Data de Vencimento</Label>
                                <Input id="dueDate" type="date" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Descrição</Label>
                                <Input id="description" placeholder="Ex: Mensalidade Fevereiro" />
                            </div>
                            <DialogFooter>
                                <Button type="submit" className={cn("text-white w-full", theme.gradient.includes('from') ? `bg-gradient-to-r ${theme.gradient}` : "bg-primary")}>
                                    Gerar Cobrança
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className={cn("border shadow-sm", theme.borderColor)}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Histórico de Cobranças</CardTitle>
                            <CardDescription>
                                Visualize e gerencie todas as transações financeiras
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar cobrança..."
                                    className="pl-9 w-[200px] lg:w-[300px]"
                                />
                            </div>
                            <Button variant="outline" size="icon">
                                <Filter className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Valor</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Vencimento</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">#INV-001</TableCell>
                                    <TableCell>João Silva</TableCell>
                                    <TableCell>R$ 49,90</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                            Pago
                                        </Badge>
                                    </TableCell>
                                    <TableCell>20/01/2024</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                <DropdownMenuItem>
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    Ver Detalhes
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-500">
                                                    <XCircle className="w-4 h-4 mr-2" />
                                                    Cancelar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">#INV-002</TableCell>
                                    <TableCell>Maria Santos</TableCell>
                                    <TableCell>R$ 89,90</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                                            Pendente
                                        </Badge>
                                    </TableCell>
                                    <TableCell>25/01/2024</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                <DropdownMenuItem>
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    Ver Detalhes
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Marcar como Pago
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-500">
                                                    <XCircle className="w-4 h-4 mr-2" />
                                                    Cancelar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
