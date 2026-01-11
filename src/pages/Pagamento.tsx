import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Check, CreditCard, Lock, Smartphone, User, Mail, Shield, QrCode, ArrowLeft, Loader2, Copy } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner"; // Assumindo que tem sonner ou useToast. App.tsx tem Toaster. 
// O App.tsx importa Toaster as Sonner, mas não vi o componente Pagamento importar hook. 
// Vou usar window.alert ou tentar importar useToast se souber o caminho.
// O App.tsx importa  import { Toaster as Sonner } from "@/components/ui/sonner";
// Vou assumir que posso usar 'sonner' library direct import 'toast'.

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

    // Estado do resultado PIX
    const [pixData, setPixData] = useState<{ qr_code: string, qr_code_base64: string } | null>(null);

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
            alert("Código PIX copiado!");
        }
    };

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
                // Chamada à API Serverless
                const response = await fetch('/api/create-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        plan,
                        payer: formData
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Erro ao processar pagamento");
                }

                if (data.qr_code && data.qr_code_base64) {
                    setPixData(data);
                } else {
                    alert("Erro: Mercado Pago não retornou QR Code.");
                }

            } else {
                // Simulação Cartão
                setTimeout(() => {
                    alert("Pagamento com cartão (Simulação) processado com sucesso!");
                    navigate('/dashboard/client'); // Redireciona para dashboard simulado
                }, 1500);
            }
        } catch (err: any) {
            console.error(err);
            alert("Erro no pagamento: " + err.message);
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
                        <div className="flex items-center gap-2 text-muted-foreground mb-6 cursor-pointer hover:text-foreground transition-colors w-fit" onClick={() => navigate(-1)}>
                            <ArrowLeft className="w-4 h-4" />
                            <span>Voltar</span>
                        </div>

                        {/* Se já tem PIX gerado, mostra o QR Code Overlay ou substitui o form */}
                        {pixData ? (
                            <Card className="border-green-500/50 bg-green-500/5 shadow-lg animate-in fade-in zoom-in-95">
                                <CardHeader className="text-center">
                                    <div className="mx-auto bg-green-500 rounded-full p-3 w-fit mb-2">
                                        <Check className="w-8 h-8 text-white" />
                                    </div>
                                    <CardTitle className="text-2xl text-green-500">Pagamento Pix Gerado!</CardTitle>
                                    <CardDescription>Escaneie o QR Code ou copie o código abaixo para finalizar.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center gap-6">
                                    {/* Imagem QR Code */}
                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <img
                                            src={`data:image/png;base64,${pixData.qr_code_base64}`}
                                            alt="QR Code Pix"
                                            className="w-64 h-64 object-contain"
                                        />
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

                                    <div className="text-center text-sm text-muted-foreground">
                                        Após o pagamento, seu acesso será liberado automaticamente em alguns instantes.
                                        (Simulação: Atualize a página ou aguarde o webhook).
                                    </div>
                                </CardContent>
                                <CardFooter className="justify-center gap-4">
                                    <Button variant="outline" onClick={() => setPixData(null)}>Voltar</Button>
                                    <Button onClick={() => navigate('/dashboard/client')}>Já paguei!</Button>
                                </CardFooter>
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
                                                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all h-full"
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
