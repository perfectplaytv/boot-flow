import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, QrCode, RefreshCw, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Theme {
    color: string;
    lightColor: string;
    borderColor: string;
    gradient: string;
}

export default function ResellerWhatsApp() {
    const { theme } = useOutletContext<{ theme: Theme }>();
    const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
    const [qrCode, setQrCode] = useState<string | null>(null);

    const handleConnect = () => {
        setStatus('connecting');
        // Simulação de chamada API para obter QR Code
        setTimeout(() => {
            setQrCode("https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"); // Placeholder QR
            toast.success("QR Code gerado com sucesso!");

            // Simulação de conexão bem sucedida após "ler" o QR
            setTimeout(() => {
                setStatus('connected');
                toast.success("WhatsApp Conectado!");
            }, 5000);
        }, 1500);
    };

    const handleDisconnect = () => {
        setStatus('disconnected');
        setQrCode(null);
        toast.info("WhatsApp desconectado.");
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className={cn("text-2xl font-bold flex items-center gap-2", theme.color)}>
                    <MessageCircle className="w-6 h-6" />
                    Conexão WhatsApp
                </h1>
                <p className="text-muted-foreground">
                    Conecte seu WhatsApp para enviar notificações automáticas aos seus clientes.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className={cn("border-2", theme.borderColor)}>
                    <CardHeader>
                        <CardTitle>Status da Conexão</CardTitle>
                        <CardDescription>
                            Verifique se seu WhatsApp está conectado e pronto para uso.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-6 min-h-[300px]">
                        {status === 'disconnected' && (
                            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                                <div className="w-20 h-20 rounded-full bg-red-100/50 flex items-center justify-center mb-4">
                                    <MessageCircle className="w-10 h-10 text-red-500" />
                                </div>
                                <h3 className="font-bold text-xl text-red-500">Desconectado</h3>
                                <p className="text-sm text-muted-foreground mt-2 text-center max-w-xs">
                                    Nenhuma sessão ativa encontrada. Clique abaixo para gerar um QR Code.
                                </p>
                            </div>
                        )}

                        {status === 'connecting' && !qrCode && (
                            <div className="flex flex-col items-center animate-pulse">
                                <Loader2 className={cn("w-16 h-16 animate-spin mb-4", theme.color)} />
                                <h3 className="font-bold text-lg">Iniciando Sessão...</h3>
                                <p className="text-sm text-muted-foreground">Aguarde enquanto geramos o QR Code</p>
                            </div>
                        )}

                        {status === 'connecting' && qrCode && (
                            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                                <div className={cn("bg-white p-2 rounded-lg mb-4 border-2", theme.borderColor)}>
                                    <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                                </div>
                                <h3 className={cn("font-bold text-lg", theme.color)}>Escaneie o QR Code</h3>
                                <p className="text-sm text-muted-foreground text-center max-w-xs">
                                    Abra o WhatsApp no seu celular &gt; Configurações &gt; Aparelhos Conectados &gt; Conectar Aparelho
                                </p>
                            </div>
                        )}

                        {status === 'connected' && (
                            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                                <div className="w-20 h-20 rounded-full bg-emerald-100/50 flex items-center justify-center mb-4">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                                </div>
                                <h3 className="font-bold text-xl text-emerald-600">Conectado</h3>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Seu WhatsApp está pronto para enviar mensagens.
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Número: (11) 99999-****
                                </p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="justify-center border-t pt-6">
                        {status === 'disconnected' && (
                            <Button
                                size="lg"
                                className={cn("w-full text-white shadow-md transition-all hover:scale-[1.02]", theme.gradient.includes('from') ? `bg-gradient-to-r ${theme.gradient}` : "bg-primary")}
                                onClick={handleConnect}
                            >
                                <QrCode className="w-5 h-5 mr-2" />
                                Gerar QR Code
                            </Button>
                        )}

                        {status === 'connecting' && qrCode && (
                            <Button variant="outline" className="w-full" onClick={() => setStatus('disconnected')}>
                                Cancelar
                            </Button>
                        )}

                        {status === 'connected' && (
                            <Button variant="destructive" className="w-full" onClick={handleDisconnect}>
                                Desconectar
                            </Button>
                        )}
                    </CardFooter>
                </Card>

                <div className="space-y-6">
                    <Card className={cn("border shadow-sm", theme.borderColor)}>
                        <CardHeader>
                            <CardTitle>Configurações de Envio</CardTitle>
                            <CardDescription>
                                Personalize como as mensagens serão enviadas.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className={cn("p-4 rounded-lg text-sm border-l-4", theme.lightColor, theme.borderColor.replace('border-', 'border-l-'))}>
                                <p className="font-medium mb-2 flex items-center gap-2">
                                    <MessageCircle className={cn("w-4 h-4", theme.color)} />
                                    Limites do Plano Atual
                                </p>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className={cn("w-3 h-3", theme.color)} />
                                        1 Conexão simultânea
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className={cn("w-3 h-3", theme.color)} />
                                        5 Notificações diárias
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className={cn("w-3 h-3", theme.color)} />
                                        Mensagens de texto apenas
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={cn("border", theme.lightColor, theme.borderColor)}>
                        <CardHeader>
                            <CardTitle className={cn(theme.color)}>Dica Importante</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Mantenha seu celular conectado à internet para garantir que as mensagens sejam enviadas corretamente.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
