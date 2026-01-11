import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Check, CreditCard, Lock, Smartphone, User, Mail, Shield, QrCode, ArrowLeft, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const plan = location.state?.plan;

    const [paymentMethod, setPaymentMethod] = useState("pix");
    const [loading, setLoading] = useState(false);

    // Se não houver plano, volta para preços (segurança)
    if (!plan) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <p className="mb-4">Sessão expirada ou inválida.</p>
                <Button onClick={() => navigate('/preco')}>Voltar para Planos</Button>
            </div>
        );
    }

    const handlePayment = () => {
        setLoading(true);
        // Simulação de processamento
        setTimeout(() => {
            setLoading(false);
            alert("Integração com Mercado Pago será implementada aqui! Dados prontos para envio.");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Header Minimalista */}
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

                    {/* Coluna Principal: Formulário e Pagamento */}
                    <div className="lg:col-span-8 space-y-8">

                        <div className="flex items-center gap-2 text-muted-foreground mb-6 cursor-pointer hover:text-foreground transition-colors w-fit" onClick={() => navigate(-1)}>
                            <ArrowLeft className="w-4 h-4" />
                            <span>Voltar</span>
                        </div>

                        {/* Seção 1: Dados Pessoais */}
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
                                    <Input id="name" placeholder="Ex: João da Silva" className="bg-muted/30" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">E-mail</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input id="email" placeholder="seu@email.com" className="pl-9 bg-muted/30" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="whatsapp">WhatsApp</Label>
                                    <div className="relative">
                                        <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input id="whatsapp" placeholder="(00) 00000-0000" className="pl-9 bg-muted/30" />
                                    </div>
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="cpf">CPF</Label>
                                    <Input id="cpf" placeholder="000.000.000-00" className="bg-muted/30" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Seção 2: Pagamento */}
                        <Card className="border-border/50 shadow-md ring-1 ring-primary/10">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-primary" />
                                    Forma de Pagamento
                                </CardTitle>
                                <CardDescription>Escolha como deseja pagar. Transações seguras e criptografadas.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    {/* Opção PIX */}
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
                                                <p className="text-xs text-muted-foreground">Liberação imediata do acesso</p>
                                            </div>
                                            <div className="mt-3 w-full bg-green-500/10 text-green-600 text-xs py-1 px-2 rounded text-center font-medium">
                                                Recomendado
                                            </div>
                                        </Label>
                                    </div>

                                    {/* Opção Cartão */}
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
                                                <p className="text-xs text-muted-foreground">Em até 12x</p>
                                            </div>
                                        </Label>
                                    </div>

                                </RadioGroup>

                                {/* Detalhes condicionais do pagamento */}
                                <div className="mt-6 p-4 bg-muted/20 rounded-lg animate-in fade-in slide-in-from-top-2">
                                    {paymentMethod === 'pix' ? (
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-green-500/20 rounded-full text-green-500 mt-1">
                                                <Check className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Você escolheu Pix!</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Ao clicar em "Gerar QR Code", você receberá um código para pagamento instantâneo.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 gap-2">
                                                <Label>Número do Cartão</Label>
                                                <Input placeholder="0000 0000 0000 0000" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Validade</Label>
                                                    <Input placeholder="MM/AA" />
                                                </div>
                                                <div>
                                                    <Label>CVV</Label>
                                                    <Input placeholder="123" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </CardContent>
                        </Card>

                    </div>

                    {/* Coluna Lateral: Resumo do Pedido */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24">
                            <Card className="bg-card shadow-lg border-primary/20 overflow-hidden">
                                <div className="h-2 bg-primary w-full" />
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <div>
                                            <p className="font-medium">{plan.name}</p>
                                            <p className="text-xs text-muted-foreground">{plan.period}</p>
                                        </div>
                                        <div className="font-bold">{plan.price}</div>
                                    </div>

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Setup inicial</span>
                                        <span className="text-green-500 font-medium">Grátis</span>
                                    </div>

                                    <div className="space-y-2 pt-4">
                                        <div className="flex justify-between items-end">
                                            <span className="font-semibold text-lg">Total</span>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-primary">{plan.price}</div>
                                            </div>
                                        </div>
                                    </div>

                                </CardContent>
                                <CardFooter className="flex-col gap-4 bg-muted/10 pt-6">
                                    <Button
                                        className={`w-full h-12 text-base font-bold shadow-lg transition-all ${paymentMethod === 'pix' ? 'bg-green-600 hover:bg-green-700 shadow-green-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'}`}
                                        onClick={handlePayment}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...
                                            </>
                                        ) : (
                                            <>
                                                {paymentMethod === 'pix' ? (
                                                    <>
                                                        <QrCode className="mr-2 h-5 w-5" /> Gerar QR Code Pix
                                                    </>
                                                ) : (
                                                    <>
                                                        <CreditCard className="mr-2 h-5 w-5" /> Pagar com Cartão
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </Button>

                                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                        <Shield className="w-3 h-3" />
                                        <span>Ambiente 100% seguro por SSL</span>
                                    </div>
                                </CardFooter>
                            </Card>

                            {/* Botão de Ajuda */}
                            <div className="mt-6 text-center">
                                <p className="text-sm text-muted-foreground mb-2">Precisa de ajuda?</p>
                                <Button variant="outline" size="sm" className="w-full">
                                    Falar com Suporte
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
