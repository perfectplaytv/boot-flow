import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Shield, Lock, ArrowLeft, CreditCard, Sparkles, Bot } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { plan } = location.state || {};

    // Se não houver plano selecionado, redirecionar para a página de preços
    if (!plan) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md text-center border-border/50">
                    <CardHeader>
                        <CardTitle>Nenhum plano selecionado</CardTitle>
                        <CardDescription>Por favor, escolha um plano para continuar.</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Button onClick={() => navigate('/preco')}>Ver Planos</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Header Simplificado */}
            <header className="border-b border-border/20 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div
                        className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => navigate('/')}
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            BootFlow
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/30">
                            <Lock className="w-3 h-3" />
                            Ambiente Seguro
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-5xl mx-auto">
                    <Button
                        variant="ghost"
                        className="mb-6 pl-0 hover:bg-transparent hover:text-primary transition-colors"
                        onClick={() => navigate('/preco')}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar para Planos
                    </Button>

                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Finalizar Contratação</h1>
                    <p className="text-muted-foreground mb-8">Você está a um passo de automatizar seu negócio.</p>

                    <div className="grid md:grid-cols-12 gap-8 lg:gap-12">
                        {/* Coluna da Esquerda: Resumo do Plano */}
                        <div className="md:col-span-7 lg:col-span-8 space-y-6">
                            <Card className="border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
                                <CardHeader className="bg-muted/10 pb-6 border-b border-border/30">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Badge variant="outline" className="mb-2 bg-blue-500/10 text-blue-500 border-blue-500/20">
                                                Plano Selecionado
                                            </Badge>
                                            <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-primary">{plan.price}</div>
                                            <div className="text-sm text-muted-foreground">{plan.period}</div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <p className="text-muted-foreground mb-6">{plan.description}</p>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">O que está incluído:</h3>
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            {plan.features.map((feature: any, i: number) => (
                                                <div key={i} className="flex items-start gap-2">
                                                    <div className="mt-0.5 rounded-full bg-green-500/20 p-1 text-green-500">
                                                        <Check className="w-3 h-3" />
                                                    </div>
                                                    <span className="text-sm">{feature.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Informações de Segurança */}
                            <div className="grid sm:grid-cols-3 gap-4">
                                <Card className="bg-transparent border-border/30 shadow-none">
                                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                                        <Shield className="w-8 h-8 text-green-500 mb-1" />
                                        <h3 className="font-semibold text-sm">Garantia de 7 dias</h3>
                                        <p className="text-xs text-muted-foreground">Satisfação ou seu dinheiro de volta.</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-transparent border-border/30 shadow-none">
                                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                                        <Lock className="w-8 h-8 text-blue-500 mb-1" />
                                        <h3 className="font-semibold text-sm">Pagamento Seguro</h3>
                                        <p className="text-xs text-muted-foreground">Seus dados protegidos com criptografia.</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-transparent border-border/30 shadow-none">
                                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                                        <Sparkles className="w-8 h-8 text-purple-500 mb-1" />
                                        <h3 className="font-semibold text-sm">Acesso Imediato</h3>
                                        <p className="text-xs text-muted-foreground">Comece a usar assim que confirmar.</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Coluna da Direita: Resumo e Ação */}
                        <div className="md:col-span-5 lg:col-span-4">
                            <Card className="sticky top-24 border-primary/20 bg-gradient-to-b from-card/80 to-background/80 backdrop-blur-md shadow-2xl shadow-primary/5">
                                <CardHeader>
                                    <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Plano {plan.name}</span>
                                        <span>{plan.price}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Setup</span>
                                        <span className="text-green-500 font-medium">Grátis</span>
                                    </div>
                                    <Separator className="bg-border/50" />
                                    <div className="flex justify-between items-baseline">
                                        <span className="font-semibold">Total</span>
                                        <span className="text-2xl font-bold gradient-text">{plan.price}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground text-right">{plan.period}</div>
                                </CardContent>
                                <CardFooter className="flex-col gap-3">
                                    <Button
                                        className="w-full h-12 text-lg font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 border-0"
                                        onClick={() => navigate('/cadastro', { state: { selectedPlan: plan } })}
                                    >
                                        <CreditCard className="w-5 h-5 mr-2" />
                                        Ir para Pagamento
                                    </Button>
                                    <p className="text-xs text-center text-muted-foreground px-4">
                                        Ao confirmar, você concorda com nossos <span className="underline cursor-pointer hover:text-foreground">Termos de Uso</span>.
                                    </p>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
