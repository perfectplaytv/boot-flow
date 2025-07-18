import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Server, Plus, Settings, Pause, Edit, Trash2, Zap } from "lucide-react";

interface Gateway {
  id: number;
  name: string;
  type: string;
  url: string;
  status: string;
  active: boolean;
}

export default function AdminGateways() {
  const [gateways, setGateways] = useState<Gateway[]>([
    { id: 1, name: "PagSeguro", type: "Pagamento", url: "https://pagseguro.com", status: "Ativo", active: true },
    { id: 2, name: "Twilio SMS", type: "SMS", url: "https://twilio.com", status: "Ativo", active: true },
    { id: 3, name: "SendGrid", type: "E-mail", url: "https://sendgrid.com", status: "Inativo", active: false },
    { id: 4, name: "Stripe", type: "Pagamento", url: "https://stripe.com", status: "Ativo", active: true },
  ]);

  const [gatewayConfig, setGatewayConfig] = useState({
    defaultPayment: "PagSeguro",
    defaultSMS: "Twilio SMS",
    defaultEmail: "SendGrid",
    enableLogs: true,
    enableSandbox: false
  });

  const [newGateway, setNewGateway] = useState({
    name: "",
    type: "Pagamento",
    url: "",
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);

  const handleAddGateway = () => {
    if (newGateway.name && newGateway.url) {
      const gateway: Gateway = {
        id: gateways.length + 1,
        name: newGateway.name,
        type: newGateway.type,
        url: newGateway.url,
        status: "Ativo",
        active: true
      };
      setGateways([...gateways, gateway]);
      setNewGateway({ name: "", type: "Pagamento", url: "" });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteGateway = (id: number) => {
    setGateways(gateways.filter(gateway => gateway.id !== id));
  };

  const toggleGatewayStatus = (id: number) => {
    setGateways(gateways.map(gateway =>
      gateway.id === id
        ? { ...gateway, status: gateway.status === "Ativo" ? "Inativo" : "Ativo", active: !gateway.active }
        : gateway
    ));
  };

  const getStatusColor = (status: string) => {
    return status === "Ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const totalActive = gateways.filter(g => g.active).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gateways</h1>
          <p className="text-muted-foreground">Gerencie integrações de pagamento, SMS, e-mail e outros serviços</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configurações
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Configurações Gerais de Gateways</DialogTitle>
                <DialogDescription>
                  Configure opções padrão e segurança dos gateways
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultPayment">Gateway de Pagamento Padrão</Label>
                    <Input
                      id="defaultPayment"
                      value={gatewayConfig.defaultPayment}
                      onChange={(e) => setGatewayConfig({...gatewayConfig, defaultPayment: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultSMS">Gateway de SMS Padrão</Label>
                    <Input
                      id="defaultSMS"
                      value={gatewayConfig.defaultSMS}
                      onChange={(e) => setGatewayConfig({...gatewayConfig, defaultSMS: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultEmail">Gateway de E-mail Padrão</Label>
                    <Input
                      id="defaultEmail"
                      value={gatewayConfig.defaultEmail}
                      onChange={(e) => setGatewayConfig({...gatewayConfig, defaultEmail: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="enableLogs">Habilitar Logs</Label>
                    <Switch
                      id="enableLogs"
                      checked={gatewayConfig.enableLogs}
                      onCheckedChange={(checked) => setGatewayConfig({...gatewayConfig, enableLogs: checked})}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Label htmlFor="enableSandbox">Modo Sandbox (teste)</Label>
                  <Switch
                    id="enableSandbox"
                    checked={gatewayConfig.enableSandbox}
                    onCheckedChange={(checked) => setGatewayConfig({...gatewayConfig, enableSandbox: checked})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsConfigDialogOpen(false)}>
                  Salvar Configurações
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Novo Gateway
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Gateway</DialogTitle>
                <DialogDescription>
                  Adicione uma nova integração de gateway ao sistema
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="gatewayName">Nome do Gateway</Label>
                  <Input
                    id="gatewayName"
                    value={newGateway.name}
                    onChange={(e) => setNewGateway({...newGateway, name: e.target.value})}
                    placeholder="Ex: PagSeguro, Twilio, SendGrid"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gatewayType">Tipo</Label>
                  <Input
                    id="gatewayType"
                    value={newGateway.type}
                    onChange={(e) => setNewGateway({...newGateway, type: e.target.value})}
                    placeholder="Pagamento, SMS, E-mail, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gatewayUrl">URL</Label>
                  <Input
                    id="gatewayUrl"
                    value={newGateway.url}
                    onChange={(e) => setNewGateway({...newGateway, url: e.target.value})}
                    placeholder="https://exemplo.com"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddGateway}>
                  Adicionar Gateway
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Gateways</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gateways.length}</div>
            <p className="text-xs text-muted-foreground">
              {totalActive} ativos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gateways Ativos</CardTitle>
            <Zap className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActive}</div>
            <p className="text-xs text-muted-foreground">
              {((totalActive / gateways.length) * 100).toFixed(0)}% ativos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status do Sistema</CardTitle>
            <Badge className="bg-green-100 text-green-800">Online</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ativo</div>
            <p className="text-xs text-muted-foreground">
              Integrações funcionando normalmente
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modo Sandbox</CardTitle>
            <Badge className={gatewayConfig.enableSandbox ? "bg-yellow-100 text-yellow-800" : "bg-gray-200 text-gray-700"}>
              {gatewayConfig.enableSandbox ? "Ativo" : "Inativo"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gatewayConfig.enableSandbox ? "Ativo" : "Inativo"}
            </div>
            <p className="text-xs text-muted-foreground">
              Testes e simulações habilitados
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Gateways</CardTitle>
          <CardDescription>
            Gerencie todas as integrações de gateways do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gateways.map((gateway) => (
                <TableRow key={gateway.id}>
                  <TableCell className="font-medium">{gateway.name}</TableCell>
                  <TableCell>{gateway.type}</TableCell>
                  <TableCell className="max-w-xs truncate">{gateway.url}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(gateway.status)}>
                      {gateway.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleGatewayStatus(gateway.id)}
                      >
                        {gateway.status === "Ativo" ? <Pause className="w-4 h-4" /> : <Zap className="w-4 h-4 text-green-500" />}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteGateway(gateway.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 