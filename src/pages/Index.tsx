import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Brain, 
  Radio, 
  Tv, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  MessageSquare, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Play,
  Zap,
  Shield,
  Globe,
  Headphones,
  Phone,
  Mail
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  // Função de login removida - Agora o acesso é direto

  const features = [
    {
      icon: Brain,
      title: "IA Conversacional",
      description: "Chatbot inteligente com vozes masculina e feminina para WhatsApp e atendimento automatizado"
    },
    {
      icon: Tv,
      title: "Sistema IPTV",
      description: "Revenda de canais, filmes e séries com configuração de servidores e exportação M3U"
    },
    {
      icon: Radio,
      title: "Rádio Web Multicanal",
      description: "Integração com Instagram, Facebook, WhatsApp, Telegram, Email e SMS"
    },
    {
      icon: ShoppingCart,
      title: "E-commerce",
      description: "Venda de produtos digitais e físicos com sistema de pagamentos integrado"
    },
    {
      icon: Users,
      title: "Gamificação",
      description: "Sistema de jogos e recompensas para engajar usuários e construir negócios"
    },
    {
      icon: BarChart3,
      title: "Analytics em Tempo Real",
      description: "Relatórios detalhados e estatísticas de uso em tempo real"
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "R$ 97",
      period: "/mês",
      features: [
        "Dashboard Cliente",
        "IA Básica",
        "Até 100 mensagens/mês",
        "Suporte por email"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "R$ 297",
      period: "/mês",
      features: [
        "Dashboard Revenda",
        "IA Avançada + Voz",
        "IPTV Básico",
        "Rádio Web",
        "Até 5.000 mensagens/mês",
        "Suporte prioritário"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "R$ 597",
      period: "/mês",
      features: [
        "Dashboard Administrador",
        "Todos os recursos",
        "E-commerce completo",
        "Gamificação",
        "Mensagens ilimitadas",
        "Suporte 24/7"
      ],
      popular: false
    }
  ];

  const testimonials = [
    {
      name: "Carlos Silva",
      role: "CEO TechStart",
      content: "A plataforma revolucionou nosso atendimento. O ROI foi de 300% no primeiro mês!",
      avatar: "CS"
    },
    {
      name: "Maria Santos",
      role: "Revendedora IPTV",
      content: "Consegui automatizar todo meu negócio e triplicar minha base de clientes.",
      avatar: "MS"
    },
    {
      name: "João Oliveira",
      role: "Empreendedor Digital",
      content: "O sistema de gamificação engajou nossos usuários de forma incrível!",
      avatar: "JO"
    }
  ];

  const faqs = [
    {
      question: "Como funciona a IA conversacional?",
      answer: "Nossa IA utiliza tecnologia avançada de processamento de linguagem natural com vozes realistas para atender seus clientes via WhatsApp automaticamente."
    },
    {
      question: "Posso personalizar o sistema IPTV?",
      answer: "Sim! Você pode configurar servidores, personalizar listas de canais e exportar arquivos M3U para seus clientes."
    },
    {
      question: "O sistema funciona sem internet?",
      answer: "Não, nossa plataforma é baseada em nuvem e requer conexão com internet para funcionar."
    },
    {
      question: "Há limite de usuários?",
      answer: "Depende do plano escolhido. O plano Enterprise oferece usuários ilimitados."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">SaaS Pro</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#recursos" className="hover:text-primary transition-colors">Recursos</a>
            <a href="#precos" className="hover:text-primary transition-colors">Preços</a>
            <a href="#depoimentos" className="hover:text-primary transition-colors">Depoimentos</a>
            <a href="#contato" className="hover:text-primary transition-colors">Contato</a>
          </nav>

          <div className="flex items-center space-x-2">
            {/* Navigation buttons removed as requested */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              🚀 Nova versão com IA disponível!
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              A Plataforma SaaS
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Mais Completa
              </span>
              do Brasil
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              IA Conversacional, IPTV, Rádio Web, E-commerce e Gamificação. 
              Tudo em uma única plataforma para revolucionar seu negócio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-black hover:bg-white/90">
                <Play className="w-5 h-5 mr-2" />
                Ver Demo
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Começar Grátis
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Recursos Poderosos</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubra as funcionalidades que vão transformar seu negócio
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Planos e Preços</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano ideal para o seu negócio
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-glow' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                    Mais Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    {plan.price}
                    <span className="text-lg font-normal text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-primary' : 'bg-secondary'}`}
                    variant={plan.popular ? 'default' : 'secondary'}
                  >
                    Começar Agora
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">O que nossos clientes dizem</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Histórias reais de sucesso com nossa plataforma
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">{testimonial.avatar}</span>
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                    <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  <div className="flex justify-center mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Perguntas Frequentes</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tire suas dúvidas sobre nossa plataforma
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Entre em Contato</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Estamos aqui para ajudar você a crescer
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                <Input 
                        id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Seu nome completo"
                />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                <Input 
                        id="email" 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="seu@email.com"
                />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem</Label>
                <Textarea 
                      id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Como podemos ajudar?"
                      rows={4}
                />
                  </div>
                  <Button type="submit" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">SaaS Pro</span>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} SaaS Pro. Todos os direitos reservados.
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Comunidade</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contato</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 SaaS Pro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
