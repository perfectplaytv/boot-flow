import { useState, useEffect } from "react";
import { ArrowLeft, Code, Book, Zap, Shield, MessageSquare, Bot, ArrowUp } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

const API = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const endpoints = [
    {
      method: "POST",
      path: "/api/v1/clients",
      description: "Criar um novo cliente",
      auth: true
    },
    {
      method: "GET",
      path: "/api/v1/clients",
      description: "Listar todos os clientes",
      auth: true
    },
    {
      method: "GET",
      path: "/api/v1/clients/:id",
      description: "Obter detalhes de um cliente",
      auth: true
    },
    {
      method: "PUT",
      path: "/api/v1/clients/:id",
      description: "Atualizar um cliente",
      auth: true
    },
    {
      method: "DELETE",
      path: "/api/v1/clients/:id",
      description: "Deletar um cliente",
      auth: true
    },
    {
      method: "POST",
      path: "/api/v1/whatsapp/send",
      description: "Enviar mensagem via WhatsApp",
      auth: true
    },
    {
      method: "POST",
      path: "/api/v1/ai/chat",
      description: "Processar mensagem com IA",
      auth: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/20 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            >
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
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text">API BootFlow</h1>
                <p className="text-muted-foreground">Documentação completa da API REST</p>
              </div>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Introdução</CardTitle>
              <CardDescription>
                A API BootFlow permite integrar nossa plataforma com seus sistemas existentes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Nossa API RESTful oferece acesso completo às funcionalidades da plataforma BootFlow,
                incluindo gerenciamento de clientes, envio de mensagens WhatsApp, integração com IA
                e muito mais.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">URL Base da API:</p>
                <code className="text-sm bg-background px-3 py-1 rounded">https://api.bootflow.com/v1</code>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Autenticação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Todas as requisições devem incluir um token de autenticação no header:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <code className="text-sm">
                  Authorization: Bearer seu_token_aqui
                </code>
              </div>
              <p className="text-sm text-muted-foreground">
                Obtenha seu token de API nas configurações da sua conta.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Endpoints Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {endpoints.map((endpoint, index) => (
                  <div
                    key={index}
                    className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            className={
                              endpoint.method === "GET"
                                ? "bg-blue-500"
                                : endpoint.method === "POST"
                                ? "bg-green-500"
                                : endpoint.method === "PUT"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }
                          >
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                            {endpoint.path}
                          </code>
                          {endpoint.auth && (
                            <Badge variant="outline" className="text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              Auth
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Exemplo de Uso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
{`curl -X POST https://api.bootflow.com/v1/clients \\
  -H "Authorization: Bearer seu_token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "plan": "Mensal"
  }'`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={() => navigate('/documentacao')}>
              <Book className="w-4 h-4 mr-2" />
              Ver Documentação Completa
            </Button>
            <Button variant="outline" onClick={() => navigate('/ajuda')}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Precisa de Ajuda?
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/20 bg-muted/10 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div 
                className="flex items-center space-x-2 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate('/')}
              >
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
    </div>
  );
};

export default API;

