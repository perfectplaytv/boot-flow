import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, CreditCard, Plus, Check, ExternalLink } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function ResellerGateways() {
    const [mpConfigured, setMpConfigured] = useState(false);
    const [isMpDialogOpen, setIsMpDialogOpen] = useState(false);

    const handleSaveMp = (e: React.FormEvent) => {
        e.preventDefault();
        setIsMpDialogOpen(false);
        setMpConfigured(true);
        toast.success("Mercado Pago configurado com sucesso!", {
            description: "Agora você pode receber pagamentos via PIX e Cartão."
        });
    };

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
                <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                    onClick={() => toast.info("Novos gateways em breve!", { description: "Estamos integrando com Asaas e Stripe." })}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Gateway
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Mercado Pago */}
                <Card className={`flex flex-col justify-between transition-all ${mpConfigured ? 'border-green-500/50 bg-green-500/5' : ''}`}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-blue-500" />
                            Mercado Pago
                        </CardTitle>
                        <CardDescription>
                            Processamento de cartões e PIX.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 mb-4">
                            <div className={`w-3 h-3 rounded-full ${mpConfigured ? 'bg-green-500' : 'bg-yellow-500'}`} />
                            <span className={`text-sm font-medium ${mpConfigured ? 'text-green-500' : 'text-yellow-500'}`}>
                                {mpConfigured ? 'Ativo e Operando' : 'Não Configurado'}
                            </span>
                        </div>
                        {mpConfigured && (
                            <div className="text-xs text-muted-foreground bg-background/50 p-2 rounded">
                                Taxa PIX: 0.99%<br />
                                Recebimento: Na hora
                            </div>
                        )}
                    </CardContent>
                    <div className="p-6 pt-0 mt-auto">
                        <Dialog open={isMpDialogOpen} onOpenChange={setIsMpDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant={mpConfigured ? "outline" : "default"} className={mpConfigured ? "w-full" : "w-full bg-blue-600 hover:bg-blue-700 text-white"}>
                                    {mpConfigured ? 'Editar Configuração' : 'Configurar Agora'}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Configurar Mercado Pago</DialogTitle>
                                    <DialogDescription>
                                        Insira suas credenciais de produção do Mercado Pago.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSaveMp} className="space-y-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-xs text-blue-700 dark:text-blue-300 flex gap-2">
                                        <ExternalLink className="w-4 h-4 shrink-0" />
                                        <p>
                                            Acesse o painel do Mercado Pago Developers para obter suas credenciais de produção (Access Token).
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="access-token">Access Token (Produção)</Label>
                                        <Input id="access-token" type="password" placeholder="APP_USR-..." required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="public-key">Public Key</Label>
                                        <Input id="public-key" placeholder="APP_USR-..." required />
                                    </div>

                                    <div className="flex items-center space-x-2 pt-2">
                                        <Switch id="pix-enabled" defaultChecked />
                                        <Label htmlFor="pix-enabled">Aceitar PIX</Label>
                                    </div>

                                    <DialogFooter>
                                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                            Salvar Credenciais
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </Card>

                {/* Efi Bank */}
                <Card className="flex flex-col justify-between opacity-75 grayscale hover:grayscale-0 transition-all">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-orange-500" />
                            Efi Pay (Gerencianet)
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
                        <Button variant="outline" className="w-full cursor-not-allowed" disabled>Em Breve</Button>
                    </div>
                </Card>

                {/* Stripe (Placeholder) */}
                <Card className="flex flex-col justify-between opacity-50 border-dashed">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Stripe
                        </CardTitle>
                        <CardDescription>
                            Pagamentos internacionais.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-300" />
                            <span className="text-sm text-muted-foreground">Em desenvolvimento</span>
                        </div>
                    </CardContent>
                    <div className="p-6 pt-0 mt-auto">
                        <Button variant="ghost" className="w-full" disabled>Aguarde</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
