import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { CheckCircle, MessageSquare, Clock, FileText, Zap, Settings, Trash2, Edit, Plus, Eye, EyeOff, Download, Upload, Users, Loader2, Shield, Activity, ArrowUp } from 'lucide-react';
// Integração Evolution API substituirá qualquer configuração antiga
import { useNavigate } from "react-router-dom";

// templates mock removido — inicializar vazio para usar dados reais

const initialForm = { id: null, title: '', status: 'Ativo', tag: '', content: '', variables: 1 };

const MAX_TEMPLATES = 5; // Limite de templates para o plano Essencial

type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

const ClientWhatsApp: React.FC = () => {
  const navigate = useNavigate();
  // Configuração Evolution API (Docker local)
  const [evolutionConfig, setEvolutionConfig] = useState({
    baseUrl: 'http://localhost:8080',
    apiKey: '',
    instanceName: '',
    testPhone: '',
  });
  const [evolutionStatus, setEvolutionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');
  const [showApiKey, setShowApiKey] = useState(false);
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
  const [templates, setTemplates] = useState<any[]>([]);
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
        payload: { ...payload, token: token.substring(0, 10) + '...' }
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
    if (!apiBrasilConfig.phoneNumber?.trim()) {
      toast.error('Informe um número de telefone para teste', {
        description: 'Exemplo: 11999999999 (com DDD, sem o +55)'
      });
      return;
    }

    if (!apiBrasilConfig.bearerToken?.trim() || !apiBrasilConfig.profileId?.trim()) {
      toast.error('Configure o Token e o Profile ID antes de testar', {
        action: {
          label: 'Configurar',
          onClick: () => setConfigModalOpen(true)
        }
      });
      return;
    }

    const testMessage = `🚀 *Mensagem de Teste*\n\n` +
      `Olá! Esta é uma mensagem de teste enviada através da integração com a API Brasil.\n\n` +
      `📱 *Detalhes:*\n` +
      `• Data: ${new Date().toLocaleString('pt-BR')}\n` +
      `• Status: Conexão ativa\n\n` +
      `✅ Se você recebeu esta mensagem, a integração está funcionando perfeitamente!`;
    
    const toastId = toast.loading('Enviando mensagem de teste...');
    
    try {
      const result = await sendWhatsAppMessage(apiBrasilConfig.phoneNumber, testMessage);
      
      if (result.success) {
        toast.success('Mensagem de teste enviada com sucesso!', {
          id: toastId,
          description: `Para: ${apiBrasilConfig.phoneNumber}`,
          duration: 5000
        });
        
        setApiBrasilConfig(prev => ({
          ...prev,
          isConnected: true,
          error: ''
        }));
        setConnectionStatus('connected');
        setIsConnected(true);
        
      } else {
        throw new Error(result.error || 'Falha ao enviar mensagem de teste');
      }
      
      return result;
      
    } catch (error: any) {
      const errorMessage = error.message || 'Erro desconhecido ao enviar mensagem de teste';
      
      toast.error(`Falha no teste: ${errorMessage}`, {
        id: toastId,
        duration: 8000,
        action: {
          label: 'Tentar novamente',
          onClick: handleTestMessage
        }
      });
      
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

    if (!apiBrasilConfig.bearerToken.startsWith('ey')) {
      const errorMsg = 'Formato de token inválido. O token deve começar com "ey"';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }

    setApiBrasilConfig(prev => ({ ...prev, isLoading: true, error: '' }));
    
    try {
      const token = apiBrasilConfig.bearerToken.trim();
      const profileId = apiBrasilConfig.profileId.trim();
      
      if (token === MOCK_CREDENTIALS.BEARER_TOKEN || 
          profileId === MOCK_CREDENTIALS.PROFILE_ID ||
          token.includes('MOCK_TOKEN_FOR_TESTING')) {
        localStorage.setItem('useApiBrasilMock', 'true');
        toast.info('Modo de teste ativado automaticamente');
      }
      
      console.log('Testando conexão com API Brasil...', { token: token.substring(0, 10) + '...', profileId });
      
      const statusRes = await checkConnectionStatus(token, profileId);
      
      if (!statusRes.success) {
        throw new Error(statusRes.error || 'Erro ao verificar conexão');
      }

      const isConnected = statusRes.data?.connected === true;
      const data = statusRes.data;
      
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
    const savedConfig = localStorage.getItem('evolutionConfig');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setEvolutionConfig(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Erro ao carregar evolutionConfig:', error);
      }
    }
  }, []);

  // Salvar configurações quando houver alterações
  React.useEffect(() => {
    localStorage.setItem('evolutionConfig', JSON.stringify(evolutionConfig));
  }, [evolutionConfig]);

  // Abrir modal para novo template
  const handleNewTemplate = () => {
    if (templates.length >= MAX_TEMPLATES) {
      toast.error(`Você atingiu o limite de ${MAX_TEMPLATES} templates do seu plano. Para adicionar mais templates, faça upgrade do seu plano.`);
      return;
    }
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
    if (templates.length >= MAX_TEMPLATES && !editing) {
      toast.error(`Você atingiu o limite de ${MAX_TEMPLATES} templates do seu plano. Para adicionar mais templates, faça upgrade do seu plano.`);
      return;
    }

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
      const { baseUrl, apiKey, instanceName } = evolutionConfig;
      if (!baseUrl || !apiKey || !instanceName) return;
      try {
        const res = await fetch(`${baseUrl.replace(/\/$/, '')}/instance/connectionState/${encodeURIComponent(instanceName)}`, {
          headers: { apikey: apiKey },
        });
        const data = await res.json().catch(() => ({}));
        const state: string = data?.state || data?.status || '';
        const connected = /connected/i.test(state);
        setIsConnected(connected);
        setEvolutionStatus(connected ? 'connected' : /connecting|qr|pairing/i.test(state) ? 'connecting' : 'disconnected');
      } catch (error) {
        setIsConnected(false);
        setEvolutionStatus('disconnected');
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, [evolutionConfig.baseUrl, evolutionConfig.apiKey, evolutionConfig.instanceName]);

  return (
    <div className="p-6 min-h-screen bg-[#09090b] space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-8 h-8 text-green-500" />
            <h1 className="text-3xl font-bold text-green-400">
              WhatsApp <span className="text-white">Business</span> ({templates.length}/{MAX_TEMPLATES})
            </h1>
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
            disabled={templates.length >= MAX_TEMPLATES}
          >
            <Plus className="w-4 h-4 mr-2" />
            {templates.length >= MAX_TEMPLATES ? `Limite atingido (${MAX_TEMPLATES}/${MAX_TEMPLATES})` : "Novo Template"}
          </Button>
        </div>
      </div>

      {/* Aviso de limite de templates */}
      {templates.length >= MAX_TEMPLATES && (
        <div className="bg-yellow-900/40 border border-yellow-700 text-yellow-300 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Shield className="w-5 h-5 flex-shrink-0" />
              <div>
                <strong>Limite de templates atingido!</strong>
                <p className="text-sm mt-1">
                  Você atingiu o limite de {MAX_TEMPLATES} templates do seu plano Essencial. 
                  Para adicionar mais templates, faça upgrade do seu plano.
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  const pricingElement = document.getElementById('pricing');
                  if (pricingElement) {
                    pricingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 font-semibold shadow-lg shadow-purple-500/50 whitespace-nowrap"
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              Fazer Upgrade
            </Button>
          </div>
        </div>
      )}

      {templates.length >= MAX_TEMPLATES - 1 && templates.length < MAX_TEMPLATES && (
        <div className="bg-blue-900/40 border border-blue-700 text-blue-300 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            <div>
              <strong>Atenção: Limite próximo!</strong>
              <p className="text-sm mt-1">
                Você tem {templates.length} de {MAX_TEMPLATES} templates. 
                Ainda pode adicionar {MAX_TEMPLATES - templates.length} template(s).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status da Conexão */}
      <Card className="bg-[#1f2937] border border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            Status da Conexão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300">
                WhatsApp {isConnected ? 'Conectado' : 'Desconectado'}
              </p>
              <p className="text-sm text-gray-400">
                {evolutionStatus === 'connected' ? 'Pronto para enviar mensagens' : 'Configure a integração para começar'}
              </p>
            </div>
            <Badge className={isConnected ? 'bg-green-700 text-green-200' : 'bg-red-700 text-red-200'}>
              {evolutionStatus}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Configuração - Evolution API */}
      <Dialog open={configModalOpen} onOpenChange={setConfigModalOpen}>
        <DialogContent className="bg-[#1f2937] text-white max-w-4xl w-full p-0 rounded-xl shadow-xl border border-gray-700 flex flex-col max-h-[90vh] overflow-y-auto scrollbar-hide">
          <div className="p-6 w-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-green-500" />
                  Configurar WhatsApp Business (Evolution API)
                </h2>
                <p className="text-gray-400 text-sm mt-1">Configure a integração com a Evolution API (Docker local)</p>
              </div>
            </div>
            
            {/* Campos de Configuração da Evolution API */}
            <div className="space-y-6 mb-6">
              <div className="bg-[#23272f] border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Credenciais da Evolution API</h3>
                
                <div className="space-y-4">
                  {/* Evolution API URL */}
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Evolution API URL</label>
                    <Input
                      type="text"
                      placeholder="http://localhost:8080"
                      className="bg-[#1f2937] border border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                      value={evolutionConfig.baseUrl}
                      onChange={(e) => setEvolutionConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                    />
                  </div>

                  {/* API Key */}
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">API Key</label>
                    <div className="relative">
                      <Input
                        type={showApiKey ? 'text' : 'password'}
                        placeholder="Sua API Key"
                        className="bg-[#1f2937] border border-gray-600 text-white placeholder-gray-400 focus:border-green-500 pr-10"
                        value={evolutionConfig.apiKey}
                        onChange={(e) => setEvolutionConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Instance Name */}
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Instance Name</label>
                    <Input
                      type="text"
                      placeholder="minha-instancia"
                      className="bg-[#1f2937] border border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                      value={evolutionConfig.instanceName}
                      onChange={(e) => setEvolutionConfig(prev => ({ ...prev, instanceName: e.target.value }))}
                    />
                  </div>

                  {/* Número para teste */}
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Número para teste</label>
                    <Input
                      type="text"
                      placeholder="Telefone completo com DDI e DDD (e.g., 5511999999999)"
                      className="bg-[#1f2937] border border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                      value={evolutionConfig.testPhone}
                      onChange={(e) => setEvolutionConfig(prev => ({ ...prev, testPhone: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    localStorage.setItem('evolutionConfig', JSON.stringify(evolutionConfig));
                    toast.success('Configurações salvas');
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Salvar Configurações
                </Button>
                <Button 
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-700"
                  onClick={async () => {
                    const { baseUrl, apiKey, instanceName } = evolutionConfig;
                    if (!baseUrl || !apiKey || !instanceName) {
                      toast.error('Preencha URL, API Key e Instance Name');
                      return;
                    }
                    setEvolutionStatus('connecting');
                    try {
                      const createRes = await fetch(`${baseUrl.replace(/\/$/, '')}/instance/create`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', apikey: apiKey },
                        body: JSON.stringify({ instanceName, integration: 'WHATSAPP-BAILEYS' }),
                      });
                      const createData = await createRes.json().catch(() => ({}));
                      const base64 = createData?.qrcode?.base64;
                      if (base64) {
                        const html = `<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>QR Code - Evolution API</title></head><body style=\"display:flex;align-items:center;justify-content:center;height:100vh;background:#111;color:#eee\"><div style=\"text-align:center\"><h1>Escaneie o QR Code no WhatsApp</h1><img alt=\"QR Code\" src=\"data:image/png;base64,${base64}\" style=\"max-width:80vw;max-height:80vh;border:8px solid #333;border-radius:12px\"/><p style=\"margin-top:16px\">Instância: ${instanceName}</p></div></body></html>`;
                        const blob = new Blob([html], { type: 'text/html' });
                        const url = URL.createObjectURL(blob);
                        window.open(url, '_blank');
                      }
                      const statusRes = await fetch(`${baseUrl.replace(/\/$/, '')}/instance/connectionState/${encodeURIComponent(instanceName)}`, {
                        method: 'GET',
                        headers: { apikey: apiKey },
                      });
                      const statusData = await statusRes.json().catch(() => ({}));
                      const state: string = statusData?.state || statusData?.status || '';
                      if (/connected/i.test(state)) {
                        setEvolutionStatus('connected');
                        setIsConnected(true);
                        toast.success('Instância conectada');
                      } else if (/connecting|qr|pairing/i.test(state)) {
                        setEvolutionStatus('connecting');
                        setIsConnected(false);
                        toast.info('Instância em processo de conexão');
                      } else {
                        setEvolutionStatus('disconnected');
                        setIsConnected(false);
                        toast.warning('Instância desconectada');
                      }
                    } catch (err: any) {
                      setEvolutionStatus('disconnected');
                      setIsConnected(false);
                      toast.error(`Erro ao testar conexão: ${err?.message || 'desconhecido'}`);
                    }
                  }}
                >
                  Testar Conexão
                </Button>
                <Button 
                  variant="outline"
                  className="border-gray-600 text-gray-400 hover:text-white"
                  onClick={() => setConfigModalOpen(false)}
                >
                  Fechar Modal
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Novo/Editar Template */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#1f2937] text-white max-w-4xl w-full p-0 rounded-xl shadow-xl border border-gray-700 flex flex-col max-h-[90vh] overflow-y-auto scrollbar-hide">
          <div className="p-6 w-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {editing ? 'Editar Template' : 'Novo Template'}
              </h2>
            </div>

            <div className="space-y-6">
              {/* Título do Template */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Título do Template <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Ex: Confirmação de Agendamento"
                  className="bg-[#23272f] border border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              {/* Tag */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Tag <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Ex: confirmação, lembrete, marketing"
                  className="bg-[#23272f] border border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Use tags para categorizar seus templates
                </p>
              </div>

              {/* Conteúdo da Mensagem */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Conteúdo da Mensagem <span className="text-red-500">*</span>
                </label>
                <div className="mb-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-xs text-gray-400">Variáveis disponíveis:</span>
                    {['nome', 'servico', 'data', 'hora', 'valor', 'pix', 'promocao', 'desconto', 'validade'].map(v => (
                      <button
                        key={v}
                        type="button"
                        className="bg-green-900/60 text-green-200 rounded-full px-3 py-1 text-xs font-semibold border border-green-700 hover:bg-green-800 hover:text-white transition"
                        onClick={() => {
                          const textarea = document.getElementById('template-content') as HTMLTextAreaElement;
                          if (textarea) {
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const before = form.content.substring(0, start);
                            const after = form.content.substring(end);
                            const insert = `{{${v}}}`;
                            setForm({ ...form, content: before + insert + after });
                            setTimeout(() => {
                              textarea.focus();
                              textarea.selectionStart = textarea.selectionEnd = start + insert.length;
                            }, 0);
                          } else {
                            setForm({ ...form, content: form.content + ` {{${v}}}` });
                          }
                        }}
                      >
                        {`{{${v}}}`}
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea
                  id="template-content"
                  placeholder="Digite o conteúdo da mensagem. Use {{variavel}} para personalização."
                  rows={6}
                  className="bg-[#23272f] border border-gray-600 text-white placeholder-gray-400 focus:border-green-500 resize-none"
                  value={form.content}
                  onChange={(e) => {
                    const content = e.target.value;
                    const variables = (content.match(/\{\{(\w+)\}\}/g) || []).map(v => v.replace(/[{}]/g, ''));
                    setForm({ ...form, content, variables: variables.length });
                  }}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Variáveis detectadas: {form.variables || 0}
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Status
                </label>
                <Select
                  value={form.status}
                  onValueChange={(value) => setForm({ ...form, status: value })}
                >
                  <SelectTrigger className="bg-[#23272f] border border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Visualização */}
              {form.content && (
                <div className="bg-[#181825] border border-green-800 rounded-lg p-4">
                  <div className="font-semibold text-green-300 mb-2">Visualização:</div>
                  <div className="text-gray-200 whitespace-pre-line">
                    {form.content.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
                      const examples: { [key: string]: string } = {
                        nome: 'João Silva',
                        servico: 'Consulta Médica',
                        data: '15/01/2025',
                        hora: '14:30',
                        valor: 'R$ 150,00',
                        pix: 'chave@email.com',
                        promocao: 'Desconto de 20%',
                        desconto: '20%',
                        validade: '31/01/2025'
                      };
                      return examples[varName] || `[${varName}]`;
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-gray-700">
              <Button
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="border-gray-600 text-gray-400 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveTemplate}
                className="bg-green-600 hover:bg-green-700"
                disabled={!form.title.trim() || !form.tag.trim() || !form.content.trim() || (templates.length >= MAX_TEMPLATES && !editing)}
              >
                {editing ? 'Atualizar Template' : 'Criar Template'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="bg-[#1f2937] text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-gray-400">
              Tem certeza que deseja excluir o template "{templateToDelete?.title}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              className="border-gray-600 text-gray-400 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmDeleteTemplate}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lista de Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="bg-[#23272f] border border-gray-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg">{template.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={template.status === 'Ativo' ? 'default' : 'secondary'}>
                      {template.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {template.tag}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                {template.content}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span>📤 {template.sent} enviadas</span>
                <span>✅ {template.delivery}% entrega</span>
                <span>🔢 {template.variables} variáveis</span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white"
                  onClick={() => handleEditTemplate(template)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  onClick={() => handleDeleteTemplate(template)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientWhatsApp;
