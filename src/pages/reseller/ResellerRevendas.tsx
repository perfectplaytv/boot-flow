import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Plus, Users, Search, MoreVertical } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ResellerRevendas() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCreateReseller = (e: React.FormEvent) => {
        e.preventDefault();
        setIsDialogOpen(false);
        toast.success("Revenda criada com sucesso!", {
            description: "O convite foi enviado para o e-mail do revendedor."
        });
        // Aqui entraria a lógica real de criação
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Store className="w-6 h-6 text-primary" />
                        Minhas Revendas
                    </h1>
                    <p className="text-muted-foreground">
                        Gerencie seus sub-revendedores e acompanhe o desempenho.
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
                            <Plus className="w-4 h-4 mr-2" />
                            Nova Revenda
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Criar Nova Revenda</DialogTitle>
                            <DialogDescription>
                                Preencha os dados abaixo para cadastrar um novo revendedor.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateReseller} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome do Revendedor</Label>
                                <Input id="name" placeholder="Ex: João Silva" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="joao@exemplo.com" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="whatsapp">WhatsApp</Label>
                                <Input id="whatsapp" placeholder="(11) 99999-9999" required />
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full">
                                    Criar Revenda
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Revendas</CardTitle>
                        <Store className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            +0% em relação ao mês passado
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revendas Ativas</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            0 inativas
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Faturamento Est.</CardTitle>
                        <div className="text-emerald-500 font-bold">R$</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ 0,00</div>
                        <p className="text-xs text-muted-foreground">
                            Mensal
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Meus Sub-revendedores</CardTitle>
                            <CardDescription>
                                Lista de todos os revendedores gerenciados por você.
                            </CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar revendedor..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
                        <div className="bg-muted p-4 rounded-full mb-4">
                            <Users className="w-8 h-8 opacity-50" />
                        </div>
                        <p>Nenhuma revenda encontrada.</p>
                        <p className="text-sm">Clique em "Nova Revenda" para começar a expandir seu negócio.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
