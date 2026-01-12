import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Clock, Loader2, MessageCircle, RefreshCw, Package, CheckCircle2, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface Subscription {
    id: number;
    customer_name: string;
    customer_email: string;
    plan_name: string;
    plan_price: string;
    status: 'pending' | 'approved' | 'active' | 'cancelled';
    created_at: string;
    approved_at?: string;
}

const statusSteps = [
    { key: 'pending', label: 'Recebido', icon: Package },
    { key: 'approved', label: 'Aprovado', icon: CheckCircle2 },
    { key: 'active', label: 'Ativo', icon: Check },
];

export default function AcompanhamentoPedido() {
    const location = useLocation();
    const navigate = useNavigate();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pegar ID do pedido da URL ou do state
    const subscriptionId = location.state?.subscription_id || new URLSearchParams(location.search).get('id');

    const fetchSubscription = async () => {
        if (!subscriptionId) {
            setError("ID do pedido não encontrado");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`/api/subscriptions?id=${subscriptionId}`);
            if (!response.ok) {
                throw new Error("Pedido não encontrado");
            }
            const data = await response.json();
            setSubscription(data);

            // Se o pedido foi aprovado, redirecionar para o dashboard após alguns segundos
            if (data.status === 'approved' || data.status === 'active') {
                setTimeout(() => {
                    navigate('/dashboard/revendas');
                }, 3000);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao carregar pedido");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscription();
        // Polling a cada 10 segundos para verificar o status
        const interval = setInterval(fetchSubscription, 10000);
        return () => clearInterval(interval);
    }, [subscriptionId]);

    const getStepStatus = (stepKey: string) => {
        if (!subscription) return 'waiting';

        const statusOrder = ['pending', 'approved', 'active'];
        const currentIndex = statusOrder.indexOf(subscription.status);
        const stepIndex = statusOrder.indexOf(stepKey);

        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'current';
        return 'waiting';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Carregando seu pedido...</p>
                </div>
            </div>
        );
    }

    if (error || !subscription) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-6 text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">Pedido não encontrado</h2>
                        <p className="text-muted-foreground mb-4">{error}</p>
                        <Button onClick={() => navigate('/')}>Voltar ao Início</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="border-b border-border/20 bg-background/95 backdrop-blur sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Package className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-lg">BootFlow</span>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-2xl">
                {/* Status Card */}
                <Card className="mb-6 border-primary/30 bg-primary/5">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto bg-green-500 rounded-full p-3 w-fit mb-2">
                            <Check className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl text-green-500">
                            {subscription.status === 'pending' ? 'Pedido Recebido!' :
                                subscription.status === 'approved' ? 'Pedido Aprovado! ✅' :
                                    'Assinatura Ativa! 🎉'}
                        </CardTitle>
                        <p className="text-muted-foreground">
                            Pedido #{String(subscription.id).padStart(4, '0')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Atualizado às {formatDate(subscription.created_at)}
                        </p>
                    </CardHeader>
                </Card>

                {/* Progress Steps */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                            {statusSteps.map((step, index) => {
                                const status = getStepStatus(step.key);
                                const Icon = step.icon;

                                return (
                                    <div key={step.key} className="flex flex-col items-center flex-1">
                                        <div className={`
                                            w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all
                                            ${status === 'completed' ? 'bg-green-500 text-white' :
                                                status === 'current' ? 'bg-primary text-white animate-pulse' :
                                                    'bg-muted text-muted-foreground'}
                                        `}>
                                            {status === 'completed' ? (
                                                <Check className="w-6 h-6" />
                                            ) : status === 'current' ? (
                                                <Icon className="w-6 h-6" />
                                            ) : (
                                                <Icon className="w-6 h-6" />
                                            )}
                                        </div>
                                        <span className={`text-sm font-medium ${status === 'waiting' ? 'text-muted-foreground' : 'text-foreground'
                                            }`}>
                                            {step.label}
                                        </span>
                                        {index < statusSteps.length - 1 && (
                                            <div className="absolute h-0.5 bg-muted w-full -z-10" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Order Summary */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Resumo do Pedido
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-muted-foreground">Plano</span>
                            <span className="font-medium">{subscription.plan_name}</span>
                        </div>
                        <Separator className="my-3" />
                        <div className="flex justify-between items-center">
                            <span className="font-bold">Total</span>
                            <span className="font-bold text-green-500">{subscription.plan_price}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-muted-foreground">Pagamento</span>
                            <Badge variant="outline">PIX</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Support Card */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="text-center mb-4">
                            <p className="text-muted-foreground">
                                Precisa de ajuda ou quer alterar algo?<br />
                                Fale com nosso time agora.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full border-green-500 text-green-500 hover:bg-green-500/10"
                            onClick={() => window.open('https://wa.me/5527999999999?text=Olá! Preciso de ajuda com meu pedido %23' + subscription.id, '_blank')}
                        >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Falar no WhatsApp
                        </Button>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="space-y-3">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={fetchSubscription}
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Atualizar Status
                    </Button>

                    {(subscription.status === 'approved' || subscription.status === 'active') && (
                        <Button
                            className="w-full bg-primary hover:bg-primary/90"
                            onClick={() => navigate('/dashboard/revendas')}
                        >
                            Acessar Meu Dashboard
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => navigate('/')}
                    >
                        Voltar ao Início
                    </Button>
                </div>

                {/* Auto-refresh notice */}
                {subscription.status === 'pending' && (
                    <p className="text-center text-sm text-muted-foreground mt-6">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Esta página atualiza automaticamente a cada 10 segundos
                    </p>
                )}
            </main>
        </div>
    );
}
