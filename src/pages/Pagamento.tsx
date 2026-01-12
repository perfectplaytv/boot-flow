
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Check, CreditCard, Lock, Smartphone, User, Mail, Shield, QrCode, ArrowLeft, Loader2, Copy } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";

interface PaymentResponse {
    id?: string;
    qr_code?: string;
    qr_code_base64?: string;
    error?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?: any;
}

export default function Pagamento() {
    const location = useLocation();
    const navigate = useNavigate();
    const plan = location.state?.plan;

    const [paymentMethod, setPaymentMethod] = useState("pix");
    const [loading, setLoading] = useState(false);

    // Estado do formulário
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        whatsapp: "",
        cpf: ""
    });

    // Estado do resultado PIX e Pedido
    const [pixData, setPixData] = useState<{ qr_code: string, qr_code_base64: string } | null>(null);
    const [currentPaymentId, setCurrentPaymentId] = useState<string | null>(null);
    const [currentSubscriptionId, setCurrentSubscriptionId] = useState<number | null>(null);

    // Polling status
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'approved'>('pending');

    // Se não houver plano, volta para preços
    if (!plan) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <p className="mb-4">Sessão expirada.</p>
                <Button onClick={() => navigate('/preco')}>Voltar para Planos</Button>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const copyToClipboard = () => {
        if (pixData?.qr_code) {
            navigator.clipboard.writeText(pixData.qr_code);
            toast.success("Código PIX copiado!");
        }
    };

    // Função para criar um pedido de assinatura
    const createSubscription = async (paymentId?: string) => {
        try {
            const response = await fetch('/api/subscriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    cpf: formData.cpf,
                    whatsapp: formData.whatsapp || '',
                    plan_name: plan?.name || 'Plano Padrão',
                    plan_price: plan?.price || 'R$ 0',
                    payment_id: paymentId || ''
                })
            });

            const data = await response.json() as { subscription_id: number; success?: boolean; error?: string };

            if (!response.ok) {
                console.error('Erro ao criar pedido:', data);
                toast.error('Erro ao registrar pedido no sistema.');
                return null;
            }

            return data.subscription_id;
        } catch (err) {
            console.error('Erro ao criar pedido:', err);
            return null;
        }
    };

    // Polling para verificar pagamento
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (pixData && currentPaymentId && currentSubscriptionId && paymentStatus === 'pending') {
            console.log("Iniciando verificação de pagamento...");
            interval = setInterval(async () => {
                try {
                    const res = await fetch('/api/check-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            payment_id: currentPaymentId,
                            subscription_id: currentSubscriptionId
                        })
                    });

                    if (res.ok) {
                        const data = await res.json() as any;
                        if (data.status === 'approved') {
                            setPaymentStatus('approved');
                            clearInterval(interval);
                            toast.success("Pagamento confirmado!");

                            // Redirecionar com credenciais
                            setTimeout(() => {
                                navigate('/pedido', {
                                    state: {
                                        subscription_id: currentSubscriptionId,
                                        approved: true,
                                        username: data.username,
                                        password: data.password
                                    }
                                });
                            }, 1500);
                        }
                    }
                } catch (error) {
                    console.error("Erro no polling:", error);
                }
            }, 5000); // Verifica a cada 5 segundos
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [pixData, currentPaymentId, currentSubscriptionId, paymentStatus, navigate]);

    const handlePayment = async () => {
        // Validação simples
        if (!formData.name || !formData.email || !formData.cpf) {
            alert("Por favor, preencha Nome, Email e CPF.");
            return;
        }

        setLoading(true);
        setPixData(null);

        try {
            if (paymentMethod === 'pix') {
                // 1. Gerar Pagamento no Mercado Pago
                const response = await fetch('/api/create-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        plan,
                        payer: formData
                    })
                });

                const data = await response.json() as PaymentResponse;

                if (!response.ok) {
                    throw new Error(data.error || "Erro ao processar pagamento");
                }

                if (data.qr_code && data.qr_code_base64 && data.id) {
                    // 2. Criar Pedido no Sistema IMEDIATAMENTE (status pending)
                    const subId = await createSubscription(data.id);

                    if (subId) {
                        setPixData({ qr_code: data.qr_code, qr_code_base64: data.qr_code_base64 });
                        setCurrentPaymentId(data.id);
                        setCurrentSubscriptionId(subId);
                        toast.info("Aguardando pagamento... Não feche esta tela.");
                    } else {
                        throw new Error("Falha ao registrar pedido interno.");
                    }
                } else {
                    alert("Erro: Mercado Pago não retornou QR Code.");
                }

            } else {
                // Pagamento Cartão (Simulação)
                const subscriptionId = await createSubscription('CARD_SIMULATED');
                if (subscriptionId) {
                    toast.success("Pedido registrado! Aguardando aprovação.");
                    navigate('/pedido', { state: { subscription_id: subscriptionId } });
                }
            }
        } catch (err: unknown) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
            alert("Erro no pagamento: " + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <header className="border-b border-border/20 bg-background/95 backdrop-blur z-50 sticky top-0">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Lock className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-lg hidden sm:block">Pagamento Seguro</span>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8">

                    <div className="lg:col-span-8 space-y-8">
                        {!pixData && (
                            <div className="flex items-center gap-2 text-muted-foreground mb-6 cursor-pointer hover:text-foreground transition-colors w-fit" onClick={() => navigate(-1)}>
                                <ArrowLeft className="w-4 h-4" />
                                <span>Voltar</span>
                            </div>
                        )}

                        {/* Se já tem PIX gerado, mostra o QR Code Overlay */}
                        {pixData ? (
                            <Card className="border-green-500/50 bg-green-500/5 shadow-lg animate-in fade-in zoom-in-95">
                                <CardHeader className="text-center">
                                    <div className="mx-auto bg-green-500 rounded-full p-3 w-fit mb-2">
                                        {paymentStatus === 'approved' ? <Check className="w-8 h-8 text-white" /> : <QrCode className="w-8 h-8 text-white" />}
                                    </div>
                                    <CardTitle className="text-2xl text-green-500">
                                        {paymentStatus === 'approved' ? "Pagamento Confirmado!" : "Escaneie o QR Code"}
                                    </CardTitle>
                                    <CardDescription>
                                        {paymentStatus === 'approved'
                                            ? "Redirecionando para seu pedido..."
                                            : "Abra o app do seu banco e pague via Pix."}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center gap-6">
                                    {paymentStatus === 'pending' && (
                                        <>
                                            {/* Imagem QR Code */}
                                            <div className="bg-white p-4 rounded-lg shadow-sm relative">
                                                <img
                                                    src={`data:image/png;base64,${pixData.qr_code_base64}`}
                                                    alt="QR Code Pix"
                                                    className="w-64 h-64 object-contain"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    {/* Placeholder para scan animation se quiser */}
                                                </div>
                                            </div>

                                            <div className="w-full max-w-md space-y-2">
                                                <Label>Código Copia e Cola</Label>
                                                <div className="flex gap-2">
                                                    <Input value={pixData.qr_code} readOnly className="bg-background text-xs font-mono" />
                                                    <Button size="icon" variant="outline" onClick={copyToClipboard}>
                                                        <Copy className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center gap-2 mt-4 p-4 bg-muted/40 rounded-lg w-full max-w-md">
                                                <div className="flex items-center gap-2 text-primary font-medium animate-pulse">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>Aguardando confirmação do banco...</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground text-center">
                                                    Não feche esta página. A liberação será automática assim que o pagamento for identificado.
                                                </p>
                                            </div>
                                        </>
                                    )}

                                    {paymentStatus === 'approved' && (
                                        <div className="flex flex-col items-center justify-center p-8">
                                            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                                            <p className="text-lg font-medium">Gerando suas credenciais de acesso...</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                {/* Formulário de Dados */}
                                <Card className="border-border/50 shadow-md">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="w-5 h-5 text-primary" />
                                            Dados do Titular
                                        </CardTitle>
                                        <CardDescription>Informações necessárias para a emissão da nota fiscal.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2 sm:col-span-2">
                                            <Label htmlFor="name">Nome Completo</Label>
                                            <Input id="name" placeholder="Ex: João da Silva" className="bg-muted/30" value={formData.name} onChange={handleInputChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">E-mail</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input id="email" placeholder="seu@email.com" className="pl-9 bg-muted/30" value={formData.email} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="whatsapp">WhatsApp</Label>
                                            <div className="relative">
                                                <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input id="whatsapp" placeholder="(00) 00000-0000" className="pl-9 bg-muted/30" value={formData.whatsapp} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <Label htmlFor="cpf">CPF</Label>
                                            <Input id="cpf" placeholder="000.000.000-00" className="bg-muted/30" value={formData.cpf} onChange={handleInputChange} />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Seleção de Pagamento */}
                                <Card className="border-border/50 shadow-md ring-1 ring-primary/10">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CreditCard className="w-5 h-5 text-primary" />
                                            Forma de Pagamento
                                        </CardTitle>
                                        <CardDescription>Escolha como deseja pagar.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                            <div>
                                                <RadioGroupItem value="pix" id="pix" className="peer sr-only" />
                                                <Label
                                                    htmlFor="pix"
                                                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all h-full"
                                                >
                                                    <div className="mb-3 rounded-full bg-green-500/10 p-2 text-green-500">
                                                        <QrCode className="h-6 w-6" />
                                                    </div>
                                                    <div className="text-center space-y-1">
                                                        <span className="font-bold">Pix (Instantâneo)</span>
                                                        <p className="text-xs text-muted-foreground">Recomendado</p>
                                                    </div>
                                                </Label>
                                            </div>

                                            <div>
                                                <RadioGroupItem value="card" id="card" className="peer sr-only" />
                                                <Label
                                                    htmlFor="card"
                                                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all h-full opacity-50 cursor-not-allowed"
                                                >
                                                    <div className="mb-3 rounded-full bg-blue-500/10 p-2 text-blue-500">
                                                        <CreditCard className="h-6 w-6" />
                                                    </div>
                                                    <div className="text-center space-y-1">
                                                        <span className="font-bold">Cartão de Crédito</span>
                                                        <p className="text-xs text-muted-foreground">Em breve</p>
                                                    </div>
                                                </Label>
                                            </div>

                                        </RadioGroup>
                                    </CardContent>
                                </Card>
                            </>
                        )}

                    </div>

                    {/* Resumo Lateral (não muda) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24">
                            <Card className="bg-card shadow-lg border-primary/20">
                                <CardHeader className="pb-4">
                                    <CardTitle>Resumo</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between font-medium">
                                        <span>{plan.name}</span>
                                        <span>{plan.price}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-bold text-lg text-primary">
                                        <span>Total</span>
                                        <span>{plan.price}</span>
                                    </div>
                                </CardContent>
                                {!pixData && (
                                    <CardFooter>
                                        <Button
                                            className="w-full h-12 text-lg"
                                            onClick={handlePayment}
                                            disabled={loading}
                                        >
                                            {loading ? <Loader2 className="animate-spin mr-2" /> : <Check className="mr-2" />}
                                            Finalizar Pedido
                                        </Button>
                                    </CardFooter>
                                )}
                            </Card>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
