import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNeonUsers } from "@/hooks/useNeonUsers";
import { useUsers } from "@/hooks/useUsers";
import { User, UserPlus, Search, Edit, Eye, Trash2, Copy, Download, Upload, Calendar, Clock, Package, CreditCard, MessageCircle, Settings, Users, FileText, BarChart3, ShoppingCart, Gamepad2, Radio, Tv, Bell, HelpCircle, Shield, Globe, Zap, Star, Award, Trophy, Target, TrendingUp, Activity, PieChart, DollarSign, Percent, ArrowUpRight, ArrowDownRight, CheckCircle, XCircle, AlertCircle, Info, Database, X } from "lucide-react";

export default function AdminUsers() {
  const { users, loading, error, createUser, updateUser, deleteUser } = useNeonUsers();
  const { users: cobrancasUsers } = useUsers(); // Usuários da página de Cobranças

  // Estilos CSS customizados para o scroll
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-scroll::-webkit-scrollbar {
        width: 8px;
      }
      .custom-scroll::-webkit-scrollbar-track {
        background: #374151;
        border-radius: 4px;
      }
      .custom-scroll::-webkit-scrollbar-thumb {
        background: #6b7280;
        border-radius: 4px;
      }
      .custom-scroll::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
      }
      .custom-scroll {
        scrollbar-width: thin;
        scrollbar-color: #6b7280 #374151;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    plan: "",
    status: "Ativo",
    telegram: "",
    observations: "",
    expirationDate: "",
    password: "",
    bouquets: ""
  });

  // Função para converter data do formato brasileiro para ISO
  const convertDateToISO = (dateString: string) => {
    if (!dateString) return "";
    
    // Se já está no formato ISO, retorna como está
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Se está no formato brasileiro (dd/mm/yyyy), converte para ISO
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month}-${day}`;
    }
    
    return dateString;
  };

  // Função para converter data do formato ISO para brasileiro
  const convertDateToBrazilian = (dateString: string) => {
    if (!dateString) return "";
    
    // Se está no formato ISO, converte para brasileiro
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }
    
    return dateString;
  };

  // Estados para a extração M3U
  const [m3uUrl, setM3uUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<any>(null);
  const [extractionError, setExtractionError] = useState("");
  const [extractedUsers, setExtractedUsers] = useState<any[]>([]);
  const [selectedExtractedUser, setSelectedExtractedUser] = useState<any>(null);

  // Estados para os modais de ação
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

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

  // Unifica os usuários do banco e os da cobrança, sem duplicar emails
  const allUsers = [
    ...users,
    ...cobrancasUsers.filter(
      cUser => !users.some(u => u.email.toLowerCase() === cUser.email.toLowerCase())
    )
  ];

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async () => {
    if (newUser.name && newUser.email) {
      setIsAddingUser(true);
      setAddUserSuccess(false);
      
      try {
        const userData = {
          name: newUser.name,
          email: newUser.email,
          password: newUser.password || '',
          m3u_url: newUser.plan || '',
          bouquets: newUser.bouquets || '',
          expiration_date: newUser.expirationDate || null,
          observations: newUser.observations || ''
        };
        
        const success = await createUser(userData);
        
        if (success) {
          setAddUserSuccess(true);
          setNewUser({ 
            name: "", 
            email: "", 
            plan: "", 
            status: "Ativo",
            telegram: "",
            observations: "",
            expirationDate: "",
            password: "",
            bouquets: ""
          });
          
          setTimeout(() => {
            setIsAddDialogOpen(false);
            setAddUserSuccess(false);
          }, 1000);
        } else {
          alert('Erro ao adicionar usuário. Verifique os dados.');
        }
        
      } catch (error) {
        console.error('Erro ao adicionar usuário:', error);
        alert('Erro ao adicionar usuário. Tente novamente.');
      } finally {
        setIsAddingUser(false);
      }
    }
  };

  const handleEditUser = async () => {
    if (editingUser) {
      const updatedUserData = {
        name: editingUser.name,
        email: editingUser.email,
        password: editingUser.password || '',
        m3u_url: editingUser.plan || '',
        bouquets: editingUser.bouquets || '',
        expiration_date: editingUser.expirationDate || null,
        observations: editingUser.observations || ''
      };
      
      const success = await updateUser(editingUser.id, updatedUserData);
      
      if (success) {
        setEditingUser(null);
        setIsEditDialogOpen(false);
      } else {
        alert('Erro ao atualizar usuário. Verifique os dados.');
      }
    }
  };

  const handleDeleteUser = async () => {
    if (deletingUser) {
      const success = await deleteUser(deletingUser.id);
      
      if (success) {
        setDeletingUser(null);
        setIsDeleteDialogOpen(false);
      } else {
        alert('Erro ao deletar usuário. Tente novamente.');
      }
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

  const handleCopyAllUsersFromCobrancas = async () => {
    setIsCopyingUsers(true);
    setCopyProgress(0);
    setCopySuccess(false);
    
    try {
      const existingEmails = users.map(user => user.email.toLowerCase());
      const usersToCopy = cobrancasUsers.filter(user => 
        !existingEmails.includes(user.email.toLowerCase())
      );
      
      if (usersToCopy.length === 0) {
        alert('Todos os clientes da página de Cobranças já existem na página de Clientes!');
        setIsCopyingUsers(false);
        return;
      }
      
      for (let i = 0; i < usersToCopy.length; i++) {
        const user = usersToCopy[i];
        
        const userData = {
          name: user.name,
          email: user.email,
          password: user.password || '',
          m3u_url: user.plan || '',
          bouquets: user.bouquets || '',
          expiration_date: user.expirationDate || null,
          observations: user.observations || ''
        };
        
        await createUser(userData);
        setCopyProgress(((i + 1) / usersToCopy.length) * 100);
      }
      
      setCopySuccess(true);
      setTimeout(() => {
        setIsCopyDialogOpen(false);
        setCopySuccess(false);
        setCopyProgress(0);
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao copiar usuários:', error);
      alert('Erro ao copiar usuários. Tente novamente.');
    } finally {
      setIsCopyingUsers(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ativo':
        return 'bg-green-500';
      case 'inativo':
        return 'bg-red-500';
      case 'pendente':
        return 'bg-yellow-500';
      case 'suspenso':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const extractM3UData = async () => {
    if (!m3uUrl.trim()) {
      setExtractionError("Por favor, insira uma URL M3U válida");
      return;
    }

    setIsExtracting(true);
    setExtractionError("");
    setExtractionResult(null);

    try {
      // Simulação de extração M3U (funcionalidade temporária)
      // Em uma implementação real, você criaria uma API serverless para isso
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simular delay
      
      // Dados simulados de exemplo
      const mockData = {
        totalUsers: Math.floor(Math.random() * 100) + 50,
        activeUsers: Math.floor(Math.random() * 80) + 30,
        expiredUsers: Math.floor(Math.random() * 20) + 5,
        users: [
          {
            name: "João Silva",
            email: "joao@exemplo.com",
            status: "Ativo",
            expirationDate: "2024-12-31"
          },
          {
            name: "Maria Santos",
            email: "maria@exemplo.com", 
            status: "Ativo",
            expirationDate: "2024-11-15"
          },
          {
            name: "Pedro Costa",
            email: "pedro@exemplo.com",
            status: "Expirado", 
            expirationDate: "2024-09-01"
          }
        ]
      };
      
      setExtractionResult(mockData);
      setExtractedUsers(mockData.users || []);
      
    } catch (error) {
      console.error('Erro na extração:', error);
      setExtractionError("Erro ao extrair dados M3U. Verifique a URL e tente novamente.");
    } finally {
      setIsExtracting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-white text-xl">Carregando usuários...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-red-500 text-xl">Erro ao carregar usuários: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1419] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Gerenciamento de Usuários</h1>
          <p className="text-gray-400">
            {loading ? 'Carregando...' : `Gerencie todos os usuários do sistema (${allUsers.length} usuários - ${users.length} do banco + ${cobrancasUsers.filter(cUser => !users.some(u => u.email.toLowerCase() === cUser.email.toLowerCase())).length} da cobrança)`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#1f2937] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{allUsers.length}</div>
              <p className="text-xs text-gray-400">Usuários ativos no sistema</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1f2937] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Usuários do Banco</CardTitle>
              <Database className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{users.length}</div>
              <p className="text-xs text-gray-400">Armazenados no Neon</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1f2937] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Usuários da Cobrança</CardTitle>
              <CreditCard className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{cobrancasUsers.length}</div>
              <p className="text-xs text-gray-400">Da página de cobranças</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1f2937] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Novos Hoje</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">+12</div>
              <p className="text-xs text-green-400">+8% em relação ao mês passado</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-[#1f2937] border border-gray-700">
            <TabsTrigger value="users" className="data-[state=active]:bg-[#374151]">Usuários</TabsTrigger>
            <TabsTrigger value="extract" className="data-[state=active]:bg-[#374151]">Extrair M3U</TabsTrigger>
            <TabsTrigger value="copy" className="data-[state=active]:bg-[#374151]">Copiar da Cobrança</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#1f2937] border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Adicionar Usuário
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0f1419] border-gray-700 text-white max-w-4xl h-[95vh] p-0" style={{ maxHeight: '95vh', overflow: 'hidden' }}>
                  <VisuallyHidden>
                    <DialogHeader>
                      <DialogTitle>Adicionar Cliente</DialogTitle>
                      <DialogDescription>Preencha os dados do novo cliente para adicioná-lo à base de dados</DialogDescription>
                    </DialogHeader>
                  </VisuallyHidden>
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-[#1a1f2e] flex-shrink-0">
                      <div className="flex items-center gap-3">
                        <div>
                          <h2 className="text-xl font-semibold text-white">Adicionar Cliente</h2>
                          <p className="text-sm text-gray-400 mt-1">Preencha os dados do novo cliente para adicioná-lo à base de dados</p>
                        </div>
                        <Badge className="bg-green-600 text-white text-xs">Novo</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Upload className="h-4 w-4 mr-1" />
                          Importar
                        </Button>
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <FileText className="h-4 w-4 mr-1" />
                          Modelo
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setIsAddDialogOpen(false)} className="text-gray-400 hover:text-white">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="px-6 py-3 bg-[#1a1f2e] border-b border-gray-700 flex-shrink-0">
                      <p className="text-xs text-gray-400">
                        Campos obrigatórios marcados com * • Dados serão sincronizados automaticamente
                      </p>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0 custom-scroll">
                      {/* Extração M3U Section */}
                      <div className="border border-blue-600 rounded-lg p-4 bg-blue-900/10">
                        <h3 className="text-lg font-medium text-white mb-2">Extração M3U</h3>
                        <p className="text-sm text-gray-400 mb-4">Serve para importar dados automaticamente a partir de uma URL.</p>
                        
                        <div className="space-y-3">
                          <Input
                            placeholder="Insira a URL do M3U para extrair automaticamente os dados do cliente..."
                            className="bg-[#23272f] border-gray-700 text-white"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                              Teste
                            </Button>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                              Extrair
                            </Button>
                          </div>
                          <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-md">
                            <p className="text-sm text-blue-300">
                              <Info className="h-4 w-4 inline mr-1" />
                              Funcionalidade em demonstração. Para implementação completa, será necessário criar uma API serverless para processar as URLs M3U.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Informações Básicas */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-white">Informações Básicas</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-300">Servidor *</Label>
                            <Select>
                              <SelectTrigger className="bg-[#23272f] border-gray-700 text-white">
                                <SelectValue placeholder="IPTV 2" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#1f2937] border-gray-700 text-white">
                                <SelectItem value="iptv1">IPTV 1</SelectItem>
                                <SelectItem value="iptv2">IPTV 2</SelectItem>
                                <SelectItem value="iptv3">IPTV 3</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="mt-2 p-2 bg-orange-900/20 border border-orange-700 rounded text-xs text-orange-300">
                              O servidor não pode ser alterado aqui. Para mudar o servidor, você precisa migrar para outro servidor usando o ícone Migrar Servidor.
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-300">Plano *</Label>
                            <Select>
                              <SelectTrigger className="bg-[#23272f] border-gray-700 text-white">
                                <SelectValue placeholder="Selecione um plano" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#1f2937] border-gray-700 text-white">
                                <SelectItem value="basico">Básico</SelectItem>
                                <SelectItem value="premium">Premium</SelectItem>
                                <SelectItem value="vip">VIP</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-300">Usuário *</Label>
                            <div className="relative">
                              <Input
                                value={newUser.name}
                                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                className="bg-[#23272f] border-gray-700 text-white pr-10"
                                placeholder="Usuário"
                              />
                              <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-300">Senha</Label>
                            <div className="relative">
                              <Input
                                type="password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                className="bg-[#23272f] border-gray-700 text-white pr-10"
                                placeholder="Senha"
                              />
                              <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                            <Button size="sm" variant="outline" className="mt-2 border-blue-600 text-blue-400 hover:bg-blue-900/20">
                              Senha extraída automaticamente da URL M3U
                            </Button>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-300">Status</Label>
                            <Select value={newUser.status} onValueChange={(value) => setNewUser({...newUser, status: value})}>
                              <SelectTrigger className="bg-[#23272f] border-gray-700 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-[#1f2937] border-gray-700 text-white">
                                <SelectItem value="Ativo">Ativo</SelectItem>
                                <SelectItem value="Inativo">Inativo</SelectItem>
                                <SelectItem value="Pendente">Pendente</SelectItem>
                                <SelectItem value="Suspenso">Suspenso</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-300">Vencimento (Opcional)</Label>
                            <div className="relative">
                              <Input
                                type="date"
                                value={newUser.expirationDate}
                                onChange={(e) => setNewUser({...newUser, expirationDate: e.target.value})}
                                className="bg-[#23272f] border-gray-700 text-white pr-10"
                                placeholder="dd/mm/aaaa"
                                min={new Date().toISOString().split('T')[0]}
                              />
                              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <Label className="text-sm font-medium text-gray-300">Bouquets</Label>
                            <Input
                              value={newUser.bouquets}
                              onChange={(e) => setNewUser({...newUser, bouquets: e.target.value})}
                              className="bg-[#23272f] border-gray-700 text-white"
                              placeholder="Bouquets extraídos automaticamente"
                            />
                            <div className="mt-2 p-2 bg-green-900/20 border border-green-700 rounded text-xs text-green-300">
                              Bouquets extraídos automaticamente da conta IPTV
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Informações de Contato */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-white">Informações de Contato</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-300">Nome</Label>
                            <Input
                              value={newUser.name}
                              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                              className="bg-[#23272f] border-gray-700 text-white"
                              placeholder="Opcional"
                            />
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-300">E-mail</Label>
                            <Input
                              type="email"
                              value={newUser.email}
                              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                              className="bg-[#23272f] border-gray-700 text-white"
                              placeholder="Opcional"
                            />
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-300">Telegram</Label>
                            <Input
                              value={newUser.telegram}
                              onChange={(e) => setNewUser({...newUser, telegram: e.target.value})}
                              className="bg-[#23272f] border-gray-700 text-white"
                              placeholder="Opcional"
                            />
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-300">WhatsApp</Label>
                            <Input
                              className="bg-[#23272f] border-gray-700 text-white"
                              placeholder="Opcional"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                              Incluindo o código do país - com ou sem espaço e traços ex: 55 11 99999-8888
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Observações */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-white">Observações</h3>
                        <Textarea
                          value={newUser.observations}
                          onChange={(e) => setNewUser({...newUser, observations: e.target.value})}
                          className="bg-[#23272f] border-gray-700 text-white"
                          placeholder="Opcional"
                          rows={3}
                        />
                      </div>

                      {/* Configuração de Serviço */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-white">Configuração de Serviço</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-300">Classe de Serviço</Label>
                            <Select>
                              <SelectTrigger className="bg-[#23272f] border-gray-700 text-white">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#1f2937] border-gray-700 text-white">
                                <SelectItem value="classe1">Classe 1</SelectItem>
                                <SelectItem value="classe2">Classe 2</SelectItem>
                                <SelectItem value="classe3">Classe 3</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-300">Plano</Label>
                            <Select>
                              <SelectTrigger className="bg-[#23272f] border-gray-700 text-white">
                                <SelectValue placeholder="Mensal" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#1f2937] border-gray-700 text-white">
                                <SelectItem value="mensal">Mensal</SelectItem>
                                <SelectItem value="trimestral">Trimestral</SelectItem>
                                <SelectItem value="semestral">Semestral</SelectItem>
                                <SelectItem value="anual">Anual</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-300">Status</Label>
                            <Select>
                              <SelectTrigger className="bg-[#23272f] border-gray-700 text-white">
                                <SelectValue placeholder="Ativo" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#1f2937] border-gray-700 text-white">
                                <SelectItem value="ativo">Ativo</SelectItem>
                                <SelectItem value="inativo">Inativo</SelectItem>
                                <SelectItem value="suspenso">Suspenso</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-300">Data de Renovação</Label>
                            <Input
                              type="date"
                              className="bg-[#23272f] border-gray-700 text-white"
                            />
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-300">Número de Dispositivos</Label>
                            <Input
                              type="number"
                              className="bg-[#23272f] border-gray-700 text-white"
                              placeholder="1"
                            />
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-300">Créditos</Label>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                -
                              </Button>
                              <Input
                                type="number"
                                className="bg-[#23272f] border-gray-700 text-white w-20 text-center"
                                placeholder="0"
                              />
                              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                +
                              </Button>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">valor entre 0 e 500€</p>
                          </div>
                        </div>
                      </div>

                      {/* Informações Adicionais */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-white">Informações Adicionais</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="notifications" className="rounded border-gray-600 bg-[#23272f]" />
                            <Label htmlFor="notifications" className="text-sm text-gray-300">
                              Notificações via WhatsApp
                            </Label>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-300">Anotações</Label>
                            <Textarea
                              className="bg-[#23272f] border-gray-700 text-white"
                              placeholder="Anotações..."
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between p-6 border-t border-gray-700 bg-[#1a1f2e] flex-shrink-0">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        Fechar
                      </Button>
                      <Button 
                        onClick={handleAddUser} 
                        disabled={isAddingUser}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isAddingUser ? 'Adicionando...' : 'Adicionar Cliente'}
                      </Button>
                    </div>
                  </div>
                  
                  {addUserSuccess && (
                    <div className="absolute top-4 right-4 p-3 bg-green-600 text-white rounded-md">
                      Usuário adicionado com sucesso!
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-[#1f2937] rounded-lg border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#374151]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Usuário</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Plano</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Expiração</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-[#374151] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-white">{user.name}</div>
                            <div className="text-sm text-gray-400">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={`${getStatusColor(user.status)} text-white`}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.plan || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.expirationDate ? new Date(user.expirationDate).toLocaleDateString('pt-BR') : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openViewModal(user)}
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(user)}
                              className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteModal(user)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="extract" className="space-y-6">
            <Card className="bg-[#1f2937] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Extrair Dados M3U</CardTitle>
                <CardDescription className="text-gray-400">
                  Insira uma URL M3U para extrair informações dos usuários
                </CardDescription>
                <div className="mt-2 p-3 bg-blue-900/20 border border-blue-700 rounded-md">
                  <p className="text-sm text-blue-300">
                    <Info className="h-4 w-4 inline mr-1" />
                    Funcionalidade em demonstração. Para implementação completa, será necessário criar uma API serverless para processar arquivos M3U.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="m3u-url">URL M3U</Label>
                  <Input
                    id="m3u-url"
                    value={m3uUrl}
                    onChange={(e) => setM3uUrl(e.target.value)}
                    placeholder="https://exemplo.com/lista.m3u"
                    className="bg-[#23272f] border-gray-700 text-white"
                  />
                </div>
                
                <Button 
                  onClick={extractM3UData} 
                  disabled={isExtracting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isExtracting ? 'Extraindo...' : 'Extrair Dados'}
                </Button>
                
                {extractionError && (
                  <div className="p-3 bg-red-600 text-white rounded-md">
                    {extractionError}
                  </div>
                )}
                
                {extractionResult && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Resultado da Extração</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-[#374151] rounded-lg">
                        <div className="text-2xl font-bold text-white">{extractionResult.totalUsers || 0}</div>
                        <div className="text-sm text-gray-400">Total de Usuários</div>
                      </div>
                      <div className="p-4 bg-[#374151] rounded-lg">
                        <div className="text-2xl font-bold text-white">{extractionResult.activeUsers || 0}</div>
                        <div className="text-sm text-gray-400">Usuários Ativos</div>
                      </div>
                      <div className="p-4 bg-[#374151] rounded-lg">
                        <div className="text-2xl font-bold text-white">{extractionResult.expiredUsers || 0}</div>
                        <div className="text-sm text-gray-400">Usuários Expirados</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="copy" className="space-y-6">
            <Card className="bg-[#1f2937] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Copiar Usuários da Cobrança</CardTitle>
                <CardDescription className="text-gray-400">
                  Copie todos os usuários da página de Cobranças para o banco de dados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#374151] rounded-lg">
                    <div className="text-2xl font-bold text-white">{users.length}</div>
                    <div className="text-sm text-gray-400">Usuários no banco</div>
                  </div>
                  <div className="p-4 bg-[#374151] rounded-lg">
                    <div className="text-2xl font-bold text-white">{cobrancasUsers.length}</div>
                    <div className="text-sm text-gray-400">Usuários da cobrança</div>
                  </div>
                  <div className="p-4 bg-[#374151] rounded-lg">
                    <div className="text-2xl font-bold text-white">
                      {cobrancasUsers.filter(user => 
                        !users.map(u => u.email.toLowerCase()).includes(user.email.toLowerCase())
                      ).length}
                    </div>
                    <div className="text-sm text-gray-400">A serem copiados</div>
                  </div>
                </div>
                
                <AlertDialog open={isCopyDialogOpen} onOpenChange={setIsCopyDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar Todos os Usuários
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-[#1f2937] border-gray-700 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Cópia</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-400">
                        Tem certeza que deseja copiar todos os usuários da página de Cobranças?
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    
                    <div className="space-y-2">
                      <p className="text-white">
                        <span className="text-gray-400">Usuários no banco:</span> {users.length}
                      </p>
                      <p className="text-white">
                        <span className="text-gray-400">Usuários da cobrança:</span> {cobrancasUsers.length}
                      </p>
                      <p className="text-white">
                        <span className="text-gray-400">Usuários a serem copiados:</span> {
                          cobrancasUsers.filter(user => 
                            !users.map(u => u.email.toLowerCase()).includes(user.email.toLowerCase())
                          ).length
                        }
                      </p>
                    </div>
                    
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleCopyAllUsersFromCobrancas}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {isCopyingUsers ? 'Copiando...' : 'Confirmar Cópia'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                    
                    {copyProgress > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                          <span>Progresso</span>
                          <span>{Math.round(copyProgress)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${copyProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {copySuccess && (
                      <div className="mt-4 p-3 bg-green-600 text-white rounded-md text-center">
                        Usuários copiados com sucesso!
                      </div>
                    )}
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Visualização */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-[#1f2937] border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
            <DialogDescription className="text-gray-400">
              Visualize as informações completas do usuário
            </DialogDescription>
          </DialogHeader>
          
          {viewingUser && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Nome</Label>
                <p className="text-white font-medium">{viewingUser.name}</p>
              </div>
              
              <div>
                <Label className="text-gray-400">Email</Label>
                <p className="text-white font-medium">{viewingUser.email}</p>
              </div>
              
              <div>
                <Label className="text-gray-400">Status</Label>
                <Badge className={`${getStatusColor(viewingUser.status)} text-white`}>
                  {viewingUser.status}
                </Badge>
              </div>
              
              <div>
                <Label className="text-gray-400">Plano</Label>
                <p className="text-white font-medium">{viewingUser.plan || 'N/A'}</p>
              </div>
              
              <div>
                <Label className="text-gray-400">Data de Expiração</Label>
                <p className="text-white font-medium">
                  {viewingUser.expirationDate ? new Date(viewingUser.expirationDate).toLocaleDateString('pt-BR') : 'N/A'}
                </p>
              </div>
              
              <div>
                <Label className="text-gray-400">Telegram</Label>
                <p className="text-white font-medium">{viewingUser.telegram || 'N/A'}</p>
              </div>
              
              <div>
                <Label className="text-gray-400">Pacotes</Label>
                <p className="text-white font-medium">{viewingUser.bouquets || 'N/A'}</p>
              </div>
              
              <div className="md:col-span-2">
                <Label className="text-gray-400">Observações</Label>
                <p className="text-white font-medium">{viewingUser.observations || 'N/A'}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[#1f2937] border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription className="text-gray-400">
              Modifique as informações do usuário
            </DialogDescription>
          </DialogHeader>
          
          {editingUser && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="bg-[#23272f] border-gray-700 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="bg-[#23272f] border-gray-700 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-password">Senha</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={editingUser.password || ''}
                  onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                  className="bg-[#23272f] border-gray-700 text-white"
                  placeholder="Deixe em branco para manter a atual"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-plan">Plano/URL M3U</Label>
                <Input
                  id="edit-plan"
                  value={editingUser.plan || ''}
                  onChange={(e) => setEditingUser({...editingUser, plan: e.target.value})}
                  className="bg-[#23272f] border-gray-700 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={editingUser.status} onValueChange={(value) => setEditingUser({...editingUser, status: value})}>
                  <SelectTrigger className="bg-[#23272f] border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1f2937] border-gray-700 text-white">
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Suspenso">Suspenso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-expirationDate">Data de Expiração</Label>
                <Input
                  id="edit-expirationDate"
                  type="date"
                  value={editingUser.expirationDate || ''}
                  onChange={(e) => setEditingUser({...editingUser, expirationDate: e.target.value})}
                  className="bg-[#23272f] border-gray-700 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-telegram">Telegram</Label>
                <Input
                  id="edit-telegram"
                  value={editingUser.telegram || ''}
                  onChange={(e) => setEditingUser({...editingUser, telegram: e.target.value})}
                  className="bg-[#23272f] border-gray-700 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-bouquets">Pacotes</Label>
                <Input
                  id="edit-bouquets"
                  value={editingUser.bouquets || ''}
                  onChange={(e) => setEditingUser({...editingUser, bouquets: e.target.value})}
                  className="bg-[#23272f] border-gray-700 text-white"
                />
              </div>
            </div>
          )}
          
          <div>
            <Label htmlFor="edit-observations">Observações</Label>
            <Textarea
              id="edit-observations"
              value={editingUser?.observations || ''}
              onChange={(e) => setEditingUser(editingUser ? {...editingUser, observations: e.target.value} : null)}
              className="bg-[#23272f] border-gray-700 text-white"
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Cancelar
            </Button>
            <Button onClick={handleEditUser} className="bg-blue-600 hover:bg-blue-700 text-white">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#1f2937] border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Tem certeza que deseja excluir o usuário "{deletingUser?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 