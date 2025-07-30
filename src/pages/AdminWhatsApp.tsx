import React, { useState, createContext, useContext, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { CheckCircle, MessageSquare, Clock, FileText, Zap, Settings, Trash2, Edit, Plus, Eye, EyeOff, Download, Upload, Users, Loader2 } from 'lucide-react';
import { APIBrasilRealtimeSection } from '@/components/APIBrasilRealtimeSection';
import { checkConnectionStatus } from '@/services/apiBrasilService';

const templatesMock = [
  {
    id: 1,
    title: 'Confirmação de Agendamento',
    status: 'Ativo',
    tag: 'confirmação',
    content: 'Olá {{nome}}, seu agendamento para {{servico}} foi confirmado para {{data}} às {{hora}}. Aguardamos você! 📅',
    sent: 445,
    delivery: 96.8,
    variables: 3,
    read: true
  },
  {
    id: 2,
    title: 'Lembrete de Agendamento',
    status: 'Ativo',
    tag: 'lembrete',
    content: 'Oi {{nome}}! Lembrete: você tem um agendamento amanhã às {{hora}} para {{servico}}. Confirme sua presença! 📲',
    sent: 389,
    delivery: 94.2,
    variables: 3,
    read: true
  },
  {
    id: 3,
    title: 'Cancelamento de Agendamento',
    status: 'Ativo',
    tag: 'cancelamento',
    content: 'Olá {{nome}}, seu agendamento para {{servico}} em {{data}} foi cancelado conforme solicitado. Para reagendar, entre em contato.',
    sent: 67,
    delivery: 95.8,
    variables: 3,
    read: false
  },
  {
    id: 4,
    title: 'Promoção Especial',
    status: 'Inativo',
    tag: 'marketing',
    content: '{{nome}}, temos uma promoção especial para você! {{promocao}} com {{desconto}} de desconto. Válido até {{validade}}. 🎁',
    sent: 234,
    delivery: 95.1,
    variables: 4,
    read: false
  }
];

const initialForm = { id: null, title: '', status: 'Ativo', tag: '', content: '', variables: 1 };

type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

export const WhatsAppStatusContext = createContext({
  isConnected: false,
  connectionStatus: 'disconnected' as ConnectionStatus,
  setIsConnected: (v: boolean) => {},
  setConnectionStatus: (status: ConnectionStatus) => {},
});

export const useWhatsAppStatus = () => useContext(WhatsAppStatusContext);

const AdminWhatsApp: React.FC = () => {
  // Estados para a API Brasil
  const [apiBrasilConfig, setApiBrasilConfig] = useState({
    bearerToken: '',
    profileId: '',
    phoneNumber: '',
    isConfigured: false,
    isConnected: false,
    isLoading: false,
    error: '',
    showToken: false,
  });

  const [autoReply, setAutoReply] = useState(false);
  const [templates, setTemplates] = useState(templatesMock);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [templateToDelete, setTemplateToDelete] = useState<any>(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [configTab, setConfigTab] = useState('geral');
  const [config, setConfig] = useState({
    provider: 'whatsapp-web',
    apiToken: '',
    apiEndpoint: '',
    autoReply: false,
    logsDetalhados: false,
    modoProducao: false,
  });

  // Estados para conexão WhatsApp
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isLoadingQR, setIsLoadingQR] = useState(false);

  // Função para enviar mensagem via API Brasil
  const sendWhatsAppMessage = async (phoneNumber: string, message: string) => {
    // Validação dos campos obrigatórios
    if (!apiBrasilConfig.bearerToken?.trim()) {
      const errorMsg = 'Token de acesso da API Brasil não configurado';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    if (!apiBrasilConfig.profileId?.trim()) {
      const errorMsg = 'Profile ID da API Brasil não configurado';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Validação do número de telefone
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    if (!cleanedPhone || cleanedPhone.length < 10) {
      const errorMsg = 'Número de telefone inválido. Use DDD + número (ex: 11999999999)';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Formata o número para o padrão internacional (55 + DDD + número sem o 9º dígito se houver)
    const formattedPhone = `55${cleanedPhone}`;
    
    // Validação da mensagem
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      const errorMsg = 'A mensagem não pode estar vazia';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    setApiBrasilConfig(prev => ({ ...prev, isLoading: true, error: '' }));
    
    try {
      const token = apiBrasilConfig.bearerToken.trim();
      const profileId = apiBrasilConfig.profileId.trim();
      
      const payload = {
        profileId,
        phoneNumber: formattedPhone,
        message: trimmedMessage
      };

      console.log('Enviando mensagem via API Brasil:', { 
        endpoint: 'https://gateway.apibrasil.io/api/v2/whatsapp/send-message',
        payload: { ...payload, token: token.substring(0, 10) + '...' } // Não logar o token completo
      });

      const response = await fetch('https://gateway.apibrasil.io/api/v2/whatsapp/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'profile-id': profileId,
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      let responseData;
      try {
        responseData = await response.json();
        console.log('Resposta da API Brasil:', responseData);
      } catch (jsonError) {
        console.error('Erro ao processar resposta JSON:', jsonError);
        throw new Error('Resposta inválida do servidor');
      }

      if (!response.ok) {
        const errorMessage = responseData?.message || 
                           responseData?.error?.message || 
                           responseData?.error ||
                           `Erro HTTP ${response.status}`;
        
        console.error('Erro na resposta da API:', { 
          status: response.status, 
          error: errorMessage,
          response: responseData 
        });
        
        throw new Error(errorMessage);
      }

      // Se chegou aqui, a mensagem foi enviada com sucesso
      toast.success('Mensagem enviada com sucesso!', {
        description: `Para: ${formattedPhone}`,
        duration: 5000
      });
      
      return { 
        success: true, 
        data: responseData,
        message: 'Mensagem enviada com sucesso',
        phoneNumber: formattedPhone,
        timestamp: new Date().toISOString()
      };
      
    } catch (error: any) {
      console.error('Erro ao enviar mensagem via API Brasil:', error);
      
      let errorMessage = 'Erro ao enviar mensagem';
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // Tratamento de erros comuns
      if (errorMessage.includes('401')) {
        errorMessage = 'Token de acesso inválido ou expirado';
      } else if (errorMessage.includes('404')) {
        errorMessage = 'Recurso não encontrado. Verifique o Profile ID';
      } else if (errorMessage.includes('429')) {
        errorMessage = 'Limite de requisições excedido. Tente novamente mais tarde';
      } else if (errorMessage.includes('500')) {
        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde';
      }
      
      toast.error(`Falha ao enviar mensagem: ${errorMessage}`, {
        duration: 8000,
        action: {
          label: 'Tentar novamente',
          onClick: () => sendWhatsAppMessage(phoneNumber, message)
        }
      });
      
      // Atualiza o estado com a mensagem de erro
      setApiBrasilConfig(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
      
      return { 
        success: false, 
        error: errorMessage,
        message: errorMessage,
        phoneNumber: phoneNumber,
        timestamp: new Date().toISOString()
      };
    } finally {
      setApiBrasilConfig(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Função para testar o envio de mensagem
  const handleTestMessage = async () => {
    // Verifica se o número de telefone foi informado
    if (!apiBrasilConfig.phoneNumber?.trim()) {
      toast.error('Informe um número de telefone para teste', {
        description: 'Exemplo: 11999999999 (com DDD, sem o +55)'
      });
      return;
    }

    // Verifica se o token e profileId estão configurados
    if (!apiBrasilConfig.bearerToken?.trim() || !apiBrasilConfig.profileId?.trim()) {
      toast.error('Configure o Token e o Profile ID antes de testar', {
        action: {
          label: 'Configurar',
          onClick: () => setConfigModalOpen(true)
        }
      });
      return;
    }

    // Mensagem de teste formatada
    const testMessage = `🚀 *Mensagem de Teste*\n\n` +
      `Olá! Esta é uma mensagem de teste enviada através da integração com a API Brasil.\n\n` +
      `📱 *Detalhes:*\n` +
      `• Data: ${new Date().toLocaleString('pt-BR')}\n` +
      `• Status: Conexão ativa\n\n` +
      `✅ Se você recebeu esta mensagem, a integração está funcionando perfeitamente!`;
    
    // Mostra um toast de carregamento
    const toastId = toast.loading('Enviando mensagem de teste...');
    
    try {
      // Envia a mensagem de teste
      const result = await sendWhatsAppMessage(apiBrasilConfig.phoneNumber, testMessage);
      
      if (result.success) {
        // Atualiza o toast para sucesso
        toast.success('Mensagem de teste enviada com sucesso!', {
          id: toastId,
          description: `Para: ${apiBrasilConfig.phoneNumber}`,
          duration: 5000
        });
        
        // Atualiza o status da conexão
        setApiBrasilConfig(prev => ({
          ...prev,
          isConnected: true,
          error: ''
        }));
        setConnectionStatus('connected');
        setIsConnected(true);
        
      } else {
        // Se houver erro na resposta
        throw new Error(result.error || 'Falha ao enviar mensagem de teste');
      }
      
      return result;
      
    } catch (error: any) {
      // Tratamento de erros
      const errorMessage = error.message || 'Erro desconhecido ao enviar mensagem de teste';
      
      // Atualiza o toast para erro
      toast.error(`Falha no teste: ${errorMessage}`, {
        id: toastId,
        duration: 8000,
        action: {
          label: 'Tentar novamente',
          onClick: handleTestMessage
        }
      });
      
      // Atualiza o status de erro
      setApiBrasilConfig(prev => ({
        ...prev,
        isConnected: false,
        error: errorMessage
      }));
      setConnectionStatus('disconnected');
      setIsConnected(false);
      
      return { success: false, error: errorMessage };
    }
  };

  // Função para testar a conexão com a API Brasil
  const testApiBrasilConnection = async () => {
    // Validação dos campos obrigatórios
    if (!apiBrasilConfig.bearerToken?.trim()) {
      const errorMsg = 'O Bearer Token da API Brasil é obrigatório';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    if (!apiBrasilConfig.profileId?.trim()) {
      const errorMsg = 'O Profile ID da API Brasil é obrigatório';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }

    // Validação básica do formato do token (deve começar com 'ey' para JWT)
    if (!apiBrasilConfig.bearerToken.startsWith('ey')) {
      const errorMsg = 'Formato de token inválido. O token deve começar com "ey"';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }

    setApiBrasilConfig(prev => ({ ...prev, isLoading: true, error: '' }));
    
    try {
      const token = apiBrasilConfig.bearerToken.trim();
      const profileId = apiBrasilConfig.profileId.trim();
      
      console.log('Testando conexão com API Brasil...', { token: token.substring(0, 10) + '...', profileId });
      
      const response = await fetch('https://gateway.apibrasil.io/api/v2/whatsapp/status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'profile-id': profileId,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      // Verifica se a resposta é JSON válido
      let data;
      try {
        data = await response.json();
        console.log('Resposta da API Brasil:', data);
      } catch (jsonError) {
        console.error('Erro ao processar resposta JSON:', jsonError);
        throw new Error('Resposta inválida do servidor');
      }

      if (!response.ok) {
        console.error('Erro na resposta da API:', { status: response.status, data });
        const errorMsg = data?.message || data?.error?.message || `Erro HTTP ${response.status}`;
        throw new Error(errorMsg);
      }

      const isConnected = data.connected === true;
      
      setApiBrasilConfig(prev => ({
        ...prev,
        isConnected,
        isConfigured: true,
        isLoading: false,
        error: ''
      }));

      if (isConnected) {
        setIsConnected(true);
        setConnectionStatus('connected');
        toast.success('Conexão com API Brasil estabelecida com sucesso!');
        
        // Salva a configuração no localStorage
        localStorage.setItem('apiBrasilConfig', JSON.stringify({
          bearerToken: token,
          profileId,
          phoneNumber: apiBrasilConfig.phoneNumber,
          isConfigured: true,
          isConnected: true
        }));
      } else {
        setConnectionStatus('disconnected');
        setIsConnected(false);
        toast.warning('API Brasil conectada, mas o WhatsApp não está ativo');
      }

      return { success: true, connected: isConnected, data };
      
    } catch (error: any) {
      console.error('Erro ao testar conexão com API Brasil:', error);
      const errorMsg = error.message || 'Erro desconhecido ao conectar com a API Brasil';
      
      setApiBrasilConfig(prev => ({
        ...prev,
        error: errorMsg,
        isConnected: false,
        isLoading: false
      }));
      
      toast.error(`Erro na conexão: ${errorMsg}`);
      setIsConnected(false);
      setConnectionStatus('disconnected');
      
      return { success: false, error: errorMsg };
    }
  };

  // Carregar configurações salvas no localStorage ao iniciar
  React.useEffect(() => {
    const savedConfig = localStorage.getItem('apiBrasilConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setApiBrasilConfig(prev => ({
          ...prev,
          ...parsedConfig,
          isLoading: false
        }));
        
        // Se tiver token e profileId, testa a conexão
        if (parsedConfig.bearerToken && parsedConfig.profileId) {
          testApiBrasilConnection();
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }
  }, []);

  // Salvar configurações quando houver alterações
  React.useEffect(() => {
    if (apiBrasilConfig.bearerToken || apiBrasilConfig.profileId) {
      const { isLoading, ...configToSave } = apiBrasilConfig;
      localStorage.setItem('apiBrasilConfig', JSON.stringify(configToSave));
    }
  }, [apiBrasilConfig]);

  // Abrir modal para novo template
  const handleNewTemplate = () => {
    setEditing(false);
    setForm({ ...initialForm, id: null });
    setModalOpen(true);
  };

  // Abrir modal para editar
  const handleEditTemplate = (tpl: any) => {
    setEditing(true);
    setForm({ ...tpl });
    setModalOpen(true);
  };

  // Salvar novo ou editar
  const handleSaveTemplate = () => {
    if (!form.title.trim() || !form.tag.trim() || !form.content.trim()) {
      toast.error('Preencha todos os campos obrigatórios!');
      return;
    }
    if (editing) {
      setTemplates((prev) => prev.map((tpl) => tpl.id === form.id ? { ...form } : tpl));
      toast.success('Template atualizado com sucesso!');
    } else {
      setTemplates((prev) => [
        ...prev,
        { ...form, id: Date.now(), sent: 0, delivery: 0, variables: form.variables || 1, status: 'Ativo', read: false }
      ]);
      toast.success('Template criado com sucesso!');
    }
    setModalOpen(false);
  };

  // Abrir modal de confirmação de exclusão
  const handleDeleteTemplate = (tpl: any) => {
    setTemplateToDelete(tpl);
    setDeleteModalOpen(true);
  };

  // Confirmar exclusão
  const confirmDeleteTemplate = () => {
    setTemplates((prev) => prev.filter((tpl) => tpl.id !== templateToDelete.id));
    setDeleteModalOpen(false);
    toast.success('Template excluído com sucesso!');
  };

  // Efeito para verificar periodicamente o status da conexão
  useEffect(() => {
    const checkConnection = async () => {
      if (!apiBrasilConfig.bearerToken || !apiBrasilConfig.profileId) return;
      
      try {
        const { success, data } = await checkConnectionStatus(
          apiBrasilConfig.bearerToken, 
          apiBrasilConfig.profileId
        );
        
        if (success) {
          const connected = data?.connected === true;
          setIsConnected(connected);
          setConnectionStatus(connected ? 'connected' : 'disconnected');
          
          setApiBrasilConfig(prev => ({
            ...prev,
            isConnected: connected,
            isLoading: false,
            isConfigured: true
          }));
        }
      } catch (error) {
        console.error('Erro ao verificar conexão:', error);
        setIsConnected(false);
        setConnectionStatus('disconnected');
      }
    };

    // Verificar a conexão imediatamente e a cada 30 segundos
    checkConnection();
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, [apiBrasilConfig.bearerToken, apiBrasilConfig.profileId]);

  return (
    <WhatsAppStatusContext.Provider value={{ isConnected, connectionStatus, setIsConnected, setConnectionStatus }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
          <div>
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-8 h-8 text-green-500" />
              <h1 className="text-3xl font-bold text-green-400">WhatsApp <span className="text-white">Business</span></h1>
            </div>
            <p className="text-gray-400 mt-1">Gerencie integrações, templates e automações do WhatsApp</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="border-gray-600 text-white hover:bg-gray-700" 
              onClick={() => setConfigModalOpen(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700" 
              onClick={handleNewTemplate}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Template
            </Button>
          </div>
        </div>

        {/* Modal de Configuração */}
        <Dialog open={configModalOpen} onOpenChange={setConfigModalOpen}>
          <DialogContent className="bg-[#1f2937] text-white max-w-2xl w-full p-0 rounded-xl shadow-xl border border-gray-700">
            <div className="p-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-6 h-6 text-green-500" />
                <span className="text-lg font-semibold text-white">Configurar WhatsApp Business</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">Envio de mensagens via WhatsApp</p>
              
              {/* Seção de Configuração da API Brasil */}
              <APIBrasilRealtimeSection 
                apiToken={apiBrasilConfig.bearerToken}
                profileId={apiBrasilConfig.profileId}
                isConnected={isConnected}
                setIsConnected={setIsConnected}
                setConnectionStatus={setConnectionStatus}
                setQrCodeData={setQrCodeData}
                qrCodeData={qrCodeData}
                isLoadingQR={isLoadingQR}
                setIsLoadingQR={setIsLoadingQR}
              />
              
              {/* Botão de salvar configurações */}
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={() => {
                    // Validar campos obrigatórios
                    if (!apiBrasilConfig.bearerToken || !apiBrasilConfig.profileId) {
                      toast.error('Preencha todos os campos obrigatórios');
                      return;
                    }
                    
                    // Atualizar status de configuração
                    setApiBrasilConfig(prev => ({
                      ...prev,
                      isConfigured: true,
                      error: ''
                    }));
                    
                    // Fechar o modal
                    setConfigModalOpen(false);
                    
                    toast.success('Configurações salvas com sucesso!');
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Salvar Configurações
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Resto do conteúdo da página */}
        {/* ... */}
      </div>
    </WhatsAppStatusContext.Provider>
  );
};

export default AdminWhatsApp;