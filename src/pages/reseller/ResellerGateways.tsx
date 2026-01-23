import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, CreditCard, Plus } from "lucide-react";

export default function ResellerGateways() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Wallet className="w-6 h-6 text-primary" />
                        Gateways de Pagamento
                    </h1>
                    <p className="text-muted-foreground">
                        Configure os métodos de pagamento para seus clientes.
                    </p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Gateway
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Exemplo de Gateway: Mercado Pago */}
                <Card className="flex flex-col justify-between">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Mercado Pago
                        </CardTitle>
                        <CardDescription>
                            Processamento de cartões e PIX.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <span className="text-sm text-yellow-500 font-medium">Não Configurado</span>
                        </div>
                    </CardContent>
                    <div className="p-6 pt-0 mt-auto">
                        <Button variant="outline" className="w-full">Configurar</Button>
                    </div>
                </Card>

                {/* Exemplo de Gateway: Efi (Gerencianet) */}
                <Card className="flex flex-col justify-between opacity-75">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Efi Pay
                        </CardTitle>
                        <CardDescription>
                            Especialista em PIX e Boletos.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-300" />
                            <span className="text-sm text-muted-foreground">Inativo</span>
                        </div>
                    </CardContent>
                    <div className="p-6 pt-0 mt-auto">
                        <Button variant="outline" className="w-full" disabled>Em Breve</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
