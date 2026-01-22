import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResellerCobrancas() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-green-500" />
                        Cobranças
                    </h1>
                    <p className="text-muted-foreground">
                        Gerencie as cobranças dos seus clientes
                    </p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Cobrança
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Em Desenvolvimento</CardTitle>
                    <CardDescription>
                        Esta funcionalidade estará disponível em breve
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12">
                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Em breve!</h3>
                        <p className="text-muted-foreground">
                            Você poderá criar e gerenciar cobranças para seus clientes
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
