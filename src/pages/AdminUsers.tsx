import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  FileText,
  Download,
  Filter,
  UserPlus,
  DollarSign,
  Calendar,
  Clock,
  MoreVertical,
  Users,
  CreditCard,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Upload,
  Ban,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useClientes } from "@/hooks/useClientes";
import { useUsers } from "@/hooks/useUsers";

function AdminUsers() {
  const {
    clientes: users,
    loading,
    error,
    addCliente,
    updateCliente: updateUser,
    deleteCliente: deleteUser,
  } = useClientes();
  const { users: cobrancasUsers } = useUsers(); // Usuários da página de Cobranças

  // State variables
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<any>(null);
  const [deletingUser, setDeletingUser] = React.useState<any>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("all");
  const [filterPlan, setFilterPlan] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(10);
  const [sortBy, setSortBy] = React.useState("created_at");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  const [newUser, setNewUser] = React.useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    plan: "",
    status: "ativo" as "ativo" | "inativo" | "suspenso",
    expirationDate: "",
    renovationDate: "",
    observations: "",
  });

  // Handlers and functions

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }

  function handleFilterStatusChange(value: string) {
    setFilterStatus(value);
    setCurrentPage(1);
  }

  function handleFilterPlanChange(value: string) {
    setFilterPlan(value);
    setCurrentPage(1);
  }

  function handleSort(column: string) {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  }

  function filteredUsers() {
    let filtered = users;

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerSearch) ||
          user.email.toLowerCase().includes(lowerSearch) ||
          user.phone.toLowerCase().includes(lowerSearch)
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((user) => user.status === filterStatus);
    }

    if (filterPlan !== "all") {
      filtered = filtered.filter((user) => user.plan === filterPlan);
    }

    return filtered;
  }

  function sortedUsers() {
    const filtered = filteredUsers();
    const sorted = [...filtered].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === "string") {
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }

  function paginatedUsers() {
    const sorted = sortedUsers();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sorted.slice(startIndex, startIndex + itemsPerPage);
  }

  function totalPages() {
    return Math.ceil(filteredUsers().length / itemsPerPage);
  }

  function handleAddUser() {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Por favor, preencha os campos obrigatórios.");
      return;
    }
    addCliente(newUser);
    setIsAddDialogOpen(false);
    setNewUser({
      name: "",
      email: "",
      password: "",
      phone: "",
      plan: "",
      status: "ativo",
      expirationDate: "",
      renovationDate: "",
      observations: "",
    });
    toast.success("Usuário adicionado com sucesso!");
  }

  function handleEditUser() {
    if (!editingUser) return;
    if (!editingUser.name || !editingUser.email) {
      toast.error("Por favor, preencha os campos obrigatórios.");
      return;
    }
    updateUser(editingUser.id, editingUser);
    setIsEditDialogOpen(false);
    setEditingUser(null);
    toast.success("Usuário atualizado com sucesso!");
  }

  function openEditDialog(user: any) {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  }

  function openDeleteDialog(user: any) {
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
  }

  function togglePasswordVisibility() {
    setIsPasswordVisible(!isPasswordVisible);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Usuários</h1>
          <p className="text-gray-400">
            Gerencie os usuários do sistema
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
          <Button variant="outline" className="border-gray-700 text-gray-300">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button variant="outline" className="border-gray-700 text-gray-300">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-[#1a1d23] border border-gray-700 text-white">
          <CardHeader>
            <CardTitle>Total de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1d23] border border-gray-700 text-white">
          <CardHeader>
            <CardTitle>Usuários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {users.filter((u) => u.status === "ativo").length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1d23] border border-gray-700 text-white">
          <CardHeader>
            <CardTitle>Usuários Suspensos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {users.filter((u) => u.status === "suspenso").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative">
          <Input
            placeholder="Buscar usuário..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="max-w-sm pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <Select
          value={filterStatus}
          onValueChange={handleFilterStatusChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
            <SelectItem value="suspenso">Suspenso</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filterPlan}
          onValueChange={handleFilterPlanChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Plano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="basic">Básico</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users table */}
      <Table className="bg-[#1a1d23] border border-gray-700 text-white">
        <TableHeader>
          <TableRow>
            <TableHead
              onClick={() => handleSort("name")}
              className="cursor-pointer select-none"
            >
              Nome {sortBy === "name" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </TableHead>
            <TableHead
              onClick={() => handleSort("email")}
              className="cursor-pointer select-none"
            >
              Email {sortBy === "email" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Plano</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedUsers().map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.plan}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    user.status === "ativo"
                      ? "default"
                      : user.status === "inativo"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDeleteDialog(user)}
                    className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {paginatedUsers().length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-400">
                Nenhum usuário encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-gray-400">
          Página {currentPage} de {totalPages()}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages()))}
            disabled={currentPage === totalPages()}
          >
            Próximo
          </Button>
        </div>
      </div>

      {/* Dialog for adding new user */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl bg-[#1a1d23] border border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              Adicionar Novo Usuário
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Preencha os dados do novo usuário
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddUser();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Nome *</label>
                <Input
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Email *</label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Senha *</label>
                <div className="relative">
                  <Input
                    type={isPasswordVisible ? "text" : "password"}
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-2 text-gray-400"
                    tabIndex={-1}
                  >
                    {isPasswordVisible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block mb-1">Telefone</label>
                <Input
                  value={newUser.phone}
                  onChange={(e) =>
                    setNewUser({ ...newUser, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1">Plano</label>
                <Select
                  value={newUser.plan}
                  onValueChange={(value) =>
                    setNewUser({ ...newUser, plan: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Básico</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block mb-1">Status</label>
                <Select
                  value={newUser.status}
                  onValueChange={(value) =>
                    setNewUser({
                      ...newUser,
                      status: value as "ativo" | "inativo" | "suspenso",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                    <SelectItem value="suspenso">Suspenso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block mb-1">Data de Expiração</label>
                <VencimentoDatePicker />
              </div>
              <div>
                <label className="block mb-1">Data de Renovação</label>
                <RenovacaoDatePicker />
              </div>
              <div className="sm:col-span-2">
                <label className="block mb-1">Observações</label>
                <textarea
                  value={newUser.observations}
                  onChange={(e) =>
                    setNewUser({ ...newUser, observations: e.target.value })
                  }
                  className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Adicionar Usuário
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog for editing user */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl bg-[#1a1d23] border border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              Editar Usuário
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Edite os dados do usuário
            </DialogDescription>
          </DialogHeader>

          {editingUser && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditUser();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Nome *</label>
                  <Input
                    value={editingUser.name}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Email *</label>
                  <Input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Telefone</label>
                  <Input
                    value={editingUser.phone}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1">Plano</label>
                  <Select
                    value={editingUser.plan}
                    onValueChange={(value) =>
                      setEditingUser({ ...editingUser, plan: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o plano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Básico</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-1">Status</label>
                  <Select
                    value={editingUser.status}
                    onValueChange={(value) =>
                      setEditingUser({
                        ...editingUser,
                        status: value as "ativo" | "inativo" | "suspenso",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                      <SelectItem value="suspenso">Suspenso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-1">Data de Expiração</label>
                  <VencimentoDatePickerEdit
                    editingUser={editingUser}
                    setEditingUser={setEditingUser}
                  />
                </div>
                <div>
                  <label className="block mb-1">Data de Renovação</label>
                  <RenovacaoDatePicker />
                </div>
                <div className="sm:col-span-2">
                  <label className="block mb-1">Observações</label>
                  <textarea
                    value={editingUser.observations}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        observations: e.target.value,
                      })
                    }
                    className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Alert dialog for deleting user */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#1a1d23] border border-gray-700 text-white">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <AlertDialogTitle className="text-lg font-semibold text-white">
                  Confirmar Exclusão
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400 mt-1">
                  Esta ação não pode ser desfeita. O usuário será
                  permanentemente removido do sistema.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          {deletingUser && (
            <div className="bg-[#23272f] rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                Usuário a ser excluído:
              </h3>
              <div className="space-y-2">
                <p className="text-white">
                  <span className="text-gray-400">Nome:</span>{" "}
                  {deletingUser.name}
                </p>
                <p className="text-white">
                  <span className="text-gray-400">Email:</span>{" "}
                  {deletingUser.email}
                </p>
                <p className="text-white">
                  <span className="text-gray-400">Plano:</span>{" "}
                  {deletingUser.plan}
                </p>
                <p className="text-white">
                  <span className="text-gray-400">Status:</span>{" "}
                  {deletingUser.status}
                </p>
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white border border-gray-600 hover:bg-gray-600">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingUser) {
                  deleteUser(deletingUser.id);
                  setIsDeleteDialogOpen(false);
                  setDeletingUser(null);
                  toast.success("Usuário excluído com sucesso!");
                }
              }}
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
      <PopoverContent
        align="start"
        className="w-auto p-0 bg-[#1f2937] border border-gray-700"
      >
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
      <PopoverContent
        align="start"
        className="w-auto p-0 bg-[#1f2937] border border-gray-700"
      >
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

function VencimentoDatePickerEdit({
  editingUser,
  setEditingUser,
}: {
  editingUser: any | null;
  setEditingUser: (user: any) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    editingUser?.expirationDate
      ? new Date(editingUser.expirationDate)
      : undefined
  );
  const [time, setTime] = React.useState<string>("");

  React.useEffect(() => {
    if (editingUser?.expirationDate) {
      setDate(new Date(editingUser.expirationDate));
    } else {
      setDate(undefined);
    }
  }, [editingUser?.expirationDate]);

  function handleDateSelect(selected: Date | undefined) {
    setDate(selected);
    if (selected && editingUser) {
      const isoDate = selected.toISOString().split("T")[0];
      setEditingUser({ ...editingUser, expirationDate: isoDate });
    } else if (editingUser) {
      setEditingUser({ ...editingUser, expirationDate: "" });
    }
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
      <PopoverContent
        align="start"
        className="w-auto p-0 bg-[#1f2937] border border-gray-700"
      >
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
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

export default AdminUsers;
