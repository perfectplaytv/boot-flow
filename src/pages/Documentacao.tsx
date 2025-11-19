import { useState, useEffect } from "react";
import { ArrowLeft, Book, FileText, Video, Code, Zap, Bot, ArrowUp, Play } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

const Documentacao = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Efeito para mostrar/ocultar o botão de voltar ao topo
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToPricing = (e?: React.MouseEvent<HTMLAnchorElement>) => {
    if (e) {
      e.preventDefault();
    }
    if (location.pathname !== '/preco') {
      navigate('/preco');
    } else {
      setTimeout(() => {
        const pricingElement = document.getElementById('pricing');
        if (pricingElement) {
          pricingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const tutorials = [
    {
      id: "primeiros-passos",
      title: "Primeiros Passos",
      description: "Aprenda a configurar sua conta e começar a usar a plataforma",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" // Vídeo mockado - substituir depois
    },
    {
      id: "configurando-whatsapp",
      title: "Configurando WhatsApp",
      description: "Guia completo para conectar e configurar o WhatsApp",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" // Vídeo mockado - substituir depois
    },
    {
      id: "criando-campanhas",
      title: "Criando Campanhas",
      description: "Como criar e gerenciar campanhas de marketing eficazes",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" // Vídeo mockado - substituir depois
    }
  ];

  const guides = [
    {
      id: "inicio-rapido",
      icon: Zap,
      title: "Início Rápido",
      description: "Configure sua conta em minutos",
      category: "Básico",
      content: {
        sections: [
          {
            title: "1. Criando sua Conta",
            content: "Acesse a página de cadastro e preencha seus dados básicos: nome completo, email e senha. Após confirmar seu email, você terá acesso completo à plataforma. O processo leva menos de 2 minutos."
          },
          {
            title: "2. Configuração Inicial",
            content: "No primeiro acesso, você será guiado por um assistente de configuração. Defina o nome da sua empresa, escolha seu plano e configure as preferências básicas. Não se preocupe, você pode alterar tudo depois."
          },
          {
            title: "3. Conectando WhatsApp",
            content: "Para começar a usar o BootFlow, você precisa conectar seu WhatsApp Business. Acesse 'Configurações' > 'WhatsApp' e escaneie o QR Code exibido. O processo é simples e seguro."
          },
          {
            title: "4. Primeiro Assistente de IA",
            content: "Crie seu primeiro assistente virtual acessando 'IA' > 'Novo Assistente'. Escolha um nome, selecione a voz (masculina ou feminina) e defina a personalidade. Você pode testar antes de ativar."
          },
          {
            title: "5. Enviando sua Primeira Mensagem",
            content: "Com tudo configurado, você pode começar a enviar mensagens. Acesse 'Mensagens' > 'Nova Mensagem', escolha o contato e envie. A IA responderá automaticamente quando configurada."
          },
          {
            title: "6. Explorando o Dashboard",
            content: "O dashboard central mostra todas as informações importantes: mensagens recebidas, estatísticas de atendimento, campanhas ativas e muito mais. Explore todas as seções para conhecer as funcionalidades."
          },
          {
            title: "Próximos Passos",
            content: "Agora que você configurou o básico, explore os outros guias para aprender sobre integração com API, configuração avançada de IA e criação de campanhas WhatsApp. Nossa equipe está sempre disponível para ajudar!"
          }
        ]
      }
    },
    {
      id: "integracao-api",
      icon: Code,
      title: "Integração com API",
      description: "Conecte sua aplicação com nossa API",
      category: "Desenvolvimento",
      content: {
        sections: [
          {
            title: "1. Obtendo suas Credenciais",
            content: "Para usar a API, você precisa de uma chave de API. Acesse 'Configurações' > 'API' > 'Gerar Nova Chave'. Guarde esta chave com segurança - ela não será exibida novamente. Use o header 'Authorization: Bearer {sua-chave}' em todas as requisições."
          },
          {
            title: "2. Base URL da API",
            content: "Todas as requisições devem ser feitas para: https://api.bootflow.com.br/v1. Certifique-se de usar HTTPS em todas as chamadas. A API suporta apenas requisições HTTPS por segurança."
          },
          {
            title: "3. Autenticação",
            content: "Todas as requisições requerem autenticação via Bearer Token. Inclua o header 'Authorization: Bearer {sua-api-key}' em cada requisição. Sem este header, você receberá um erro 401 (Não autorizado)."
          },
          {
            title: "4. Endpoints Principais",
            content: "Principais endpoints disponíveis: POST /messages (enviar mensagem), GET /messages (listar mensagens), POST /campaigns (criar campanha), GET /campaigns (listar campanhas), GET /contacts (listar contatos), POST /ai/chat (chat com IA), GET /stats (estatísticas)."
          },
          {
            title: "5. Formato de Requisição",
            content: "Todas as requisições devem usar Content-Type: application/json. O corpo das requisições POST deve ser um objeto JSON válido. Exemplo: { 'to': '5511999999999', 'message': 'Olá!', 'type': 'text' }."
          },
          {
            title: "6. Formato de Resposta",
            content: "Todas as respostas são em formato JSON. Respostas de sucesso retornam status HTTP 200-299. Erros retornam status 400-500 com um objeto JSON contendo 'error' e 'message'. Exemplo de erro: { 'error': 'invalid_token', 'message': 'Token inválido ou expirado' }."
          },
          {
            title: "7. Rate Limiting",
            content: "A API possui limites de taxa para garantir estabilidade. Planos Essencial: 100 req/min, Profissional: 500 req/min, Business: 2000 req/min, Elite: ilimitado. Exceder o limite retorna status 429. Verifique os headers 'X-RateLimit-Limit' e 'X-RateLimit-Remaining'."
          },
          {
            title: "8. Webhooks",
            content: "Configure webhooks para receber notificações em tempo real. Acesse 'Configurações' > 'Webhooks' e adicione sua URL. Eventos disponíveis: message.received, message.sent, campaign.completed, payment.received. Os webhooks usam POST com JSON no corpo."
          },
          {
            title: "9. Exemplos de Código",
            content: "Fornecemos exemplos em JavaScript, Python, PHP e cURL na documentação completa. Acesse '/api' para ver exemplos práticos e começar rapidamente. Todos os exemplos incluem tratamento de erros e boas práticas."
          },
          {
            title: "10. Suporte para Desenvolvedores",
            content: "Nossa equipe oferece suporte técnico especializado. Entre em contato através de dev@bootflow.com.br ou acesse nossa comunidade de desenvolvedores. Respondemos em até 24 horas úteis."
          }
        ]
      }
    },
    {
      id: "configuracao-ia",
      icon: FileText,
      title: "Configuração de IA",
      description: "Personalize sua assistente virtual",
      category: "IA",
      content: {
        sections: [
          {
            title: "1. Acessando Configurações de IA",
            content: "No menu principal, acesse 'IA' > 'Configurações'. Aqui você pode criar, editar e gerenciar todos os seus assistentes virtuais. Cada assistente pode ter configurações independentes."
          },
          {
            title: "2. Escolhendo o Modelo de IA",
            content: "BootFlow oferece múltiplos modelos de IA: GPT-4 (mais avançado), GPT-3.5 (rápido e eficiente), Claude (excelente para análise) e modelos personalizados. Escolha baseado em suas necessidades de velocidade, custo e qualidade."
          },
          {
            title: "3. Configurando a Voz",
            content: "Escolha entre vozes masculinas e femininas, cada uma com diferentes tons e estilos. Você pode ouvir amostras antes de escolher. As vozes são geradas com IA emocional, permitindo expressões naturais e empáticas."
          },
          {
            title: "4. Definindo Personalidade",
            content: "Configure a personalidade do assistente: formal ou casual, empático ou direto, técnico ou simples. Use exemplos de conversas para treinar o comportamento. Quanto mais exemplos, melhor a personalidade será replicada."
          },
          {
            title: "5. Treinamento com Base de Conhecimento",
            content: "Adicione documentos, FAQs e informações da sua empresa para treinar a IA. Ela aprenderá sobre seus produtos, serviços e políticas. Suporte a PDF, TXT, DOCX e até mesmo URLs de sites para indexação automática."
          },
          {
            title: "6. Configurando Fluxos de Conversa",
            content: "Crie fluxos condicionais para guiar conversas. Defina respostas para perguntas frequentes, ações para palavras-chave e transições entre tópicos. Use o editor visual para criar fluxos complexos sem código."
          },
          {
            title: "7. Testando o Assistente",
            content: "Use o chat de teste integrado para conversar com seu assistente antes de ativá-lo. Teste diferentes cenários, perguntas difíceis e situações de erro. Ajuste as configurações baseado nos resultados."
          },
          {
            title: "8. Ativando e Monitorando",
            content: "Após configurar, ative o assistente. Monitore conversas em tempo real, analise métricas de satisfação e ajuste conforme necessário. A IA aprende continuamente com as interações."
          },
          {
            title: "9. Configurações Avançadas",
            content: "Ajuste temperatura (criatividade), max_tokens (tamanho de resposta), timeout (tempo de resposta) e fallback (ação quando não souber responder). Essas configurações afetam performance e custos."
          },
          {
            title: "10. Integração com Sistemas",
            content: "Conecte a IA com seus sistemas via API. Configure webhooks para ações externas, integre com CRMs e use funções customizadas. A IA pode consultar bancos de dados, fazer cálculos e muito mais."
          }
        ]
      }
    },
    {
      id: "campanhas-whatsapp",
      icon: Video,
      title: "Campanhas WhatsApp",
      description: "Crie e gerencie campanhas de marketing",
      category: "Marketing",
      content: {
        sections: [
          {
            title: "1. Acessando Campanhas",
            content: "No menu principal, acesse 'Campanhas' > 'WhatsApp'. Aqui você vê todas as suas campanhas: ativas, agendadas, concluídas e rascunhos. Clique em 'Nova Campanha' para começar."
          },
          {
            title: "2. Definindo o Objetivo",
            content: "Escolha o objetivo da campanha: promoção, lançamento, reengajamento, suporte ou personalizado. Isso ajuda a configurar métricas e templates apropriados. Cada objetivo tem templates pré-configurados."
          },
          {
            title: "3. Selecionando o Público",
            content: "Escolha os destinatários: lista de contatos, segmentos, filtros personalizados ou importe de arquivo CSV. Você pode criar segmentos baseados em tags, histórico de compras, localização e muito mais."
          },
          {
            title: "4. Criando a Mensagem",
            content: "Use o editor visual para criar mensagens ricas: texto formatado, imagens, vídeos, documentos, botões interativos e listas. Use variáveis personalizadas como {nome}, {empresa} para personalização em massa."
          },
          {
            title: "5. Agendando o Envio",
            content: "Escolha quando enviar: imediatamente, agendado (data e hora específica) ou recorrente (diário, semanal, mensal). Configure fusos horários e evite horários de descanso para melhor engajamento."
          },
          {
            title: "6. Configurando Automações",
            content: "Configure respostas automáticas, ações condicionais e follow-ups. Exemplo: se o cliente responder 'sim', envie mais informações. Se não responder em 24h, envie um lembrete. Use fluxos visuais para criar lógicas complexas."
          },
          {
            title: "7. Testando a Campanha",
            content: "Antes de enviar para todos, envie uma mensagem de teste para você mesmo ou um grupo de teste. Verifique formatação, links, mídias e variáveis. Corrija qualquer problema antes do envio em massa."
          },
          {
            title: "8. Monitorando Resultados",
            content: "Acompanhe em tempo real: mensagens enviadas, entregues, lidas, respondidas e bloqueadas. Analise taxas de abertura, cliques em links, respostas e conversões. Use gráficos e relatórios detalhados."
          },
          {
            title: "9. Otimizando Campanhas",
            content: "Use A/B testing para testar diferentes mensagens, horários e públicos. Analise quais campanhas performam melhor e replique o sucesso. Ajuste estratégias baseado em dados reais de engajamento."
          },
          {
            title: "10. Boas Práticas",
            content: "Seguir boas práticas: personalize mensagens, evite spam, respeite horários comerciais, forneça opção de descadastro, use imagens de qualidade, mantenha mensagens concisas e inclua call-to-action claro. Isso melhora engajamento e evita bloqueios."
          }
        ]
      }
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/20 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">BootFlow</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a 
                href="#features" 
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  if (location.pathname !== '/') {
                    navigate('/');
                    setTimeout(() => {
                      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  } else {
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Funcionalidades
              </a>
              <a 
                href="#avisos" 
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  if (location.pathname !== '/') {
                    navigate('/');
                    setTimeout(() => {
                      document.getElementById('avisos')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  } else {
                    document.getElementById('avisos')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Avisos
              </a>
              <a 
                href="/preco" 
                onClick={scrollToPricing}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Preços
              </a>
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

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Book className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text">Documentação</h1>
                <p className="text-muted-foreground">Guia completo para usar a plataforma BootFlow</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="guides" className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="guides">Guias</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="tutorials">Tutoriais</TabsTrigger>
            </TabsList>

            <TabsContent value="guides" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {guides.map((guide, index) => {
                  const IconComponent = guide.icon;
                  return (
                    <Card 
                      key={index} 
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedGuide(guide.id)}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <IconComponent className="w-6 h-6 text-primary" />
                          <CardTitle>{guide.title}</CardTitle>
                        </div>
                        <CardDescription>{guide.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{guide.category}</span>
                          <Button variant="ghost" size="sm">
                            Ler mais →
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="api">
              <Card>
                <CardHeader>
                  <CardTitle>Documentação da API</CardTitle>
                  <CardDescription>
                    Referência completa de todos os endpoints disponíveis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Explore nossa API RESTful completa e integre BootFlow com seus sistemas.
                  </p>
                  <Button onClick={() => navigate('/api')}>
                    <Code className="w-4 h-4 mr-2" />
                    Ver Documentação da API
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tutorials">
              <Card>
                <CardHeader>
                  <CardTitle>Tutoriais em Vídeo</CardTitle>
                  <CardDescription>
                    Aprenda com nossos tutoriais passo a passo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tutorials.map((tutorial, index) => (
                      <div key={index} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                          <Video className="w-5 h-5 text-primary" />
                          <h4 className="font-semibold">{tutorial.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {tutorial.description}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedTutorial(tutorial.id)}
                          className="hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Assistir →
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Precisa de mais ajuda?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Nossa equipe está pronta para ajudar você
                </p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/ajuda')}
                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    Central de Ajuda
                  </Button>
                  <Button 
                    onClick={() => {
                      const email = 'suporte@bootflow.com.br';
                      const subject = encodeURIComponent('Suporte - Documentação BootFlow');
                      const body = encodeURIComponent('Olá equipe BootFlow,\n\nPreciso de ajuda com:\n\n\n\nAtenciosamente,');
                      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
                    }}
                    className="hover:bg-primary/90 transition-colors"
                  >
                    Enviar Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/20 bg-muted/10 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">BootFlow</span>
              </div>
              <p className="text-muted-foreground mb-4">
                A plataforma de IA emocional que revoluciona a comunicação empresarial no Brasil.
              </p>
              <div className="flex space-x-2">
                <Badge variant="glass">IA Emocional</Badge>
                <Badge variant="glass">WhatsApp</Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a 
                    href="#features" 
                    className="hover:text-foreground transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      if (location.pathname !== '/') {
                        navigate('/');
                        setTimeout(() => {
                          document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      } else {
                        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <a 
                    href="/preco" 
                    onClick={scrollToPricing}
                    className="hover:text-foreground transition-colors cursor-pointer"
                  >
                    Preços
                  </a>
                </li>
                <li>
                  <a 
                    href="#hero" 
                    className="hover:text-foreground transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      if (location.pathname !== '/') {
                        navigate('/');
                        setTimeout(() => {
                          document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      } else {
                        document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Automatize
                  </a>
                </li>
                <li>
                  <a 
                    href="/demo" 
                    className="hover:text-foreground transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/demo');
                    }}
                  >
                    Demo
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a 
                    href="/ajuda" 
                    className="hover:text-foreground transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/ajuda');
                    }}
                  >
                    Central de Ajuda
                  </a>
                </li>
                <li>
                  <a 
                    href="/documentacao" 
                    className="hover:text-foreground transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/documentacao');
                    }}
                  >
                    Documentação
                  </a>
                </li>
                <li>
                  <a 
                    href="https://wa.me/5527999587725" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:suporte@bootflow.com.br" 
                    className="hover:text-foreground transition-colors"
                  >
                    Email
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a 
                    href="/empresa/sobre" 
                    className="hover:text-foreground transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/empresa/sobre');
                    }}
                  >
                    Sobre
                  </a>
                </li>
                <li>
                  <a 
                    href="/empresa/blog" 
                    className="hover:text-foreground transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/empresa/blog');
                    }}
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a 
                    href="/privacidade" 
                    className="hover:text-foreground transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/privacidade');
                    }}
                  >
                    Privacidade
                  </a>
                </li>
                <li>
                  <a 
                    href="/termos" 
                    className="hover:text-foreground transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/termos');
                    }}
                  >
                    Termos
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/20 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 BootFlow. Todos os direitos reservados. Feito com ❤️ no Brasil.</p>
          </div>
        </div>
      </footer>

      {/* Botão Voltar ao Topo */}
      {showScrollButton && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground dark:bg-[#7e22ce] dark:text-white shadow-lg hover:bg-primary/90 dark:hover:bg-[#6d1bb7] transition-all duration-300 flex items-center gap-2 z-50 px-6 py-3"
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="w-5 h-5" />
          Voltar ao Topo
        </Button>
      )}

      {/* Modal de Guias */}
      {selectedGuide && (
        <Dialog open={!!selectedGuide} onOpenChange={() => setSelectedGuide(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {guides.find(g => g.id === selectedGuide)?.title}
              </DialogTitle>
              <DialogDescription>
                {guides.find(g => g.id === selectedGuide)?.description}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-6">
              {guides.find(g => g.id === selectedGuide)?.content?.sections.map((section, index) => (
                <div key={index} className="border-b border-border/50 pb-4 last:border-0">
                  <h3 className="text-lg font-semibold mb-2 text-primary">
                    {section.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setSelectedGuide(null)}>
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Documentacao;

