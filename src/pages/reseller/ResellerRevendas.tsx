import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Plus, Users } from "lucide-react";

export default function ResellerRevendas() {
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
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Revenda
                </Button>
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
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Meus Sub-revendedores</CardTitle>
                    <CardDescription>
                        Lista de todos os revendedores gerenciados por você.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                        Nenhuma revenda encontrada. Clique em "Nova Revenda" para começar.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
