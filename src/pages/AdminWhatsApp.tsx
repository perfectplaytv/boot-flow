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
import { WhatsAppQRCode } from '@/components/WhatsAppQRCode';
import { SendWhatsAppMessage } from '@/components/SendWhatsAppMessage';
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

export const WhatsAppStatusContext = createContext({
  isConnected: false,
  connectionStatus: 'disconnected',
  setIsConnected: (v: boolean) => {},
  setConnectionStatus: (v: string) => {},
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
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isLoadingQR, setIsLoadingQR] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

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

  // Funções para conexão WhatsApp
  const generateQRCode = async () => {
    setIsLoadingQR(true);
    try {
      // Simular geração de QR Code real
      // Em produção, isso seria uma chamada para a API do WhatsApp Business
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Gerar um QR Code real usando uma biblioteca como qrcode
      // Por enquanto, vamos usar um QR Code de exemplo
      const qrCodeUrl = `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
          <rect width="200" height="200" fill="white"/>
          <g fill="black">
            <rect x="20" y="20" width="8" height="8"/>
            <rect x="32" y="20" width="8" height="8"/>
            <rect x="44" y="20" width="8" height="8"/>
            <rect x="56" y="20" width="8" height="8"/>
            <rect x="68" y="20" width="8" height="8"/>
            <rect x="80" y="20" width="8" height="8"/>
            <rect x="92" y="20" width="8" height="8"/>
            <rect x="104" y="20" width="8" height="8"/>
            <rect x="116" y="20" width="8" height="8"/>
            <rect x="128" y="20" width="8" height="8"/>
            <rect x="140" y="20" width="8" height="8"/>
            <rect x="152" y="20" width="8" height="8"/>
            <rect x="164" y="20" width="8" height="8"/>
            <rect x="176" y="20" width="8" height="8"/>
            <rect x="20" y="32" width="8" height="8"/>
            <rect x="32" y="32" width="8" height="8"/>
            <rect x="44" y="32" width="8" height="8"/>
            <rect x="56" y="32" width="8" height="8"/>
            <rect x="68" y="32" width="8" height="8"/>
            <rect x="80" y="32" width="8" height="8"/>
            <rect x="92" y="32" width="8" height="8"/>
            <rect x="104" y="32" width="8" height="8"/>
            <rect x="116" y="32" width="8" height="8"/>
            <rect x="128" y="32" width="8" height="8"/>
            <rect x="140" y="32" width="8" height="8"/>
            <rect x="152" y="32" width="8" height="8"/>
            <rect x="164" y="32" width="8" height="8"/>
            <rect x="176" y="32" width="8" height="8"/>
            <rect x="20" y="44" width="8" height="8"/>
            <rect x="32" y="44" width="8" height="8"/>
            <rect x="44" y="44" width="8" height="8"/>
            <rect x="56" y="44" width="8" height="8"/>
            <rect x="68" y="44" width="8" height="8"/>
            <rect x="80" y="44" width="8" height="8"/>
            <rect x="92" y="44" width="8" height="8"/>
            <rect x="104" y="44" width="8" height="8"/>
            <rect x="116" y="44" width="8" height="8"/>
            <rect x="128" y="44" width="8" height="8"/>
            <rect x="140" y="44" width="8" height="8"/>
            <rect x="152" y="44" width="8" height="8"/>
            <rect x="164" y="44" width="8" height="8"/>
            <rect x="176" y="44" width="8" height="8"/>
            <rect x="20" y="56" width="8" height="8"/>
            <rect x="32" y="56" width="8" height="8"/>
            <rect x="44" y="56" width="8" height="8"/>
            <rect x="56" y="56" width="8" height="8"/>
            <rect x="68" y="56" width="8" height="8"/>
            <rect x="80" y="56" width="8" height="8"/>
            <rect x="92" y="56" width="8" height="8"/>
            <rect x="104" y="56" width="8" height="8"/>
            <rect x="116" y="56" width="8" height="8"/>
            <rect x="128" y="56" width="8" height="8"/>
            <rect x="140" y="56" width="8" height="8"/>
            <rect x="152" y="56" width="8" height="8"/>
            <rect x="164" y="56" width="8" height="8"/>
            <rect x="176" y="56" width="8" height="8"/>
            <rect x="20" y="68" width="8" height="8"/>
            <rect x="32" y="68" width="8" height="8"/>
            <rect x="44" y="68" width="8" height="8"/>
            <rect x="56" y="68" width="8" height="8"/>
            <rect x="68" y="68" width="8" height="8"/>
            <rect x="80" y="68" width="8" height="8"/>
            <rect x="92" y="68" width="8" height="8"/>
            <rect x="104" y="68" width="8" height="8"/>
            <rect x="116" y="68" width="8" height="8"/>
            <rect x="128" y="68" width="8" height="8"/>
            <rect x="140" y="68" width="8" height="8"/>
            <rect x="152" y="68" width="8" height="8"/>
            <rect x="164" y="68" width="8" height="8"/>
            <rect x="176" y="68" width="8" height="8"/>
            <rect x="20" y="80" width="8" height="8"/>
            <rect x="32" y="80" width="8" height="8"/>
            <rect x="44" y="80" width="8" height="8"/>
            <rect x="56" y="80" width="8" height="8"/>
            <rect x="68" y="80" width="8" height="8"/>
            <rect x="80" y="80" width="8" height="8"/>
            <rect x="92" y="80" width="8" height="8"/>
            <rect x="104" y="80" width="8" height="8"/>
            <rect x="116" y="80" width="8" height="8"/>
            <rect x="128" y="80" width="8" height="8"/>
            <rect x="140" y="80" width="8" height="8"/>
            <rect x="152" y="80" width="8" height="8"/>
            <rect x="164" y="80" width="8" height="8"/>
            <rect x="176" y="80" width="8" height="8"/>
            <rect x="20" y="92" width="8" height="8"/>
            <rect x="32" y="92" width="8" height="8"/>
            <rect x="44" y="92" width="8" height="8"/>
            <rect x="56" y="92" width="8" height="8"/>
            <rect x="68" y="92" width="8" height="8"/>
            <rect x="80" y="92" width="8" height="8"/>
            <rect x="92" y="92" width="8" height="8"/>
            <rect x="104" y="92" width="8" height="8"/>
            <rect x="116" y="92" width="8" height="8"/>
            <rect x="128" y="92" width="8" height="8"/>
            <rect x="140" y="92" width="8" height="8"/>
            <rect x="152" y="92" width="8" height="8"/>
            <rect x="164" y="92" width="8" height="8"/>
            <rect x="176" y="92" width="8" height="8"/>
            <rect x="20" y="104" width="8" height="8"/>
            <rect x="32" y="104" width="8" height="8"/>
            <rect x="44" y="104" width="8" height="8"/>
            <rect x="56" y="104" width="8" height="8"/>
            <rect x="68" y="104" width="8" height="8"/>
            <rect x="80" y="104" width="8" height="8"/>
            <rect x="92" y="104" width="8" height="8"/>
            <rect x="104" y="104" width="8" height="8"/>
            <rect x="116" y="104" width="8" height="8"/>
            <rect x="128" y="104" width="8" height="8"/>
            <rect x="140" y="104" width="8" height="8"/>
            <rect x="152" y="104" width="8" height="8"/>
            <rect x="164" y="104" width="8" height="8"/>
            <rect x="176" y="104" width="8" height="8"/>
            <rect x="20" y="116" width="8" height="8"/>
            <rect x="32" y="116" width="8" height="8"/>
            <rect x="44" y="116" width="8" height="8"/>
            <rect x="56" y="116" width="8" height="8"/>
            <rect x="68" y="116" width="8" height="8"/>
            <rect x="80" y="116" width="8" height="8"/>
            <rect x="92" y="116" width="8" height="8"/>
            <rect x="104" y="116" width="8" height="8"/>
            <rect x="116" y="116" width="8" height="8"/>
            <rect x="128" y="116" width="8" height="8"/>
            <rect x="140" y="116" width="8" height="8"/>
            <rect x="152" y="116" width="8" height="8"/>
            <rect x="164" y="116" width="8" height="8"/>
            <rect x="176" y="116" width="8" height="8"/>
            <rect x="20" y="128" width="8" height="8"/>
            <rect x="32" y="128" width="8" height="8"/>
            <rect x="44" y="128" width="8" height="8"/>
            <rect x="56" y="128" width="8" height="8"/>
            <rect x="68" y="128" width="8" height="8"/>
            <rect x="80" y="128" width="8" height="8"/>
            <rect x="92" y="128" width="8" height="8"/>
            <rect x="104" y="128" width="8" height="8"/>
            <rect x="116" y="128" width="8" height="8"/>
            <rect x="128" y="128" width="8" height="8"/>
            <rect x="140" y="128" width="8" height="8"/>
            <rect x="152" y="128" width="8" height="8"/>
            <rect x="164" y="128" width="8" height="8"/>
            <rect x="176" y="128" width="8" height="8"/>
            <rect x="20" y="140" width="8" height="8"/>
            <rect x="32" y="140" width="8" height="8"/>
            <rect x="44" y="140" width="8" height="8"/>
            <rect x="56" y="140" width="8" height="8"/>
            <rect x="68" y="140" width="8" height="8"/>
            <rect x="80" y="140" width="8" height="8"/>
            <rect x="92" y="140" width="8" height="8"/>
            <rect x="104" y="140" width="8" height="8"/>
            <rect x="116" y="140" width="8" height="8"/>
            <rect x="128" y="140" width="8" height="8"/>
            <rect x="140" y="140" width="8" height="8"/>
            <rect x="152" y="140" width="8" height="8"/>
            <rect x="164" y="140" width="8" height="8"/>
            <rect x="176" y="140" width="8" height="8"/>
            <rect x="20" y="152" width="8" height="8"/>
            <rect x="32" y="152" width="8" height="8"/>
            <rect x="44" y="152" width="8" height="8"/>
            <rect x="56" y="152" width="8" height="8"/>
            <rect x="68" y="152" width="8" height="8"/>
            <rect x="80" y="152" width="8" height="8"/>
            <rect x="92" y="152" width="8" height="8"/>
            <rect x="104" y="152" width="8" height="8"/>
            <rect x="116" y="152" width="8" height="8"/>
            <rect x="128" y="152" width="8" height="8"/>
            <rect x="140" y="152" width="8" height="8"/>
            <rect x="152" y="152" width="8" height="8"/>
            <rect x="164" y="152" width="8" height="8"/>
            <rect x="176" y="152" width="8" height="8"/>
            <rect x="20" y="164" width="8" height="8"/>
            <rect x="32" y="164" width="8" height="8"/>
            <rect x="44" y="164" width="8" height="8"/>
            <rect x="56" y="164" width="8" height="8"/>
            <rect x="68" y="164" width="8" height="8"/>
            <rect x="80" y="164" width="8" height="8"/>
            <rect x="92" y="164" width="8" height="8"/>
            <rect x="104" y="164" width="8" height="8"/>
            <rect x="116" y="164" width="8" height="8"/>
            <rect x="128" y="164" width="8" height="8"/>
            <rect x="140" y="164" width="8" height="8"/>
            <rect x="152" y="164" width="8" height="8"/>
            <rect x="164" y="164" width="8" height="8"/>
            <rect x="176" y="164" width="8" height="8"/>
            <rect x="20" y="176" width="8" height="8"/>
            <rect x="32" y="176" width="8" height="8"/>
            <rect x="44" y="176" width="8" height="8"/>
            <rect x="56" y="176" width="8" height="8"/>
            <rect x="68" y="176" width="8" height="8"/>
            <rect x="80" y="176" width="8" height="8"/>
            <rect x="92" y="176" width="8" height="8"/>
            <rect x="104" y="176" width="8" height="8"/>
            <rect x="116" y="176" width="8" height="8"/>
            <rect x="128" y="176" width="8" height="8"/>
            <rect x="140" y="176" width="8" height="8"/>
            <rect x="152" y="176" width="8" height="8"/>
            <rect x="164" y="176" width="8" height="8"/>
            <rect x="176" y="176" width="8" height="8"/>
          </g>
        </svg>
      `)}`;
      
      setQrCodeData(qrCodeUrl);
      setConnectionStatus('connecting');
      toast.success('QR Code gerado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar QR Code');
    } finally {
      setIsLoadingQR(false);
    }
  };

  const handleRefreshQR = () => {
    setQrCodeData(null);
    generateQRCode();
  };

  const handleTestConnection = async () => {
    if (config.provider === 'API Brasil') {
      return testApiBrasilConnection();
    }
    
    try {
      setConnectionStatus('connecting');
      // Simular teste de conexão
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simular sucesso/fracasso aleatório
      const isSuccess = Math.random() > 0.3;
      
      if (isSuccess) {
        setIsConnected(true);
        setConnectionStatus('connected');
        setQrCodeData(null);
        toast.success('Conexão estabelecida com sucesso!');
      } else {
        setIsConnected(false);
        setConnectionStatus('disconnected');
        toast.error('Falha na conexão. Tente novamente.');
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      toast.error('Erro ao testar conexão');
    }
  };

  // Gerar QR Code quando modal abrir
  React.useEffect(() => {
    if (configModalOpen && !isConnected) {
      generateQRCode();
    }
  }, [configModalOpen]);

  // Simular desconexão periódica (para demonstração)
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected && Math.random() < 0.1) { // 10% chance de desconectar
        setIsConnected(false);
        setConnectionStatus('disconnected');
        toast.warning('WhatsApp desconectado. Reconecte para continuar.');
      }
    }, 30000); // Verificar a cada 30 segundos

    return () => clearInterval(interval);
  }, [isConnected]);

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
          <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700" onClick={() => setConfigModalOpen(true)}><Settings className="w-4 h-4 mr-2" />Configurar</Button>
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleNewTemplate}><Plus className="w-4 h-4 mr-2" />Novo Template</Button>
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
              {/* Status da Conexão */}
              <div className="bg-[#23272f] border border-gray-700 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300 font-medium">Status da Integração</span>
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded" 
                    size="sm"
                    onClick={handleTestConnection}
                  >
                    Testar Conexão
                  </Button>
                </div>
                
                {isConnected ? (
                  <div className="space-y-3">
                    <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold border border-green-500/30">
                      Conectado
                    </span>
                    <div className="flex gap-2">
                      <Button 
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs" 
                        size="sm"
                        onClick={() => {
                          setIsConnected(false);
                          setConnectionStatus('disconnected');
                          toast.info('WhatsApp desconectado');
                        }}
                      >
                        Desconectar
                      </Button>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs" 
                        size="sm"
                        onClick={handleTestConnection}
                      >
                        Verificar Status
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
                      <p className="text-orange-400 text-sm font-medium mb-1">
                        Desconectado! Seu WhatsApp não está conectado no momento
                      </p>
                      <p className="text-orange-300 text-xs">
                        Clique na imagem abaixo para recarregar o QR Code.
                      </p>
                    </div>
                    
                    {/* QR Code Area */}
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="bg-white p-4 rounded-lg shadow-lg">
                          {qrCodeData ? (
                            <img 
                              src={qrCodeData} 
                              alt="QR Code WhatsApp" 
                              className="w-48 h-48 cursor-pointer"
                              onClick={handleRefreshQR}
                            />
                          ) : (
                            <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded">
                              <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
                                <p className="text-gray-500 text-xs">Gerando QR Code...</p>
                              </div>
                            </div>
                          )}
                          <button 
                            onClick={handleRefreshQR}
                            className="absolute -bottom-2 -right-2 bg-gray-800 text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Help Section */}
                    <div className="mt-4">
                      <h4 className="text-gray-300 font-medium mb-3">Ajuda:</h4>
                      <div className="space-y-2">
                        <div className="bg-[#1f2937] border-l-4 border-blue-500 p-3 rounded-r-lg cursor-pointer hover:bg-[#374151] transition-colors">
                          <p className="text-gray-300 text-sm">QR Code não aparece.</p>
                        </div>
                        <div className="bg-[#1f2937] border-l-4 border-blue-500 p-3 rounded-r-lg cursor-pointer hover:bg-[#374151] transition-colors">
                          <p className="text-gray-300 text-sm">WhatsApp não conecta</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
            <div className="mb-4">
                <label className="block text-gray-300 mb-1 font-medium">Token do WhatsApp Business</label>
                <Input 
                  value={config.apiToken || ''} 
                  onChange={e => setConfig({ ...config, apiToken: e.target.value })} 
                  placeholder="Insira sua chave/token..." 
                  className="bg-[#23272f] border border-gray-600 text-white placeholder-gray-400 focus:border-green-500" 
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-300 mb-1 font-medium">URL do Webhook</label>
                <Input 
                  value={config.apiEndpoint || ''} 
                  onChange={e => setConfig({ ...config, apiEndpoint: e.target.value })} 
                  placeholder="https://sua-api.com/webhook" 
                  className="bg-[#23272f] border border-gray-600 text-white placeholder-gray-400 focus:border-green-500" 
                />
            </div>
              {/* Seção de Configuração da API Brasil */}
              <div className="mb-6">
                <WhatsAppQRCode 
                  token={apiBrasilConfig.bearerToken}
                  profileId={apiBrasilConfig.profileId}
                  onConnectionChange={(connected) => {
                    setApiBrasilConfig(prev => ({
                      ...prev,
                      isConnected: connected,
                      isLoading: false
                    }));
                    setIsConnected(connected);
                    setConnectionStatus(connected ? 'connected' : 'disconnected');
                  }}
                />
                
                {/* Configurações avançadas da API */}
                <div className="mt-4 bg-[#23272f] border border-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3">Configurações da API</h4>
                  
                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-medium mb-1">Bearer Token</label>
                    <div className="relative">
                      <Input
                        type={apiBrasilConfig.showToken ? 'text' : 'password'}
                        value={apiBrasilConfig.bearerToken || ''}
                        onChange={(e) => setApiBrasilConfig(prev => ({
                          ...prev, 
                          bearerToken: e.target.value,
                          isConnected: false
                        }))}
                        placeholder="Insira seu Bearer Token"
                        className="bg-[#1e2430] border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setApiBrasilConfig(prev => ({ 
                          ...prev, 
                          showToken: !prev.showToken 
                        }))}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {apiBrasilConfig.showToken ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Token de autenticação da API Brasil</p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-medium mb-1">Profile ID</label>
                    <Input
                      value={apiBrasilConfig.profileId || ''}
                      onChange={(e) => setApiBrasilConfig(prev => ({
                        ...prev, 
                        profileId: e.target.value,
                        isConnected: false
                      }))}
                      placeholder="Insira o Profile ID"
                      className="bg-[#1e2430] border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">ID do perfil na plataforma API Brasil</p>
                  </div>

                  <div className="mb-3">
                    <label className="block text-gray-300 text-sm font-medium mb-1">Número de Telefone</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-700 text-gray-300 text-sm">
                        +55
                      </span>
                      <Input
                        type="tel"
                        value={apiBrasilConfig.phoneNumber || ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setApiBrasilConfig(prev => ({ ...prev, phoneNumber: value }));
                        }}
                        placeholder="11999999999"
                        className="bg-[#1e2430] border-l-0 rounded-l-none border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Número de telefone com DDD (apenas números)</p>
                  </div>

                  {apiBrasilConfig.error && (
                    <div className="mb-3 p-2 text-sm text-red-400 bg-red-900/30 rounded border border-red-800">
                      {apiBrasilConfig.error}
                    </div>
                  )}
                </div>
                
                {/* Área de envio de mensagem de teste */}
                <div className="mt-4">
                  <SendWhatsAppMessage 
                    token={apiBrasilConfig.bearerToken}
                    profileId={apiBrasilConfig.profileId}
                    defaultPhoneNumber={apiBrasilConfig.phoneNumber}
                    onSendSuccess={() => {
                      toast.success('Mensagem de teste enviada com sucesso!');
                    }}
                    compact
                    showHeader={false}
                  />
                </div>
              </div>

              {/* Seção de Configurações Avançadas */}
              <div className="bg-[#23272f] border border-gray-700 rounded-lg p-4 mb-6">
                <span className="block text-white font-semibold mb-3">Configurações Avançadas</span>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="block text-gray-300 font-medium">Provedor de WhatsApp</span>
                    <span className="block text-xs text-gray-400">Selecione o serviço de WhatsApp</span>
                  </div>
                  <Select 
                    value={config.provider || 'whatsapp-web'}
                    onValueChange={(value) => setConfig({ ...config, provider: value })}
                  >
                    <SelectTrigger className="w-[180px] bg-[#1e2430] border-gray-600 text-white">
                      <SelectValue placeholder="Selecione o provedor" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1e2430] border-gray-600 text-white">
                      <SelectItem value="whatsapp-web">WhatsApp Web</SelectItem>
                      <SelectItem value="API Brasil">API Brasil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="block text-gray-300 font-medium">Auto-resposta</span>
                    <span className="block text-xs text-gray-400">Respostas automáticas quando offline</span>
                  </div>
                  <Switch checked={config.autoReply} onCheckedChange={v => setConfig({ ...config, autoReply: v })} />
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="block text-gray-300 font-medium">Logs detalhados</span>
                    <span className="block text-xs text-gray-400">Registrar todas as interações</span>
                  </div>
                  <Switch checked={config.logsDetalhados || false} onCheckedChange={v => setConfig({ ...config, logsDetalhados: v })} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-gray-300 font-medium">Modo de produção</span>
                    <span className="block text-xs text-gray-400">Usar configurações de produção</span>
                  </div>
                  <Switch checked={config.modoProducao || false} onCheckedChange={v => setConfig({ ...config, modoProducao: v })} />
                </div>
              </div>
            <div className="flex justify-end gap-2 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setConfigModalOpen(false)} 
                  className="border-gray-600 text-gray-400 hover:text-white px-6 py-2 rounded font-semibold"
                >
                  Cancelar
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold">
                  Salvar Integração
                </Button>
              </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-700/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Mensagens</CardTitle>
            <MessageSquare className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{templates.reduce((acc, t) => acc + t.sent, 0)}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-700/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Taxa de Entrega</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{templates.length ? (templates.reduce((acc, t) => acc + t.delivery, 0) / templates.length).toFixed(1) : '0'}%</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-700/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Taxa de Leitura</CardTitle>
            <Eye className="h-5 w-5 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">86.1%</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border border-yellow-700/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Tempo Médio</CardTitle>
            <Clock className="h-5 w-5 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">2.3min</div>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal: Templates */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-gray-700" style={{ backgroundColor: '#1F2937' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-green-400" />
                <CardTitle className="text-white">Templates de Mensagem</CardTitle>
              </div>
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleNewTemplate}><Plus className="w-4 h-4 mr-2" />Novo Template</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {templates.map((tpl) => (
                <div key={tpl.id} className="rounded-lg border border-gray-700 p-4 bg-[#232a36]">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-base font-semibold ${tpl.status === 'Ativo' ? 'text-green-400' : 'text-gray-400'}`}>{tpl.title}</span>
                      <Badge className={tpl.status === 'Ativo' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>{tpl.status}</Badge>
                      <Badge className="bg-gray-700 text-gray-300 border-gray-600">{tpl.tag}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-green-400" onClick={() => handleEditTemplate(tpl)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300" onClick={() => handleDeleteTemplate(tpl)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <div className="text-gray-300 mb-2 text-sm">{tpl.content}</div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span><MessageSquare className="inline w-4 h-4 mr-1 text-green-400" />{tpl.sent} enviadas</span>
                    <span><CheckCircle className="inline w-4 h-4 mr-1 text-green-400" />{tpl.delivery}% entrega</span>
                    <span><FileText className="inline w-4 h-4 mr-1 text-blue-400" />{tpl.variables} variáveis</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Coluna lateral: Status, Ações, Informações */}
        <div className="space-y-6">
          {/* Status da Conexão */}
          <Card className="border-gray-700" style={{ backgroundColor: '#1F2937' }}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><Zap className="w-5 h-5 text-green-400" /> Status da Conexão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">API Status</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Conectado</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Webhook</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Auto-resposta</span>
                <Switch checked={autoReply} onCheckedChange={setAutoReply} />
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700 mt-2">Testar Conexão</Button>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card className="border-gray-700" style={{ backgroundColor: '#1F2937' }}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><Settings className="w-5 h-5 text-purple-400" /> Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full border-gray-700 bg-gray-900 text-white hover:bg-gray-800 flex items-center justify-start"><Eye className="w-4 h-4 mr-2 text-blue-400" />Ver Histórico</Button>
              <Button variant="outline" className="w-full border-gray-700 bg-gray-900 text-white hover:bg-gray-800 flex items-center justify-start"><Zap className="w-4 h-4 mr-2 text-green-400" />Configurar Webhook</Button>
              <Button variant="outline" className="w-full border-gray-700 bg-gray-900 text-white hover:bg-gray-800 flex items-center justify-start"><Download className="w-4 h-4 mr-2 text-purple-400" />Exportar Relatórios</Button>
              <Button variant="outline" className="w-full border-gray-700 bg-gray-900 text-white hover:bg-gray-800 flex items-center justify-start"><Upload className="w-4 h-4 mr-2 text-green-400" />Importar Templates</Button>
            </CardContent>
          </Card>

          {/* Informações */}
          <Card className="border-gray-700" style={{ backgroundColor: '#1F2937' }}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><Users className="w-5 h-5 text-blue-400" /> Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center justify-between"><span>Clientes Ativos</span><span className="font-bold text-white">234</span></div>
              <div className="flex items-center justify-between"><span>Templates Ativos</span><span className="font-bold text-white">{templates.filter(t => t.status === 'Ativo').length}</span></div>
              <div className="flex items-center justify-between"><span>Última Sincronização</span><span className="text-gray-400">2min atrás</span></div>
              <div className="flex items-center justify-between"><span>Próximo Backup</span><span className="text-gray-400">23:00</span></div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Criar/Editar Template */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#232a36] border-gray-700 text-white max-w-lg">
          <DialogHeader>
            <CardTitle className="text-xl font-bold">{editing ? 'Editar Template' : 'Novo Template'}</CardTitle>
            <DialogDescription className="text-gray-400">Preencha os campos obrigatórios</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Título *</label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Tag *</label>
              <Input value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Conteúdo *</label>
              <Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="bg-gray-700 border-gray-600 text-white min-h-[80px]" />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Variáveis</label>
              <Input type="number" min={1} value={form.variables} onChange={e => setForm({ ...form, variables: Number(e.target.value) })} className="bg-gray-700 border-gray-600 text-white w-24" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveTemplate} className="bg-green-600 hover:bg-green-700">{editing ? 'Salvar' : 'Criar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="bg-[#232a36] border-gray-700 text-white max-w-md">
          <DialogHeader>
            <CardTitle className="text-xl font-bold">Excluir Template</CardTitle>
            <DialogDescription className="text-gray-400">Tem certeza que deseja excluir este template?</DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <span className="font-semibold text-green-400">{templateToDelete?.title}</span>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancelar</Button>
            <Button onClick={confirmDeleteTemplate} className="bg-red-600 hover:bg-red-700">Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </WhatsAppStatusContext.Provider>
  );
};

export default AdminWhatsApp; 