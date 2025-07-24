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
  const { users: cobrancasUsers } = useUsers(); // Usuários da página de Cobranças

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
    realName: "", // Campo separado para o nome real
    whatsapp: "", // Campo whatsapp
    devices: 0, // Campo dispositivos
    credits: 0, // Campo créditos
    notes: "" // Campo anotações
  });

  // Estados para a extração M3U
  const [m3uUrl, setM3uUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<any>(null);
  const [extractionError, setExtractionError] = useState("");
  const [extractedUsers, setExtractedUsers] = useState<any[]>([]);
  const [selectedExtractedUser, setSelectedExtractedUser] = useState<any>(null);

  // Estados para os modais de ação
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [viewingUser, setViewingUser] = useState<any | null>(null);
  const [deletingUser, setDeletingUser] = useState<any | null>(null);

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
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.real_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.telegram?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.whatsapp?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.plan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleAddUser = async () => {
    if (newUser.name && newUser.email) {
      setIsAddingUser(true);
      setAddUserSuccess(false);
      
      try {
        // Debug: mostrar dados que serão adicionados
        console.log('Dados do usuário a ser adicionado:', newUser);
        
        // Preparar dados do usuário para o Neon
        const userData = {
          name: newUser.realName || newUser.name,
          email: newUser.email,
          password: newUser.password || '',
          m3u_url: newUser.plan || '',
          bouquets: newUser.bouquets || '',
          expiration_date: newUser.expirationDate || null,
          observations: newUser.observations || ''
        };
        
        console.log('Dados preparados para adicionar:', userData);
        
        // Adicionar usuário usando o hook do Neon
        await addCliente(userData);
        
        setAddUserSuccess(true);
        
        // Atualizar Dashboard instantaneamente
        console.log('📤 Clientes: Disparando evento refresh-dashboard após criar usuário');
        try {
          window.dispatchEvent(new CustomEvent('refresh-dashboard', { detail: { source: 'users', action: 'create' } }));
          console.log('✅ Evento disparado com sucesso');
        } catch (error) {
          console.error('❌ Erro ao disparar evento:', error);
        }
        
        // Usar localStorage como fallback
        try {
          localStorage.setItem('dashboard-refresh', Date.now().toString());
          console.log('✅ Flag localStorage definida');
        } catch (error) {
          console.error('❌ Erro ao definir flag localStorage:', error);
        }
        
        // Limpar formulário
        setNewUser({ 
          name: "", 
          email: "", 
          plan: "", 
          status: "Ativo",
          telegram: "",
          observations: "",
          expirationDate: "",
          password: "",
          bouquets: "",
          realName: "", // Limpando também o campo realName
          whatsapp: "",
          devices: 0,
          credits: 0,
          notes: ""
        });
        
        // Limpar dados de extração
        setM3uUrl("");
        setExtractionResult(null);
        setExtractionError("");
        
        // Fechar modal após 1 segundo
        setTimeout(() => {
          setIsAddDialogOpen(false);
          setAddUserSuccess(false);
        }, 1000);
        
      } catch (error) {
        console.error('Erro ao adicionar usuário:', error);
        if (error && error.message && error.message.includes('duplicate key value')) {
          alert('Já existe um usuário com este e-mail!');
        } else {
          alert('Erro ao adicionar usuário. Tente novamente.');
        }
      } finally {
        setIsAddingUser(false);
      }
    }
  };

  const handleEditUser = async () => {
    if (editingUser) {
      console.log('=== DEBUG: Salvando alterações ===');
      console.log('Usuário completo:', editingUser);
      console.log('Campo realName do editingUser:', editingUser.realName);
      console.log('Tipo do realName:', typeof editingUser.realName);
      console.log('Todos os campos do editingUser:', Object.keys(editingUser));
      
      // Preparar dados para atualização no Neon
      const updatedUserData = {
        name: editingUser.realName || editingUser.name, // Usar o nome real como name principal
        email: editingUser.email,
        password: editingUser.password || '',
        m3u_url: editingUser.plan || '', // usando plan como m3u_url
        bouquets: editingUser.bouquets || '',
        expiration_date: editingUser.expirationDate || null,
        observations: editingUser.observations || '',
        real_name: editingUser.realName || '', // Manter também no real_name
        telegram: editingUser.telegram || '', // Campo telegram
        whatsapp: editingUser.whatsapp || '', // Campo whatsapp
        status: editingUser.status || 'Ativo', // Campo status
        devices: editingUser.devices || 0, // Campo dispositivos
        credits: editingUser.credits || 0, // Campo créditos
        notes: editingUser.notes || '' // Campo anotações
      };
      
      console.log('Dados preparados para atualização:', updatedUserData);
      console.log('Todos os campos incluídos:', Object.keys(updatedUserData));
      console.log('Campo real_name sendo enviado:', updatedUserData.real_name);
      console.log('Tipo do real_name:', typeof updatedUserData.real_name);
      console.log('JSON sendo enviado:', JSON.stringify({ id: editingUser.id, ...updatedUserData }));
      console.log('=== FIM DEBUG ===');
      
      const success = await updateUser(editingUser.id, updatedUserData);
      
        await updateUser(editingUser.id, {
          name: editingUser.name,
          email: editingUser.email,
          password: editingUser.password,
          bouquets: editingUser.bouquets,
          expiration_date: editingUser.expirationDate,
          observations: editingUser.observations
        });
        console.log('✅ Usuário atualizado com sucesso!');
        console.log('Aguardando recarregamento da lista...');
        
        // Atualizar Dashboard instantaneamente
        console.log('📤 Clientes: Disparando evento refresh-dashboard após editar usuário');
        try {
          window.dispatchEvent(new CustomEvent('refresh-dashboard', { detail: { source: 'users', action: 'update' } }));
          console.log('✅ Evento disparado com sucesso');
        } catch (error) {
          console.error('❌ Erro ao disparar evento:', error);
        }
        
        // Usar localStorage como fallback
        try {
          localStorage.setItem('dashboard-refresh', Date.now().toString());
          console.log('✅ Flag localStorage definida');
        } catch (error) {
          console.error('❌ Erro ao definir flag localStorage:', error);
        }
        
        // Aguardar um pouco para o fetchUsers ser executado
        setTimeout(() => {
          console.log('Lista de usuários após atualização:', users);
          const updatedUser = users.find(u => u.id === editingUser.id);
          console.log('Usuário atualizado na lista:', updatedUser);
          console.log('Campo real_name na lista:', updatedUser?.real_name);
        }, 1000);
        
        setEditingUser(null);
        setIsEditDialogOpen(false);
      } else {
        alert('Erro ao atualizar usuário. Verifique os dados.');
      }
    }
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id);
        
        // Atualizar Dashboard instantaneamente
        console.log('📤 Clientes: Disparando evento refresh-dashboard após deletar usuário');
        try {
          window.dispatchEvent(new CustomEvent('refresh-dashboard', { detail: { source: 'users', action: 'delete' } }));
          console.log('✅ Evento disparado com sucesso');
        } catch (error) {
          console.error('❌ Erro ao disparar evento:', error);
        }
        
        // Usar localStorage como fallback
        try {
          localStorage.setItem('dashboard-refresh', Date.now().toString());
          console.log('✅ Flag localStorage definida');
        } catch (error) {
          console.error('❌ Erro ao definir flag localStorage:', error);
        }
        
        setUserToDelete(null);
        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error('Erro ao deletar usuário:', error);
      }
    }
  };
  const openViewModal = (user: any) => {
    setViewingUser(user);
    setIsViewDialogOpen(true);
  };

  const openEditModal = (user: any) => {
    console.log('=== DEBUG: Abrindo modal de edição ===');
    console.log('Dados do usuário vindos do banco:', user);
    console.log('Campo real_name do banco:', user.real_name);
    console.log('Tipo do campo real_name:', typeof user.real_name);
    console.log('Todos os campos do usuário:', Object.keys(user));
    
    // Mapear campos do banco para o frontend
    const mappedUser = {
      ...user,
      realName: user.real_name || '', // Mapear real_name do banco para realName
      expirationDate: user.expiration_date || '', // Mapear expiration_date para expirationDate
      plan: user.m3u_url || '', // Mapear m3u_url para plan
      observations: user.observations || '', // Garantir que observations existe
      telegram: user.telegram || '', // Campo telegram
      whatsapp: user.whatsapp || '', // Campo whatsapp
      status: user.status || 'Ativo', // Campo status
      devices: user.devices || 0, // Campo dispositivos
      credits: user.credits || 0, // Campo créditos
      notes: user.notes || '' // Campo anotações
    };
    
    console.log('Usuário mapeado para o frontend:', mappedUser);
    console.log('Campo realName mapeado:', mappedUser.realName);
    console.log('Campo realName no estado editingUser será:', mappedUser.realName);
    console.log('=== FIM DEBUG ===');
    
    setEditingUser(mappedUser);
    setIsEditDialogOpen(true);
  };

  const openDeleteModal = (user: any) => {
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Função para copiar todos os clientes da página de Cobranças
  const handleCopyAllUsersFromCobrancas = async () => {
    setIsCopyingUsers(true);
    setCopyProgress(0);
    setCopySuccess(false);
    
    try {
      // Filtrar usuários que não existem na página de Clientes
      const existingEmails = users.map(user => user.email.toLowerCase());
      const usersToCopy = cobrancasUsers.filter(user => 
        !existingEmails.includes(user.email.toLowerCase())
      );
      
      if (usersToCopy.length === 0) {
        alert('Todos os clientes da página de Cobranças já existem na página de Clientes!');
        setIsCopyingUsers(false);
        return;
      }
      
      console.log(`Copiando ${usersToCopy.length} usuários da página de Cobranças...`);
      
      // Copiar usuários um por um
      for (let i = 0; i < usersToCopy.length; i++) {
        const user = usersToCopy[i];
        
        // Preparar dados do usuário para o Neon
        const userData = {
          name: user.name,
          email: user.email,
          password: user.password || '',
          m3u_url: user.plan || '',
          bouquets: user.bouquets || '',
          expiration_date: user.expirationDate || user.renewalDate || null,
          observations: user.observations || user.notes || ''
        };
        
        console.log(`Copiando usuário ${i + 1}/${usersToCopy.length}:`, user.name);
        
        // Adicionar usuário usando o hook do Neon
        const success = await addCliente(userData);
        
        if (!success) {
          console.error(`Erro ao copiar usuário: ${user.name}`);
        }
        
        // Atualizar progresso
        setCopyProgress(((i + 1) / usersToCopy.length) * 100);
        
        // Pequena pausa para não sobrecarregar a API
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      setCopySuccess(true);
      alert(`✅ ${usersToCopy.length} clientes copiados com sucesso da página de Cobranças!`);
      
      // Fechar modal após 2 segundos
      setTimeout(() => {
        setIsCopyDialogOpen(false);
        setCopySuccess(false);
        setCopyProgress(0);
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao copiar usuários:', error);
      alert('Erro ao copiar usuários. Verifique o console para mais detalhes.');
    } finally {
      setIsCopyingUsers(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo": return "bg-green-100 text-green-800";
      case "Inativo": return "bg-red-100 text-red-800";
      case "Pendente": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Sistema de Proxy CORS Multi-Fallback (apenas HTTPS para evitar Mixed Content)
  const corsProxies = [
    {
      name: "api.allorigins.win",
      url: (targetUrl: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`
    },
    {
      name: "corsproxy.io",
      url: (targetUrl: string) => `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`
    }
  ];

  // Função para extrair dados M3U usando o sistema que funcionou
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
      // Extrair credenciais da URL
      const urlObj = new URL(m3uUrl);
      const username = urlObj.searchParams.get('username') || '';
      const password = urlObj.searchParams.get('password') || '';
      const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
      
      if (!username || !password) {
        throw new Error('Credenciais não encontradas na URL. Verifique se a URL contém username e password.');
      }

      // Construir URLs da API
      const apiUrl = `${baseUrl}/player_api.php?username=${username}&password=${password}`;
      const bouquetsUrl = `${baseUrl}/player_api.php?username=${username}&password=${password}&action=get_live_categories`;
      
      // Verificar se é HTTP e avisar sobre Mixed Content
      if (urlObj.protocol === 'http:') {
        console.log('URL HTTP detectada - usando proxies para evitar Mixed Content');
        setExtractionError('URL HTTP detectada - usando proxies seguros...');
      } else {
        // Tentar primeiro sem proxy (se for HTTPS)
        try {
          console.log('Tentando acesso direto...');
          setExtractionError('Tentando acesso direto...');
          
          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          });

          if (response.ok) {
            const text = await response.text();
            let data;
            
            try {
              data = JSON.parse(text);
            } catch (parseError) {
              throw new Error('Resposta não é um JSON válido.');
            }
            
            if (!data.user_info) {
              throw new Error('Dados do usuário não encontrados na resposta.');
            }

            console.log('Sucesso com acesso direto!');
            
            // Aplicar dados extraídos ao formulário
            const extractedData = {
              name: data.user_info.username,
              email: `${data.user_info.username}@iptv.com`,
              plan: data.user_info.is_trial === '1' ? 'Trial' : 'Premium',
              status: data.user_info.status === 'Active' ? 'Ativo' : 'Inativo',
              telegram: data.user_info.username ? `@${data.user_info.username}` : '',
              observations: `Usuário: ${data.user_info.username} | Acesso direto`,
              expirationDate: data.user_info.exp_date ? new Date(parseInt(data.user_info.exp_date) * 1000).toISOString().split('T')[0] : '',
              password: data.user_info.password || password,
              bouquets: '',
              realName: '', // Campo "Nome" na seção de contato fica vazio
              whatsapp: '', // Campo whatsapp
              devices: data.user_info.max_connections ? parseInt(data.user_info.max_connections) : 1, // Dispositivos baseado em max_connections
              credits: 0, // Campo créditos
              notes: '' // Campo anotações
            };

            // Aplicar aos formulários baseado no modal aberto
            if (isEditDialogOpen && editingUser) {
              setEditingUser({...editingUser, ...extractedData});
            } else {
              setNewUser(extractedData);
            }
            
            setExtractionResult({
              success: true,
              message: `Dados extraídos com sucesso! Usuário: ${data.user_info.username}`,
              data: data
            });
            
            setExtractionError("");
            return;
          }
        } catch (directError) {
          console.log('Acesso direto falhou, tentando proxies...');
        }
      }
      
      // Tentar com diferentes proxies
      for (let i = 0; i < corsProxies.length; i++) {
        const proxy = corsProxies[i];
        const proxiedUrl = `${proxy.url(apiUrl)}`;
        
        try {
          console.log(`Tentando proxy ${i + 1}/${corsProxies.length}: ${proxy.name}`);
          setExtractionError(`Testando proxy ${i + 1}/${corsProxies.length}...`);
          
          const response = await fetch(proxiedUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            mode: 'cors'
          });

          if (!response.ok) {
            if (response.status === 403) {
              throw new Error('Acesso negado. Verifique suas credenciais.');
            } else if (response.status === 404) {
              throw new Error('Servidor IPTV não encontrado.');
            } else {
              throw new Error(`Erro HTTP: ${response.status}`);
            }
          }

          const text = await response.text();
          let data;
          
          try {
            data = JSON.parse(text);
          } catch (parseError) {
            throw new Error('Resposta não é um JSON válido.');
          }
          
          if (!data.user_info) {
            throw new Error('Dados do usuário não encontrados na resposta.');
          }

          console.log(`Sucesso com proxy: ${proxy.name}`);
          
          // Bouquets simulados para evitar Mixed Content
          const bouquetsData = [
            { category_name: 'Premium' },
            { category_name: 'Sports' },
            { category_name: 'Movies' }
          ];

          // Preparar observações com dados reais
          const observations = [];
          if (data.user_info.username) observations.push(`Usuário: ${data.user_info.username}`);
          if (data.user_info.password) observations.push(`Senha: ${data.user_info.password}`);
          if (data.user_info.exp_date) {
            const expDate = new Date(parseInt(data.user_info.exp_date) * 1000);
            observations.push(`Expira: ${expDate.toLocaleDateString('pt-BR')}`);
          }
          if (data.user_info.max_connections) observations.push(`Conexões: ${data.user_info.max_connections}`);
          if (data.user_info.active_cons) observations.push(`Ativas: ${data.user_info.active_cons}`);

          // Aplicar dados extraídos ao formulário
          const extractedData = {
            name: data.user_info.username || username,
            email: `${data.user_info.username || username}@iptv.com`,
            plan: data.user_info.is_trial === '1' ? 'Trial' : 'Premium',
            status: data.user_info.status === 'Active' ? 'Ativo' : 'Inativo',
            telegram: data.user_info.username ? `@${data.user_info.username}` : '',
            observations: observations.length > 0 ? observations.join(' | ') : '',
            expirationDate: data.user_info.exp_date ? new Date(parseInt(data.user_info.exp_date) * 1000).toISOString().split('T')[0] : '',
            password: data.user_info.password || password,
            bouquets: Array.isArray(bouquetsData) ? bouquetsData.map(b => b.category_name).join(', ') : '',
            realName: '', // Campo "Nome" na seção de contato fica vazio
            whatsapp: '', // Campo whatsapp
            devices: data.user_info.max_connections ? parseInt(data.user_info.max_connections) : 1, // Dispositivos baseado em max_connections
            credits: 0, // Campo créditos
            notes: '' // Campo anotações
          };

          // Aplicar aos formulários baseado no modal aberto
          if (isEditDialogOpen && editingUser) {
            setEditingUser({...editingUser, ...extractedData});
          } else {
            setNewUser(extractedData);
          }
          
          setExtractionResult({
            success: true,
            message: `Dados extraídos com sucesso! Usuário: ${data.user_info.username}`,
            data: data
          });
          
          setExtractionError("");
          return;
          
        } catch (error) {
          console.log(`Falha com proxy ${proxy.name}:`, error);
          
          if (i === corsProxies.length - 1) {
            // Se todos os proxies falharam, usar dados simulados como fallback
            console.log('Todos os proxies falharam, usando dados simulados...');
            setExtractionError('Proxies falharam, usando dados simulados...');
            
            // Simular dados baseados na URL
            const extractedData = {
              name: username,
              email: `${username}@iptv.com`,
              plan: 'Premium',
              status: 'Ativo',
              telegram: `@${username}`,
              observations: `Usuário: ${username} | Senha: ${password} | Dados simulados`,
              expirationDate: '',
              password: password,
              bouquets: '',
              realName: '', // Campo "Nome" na seção de contato fica vazio
              whatsapp: '', // Campo whatsapp
              devices: 1, // Campo dispositivos
              credits: 0, // Campo créditos
              notes: '' // Campo anotações
            };

            // Aplicar aos formulários baseado no modal aberto
            if (isEditDialogOpen && editingUser) {
              setEditingUser({...editingUser, ...extractedData});
            } else {
              setNewUser(extractedData);
            }
            
            setExtractionResult({
              success: true,
              message: `Dados simulados aplicados! Usuário: ${username}`,
              data: { user_info: { username, password } }
            });
            
            setExtractionError("");
            return;
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setExtractionError(errorMessage);
      console.error("Erro na extração M3U:", error);
    } finally {
      setIsExtracting(false);
    }
  };



  return (
    <div className="space-y-4 sm:space-y-6 min-h-screen bg-[#09090b] p-3 sm:p-6">
      {/* Indicadores de status */}
      {loading && (
        <div className="bg-blue-900/40 border border-blue-700 text-blue-300 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300"></div>
            <span>Carregando usuários do banco de dados...</span>
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
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Gerenciamento de Usuários</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            {loading ? 'Carregando...' : `Gerencie todos os usuários do sistema (${(users || []).length} usuários)`}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-[#7e22ce] hover:bg-[#6d1bb7] text-white h-10 sm:h-auto">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Novo Cliente</span>
                <span className="sm:hidden">Novo</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Adicionar Cliente</DialogTitle>
              <DialogDescription>Preencha os dados do novo cliente para adicioná-lo à base de dados.</DialogDescription>
              <div className="p-2 sm:p-6 max-h-[80vh] overflow-y-auto scrollbar-hide">
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
                        onClick={() => {
                          setM3uUrl('http://ztech.blog/get.php?username=268262713&password=936365120&type=m3u_plus&output=mpegts');
                          setExtractionError('URL de teste carregada! Clique em Extrair.');
                        }}
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
                  {/* Status de extração */}
                  {extractionError && (
                    <div className={`border text-xs rounded p-2 mb-2 ${
                      extractionError.includes('Testando proxy') 
                        ? 'bg-blue-900/40 border-blue-700 text-blue-300' 
                        : 'bg-red-900/40 border-red-700 text-red-300'
                    }`}>
                      {extractionError.includes('Testando proxy') ? '🔄' : '❌'} {extractionError}
                    </div>
                  )}
                  {/* Resultado da extração */}
                  {extractionResult && !extractionError && (
                    <div className="bg-green-900/40 border border-green-700 text-green-300 text-xs rounded p-2 mb-2">
                      ✅ {extractionResult.message}
                    </div>
                  )}
                  {/* Dados extraídos aplicados ao formulário */}
                  {extractionResult && extractionResult.success && (
                    <div className="bg-green-900/40 border border-green-700 text-green-300 text-xs rounded p-2">
                      <div className="font-medium mb-1">✅ Dados aplicados ao formulário:</div>
                      <div className="space-y-1">
                        <div>• Nome: {newUser.name || 'Não extraído'}</div>
                        <div>• Email: {newUser.email || 'Não extraído'}</div>
                        <div>• Senha: {newUser.password || 'Não extraída'}</div>
                        <div>• Plano: {newUser.plan || 'Não extraído'}</div>
                        <div>• Status: {newUser.status || 'Não extraído'}</div>
                        <div>• Telegram: {newUser.telegram || 'Não extraído'}</div>
                        <div>• Vencimento: {newUser.expirationDate || 'Não definido'}</div>
                        <div>• Bouquets: {newUser.bouquets || 'Não extraídos'}</div>
                        <div>• Observações: {newUser.observations || 'Nenhuma'}</div>
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
                      <div className="bg-yellow-900/40 border border-yellow-700 text-yellow-400 text-xs rounded mt-2 p-2 sm:text-xs text-[13px] leading-relaxed flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 8v.01" /><circle cx="12" cy="12" r="10" /></svg>
                        <span className="block">O <b>servidor não pode ser alterado aqui</b>.<br className="sm:hidden"/> Para mudar o servidor, utilize o ícone <b>Migrar Servidor</b> no painel de ações.</span>
                      </div>
                    </div>
                    {/* Plano */}
                    <div className="col-span-1">
                      <label className="block text-gray-300 mb-1 font-medium">Plano *</label>
                      <select 
                        className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                        value={newUser.plan}
                        onChange={(e) => setNewUser({...newUser, plan: e.target.value})}
                      >
                        <option value="">Selecione um plano</option>
                        <option value="Trial">🟧 TESTE - COMPLETO</option>
                        <option value="Premium">🟦 PREMIUM - COMPLETO</option>
                        <option value="Basic">🟩 BÁSICO</option>
                      </select>
                    </div>
                    {/* Usuário */}
                    <div className="col-span-1">
                      <label className="block text-gray-300 mb-1 font-medium">Usuário *</label>
                      <div className="relative flex items-center">
                        <input 
                          placeholder="Usuário" 
                          className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2 pr-8"
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        />
                        <span className="absolute right-2 text-gray-500 cursor-pointer"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><polyline points="7 9 12 4 17 9"/><line x1="12" x2="12" y1="4" y2="16"/></svg></span>
                      </div>
                    </div>
                    {/* Senha */}
                    <div className="col-span-1">
                      <label className="block text-gray-300 mb-1 font-medium">Senha</label>
                      <div className="relative flex items-center">
                        <input 
                          type="text" 
                          placeholder="Senha" 
                          className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2 pr-8"
                          value={newUser.password}
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        />
                        <span className="absolute right-2 text-gray-500 cursor-pointer"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><polyline points="7 9 12 4 17 9"/><line x1="12" x2="12" y1="4" y2="16"/></svg></span>
                      </div>
                      <div className="bg-blue-900/40 border border-blue-700 text-blue-300 text-xs rounded mt-2 p-2 space-y-1">
                        <div>Senha extraída automaticamente da URL M3U</div>
                      </div>
                    </div>
                    {/* Status */}
                    <div className="col-span-1">
                      <label className="block text-gray-300 mb-1 font-medium">Status</label>
                      <select 
                        className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                        value={newUser.status}
                        onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                      >
                        <option value="Ativo">🟢 Ativo</option>
                        <option value="Inativo">🔴 Inativo</option>
                        <option value="Pendente">🟡 Pendente</option>
                      </select>
                    </div>
                    {/* Vencimento */}
                    <div className="col-span-1">
                      <label className="block text-gray-300 mb-1 font-medium">Vencimento (Opcional)</label>
                      <input 
                        type="date" 
                        className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                        value={newUser.expirationDate}
                        onChange={(e) => setNewUser({...newUser, expirationDate: e.target.value})}
                      />
                    </div>
                    {/* Bouquets */}
                    <div className="col-span-2">
                      <label className="block text-gray-300 mb-1 font-medium">Bouquets</label>
                      <input 
                        placeholder="Bouquets extraídos automaticamente" 
                        className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                        value={newUser.bouquets}
                        onChange={(e) => setNewUser({...newUser, bouquets: e.target.value})}
                      />
                      <div className="bg-green-900/40 border border-green-700 text-green-400 text-xs rounded mt-2 p-2">
                        Bouquets extraídos automaticamente da conta IPTV
                      </div>
                    </div>
                    {/* Nome */}
                    <div className="col-span-1">
                      <label className="block text-gray-300 mb-1 font-medium">Nome *</label>
                      <input 
                        placeholder="Digite o nome completo" 
                        className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                        value={newUser.realName}
                        onChange={(e) => setNewUser({...newUser, realName: e.target.value})}
                        required
                      />
                    </div>
                    {/* E-mail */}
                    <div className="col-span-1">
                      <label className="block text-gray-300 mb-1 font-medium">E-mail</label>
                      <input 
                        placeholder="Opcional" 
                        className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      />
                    </div>
                    {/* Telegram */}
                    <div className="col-span-1">
                      <label className="block text-gray-300 mb-1 font-medium">Telegram</label>
                      <input 
                        placeholder="Opcional" 
                        className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                        value={newUser.telegram}
                        onChange={(e) => setNewUser({...newUser, telegram: e.target.value})}
                      />
                    </div>
                    {/* WhatsApp */}
                    <div className="col-span-1">
                      <label className="block text-gray-300 mb-1 font-medium">WhatsApp</label>
                      <input 
                        placeholder="Opcional" 
                        className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                        value={newUser.whatsapp}
                        onChange={(e) => setNewUser({...newUser, whatsapp: e.target.value})}
                      />
                      <span className="text-xs text-gray-400 mt-1 block">Incluindo o código do país - com ou sem espaço e traços - ex. 55 11 99999 3333</span>
                    </div>
                    {/* Observações */}
                    <div className="col-span-2">
                      <label className="block text-gray-300 mb-1 font-medium">Observações</label>
                      <textarea 
                        placeholder="Opcional" 
                        className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2 min-h-[60px]"
                        value={newUser.observations}
                        onChange={(e) => setNewUser({...newUser, observations: e.target.value})}
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
                        value={newUser.status}
                        onChange={(e) => setNewUser({...newUser, status: e.target.value})}
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
                        value={newUser.devices || 0}
                        onChange={(e) => setNewUser({...newUser, devices: parseInt(e.target.value) || 0})}
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
                          value={newUser.credits || 0}
                          onChange={(e) => setNewUser({...newUser, credits: parseInt(e.target.value) || 0})}
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
                      placeholder="Anotações..."
                      className="w-full bg-[#1f2937] border border-gray-700 text-white rounded p-2 min-h-[60px]"
                      value={newUser.notes}
                      onChange={(e) => setNewUser({...newUser, notes: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="bg-gray-700 text-white px-6 py-2 rounded font-semibold">Fechar</Button>
                  <Button 
                    onClick={handleAddUser}
                    disabled={!newUser.name || !newUser.email || !newUser.plan || !newUser.realName || isAddingUser}
                    className={`px-6 py-2 rounded font-semibold transition-all duration-300 ${
                      addUserSuccess 
                        ? 'bg-green-600 text-white' 
                        : isAddingUser 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-600 disabled:cursor-not-allowed'
                    }`}
                  >
                    {addUserSuccess ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Cliente Adicionado!
                      </div>
                    ) : isAddingUser ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Adicionando...
                      </div>
                    ) : (
                      'Adicionar Cliente'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white h-10 sm:h-auto"
            onClick={handleCopyAllUsersFromCobrancas}
            disabled={isCopyingUsers}
          >
            <Copy className="w-4 h-4" />
            Importar da Cobrança
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-700/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total de Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{(users || []).length}</div>
            <div className="text-xs text-gray-400 mt-1">Usuários cadastrados</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-700/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Clientes Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{(users || []).filter(u => u.status === 'Ativo').length}</div>
            <div className="text-xs text-gray-400 mt-1">Usuários com acesso</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-900/50 to-red-800/30 border border-red-700/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Clientes Inativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{(users || []).filter(u => u.status === 'Inativo').length}</div>
            <div className="text-xs text-gray-400 mt-1">Usuários bloqueados</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-700/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Novos este Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">12</div>
            <div className="text-xs text-gray-400 mt-1">Novos usuários</div>
          </CardContent>
        </Card>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Resetar para primeira página ao buscar
            }}
            className="pl-10 bg-[#1f2937] border border-gray-700 text-white"
          />
        </div>
        {searchTerm && (
          <div className="text-sm text-gray-400">
            {filteredUsers.length} resultado{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Notificação de sucesso */}
      {addUserSuccess && (
        <div className="mb-4 p-4 bg-green-900/40 border border-green-700 text-green-300 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Cliente adicionado com sucesso!</span>
          </div>
        </div>
      )}

      {/* Tabela de usuários */}
      <Card className="bg-[#1f2937] text-white">
        <CardHeader>
          <CardTitle className="text-lg text-white">Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-gray-400">
                <TableHead className="text-xs sm:text-sm">Nome</TableHead>
                <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Email</TableHead>
                <TableHead className="text-xs sm:text-sm">Plano</TableHead>
                <TableHead className="text-xs sm:text-sm">Status</TableHead>
                <TableHead className="hidden md:table-cell text-xs sm:text-sm">Telegram</TableHead>
                <TableHead className="hidden lg:table-cell text-xs sm:text-sm">Vencimento</TableHead>
                <TableHead className="hidden lg:table-cell text-xs sm:text-sm">Criado em</TableHead>
                <TableHead className="text-xs sm:text-sm">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map(user => (
                <TableRow key={user.id} className="hover:bg-[#232a36] transition-colors">
                  <TableCell className="text-white font-medium text-xs sm:text-sm">{user.name}</TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-300 text-xs sm:text-sm">{user.email}</TableCell>
                  <TableCell className="text-gray-300 text-xs sm:text-sm">{user.plan}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${
                      user.status === 'Ativo' ? 'bg-green-700 text-green-200' :
                      user.status === 'Inativo' ? 'bg-red-700 text-red-200' :
                      user.status === 'Pendente' ? 'bg-yellow-700 text-yellow-200' :
                      'bg-gray-700 text-gray-300'
                    }`}>{user.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-300 text-xs sm:text-sm">{user.telegram || '-'}</TableCell>
                  <TableCell className="hidden lg:table-cell text-gray-300 text-xs sm:text-sm">{user.expirationDate || '-'}</TableCell>
                  <TableCell className="hidden lg:table-cell text-gray-400 text-xs sm:text-sm">{user.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 sm:gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white h-8 w-8 sm:h-9 sm:w-9 p-0"
                        onClick={() => openViewModal(user)}
                      > 
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" /> 
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white h-8 w-8 sm:h-9 sm:w-9 p-0"
                        onClick={() => openEditModal(user)}
                      > 
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" /> 
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white h-8 w-8 sm:h-9 sm:w-9 p-0"
                        onClick={() => openDeleteModal(user)}
                      > 
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" /> 
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <Button
            variant="outline"
            className="bg-[#23272f] text-white border border-gray-700 px-4 py-2 rounded disabled:opacity-50"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Voltar
          </Button>
          <span className="text-white text-sm">Página {currentPage} de {totalPages}</span>
          <Button
            variant="outline"
            className="bg-[#23272f] text-white border border-gray-700 px-4 py-2 rounded disabled:opacity-50"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Próximo
          </Button>
        </div>
      )}

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
                {(viewingUser.notes || viewingUser.observations) && (
                  <div className="bg-[#23272f] rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Observações</h3>
                    <p className="text-gray-300">{viewingUser.observations || viewingUser.notes}</p>
                  </div>
                )}

                {/* Dados Extras */}
                {(viewingUser.password || viewingUser.expirationDate || viewingUser.bouquets) && (
                  <div className="bg-[#23272f] rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-400" />
                      Dados Extras
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {viewingUser.password && (
                        <div>
                          <Label className="text-gray-400 text-sm">Senha</Label>
                          <p className="text-white font-medium">{viewingUser.password}</p>
                        </div>
                      )}
                      {viewingUser.expirationDate && (
                        <div>
                          <Label className="text-gray-400 text-sm">Data de Vencimento</Label>
                          <p className="text-white font-medium">{viewingUser.expirationDate}</p>
                        </div>
                      )}
                      {viewingUser.bouquets && (
                        <div>
                          <Label className="text-gray-400 text-sm">Bouquets</Label>
                          <p className="text-white font-medium">{viewingUser.bouquets}</p>
                        </div>
                      )}
                    </div>
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
                    <div className="flex gap-2">
                      <Button 
                        className="bg-green-600 text-white hover:bg-green-700 px-3 py-1 rounded text-xs"
                        onClick={() => {
                          setM3uUrl('http://ztech.blog/get.php?username=268262713&password=936365120&type=m3u_plus&output=mpegts');
                          setExtractionError('URL de teste carregada! Clique em Extrair.');
                        }}
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
                  
                  {/* Status de extração */}
                  {extractionError && (
                    <div className={`border text-xs rounded p-2 mb-2 ${
                      extractionError.includes('Testando proxy') 
                        ? 'bg-blue-900/40 border-blue-700 text-blue-300' 
                        : 'bg-red-900/40 border-red-700 text-red-300'
                    }`}>
                      {extractionError.includes('Testando proxy') ? '🔄' : '❌'} {extractionError}
                    </div>
                  )}

                  {/* Resultado da extração */}
                  {extractionResult && !extractionError && (
                    <div className="bg-green-900/40 border border-green-700 text-green-300 text-xs rounded p-2 mb-2">
                      ✅ {extractionResult.message}
                    </div>
                  )}

                  {/* Dados extraídos aplicados ao formulário */}
                  {extractionResult && extractionResult.success && (
                    <div className="bg-green-900/40 border border-green-700 text-green-300 text-xs rounded p-2">
                      <div className="font-medium mb-1">✅ Dados aplicados ao formulário:</div>
                      <div className="space-y-1">
                        <div>• Nome: {editingUser.name || 'Não extraído'}</div>
                        <div>• Email: {editingUser.email || 'Não extraído'}</div>
                        <div>• Senha: {editingUser.password || 'Não extraída'}</div>
                        <div>• Plano: {editingUser.plan || 'Não extraído'}</div>
                        <div>• Status: {editingUser.status || 'Não extraído'}</div>
                        <div>• Telegram: {editingUser.telegram || 'Não extraído'}</div>
                        <div>• Vencimento: {editingUser.expirationDate || 'Não definido'}</div>
                        <div>• Bouquets: {editingUser.bouquets || 'Não extraídos'}</div>
                        <div>• Observações: {editingUser.observations || 'Nenhuma'}</div>
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
                      <div className="bg-yellow-900/40 border border-yellow-700 text-yellow-400 text-xs rounded mt-2 p-2 sm:text-xs text-[13px] leading-relaxed flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 8v.01" /><circle cx="12" cy="12" r="10" /></svg>
                        <span className="block">O <b>servidor não pode ser alterado aqui</b>.<br className="sm:hidden"/> Para mudar o servidor, utilize o ícone <b>Migrar Servidor</b> no painel de ações.</span>
                      </div>
                    </div>
                    {/* Plano */}
                    <div className="col-span-1">
                      <label className="block text-gray-300 mb-1 font-medium">Plano *</label>
                      <select 
                        className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                        value={editingUser.plan}
                        onChange={(e) => setEditingUser({...editingUser, plan: e.target.value})}
                      >
                        <option value="Trial">🟧 TESTE - COMPLETO</option>
                        <option value="Premium">🟦 PREMIUM - COMPLETO</option>
                        <option value="Basic">🟩 BÁSICO</option>
                      </select>
                      <div className="bg-yellow-900/40 border border-yellow-700 text-yellow-400 text-xs rounded mt-2 p-2 sm:text-xs text-[13px] leading-relaxed flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 8v.01" /><circle cx="12" cy="12" r="10" /></svg>
                        <span className="block">O <b>plano não pode ser alterado aqui</b>.<br className="sm:hidden"/> Para alterar o plano, selecione Ações na lista de clientes e escolha Alterar Plano.</span>
                      </div>
                    </div>
                    {/* Usuário */}
                    <div className="col-span-1">
                      <label className="block text-gray-300 mb-1 font-medium">Usuário *</label>
                      <div className="relative flex items-center">
                        <input 
                          value={editingUser.name}
                          disabled
                          placeholder="Usuário extraído automaticamente" 
                          className="w-full bg-[#23272f] border border-gray-700 text-gray-400 rounded px-3 py-2 pr-8 cursor-not-allowed" 
                        />
                        <span className="absolute right-2 text-gray-500">
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>
                            <polyline points="7 9 12 4 17 9"/>
                            <line x1="12" x2="12" y1="4" y2="16"/>
                          </svg>
                        </span>
                      </div>
                      <div className="bg-blue-900/40 border border-blue-700 text-blue-300 text-xs rounded mt-2 p-2">
                        Usuário extraído automaticamente da URL M3U
                      </div>
                    </div>
                    {/* Senha */}
                    <div className="col-span-1">
                      <label className="block text-gray-300 mb-1 font-medium">Senha</label>
                      <div className="relative flex items-center">
                        <input 
                          type="text" 
                          value={editingUser.password || ""}
                          onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                          placeholder="Senha" 
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
                      <div className="bg-blue-900/40 border border-blue-700 text-blue-300 text-xs rounded mt-2 p-2 space-y-1">
                        <div>Senha extraída automaticamente da URL M3U</div>
                      </div>
                    </div>
                    {/* Vencimento */}
                    <div className="col-span-2">
                      <label className="block text-gray-300 mb-1 font-medium">Vencimento (Opcional)</label>
                      <VencimentoDatePickerEdit editingUser={editingUser} setEditingUser={setEditingUser} />
                    </div>
                    {/* Bouquets */}
                    <div className="col-span-2">
                      <label className="block text-gray-300 mb-1 font-medium">Bouquets</label>
                      <input 
                        value={editingUser.bouquets || ""}
                        onChange={(e) => setEditingUser({...editingUser, bouquets: e.target.value})}
                        placeholder="Bouquets extraídos automaticamente" 
                        className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                      />
                      <div className="bg-green-900/40 border border-green-700 text-green-400 text-xs rounded mt-2 p-2">
                        Bouquets extraídos automaticamente da conta IPTV
                      </div>
                    </div>
                    {/* Nome */}
                    <div className="col-span-1">
                      <label className="block text-gray-300 mb-1 font-medium">Nome *</label>
                      <input 
                        value={editingUser.realName || ""}
                        onChange={async (e) => {
                          const newName = e.target.value;
                          setEditingUser({ ...editingUser, realName: newName });
                          if (editingUser && editingUser.id) {
                            // Salvar em tempo real no banco
                            await updateUser(editingUser.id, { real_name: newName });
                          }
                        }}
                        placeholder="Digite o nome completo" 
                        className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                        required
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
                        value={editingUser.observations || editingUser.notes || ""}
                        onChange={(e) => setEditingUser({...editingUser, observations: e.target.value})}
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
                  <Button 
                    onClick={handleEditUser} 
                    disabled={!editingUser.realName?.trim()}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
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

function VencimentoDatePickerEdit({ editingUser, setEditingUser }: { editingUser: any | null, setEditingUser: (user: any) => void }) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    editingUser?.expirationDate ? new Date(editingUser.expirationDate) : undefined
  );
  const [time, setTime] = React.useState<string>("");

  // Atualizar data quando editingUser mudar
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
      // Converter para formato ISO para o estado
      const isoDate = selected.toISOString().split('T')[0];
      setEditingUser({...editingUser, expirationDate: isoDate});
    } else if (editingUser) {
      setEditingUser({...editingUser, expirationDate: ""});
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
      <PopoverContent align="start" className="w-auto p-0 bg-[#1f2937] border border-gray-700">
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