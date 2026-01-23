import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, Power, Save, RefreshCw, MessageSquare, Settings2, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface Theme {
    color: string;
    lightColor: string;
    borderColor: string;
    gradient: string;
}

export default function ResellerBotGram() {
    const { theme } = useOutletContext<{ theme: Theme }>();
    const [botToken, setBotToken] = useState("");
    const [botName, setBotName] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [isConfiguring, setIsConfiguring] = useState(false);

    const handleSaveConfig = () => {
        if (!botToken || !botName) {
            toast.error("Preencha todos os campos obrigatórios.");
            return;
        }
        setIsConfiguring(true);
        // Simulação de delay de configuração
        setTimeout(() => {
            setIsConfiguring(false);
            setIsActive(true);
            toast.success("Bot configurado e iniciado com sucesso!", {
                description: "Seu assistente virtual já está pronto para atender."
            });
        }, 2000);
    };

    const toggleBotStatus = () => {
        setIsActive(!isActive);
        toast.info(isActive ? "Bot pausado." : "Bot iniciado.");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className={cn("text-2xl font-bold flex items-center gap-2", theme.color)}>
                        <Bot className="w-8 h-8" />
                        BotGram Elite (Beta)
                    </h1>
                    <p className="text-muted-foreground">
                        Automatize seu atendimento com inteligência artificial no Telegram
                    </p>
                </div>
                {isActive && (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-4 py-1 flex items-center gap-2 h-8">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Online
                    </Badge>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Configuração Principal */}
                <Card className={cn("border-2 shadow-sm", theme.borderColor)}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings2 className={cn("w-5 h-5", theme.color)} />
                            Configuração do Bot
                        </CardTitle>
                        <CardDescription>
                            Insira o token do seu bot criado no @BotFather
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Nome do Assistente</Label>
                            <Input
                                placeholder="Ex: Atendente Virtual"
                                value={botName}
                                onChange={(e) => setBotName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Token do Telegram</Label>
                            <div className="relative">
                                <Input
                                    type="password"
                                    placeholder="123456789:ABCdefGhIJKlmNoPQRstuVWxyz"
                                    className="pr-10 font-mono text-sm"
                                    value={botToken}
                                    onChange={(e) => setBotToken(e.target.value)}
                                />
                                <ShieldCheck className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Nunca compartilhe seu token com desconhecidos.
                            </p>
                        </div>

                        <div className="bg-muted/30 p-4 rounded-lg border flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Zap className={cn("w-4 h-4", isActive ? "text-yellow-500" : "text-muted-foreground")} />
                                <span className="font-medium text-sm">Status do Serviço</span>
                            </div>
                            <Switch checked={isActive} onCheckedChange={toggleBotStatus} disabled={!botToken} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className={cn("w-full text-white transition-all", theme.gradient.includes('from') ? `bg-gradient-to-r ${theme.gradient}` : "bg-primary")}
                            onClick={handleSaveConfig}
                            disabled={isConfiguring || isActive}
                        >
                            {isConfiguring ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Conectando...
                                </>
                            ) : isActive ? (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Configuração Salva
                                </>
                            ) : (
                                <>
                                    <Power className="w-4 h-4 mr-2" />
                                    Iniciar Bot
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>

                {/* Funcionalidades */}
                <div className="space-y-6">
                    <Card className={cn("border shadow-sm", theme.borderColor)}>
                        <CardHeader>
                            <CardTitle>Recursos Automáticos</CardTitle>
                            <CardDescription>
                                Funcionalidades ativas no seu plano Elite
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className={cn("p-2 rounded-lg mt-1", theme.lightColor)}>
                                    <MessageSquare className={cn("w-4 h-4", theme.color)} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">Respostas Rápidas</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Configure respostas automáticas para perguntas frequentes dos seus clientes.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className={cn("p-2 rounded-lg mt-1", theme.lightColor)}>
                                    <RefreshCw className={cn("w-4 h-4", theme.color)} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">Renovação Automática</h4>
                                    <p className="text-xs text-muted-foreground">
                                        O bot avisa seus clientes sobre vencimentos e gera links de pagamento Pix.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className={cn("p-2 rounded-lg mt-1", theme.lightColor)}>
                                    <Bot className={cn("w-4 h-4", theme.color)} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">Teste Grátis 24h</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Gera testes automático para novos usuários sem intervenção humana.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-900/10 to-violet-900/5 border-purple-500/20">
                        <CardHeader>
                            <CardTitle className="text-purple-500 text-base">Tutorial Rápido</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-2">
                            <p>1. Crie seu bot no <strong>@BotFather</strong> no Telegram.</p>
                            <p>2. Copie o <strong>HTTP API Token</strong> gerado.</p>
                            <p>3. Cole no campo ao lado e clique em salvar.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
