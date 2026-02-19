import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Save, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { WhatsAppConnection } from '@/components/WhatsAppConnection';

interface WhatsAppConfigFormProps {
  onSave: (config: {
    bearerToken: string;
    channelName: string;
    autoReply: boolean;
    modoProducao: boolean;
  }) => Promise<void>;
  initialData?: {
    bearerToken?: string;
    channelName?: string;
    autoReply?: boolean;
    modoProducao?: boolean;
  };
  isSaving?: boolean;
  className?: string;
}

export function WhatsAppConfigForm({
  onSave,
  initialData = {},
  isSaving = false,
  className = '',
}: WhatsAppConfigFormProps) {
  const [formData, setFormData] = useState({
    bearerToken: initialData.bearerToken || '',
    channelName: initialData.channelName || '',
    autoReply: initialData.autoReply || false,
    modoProducao: initialData.modoProducao || false,
  });
  const [showToken, setShowToken] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        bearerToken: initialData.bearerToken || '',
        channelName: initialData.channelName || '',
        autoReply: initialData.autoReply || false,
        modoProducao: initialData.modoProducao || false,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave({
        bearerToken: formData.bearerToken,
        channelName: formData.channelName,
        autoReply: formData.autoReply,
        modoProducao: formData.modoProducao,
      });
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar as configurações. Tente novamente.');
    }
  };

  const handleTestConnection = () => {
    if (!formData.bearerToken || !formData.channelName) {
      toast.error('Preencha o Token e o Channel Name para testar a conexão');
      return;
    }
    setIsTesting(true);
    // A conexão será gerenciada pelo componente WhatsAppConnection
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>Configurações do WhatsApp Business</CardTitle>
          <CardDescription>
            Configure a integração com a API do WhatsApp para enviar e receber mensagens.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bearerToken">Token de Acesso</Label>
                  <div className="relative">
                    <Input
                      id="bearerToken"
                      name="bearerToken"
                      type={showToken ? 'text' : 'password'}
                      value={formData.bearerToken}
                      onChange={handleChange}
                      placeholder="Digite o token de acesso"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showToken ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Token de acesso fornecido pela API Brasil
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="channelName">Channel Name</Label>
                  <Input
                    id="channelName"
                    name="channelName"
                    type="text"
                    value={formData.channelName}
                    onChange={handleChange}
                    placeholder="Digite o Channel Name"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Identificador único do canal de comunicação
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoReply">Respostas Automáticas</Label>
                    <p className="text-sm text-gray-500">
                      Ativar respostas automáticas para mensagens recebidas
                    </p>
                  </div>
                  <Switch
                    id="autoReply"
                    name="autoReply"
                    checked={formData.autoReply}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, autoReply: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="modoProducao">Modo Produção</Label>
                    <p className="text-sm text-gray-500">
                      Ative apenas quando estiver pronto para enviar mensagens reais
                    </p>
                  </div>
                  <Switch
                    id="modoProducao"
                    name="modoProducao"
                    checked={formData.modoProducao}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, modoProducao: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Testar Conexão</h3>
              <div className="rounded-md border p-4">
                <WhatsAppConnection
                  bearerToken={formData.bearerToken}
                  channelName={formData.channelName}
                  onConnectionChange={setIsConnected}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              disabled={isSaving || !formData.bearerToken || !formData.channelName}
            >
              {isTesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Testar Conexão
                </>
              )}
            </Button>
            <Button type="submit" disabled={isSaving || !formData.bearerToken || !formData.channelName}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instruções de Uso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <ol className="space-y-4">
              <li>
                <strong>Obtenha suas credenciais:</strong> Acesse o painel da API Brasil e obtenha seu Token de Acesso e Channel Name.
              </li>
              <li>
                <strong>Preencha os campos:</strong> Insira o Token e o Channel Name nos campos acima.
              </li>
              <li>
                <strong>Teste a conexão:</strong> Clique em "Testar Conexão" para verificar se as credenciais estão corretas.
              </li>
              <li>
                <strong>Configure as opções:</strong> Ative as opções de Respostas Automáticas e Modo Produção conforme necessário.
              </li>
              <li>
                <strong>Salve as configurações:</strong> Clique em "Salvar Configurações" para aplicar as alterações.
              </li>
            </ol>
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h4 className="font-medium mb-2">Dúvidas?</h4>
              <p className="text-sm text-gray-600">
                Consulte a documentação da API Brasil ou entre em contato com o suporte técnico.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
