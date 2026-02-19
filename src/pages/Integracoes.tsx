import { ArrowLeft, Zap, MessageSquare, Bot, Code, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Integracoes = () => {
  const navigate = useNavigate();

  const integrations = [
    {
      icon: MessageSquare,
      name: "WhatsApp Business API",
      description: "Integre com WhatsApp para envio e recebimento de mensagens",
      status: "Disponível",
      category: "Mensageria"
    },
    {
      icon: Bot,
      name: "OpenAI GPT",
      description: "Potencie sua IA com modelos avançados de linguagem",
      status: "Disponível",
      category: "IA"
    },
    {
      icon: Code,
      name: "REST API",
      description: "Integre BootFlow com seus sistemas através da API REST",
      status: "Disponível",
      category: "Desenvolvimento"
    },
    {
      icon: Settings,
      name: "Webhooks",
      description: "Receba notificações em tempo real de eventos importantes",
      status: "Disponível",
      category: "Automação"
    },
    {
      icon: Zap,
      name: "Zapier",
      description: "Conecte BootFlow com mais de 5000 aplicações",
      status: "Em breve",
      category: "Integração"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text">Integrações</h1>
                <p className="text-muted-foreground">Conecte BootFlow com suas ferramentas favoritas</p>
              </div>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Integrações Disponíveis</CardTitle>
              <CardDescription>
                Expanda as funcionalidades da BootFlow conectando com outras plataformas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {integrations.map((integration, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <integration.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{integration.name}</CardTitle>
                            <Badge
                              variant={integration.status === "Disponível" ? "default" : "secondary"}
                              className="mt-1"
                            >
                              {integration.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <CardDescription>{integration.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{integration.category}</span>
                        {integration.status === "Disponível" ? (
                          <Button variant="outline" size="sm">
                            Configurar →
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" disabled>
                            Em breve
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>API Personalizada</CardTitle>
              <CardDescription>
                Crie suas próprias integrações usando nossa API REST
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Desenvolva integrações customizadas para atender às necessidades específicas do seu negócio.
                Nossa API RESTful oferece acesso completo a todas as funcionalidades da plataforma.
              </p>
              <div className="flex gap-4">
                <Button onClick={() => navigate('/api')}>
                  <Code className="w-4 h-4 mr-2" />
                  Ver Documentação da API
                </Button>
                <Button variant="outline" onClick={() => navigate('/documentacao')}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ver Documentação
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Não encontrou a integração que precisa?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Entre em contato conosco e vamos criar uma integração personalizada para você
                </p>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={() => navigate('/ajuda')}>
                    Falar com Suporte
                  </Button>
                  <Button onClick={() => window.open('mailto:integracao@bootflow.com', '_blank')}>
                    Solicitar Integração
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Integracoes;

