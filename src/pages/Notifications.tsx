import { useState } from "react";
import { ArrowLeft, Bell, Check, Trash2, Filter, Search, BellRing, MessageSquare, Users, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

const Notifications = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "system",
      title: "Sistema atualizado",
      message: "Nova versão 2.1.0 disponível com melhorias na IA",
      time: "há 2 horas",
      read: false,
      icon: BellRing
    },
    {
      id: 2,
      type: "payment",
      title: "Pagamento processado",
      message: "Cobrança de R$ 99,90 processada com sucesso",
      time: "há 5 horas",
      read: false,
      icon: CreditCard
    },
    {
      id: 3,
      type: "user",
      title: "Novo revendedor cadastrado",
      message: "Maria Santos se cadastrou como revendedora",
      time: "há 1 dia",
      read: true,
      icon: Users
    },
    {
      id: 4,
      type: "message",
      title: "Nova mensagem de suporte",
      message: "Você tem uma resposta do suporte técnico",
      time: "há 2 dias",
      read: true,
      icon: MessageSquare
    },
    {
      id: 5,
      type: "system",
      title: "Backup concluído",
      message: "Backup automático dos dados foi realizado com sucesso",
      time: "há 3 dias",
      read: true,
      icon: BellRing
    }
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    system: true,
    payments: true,
    users: true,
    messages: true,
    marketing: false,
    emails: true,
    push: true,
    sms: false
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast({
      title: "Notificações marcadas como lidas",
      description: "Todas as notificações foram marcadas como lidas.",
    });
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({
      title: "Notificação removida",
      description: "A notificação foi removida com sucesso.",
    });
  };

  const filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "system": return "bg-info text-info-foreground";
      case "payment": return "bg-success text-success-foreground";
      case "user": return "bg-primary text-primary-foreground";
      case "message": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">Notificações</h1>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="rounded-full">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">Gerencie suas notificações e alertas</p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" className="gap-2">
              <Check className="h-4 w-4" />
              Marcar todas como lidas
            </Button>
          )}
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar notificações..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filtrar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications List */}
            <Card>
              <CardHeader>
                <CardTitle>Todas as Notificações</CardTitle>
                <CardDescription>
                  Suas notificações mais recentes
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {filteredNotifications.map((notification, index) => {
                    const IconComponent = notification.icon;
                    return (
                      <div key={notification.id}>
                        <div 
                          className={`p-4 flex items-start gap-4 hover:bg-muted/50 transition-colors ${
                            !notification.read ? 'bg-muted/30' : ''
                          }`}
                        >
                          <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between">
                              <h4 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                                {notification.title}
                              </h4>
                              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                {notification.time}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                          </div>

                          <div className="flex gap-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => markAsRead(notification.id)}
                                className="h-8 w-8"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {index < filteredNotifications.length - 1 && <Separator />}
                      </div>
                    );
                  })}
                </div>
                
                {filteredNotifications.length === 0 && (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">Nenhuma notificação encontrada</h3>
                    <p className="text-sm text-muted-foreground">
                      {searchTerm ? 'Tente ajustar sua busca' : 'Você está em dia com suas notificações!'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Notificação</CardTitle>
                <CardDescription>
                  Escolha que tipos de notificações você quer receber
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Tipos de Notificação</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">Sistema</h5>
                        <p className="text-sm text-muted-foreground">
                          Atualizações, manutenção e avisos do sistema
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.system}
                        onCheckedChange={(checked) =>
                          setNotificationSettings(prev => ({ ...prev, system: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">Pagamentos</h5>
                        <p className="text-sm text-muted-foreground">
                          Cobranças, pagamentos e faturas
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.payments}
                        onCheckedChange={(checked) =>
                          setNotificationSettings(prev => ({ ...prev, payments: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">Usuários</h5>
                        <p className="text-sm text-muted-foreground">
                          Novos cadastros e atividades de usuários
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.users}
                        onCheckedChange={(checked) =>
                          setNotificationSettings(prev => ({ ...prev, users: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">Mensagens</h5>
                        <p className="text-sm text-muted-foreground">
                          Suporte, chat e mensagens diretas
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.messages}
                        onCheckedChange={(checked) =>
                          setNotificationSettings(prev => ({ ...prev, messages: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">Marketing</h5>
                        <p className="text-sm text-muted-foreground">
                          Ofertas, promoções e novidades
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.marketing}
                        onCheckedChange={(checked) =>
                          setNotificationSettings(prev => ({ ...prev, marketing: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Canais de Entrega</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">Email</h5>
                        <p className="text-sm text-muted-foreground">
                          Receber notificações por email
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.emails}
                        onCheckedChange={(checked) =>
                          setNotificationSettings(prev => ({ ...prev, emails: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">Push</h5>
                        <p className="text-sm text-muted-foreground">
                          Notificações no navegador
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.push}
                        onCheckedChange={(checked) =>
                          setNotificationSettings(prev => ({ ...prev, push: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">SMS</h5>
                        <p className="text-sm text-muted-foreground">
                          Notificações por mensagem de texto
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.sms}
                        onCheckedChange={(checked) =>
                          setNotificationSettings(prev => ({ ...prev, sms: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Notifications;