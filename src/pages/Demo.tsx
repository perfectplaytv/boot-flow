import { ArrowLeft, Play, Zap, MessageSquare, Bot, Code, Settings, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

const Demo = () => {
  const navigate = useNavigate();

  // Efeito para fazer scroll até o topo quando a página é carregada
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const demoFeatures = [
    {
      icon: Bot,
      title: "IA Conversacional Avançada",
      description: "Veja como nossa IA emocional interage com clientes de forma natural e empática",
      video: "https://example.com/demo-ia.mp4"
    },
    {
      icon: MessageSquare,
      title: "Automação WhatsApp",
      description: "Demonstração completa de campanhas automatizadas e atendimento 24/7",
      video: "https://example.com/demo-whatsapp.mp4"
    },
    {
      icon: Zap,
      title: "Fluxos Inteligentes",
      description: "Veja como criar fluxos condicionais que respondem automaticamente aos clientes",
      video: "https://example.com/demo-fluxos.mp4"
    },
    {
      icon: Settings,
      title: "Integrações Rápidas",
      description: "Conecte BootFlow com suas ferramentas favoritas em minutos",
      video: "https://example.com/demo-integracao.mp4"
    }
  ];

  const integrations = [
    {
      name: "WhatsApp Business API",
      status: "Ativo",
      description: "Integração completa para envio e recebimento de mensagens"
    },
    {
      name: "OpenAI GPT",
      status: "Ativo",
      description: "IA avançada para respostas inteligentes e contextualizadas"
    },
    {
      name: "Mercado Pago",
      status: "Ativo",
      description: "Receba pagamentos diretamente pelo BootFlow"
    },
    {
      name: "REST API",
      status: "Ativo",
      description: "Integre BootFlow com seus sistemas através da API REST"
    },
    {
      name: "Webhooks",
      status: "Ativo",
      description: "Receba notificações em tempo real de eventos importantes"
    },
    {
      name: "Zapier",
      status: "Em breve",
      description: "Conecte BootFlow com mais de 5000 aplicações"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/20 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold gradient-text">BootFlow</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Entrar
              </Button>
              <Button variant="hero" onClick={() => navigate('/cadastro')}>
                Teste Grátis
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto relative z-10">
          <Badge variant="neon" className="mb-6 animate-pulse-glow">
            <Play className="w-3 h-3 mr-1" />
            Demonstração Interativa
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text leading-tight">
            Veja o BootFlow<br />
            <span className="text-primary">em Ação</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Explore todas as funcionalidades da plataforma através de demonstrações práticas e interativas. 
            Veja como a IA emocional pode transformar seu atendimento e vendas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="hero" size="xl" onClick={() => navigate('/cadastro')}>
              <Zap className="w-5 h-5 mr-2" />
              Começar Agora - Grátis
            </Button>
            <Button variant="glass" size="xl" onClick={() => navigate('/')}>
              <ArrowRight className="w-5 h-5 mr-2" />
              Voltar para Home
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="glass" className="mb-4">
              Demonstrações
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Funcionalidades em Ação
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Assista às demonstrações práticas de cada funcionalidade principal da plataforma
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {demoFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="glass border-border/20 hover:border-primary/20 transition-all duration-300 hover-scale">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-2xl">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted/20 rounded-lg flex items-center justify-center border border-border/20">
                      <div className="text-center">
                        <Play className="w-16 h-16 mx-auto mb-4 text-primary opacity-50" />
                        <p className="text-muted-foreground">Vídeo demonstrativo</p>
                        <p className="text-sm text-muted-foreground mt-2">Em breve</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="glass" className="mb-4">
              Integrações
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Conecte com o Ecossistema
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              BootFlow se integra facilmente com as principais ferramentas do mercado
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {integrations.map((integration, index) => (
              <Card key={index} className="glass border-border/20 hover:border-primary/20 transition-all duration-300 hover-scale">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <Badge 
                      variant={integration.status === "Ativo" ? "default" : "secondary"}
                      className={integration.status === "Ativo" ? "bg-green-500/20 text-green-500 border-green-500/20" : ""}
                    >
                      {integration.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {integration.description}
                  </CardDescription>
                  {integration.status === "Ativo" && (
                    <div className="flex items-center gap-2 mt-4 text-sm text-primary">
                      <CheckCircle className="w-4 h-4" />
                      <span>Disponível agora</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Pronto para Começar?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Crie sua conta gratuita agora e comece a automatizar seu atendimento em minutos
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" onClick={() => navigate('/cadastro')}>
              Criar Conta Grátis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => navigate('/')}>
              Voltar para Home
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Demo;

