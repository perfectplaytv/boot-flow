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
import { Users, Plus, Search, Edit, Trash2, Eye, User, Mail, Calendar, Shield, Activity, CheckCircle, Copy } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import React from "react";
import { useClientes } from "@/hooks/useClientes";
import { useUsers } from "@/hooks/useUsers";

export default function AdminUsers() {
  const { clientes: users, loading, error, addCliente, updateCliente: updateUser, deleteCliente: deleteUser } = useClientes();
  const { users: cobrancasUsers } = useUsers();

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    plan: "",
    status: "Ativo",
    telegram: "",
    observations: "",
    expirationDate: "",
    password: "",
    bouquets: "",
    realName: "",
    whatsapp: "",
    devices: 0,
    credits: 0,
    notes: ""
  });

  // Estado para URL M3U e extração
  const [m3uUrl, setM3uUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState("");

  // Função para extrair dados da M3U
  async function handleExtractM3U() {
    setIsExtracting(true);
    setExtractError("");
    try {
      // Exemplo de requisição para endpoint de extração (ajuste a URL real se necessário)
      const res = await fetch(`/api/extract-m3u?url=${encodeURIComponent(m3uUrl)}`);
      if (!res.ok) throw new Error("Erro ao extrair dados da M3U");
      const data = await res.json();
      // Preencher campos do formulário automaticamente (ajuste conforme estrutura retornada)
      setNewUser((prev) => ({
        ...prev,
        name: data.name || prev.name,
        email: data.email || prev.email,
        password: data.password || prev.password,
        bouquets: data.bouquets || prev.bouquets,
        expirationDate: data.expirationDate || prev.expirationDate,
        // Adicione outros campos conforme necessário
      }));
    } catch (err) {
      setExtractError("Não foi possível extrair os dados da M3U.");
    } finally {
      setIsExtracting(false);
    }
  }

  // Estados para a extração M3U
  const [extractionResult, setExtractionResult] = useState<any>(null);
  const [extractedUsers, setExtractedUsers] = useState<any[]>([]);
  const [selectedExtractedUser, setSelectedExtractedUser] = useState<any>(null);

  // Estados para os modais de ação
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [viewingUser, setViewingUser] = useState<any | null>(null);
  const [deletingUser, setDeletingUser] = useState<any | null>(null);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [addUserSuccess, setAddUserSuccess] = useState(false);
  
  // Estados para copiar clientes da página de Cobranças
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [isCopyingUsers, setIsCopyingUsers] = useState(false);
  const [copyProgress, setCopyProgress] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const usersSafe = users || [];
  const filteredUsers = usersSafe.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4 sm:space-y-6 min-h-screen bg-[#09090b] p-3 sm:p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Gestão de Usuários</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Usuário
        </Button>
      </div>

      {loading && (
        <div className="bg-blue-900/40 border border-blue-700 text-blue-300 rounded-lg p-4">
          Carregando usuários...
        </div>
      )}

      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg p-4">
          Erro: {error}
        </div>
      )}

      <Card className="bg-[#1f2937] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#374151] border-gray-600 text-white"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-300">Nome</TableHead>
                <TableHead className="text-gray-300">Email</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-white">{user.name}</TableCell>
                  <TableCell className="text-white">{user.email}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-700">Ativo</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setViewingUser(user)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingUser(user)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setUserToDelete(user)}>
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

      {/* Modal de Adicionar Cliente */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-[#1f2937] text-white max-w-2xl w-full p-0 rounded-xl shadow-xl border border-gray-700 flex flex-col max-h-[90vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle>Adicionar Cliente</DialogTitle>
            <DialogDescription>Preencha os dados do novo cliente para adicioná-lo à base de dados.</DialogDescription>
          </DialogHeader>
          <div className="p-6 w-full pt-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Adicionar Cliente <span className="ml-2 text-xs bg-green-700 text-white px-2 py-1 rounded">Novo</span></h2>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" onClick={() => setIsAddDialogOpen(false)}>Fechar</Button>
            </div>
            {/* Extração M3U */}
            <div className="mb-6 bg-[#232a36] border border-blue-700/40 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-blue-300">Extração M3U</span>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-700" disabled={isExtracting}>Teste</Button>
                  <Button size="sm" className="bg-blue-700" onClick={handleExtractM3U} disabled={isExtracting || !m3uUrl}>
                    {isExtracting ? "Extraindo..." : "Extrair"}
                  </Button>
                </div>
              </div>
              <Input
                placeholder="Insira a URL do M3U para extrair automaticamente os dados do cliente..."
                className="bg-[#1f2937] border border-gray-700 text-white"
                value={m3uUrl}
                onChange={e => setM3uUrl(e.target.value)}
                disabled={isExtracting}
              />
              <p className="text-xs text-blue-400 mt-2">Se preencher os dados, automaticamente extrai a partir da URL.</p>
              {extractError && <p className="text-xs text-red-400 mt-2">{extractError}</p>}
            </div>
            {/* Informações Básicas */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Servidor</Label>
                <Select>
                  <SelectTrigger className="bg-[#232a36] border border-gray-700 text-white"><SelectValue placeholder="IPTV" /></SelectTrigger>
                  <SelectContent><SelectItem value="iptv">IPTV</SelectItem></SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Plano</Label>
                <Select>
                  <SelectTrigger className="bg-[#232a36] border border-gray-700 text-white"><SelectValue placeholder="Selecione um plano" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plano1">Plano 1</SelectItem>
                    <SelectItem value="plano2">Plano 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Usuário</Label>
                <Input placeholder="Usuário" className="bg-[#232a36] border border-gray-700 text-white" />
                <p className="text-xs text-yellow-400 mt-1">O usuário e senha padrão virão da M3U. Para mudar o servidor, migre para outro usando a Nova M3U Secundária.</p>
              </div>
              <div>
                <Label className="text-gray-300">Senha</Label>
                <Input placeholder="Senha" className="bg-[#232a36] border border-gray-700 text-white" />
                <p className="text-xs text-blue-400 mt-1">Senha extraída automaticamente da URL M3U</p>
              </div>
              <div>
                <Label className="text-gray-300">Status</Label>
                <Select defaultValue="Ativo">
                  <SelectTrigger className="bg-[#232a36] border border-gray-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Vencimento (Opcional)</Label>
                <Input type="date" className="bg-[#232a36] border border-gray-700 text-white" />
              </div>
              <div className="md:col-span-2">
                <Label className="text-gray-300">Bouquets</Label>
                <Input placeholder="Bouquets extraídos automaticamente" className="bg-[#232a36] border border-gray-700 text-white" disabled />
                <p className="text-xs text-green-400 mt-1">Bouquets extraídos automaticamente da conta IPTV</p>
              </div>
            </div>
            {/* Contatos e Observações */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Nome</Label>
                <Input placeholder="Opcional" className="bg-[#232a36] border border-gray-700 text-white" />
              </div>
              <div>
                <Label className="text-gray-300">E-mail</Label>
                <Input placeholder="Opcional" className="bg-[#232a36] border border-gray-700 text-white" />
              </div>
              <div>
                <Label className="text-gray-300">Telegram</Label>
                <Input placeholder="Opcional" className="bg-[#232a36] border border-gray-700 text-white" />
              </div>
              <div>
                <Label className="text-gray-300">WhatsApp</Label>
                <Input placeholder="Opcional" className="bg-[#232a36] border border-gray-700 text-white" />
                <p className="text-xs text-gray-400 mt-1">Inclua o código do país - com ou sem espaço e traços. Ex: 55 11 99999-3333</p>
              </div>
              <div className="md:col-span-2">
                <Label className="text-gray-300">Observações</Label>
                <Input placeholder="Opcional" className="bg-[#232a36] border border-gray-700 text-white" />
              </div>
            </div>
            {/* Configuração de Serviço */}
            <div className="mb-6 border-t border-gray-700 pt-4">
              <h3 className="text-purple-400 font-semibold mb-2">Configuração de Serviço</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300">Classe de Serviço</Label>
                  <Select>
                    <SelectTrigger className="bg-[#232a36] border border-gray-700 text-white"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classe1">Classe 1</SelectItem>
                      <SelectItem value="classe2">Classe 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Plano</Label>
                  <Select defaultValue="Mensal">
                    <SelectTrigger className="bg-[#232a36] border border-gray-700 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mensal">Mensal</SelectItem>
                      <SelectItem value="Anual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Status</Label>
                  <Select defaultValue="Ativo">
                    <SelectTrigger className="bg-[#232a36] border border-gray-700 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Data de Renovação</Label>
                  <Input type="date" className="bg-[#232a36] border border-gray-700 text-white" />
                </div>
                <div>
                  <Label className="text-gray-300">Número de Dispositivos</Label>
                  <Input type="number" min={1} className="bg-[#232a36] border border-gray-700 text-white" />
                </div>
                <div>
                  <Label className="text-gray-300">Créditos</Label>
                  <div className="flex items-center gap-2">
                    <Input type="number" min={0} className="bg-[#232a36] border border-gray-700 text-white w-24" />
                    <span className="text-xs text-gray-400">unidade</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Informações Adicionais */}
            <div className="mb-4 border-t border-gray-700 pt-4">
              <Label className="flex items-center gap-2 text-gray-300">
                <input type="checkbox" className="accent-purple-600" />
                Notificações via WhatsApp
              </Label>
              <Label className="text-gray-300 mt-2">Anotações</Label>
              <Input placeholder="Anotações..." className="bg-[#232a36] border border-gray-700 text-white" />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" className="bg-[#232a36] text-white" onClick={() => setIsAddDialogOpen(false)}>Fechar</Button>
              <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white">Adicionar Cliente</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}