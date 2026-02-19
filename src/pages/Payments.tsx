import { useState } from "react";
import { ArrowLeft, CreditCard, Calendar, Download, Eye, Plus, CheckCircle, XCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const Payments = () => {
  const navigate = useNavigate();
  const [isAddingCard, setIsAddingCard] = useState(false);
  
  const paymentHistory = [
    { id: 1, date: "2024-01-15", amount: "R$ 99,90", plan: "Plano Profissional", status: "paid", method: "Cartão ****1234" },
    { id: 2, date: "2023-12-15", amount: "R$ 99,90", plan: "Plano Profissional", status: "paid", method: "Cartão ****1234" },
    { id: 3, date: "2023-11-15", amount: "R$ 99,90", plan: "Plano Profissional", status: "paid", method: "Cartão ****1234" },
    { id: 4, date: "2023-10-15", amount: "R$ 49,90", plan: "Plano Básico", status: "failed", method: "Cartão ****5678" },
  ];

  const cards = [
    { id: 1, last4: "1234", brand: "Visa", expiry: "12/26", isDefault: true },
    { id: 2, last4: "5678", brand: "Mastercard", expiry: "08/25", isDefault: false },
  ];

  const currentPlan = {
    name: "Plano Profissional",
    price: "R$ 99,90",
    billing: "mensal",
    nextBilling: "15/02/2024",
    features: [
      "IA Ilimitada",
      "IPTV para Revendedores",
      "Sistema Multicanal",
      "E-commerce Integrado",
      "Suporte Prioritário"
    ]
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge variant="secondary" className="text-success">Pago</Badge>;
      case "failed":
        return <Badge variant="destructive">Falhou</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-warning">Pendente</Badge>;
      default:
        return null;
    }
  };

  const handleAddCard = () => {
    setIsAddingCard(false);
    toast({
      title: "Cartão adicionado",
      description: "Seu método de pagamento foi adicionado com sucesso!",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Pagamentos</h1>
            <p className="text-muted-foreground">Gerencie seus planos e métodos de pagamento</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="methods">Métodos de Pagamento</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Plano Atual
                </CardTitle>
                <CardDescription>
                  Informações sobre sua assinatura ativa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                      <p className="text-muted-foreground">
                        {currentPlan.price}/{currentPlan.billing}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      Próxima cobrança: {currentPlan.nextBilling}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">Alterar Plano</Button>
                      <Button variant="destructive">Cancelar Assinatura</Button>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Recursos Inclusos:</h4>
                    <ul className="space-y-2">
                      {currentPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-success" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">IA Utilizada</p>
                      <p className="text-2xl font-bold">2.847</p>
                      <p className="text-xs text-muted-foreground">de ilimitado</p>
                    </div>
                    <div className="text-primary text-right">
                      <span className="text-sm">∞</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Revendedores</p>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-xs text-muted-foreground">de 50</p>
                    </div>
                    <div className="text-primary text-right">
                      <span className="text-sm">24%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Armazenamento</p>
                      <p className="text-2xl font-bold">8.2GB</p>
                      <p className="text-xs text-muted-foreground">de 100GB</p>
                    </div>
                    <div className="text-primary text-right">
                      <span className="text-sm">8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Pagamentos</CardTitle>
                <CardDescription>
                  Visualize todas as suas transações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>{payment.plan}</TableCell>
                        <TableCell className="font-medium">{payment.amount}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="methods">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Métodos de Pagamento</CardTitle>
                      <CardDescription>
                        Gerencie seus cartões e formas de pagamento
                      </CardDescription>
                    </div>
                    <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
                      <DialogTrigger asChild>
                        <Button className="gap-2">
                          <Plus className="h-4 w-4" />
                          Adicionar Cartão
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Adicionar Novo Cartão</DialogTitle>
                          <DialogDescription>
                            Adicione um novo método de pagamento à sua conta
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Número do Cartão</Label>
                            <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiry">Validade</Label>
                              <Input id="expiry" placeholder="MM/AA" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv">CVV</Label>
                              <Input id="cvv" placeholder="123" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cardName">Nome no Cartão</Label>
                            <Input id="cardName" placeholder="João Silva" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddingCard(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleAddCard}>Adicionar Cartão</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cards.map((card) => (
                      <div key={card.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-8 bg-gradient-primary rounded flex items-center justify-center">
                            <CreditCard className="h-4 w-4 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{card.brand} ****{card.last4}</p>
                            <p className="text-sm text-muted-foreground">Expira em {card.expiry}</p>
                          </div>
                          {card.isDefault && (
                            <Badge variant="secondary">Padrão</Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {!card.isDefault && (
                            <Button variant="outline" size="sm">
                              Definir como Padrão
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            Remover
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Payments;