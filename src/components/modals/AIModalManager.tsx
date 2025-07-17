import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Brain, MessageSquare, User, Tv, Radio, ShoppingCart, Gamepad2, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AIModalManagerProps {
  activeModal: string | null;
  onClose: () => void;
}

export function AIModalManager({ activeModal, onClose }: AIModalManagerProps) {
  const [aiConfig, setAiConfig] = useState({
    voiceEnabled: true,
    maleVoice: "Roger",
    femaleVoice: "Sarah",
    responseTime: "3",
    personality: "suporte",
    autoGreeting: "Olá, como posso ajudar você hoje?",
    languages: ["pt-br", "en"]
  });

  const [iptvConfig, setIptvConfig] = useState({
    serverName: "SaaS Pro IPTV",
    serverUrl: "http://iptv.saaspro.com.br",
    maxConnections: "5",
    enableMovies: true,
    enableSeries: true,
    enableLive: true,
    defaultLogo: "logo.png"
  });

  const [aiChat, setAiChat] = useState({
    messages: [
      { role: "system", content: "Assistente SaaS Pro ativado." },
      { role: "assistant", content: "Olá, como posso ajudar você hoje?" }
    ],
    newMessage: ""
  });

  const [usersList] = useState([
    { id: 1, name: "João Silva", email: "joao@email.com", plan: "Cliente", status: "Ativo" },
    { id: 2, name: "Maria Santos", email: "maria@email.com", plan: "Revendedor", status: "Ativo" },
    { id: 3, name: "Pedro Oliveira", email: "pedro@email.com", plan: "Cliente", status: "Inativo" },
    { id: 4, name: "Ana Costa", email: "ana@email.com", plan: "Cliente", status: "Pendente" },
    { id: 5, name: "Carlos Lima", email: "carlos@email.com", plan: "Revendedor", status: "Ativo" },
  ]);

  const personalities = [
    { id: "suporte", name: "Suporte Técnico" },
    { id: "vendas", name: "Vendas" },
    { id: "onboarding", name: "Onboarding" },
    { id: "amigavel", name: "Amigável e Casual" },
    { id: "formal", name: "Formal e Profissional" }
  ];

  const handleAIMessageSend = () => {
    if (!aiChat.newMessage.trim()) return;

    // Add user message
    setAiChat(prev => ({
      ...prev,
      messages: [
        ...prev.messages,
        { role: "user", content: prev.newMessage }
      ],
      newMessage: ""
    }));

    // Simulate AI response
    setTimeout(() => {
      setAiChat(prev => ({
        ...prev,
        messages: [
          ...prev.messages,
          { role: "assistant", content: `Entendi sua mensagem: "${prev.newMessage}". Como posso ajudar mais?` }
        ]
      }));
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAiChat(prev => ({
      ...prev,
      newMessage: e.target.value
    }));
  };

  // Helper to render the right modal based on activeModal value
  const renderModalContent = () => {
    switch (activeModal) {
      case "ai_config":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" /> Configuração da IA
              </DialogTitle>
              <DialogDescription>
                Configure seu assistente de IA com vozes e personalidade
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
                      <SelectItem value="Roger">Roger</SelectItem>
                      <SelectItem value="Daniel">Daniel</SelectItem>
                      <SelectItem value="Carlos">Carlos</SelectItem>
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
                      <SelectItem value="Sarah">Sarah</SelectItem>
                      <SelectItem value="Maria">Maria</SelectItem>
                      <SelectItem value="Ana">Ana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
              
              <div className="space-y-2">
                <Label htmlFor="autoGreeting">Saudação Automática</Label>
                <Textarea 
                  id="autoGreeting" 
                  value={aiConfig.autoGreeting} 
                  onChange={(e) => setAiConfig({...aiConfig, autoGreeting: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={onClose}>Salvar Configurações</Button>
            </DialogFooter>
          </>
        );

      case "ai_voice_config":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" /> Configuração de Voz da IA
              </DialogTitle>
              <DialogDescription>
                Ajuste configurações avançadas de voz para IA
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
                <Label>Idiomas Disponíveis</Label>
                <div className="flex gap-2">
                  <Badge>Português-BR</Badge>
                  <Badge>Inglês</Badge>
                  <Badge variant="outline">+ Adicionar</Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Simulação de Voz</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="w-4 h-4" /> Voz Masculina
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="w-4 h-4" /> Voz Feminina
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={onClose}>Salvar Configurações</Button>
            </DialogFooter>
          </>
        );

      case "add_reseller":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="w-5 h-5" /> Adicionar Revendedor
              </DialogTitle>
              <DialogDescription>
                Cadastre um novo revendedor na plataforma
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" placeholder="Ex: João Silva" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Ex: joao@email.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="Ex: (11) 99999-9999" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plan">Plano</Label>
                <Select defaultValue="professional">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="active">Ativar Imediatamente</Label>
                <Switch id="active" defaultChecked />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={onClose}>Adicionar Revendedor</Button>
            </DialogFooter>
          </>
        );

      case "iptv_management":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Tv className="w-5 h-5" /> Gerenciamento IPTV
              </DialogTitle>
              <DialogDescription>
                Configure servidores e canais do sistema IPTV
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="serverName">Nome do Servidor</Label>
                <Input 
                  id="serverName" 
                  value={iptvConfig.serverName} 
                  onChange={(e) => setIptvConfig({...iptvConfig, serverName: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="serverUrl">URL do Servidor</Label>
                <Input 
                  id="serverUrl" 
                  value={iptvConfig.serverUrl} 
                  onChange={(e) => setIptvConfig({...iptvConfig, serverUrl: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxConnections">Máximo de Conexões por Usuário</Label>
                <Input 
                  id="maxConnections" 
                  type="number" 
                  value={iptvConfig.maxConnections} 
                  onChange={(e) => setIptvConfig({...iptvConfig, maxConnections: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableMovies">Filmes</Label>
                  <Switch 
                    id="enableMovies" 
                    checked={iptvConfig.enableMovies} 
                    onCheckedChange={(checked) => setIptvConfig({...iptvConfig, enableMovies: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableSeries">Séries</Label>
                  <Switch 
                    id="enableSeries" 
                    checked={iptvConfig.enableSeries} 
                    onCheckedChange={(checked) => setIptvConfig({...iptvConfig, enableSeries: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableLive">Canais Ao Vivo</Label>
                  <Switch 
                    id="enableLive" 
                    checked={iptvConfig.enableLive} 
                    onCheckedChange={(checked) => setIptvConfig({...iptvConfig, enableLive: checked})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Status dos Servidores</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center p-2 border rounded-md">
                    <Badge className="bg-green-500 mr-2">Online</Badge>
                    <span>Servidor Principal</span>
                  </div>
                  <div className="flex items-center p-2 border rounded-md">
                    <Badge className="bg-green-500 mr-2">Online</Badge>
                    <span>Servidor Backup 1</span>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button variant="outline">Exportar M3U</Button>
              <Button onClick={onClose}>Salvar Configurações</Button>
            </DialogFooter>
          </>
        );

      case "radio_management":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Radio className="w-5 h-5" /> Gerenciamento Rádio Web
              </DialogTitle>
              <DialogDescription>
                Configure rádios e integrações multicanal
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="radioName">Nome da Rádio</Label>
                <Input id="radioName" defaultValue="SaaS Pro Rádio" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="radioUrl">URL do Stream</Label>
                <Input id="radioUrl" defaultValue="http://radio.saaspro.com.br/stream" />
              </div>
              
              <div className="space-y-2">
                <Label>Integrações Ativas</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center p-2 border rounded-md">
                    <Badge className="bg-green-500 mr-2">Ativo</Badge>
                    <span>WhatsApp</span>
                  </div>
                  <div className="flex items-center p-2 border rounded-md">
                    <Badge className="bg-green-500 mr-2">Ativo</Badge>
                    <span>Instagram</span>
                  </div>
                  <div className="flex items-center p-2 border rounded-md">
                    <Badge variant="outline" className="mr-2">Inativo</Badge>
                    <span>Facebook</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Automações</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Button variant="outline" className="justify-start">
                    Programar Mensagens Automáticas
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Configurar Posts em Redes Sociais
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={onClose}>Salvar Configurações</Button>
            </DialogFooter>
          </>
        );

      case "ecommerce_management":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" /> Gerenciamento E-commerce
              </DialogTitle>
              <DialogDescription>
                Configure produtos e vendas para seus clientes
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Produtos Ativos</Label>
                <div className="h-40 border rounded-md p-2 overflow-y-auto">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center justify-between p-2 border-b">
                      <span>Produto {item}</span>
                      <div className="flex gap-2">
                        <Badge variant={item % 2 === 0 ? "outline" : "secondary"}>
                          {item % 2 === 0 ? "Digital" : "Físico"}
                        </Badge>
                        <Badge>R$ {(item * 49.90).toFixed(2)}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Adicionar Novo Produto</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Nome do produto" />
                  <Input placeholder="Preço (R$)" type="number" step="0.01" />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Select defaultValue="digital">
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="digital">Digital</SelectItem>
                      <SelectItem value="fisico">Físico</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>Adicionar</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Configurações de Pagamento</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center p-2 border rounded-md">
                    <Badge className="bg-green-500 mr-2">Ativo</Badge>
                    <span>MercadoPago</span>
                  </div>
                  <div className="flex items-center p-2 border rounded-md">
                    <Badge className="bg-green-500 mr-2">Ativo</Badge>
                    <span>Stripe</span>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={onClose}>Salvar Configurações</Button>
            </DialogFooter>
          </>
        );
        
      case "gamification_management":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" /> Configuração de Gamificação
              </DialogTitle>
              <DialogDescription>
                Configure regras e recompensas do sistema de gamificação
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Níveis de Jogador</Label>
                <div className="h-40 border rounded-md p-2 overflow-y-auto">
                  {[
                    { level: 1, title: "Iniciante", points: 0 },
                    { level: 2, title: "Empreendedor", points: 500 },
                    { level: 3, title: "Empresário", points: 1000 },
                    { level: 4, title: "Diretor", points: 2000 },
                    { level: 5, title: "CEO", points: 5000 },
                  ].map((item) => (
                    <div key={item.level} className="flex items-center justify-between p-2 border-b">
                      <span>Nível {item.level}: {item.title}</span>
                      <Badge>{item.points} pontos</Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Recompensas</Label>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <span>Desconto 10%</span>
                    <Badge>Nível 2+</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <span>Acesso Exclusivo</span>
                    <Badge>Nível 3+</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <span>Recursos Premium</span>
                    <Badge>Nível 4+</Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Configurações</Label>
                <div className="flex items-center justify-between">
                  <span>Ativar Gamificação</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span>Notificações de Nível</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={onClose}>Salvar Configurações</Button>
            </DialogFooter>
          </>
        );

      case "analytics_view":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" /> Analytics
              </DialogTitle>
              <DialogDescription>
                Métricas e relatórios em tempo real
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-2">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center">
                    <span className="text-sm text-muted-foreground">Usuários Ativos</span>
                    <span className="text-3xl font-bold">15.847</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center">
                    <span className="text-sm text-muted-foreground">Receita</span>
                    <span className="text-3xl font-bold">R$ 487K</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center">
                    <span className="text-sm text-muted-foreground">Conversão</span>
                    <span className="text-3xl font-bold">8.9%</span>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-2">
                <Label>Usuários por Plano</Label>
                <div className="h-20 border rounded-md p-2 relative">
                  <div className="flex h-full items-end">
                    <div className="bg-primary w-1/3 h-1/3" title="Starter"></div>
                    <div className="bg-primary/80 w-1/3 h-2/3 border-l border-r border-background" title="Professional"></div>
                    <div className="bg-primary/60 w-1/3 h-1/6" title="Enterprise"></div>
                  </div>
                  <div className="flex justify-between absolute bottom-0 left-0 right-0 px-2 text-xs">
                    <span>Starter</span>
                    <span>Professional</span>
                    <span>Enterprise</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Recursos Mais Utilizados</Label>
                <div className="h-20 border rounded-md p-2 relative">
                  <div className="flex h-full items-end">
                    <div className="bg-purple-500 w-1/5 h-4/5" title="IPTV"></div>
                    <div className="bg-blue-500 w-1/5 h-3/5 border-l border-background" title="Rádio"></div>
                    <div className="bg-green-500 w-1/5 h-2/5 border-l border-background" title="E-commerce"></div>
                    <div className="bg-orange-500 w-1/5 h-3/4 border-l border-background" title="AI Chat"></div>
                    <div className="bg-red-500 w-1/5 h-1/4 border-l border-background" title="Gamificação"></div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Exportar Dados</Button>
              <Button onClick={onClose}>Fechar</Button>
            </DialogFooter>
          </>
        );
        
      default:
        return (
          <div className="py-6 text-center text-muted-foreground">
            Selecione uma opção do menu
          </div>
        );
    }
  };

  return (
    <Dialog open={!!activeModal} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {renderModalContent()}
      </DialogContent>
    </Dialog>
  );
}