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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import React from "react";

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
              {/* Extração M3U */}
              <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-blue-300 font-medium">Extração M3U</span>
                  <Button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-1 rounded text-sm">Extrair</Button>
                </div>
                <p className="text-xs text-blue-300 mb-2">Serve para importar dados automaticamente a partir de uma URL.</p>
                <Input placeholder="Insira a URL do M3U para extrair automaticamente os dados do cliente..." className="bg-[#1f2937] border border-blue-800 text-white" />
              </div>
              {/* Informações Básicas */}
              <div className="bg-[#1f2937] border border-gray-700 rounded-lg p-4 mb-4">
                <span className="block text-white font-semibold mb-2">Informações Básicas</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Servidor */}
                  <div className="col-span-1">
                    <label className="block text-gray-300 mb-1 font-medium">Servidor *</label>
                    <select disabled className="w-full bg-[#23272f] border border-gray-700 text-gray-400 rounded px-3 py-2">
                      <option>IPTV 2</option>
                    </select>
                    <div className="bg-yellow-900/40 border border-yellow-700 text-yellow-400 text-xs rounded mt-2 p-2">
                      O servidor não pode ser alterado aqui. Para mudar o servidor, você precisa migrar para outro servidor usando o ícone Migrar Servidor.
                    </div>
                  </div>
                  {/* Plano */}
                  <div className="col-span-1">
                    <label className="block text-gray-300 mb-1 font-medium">Plano *</label>
                    <select disabled className="w-full bg-[#23272f] border border-gray-700 text-gray-400 rounded px-3 py-2">
                      <option>🟧 TESTE - COMPLETO</option>
                    </select>
                    <div className="bg-yellow-900/40 border border-yellow-700 text-yellow-400 text-xs rounded mt-2 p-2">
                      O plano não pode ser alterado aqui. Para alterar o plano, selecione Ações na lista de clientes e escolha Alterar Plano.
                    </div>
                  </div>
                  {/* Usuário */}
                  <div className="col-span-1">
                    <label className="block text-gray-300 mb-1 font-medium">Usuário *</label>
                    <div className="relative flex items-center">
                      <input placeholder="Usuário" className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2 pr-8" />
                      <span className="absolute right-2 text-gray-500 cursor-pointer"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><polyline points="7 9 12 4 17 9"/><line x1="12" x2="12" y1="4" y2="16"/></svg></span>
                    </div>
                  </div>
                  {/* Senha */}
                  <div className="col-span-1">
                    <label className="block text-gray-300 mb-1 font-medium">Senha</label>
                    <div className="relative flex items-center">
                      <input type="password" placeholder="Senha" className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2 pr-8" />
                      <span className="absolute right-2 text-gray-500 cursor-pointer"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><polyline points="7 9 12 4 17 9"/><line x1="12" x2="12" y1="4" y2="16"/></svg></span>
                    </div>
                    <div className="bg-blue-900/40 border border-blue-700 text-blue-300 text-xs rounded mt-2 p-2 space-y-1">
                      <div>A senha só pode ter letras, números, traços e underline.</div>
                      <div>A senha deve conter apenas letras e números e ter no mínimo 9 caracteres.</div>
                      <div>A senha precisa ter no mínimo 8 caracteres.</div>
                    </div>
                  </div>
                  {/* Vencimento */}
                  <div className="col-span-2">
                    <label className="block text-gray-300 mb-1 font-medium">Vencimento (Opcional)</label>
                    <VencimentoDatePicker />
                  </div>
                  {/* Bouquets */}
                  <div className="col-span-2">
                    <label className="block text-gray-300 mb-1 font-medium">Bouquets</label>
                    <select className="w-full bg-[#23272f] border border-gray-700 text-gray-400 rounded px-3 py-2">
                      <option value="">Selecione um bouquet</option>
                      <option value="completo-sem-adultos">COMPLETO SEM ADULTOS</option>
                      <option value="completo-com-adultos">COMPLETO COM ADULTOS</option>
                      <option value="canais-mais-18">CANAIS +18</option>
                      <option value="vods">Vods</option>
                      <option value="canais-menos-18">CANAIS -18</option>
                      <option value="restream">Restream</option>
                      <option value="24hrs">24hrs</option>
                      <option value="ppv">PPV</option>
                    </select>
                    <div className="bg-green-900/40 border border-green-700 text-green-400 text-xs rounded mt-2 p-2">
                      Apenas você pode visualizar os dados pessoais deste cliente.
                    </div>
                  </div>
                  {/* Nome */}
                  <div className="col-span-1">
                    <label className="block text-gray-300 mb-1 font-medium">Nome</label>
                    <input placeholder="Opcional" className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2" />
                  </div>
                  {/* E-mail */}
                  <div className="col-span-1">
                    <label className="block text-gray-300 mb-1 font-medium">E-mail</label>
                    <input placeholder="Opcional" className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2" />
                  </div>
                  {/* Telegram */}
                  <div className="col-span-1">
                    <label className="block text-gray-300 mb-1 font-medium">Telegram</label>
                    <input placeholder="Opcional" className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2" />
                  </div>
                  {/* WhatsApp */}
                  <div className="col-span-1">
                    <label className="block text-gray-300 mb-1 font-medium">WhatsApp</label>
                    <input placeholder="Opcional" className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2" />
                    <span className="text-xs text-gray-400 mt-1 block">Incluindo o código do país - com ou sem espaço e traços - ex. 55 11 99999 3333</span>
                  </div>
                  {/* Observações */}
                  <div className="col-span-2">
                    <label className="block text-gray-300 mb-1 font-medium">Observações</label>
                    <textarea placeholder="Opcional" className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2 min-h-[60px]" />
                  </div>
                </div>
              </div>
              {/* Configuração de Serviço */}
              <div className="bg-[#1f2937] border border-gray-700 rounded-lg p-4 mb-4">
                <span className="block text-purple-400 font-semibold mb-2">Configuração de Serviço</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                  {/* Classe de Serviço */}
                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">Classe de Serviço</label>
                    <select className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2">
                      <option value="">Selecione</option>
                      <option value="basico">Básico</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                  {/* Plano */}
                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">Plano</label>
                    <select className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2">
                      <option value="mensal">Mensal</option>
                      <option value="anual">Anual</option>
                    </select>
                  </div>
                  {/* Status */}
                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">Status</label>
                    <select className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2">
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                  {/* Data de Renovação */}
                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">Data de Renovação</label>
                    <RenovacaoDatePicker />
                  </div>
                  {/* Número de Dispositivos */}
                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">Número de Dispositivos</label>
                    <input type="number" min={1} className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2" />
                  </div>
                  {/* Créditos */}
                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">Créditos</label>
                    <div className="flex items-center gap-2">
                      <button type="button" className="bg-[#23272f] text-white px-2 py-1 rounded border border-gray-700">-</button>
                      <input type="number" min={0} className="w-16 bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2" />
                      <button type="button" className="bg-[#23272f] text-white px-2 py-1 rounded border border-gray-700">+</button>
                      <span className="text-xs text-gray-400 ml-2">valor<br/>entre 0<br/>e 500€</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Informações Adicionais */}
              <div className="bg-[#1f2937] border border-gray-700 rounded-lg p-4 mb-4">
                <span className="block text-white font-semibold mb-2">Informações Adicionais</span>
                <div className="flex items-center gap-2 mb-2">
                  <input type="checkbox" className="accent-green-500" />
                  <span className="text-gray-300 text-sm">Notificações via WhatsApp</span>
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 font-medium">Anotações</label>
                  <textarea className="w-full bg-[#1f2937] border border-gray-700 text-white rounded p-2 min-h-[60px]" placeholder="Anotações..."></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="bg-gray-700 text-white px-6 py-2 rounded font-semibold">Fechar</Button>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-semibold">Adicionar Cliente</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
                      <Button size="sm" variant="outline" className="border-blue-600 text-blue-400"> <Eye className="w-4 h-4 mr-1" /> </Button>
                      <Button size="sm" variant="outline" className="border-yellow-600 text-yellow-400"> <Edit className="w-4 h-4 mr-1" /> </Button>
                      <Button size="sm" variant="outline" className="border-red-600 text-red-400" onClick={() => handleDeleteUser(user.id)}> <Trash2 className="w-4 h-4 mr-1" /> </Button>
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
        <Calendar
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
        <Calendar
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