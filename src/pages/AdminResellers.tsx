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
import { Users, Plus, Search, Edit, Trash2, Eye, User, Mail, Calendar, Shield, Activity, CheckCircle, RefreshCw, Maximize2, Moon } from "lucide-react";
import { useNeonResellers } from "@/hooks/useNeonResellers";
import type { Reseller } from "@/hooks/useNeonResellers";

export default function AdminResellers() {
  const { resellers, loading, error, createReseller, updateReseller, deleteReseller } = useNeonResellers();

  const [newReseller, setNewReseller] = useState({
    username: "",
    password: "",
    force_password_change: false,
    permission: "",
    credits: 10,
    servers: "",
    master_reseller: "",
    disable_login_days: 0,
    monthly_reseller: false,
    personal_name: "",
    email: "",
    telegram: "",
    whatsapp: "",
    observations: ""
  });

  // Estados para os modais
  const [editingReseller, setEditingReseller] = useState<Reseller | null>(null);
  const [viewingReseller, setViewingReseller] = useState<Reseller | null>(null);
  const [deletingReseller, setDeletingReseller] = useState<Reseller | null>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingReseller, setIsAddingReseller] = useState(false);
  const [addResellerSuccess, setAddResellerSuccess] = useState(false);

  const filteredResellers = resellers.filter(reseller =>
    reseller.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reseller.personal_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reseller.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddReseller = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newReseller.username && newReseller.password && newReseller.permission) {
      setIsAddingReseller(true);
      setAddResellerSuccess(false);
      
      try {
        const success = await createReseller({
          username: newReseller.username,
          password: newReseller.password,
          force_password_change: newReseller.force_password_change,
          permission: newReseller.permission as 'admin' | 'reseller' | 'subreseller',
          credits: newReseller.credits,
          servers: newReseller.servers || undefined,
          master_reseller: newReseller.master_reseller || undefined,
          disable_login_days: newReseller.disable_login_days,
          monthly_reseller: newReseller.monthly_reseller,
          personal_name: newReseller.personal_name || undefined,
          email: newReseller.email || undefined,
          telegram: newReseller.telegram || undefined,
          whatsapp: newReseller.whatsapp || undefined,
          observations: newReseller.observations || undefined
        });
        
        if (success) {
          setAddResellerSuccess(true);
          
          // Limpar formulário
          setNewReseller({
            username: "",
            password: "",
            force_password_change: false,
            permission: "",
            credits: 10,
            servers: "",
            master_reseller: "",
            disable_login_days: 0,
            monthly_reseller: false,
            personal_name: "",
            email: "",
            telegram: "",
            whatsapp: "",
            observations: ""
          });
          
          // Fechar modal após 1 segundo
          setTimeout(() => {
            setIsAddDialogOpen(false);
            setAddResellerSuccess(false);
          }, 1000);
        }
      } catch (error) {
        console.error('Erro ao adicionar revendedor:', error);
      } finally {
        setIsAddingReseller(false);
      }
    }
  };

  const handleEditReseller = async () => {
    if (editingReseller) {
      const success = await updateReseller(editingReseller.id, {
        username: editingReseller.username,
        password: editingReseller.password,
        force_password_change: editingReseller.force_password_change,
        permission: editingReseller.permission,
        credits: editingReseller.credits,
        servers: editingReseller.servers,
        master_reseller: editingReseller.master_reseller,
        disable_login_days: editingReseller.disable_login_days,
        monthly_reseller: editingReseller.monthly_reseller,
        personal_name: editingReseller.personal_name,
        email: editingReseller.email,
        telegram: editingReseller.telegram,
        whatsapp: editingReseller.whatsapp,
        observations: editingReseller.observations
      });
      
      if (success) {
        setEditingReseller(null);
        setIsEditDialogOpen(false);
      }
    }
  };

  const handleDeleteReseller = async () => {
    if (deletingReseller) {
      const success = await deleteReseller(deletingReseller.id);
      
      if (success) {
        setDeletingReseller(null);
        setIsDeleteDialogOpen(false);
      }
    }
  };

  const openViewModal = (reseller: Reseller) => {
    setViewingReseller(reseller);
    setIsViewDialogOpen(true);
  };

  const openEditModal = (reseller: Reseller) => {
    setEditingReseller({ ...reseller });
    setIsEditDialogOpen(true);
  };

  const openDeleteModal = (reseller: Reseller) => {
    setDeletingReseller(reseller);
    setIsDeleteDialogOpen(true);
  };

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case "admin": return "bg-red-100 text-red-800";
      case "reseller": return "bg-blue-100 text-blue-800";
      case "subreseller": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-red-100 text-red-800";
      case "suspended": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 min-h-screen bg-[#09090b] p-6">
      {/* Indicadores de status */}
      {loading && (
        <div className="bg-blue-900/40 border border-blue-700 text-blue-300 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300"></div>
            <span>Carregando revendedores do banco de dados...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span>❌ Erro: {error}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gerenciamento de Revendedores</h1>
          <p className="text-gray-400">
            {loading ? 'Carregando...' : `Gerencie todos os revendedores do sistema (${resellers.length} revendedores)`}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-[#7e22ce] hover:bg-[#6d1bb7] text-white">
              <Plus className="w-4 h-4" />
              Adicionar Revenda
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1f2937] text-white max-w-4xl w-full p-0 rounded-xl shadow-xl border border-gray-700">
            <DialogHeader className="sr-only">
              <DialogTitle>Adicionar Revenda</DialogTitle>
              <DialogDescription>Preencha os dados do novo revendedor</DialogDescription>
            </DialogHeader>
            <div className="p-6 w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Adicionar um Revenda</h2>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </Button>
                </div>
              </div>
              
              <form onSubmit={handleAddReseller} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-white">
                      Usuário <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      className="bg-[#23272f] border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      placeholder="Obrigatório"
                      value={newReseller.username}
                      onChange={(e) => setNewReseller({...newReseller, username: e.target.value})}
                      required
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-blue-400 text-xs">
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        <span>O campo usuário só pode conter letras, números e traços.</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-400 text-xs">
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        <span>O usuário precisa ter no mínimo 6 caracteres.</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-white">
                      Senha <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        className="bg-[#23272f] border-gray-600 text-white flex-1 placeholder-gray-400 focus:border-blue-500"
                        placeholder="Digite a senha"
                        value={newReseller.password}
                        onChange={(e) => setNewReseller({...newReseller, password: e.target.value})}
                        required
                      />
                      <Button type="button" variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-blue-400 text-xs">
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        <span>A senha precisa ter no mínimo 8 caracteres.</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-400 text-xs">
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        <span>Pelo menos 8 caracteres de comprimento, mas 14 ou mais é melhor.</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-400 text-xs">
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        <span>Uma combinação de letras maiúsculas, letras minúsculas, números e símbolos.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="forcePasswordChange"
                    className="rounded border-gray-600 bg-[#23272f] text-blue-500 focus:ring-blue-500"
                    checked={newReseller.force_password_change}
                    onChange={(e) => setNewReseller({...newReseller, force_password_change: e.target.checked})}
                  />
                  <Label htmlFor="forcePasswordChange" className="text-sm text-gray-300">
                    Forçar revenda a mudar a senha no próximo login
                  </Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-white">
                      Permissão <span className="text-red-500">*</span>
                    </Label>
                    <Select value={newReseller.permission} onValueChange={(value) => setNewReseller({...newReseller, permission: value})}>
                      <SelectTrigger className="bg-[#23272f] border-gray-600 text-white focus:border-blue-500">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#23272f] border-gray-600">
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="reseller">Revendedor</SelectItem>
                        <SelectItem value="subreseller">Sub-Revendedor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-white">
                      Créditos <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="border-gray-600 text-gray-400 hover:text-white"
                        onClick={() => setNewReseller({...newReseller, credits: Math.max(0, newReseller.credits - 1)})}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </Button>
                      <Input
                        type="number"
                        className="bg-[#23272f] border-gray-600 text-white text-center placeholder-gray-400 focus:border-blue-500"
                        placeholder="0"
                        value={newReseller.credits}
                        onChange={(e) => setNewReseller({...newReseller, credits: parseInt(e.target.value) || 0})}
                        min="10"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="border-gray-600 text-gray-400 hover:text-white"
                        onClick={() => setNewReseller({...newReseller, credits: newReseller.credits + 1})}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </Button>
                    </div>
                    <div className="text-blue-400 text-xs">Mínimo de 10 créditos</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-white">Servidores (Opcional)</Label>
                  <Select value={newReseller.servers} onValueChange={(value) => setNewReseller({...newReseller, servers: value})}>
                    <SelectTrigger className="bg-[#23272f] border-gray-600 text-white focus:border-blue-500">
                      <SelectValue placeholder="Opcional" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#23272f] border-gray-600">
                      <SelectItem value="none">Opcional</SelectItem>
                      <SelectItem value="server1">Servidor 1</SelectItem>
                      <SelectItem value="server2">Servidor 2</SelectItem>
                      <SelectItem value="server3">Servidor 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-blue-400 text-xs">
                    Selecione os servidores que esse revenda pode ter acesso. Deixe em branco para permitir todos os servidores. Essa configuração afeta tanto a revenda quanto as subrevendas.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-white">Revenda Master</Label>
                    <Input
                      className="bg-[#23272f] border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      placeholder="Nome da revenda master"
                      value={newReseller.master_reseller}
                      onChange={(e) => setNewReseller({...newReseller, master_reseller: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-white">
                      Desativar login se não recarregar - em dias
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="border-gray-600 text-gray-400 hover:text-white"
                        onClick={() => setNewReseller({...newReseller, disable_login_days: Math.max(0, newReseller.disable_login_days - 1)})}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </Button>
                      <Input
                        type="number"
                        className="bg-[#23272f] border-gray-600 text-white text-center placeholder-gray-400 focus:border-blue-500"
                        placeholder="0"
                        value={newReseller.disable_login_days}
                        onChange={(e) => setNewReseller({...newReseller, disable_login_days: parseInt(e.target.value) || 0})}
                        min="0"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="border-gray-600 text-gray-400 hover:text-white"
                        onClick={() => setNewReseller({...newReseller, disable_login_days: newReseller.disable_login_days + 1})}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </Button>
                    </div>
                    <div className="text-blue-400 text-xs">Deixe 0 para desativar essa opção</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="monthlyReseller"
                      className="rounded border-gray-600 bg-[#23272f] text-blue-500 focus:ring-blue-500"
                      checked={newReseller.monthly_reseller}
                      onChange={(e) => setNewReseller({...newReseller, monthly_reseller: e.target.checked})}
                    />
                    <Label htmlFor="monthlyReseller" className="text-sm text-gray-300">
                      Configuração de Revenda Mensalista
                    </Label>
                  </div>
                  <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-3">
                    <div className="text-green-400 text-sm">
                      Apenas você pode visualizar os detalhes pessoais deste revenda.
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Informações Pessoais (Opcional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-white">Nome</Label>
                      <Input
                        className="bg-[#23272f] border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                        placeholder="Nome completo"
                        value={newReseller.personal_name}
                        onChange={(e) => setNewReseller({...newReseller, personal_name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-white">E-mail</Label>
                      <Input
                        type="email"
                        className="bg-[#23272f] border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                        placeholder="email@exemplo.com"
                        value={newReseller.email}
                        onChange={(e) => setNewReseller({...newReseller, email: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-white">Telegram</Label>
                      <Input
                        className="bg-[#23272f] border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                        placeholder="@usuario"
                        value={newReseller.telegram}
                        onChange={(e) => setNewReseller({...newReseller, telegram: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-white">WhatsApp</Label>
                      <Input
                        className="bg-[#23272f] border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                        placeholder="55 11 99999 3333"
                        value={newReseller.whatsapp}
                        onChange={(e) => setNewReseller({...newReseller, whatsapp: e.target.value})}
                      />
                      <div className="text-blue-400 text-xs">
                        Incluindo o código do país - com ou sem espaço e traços - ex. 55 11 99999 3333
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-white">Observações (Opcional)</Label>
                  <textarea
                    rows={4}
                    placeholder="Adicione observações sobre este revendedor..."
                    className="w-full bg-[#23272f] border border-gray-600 text-white rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none placeholder-gray-400 resize-none"
                    value={newReseller.observations}
                    onChange={(e) => setNewReseller({...newReseller, observations: e.target.value})}
                  />
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-600 text-gray-400 hover:text-white"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isAddingReseller}
                  >
                    {isAddingReseller ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Salvar
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700 text-xs text-gray-500">
                <span>2025© ALLEZCONECCT v3.50</span>
                <span>Powered by Sigma | Notificações</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Barra de pesquisa */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar revendedores..."
            className="pl-10 bg-[#1f2937] border-gray-700 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela de revendedores */}
      <Card className="bg-[#1f2937] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Lista de Revendedores</CardTitle>
          <CardDescription className="text-gray-400">
            {filteredResellers.length} revendedores encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-white">Usuário</TableHead>
                <TableHead className="text-white">Permissão</TableHead>
                <TableHead className="text-white">Créditos</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Criado em</TableHead>
                <TableHead className="text-white">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResellers.map((reseller) => (
                <TableRow key={reseller.id} className="border-gray-700">
                  <TableCell className="text-white">
                    <div>
                      <div className="font-medium">{reseller.username}</div>
                      {reseller.personal_name && (
                        <div className="text-sm text-gray-400">{reseller.personal_name}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPermissionColor(reseller.permission)}>
                      {reseller.permission}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white">{reseller.credits}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(reseller.status)}>
                      {reseller.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white">
                    {new Date(reseller.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openViewModal(reseller)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(reseller)}
                        className="text-green-400 hover:text-green-300"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteModal(reseller)}
                        className="text-red-400 hover:text-red-300"
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
        <DialogContent className="bg-[#1f2937] text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Revendedor</DialogTitle>
          </DialogHeader>
          {viewingReseller && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-400">Usuário</Label>
                  <p className="text-white">{viewingReseller.username}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-400">Permissão</Label>
                  <Badge className={getPermissionColor(viewingReseller.permission)}>
                    {viewingReseller.permission}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-400">Créditos</Label>
                  <p className="text-white">{viewingReseller.credits}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-400">Status</Label>
                  <Badge className={getStatusColor(viewingReseller.status)}>
                    {viewingReseller.status}
                  </Badge>
                </div>
              </div>
              {viewingReseller.personal_name && (
                <div>
                  <Label className="text-sm font-medium text-gray-400">Nome</Label>
                  <p className="text-white">{viewingReseller.personal_name}</p>
                </div>
              )}
              {viewingReseller.email && (
                <div>
                  <Label className="text-sm font-medium text-gray-400">E-mail</Label>
                  <p className="text-white">{viewingReseller.email}</p>
                </div>
              )}
              {viewingReseller.observations && (
                <div>
                  <Label className="text-sm font-medium text-gray-400">Observações</Label>
                  <p className="text-white">{viewingReseller.observations}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[#1f2937] text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Revendedor</DialogTitle>
          </DialogHeader>
          {editingReseller && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-white">Usuário</Label>
                  <Input
                    value={editingReseller.username}
                    onChange={(e) => setEditingReseller({...editingReseller, username: e.target.value})}
                    className="bg-[#23272f] border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-white">Permissão</Label>
                  <Select value={editingReseller.permission} onValueChange={(value) => setEditingReseller({...editingReseller, permission: value as any})}>
                    <SelectTrigger className="bg-[#23272f] border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#23272f] border-gray-600">
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="reseller">Revendedor</SelectItem>
                      <SelectItem value="subreseller">Sub-Revendedor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-white">Créditos</Label>
                  <Input
                    type="number"
                    value={editingReseller.credits}
                    onChange={(e) => setEditingReseller({...editingReseller, credits: parseInt(e.target.value) || 0})}
                    className="bg-[#23272f] border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-white">Nome</Label>
                  <Input
                    value={editingReseller.personal_name || ''}
                    onChange={(e) => setEditingReseller({...editingReseller, personal_name: e.target.value})}
                    className="bg-[#23272f] border-gray-600 text-white"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-white">E-mail</Label>
                <Input
                  type="email"
                  value={editingReseller.email || ''}
                  onChange={(e) => setEditingReseller({...editingReseller, email: e.target.value})}
                  className="bg-[#23272f] border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-white">Observações</Label>
                <textarea
                  value={editingReseller.observations || ''}
                  onChange={(e) => setEditingReseller({...editingReseller, observations: e.target.value})}
                  className="w-full bg-[#23272f] border border-gray-600 text-white rounded-md px-3 py-2"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditReseller}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#1f2937] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o revendedor "{deletingReseller?.username}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteReseller} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 