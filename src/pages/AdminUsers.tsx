import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, Plus, Search, Edit, Trash2, Eye, User, Mail, Calendar, Shield, Activity } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import React from "react";

interface User {
  id: number;
  name: string;
  email: string;
  plan: string;
  status: string;
  createdAt: string;
  phone?: string;
  telegram?: string;
  whatsapp?: string;
  notes?: string;
  devices?: number;
  credits?: number;
  renewalDate?: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([
    { 
      id: 1, 
      name: "João Silva", 
      email: "joao@email.com", 
      plan: "Cliente", 
      status: "Ativo", 
      createdAt: "2024-01-15",
      phone: "+55 11 99999-1111",
      telegram: "@joaosilva",
      whatsapp: "+55 11 99999-1111",
      notes: "Cliente preferencial, sempre pontual no pagamento",
      devices: 3,
      credits: 50,
      renewalDate: "2024-02-15"
    },
    { 
      id: 2, 
      name: "Maria Santos", 
      email: "maria@email.com", 
      plan: "Revendedor", 
      status: "Ativo", 
      createdAt: "2024-01-10",
      phone: "+55 11 88888-2222",
      telegram: "@mariasantos",
      whatsapp: "+55 11 88888-2222",
      notes: "Revendedora ativa, boa performance",
      devices: 5,
      credits: 150,
      renewalDate: "2024-02-10"
    },
    { 
      id: 3, 
      name: "Pedro Oliveira", 
      email: "pedro@email.com", 
      plan: "Cliente", 
      status: "Inativo", 
      createdAt: "2024-01-05",
      phone: "+55 11 77777-3333",
      telegram: "@pedrooliveira",
      whatsapp: "+55 11 77777-3333",
      notes: "Cliente inativo por falta de pagamento",
      devices: 1,
      credits: 0,
      renewalDate: "2024-01-05"
    },
    { 
      id: 4, 
      name: "Ana Costa", 
      email: "ana@email.com", 
      plan: "Cliente", 
      status: "Pendente", 
      createdAt: "2024-01-20",
      phone: "+55 11 66666-4444",
      telegram: "@anacosta",
      whatsapp: "+55 11 66666-4444",
      notes: "Aguardando confirmação de pagamento",
      devices: 2,
      credits: 25,
      renewalDate: "2024-02-20"
    },
    { 
      id: 5, 
      name: "Carlos Lima", 
      email: "carlos@email.com", 
      plan: "Revendedor", 
      status: "Ativo", 
      createdAt: "2024-01-12",
      phone: "+55 11 55555-5555",
      telegram: "@carloslima",
      whatsapp: "+55 11 55555-5555",
      notes: "Revendedor experiente, muitos clientes",
      devices: 8,
      credits: 300,
      renewalDate: "2024-02-12"
    },
  ]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    plan: "",
    status: "Ativo"
  });

  // Estados para os modais de ação
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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

  const handleEditUser = () => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      setEditingUser(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteUser = () => {
    if (deletingUser) {
      setUsers(users.filter(user => user.id !== deletingUser.id));
      setDeletingUser(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openViewModal = (user: User) => {
    setViewingUser(user);
    setIsViewDialogOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser({ ...user });
    setIsEditDialogOpen(true);
  };

  const openDeleteModal = (user: User) => {
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
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
    <div className="space-y-6 min-h-screen bg-[#09090b] p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gerenciamento de Usuários</h1>
          <p className="text-gray-400">Gerencie todos os usuários do sistema</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-[#7e22ce] hover:bg-[#6d1bb7] text-white">
              <Plus className="w-4 h-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1f2937] text-white max-w-2xl w-full p-0 rounded-xl shadow-xl border border-gray-700">
            <div className="p-6 max-h-[80vh] overflow-y-auto scrollbar-hide">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-green-500" />
                  <span className="text-lg font-semibold text-white">Adicionar Cliente</span>
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">Novo</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="bg-[#1f2937] text-white border border-gray-700 px-3 py-1 rounded text-sm">Importar</Button>
                  <Button variant="outline" className="bg-[#1f2937] text-white border border-gray-700 px-3 py-1 rounded text-sm">Modelo</Button>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-2">Preencha os dados do novo cliente para adicioná-lo à base de dados</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-400 text-xs font-medium">• Campos obrigatórios marcados com *</span>
                <span className="text-blue-400 text-xs font-medium">• Dados serão sincronizados automaticamente</span>
              </div>
              
              {/* Form fields for new user */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-gray-300">Nome *</Label>
                  <Input 
                    placeholder="Nome completo" 
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="bg-[#23272f] border border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Email *</Label>
                  <Input 
                    placeholder="email@exemplo.com" 
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="bg-[#23272f] border border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Plano *</Label>
                  <Select value={newUser.plan} onValueChange={(value) => setNewUser({...newUser, plan: value})}>
                    <SelectTrigger className="bg-[#23272f] border border-gray-700 text-white">
                      <SelectValue placeholder="Selecione o plano" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#23272f] border border-gray-700">
                      <SelectItem value="Cliente">Cliente</SelectItem>
                      <SelectItem value="Revendedor">Revendedor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Status</Label>
                  <Select value={newUser.status} onValueChange={(value) => setNewUser({...newUser, status: value})}>
                    <SelectTrigger className="bg-[#23272f] border border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#23272f] border border-gray-700">
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="bg-gray-700 text-white px-6 py-2 rounded font-semibold">Cancelar</Button>
                <Button onClick={handleAddUser} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-semibold">Adicionar Usuário</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#1f2937] border border-gray-700 text-white"
          />
        </div>
      </div>

      {/* Tabela de usuários */}
      <Card className="bg-[#1f2937] text-white">
        <CardHeader>
          <CardTitle className="text-lg text-white">Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-gray-400">
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.id} className="hover:bg-[#232a36] transition-colors">
                  <TableCell className="text-white font-medium">{user.name}</TableCell>
                  <TableCell className="text-gray-300">{user.email}</TableCell>
                  <TableCell className="text-gray-300">{user.plan}</TableCell>
                  <TableCell>
                    <Badge className={
                      user.status === 'Ativo' ? 'bg-green-700 text-green-200' :
                      user.status === 'Inativo' ? 'bg-red-700 text-red-200' :
                      user.status === 'Pendente' ? 'bg-yellow-700 text-yellow-200' :
                      'bg-gray-700 text-gray-300'
                    }>{user.status}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-400">{user.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                        onClick={() => openViewModal(user)}
                      > 
                        <Eye className="w-4 h-4" /> 
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white"
                        onClick={() => openEditModal(user)}
                      > 
                        <Edit className="w-4 h-4" /> 
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                        onClick={() => openDeleteModal(user)}
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

      {/* Modal de Visualização */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-[#1f2937] text-white max-w-2xl w-full p-0 rounded-xl shadow-xl border border-gray-700">
          <div className="p-6 max-h-[80vh] overflow-y-auto scrollbar-hide">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-white">Detalhes do Usuário</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Informações completas do usuário selecionado
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            {viewingUser && (
              <div className="space-y-6">
                {/* Informações Básicas */}
                <div className="bg-[#23272f] rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-400" />
                    Informações Básicas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-400 text-sm">Nome</Label>
                      <p className="text-white font-medium">{viewingUser.name}</p>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-sm">Email</Label>
                      <p className="text-white font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {viewingUser.email}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-sm">Plano</Label>
                      <Badge className="bg-purple-600 text-white">{viewingUser.plan}</Badge>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-sm">Status</Label>
                      <Badge className={
                        viewingUser.status === 'Ativo' ? 'bg-green-600 text-white' :
                        viewingUser.status === 'Inativo' ? 'bg-red-600 text-white' :
                        viewingUser.status === 'Pendente' ? 'bg-yellow-600 text-white' :
                        'bg-gray-600 text-white'
                      }>{viewingUser.status}</Badge>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-sm">Data de Criação</Label>
                      <p className="text-white font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {viewingUser.createdAt}
                      </p>
                    </div>
                    {viewingUser.renewalDate && (
                      <div>
                        <Label className="text-gray-400 text-sm">Data de Renovação</Label>
                        <p className="text-white font-medium">{viewingUser.renewalDate}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contatos */}
                {(viewingUser.phone || viewingUser.telegram || viewingUser.whatsapp) && (
                  <div className="bg-[#23272f] rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Contatos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {viewingUser.phone && (
                        <div>
                          <Label className="text-gray-400 text-sm">Telefone</Label>
                          <p className="text-white font-medium">{viewingUser.phone}</p>
                        </div>
                      )}
                      {viewingUser.telegram && (
                        <div>
                          <Label className="text-gray-400 text-sm">Telegram</Label>
                          <p className="text-white font-medium">{viewingUser.telegram}</p>
                        </div>
                      )}
                      {viewingUser.whatsapp && (
                        <div>
                          <Label className="text-gray-400 text-sm">WhatsApp</Label>
                          <p className="text-white font-medium">{viewingUser.whatsapp}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Configurações */}
                <div className="bg-[#23272f] rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    Configurações
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-400 text-sm">Dispositivos</Label>
                      <p className="text-white font-medium">{viewingUser.devices || 0}</p>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-sm">Créditos</Label>
                      <p className="text-white font-medium">€{viewingUser.credits || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Observações */}
                {viewingUser.notes && (
                  <div className="bg-[#23272f] rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Observações</h3>
                    <p className="text-gray-300">{viewingUser.notes}</p>
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="bg-gray-700 text-white">
                Fechar
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[#1f2937] text-white max-w-2xl w-full p-0 rounded-xl shadow-xl border border-gray-700">
          <div className="p-6 max-h-[80vh] overflow-y-auto scrollbar-hide">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">
                  <Edit className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-white">Editar Usuário</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Modifique as informações do usuário
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            {editingUser && (
              <div className="space-y-6">
                {/* Informações Básicas */}
                <div className="bg-[#23272f] rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Informações Básicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Nome</Label>
                      <Input 
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                        className="bg-[#1f2937] border border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Email</Label>
                      <Input 
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                        className="bg-[#1f2937] border border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Plano</Label>
                      <Select value={editingUser.plan} onValueChange={(value) => setEditingUser({...editingUser, plan: value})}>
                        <SelectTrigger className="bg-[#1f2937] border border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#23272f] border border-gray-700">
                          <SelectItem value="Cliente">Cliente</SelectItem>
                          <SelectItem value="Revendedor">Revendedor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Status</Label>
                      <Select value={editingUser.status} onValueChange={(value) => setEditingUser({...editingUser, status: value})}>
                        <SelectTrigger className="bg-[#1f2937] border border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#23272f] border border-gray-700">
                          <SelectItem value="Ativo">Ativo</SelectItem>
                          <SelectItem value="Inativo">Inativo</SelectItem>
                          <SelectItem value="Pendente">Pendente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Contatos */}
                <div className="bg-[#23272f] rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Contatos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Telefone</Label>
                      <Input 
                        value={editingUser.phone || ""}
                        onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                        placeholder="+55 11 99999-9999"
                        className="bg-[#1f2937] border border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Telegram</Label>
                      <Input 
                        value={editingUser.telegram || ""}
                        onChange={(e) => setEditingUser({...editingUser, telegram: e.target.value})}
                        placeholder="@usuario"
                        className="bg-[#1f2937] border border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">WhatsApp</Label>
                      <Input 
                        value={editingUser.whatsapp || ""}
                        onChange={(e) => setEditingUser({...editingUser, whatsapp: e.target.value})}
                        placeholder="+55 11 99999-9999"
                        className="bg-[#1f2937] border border-gray-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Configurações */}
                <div className="bg-[#23272f] rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Configurações</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Número de Dispositivos</Label>
                      <Input 
                        type="number"
                        value={editingUser.devices || 0}
                        onChange={(e) => setEditingUser({...editingUser, devices: parseInt(e.target.value) || 0})}
                        className="bg-[#1f2937] border border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Créditos (€)</Label>
                      <Input 
                        type="number"
                        value={editingUser.credits || 0}
                        onChange={(e) => setEditingUser({...editingUser, credits: parseInt(e.target.value) || 0})}
                        className="bg-[#1f2937] border border-gray-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Observações */}
                <div className="bg-[#23272f] rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Observações</h3>
                  <textarea 
                    value={editingUser.notes || ""}
                    onChange={(e) => setEditingUser({...editingUser, notes: e.target.value})}
                    placeholder="Adicione observações sobre o usuário..."
                    className="w-full bg-[#1f2937] border border-gray-700 text-white rounded p-3 min-h-[100px]"
                  />
                </div>
              </div>
            )}

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="bg-gray-700 text-white">
                Cancelar
              </Button>
              <Button onClick={handleEditUser} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                Salvar Alterações
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#1f2937] text-white border border-gray-700">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <AlertDialogTitle className="text-xl font-bold text-white">Confirmar Exclusão</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  Esta ação não pode ser desfeita. O usuário será permanentemente removido do sistema.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          
          {deletingUser && (
            <div className="bg-[#23272f] rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Usuário a ser excluído:</h3>
              <div className="space-y-2">
                <p className="text-white"><span className="text-gray-400">Nome:</span> {deletingUser.name}</p>
                <p className="text-white"><span className="text-gray-400">Email:</span> {deletingUser.email}</p>
                <p className="text-white"><span className="text-gray-400">Plano:</span> {deletingUser.plan}</p>
                <p className="text-white"><span className="text-gray-400">Status:</span> {deletingUser.status}</p>
              </div>
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white border border-gray-600 hover:bg-gray-600">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir Usuário
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function VencimentoDatePicker() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [time, setTime] = React.useState<string>("");

  function handleDateSelect(selected: Date | undefined) {
    setDate(selected);
    setOpen(false);
  }

  function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTime(e.target.value);
  }

  function formatDate(d?: Date) {
    if (!d) return "";
    return d.toLocaleDateString("pt-BR");
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex gap-2">
          <input
            readOnly
            value={date ? formatDate(date) : ""}
            placeholder="Selecione a data"
            className="w-1/2 bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2 cursor-pointer"
            onClick={() => setOpen(true)}
          />
          <input
            type="time"
            value={time}
            onChange={handleTimeChange}
            className="w-1/2 bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0 bg-[#1f2937] border border-gray-700">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md bg-[#1f2937] text-white"
        />
        <div className="flex justify-end p-2">
          <Button size="sm" onClick={() => setOpen(false)}>
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function RenovacaoDatePicker() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  function formatDate(d?: Date) {
    if (!d) return "";
    return d.toLocaleDateString("pt-BR");
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <input
          readOnly
          value={date ? formatDate(date) : ""}
          placeholder="dd/mm/aaaa"
          className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2 cursor-pointer"
          onClick={() => setOpen(true)}
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0 bg-[#1f2937] border border-gray-700">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md bg-[#1f2937] text-white"
        />
        <div className="flex justify-end p-2">
          <Button size="sm" onClick={() => setOpen(false)}>
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
} 