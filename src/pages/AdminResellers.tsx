import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Plus, Search, Edit, Trash2, Eye, TrendingUp, DollarSign, Activity } from "lucide-react";

interface Reseller {
  id: number;
  name: string;
  email: string;
  phone: string;
  commission: number;
  status: string;
  clients: number;
  revenue: number;
  joinedDate: string;
  plan: string;
}

export default function AdminResellers() {
  const [resellers, setResellers] = useState<Reseller[]>([
    { id: 1, name: "Maria Santos", email: "maria@email.com", phone: "(11) 99999-9999", commission: 15, status: "Ativo", clients: 45, revenue: 12500, joinedDate: "2024-01-15", plan: "Premium" },
    { id: 2, name: "Carlos Lima", email: "carlos@email.com", phone: "(11) 88888-8888", commission: 12, status: "Ativo", clients: 32, revenue: 8900, joinedDate: "2024-01-10", plan: "Standard" },
    { id: 3, name: "Ana Costa", email: "ana@email.com", phone: "(11) 77777-7777", commission: 18, status: "Pendente", clients: 0, revenue: 0, joinedDate: "2024-01-20", plan: "Premium" },
    { id: 4, name: "Pedro Oliveira", email: "pedro@email.com", phone: "(11) 66666-6666", commission: 10, status: "Inativo", clients: 15, revenue: 3200, joinedDate: "2024-01-05", plan: "Basic" },
    { id: 5, name: "João Silva", email: "joao@email.com", phone: "(11) 55555-5555", commission: 20, status: "Ativo", clients: 67, revenue: 18900, joinedDate: "2024-01-12", plan: "Premium" },
  ]);

  const [newReseller, setNewReseller] = useState({
    name: "",
    email: "",
    phone: "",
    commission: "",
    plan: "",
    status: "Ativo"
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResellers = resellers.filter(reseller =>
    reseller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reseller.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddReseller = () => {
    if (newReseller.name && newReseller.email && newReseller.commission) {
      const reseller: Reseller = {
        id: resellers.length + 1,
        name: newReseller.name,
        email: newReseller.email,
        phone: newReseller.phone,
        commission: parseFloat(newReseller.commission),
        status: newReseller.status,
        clients: 0,
        revenue: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        plan: newReseller.plan
      };
      setResellers([...resellers, reseller]);
      setNewReseller({ name: "", email: "", phone: "", commission: "", plan: "", status: "Ativo" });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteReseller = (id: number) => {
    setResellers(resellers.filter(reseller => reseller.id !== id));
  };

  const toggleResellerStatus = (id: number) => {
    setResellers(resellers.map(reseller => 
      reseller.id === id 
        ? { ...reseller, status: reseller.status === "Ativo" ? "Inativo" : "Ativo" }
        : reseller
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo": return "bg-green-100 text-green-800";
      case "Inativo": return "bg-red-100 text-red-800";
      case "Pendente": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const totalRevenue = resellers.reduce((sum, reseller) => sum + reseller.revenue, 0);
  const activeResellers = resellers.filter(reseller => reseller.status === "Ativo").length;
  const totalClients = resellers.reduce((sum, reseller) => sum + reseller.clients, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Revendas</h1>
          <p className="text-muted-foreground">Gerencie todos os revendedores do sistema</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Novo Revendedor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Revendedor</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo revendedor
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={newReseller.name}
                    onChange={(e) => setNewReseller({...newReseller, name: e.target.value})}
                    placeholder="Nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newReseller.email}
                    onChange={(e) => setNewReseller({...newReseller, email: e.target.value})}
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={newReseller.phone}
                    onChange={(e) => setNewReseller({...newReseller, phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commission">Comissão (%)</Label>
                  <Input
                    id="commission"
                    type="number"
                    value={newReseller.commission}
                    onChange={(e) => setNewReseller({...newReseller, commission: e.target.value})}
                    placeholder="15"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plan">Plano</Label>
                  <Select value={newReseller.plan} onValueChange={(value) => setNewReseller({...newReseller, plan: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o plano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={newReseller.status} onValueChange={(value) => setNewReseller({...newReseller, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddReseller}>
                Adicionar Revendedor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Revendedores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resellers.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeResellers} ativos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Gerada pelos revendedores
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Atendidos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">
              Total de clientes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Média</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(resellers.reduce((sum, r) => sum + r.commission, 0) / resellers.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Comissão média
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Revendedores</CardTitle>
              <CardDescription>
                {filteredResellers.length} revendedores encontrados
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar revendedores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Revendedor</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Comissão</TableHead>
                <TableHead>Clientes</TableHead>
                <TableHead>Receita</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResellers.map((reseller) => (
                <TableRow key={reseller.id}>
                  <TableCell className="font-medium">{reseller.name}</TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{reseller.email}</div>
                      <div className="text-xs text-muted-foreground">{reseller.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{reseller.plan}</Badge>
                  </TableCell>
                  <TableCell>{reseller.commission}%</TableCell>
                  <TableCell>{reseller.clients}</TableCell>
                  <TableCell>R$ {reseller.revenue.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(reseller.status)}>
                      {reseller.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleResellerStatus(reseller.id)}
                      >
                        {reseller.status === "Ativo" ? "Desativar" : "Ativar"}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteReseller(reseller.id)}
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