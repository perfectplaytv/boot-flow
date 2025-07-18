import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Plus, Search, Edit, Trash2, Eye } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  plan: string;
  status: string;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "João Silva", email: "joao@email.com", plan: "Cliente", status: "Ativo", createdAt: "2024-01-15" },
    { id: 2, name: "Maria Santos", email: "maria@email.com", plan: "Revendedor", status: "Ativo", createdAt: "2024-01-10" },
    { id: 3, name: "Pedro Oliveira", email: "pedro@email.com", plan: "Cliente", status: "Inativo", createdAt: "2024-01-05" },
    { id: 4, name: "Ana Costa", email: "ana@email.com", plan: "Cliente", status: "Pendente", createdAt: "2024-01-20" },
    { id: 5, name: "Carlos Lima", email: "carlos@email.com", plan: "Revendedor", status: "Ativo", createdAt: "2024-01-12" },
  ]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    plan: "",
    status: "Ativo"
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.plan) {
      const user: User = {
        id: users.length + 1,
        name: newUser.name,
        email: newUser.email,
        plan: newUser.plan,
        status: newUser.status,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, user]);
      setNewUser({ name: "", email: "", plan: "", status: "Ativo" });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo": return "bg-green-100 text-green-800";
      case "Inativo": return "bg-red-100 text-red-800";
      case "Pendente": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">Gerencie todos os usuários do sistema</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white text-gray-900 max-w-2xl p-0 rounded-xl shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-green-500" />
                  <span className="text-lg font-semibold text-gray-900">Adicionar Cliente</span>
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Novo</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 rounded text-sm">Importar</Button>
                  <Button variant="outline" className="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 rounded text-sm">Modelo</Button>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-2">Preencha os dados do novo cliente para adicioná-lo à base de dados</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-600 text-xs font-medium">• Campos obrigatórios marcados com *</span>
                <span className="text-blue-600 text-xs font-medium">• Dados serão sincronizados automaticamente</span>
              </div>
              {/* Extração M3U */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-blue-700 font-medium">Extração M3U</span>
                  <Button className="bg-blue-200 text-blue-800 hover:bg-blue-300 px-4 py-1 rounded text-sm">Extrair</Button>
                </div>
                <p className="text-xs text-blue-700 mb-2">Serve para importar dados automaticamente a partir de uma URL.</p>
                <Input placeholder="Insira a URL do M3U para extrair automaticamente os dados do cliente..." className="bg-white border border-blue-200 text-gray-900" />
              </div>
              {/* Informações Básicas */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <span className="block text-gray-800 font-semibold mb-2">Informações Básicas</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">Nome completo *</label>
                    <Input placeholder="Nome completo" className="bg-white border border-gray-200 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">Senha *</label>
                    <Input type="password" placeholder="Senha" className="bg-white border border-gray-200 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">E-mail *</label>
                    <Input placeholder="email@exemplo.com" className="bg-white border border-gray-200 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">Telefone *</label>
                    <Input placeholder="(11) 99999-9999" className="bg-white border border-gray-200 text-gray-900" />
                  </div>
                </div>
              </div>
              {/* Configuração de Serviço */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <span className="block text-purple-700 font-semibold mb-2">Configuração de Serviço</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">Classe de Serviço</label>
                    <Select>
                      <SelectTrigger className="bg-white border border-gray-200 text-gray-900">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Básico">Básico</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">Plano</label>
                    <Select>
                      <SelectTrigger className="bg-white border border-gray-200 text-gray-900">
                        <SelectValue placeholder="Mensal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mensal">Mensal</SelectItem>
                        <SelectItem value="Anual">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">Status</label>
                    <Select>
                      <SelectTrigger className="bg-white border border-gray-200 text-gray-900">
                        <SelectValue placeholder="Ativo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ativo">Ativo</SelectItem>
                        <SelectItem value="Inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">Data de Renovação</label>
                    <Input type="date" className="bg-white border border-gray-200 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">Número de Dispositivos</label>
                    <Input type="number" min={1} className="bg-white border border-gray-200 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">Créditos</label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" className="bg-gray-200 text-gray-700 px-2 py-1">-</Button>
                      <Input type="number" min={0} className="w-16 bg-white border border-gray-200 text-gray-900" />
                      <Button variant="outline" className="bg-gray-200 text-gray-700 px-2 py-1">+</Button>
                      <span className="text-xs text-gray-500">valor entre 0 e 500€</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Informações Adicionais */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <span className="block text-gray-800 font-semibold mb-2">Informações Adicionais</span>
                <div className="flex items-center gap-2 mb-2">
                  <input type="checkbox" className="accent-green-500" />
                  <span className="text-gray-700 text-sm">Notificações via WhatsApp</span>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Anotações</label>
                  <textarea className="w-full bg-white border border-gray-200 text-gray-900 rounded p-2 min-h-[60px]" placeholder="Anotações..."></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="bg-gray-100 text-gray-700 px-6 py-2 rounded font-semibold">Fechar</Button>
                <Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded font-semibold">Adicionar Cliente</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Usuários</CardTitle>
              <CardDescription>
                {filteredUsers.length} usuários encontrados
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar usuários..."
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
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.plan}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.createdAt}</TableCell>
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
                        onClick={() => handleDeleteUser(user.id)}
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