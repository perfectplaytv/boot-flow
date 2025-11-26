import { useState, useEffect } from 'react';
import { MessageSquare, Settings, Send, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Interfaces TypeScript para Evolution API
interface EvolutionConfig {
  baseUrl: string;
  apiKey: string;
  instanceName: string;
  testPhone: string;
}

interface EvolutionInstanceStatus {
  status: 'connecting' | 'open' | 'closed';
  instanceName: string;
}

interface EvolutionQrCode {
  base64: string;
  code: string;
}

interface EvolutionInstanceResponse {
  instance: {
    instanceName: string;
    status: string;
  };
  qrcode?: EvolutionQrCode;
}

const WhatsApp = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [config, setConfig] = useState<EvolutionConfig>({
    baseUrl: 'http://localhost:8080',
    apiKey: '',
    instanceName: '',
    testPhone: '',
  });
  const [instanceStatus, setInstanceStatus] = useState<string>('Desconectado');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [testMessage, setTestMessage] = useState('Teste de mensagem via Evolution API 🚀');

  // Carregar configurações do localStorage ao montar o componente
  useEffect(() => {
    const savedConfig = localStorage.getItem('evolutionConfig');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig) as EvolutionConfig;
      setConfig(parsed);
      // Verificar status ao carregar
      checkInstanceStatus(parsed);
    }
  }, []);

  // Função para salvar configurações
  const handleSaveConfig = () => {
    if (!config.apiKey || !config.instanceName) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    localStorage.setItem('evolutionConfig', JSON.stringify(config));
    toast.success('Configurações salvas com sucesso!');
  };

  // Função para abrir QR Code em nova aba
  const openQrWindow = (base64: string) => {
    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>QR Code - WhatsApp</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #ffffff;
            font-family: system-ui, -apple-system, sans-serif;
          }
          img {
            display: block;
            max-width: 90%;
            height: auto;
          }
          h1 {
            margin-bottom: 20px;
            color: #333;
          }
          p {
            color: #666;
            text-align: center;
            max-width: 400px;
          }
        </style>
      </head>
      <body>
        <h1>Escaneie o QR Code</h1>
        <p>Abra o WhatsApp no seu celular e escaneie este código para conectar</p>
        <img src="${base64}" alt="QR Code WhatsApp" />
      </body>
      </html>
    `;
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
    }
  };

  // Função para criar/atualizar instância
  const handleTestConnection = async () => {
    if (!config.apiKey || !config.instanceName) {
      toast.error('Configure a API Key e o nome da instância primeiro');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 1. Criar/Atualizar instância
      const createResponse = await fetch(`${config.baseUrl}/instance/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': config.apiKey,
        },
        body: JSON.stringify({
          instanceName: config.instanceName,
          integration: 'WHATSAPP-BAILEYS',
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.message || 'Erro ao criar instância');
      }

      const data: EvolutionInstanceResponse = await createResponse.json();
      
      toast.success('Instância criada com sucesso!');

      // 2. Se retornar QR Code, abrir em nova aba
      if (data.qrcode?.base64) {
        openQrWindow(data.qrcode.base64);
        toast.info('QR Code aberto em nova aba. Escaneie com seu WhatsApp.');
      }

      // 3. Verificar status da instância
      await checkInstanceStatus(config);

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao conectar com Evolution API';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error('Erro:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para verificar status da instância
  const checkInstanceStatus = async (cfg: EvolutionConfig) => {
    if (!cfg.apiKey || !cfg.instanceName) return;

    try {
      const response = await fetch(`${cfg.baseUrl}/instance/connectionState/${cfg.instanceName}`, {
        method: 'GET',
        headers: {
          'apikey': cfg.apiKey,
        },
      });

      if (!response.ok) {
        setInstanceStatus('Erro');
        return;
      }

      const data = await response.json();
      const status = data.state || data.status || 'closed';
      
      // Mapear status para português
      const statusMap: Record<string, string> = {
        'connecting': 'Conectando',
        'open': 'Conectado',
        'closed': 'Desconectado',
      };

      setInstanceStatus(statusMap[status] || 'Desconhecido');
    } catch (err) {
      setInstanceStatus('Erro');
      console.error('Erro ao verificar status:', err);
    }
  };

  // Função para enviar mensagem de teste
  const handleSendTestMessage = async () => {
    if (!config.apiKey || !config.instanceName || !config.testPhone) {
      toast.error('Configure todos os campos antes de enviar mensagem de teste');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${config.baseUrl}/message/sendText/${config.instanceName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': config.apiKey,
        },
        body: JSON.stringify({
          number: config.testPhone,
          text: testMessage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao enviar mensagem');
      }

      toast.success('Mensagem enviada com sucesso!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao enviar mensagem';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error('Erro:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (instanceStatus) {
      case 'Conectado':
        return <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Conectado</Badge>;
      case 'Conectando':
        return <Badge className="bg-yellow-600"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Conectando</Badge>;
      case 'Desconectado':
        return <Badge variant="secondary"><XCircle className="w-3 h-3 mr-1" /> Desconectado</Badge>;
      default:
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Erro</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text">Integração WhatsApp</h1>
              <p className="text-muted-foreground">Configure abaixo a conexão com a Evolution API para enviar mensagens pelo WhatsApp.</p>
            </div>
          </div>
        </div>

        {/* Card de Status e Configuração */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Status da Conexão</CardTitle>
                <CardDescription>
                  {config.instanceName ? `Instância: ${config.instanceName}` : 'Nenhuma instância configurada'}
                </CardDescription>
              </div>
              {getStatusBadge()}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {error && (
                <div className="p-3 bg-red-900/20 border border-red-900 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              <Button 
                onClick={() => setIsModalOpen(true)} 
                className="w-full"
                variant="outline"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurar
              </Button>

              {config.instanceName && (
                <Button 
                  onClick={() => checkInstanceStatus(config)}
                  variant="secondary"
                  className="w-full"
                  disabled={isLoading}
                >
                  <Loader2 className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Atualizar Status
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card de Envio de Mensagem de Teste */}
        {config.instanceName && instanceStatus === 'Conectado' && (
          <Card>
            <CardHeader>
              <CardTitle>Enviar mensagem de teste</CardTitle>
              <CardDescription>
                Número configurado: {config.testPhone || 'Não configurado'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="testMessage">Mensagem</Label>
                  <Input
                    id="testMessage"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="Digite a mensagem de teste"
                  />
                </div>
                <Button 
                  onClick={handleSendTestMessage}
                  disabled={isLoading || !config.testPhone}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isLoading ? 'Enviando...' : 'Enviar mensagem de teste'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal de Configuração */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Configurar WhatsApp Business</DialogTitle>
              <DialogDescription>
                Configure a conexão com a Evolution API
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="baseUrl">URL da Evolution API</Label>
                <Input
                  id="baseUrl"
                  value={config.baseUrl}
                  onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                  placeholder="http://localhost:8080"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key *</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  placeholder="Sua API Key"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instanceName">Nome da instância *</Label>
                <Input
                  id="instanceName"
                  value={config.instanceName}
                  onChange={(e) => setConfig({ ...config, instanceName: e.target.value })}
                  placeholder="Ex: th4x ou minha-instancia"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="testPhone">Número para teste (com DDI e DDD)</Label>
                <Input
                  id="testPhone"
                  value={config.testPhone}
                  onChange={(e) => setConfig({ ...config, testPhone: e.target.value })}
                  placeholder="Ex: 5511999999999"
                />
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Fechar
              </Button>
              <Button variant="secondary" onClick={handleSaveConfig}>
                Salvar configurações
              </Button>
              <Button 
                onClick={handleTestConnection}
                disabled={isLoading || !config.apiKey || !config.instanceName}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testando...
                  </>
                ) : (
                  'Testar conexão'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default WhatsApp;
