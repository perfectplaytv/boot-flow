import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Brain, MessageSquare, Settings, Play, Mic, Volume2, Zap } from "lucide-react";

interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

export default function AdminAI() {
  const [aiConfig, setAiConfig] = useState({
    voiceEnabled: true,
    maleVoice: "Roger",
    femaleVoice: "Sarah",
    responseTime: "3",
    personality: "suporte",
    autoGreeting: "Olá, como posso ajudar você hoje?",
    languages: ["pt-br", "en"],
    maxTokens: "1000",
    temperature: "0.7"
  });

  const [aiChat, setAiChat] = useState<AIMessage[]>([
    { role: "system", content: "Assistente SaaS Pro ativado.", timestamp: "10:00" },
    { role: "assistant", content: "Olá, como posso ajudar você hoje?", timestamp: "10:01" },
    { role: "user", content: "Preciso de ajuda com o sistema", timestamp: "10:02" },
    { role: "assistant", content: "Claro! Estou aqui para ajudar. Qual é o problema que você está enfrentando?", timestamp: "10:03" },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [isVoiceTestOpen, setIsVoiceTestOpen] = useState(false);

  const personalities = [
    { id: "suporte", name: "Suporte Técnico" },
    { id: "vendas", name: "Vendas" },
    { id: "onboarding", name: "Onboarding" },
    { id: "amigavel", name: "Amigável e Casual" },
    { id: "formal", name: "Formal e Profissional" }
  ];

  const voices = [
    { id: "Roger", name: "Roger (Masculino)" },
    { id: "Daniel", name: "Daniel (Masculino)" },
    { id: "Carlos", name: "Carlos (Masculino)" },
    { id: "Sarah", name: "Sarah (Feminino)" },
    { id: "Maria", name: "Maria (Feminino)" },
    { id: "Ana", name: "Ana (Feminino)" }
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: AIMessage = {
      role: "user",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setAiChat([...aiChat, userMessage]);
    setNewMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIMessage = {
        role: "assistant",
        content: `Entendi sua mensagem: "${userMessage.content}". Como posso ajudar mais?`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setAiChat(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">IA + Voz</h1>
          <p className="text-muted-foreground">Gerencie configurações de inteligência artificial e voz</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isVoiceTestOpen} onOpenChange={setIsVoiceTestOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Mic className="w-4 h-4" />
                Testar Voz
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Teste de Voz</DialogTitle>
                <DialogDescription>
                  Teste as configurações de voz da IA
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Voz Atual</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {aiConfig.maleVoice} / {aiConfig.femaleVoice}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Texto de Teste</Label>
                  <Textarea 
                    placeholder="Digite um texto para testar a voz..."
                    defaultValue="Olá! Este é um teste da voz da inteligência artificial."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsVoiceTestOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsVoiceTestOpen(false)}>
                  <Play className="w-4 h-4 mr-2" />
                  Reproduzir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configurações
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Configurações da IA</DialogTitle>
                <DialogDescription>
                  Configure o comportamento e voz da inteligência artificial
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="voiceEnabled">Habilitar Voz</Label>
                  <Switch 
                    id="voiceEnabled" 
                    checked={aiConfig.voiceEnabled} 
                    onCheckedChange={(checked) => setAiConfig({...aiConfig, voiceEnabled: checked})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maleVoice">Voz Masculina</Label>
                    <Select 
                      value={aiConfig.maleVoice} 
                      onValueChange={(value) => setAiConfig({...aiConfig, maleVoice: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {voices.filter(v => v.id === "Roger" || v.id === "Daniel" || v.id === "Carlos").map(voice => (
                          <SelectItem key={voice.id} value={voice.id}>{voice.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="femaleVoice">Voz Feminina</Label>
                    <Select 
                      value={aiConfig.femaleVoice} 
                      onValueChange={(value) => setAiConfig({...aiConfig, femaleVoice: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {voices.filter(v => v.id === "Sarah" || v.id === "Maria" || v.id === "Ana").map(voice => (
                          <SelectItem key={voice.id} value={voice.id}>{voice.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="responseTime">Tempo de Resposta (segundos)</Label>
                    <Input
                      id="responseTime"
                      type="number"
                      value={aiConfig.responseTime}
                      onChange={(e) => setAiConfig({...aiConfig, responseTime: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="personality">Personalidade</Label>
                    <Select 
                      value={aiConfig.personality} 
                      onValueChange={(value) => setAiConfig({...aiConfig, personality: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {personalities.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="autoGreeting">Saudação Automática</Label>
                  <Textarea 
                    id="autoGreeting" 
                    value={aiConfig.autoGreeting} 
                    onChange={(e) => setAiConfig({...aiConfig, autoGreeting: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxTokens">Máximo de Tokens</Label>
                    <Input
                      id="maxTokens"
                      type="number"
                      value={aiConfig.maxTokens}
                      onChange={(e) => setAiConfig({...aiConfig, maxTokens: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperatura</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      value={aiConfig.temperature}
                      onChange={(e) => setAiConfig({...aiConfig, temperature: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsConfigDialogOpen(false)}>
                  Salvar Configurações
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status da IA</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ativa</div>
            <p className="text-xs text-muted-foreground">
              {aiConfig.personality === "suporte" ? "Modo Suporte" : "Modo Vendas"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voz</CardTitle>
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {aiConfig.voiceEnabled ? "Ativa" : "Inativa"}
            </div>
            <p className="text-xs text-muted-foreground">
              {aiConfig.maleVoice} / {aiConfig.femaleVoice}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiConfig.responseTime}s</div>
            <p className="text-xs text-muted-foreground">
              Média de resposta
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversas Ativas</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Usuários online
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Chat com IA</CardTitle>
            <CardDescription>
              Teste a conversa com a inteligência artificial
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-64 overflow-y-auto border rounded-lg p-4 space-y-3">
                {aiChat.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Textarea
                  placeholder="Digite sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  rows={2}
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações Atuais</CardTitle>
            <CardDescription>
              Resumo das configurações da IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Voz Habilitada</span>
                <Badge className={aiConfig.voiceEnabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {aiConfig.voiceEnabled ? "Sim" : "Não"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Personalidade</span>
                <span className="text-sm text-muted-foreground">
                  {personalities.find(p => p.id === aiConfig.personality)?.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Voz Masculina</span>
                <span className="text-sm text-muted-foreground">{aiConfig.maleVoice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Voz Feminina</span>
                <span className="text-sm text-muted-foreground">{aiConfig.femaleVoice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tempo de Resposta</span>
                <span className="text-sm text-muted-foreground">{aiConfig.responseTime}s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Máximo de Tokens</span>
                <span className="text-sm text-muted-foreground">{aiConfig.maxTokens}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Temperatura</span>
                <span className="text-sm text-muted-foreground">{aiConfig.temperature}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 