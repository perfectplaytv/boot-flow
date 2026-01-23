import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Check, Trash2, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Theme {
    color: string;
    lightColor: string;
    borderColor: string;
    gradient: string;
}

export default function ResellerNotificacoes() {
    const { theme } = useOutletContext<{ theme: Theme }>();

    // Mock data for notifications
    const notifications = [
        {
            id: 1,
            title: "Novo cliente cadastrado",
            description: "O cliente João Silva acabou de se cadastrar na sua loja.",
            time: "Há 5 minutos",
            type: "info",
            read: false,
            channel: "System"
        },
        {
            id: 2,
            title: "Pagamento confirmado",
            description: "Recebemos o pagamento de R$ 49,90 via PIX de Maria Santos.",
            time: "Há 2 horas",
            type: "success",
            read: false,
            channel: "Financeiro"
        },
        {
            id: 3,
            title: "Renovação pendente",
            description: "A assinatura de Carlos Oliveira vence em 3 dias.",
            time: "Há 1 dia",
            type: "warning",
            read: true,
            channel: "Sistema"
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className={cn("text-2xl font-bold flex items-center gap-2", theme.color)}>
                        <Bell className="w-6 h-6" />
                        Notificações
                    </h1>
                    <p className="text-muted-foreground">
                        Central de avisos e alertas do sistema
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Check className="w-4 h-4 mr-2" />
                        Marcar todas como lidas
                    </Button>
                </div>
            </div>

            <div className="grid gap-4">
                {notifications.map((notification) => (
                    <Card key={notification.id} className={cn("transition-all hover:bg-muted/50", !notification.read && "border-l-4", !notification.read && theme.borderColor.replace('border-', 'border-l-'))}>
                        <CardContent className="p-4 flex items-start gap-4">
                            <div className={cn("p-2 rounded-full", theme.lightColor)}>
                                <Bell className={cn("w-4 h-4", theme.color)} />
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium leading-none">{notification.title}</p>
                                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {notification.description}
                                </p>
                                <div className="flex items-center gap-2 pt-2">
                                    <Badge variant="secondary" className="text-xs font-normal">
                                        {notification.channel}
                                    </Badge>
                                </div>
                            </div>
                            {!notification.read && (
                                <div className={cn("w-2 h-2 rounded-full", theme.color.replace('text-', 'bg-'))} />
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {notifications.length === 0 && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="p-4 rounded-full bg-muted mb-4">
                            <Bell className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">
                            Nenhuma notificação encontrada no momento.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
