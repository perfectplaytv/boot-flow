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
import { useUsers } from "@/hooks/useUsers";
import type { User } from "@/hooks/useUsers";

export default function AdminUsers() {
  const { users, addUser, updateUser, deleteUser } = useUsers();

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    plan: "",
    status: "Ativo"
  });

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

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.plan) {
      addUser({
        name: newUser.name,
        email: newUser.email,
        plan: newUser.plan,
        status: newUser.status,
        createdAt: new Date().toISOString().split('T')[0]
      });
      setNewUser({ name: "", email: "", plan: "", status: "Ativo" });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditUser = () => {
    if (editingUser) {
      updateUser(editingUser.id, editingUser);
      setEditingUser(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteUser = () => {
    if (deletingUser) {
      deleteUser(deletingUser.id);
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

  // Função para extrair dados M3U
  const extractM3UData = async () => {
    if (!m3uUrl.trim()) {
      setExtractionError("Por favor, insira uma URL M3U válida.");
      return;
    }

    setIsExtracting(true);
    setExtractionError("");
    setExtractionResult(null);
    setExtractedUsers([]);
    setSelectedExtractedUser(null);

    try {
      // Verificar se a URL é HTTPS
      const url = new URL(m3uUrl);
      if (url.protocol === 'http:' && window.location.protocol === 'https:') {
        // Converter HTTP para HTTPS se possível
        url.protocol = 'https:';
        const httpsUrl = url.toString();
        
        try {
          const response = await fetch(httpsUrl);
          if (response.ok) {
            const content = await response.text();
            processM3UContent(content);
            return;
          }
        } catch (httpsError) {
          console.warn("HTTPS falhou, tentando proxy CORS:", httpsError);
        }
      }

      // Tentar com proxy CORS para evitar Mixed Content
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(m3uUrl)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
      }

      const content = await response.text();
      processM3UContent(content);

    } catch (error: any) {
      console.error("Erro na extração M3U:", error);
      
      // Mensagens de erro mais específicas
      if (error.message.includes('Failed to fetch')) {
        setExtractionError("Erro de conexão. Verifique se a URL é válida e acessível.");
      } else if (error.message.includes('Mixed Content')) {
        setExtractionError("URL HTTP não permitida em HTTPS. Use uma URL HTTPS válida.");
      } else {
        setExtractionError(error.message || "Erro ao processar arquivo M3U.");
      }
    } finally {
      setIsExtracting(false);
    }
  };

  // Função para processar conteúdo M3U
  const processM3UContent = (content: string) => {
    // Parsear conteúdo M3U
    const parsedData = parseM3UContent(content);
    
    if (parsedData.users.length === 0) {
      throw new Error("Nenhum usuário encontrado no arquivo M3U.");
    }

    setExtractedUsers(parsedData.users);
    
    if (parsedData.users.length === 1) {
      // Se só há um usuário, seleciona automaticamente
      setSelectedExtractedUser(parsedData.users[0]);
      applyExtractedData(parsedData.users[0]);
    } else {
      // Se há múltiplos usuários, mostra seleção
      setExtractionResult(parsedData);
    }
  };

  // Função para simular dados M3U (para testes)
  const simulateM3UData = () => {
    const mockM3UContent = `#EXTM3U
#EXTINF:-1 tvg-name="Cliente Teste" tvg-logo="" group-title="COMPLETO",Cliente Teste
http://exemplo.com/stream?username=teste123&password=senha456&expires=2024-12-31
#EXTINF:-1 tvg-name="Cliente Premium" tvg-logo="" group-title="PREMIUM",Cliente Premium
http://exemplo.com/stream?username=premium789&password=senha789&expires=2024-12-31`;

    try {
      processM3UContent(mockM3UContent);
    } catch (error: any) {
      setExtractionError(error.message);
    }
  };

  // Função para parsear conteúdo M3U
  const parseM3UContent = (content: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    const users: any[] = [];
    let currentUser: any = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('#EXTINF:')) {
        // Parsear informações do canal
        const channelInfo = parseChannelInfo(line);
        currentUser = { ...currentUser, ...channelInfo };
      } else if (line.startsWith('http')) {
        // Parsear URL do stream
        const streamInfo = parseStreamUrl(line);
        currentUser = { ...currentUser, ...streamInfo };
        
        // Se temos dados suficientes, adicionar usuário
        if (currentUser.username || currentUser.name) {
          users.push({ ...currentUser });
          currentUser = {};
        }
      }
    }

    return {
      users,
      totalUsers: users.length,
      fileType: content.includes('#EXTM3U') ? 'M3U' : 'M3U8'
    };
  };

  // Função para parsear informações do canal
  const parseChannelInfo = (line: string) => {
    const info: any = {};
    
    // Extrair nome do canal
    const nameMatch = line.match(/,(.+)$/);
    if (nameMatch) {
      info.name = nameMatch[1].trim();
    }

    // Extrair atributos
    const attributes = line.match(/[a-zA-Z-]+="[^"]*"/g);
    if (attributes) {
      attributes.forEach(attr => {
        const [key, value] = attr.split('=');
        const cleanValue = value.replace(/"/g, '');
        
        switch (key) {
          case 'tvg-name':
            info.channelName = cleanValue;
            break;
          case 'tvg-logo':
            info.logo = cleanValue;
            break;
          case 'group-title':
            info.bouquet = cleanValue;
            break;
        }
      });
    }

    return info;
  };

  // Função para parsear URL do stream
  const parseStreamUrl = (url: string) => {
    const info: any = {};
    
    try {
      const urlObj = new URL(url);
      
      // Extrair username e password da URL
      if (urlObj.username) {
        info.username = urlObj.username;
      }
      if (urlObj.password) {
        info.password = urlObj.password;
      }

      // Extrair parâmetros da URL
      const params = urlObj.searchParams;
      if (params.get('username')) {
        info.username = params.get('username');
      }
      if (params.get('password')) {
        info.password = params.get('password');
      }
      if (params.get('user')) {
        info.username = params.get('user');
      }
      if (params.get('pass')) {
        info.password = params.get('pass');
      }

      // Extrair informações adicionais
      if (params.get('expires')) {
        info.expires = params.get('expires');
      }
      if (params.get('token')) {
        info.token = params.get('token');
      }

    } catch (error) {
      console.warn("Erro ao parsear URL:", error);
    }

    return info;
  };

  // Função para aplicar dados extraídos ao formulário
  const applyExtractedData = (userData: any) => {
    setNewUser(prev => ({
      ...prev,
      name: userData.name || userData.channelName || userData.username || "",
      email: userData.email || "",
      plan: userData.bouquet || "Cliente",
      status: "Ativo"
    }));

    // Atualizar outros campos do formulário se necessário
    setExtractionResult({
      success: true,
      message: `Dados extraídos com sucesso: ${userData.name || userData.username}`,
      userData
    });
  };

  // Função para selecionar usuário extraído
  const selectExtractedUser = (user: any) => {
    setSelectedExtractedUser(user);
    applyExtractedData(user);
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
            <DialogHeader className="sr-only">
              <DialogTitle>Adicionar Cliente</DialogTitle>
              <DialogDescription>Preencha os dados do novo cliente para adicioná-lo à base de dados</DialogDescription>
            </DialogHeader>
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
                  <div className="flex gap-2">
                    <Button 
                      className="bg-green-600 text-white hover:bg-green-700 px-3 py-1 rounded text-xs"
                      onClick={simulateM3UData}
                      disabled={isExtracting}
                    >
                      Teste
                    </Button>
                    <Button 
                      className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-1 rounded text-sm"
                      onClick={extractM3UData}
                      disabled={isExtracting}
                    >
                      {isExtracting ? "Extraindo..." : "Extrair"}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-blue-300 mb-2">Serve para importar dados automaticamente a partir de uma URL.</p>
                <Input 
                  placeholder="Insira a URL do M3U para extrair automaticamente os dados do cliente..." 
                  className="bg-[#1f2937] border border-blue-800 text-white mb-2"
                  value={m3uUrl}
                  onChange={(e) => setM3uUrl(e.target.value)}
                />
                
                {/* Erro de extração */}
                {extractionError && (
                  <div className="bg-red-900/40 border border-red-700 text-red-300 text-xs rounded p-2 mb-2">
                    ❌ {extractionError}
                  </div>
                )}

                {/* Resultado da extração */}
                {extractionResult && !extractionError && (
                  <div className="bg-green-900/40 border border-green-700 text-green-300 text-xs rounded p-2 mb-2">
                    ✅ {extractionResult.message}
                  </div>
                )}

                {/* Seleção de usuários múltiplos */}
                {extractedUsers.length > 1 && (
                  <div className="bg-yellow-900/40 border border-yellow-700 text-yellow-300 text-xs rounded p-2 mb-2">
                    <div className="font-medium mb-1">Múltiplos usuários encontrados ({extractedUsers.length}):</div>
                    <select 
                      className="w-full bg-[#1f2937] border border-yellow-700 text-white rounded px-2 py-1 text-xs"
                      onChange={(e) => {
                        const selected = extractedUsers.find(u => u.username === e.target.value);
                        if (selected) selectExtractedUser(selected);
                      }}
                    >
                      <option value="">Selecione um usuário...</option>
                      {extractedUsers.map((user, index) => (
                        <option key={index} value={user.username}>
                          {user.name || user.channelName || user.username} 
                          {user.bouquet && ` (${user.bouquet})`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Resumo dos dados extraídos */}
                {selectedExtractedUser && (
                  <div className="bg-blue-900/40 border border-blue-700 text-blue-300 text-xs rounded p-2">
                    <div className="font-medium mb-1">Dados extraídos:</div>
                    <div className="space-y-1">
                      {selectedExtractedUser.name && <div>• Nome: {selectedExtractedUser.name}</div>}
                      {selectedExtractedUser.username && <div>• Usuário: {selectedExtractedUser.username}</div>}
                      {selectedExtractedUser.password && <div>• Senha: {selectedExtractedUser.password}</div>}
                      {selectedExtractedUser.bouquet && <div>• Bouquet: {selectedExtractedUser.bouquet}</div>}
                      {selectedExtractedUser.expires && <div>• Expira: {selectedExtractedUser.expires}</div>}
                    </div>
                  </div>
                )}
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
        <DialogContent className="bg-[#1f2937] text-white max-w-4xl w-full p-0 rounded-xl shadow-xl border border-gray-700">
          <div className="p-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-yellow-500" />
                <span className="text-lg font-semibold text-white">Editar Cliente</span>
                <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-semibold">Editar</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-[#1f2937] text-white border border-gray-700 px-3 py-1 rounded text-sm">Importar</Button>
                <Button variant="outline" className="bg-[#1f2937] text-white border border-gray-700 px-3 py-1 rounded text-sm">Modelo</Button>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-2">Modifique os dados do cliente para atualizar suas informações na base de dados</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-400 text-xs font-medium">• Campos obrigatórios marcados com *</span>
              <span className="text-blue-400 text-xs font-medium">• Dados serão sincronizados automaticamente</span>
            </div>
            
            {editingUser && (
              <>
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
                        <input 
                          value={editingUser.name}
                          onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                          placeholder="Usuário" 
                          className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2 pr-8" 
                        />
                        <span className="absolute right-2 text-gray-500 cursor-pointer">
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>
                            <polyline points="7 9 12 4 17 9"/>
                            <line x1="12" x2="12" y1="4" y2="16"/>
                          </svg>
                        </span>
                      </div>
                    </div>
                    {/* Senha */}
                    <div className="col-span-1">
                      <label className="block text-gray-300 mb-1 font-medium">Senha</label>
                      <div className="relative flex items-center">
                        <input type="password" placeholder="Nova senha" className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2 pr-8" />
                        <span className="absolute right-2 text-gray-500 cursor-pointer">
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>
                            <polyline points="7 9 12 4 17 9"/>
                            <line x1="12" x2="12" y1="4" y2="16"/>
                          </svg>
                        </span>
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
                      <input 
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                        placeholder="Opcional" 
                        className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2" 
                      />
                    </div>
                    {/* E-mail */}
                    <div className="col-span-1">
                      <label className="block text-gray-300 mb-1 font-medium">E-mail</label>
                      <input 
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                        placeholder="Opcional" 
                        className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2" 
                      />
                    </div>
                    {/* Telegram */}
                    <div className="col-span-1">
                      <label className="block text-gray-300 mb-1 font-medium">Telegram</label>
                      <input 
                        value={editingUser.telegram || ""}
                        onChange={(e) => setEditingUser({...editingUser, telegram: e.target.value})}
                        placeholder="Opcional" 
                        className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2" 
                      />
                    </div>
                    {/* WhatsApp */}
                    <div className="col-span-1">
                      <label className="block text-gray-300 mb-1 font-medium">WhatsApp</label>
                      <input 
                        value={editingUser.whatsapp || ""}
                        onChange={(e) => setEditingUser({...editingUser, whatsapp: e.target.value})}
                        placeholder="Opcional" 
                        className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2" 
                      />
                      <span className="text-xs text-gray-400 mt-1 block">Incluindo o código do país - com ou sem espaço e traços - ex. 55 11 99999 3333</span>
                    </div>
                    {/* Observações */}
                    <div className="col-span-2">
                      <label className="block text-gray-300 mb-1 font-medium">Observações</label>
                      <textarea 
                        value={editingUser.notes || ""}
                        onChange={(e) => setEditingUser({...editingUser, notes: e.target.value})}
                        placeholder="Opcional" 
                        className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2 min-h-[60px]" 
                      />
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
                      <select 
                        value={editingUser.status}
                        onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                        className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                      >
                        <option value="Ativo">Ativo</option>
                        <option value="Inativo">Inativo</option>
                        <option value="Pendente">Pendente</option>
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
                      <input 
                        type="number" 
                        min={1} 
                        value={editingUser.devices || 0}
                        onChange={(e) => setEditingUser({...editingUser, devices: parseInt(e.target.value) || 0})}
                        className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2" 
                      />
                    </div>
                    {/* Créditos */}
                    <div>
                      <label className="block text-gray-300 mb-1 font-medium">Créditos</label>
                      <div className="flex items-center gap-2">
                        <button type="button" className="bg-[#23272f] text-white px-2 py-1 rounded border border-gray-700">-</button>
                        <input 
                          type="number" 
                          min={0} 
                          value={editingUser.credits || 0}
                          onChange={(e) => setEditingUser({...editingUser, credits: parseInt(e.target.value) || 0})}
                          className="w-16 bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2" 
                        />
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
                    <textarea 
                      value={editingUser.notes || ""}
                      onChange={(e) => setEditingUser({...editingUser, notes: e.target.value})}
                      className="w-full bg-[#1f2937] border border-gray-700 text-white rounded p-2 min-h-[60px]" 
                      placeholder="Anotações..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="bg-gray-700 text-white px-6 py-2 rounded font-semibold">
                    Cancelar
                  </Button>
                  <Button onClick={handleEditUser} className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded font-semibold">
                    Salvar Alterações
                  </Button>
                </div>
              </>
            )}
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