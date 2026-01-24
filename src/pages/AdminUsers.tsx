import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  User,
  Mail,
  Calendar,
  Shield,
  Activity,
  CheckCircle,
  Copy,
  DollarSign,
} from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import React from "react";
import { useClientes, Cliente } from "@/hooks/useClientes";
import { useUsers } from "@/hooks/useUsers";
import { RLSErrorBanner } from "@/components/RLSErrorBanner";
import { useAuth } from '@/contexts/AuthContext';

export default function AdminUsers() {
  const { user } = useAuth();

  // Mostrar dados reais somente após ação vinda da página de Revendas para usuários tipo 'reseller'
  const [showRealData, setShowRealData] = useState(false);
  useEffect(() => {
    try {
      const flag = localStorage.getItem('dashboard-refresh') || localStorage.getItem('reseller-created');
      if (flag) setShowRealData(true);
    } catch (err) {
      // ignore
    }

    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ source: string }>;
      try {
        const source = customEvent.detail?.source;
        if (source === 'resellers') setShowRealData(true);
      } catch (err) {
        // ignore
      }
    };

    window.addEventListener('refresh-dashboard', handler as EventListener);
    return () => window.removeEventListener('refresh-dashboard', handler as EventListener);
  }, []);

  const shouldShow = ((user as unknown as { user_metadata: { role: string } })?.user_metadata?.role === 'reseller') ? showRealData : true;
  const {
    clientes: users,
    loading,
    error,
    addCliente,
    updateCliente: updateUser,
    deleteCliente: deleteUser,
    clearError,
    fetchClientes,
  } = useClientes();
  const { users: cobrancasUsers } = useUsers(); // Usuários da página de Cobranças

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    plan: "",
    price: "",
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
    notes: "", // Campo anotações
    server: "", // Campo servidor
    m3u_url: "", // Campo URL M3U
  });

  // Estados para a extração M3U (renomeado input label para Extração M3U)
  const [m3uUrl, setM3uUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<{ success: boolean; message: string; data: unknown } | null>(null);
  const [extractionError, setExtractionError] = useState("");
  const [extractedUsers, setExtractedUsers] = useState<unknown[]>([]);
  const [selectedExtractedUser, setSelectedExtractedUser] = useState<unknown | null>(null);

  // Estados para os modais de ação
  const [editingUser, setEditingUser] = useState<Partial<Cliente> | null>(null);
  const [viewingUser, setViewingUser] = useState<Cliente | null>(null);
  const [deletingUser, setDeletingUser] = useState<Cliente | null>(null);
  const [pagoUser, setPagoUser] = useState<Cliente | null>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPagoDialogOpen, setIsPagoDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [addUserSuccess, setAddUserSuccess] = useState(false);

  // Estados para copiar clientes da página de Cobranças
  const [isCopyingUsers, setIsCopyingUsers] = useState(false);
  const [copyProgress, setCopyProgress] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const itemsPerPage = 10;
  const usersSafe = users || [];
  const filteredUsers = usersSafe.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.real_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.telegram?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.whatsapp?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.plan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Função para retornar os preços baseados no plano selecionado
  const getPlanPrices = (plan: string): string[] => {
    const prices: { [key: string]: string[] } = {
      "Mensal": ["30,00", "35,00", "40,00", "50,00"],
      "Bimestral": ["50,00", "60,00", "70,00"],
      "Trimestral": ["75,00", "90,00", "100,00"],
      "Semestral": ["150,00", "160,00", "170,00"],
      "Anual": ["130,00", "180,00", "200,00", "250,00", "280,00"],
    };
    return prices[plan] || [];
  };

  const handleAddUser = async () => {
    console.log("🔵 [DEBUG] handleAddUser chamado");
    console.log("🔵 [DEBUG] Estado newUser:", newUser);

    // Validação completa dos campos obrigatórios
    if (!newUser.name || !newUser.email || !newUser.plan) {
      console.log("❌ [DEBUG] Validação falhou: campos obrigatórios não preenchidos");
      alert("Por favor, preencha todos os campos obrigatórios: Usuário, Email e Plano.");
      return;
    }

    // Validar data de vencimento
    if (!newUser.expirationDate) {
      console.log("❌ [DEBUG] Validação falhou: data de vencimento não preenchida");
      alert("Por favor, preencha a data de vencimento.");
      return;
    }

    console.log("✅ [DEBUG] Validação passou, iniciando processo...");
    setIsAddingUser(true);
    setAddUserSuccess(false);

    // Timeout de segurança para evitar travamento infinito (30 segundos)
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    timeoutId = setTimeout(() => {
      console.error("⏰ [DEBUG] Timeout: processo demorou mais de 30 segundos");
      setIsAddingUser(false);
      alert("⏰ O processo está demorando muito. Verifique sua conexão e tente novamente.");
    }, 30000);

    try {
      // Debug: mostrar dados que serão adicionados
      console.log("📤 [DEBUG] Dados do usuário a ser adicionado:", newUser);

      // Calcular data de expiração padrão (30 dias a partir de hoje) se não fornecida
      const defaultExpirationDate = new Date();
      defaultExpirationDate.setDate(defaultExpirationDate.getDate() + 30);
      const defaultExpDateStr = defaultExpirationDate.toISOString().split('T')[0];

      // Preparar dados do usuário para o backend (snake_case)
      const userData = {
        name: newUser.realName || newUser.name,
        email: newUser.email,
        plan: newUser.plan || "Mensal", // Campo obrigatório com fallback
        status: newUser.status || "Ativo", // Campo obrigatório com default
        expiration_date: newUser.expirationDate || defaultExpDateStr, // Fallback para 30 dias
        password: newUser.password || "",
        m3u_url: newUser.m3u_url || "",
        bouquets: newUser.bouquets || "",
        observations: newUser.observations || "",
        real_name: newUser.realName || "",
        telegram: newUser.telegram || "",
        whatsapp: newUser.whatsapp || "",
        devices: newUser.devices || 0,
        credits: newUser.credits || 0,
        notes: newUser.notes || "",
        server: newUser.server || "",
      };

      console.log("📤 [DEBUG] Dados preparados para adicionar:", userData);

      // Adicionar usuário usando o hook
      console.log("🔄 [DEBUG] Chamando addCliente...");
      const success = await addCliente(userData);
      console.log("🔄 [DEBUG] addCliente retornou:", success);

      // Verificar se a operação foi bem-sucedida
      if (!success) {
        console.error("❌ [DEBUG] addCliente retornou false");
        // Se addCliente retornou false, verificar se há erro no hook
        const backendError = error || "Erro desconhecido do servidor";
        console.error("❌ [DEBUG] Erro do backend:", backendError);
        alert(`❌ Erro ao adicionar cliente:\n${backendError}`);
        throw new Error(backendError);
      }

      console.log("✅ [DEBUG] Cliente adicionado com sucesso!");
      setAddUserSuccess(true);

      // Cancelar timeout de segurança já que a operação foi bem-sucedida
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Atualizar Dashboard instantaneamente
      console.log(
        "📤 Clientes: Disparando evento refresh-dashboard após criar usuário"
      );
      try {
        window.dispatchEvent(
          new CustomEvent("refresh-dashboard", {
            detail: { source: "users", action: "create" },
          })
        );
        console.log("✅ Evento disparado com sucesso");
      } catch (error) {
        console.error("❌ Erro ao disparar evento:", error);
      }

      // Usar localStorage como fallback
      try {
        localStorage.setItem("dashboard-refresh", Date.now().toString());
        console.log("✅ Flag localStorage definida");
      } catch (error) {
        console.error("❌ Erro ao definir flag localStorage:", error);
      }

      // Limpar formulário
      setNewUser({
        name: "",
        email: "",
        plan: "",
        price: "",
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
        notes: "",
        server: "",
        m3u_url: "",
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
    } catch (error: unknown) {
      console.error("❌ [DEBUG] Erro ao adicionar usuário:", error);

      // Cancelar timeout de segurança já que houve erro
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao adicionar usuário.";

      // Mensagens específicas para diferentes tipos de erro
      if (errorMessage.includes("duplicate key value") || errorMessage.includes("unique constraint")) {
        alert("❌ Já existe um usuário com este e-mail!");
      } else if (errorMessage.includes("row-level security") || errorMessage.includes("RLS")) {
        alert("❌ Erro de permissão: Verifique se você está autenticado e se as políticas RLS estão configuradas corretamente.");
      } else if (errorMessage.includes("autenticação") || errorMessage.includes("sessão expirou")) {
        alert("❌ Sua sessão expirou. Por favor, faça login novamente.");
      } else if (errorMessage.includes("NOT NULL") || errorMessage.includes("null value")) {
        alert("❌ Erro: Alguns campos obrigatórios não foram preenchidos corretamente.");
      } else {
        alert(`❌ Erro ao adicionar usuário: ${errorMessage}`);
      }
    } finally {
      console.log("🔄 [DEBUG] Finalizando processo (finally)...");
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setIsAddingUser(false);
    }
  };

  const handleEditUser = async () => {
    if (!editingUser) {
      alert("Erro: Nenhum cliente selecionado para editar.");
      return;
    }

    // Validação básica
    if (!editingUser.realName?.trim() && !editingUser.name?.trim()) {
      alert("Por favor, preencha o nome do cliente.");
      return;
    }

    console.log("=== DEBUG: Salvando alterações ===");
    console.log("Usuário completo:", editingUser);
    console.log("Campo realName do editingUser:", editingUser.realName);
    console.log("Tipo do realName:", typeof editingUser.realName);
    console.log("Todos os campos do editingUser:", Object.keys(editingUser));

    // Preparar dados para atualização no Neon
    const updatedUserData = {
      name: editingUser.realName || editingUser.name, // Usar o nome real como name principal
      email: editingUser.email,
      password: editingUser.password || "",
      plan: editingUser.plan || "", // Campo plan
      server: editingUser.server || "", // Campo server
      m3u_url: editingUser.m3u_url || "", // Campo m3u_url separado
      bouquets: editingUser.bouquets || "",
      expiration_date: editingUser.expirationDate || null,
      observations: editingUser.observations || "",
      real_name: editingUser.realName || "", // Manter também no real_name
      telegram: editingUser.telegram || "", // Campo telegram
      whatsapp: editingUser.whatsapp || "", // Campo whatsapp
      status: editingUser.status || "Ativo", // Campo status
      devices: editingUser.devices || 0, // Campo dispositivos
      credits: editingUser.credits || 0, // Campo créditos
      notes: editingUser.notes || "", // Campo anotações
      pago: editingUser.pago || false, // Campo pago
    };

    console.log("Dados preparados para atualização:", updatedUserData);
    console.log("Todos os campos incluídos:", Object.keys(updatedUserData));
    console.log("Campo real_name sendo enviado:", updatedUserData.real_name);
    console.log("Tipo do real_name:", typeof updatedUserData.real_name);
    console.log(
      "JSON sendo enviado:",
      JSON.stringify({ id: editingUser.id, ...updatedUserData })
    );
    console.log("=== FIM DEBUG ===");

    const success = await updateUser(editingUser.id, updatedUserData);

    if (success) {
      console.log("✅ Usuário atualizado com sucesso!");
      console.log("Aguardando recarregamento da lista...");

      // Atualizar Dashboard instantaneamente
      console.log(
        "📤 Clientes: Disparando evento refresh-dashboard após editar usuário"
      );
      try {
        window.dispatchEvent(
          new CustomEvent("refresh-dashboard", {
            detail: { source: "users", action: "update" },
          })
        );
        console.log("✅ Evento disparado com sucesso");
      } catch (error) {
        console.error("❌ Erro ao disparar evento:", error);
      }

      // Usar localStorage como fallback
      try {
        localStorage.setItem("dashboard-refresh", Date.now().toString());
        console.log("✅ Flag localStorage definida");
      } catch (error) {
        console.error("❌ Erro ao definir flag localStorage:", error);
      }

      // Aguardar um pouco para o fetchUsers ser executado
      setTimeout(() => {
        console.log("Lista de usuários após atualização:", users);
        const updatedUser = users.find((u) => u.id === editingUser.id);
        console.log("Usuário atualizado na lista:", updatedUser);
        console.log("Campo real_name na lista:", updatedUser?.real_name);
      }, 1000);

      setEditingUser(null);
      setIsEditDialogOpen(false);
      alert("Cliente atualizado com sucesso!");
    } else {
      alert("Erro ao atualizar cliente. Verifique os dados.");
    }
  };

  const handleDeleteUser = async () => {
    if (deletingUser) {
      console.log("🔄 [AdminUsers] Iniciando exclusão do usuário:", deletingUser.id);

      const success = await deleteUser(deletingUser.id);

      if (success) {
        console.log("✅ [AdminUsers] Usuário deletado com sucesso do Supabase");

        // Atualizar Dashboard instantaneamente
        console.log(
          "📤 [AdminUsers] Disparando evento refresh-dashboard após deletar usuário"
        );
        try {
          window.dispatchEvent(
            new CustomEvent("refresh-dashboard", {
              detail: { source: "users", action: "delete", userId: deletingUser.id },
            })
          );
          console.log("✅ [AdminUsers] Evento refresh-dashboard disparado com sucesso");
        } catch (error) {
          console.error("❌ [AdminUsers] Erro ao disparar evento:", error);
        }

        // Usar localStorage como fallback
        try {
          localStorage.setItem("dashboard-refresh", Date.now().toString());
          console.log("✅ [AdminUsers] Flag localStorage definida");
        } catch (error) {
          console.error("❌ [AdminUsers] Erro ao definir flag localStorage:", error);
        }

        // Forçar atualização da lista local removendo o usuário deletado
        console.log("🔄 [AdminUsers] Atualizando lista local de usuários");

        // Fechar modal
        setDeletingUser(null);
        setIsDeleteDialogOpen(false);

        // Mostrar mensagem de sucesso
        alert("✅ Cliente excluído com sucesso!");

        console.log("✅ [AdminUsers] Processo de exclusão concluído");
      } else {
        const errorMsg = error || "Erro ao deletar usuário. Verifique se você tem permissão no Supabase ou se há policies bloqueando a exclusão.";
        console.error("❌ [AdminUsers] Erro ao deletar usuário:", errorMsg);
        alert(`❌ ${errorMsg}`);
      }
    }
  };

  // Bulk delete functions
  const toggleSelectUser = (userId: number) => {
    setSelectedUserIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedUserIds.size === filteredUsers.length) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(filteredUsers.map(u => u.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUserIds.size === 0) return;

    setIsBulkDeleting(true);
    let successCount = 0;
    let failCount = 0;

    for (const userId of selectedUserIds) {
      try {
        const success = await deleteUser(userId);
        if (success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (e) {
        failCount++;
      }
    }

    setIsBulkDeleting(false);
    setIsBulkDeleteDialogOpen(false);
    setSelectedUserIds(new Set());

    if (successCount > 0) {
      window.dispatchEvent(
        new CustomEvent("refresh-dashboard", {
          detail: { source: "users", action: "bulk-delete" },
        })
      );
    }

    alert(`✅ ${successCount} usuário(s) excluído(s) com sucesso!${failCount > 0 ? ` ❌ ${failCount} falha(s).` : ''}`);
  };

  const openViewModal = (user: Cliente) => {
    setViewingUser(user);
    setIsViewDialogOpen(true);
  };

  const openEditModal = (user: Cliente) => {
    console.log("=== DEBUG: Abrindo modal de edição ===");
    console.log("Dados do usuário vindos do banco:", user);
    console.log("Campo real_name do banco:", user.real_name);
    console.log("Tipo do campo real_name:", typeof user.real_name);
    console.log("Todos os campos do usuário:", Object.keys(user));

    // Mapear campos do banco para o frontend
    const mappedUser = {
      ...user,
      realName: user.real_name || user.name || "", // Mapear real_name do banco para realName
      expirationDate: user.expiration_date || "", // Mapear expiration_date para expirationDate
      plan: user.plan || "", // Mapear plan corretamente
      price: user.price || "", // Campo price
      server: user.server || "", // Campo server
      m3u_url: user.m3u_url || "", // Campo m3u_url separado
      observations: user.observations || "", // Garantir que observations existe
      telegram: user.telegram || "", // Campo telegram
      whatsapp: user.whatsapp || "", // Campo whatsapp
      status: user.status || "Ativo", // Campo status
      devices: user.devices || 0, // Campo dispositivos
      credits: user.credits || 0, // Campo créditos
      notes: user.notes || "", // Campo anotações
      pago: user.pago || false, // Campo pago
    };

    console.log("Usuário mapeado para o frontend:", mappedUser);
    console.log("Campo realName mapeado:", mappedUser.realName);
    console.log(
      "Campo realName no estado editingUser será:",
      mappedUser.realName
    );
    console.log("=== FIM DEBUG ===");

    setEditingUser(mappedUser);
    setIsEditDialogOpen(true);
  };

  const openDeleteModal = (user: Cliente) => {
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
  };

  const openPagoModal = (user: Cliente) => {
    setPagoUser(user);
    setIsPagoDialogOpen(true);
  };

  const confirmTogglePago = async () => {
    if (!pagoUser) return;

    try {
      const newPagoStatus = !pagoUser.pago;
      console.log(`🔄 [AdminUsers] Marcando cliente ${pagoUser.id} como ${newPagoStatus ? 'Pago' : 'Não Pago'}`);
      console.log(`🔄 [AdminUsers] Dados do cliente:`, {
        id: pagoUser.id,
        name: pagoUser.name,
        pagoAtual: pagoUser.pago,
        pagoNovo: newPagoStatus,
        tipoPagoAtual: typeof pagoUser.pago,
        tipoPagoNovo: typeof newPagoStatus
      });

      // Garantir que o valor seja boolean
      const pagoValue = Boolean(newPagoStatus);
      console.log(`🔄 [AdminUsers] Valor boolean garantido:`, pagoValue);

      const success = await updateUser(pagoUser.id, { pago: pagoValue });

      if (success) {
        console.log(`✅ [AdminUsers] Cliente ${pagoUser.name} marcado como ${newPagoStatus ? 'Pago' : 'Não Pago'}`);

        // Fechar o modal
        setIsPagoDialogOpen(false);
        const userInfo = { ...pagoUser, pago: newPagoStatus };
        setPagoUser(null);

        // Disparar evento IMEDIATAMENTE para atualizar o dashboard
        console.log('📤 [AdminUsers] Disparando evento refresh-dashboard IMEDIATAMENTE');
        try {
          window.dispatchEvent(
            new CustomEvent("refresh-dashboard", {
              detail: {
                source: "users",
                action: "update",
                field: "pago",
                userId: userInfo.id,
                pago: newPagoStatus,
                price: userInfo.price,
                forceRefresh: true
              },
            })
          );
          console.log("✅ [AdminUsers] Evento refresh-dashboard disparado");
        } catch (error) {
          console.error("❌ [AdminUsers] Erro ao disparar evento:", error);
        }

        // Usar localStorage como fallback
        try {
          localStorage.setItem("dashboard-refresh", Date.now().toString());
        } catch (error) {
          console.error("❌ [AdminUsers] Erro ao definir flag localStorage:", error);
        }

        // Forçar atualização da lista após delay para garantir sincronização
        if (fetchClientes) {
          setTimeout(async () => {
            console.log('🔄 [AdminUsers] Forçando atualização da lista após delay...');
            await fetchClientes();

            // Disparar eventos adicionais para garantir atualização do dashboard
            setTimeout(() => {
              window.dispatchEvent(
                new CustomEvent("refresh-dashboard", {
                  detail: {
                    source: "users",
                    action: "update",
                    field: "pago",
                    forceRefresh: true
                  },
                })
              );

              // Última tentativa de atualização
              if (fetchClientes) {
                fetchClientes();
              }
            }, 1000);
          }, 300);
        }
      } else {
        // Mostrar erro mais detalhado
        const errorMessage = error || 'Erro desconhecido ao atualizar status de pagamento.';
        console.error('❌ [AdminUsers] Erro ao atualizar:', errorMessage);
        alert(`Erro ao atualizar status de pagamento.\n\nDetalhes: ${errorMessage}\n\nVerifique:\n- Se a coluna 'pago' existe na tabela 'users'\n- Se você tem permissão para atualizar\n- Se está conectado à internet`);
      }
    } catch (error: unknown) {
      console.error('❌ [AdminUsers] Erro ao atualizar status de pagamento:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      alert(`Erro ao atualizar status de pagamento.\n\nErro: ${errorMessage}\n\nVerifique o console para mais detalhes.`);
    }
  };

  // Função para copiar todos os clientes da página de Cobranças
  const handleCopyAllUsersFromCobrancas = async () => {
    setIsCopyingUsers(true);
    setCopyProgress(0);
    setCopySuccess(false);

    try {
      // Filtrar usuários que não existem na página de Clientes
      const existingEmails = users.map((user) => user.email.toLowerCase());
      const usersToCopy = cobrancasUsers.filter(
        (user) => !existingEmails.includes(user.email.toLowerCase())
      );

      if (usersToCopy.length === 0) {
        alert(
          "Todos os clientes da página de Cobranças já existem na página de Clientes!"
        );
        setIsCopyingUsers(false);
        return;
      }

      console.log(
        `Copiando ${usersToCopy.length} usuários da página de Cobranças...`
      );

      // Copiar usuários um por um
      for (let i = 0; i < usersToCopy.length; i++) {
        const user = usersToCopy[i];

        // Preparar dados do usuário para o Neon
        const userData = {
          name: user.name,
          email: user.email,
          password: user.password || "",
          m3u_url: user.plan || "",
          bouquets: user.bouquets || "",
          expiration_date: (user as unknown as { expirationDate?: string }).expirationDate || (user as unknown as { renewalDate?: string }).renewalDate || null,
          observations: user.observations || (user as unknown as { notes?: string }).notes || "",
        };

        console.log(
          `Copiando usuário ${i + 1}/${usersToCopy.length}:`,
          user.name
        );

        // Adicionar usuário usando o hook do Neon
        const success = await addCliente(userData);

        if (!success) {
          console.error(`Erro ao copiar usuário: ${user.name}`);
        }

        // Atualizar progresso
        setCopyProgress(((i + 1) / usersToCopy.length) * 100);

        // Pequena pausa para não sobrecarregar a API
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      setCopySuccess(true);
      alert(
        `✅ ${usersToCopy.length} clientes copiados com sucesso da página de Cobranças!`
      );

      // Fechar modal após 2 segundos
      setTimeout(() => {
        setIsCopyingUsers(false);
        setCopySuccess(false);
        setCopyProgress(0);
      }, 2000);
    } catch (error) {
      console.error("Erro ao copiar usuários:", error);
      alert("Erro ao copiar usuários. Verifique o console para mais detalhes.");
    } finally {
      setIsCopyingUsers(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800";
      case "Inativo":
        return "bg-red-100 text-red-800";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Função para extrair dados M3U usando o proxy local
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
      const username = urlObj.searchParams.get("username") || "";
      const password = urlObj.searchParams.get("password") || "";
      const baseUrl = `${urlObj.protocol}//${urlObj.host}`;

      if (!username || !password) {
        throw new Error(
          "Credenciais não encontradas na URL. Verifique se a URL contém username e password."
        );
      }

      // Construir URLs da API
      const apiUrl = `${baseUrl}/player_api.php?username=${username}&password=${password}`;

      console.log("Tentando acessar via proxy local...");
      setExtractionError("Acessando...");

      const proxyUrl = `/api/proxy?url=${encodeURIComponent(apiUrl)}`;

      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(`Erro ao acessar proxy: ${response.status}`);
      }

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Resposta inválida (não é JSON).");
      }

      if (!data.user_info) {
        throw new Error("Dados do usuário não encontrados na resposta.");
      }

      console.log("Sucesso via proxy local!");

      // Aplicar dados extraídos ao formulário
      const extractedData = {
        name: data.user_info.username,
        email: `${data.user_info.username}@iptv.com`,
        plan: data.user_info.is_trial === "1" ? "Trial" : "Premium",
        price: "",
        status: data.user_info.status === "Active" ? "Ativo" : "Inativo",
        telegram: data.user_info.username
          ? `@${data.user_info.username}`
          : "",
        observations: `Usuário: ${data.user_info.username} | Via Proxy Local`,
        expirationDate: data.user_info.exp_date
          ? new Date(parseInt(data.user_info.exp_date) * 1000)
            .toISOString()
            .split("T")[0]
          : "",
        password: data.user_info.password || password,
        bouquets: "",
        realName: "",
        whatsapp: "",
        devices: data.user_info.max_connections
          ? parseInt(data.user_info.max_connections)
          : 1,
        credits: 0,
        notes: "",
        server: "",
        m3u_url: "",
      };

      // Aplicar aos formulários baseado no modal aberto
      if (isEditDialogOpen && editingUser) {
        setEditingUser({ ...editingUser, ...extractedData });
      } else {
        setNewUser(extractedData as typeof newUser);
      }

      setExtractionResult({
        success: true,
        message: `Dados extraídos com sucesso! Usuário: ${data.user_info.username}`,
        data: data,
      });

      setExtractionError("");

    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      setExtractionError(errorMessage);
      console.error("Erro na extração M3U:", error);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 min-h-screen bg-background p-3 sm:p-6 transition-colors duration-300">
      {/* Indicadores de status */}
      {loading && (
        <div className="bg-blue-900/40 border border-blue-700 text-blue-300 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300"></div>
            <span>Carregando usuários do banco de dados...</span>
          </div>
        </div>
      )}

      {/* Banner de erro RLS */}
      {error && (
        <RLSErrorBanner error={error} onClearError={clearError} />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Gerenciamento de Usuários
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            {loading
              ? "Carregando..."
              : `Gerencie todos os usuários do sistema(${(users || []).length
              } usuários)`}
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
            <DialogContent className="bg-[#1f2937] text-white max-w-4xl w-full p-0 rounded-xl shadow-xl border border-gray-700 flex flex-col max-h-[90vh] overflow-y-auto scrollbar-hide">
              <div className="p-6 w-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Adicionar um Cliente</h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  </div>
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("🔵 [AdminUsers] Form submit disparado!");
                  await handleAddUser();
                }} className="space-y-6 flex-1 overflow-y-auto">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-green-400 text-xs font-medium">• Campos obrigatórios marcados com *</span>
                    <span className="text-blue-400 text-xs font-medium">• Dados serão sincronizados automaticamente</span>
                  </div>
                  {/* Extração M3U */}
                  <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-blue-300 font-medium">Extração M3U</span>
                      <div className="flex gap-2">
                        <button
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 bg-blue-600 text-white hover:bg-blue-700 px-4 py-1 rounded text-sm"
                          type="button"
                          onClick={extractM3UData}
                          disabled={isExtracting}
                        >
                          {isExtracting ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              Extraindo...
                            </>
                          ) : "Extrair"}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-blue-300 mb-2">Serve para importar dados automaticamente a partir de uma URL.</p>
                    <input
                      className="flex h-10 w-full rounded-md px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-[#1f2937] border border-blue-800 text-white mb-2"
                      placeholder="Insira a URL do M3U para extrair automaticamente os dados do cliente..."
                      value={m3uUrl}
                      onChange={e => setM3uUrl(e.target.value)}
                    />
                    {extractionError && (
                      <div className="bg-red-900/40 border border-red-700 text-red-300 text-xs rounded p-2 mb-2">❌ {extractionError}</div>
                    )}
                    {extractionResult && !extractionError && (
                      <div className="bg-green-900/40 border border-green-700 text-green-300 text-xs rounded p-2 mb-2">✅ {extractionResult.message}</div>
                    )}
                  </div>
                  {/* Informações Básicas */}
                  <div className="bg-[#23272f] border border-gray-700 rounded-lg p-4 mb-6">
                    <span className="block text-white font-semibold mb-4">Informações Básicas</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Servidor */}
                      <div className="col-span-1">
                        <label htmlFor="add-server" className="block text-gray-300 mb-1 font-medium">
                          Servidor *
                        </label>
                        <Input
                          id="add-server"
                          type="text"
                          value={newUser.server || ""}
                          onChange={(e) => setNewUser({ ...newUser, server: e.target.value })}
                          placeholder="Digite o nome do servidor"
                          className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                        />
                      </div>
                      {/* Plano */}
                      <div className="col-span-1">
                        <label htmlFor="add-plan" className="block text-gray-300 mb-1 font-medium">
                          Plano *
                        </label>
                        <select
                          id="add-plan"
                          className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                          value={newUser.plan}
                          onChange={(e) =>
                            setNewUser({ ...newUser, plan: e.target.value, price: "" })
                          }
                        >
                          <option value="">Selecione um plano</option>
                          <option value="Mensal">Mensal</option>
                          <option value="Bimestral">Bimestral</option>
                          <option value="Trimestral">Trimestral</option>
                          <option value="Semestral">Semestral</option>
                          <option value="Anual">Anual</option>
                        </select>
                      </div>
                      {/* Preço */}
                      {newUser.plan && (
                        <div className="col-span-1">
                          <label htmlFor="add-price" className="block text-gray-300 mb-1 font-medium">
                            Preço *
                          </label>
                          <select
                            id="add-price"
                            className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                            value={newUser.price}
                            onChange={(e) =>
                              setNewUser({ ...newUser, price: e.target.value })
                            }
                          >
                            <option value="">Selecione um preço</option>
                            {getPlanPrices(newUser.plan).map((price) => (
                              <option key={price} value={price}>
                                R$ {price}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      {/* Nome */}
                      <div className="col-span-1">
                        <label htmlFor="add-name" className="block text-gray-300 mb-1 font-medium">
                          Nome *
                        </label>
                        <Input
                          id="add-name"
                          placeholder="Nome completo do cliente"
                          className="bg-background border border-input text-foreground"
                          value={newUser.name}
                          onChange={(e) =>
                            setNewUser({ ...newUser, name: e.target.value })
                          }
                        />
                      </div>
                      {/* Email */}
                      <div className="col-span-1">
                        <label htmlFor="add-email" className="block text-gray-300 mb-1 font-medium">
                          Email *
                        </label>
                        <Input
                          id="add-email"
                          placeholder="email@exemplo.com"
                          className="bg-background border border-input text-foreground"
                          value={newUser.email}
                          onChange={(e) =>
                            setNewUser({ ...newUser, email: e.target.value })
                          }
                        />
                      </div>
                      {/* Status */}
                      <div className="col-span-1">
                        <label htmlFor="add-status" className="block text-gray-300 mb-1 font-medium">
                          Status *
                        </label>
                        <select
                          id="add-status"
                          className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                          value={newUser.status}
                          onChange={(e) =>
                            setNewUser({ ...newUser, status: e.target.value })
                          }
                        >
                          <option value="Ativo">Ativo</option>
                          <option value="Inativo">Inativo</option>
                          <option value="Suspenso">Suspenso</option>
                          <option value="Pendente">Pendente</option>
                        </select>
                      </div>
                      {/* Data de Expiração */}
                      <div className="col-span-1">
                        <label htmlFor="add-expiration" className="block text-gray-300 mb-1 font-medium">
                          Data de Expiração *
                        </label>
                        <Input
                          id="add-expiration"
                          type="date"
                          className="bg-background border border-input text-foreground"
                          value={newUser.expirationDate}
                          onChange={(e) =>
                            setNewUser({ ...newUser, expirationDate: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  {/* Configuração de Serviço */}
                  <div className="bg-[#23272f] border border-gray-700 rounded-lg p-4 mb-6">
                    <span className="block text-white font-semibold mb-4">Configuração de Serviço</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Dispositivos */}
                      <div className="col-span-1">
                        <label htmlFor="add-devices" className="block text-gray-300 mb-1 font-medium">
                          Dispositivos
                        </label>
                        <Input
                          id="add-devices"
                          type="number"
                          placeholder="0"
                          className="bg-background border border-input text-foreground"
                          value={newUser.devices}
                          onChange={(e) =>
                            setNewUser({ ...newUser, devices: parseInt(e.target.value) || 0 })
                          }
                        />
                      </div>
                      {/* Créditos */}
                      <div className="col-span-1">
                        <label className="block text-gray-300 mb-1 font-medium">
                          Créditos
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          className="bg-background border border-input text-foreground"
                          value={newUser.credits}
                          onChange={(e) =>
                            setNewUser({ ...newUser, credits: parseInt(e.target.value) || 0 })
                          }
                        />
                      </div>
                      {/* Senha */}
                      <div className="col-span-1">
                        <label className="block text-gray-300 mb-1 font-medium">
                          Senha
                        </label>
                        <Input
                          placeholder="Senha do cliente"
                          className="bg-background border border-input text-foreground"
                          value={newUser.password}
                          onChange={(e) =>
                            setNewUser({ ...newUser, password: e.target.value })
                          }
                        />
                      </div>
                      {/* Bouquets */}
                      <div className="col-span-1">
                        <label className="block text-gray-300 mb-1 font-medium">
                          Bouquets
                        </label>
                        <Input
                          placeholder="Bouquets disponíveis"
                          className="bg-background border border-input text-foreground"
                          value={newUser.bouquets}
                          onChange={(e) =>
                            setNewUser({ ...newUser, bouquets: e.target.value })
                          }
                        />
                      </div>
                      {/* Extração M3U */}
                      <div className="col-span-1">
                        <label className="block text-gray-300 mb-1 font-medium">
                          Extração M3U
                        </label>
                        <Input
                          placeholder="Cole a URL M3U aqui"
                          className="bg-background border border-input text-foreground"
                          value={newUser.m3u_url}
                          onChange={(e) =>
                            setNewUser({ ...newUser, m3u_url: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  {/* Informações Adicionais */}
                  <div className="hidden md:block bg-[#23272f] border border-gray-700 rounded-lg p-4 mb-6">
                    <span className="block text-white font-semibold mb-4">Informações Adicionais</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Nome Real */}
                      <div className="col-span-1">
                        <label className="block text-gray-300 mb-1 font-medium">
                          Nome Real
                        </label>
                        <Input
                          placeholder="Nome real do cliente"
                          className="bg-background border border-input text-foreground"
                          value={newUser.realName}
                          onChange={(e) =>
                            setNewUser({ ...newUser, realName: e.target.value })
                          }
                        />
                      </div>
                      {/* WhatsApp */}
                      <div className="col-span-1">
                        <label className="block text-gray-300 mb-1 font-medium">
                          WhatsApp
                        </label>
                        <Input
                          placeholder="+55 (11) 99999-9999"
                          className="bg-background border border-input text-foreground"
                          value={newUser.whatsapp}
                          onChange={(e) =>
                            setNewUser({ ...newUser, whatsapp: e.target.value })
                          }
                        />
                      </div>
                      {/* Telegram */}
                      <div className="col-span-1">
                        <label className="block text-gray-300 mb-1 font-medium">
                          Telegram
                        </label>
                        <Input
                          placeholder="@username"
                          className="bg-background border border-input text-foreground"
                          value={newUser.telegram}
                          onChange={(e) =>
                            setNewUser({ ...newUser, telegram: e.target.value })
                          }
                        />
                      </div>
                      {/* Observações */}
                      <div className="col-span-1">
                        <label className="block text-gray-300 mb-1 font-medium">
                          Observações
                        </label>
                        <Input
                          placeholder="Observações sobre o cliente"
                          className="bg-background border border-input text-foreground"
                          value={newUser.observations}
                          onChange={(e) =>
                            setNewUser({ ...newUser, observations: e.target.value })
                          }
                        />
                      </div>
                      {/* Notas */}
                      <div className="col-span-2">
                        <label className="block text-gray-300 mb-1 font-medium">
                          Notas
                        </label>
                        <textarea
                          placeholder="Notas adicionais sobre o cliente..."
                          className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2 min-h-[80px] resize-none"
                          value={newUser.notes}
                          onChange={(e) =>
                            setNewUser({ ...newUser, notes: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isAddingUser}
                      className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white"
                    >
                      {isAddingUser ? "Adicionando..." : "Adicionar Cliente"}
                    </Button>
                  </div>
                  {error && (
                    <div className="mt-4 p-3 bg-red-900/40 border border-red-700 text-red-300 text-sm rounded">
                      ❌ {error}
                    </div>
                  )}
                  {addUserSuccess && (
                    <div className="mt-4 p-3 bg-green-900/40 border border-green-700 text-green-300 text-sm rounded">
                      ✅ Cliente adicionado com sucesso!
                    </div>
                  )}
                </form>
              </div>
            </DialogContent>
          </Dialog>
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
            <div className="text-2xl font-bold text-white">
              {shouldShow ? (users || []).length : 0}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Usuários cadastrados
            </div>
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
            <div className="text-2xl font-bold text-green-400">
              {shouldShow ? (users || []).filter((u) => u.status === "Ativo").length : 0}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Usuários com acesso
            </div>
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
            <div className="text-2xl font-bold text-red-400">
              {shouldShow ? (users || []).filter((u) => u.status === "Inativo").length : 0}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Usuários bloqueados
            </div>
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
            <div className="text-2xl font-bold text-blue-400">{shouldShow ? 0 : 0}</div>
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
            {filteredUsers.length} resultado
            {filteredUsers.length !== 1 ? "s" : ""} encontrado
            {filteredUsers.length !== 1 ? "s" : ""}
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
      <Card className="bg-card text-card-foreground">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg text-foreground">
            Lista de Usuários
          </CardTitle>
          {selectedUserIds.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsBulkDeleteDialogOpen(true)}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Excluir {selectedUserIds.size} Selecionado(s)
            </Button>
          )}
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-gray-400">
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedUserIds.size === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                  />
                </TableHead>
                <TableHead className="text-xs sm:text-sm">Nome</TableHead>
                <TableHead className="text-xs sm:text-sm">Plano</TableHead>
                <TableHead className="text-xs sm:text-sm">Status</TableHead>
                <TableHead className="hidden md:table-cell text-xs sm:text-sm">
                  Números de Dispositivos
                </TableHead>
                <TableHead className="hidden lg:table-cell text-xs sm:text-sm">
                  Vencimento
                </TableHead>
                <TableHead className="hidden lg:table-cell text-xs sm:text-sm">
                  Servidor
                </TableHead>
                <TableHead className="hidden sm:table-cell text-xs sm:text-sm">
                  Preço
                </TableHead>
                <TableHead className="text-xs sm:text-sm">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className={`hover:bg-[#232a36] transition-colors ${selectedUserIds.has(user.id) ? 'bg-blue-900/30' : ''}`}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedUserIds.has(user.id)}
                      onChange={() => toggleSelectUser(user.id)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />
                  </TableCell>
                  <TableCell className="text-white font-medium text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      {user.name}
                      {user.pago && (
                        <Badge className="bg-green-600 text-white text-xs px-1.5 py-0.5">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Pago
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300 text-xs sm:text-sm">
                    {user.plan}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text - xs ${user.status === "Ativo"
                        ? "bg-green-700 text-green-200"
                        : user.status === "Inativo"
                          ? "bg-red-700 text-red-200"
                          : user.status === "Pendente"
                            ? "bg-yellow-700 text-yellow-200"
                            : "bg-gray-700 text-gray-300"
                        } `}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-300 text-xs sm:text-sm">
                    {user.devices || 0}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-gray-300 text-xs sm:text-sm">
                    {user.expiration_date
                      ? new Date(user.expiration_date).toLocaleDateString('pt-BR')
                      : "-"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-gray-300 text-xs sm:text-sm">
                    {user.server || "-"}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-300 text-xs sm:text-sm">
                    {user.price ? `R$ ${user.price} ` : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 sm:gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white h-8 w-8 sm:h-9 sm:w-9 p-0"
                        onClick={() => openViewModal(user)}
                        title="Visualizar"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white h-8 w-8 sm:h-9 sm:w-9 p-0"
                        onClick={() => openEditModal(user)}
                        title="Editar"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={user.pago ? "default" : "outline"}
                        className={`${user.pago
                          ? "bg-green-600 text-white hover:bg-green-700 border-green-600"
                          : "border-green-600 text-green-400 hover:bg-green-600 hover:text-white bg-background"
                          } h - 8 w - 8 sm: h - 9 sm: w - 9 p - 0 rounded - md`}
                        onClick={() => openPagoModal(user)}
                        title={user.pago ? "Marcar como Não Pago" : "Marcar como Pago"}
                      >
                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white h-8 w-8 sm:h-9 sm:w-9 p-0"
                        onClick={() => openDeleteModal(user)}
                        title="Remover"
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
          <span className="text-white text-sm">
            Página {currentPage} de {totalPages}
          </span>
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
                  <DialogTitle className="text-xl font-bold text-white">
                    Detalhes do Usuário
                  </DialogTitle>
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
                      <p className="text-white font-medium">
                        {viewingUser.name}
                      </p>
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
                      <Badge className="bg-purple-600 text-white">
                        {viewingUser.plan}
                      </Badge>
                    </div>
                    {viewingUser.price && (
                      <div>
                        <Label className="text-gray-400 text-sm">Preço</Label>
                        <p className="text-white font-medium">
                          R$ {viewingUser.price}
                        </p>
                      </div>
                    )}
                    <div>
                      <Label className="text-gray-400 text-sm">Status</Label>
                      <Badge
                        className={
                          viewingUser.status === "Ativo"
                            ? "bg-green-600 text-white"
                            : viewingUser.status === "Inativo"
                              ? "bg-red-600 text-white"
                              : viewingUser.status === "Pendente"
                                ? "bg-yellow-600 text-white"
                                : "bg-gray-600 text-white"
                        }
                      >
                        {viewingUser.status}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-sm">Status de Pagamento</Label>
                      <Badge
                        className={
                          viewingUser.pago
                            ? "bg-green-600 text-white flex items-center gap-1 w-fit"
                            : "bg-gray-600 text-white flex items-center gap-1 w-fit"
                        }
                      >
                        {viewingUser.pago ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Pago
                          </>
                        ) : (
                          "Não Pago"
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>

                {viewingUser.m3u_url && (
                  <div className="bg-[#23272f] rounded-lg p-4 mt-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Extração M3U</h3>
                    <div className="flex items-center gap-2 p-2 bg-[#1f2937] rounded border border-gray-700">
                      <code className="text-xs text-green-400 flex-1 break-all line-clamp-2">
                        {viewingUser.m3u_url}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 text-gray-400 hover:text-white"
                        onClick={() => {
                          navigator.clipboard.writeText(viewingUser.m3u_url || "");
                          alert("URL copiada!");
                        }}
                        title="Copiar URL"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
                <div>
                  <Label className="text-gray-400 text-sm">
                    Data de Criação
                  </Label>
                  <p className="text-white font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {viewingUser.createdAt}
                  </p>
                </div>
                {viewingUser.renewalDate && (
                  <div>
                    <Label className="text-gray-400 text-sm">
                      Data de Renovação
                    </Label>
                    <p className="text-white font-medium">
                      {viewingUser.renewalDate}
                    </p>
                  </div>
                )}
              </div>
    </div>

          {/* Contatos */}
          {
            (viewingUser.phone ||
              viewingUser.telegram ||
              viewingUser.whatsapp) && (
              <div className="bg-[#23272f] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Contatos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {viewingUser.phone && (
                    <div>
                      <Label className="text-gray-400 text-sm">
                        Telefone
                      </Label>
                      <p className="text-white font-medium">
                        {viewingUser.phone}
                      </p>
                    </div>
                  )}
                  {viewingUser.telegram && (
                    <div>
                      <Label className="text-gray-400 text-sm">
                        Telegram
                      </Label>
                      <p className="text-white font-medium">
                        {viewingUser.telegram}
                      </p>
                    </div>
                  )}
                  {viewingUser.whatsapp && (
                    <div>
                      <Label className="text-gray-400 text-sm">
                        WhatsApp
                      </Label>
                      <p className="text-white font-medium">
                        {viewingUser.whatsapp}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          }

          {/* Observações */}
          {
            (viewingUser.notes || viewingUser.observations) && (
              <div className="bg-[#23272f] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Observações
                </h3>
                <p className="text-gray-300">
                  {viewingUser.observations || viewingUser.notes}
                </p>
              </div>
            )
          }

          {/* Dados Extras */}
          {
            (viewingUser.password ||
              viewingUser.expirationDate ||
              viewingUser.bouquets) && (
              <div className="bg-[#23272f] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  Dados Extras
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {viewingUser.password && (
                    <div>
                      <Label className="text-gray-400 text-sm">Senha</Label>
                      <p className="text-white font-medium">
                        {viewingUser.password}
                      </p>
                    </div>
                  )}
                  {viewingUser.expirationDate && (
                    <div>
                      <Label className="text-gray-400 text-sm">
                        Data de Vencimento
                      </Label>
                      <p className="text-white font-medium">
                        {viewingUser.expirationDate}
                      </p>
                    </div>
                  )}
                  {viewingUser.bouquets && (
                    <div>
                      <Label className="text-gray-400 text-sm">
                        Bouquets
                      </Label>
                      <p className="text-white font-medium">
                        {viewingUser.bouquets}
                      </p>
                    </div>
                  )}
                </div>
                </div>
              </div>
            )
          }
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => setIsViewDialogOpen(false)}
            className="bg-gray-700 text-white"
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent >
    </Dialog >

    {/* Modal de Edição */ }
    < Dialog open = { isEditDialogOpen } onOpenChange = { setIsEditDialogOpen } >
      <DialogContent className="bg-[#1f2937] text-white max-w-4xl w-full p-0 rounded-xl shadow-xl border border-gray-700">
        <div className="p-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-yellow-500" />
              <span className="text-lg font-semibold text-white">
                Editar Cliente
              </span>
              <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-semibold">
                Editar
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-[#1f2937] text-white border border-gray-700 px-3 py-1 rounded text-sm"
              >
                Importar
              </Button>
              <Button
                variant="outline"
                className="bg-[#1f2937] text-white border border-gray-700 px-3 py-1 rounded text-sm"
              >
                Modelo
              </Button>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-2">
            Modifique os dados do cliente para atualizar suas informações na
            base de dados
          </p>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-400 text-xs font-medium">
              • Campos obrigatórios marcados com *
            </span>
            <span className="text-blue-400 text-xs font-medium">
              • Dados serão sincronizados automaticamente
            </span>
          </div>

          {editingUser && (
            <>
              {/* Extração M3U */}
              <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-blue-300 font-medium">
                    Extração M3U
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 bg-blue-600 text-white hover:bg-blue-700 px-4 py-1 rounded text-sm"
                      type="button"
                      onClick={extractM3UData}
                      disabled={isExtracting}
                    >
                      {isExtracting ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          Extraindo...
                        </>
                      ) : "Extrair"}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-blue-300 mb-2">
                  Serve para importar dados automaticamente a partir de uma
                  URL.
                </p>
                <input
                  className="flex h-10 w-full rounded-md px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-[#1f2937] border border-blue-800 text-white mb-2"
                  placeholder="Insira a URL do M3U para extrair automaticamente os dados do cliente..."
                  value={m3uUrl}
                  onChange={e => setM3uUrl(e.target.value)}
                />

                {/* Status de extração */}
                {extractionError && (
                  <div
                    className={`border text - xs rounded p - 2 mb - 2 ${extractionError.includes("Testando proxy")
                      ? "bg-blue-900/40 border-blue-700 text-blue-300"
                      : "bg-red-900/40 border-red-700 text-red-300"
                      } `}
                  >
                    {extractionError.includes("Testando proxy") ? "🔄" : "❌"}{" "}
                    {extractionError}
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
                    <div className="font-medium mb-1">
                      ✅ Dados aplicados ao formulário:
                    </div>
                    <div className="space-y-1">
                      <div>• Nome: {editingUser.name || "Não extraído"}</div>
                      <div>
                        • Email: {editingUser.email || "Não extraído"}
                      </div>
                      <div>
                        • Senha: {editingUser.password || "Não extraída"}
                      </div>
                      <div>• Plano: {editingUser.plan || "Não extraído"}</div>
                      <div>
                        • Status: {editingUser.status || "Não extraído"}
                      </div>
                      <div>
                        • Telegram: {editingUser.telegram || "Não extraído"}
                      </div>
                      <div>
                        • Vencimento:{" "}
                        {editingUser.expirationDate || "Não definido"}
                      </div>
                      <div>
                        • Bouquets: {editingUser.bouquets || "Não extraídos"}
                      </div>
                      <div>
                        • Observações: {editingUser.observations || "Nenhuma"}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Informações Básicas */}
              <div className="bg-[#1f2937] border border-gray-700 rounded-lg p-4 mb-4">
                <span className="block text-white font-semibold mb-2">
                  Informações Básicas
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Servidor */}
                  <div className="col-span-1">
                    <label className="block text-gray-300 mb-1 font-medium">
                      Servidor *
                    </label>
                    <Input
                      type="text"
                      value={editingUser.server || ""}
                      onChange={(e) => setEditingUser({ ...editingUser, server: e.target.value })}
                      placeholder="Digite o nome do servidor"
                      className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                    />
                  </div>
                  {/* Plano */}
                  <div className="col-span-1">
                    <label htmlFor="edit-plan" className="block text-gray-300 mb-1 font-medium">
                      Plano *
                    </label>
                    <select
                      id="edit-plan"
                      aria-label="Plano"
                      className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                      value={editingUser.plan}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          plan: e.target.value,
                          price: "", // Resetar preço quando plano mudar
                        })
                      }
                    >
                      <option value="">Selecione um plano</option>
                      <option value="Mensal">Mensal</option>
                      <option value="Bimestral">Bimestral</option>
                      <option value="Trimestral">Trimestral</option>
                      <option value="Semestral">Semestral</option>
                      <option value="Anual">Anual</option>
                    </select>
                  </div>
                  {/* Preço */}
                  {editingUser.plan && (
                    <div className="col-span-1">
                      <label htmlFor="edit-price" className="block text-gray-300 mb-1 font-medium">
                        Preço *
                      </label>
                      <select
                        id="edit-price"
                        aria-label="Preço"
                        className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                        value={editingUser.price}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            price: e.target.value,
                          })
                        }
                      >
                        <option value="">Selecione um preço</option>
                        {getPlanPrices(editingUser.plan).map((price) => (
                          <option key={price} value={price}>
                            R$ {price}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {/* Usuário */}
                  <div className="col-span-1">
                    <label className="block text-gray-300 mb-1 font-medium">
                      Usuário *
                    </label>
                    <div className="relative flex items-center">
                      <input
                        value={editingUser.name}
                        disabled
                        placeholder="Usuário extraído automaticamente"
                        className="w-full bg-[#23272f] border border-gray-700 text-gray-400 rounded px-3 py-2 pr-8 cursor-not-allowed"
                      />
                      <span className="absolute right-2 text-gray-500">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                          <polyline points="7 9 12 4 17 9" />
                          <line x1="12" x2="12" y1="4" y2="16" />
                        </svg>
                      </span>
                    </div>
                    <div className="bg-blue-900/40 border border-blue-700 text-blue-300 text-xs rounded mt-2 p-2">
                      Usuário extraído automaticamente da URL M3U
                    </div>
                  </div>
                  {/* Senha */}
                  <div className="col-span-1">
                    <label className="block text-gray-300 mb-1 font-medium">
                      Senha
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={editingUser.password || ""}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            password: e.target.value,
                          })
                        }
                        placeholder="Senha"
                        className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2 pr-8"
                      />
                      <span className="absolute right-2 text-gray-500 cursor-pointer">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                          <polyline points="7 9 12 4 17 9" />
                          <line x1="12" x2="12" y1="4" y2="16" />
                        </svg>
                      </span>
                    </div>
                    <div className="bg-blue-900/40 border border-blue-700 text-blue-300 text-xs rounded mt-2 p-2 space-y-1">
                      <div>Senha extraída automaticamente da URL M3U</div>
                    </div>
                  </div>
                  {/* Vencimento */}
                  <div className="col-span-2">
                    <label className="block text-gray-300 mb-1 font-medium">
                      Vencimento (Opcional)
                    </label>
                    <VencimentoDatePickerEdit
                      editingUser={editingUser}
                      setEditingUser={setEditingUser}
                    />
                  </div>
                  {/* Bouquets */}
                  <div className="col-span-2">
                    <label className="block text-gray-300 mb-1 font-medium">
                      Bouquets
                    </label>
                    <input
                      value={editingUser.bouquets || ""}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          bouquets: e.target.value,
                        })
                      }
                      placeholder="Bouquets extraídos automaticamente"
                      className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                    />
                  </div>
                  {/* Extração M3U (Manual) */}
                  <div className="col-span-2">
                    <label className="block text-gray-300 mb-1 font-medium">
                      Extração M3U
                    </label>
                    <input
                      value={editingUser.m3u_url || ""}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          m3u_url: e.target.value,
                        })
                      }
                      placeholder="URL M3U"
                      className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                    />
                  </div>
                  {/* Nome */}
                  <div className="col-span-1">
                    <label className="block text-gray-300 mb-1 font-medium">
                      Nome *
                    </label>
                    <input
                      value={editingUser.realName || ""}
                      onChange={async (e) => {
                        const newName = e.target.value;
                        setEditingUser({ ...editingUser, realName: newName });
                        if (editingUser && editingUser.id) {
                          // Salvar em tempo real no banco
                          await updateUser(editingUser.id, {
                            real_name: newName,
                          });
                        }
                      }}
                      placeholder="Digite o nome completo"
                      className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                      required
                    />
                  </div>
                  {/* E-mail */}
                  <div className="col-span-1">
                    <label className="block text-gray-300 mb-1 font-medium">
                      E-mail
                    </label>
                    <input
                      value={editingUser.email}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          email: e.target.value,
                        })
                      }
                      placeholder="Opcional"
                      className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                    />
                  </div>
                  {/* Telegram */}
                  <div className="col-span-1">
                    <label className="block text-gray-300 mb-1 font-medium">
                      Telegram
                    </label>
                    <input
                      value={editingUser.telegram || ""}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          telegram: e.target.value,
                        })
                      }
                      placeholder="Opcional"
                      className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                    />
                  </div>
                  {/* WhatsApp */}
                  <div className="col-span-1">
                    <label className="block text-gray-300 mb-1 font-medium">
                      WhatsApp
                    </label>
                    <input
                      value={editingUser.whatsapp || ""}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          whatsapp: e.target.value,
                        })
                      }
                      placeholder="Opcional"
                      className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                    />
                    <span className="text-xs text-gray-400 mt-1 block">
                      Incluindo o código do país - com ou sem espaço e traços
                      - ex. 55 11 99999 3333
                    </span>
                  </div>
                  {/* Observações */}
                  <div className="col-span-2">
                    <label className="block text-gray-300 mb-1 font-medium">
                      Observações
                    </label>
                    <textarea
                      value={
                        editingUser.observations || editingUser.notes || ""
                      }
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          observations: e.target.value,
                        })
                      }
                      placeholder="Opcional"
                      className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2 min-h-[60px]"
                    />
                  </div>
                </div>
              </div>

              {/* Configuração de Serviço */}
              <div className="bg-[#1f2937] border border-gray-700 rounded-lg p-4 mb-4">
                <span className="block text-purple-400 font-semibold mb-2">
                  Configuração de Serviço
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                  {/* Classe de Serviço */}
                  <div>
                    <label htmlFor="edit-classe-servico" className="block text-gray-300 mb-1 font-medium">
                      Classe de Serviço
                    </label>
                    <select id="edit-classe-servico" aria-label="Classe de Serviço" className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2">
                      <option value="">Selecione</option>
                      <option value="basico">Básico</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                  {/* Plano */}
                  <div>
                    <label htmlFor="edit-small-plan" className="block text-gray-300 mb-1 font-medium">
                      Plano
                    </label>
                    <select id="edit-small-plan" aria-label="Plano" className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2">
                      <option value="mensal">Mensal</option>
                      <option value="anual">Anual</option>
                    </select>
                  </div>
                  {/* Status */}
                  <div>
                    <label htmlFor="edit-small-status" className="block text-gray-300 mb-1 font-medium">
                      Status
                    </label>
                    <select
                      id="edit-small-status"
                      aria-label="Status"
                      value={editingUser.status}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          status: e.target.value,
                        })
                      }
                      className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                      <option value="Pendente">Pendente</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                  {/* Status de Pagamento */}
                  <div className="flex items-center gap-3 p-3 bg-[#23272f] border border-gray-700 rounded">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingUser.pago || false}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            pago: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                      />
                      <span className="text-gray-300 font-medium">
                        Cliente Pago
                      </span>
                      {editingUser.pago && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                  {/* Data de Renovação */}
                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">
                      Data de Renovação
                    </label>
                    <RenovacaoDatePicker />
                  </div>
                  {/* Número de Dispositivos */}
                  <div>
                    <label htmlFor="edit-devices" className="block text-gray-300 mb-1 font-medium">
                      Número de Dispositivos
                    </label>
                    <input
                      id="edit-devices"
                      type="number"
                      min={1}
                      value={editingUser.devices || 0}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          devices: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                    />
                  </div>
                  {/* Créditos */}
                  <div>
                    <label htmlFor="edit-credits" className="block text-gray-300 mb-1 font-medium">
                      Créditos
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="bg-[#23272f] text-white px-2 py-1 rounded border border-gray-700"
                      >
                        -
                      </button>
                      <input
                        id="edit-credits"
                        type="number"
                        min={0}
                        value={editingUser.credits || 0}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            credits: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-16 bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2"
                      />
                      <button
                        type="button"
                        className="bg-[#23272f] text-white px-2 py-1 rounded border border-gray-700"
                      >
                        +
                      </button>
                      <span className="text-xs text-gray-400 ml-2">
                        valor
                        <br />
                        entre 0<br />e 500€
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className="bg-[#1f2937] border border-gray-700 rounded-lg p-4 mb-4">
                <span className="block text-white font-semibold mb-2">
                  Informações Adicionais
                </span>
                <label htmlFor="notifications-whatsapp" className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input id="notifications-whatsapp" type="checkbox" className="accent-purple-600" aria-label="Notificações via WhatsApp" />
                  <span className="text-gray-300">Notificações via WhatsApp</span>
                </label>
                <div>
                  <label htmlFor="edit-anotacoes" className="block text-gray-300 mb-1 font-medium">Anotações</label>
                  <textarea id="edit-anotacoes" placeholder="Anotações..." className="w-full bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2 min-h-[60px]" />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="bg-gray-700 text-white px-6 py-2 rounded font-semibold"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleEditUser}
                  disabled={!editingUser || (!editingUser.realName?.trim() && !editingUser.name?.trim())}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  Salvar Alterações
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog >

    {/* Modal de Confirmação de Exclusão */ }
    < AlertDialog open = { isDeleteDialogOpen } onOpenChange = { setIsDeleteDialogOpen } >
      <AlertDialogContent className="bg-[#1f2937] text-white border border-gray-700">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-bold text-white">
                Confirmar Exclusão
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
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
              {deletingUser.price && (
                <p className="text-white">
                  <span className="text-gray-400">Preço:</span>{" "}
                  R$ {deletingUser.price}
                </p>
              )}
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
            onClick={handleDeleteUser}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Excluir Usuário
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog >

    {/* Modal de Confirmação de Exclusão em Lote */ }
    < AlertDialog open = { isBulkDeleteDialogOpen } onOpenChange = { setIsBulkDeleteDialogOpen } >
      <AlertDialogContent className="bg-[#1f2937] text-white border border-gray-700">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-bold text-white">
                Excluir {selectedUserIds.size} Usuário(s)
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Esta ação não pode ser desfeita. Todos os usuários selecionados serão permanentemente removidos.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="bg-[#23272f] rounded-lg p-4 mb-4">
          <p className="text-yellow-400 text-sm">
            ⚠️ Você está prestes a excluir <strong>{selectedUserIds.size}</strong> usuário(s).
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-700 text-white border border-gray-600 hover:bg-gray-600">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleBulkDelete}
            disabled={isBulkDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isBulkDeleting ? "Excluindo..." : `Excluir ${selectedUserIds.size} Usuário(s)`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog >

    {/* Modal de Confirmação de Pagamento */ }
    < AlertDialog open = { isPagoDialogOpen } onOpenChange = { setIsPagoDialogOpen } >
      <AlertDialogContent className="bg-[#1f2937] text-white border border-gray-700">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w - 12 h - 12 rounded - full flex items - center justify - center ${pagoUser?.pago ? "bg-yellow-600" : "bg-green-600"
              } `}>
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-bold text-white">
                {pagoUser?.pago ? "Desmarcar Pagamento" : "Confirmar Pagamento"}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                {pagoUser?.pago
                  ? "Deseja realmente desmarcar o pagamento deste cliente? A receita será atualizada no dashboard."
                  : "Confirme se este cliente realizou o pagamento. O valor será adicionado à receita total no dashboard."
                }
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {pagoUser && (
          <div className="space-y-4">
            <div className="bg-[#23272f] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">
                Informações do Cliente:
              </h3>
              <div className="space-y-2">
                <p className="text-white">
                  <span className="text-gray-400">Nome:</span>{" "}
                  <span className="font-medium">{pagoUser.name}</span>
                </p>
                <p className="text-white">
                  <span className="text-gray-400">Email:</span>{" "}
                  {pagoUser.email}
                </p>
                {pagoUser.plan && (
                  <p className="text-white">
                    <span className="text-gray-400">Plano:</span>{" "}
                    <span className="font-medium">{pagoUser.plan}</span>
                  </p>
                )}
                <p className="text-white">
                  <span className="text-gray-400">Status atual:</span>{" "}
                  <span className={pagoUser.pago ? "text-green-400 font-semibold" : "text-gray-400"}>
                    {pagoUser.pago ? "✓ Pago" : "✗ Não Pago"}
                  </span>
                </p>
              </div>
            </div>

            {pagoUser.price && (
              <div className={`rounded - lg p - 4 border - 2 ${pagoUser.pago
                ? "bg-yellow-900/20 border-yellow-600/50"
                : "bg-green-900/20 border-green-600/50"
                } `}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">
                      {pagoUser.pago ? "Valor que será removido:" : "Valor que será adicionado:"}
                    </p>
                    <p className="text-2xl font-bold text-white mt-1">
                      <span className={pagoUser.pago ? "text-yellow-400" : "text-green-400"}>
                        {pagoUser.pago ? "-" : "+"} R$ {pagoUser.price}
                      </span>
                    </p>
                  </div>
                  <div className={`w - 12 h - 12 rounded - full flex items - center justify - center ${pagoUser.pago ? "bg-yellow-600/20" : "bg-green-600/20"
                    } `}>
                    <DollarSign className={`w - 6 h - 6 ${pagoUser.pago ? "text-yellow-400" : "text-green-400"
                      } `} />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {pagoUser.pago
                    ? "Este valor será subtraído da Receita Total no Dashboard."
                    : "Este valor será adicionado à Receita Total no Dashboard."
                  }
                </p>
              </div>
            )}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            className="bg-gray-700 text-white border border-gray-600 hover:bg-gray-600"
            onClick={() => {
              setIsPagoDialogOpen(false);
              setPagoUser(null);
            }}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmTogglePago}
            className={`${pagoUser?.pago
              ? "bg-yellow-600 hover:bg-yellow-700"
              : "bg-green-600 hover:bg-green-700"
              } text - white`}
          >
            {pagoUser?.pago ? "Desmarcar Pagamento" : "Confirmar Pagamento"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
      </AlertDialogContent >
    </AlertDialog >
  </div >
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
            id="vencimento-date"
            readOnly
            value={date ? formatDate(date) : ""}
            placeholder="Selecione a data"
            aria-label="Data de vencimento"
            className="w-1/2 bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2 cursor-pointer"
            onClick={() => setOpen(true)}
          />
          <input
            id="vencimento-time"
            type="time"
            value={time}
            aria-label="Hora de vencimento"
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
  editingUser: Partial<Cliente> | null;
  setEditingUser: (user: Partial<Cliente> | null) => void;
}) {
  const [open, setOpen] = React.useState(false);
  // Função auxiliar para criar data local a partir de string YYYY-MM-DD
  const createLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const [date, setDate] = React.useState<Date | undefined>(
    editingUser?.expirationDate
      ? createLocalDate(editingUser.expirationDate)
      : undefined
  );
  const [time, setTime] = React.useState<string>("");

  // Atualizar data quando editingUser mudar
  React.useEffect(() => {
    if (editingUser?.expirationDate) {
      setDate(createLocalDate(editingUser.expirationDate));
    } else {
      setDate(undefined);
    }
  }, [editingUser?.expirationDate]);

  function handleDateSelect(selected: Date | undefined) {
    setDate(selected);
    if (selected && editingUser) {
      // Formatar data localmente sem conversão de timezone
      const year = selected.getFullYear();
      const month = String(selected.getMonth() + 1).padStart(2, '0');
      const day = String(selected.getDate()).padStart(2, '0');
      const localDate = `${year}-${month}-${day}`;
      setEditingUser({ ...editingUser, expirationDate: localDate });
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
            id="vencimento-date-2"
            readOnly
            value={date ? formatDate(date) : ""}
            placeholder="Selecione a data"
            aria-label="Data de vencimento"
            className="w-1/2 bg-[#23272f] border border-gray-700 text-white rounded px-3 py-2 cursor-pointer"
            onClick={() => setOpen(true)}
          />
          <input
            id="vencimento-time-2"
            type="time"
            value={time}
            aria-label="Hora de vencimento"
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
