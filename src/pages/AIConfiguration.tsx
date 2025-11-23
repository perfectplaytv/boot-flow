import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Brain, 
  Settings, 
  Zap, 
  Activity, 
  Save,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

const AIConfiguration: React.FC = () => {
  const [config, setConfig] = useState({
    model: 'gpt-4',
    temperature: '0.7',
    maxTokens: '1000',
    systemPrompt: 'Você é um assistente especializado em vendas e suporte ao cliente.',
    autoResponse: true,
    sentimentAnalysis: true,
    languageDetection: true,
    customIntegrations: false
  });

  const [isActive, setIsActive] = useState(true);

  const handleSave = () => {
    toast.success('Configurações de IA salvas com sucesso!');
  };

  const handleToggleAI = () => {
    setIsActive(!isActive);
    toast.success(`IA ${!isActive ? 'ativada' : 'desativada'} com sucesso!`);
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja redefinir todas as configurações?')) {
      setConfig({
        model: 'gpt-4',
        temperature: '0.7',
        maxTokens: '1000',
        systemPrompt: 'Você é um assistente especializado em vendas e suporte ao cliente.',
        autoResponse: true,
        sentimentAnalysis: true,
        languageDetection: true,
        customIntegrations: false
      });
      toast.success('Configurações redefinidas!');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">Configuração de IA</h1>
          <p className="text-gray-400 mt-1">Configure e gerencie a inteligência artificial do sistema</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Redefinir
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-gray-700 bg-[#1F2937]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Status da IA
            </CardTitle>
            <Brain className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge className={isActive ? 'bg-green-500/20 text-green-600 border-green-500/30' : 'bg-red-500/20 text-red-600 border-red-500/30'}>
                {isActive ? 'Ativa' : 'Inativa'}
              </Badge>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {isActive ? 'Processando solicitações' : 'Sistema pausado'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-[#1F2937]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Requisições Hoje
            </CardTitle>
            <Activity className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1,247</div>
            <p className="text-xs text-gray-400">+12% em relação a ontem</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-[#1F2937]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Taxa de Sucesso
            </CardTitle>
            <Zap className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">94.2%</div>
            <p className="text-xs text-gray-400">Respostas satisfatórias</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-[#1F2937]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Tempo Médio
            </CardTitle>
            <Settings className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1.2s</div>
            <p className="text-xs text-gray-400">Tempo de resposta</p>
          </CardContent>
        </Card>
      </div>

      {/* Configurações Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações do Modelo */}
        <Card className="border-gray-700 bg-[#1F2937]">
          <CardHeader>
            <CardTitle className="text-white">Configurações do Modelo</CardTitle>
            <p className="text-sm text-gray-400">Ajuste os parâmetros do modelo de IA</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="model" className="text-gray-300">Modelo de IA</Label>
              <Select value={config.model} onValueChange={(value) => setConfig({...config, model: value})}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="gpt-4">GPT-4 (Mais Avançado)</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Equilibrado)</SelectItem>
                  <SelectItem value="claude-3">Claude 3 (Análise)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature" className="text-gray-300">Temperatura</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={config.temperature}
                  onChange={(e) => setConfig({...config, temperature: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <p className="text-xs text-gray-400">0 = Determinístico, 2 = Criativo</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxTokens" className="text-gray-300">Máx. Tokens</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  value={config.maxTokens}
                  onChange={(e) => setConfig({...config, maxTokens: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <p className="text-xs text-gray-400">Limite de resposta</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="systemPrompt" className="text-gray-300">Prompt do Sistema</Label>
              <Textarea
                id="systemPrompt"
                value={config.systemPrompt}
                onChange={(e) => setConfig({...config, systemPrompt: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                placeholder="Defina o comportamento base da IA..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Funcionalidades */}
        <Card className="border-gray-700 bg-[#1F2937]">
          <CardHeader>
            <CardTitle className="text-white">Funcionalidades</CardTitle>
            <p className="text-sm text-gray-400">Ative ou desative recursos da IA</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-gray-300">Resposta Automática</Label>
                <p className="text-sm text-gray-400">IA responde automaticamente aos clientes</p>
              </div>
              <Switch
                checked={config.autoResponse}
                onCheckedChange={(checked) => setConfig({...config, autoResponse: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-gray-300">Análise de Sentimento</Label>
                <p className="text-sm text-gray-400">Detecta emoções nas mensagens</p>
              </div>
              <Switch
                checked={config.sentimentAnalysis}
                onCheckedChange={(checked) => setConfig({...config, sentimentAnalysis: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-gray-300">Detecção de Idioma</Label>
                <p className="text-sm text-gray-400">Identifica e responde no idioma correto</p>
              </div>
              <Switch
                checked={config.languageDetection}
                onCheckedChange={(checked) => setConfig({...config, languageDetection: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-gray-300">Integrações Customizadas</Label>
                <p className="text-sm text-gray-400">Permite integrações personalizadas</p>
              </div>
              <Switch
                checked={config.customIntegrations}
                onCheckedChange={(checked) => setConfig({...config, customIntegrations: checked})}
              />
            </div>

            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-gray-300">Status Geral da IA</Label>
                  <p className="text-sm text-gray-400">Ativar/desativar todo o sistema</p>
                </div>
                <Button
                  variant={isActive ? "destructive" : "default"}
                  size="sm"
                  onClick={handleToggleAI}
                  className={isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                >
                  {isActive ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Ativar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configurações Avançadas */}
      <Card className="border-gray-700 bg-[#1F2937]">
        <CardHeader>
          <CardTitle className="text-white">Configurações Avançadas</CardTitle>
          <p className="text-sm text-gray-400">Configurações técnicas e de performance</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Timeout de Resposta</Label>
              <Select defaultValue="30">
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="15">15 segundos</SelectItem>
                  <SelectItem value="30">30 segundos</SelectItem>
                  <SelectItem value="60">60 segundos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Cache de Respostas</Label>
              <Select defaultValue="enabled">
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="enabled">Ativado</SelectItem>
                  <SelectItem value="disabled">Desativado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Modo de Debug</Label>
              <Select defaultValue="disabled">
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="enabled">Ativado</SelectItem>
                  <SelectItem value="disabled">Desativado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIConfiguration;