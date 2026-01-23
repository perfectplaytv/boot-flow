import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, QrCode, RefreshCw } from "lucide-react";

export default function ResellerWhatsApp() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <MessageCircle className="w-6 h-6 text-green-500" />
                    Conexão WhatsApp
                </h1>
                <p className="text-muted-foreground">
                    Conecte seu WhatsApp para enviar notificações automáticas aos seus clientes.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Status da Conexão</CardTitle>
                        <CardDescription>
                            Verifique se seu WhatsApp está conectado e pronto para uso.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                            <MessageCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-lg text-red-500">Desconectado</h3>
                            <p className="text-sm text-muted-foreground">Nenhuma sessão ativa encontrada</p>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                            <QrCode className="w-4 h-4 mr-2" />
                            Gerar QR Code
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Configurações de Envio</CardTitle>
                        <CardDescription>
                            Personalize como as mensagens serão enviadas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-lg text-sm">
                            <p className="font-medium mb-2">Limites do Plano Essencial:</p>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                <li>1 Conexão simultânea</li>
                                <li>5 Notificações diárias</li>
                                <li>Mensagens de texto apenas</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
