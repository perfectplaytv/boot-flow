import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Bot, 
  Phone, 
  MessageSquare, 
  Zap, 
  Heart, 
  Star, 
  Shield, 
  TrendingUp,
  Play,
  Check,
  ArrowRight,
  ArrowUp,
  Sparkles,
  Users,
  PhoneCall,
  Clock,
  BarChart3,
  Link,
  Mail,
  CreditCard,
  FileText,
  DollarSign,
  ShoppingCart,
  Download,
  Crown,
  Headphones,
  ArrowRightCircle,
  BarChart,
  Bell,
  AlertCircle,
  Info,
  Calendar
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Landing = () => {
  const [email, setEmail] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Efeito para fazer scroll até a seção de pricing quando a rota for /preco
  useEffect(() => {
    if (location.pathname === '/preco') {
      setTimeout(() => {
        const pricingElement = document.getElementById('pricing');
        if (pricingElement) {
          pricingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location.pathname]);

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

  const features = [
    {
      icon: Bot,
      title: "IA Emocional Avançada",
      description: "Agentes de voz com emoções realistas que se adaptam ao contexto da conversa",
      gradient: "from-primary to-primary-glow"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp Automatizado",
      description: "Integração nativa com WhatsApp para campanhas e atendimento 24/7",
      gradient: "from-secondary to-secondary-glow"
    },
    {
      icon: Zap,
      title: "Automação Inteligente",
      description: "Fluxos condicionais que respondem a palavras-chave e comportamentos",
      gradient: "from-accent to-accent-glow"
    },
    {
      icon: TrendingUp,
      title: "Analytics Avançado",
      description: "Relatórios detalhados de conversões, engajamento e performance das campanhas",
      gradient: "from-primary to-secondary"
    }
  ];

  const avisos = [
    {
      type: "info",
      title: "Nova Funcionalidade: Integração com Mercado Pago",
      date: "15 de Janeiro, 2024",
      description: "Agora você pode receber pagamentos diretamente pelo BootFlow com integração completa ao Mercado Pago. Configure em minutos e comece a faturar!",
      icon: Bell
    },
    {
      type: "update",
      title: "Atualização do Sistema",
      date: "10 de Janeiro, 2024",
      description: "Melhorias de performance e novas funcionalidades de automação foram adicionadas. Sua experiência está mais rápida e eficiente.",
      icon: Zap
    },
    {
      type: "important",
      title: "Manutenção Programada",
      date: "25 de Janeiro, 2024",
      description: "Sistema ficará temporariamente indisponível das 02h às 04h para atualizações importantes. Obrigado pela compreensão.",
      icon: AlertCircle
    }
  ];

  const plans = [
    {
      name: "Essencial",
      price: "R$ 0",
      period: "/mês",
      description: "Para quem está começando e quer organizar o jogo",
      clients: "5 clientes",
      features: [
        { text: "5 clientes", icon: Users },
        { text: "Gestor Bot", icon: Bot },
        { text: "Link WhatsApp", icon: Link },
        { text: "WhatsAPI própria (envios ilimitados)", icon: MessageSquare },
        { text: "Campanhas WhatsApp", icon: Zap },
        { text: "Envio de e-mail", icon: Mail },
        { text: "Emite cobranças", icon: FileText },
        { text: "Link de pagamento", icon: CreditCard },
        { text: "Financeiro completo", icon: DollarSign },
        { text: "Faturas de clientes", icon: FileText },
        { text: "Área do cliente", icon: Users },
        { text: "Exportar dados financeiros", icon: Download },
        { text: "Integração Mercado Pago", icon: ShoppingCart },
        { text: "Envio de produtos digitais", icon: ArrowRightCircle }
      ],
      popular: false,
      highlight: "Entrada perfeita para testar e já faturar. Zero desculpa."
    },
    {
      name: "Profissional",
      price: "R$ 29,90",
      period: "/mês",
      description: "Para quem já tem fluxo e precisa escalar com estrutura",
      clients: "50 clientes",
      features: [
        { text: "50 clientes", icon: Users },
        { text: "Tudo do Essencial", icon: Check },
        { text: "Prioridade no suporte", icon: Headphones }
      ],
      popular: true,
      highlight: "Ideal para pequenos negócios começarem a automatizar pra valer."
    },
    {
      name: "Business",
      price: "R$ 39,90",
      period: "/mês",
      description: "Para quem está crescendo firme e quer automação séria",
      clients: "100 clientes",
      features: [
        { text: "100 clientes", icon: Users },
        { text: "Tudo do Profissional", icon: Check },
        { text: "Recursos avançados de automação", icon: BarChart }
      ],
      popular: false,
      highlight: "Aqui você começa a rodar como empresa de verdade."
    },
    {
      name: "Elite",
      price: "R$ 59,90",
      period: "/mês",
      description: "Para quem quer jogar no nível alto e dominar o mercado",
      clients: "1.000 clientes",
      features: [
        { text: "1.000 clientes", icon: Users },
        { text: "Tudo do Business", icon: Check },
        { text: "Suporte VIP", icon: Crown },
        { text: "Migração assistida", icon: ArrowRightCircle },
        { text: "Auditoria rápida do funil", icon: BarChart }
      ],
      popular: false,
      highlight: "Esse é para quem pensa grande e não aceita travar o crescimento."
    }
  ];

  const stats = [
    { icon: Users, value: "10.000+", label: "Clientes Ativos" },
    { icon: PhoneCall, value: "2M+", label: "Chamadas Processadas" },
    { icon: Clock, value: "24/7", label: "Disponibilidade" },
    { icon: BarChart3, value: "350%", label: "Aumento Médio em Vendas" }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
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
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Funcionalidades
              </a>
              <a href="#avisos" className="text-muted-foreground hover:text-foreground transition-colors">
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

      {/* Hero Section */}
      <section id="hero" className="py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto relative z-10">
          <Badge variant="neon" className="mb-6 animate-pulse-glow">
            <Sparkles className="w-3 h-3 mr-1" />
            Nova Tecnologia de IA Emocional
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text leading-tight">
            Automatize Tudo<br />
            com <span className="text-primary">BootFlow</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            A primeira plataforma de IA emocional do Brasil para atendimento e vendas automatizadas. 
            Revolucione seu WhatsApp com agentes de voz que conversam como humanos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="hero" size="xl" onClick={() => navigate('/cadastro')}>
              <Play className="w-5 h-5 mr-2" />
              Começar Agora - Grátis
            </Button>
            <Button variant="glass" size="xl" onClick={() => navigate('/demo')}>
              <Phone className="w-5 h-5 mr-2" />
              Ver Demo em Ação
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index} className="glass border-border/20 hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="glass" className="mb-4">
              Funcionalidades
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Tecnologia que Impressiona
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Recursos avançados de IA que transformam a forma como você se comunica com seus clientes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="glass border-border/20 hover:border-primary/20 transition-all duration-300 group hover-scale">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Avisos Section */}
      <section id="avisos" className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="glass" className="mb-4">
              Avisos
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Fique por Dentro
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Acompanhe as últimas atualizações, novidades e avisos importantes da plataforma
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {avisos.map((aviso, index) => {
              const IconComponent = aviso.icon;
              const typeColors = {
                info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
                update: "bg-green-500/10 text-green-500 border-green-500/20",
                important: "bg-orange-500/10 text-orange-500 border-orange-500/20"
              };
              
              return (
                <Card key={index} className="glass border-border/20 hover:border-primary/20 transition-all duration-300 hover-scale hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg ${typeColors[aviso.type as keyof typeof typeColors]}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{aviso.date}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg mb-2">{aviso.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{aviso.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section - Modern SaaS Style */}
      <section id="pricing" className="py-24 px-4 bg-gradient-to-b from-background via-background to-muted/20">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge variant="glass" className="mb-4 text-sm px-4 py-1.5">
              Planos e Preços
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
              Escolha o plano ideal para você
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Comece gratuitamente e escale conforme sua empresa cresce. Sem compromisso, cancele quando quiser.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {plans.map((plan, index) => {
              const IconComponent = plan.features[0]?.icon || Check;
              const isPopular = plan.popular;
              const isFree = plan.price === "R$ 0";
              
              return (
                <div
                  key={index}
                  className={`relative flex flex-col rounded-2xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                    isPopular
                      ? 'lg:scale-105 border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10 shadow-xl ring-2 ring-primary/20'
                      : 'border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30'
                  } ${isFree ? 'border-green-500/30' : ''}`}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-1.5 text-xs font-semibold shadow-lg">
                        ⭐ Recomendado
                      </Badge>
                    </div>
                  )}

                  {/* Free Badge */}
                  {isFree && (
                    <div className="absolute -top-4 right-4 z-10">
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 text-xs font-bold shadow-lg">
                        GRÁTIS
                      </Badge>
                    </div>
                  )}

                  {/* Card Header */}
                  <div className="p-6 pb-4 border-b border-border/50">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                    </div>
                    
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                      <span className="text-base text-muted-foreground">{plan.period}</span>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                      <Users className="w-4 h-4" />
                      {plan.clients}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="flex-1 px-6 pt-4 pb-2">
                    <ul className="space-y-1.5 mb-2">
                      {plan.features.map((feature, i) => {
                        const FeatureIcon = feature.icon || Check;
                        return (
                          <li key={i} className="flex items-start gap-2.5 group/item">
                            <div className={`mt-0.5 flex-shrink-0 rounded-full p-1 ${
                              isPopular 
                                ? 'bg-primary/20 text-primary' 
                                : 'bg-muted text-muted-foreground group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors'
                            }`}>
                              <FeatureIcon className="w-4 h-4" />
                            </div>
                            <span className="text-sm leading-relaxed text-foreground/90 group-hover/item:text-foreground transition-colors">
                              {feature.text}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    {/* Highlight Quote */}
                    <div className="border-t border-border/50 pt-2 pb-1">
                      <p className="text-xs text-muted-foreground italic text-center leading-relaxed">
                        "{plan.highlight}"
                      </p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="px-6 pb-6 pt-1">
                    <Button
                      variant={isPopular ? "hero" : isFree ? "default" : "outline"}
                      className={`w-full h-12 text-base font-semibold transition-all duration-300 ${
                        isPopular 
                          ? 'shadow-lg hover:shadow-xl hover:scale-105' 
                          : 'hover:bg-primary hover:text-primary-foreground hover:border-primary'
                      }`}
                      onClick={() => navigate('/cadastro')}
                    >
                      {isFree ? "Começar Agora" : "Assinar Agora"}
                      <ArrowRight className={`w-4 h-4 ml-2 transition-transform group-hover:translate-x-1`} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Todos os planos incluem suporte técnico e atualizações gratuitas
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Sem taxas de setup</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Cancelamento a qualquer momento</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Suporte 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Pronto para Revolucionar seu Atendimento?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Comece gratuitamente hoje e veja como a IA emocional pode transformar seus resultados
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Seu melhor email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-xl"
            />
            <Button variant="secondary" size="lg" onClick={() => navigate('/dashboard')}>
              Teste Grátis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <p className="text-sm text-white/60 mt-4">
            🔒 Sem cartão de crédito • 🚀 Setup em 2 minutos • ⭐ Suporte brasileiro
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
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
                      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
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
                    href="https://wa.me/5511999999999" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:suporte@bootflow.com" 
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

export default Landing;
