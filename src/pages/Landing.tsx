import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  // Force update trigger  
  const [email, setEmail] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Efeito para garantir que a página sempre comece no topo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Efeito para fazer scroll até a seção de pricing quando a rota for /preco
  useEffect(() => {
    if (location.pathname === '/preco') {
      setTimeout(() => {
        const pricingElement = document.getElementById('pricing');
        if (pricingElement) {
          pricingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // Se não for /preco, garantir que está no topo
      window.scrollTo(0, 0);
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

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const phoneNumber = "5527999587725";
    const defaultMessage = encodeURIComponent("Olá! Gostaria de obter suporte sobre o BootFlow.");
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isMac = /Macintosh|MacIntel|MacPPC|Mac68K/i.test(navigator.userAgent);
    const isWindows = /Windows|Win32|Win64/i.test(navigator.userAgent);
    const isLinux = /Linux/i.test(navigator.userAgent);
    const isDesktop = isMac || isWindows || isLinux;

    if (isMobile) {
      // Mobile (Android/iOS): Tenta abrir no app WhatsApp Mobile
      const appUrl = `whatsapp://send?phone=${phoneNumber}&text=${defaultMessage}`;

      // Tenta abrir no app
      window.location.href = appUrl;

      // Fallback: se o app não abrir em 1 segundo, abre no web
      setTimeout(() => {
        window.open(`https://wa.me/${phoneNumber}?text=${defaultMessage}`, "_blank", "noopener,noreferrer");
      }, 1000);
    } else if (isDesktop) {
      // Desktop (Windows/Mac/Linux): Tenta abrir no app WhatsApp Desktop primeiro
      const desktopAppUrl = `whatsapp://send?phone=${phoneNumber}&text=${defaultMessage}`;
      const webUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${defaultMessage}`;

      // Tenta abrir no app WhatsApp Desktop
      const tryDesktopApp = () => {
        window.location.href = desktopAppUrl;

        // Se o app não abrir em 500ms, abre no WhatsApp Web
        setTimeout(() => {
          // Verifica se ainda está na mesma página (app não abriu)
          if (document.hasFocus()) {
            window.open(webUrl, "_blank", "noopener,noreferrer");
          }
        }, 500);
      };

      tryDesktopApp();
    } else {
      // Fallback genérico: usa o link wa.me que funciona em todos os casos
      window.open(`https://wa.me/${phoneNumber}?text=${defaultMessage}`, "_blank", "noopener,noreferrer");
    }
  };

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const emailSubject = encodeURIComponent('Contato - BootFlow');
    const emailBody = encodeURIComponent('Olá! Gostaria de entrar em contato sobre o BootFlow.');
    window.location.href = `mailto:suporte@bootflow.com.br?subject=${emailSubject}&body=${emailBody}`;
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Preparar dados do email
      const emailData = {
        to: 'suporte@bootflow.com.br',
        subject: 'Novo Lead - BootFlow',
        body: `Novo cadastro recebido:\n\n` +
          `Nome: ${formData.name}\n` +
          `Email: ${formData.email}\n` +
          `Telefone: ${formData.phone}\n\n` +
          `Data: ${new Date().toLocaleString('pt-BR')}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };

      // Enviar email diretamente via API (sem abrir cliente de email)
      let emailSent = false;

      // Opção 1: Tentar enviar via API própria primeiro
      const apiUrl = import.meta.env.VITE_EMAIL_API_URL;

      if (apiUrl && apiUrl.trim() !== '') {
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
          });

          if (response.ok) {
            emailSent = true;
            console.log('Email enviado com sucesso via API');
          }
        } catch (apiError) {
          console.log('API não disponível, tentando Formspree...', apiError);
        }
      }

      // Opção 2: Se API não funcionou, tentar Formspree
      if (!emailSent) {
        const formspreeId = import.meta.env.VITE_FORMSPREE_ID;

        if (formspreeId && formspreeId.trim() !== '' && formspreeId !== 'YOUR_FORM_ID') {
          try {
            const formspreeUrl = `https://formspree.io/f/${formspreeId}`;

            const response = await fetch(formspreeUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify({
                _subject: emailData.subject,
                name: emailData.name,
                email: emailData.email,
                phone: emailData.phone,
                message: emailData.body,
              }),
            });

            if (response.ok) {
              emailSent = true;
              console.log('Email enviado com sucesso via Formspree');
            } else {
              const errorData = await response.json().catch(() => ({}));
              console.error('Erro Formspree:', errorData);
            }
          } catch (formspreeError) {
            console.error('Erro ao enviar via Formspree:', formspreeError);
          }
        }
      }

      // Se nenhum método funcionou, usar mailto como fallback
      if (!emailSent) {
        console.warn('Nenhum método de envio configurado, usando mailto como fallback');
        const emailSubject = encodeURIComponent(emailData.subject);
        const emailBody = encodeURIComponent(emailData.body);
        window.location.href = `mailto:${emailData.to}?subject=${emailSubject}&body=${emailBody}`;
      }

      // Enviar para WhatsApp
      const whatsappMessage = encodeURIComponent(
        `🚀 *Novo Lead - BootFlow*\n\n` +
        `👤 *Nome:* ${formData.name}\n` +
        `📧 *Email:* ${formData.email}\n` +
        `📱 *Telefone:* ${formData.phone}\n\n` +
        `📅 *Data:* ${new Date().toLocaleString('pt-BR')}`
      );

      const phoneNumber = "5527999587725";
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isMac = /Macintosh|MacIntel|MacPPC|Mac68K/i.test(navigator.userAgent);
      const isWindows = /Windows|Win32|Win64/i.test(navigator.userAgent);
      const isLinux = /Linux/i.test(navigator.userAgent);
      const isDesktop = isMac || isWindows || isLinux;

      if (isMobile) {
        // Mobile (Android/iOS): Tenta abrir no app WhatsApp Mobile
        const appUrl = `whatsapp://send?phone=${phoneNumber}&text=${whatsappMessage}`;

        // Tenta abrir no app
        window.location.href = appUrl;

        // Fallback: se o app não abrir em 1 segundo, abre no web
        setTimeout(() => {
          window.open(`https://wa.me/${phoneNumber}?text=${whatsappMessage}`, "_blank", "noopener,noreferrer");
        }, 1000);
      } else if (isDesktop) {
        // Desktop (Windows/Mac/Linux): Tenta abrir no app WhatsApp Desktop primeiro
        const desktopAppUrl = `whatsapp://send?phone=${phoneNumber}&text=${whatsappMessage}`;
        const webUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${whatsappMessage}`;

        // Tenta abrir no app WhatsApp Desktop
        const tryDesktopApp = () => {
          window.location.href = desktopAppUrl;

          // Se o app não abrir em 500ms, abre no WhatsApp Web
          setTimeout(() => {
            // Verifica se ainda está na mesma página (app não abriu)
            if (document.hasFocus()) {
              window.open(webUrl, "_blank", "noopener,noreferrer");
            }
          }, 500);
        };

        tryDesktopApp();
      } else {
        // Fallback genérico: usa o link wa.me que funciona em todos os casos
        window.open(`https://wa.me/${phoneNumber}?text=${whatsappMessage}`, "_blank", "noopener,noreferrer");
      }

      // Resetar formulário
      setFormData({ name: "", email: "", phone: "" });
      setCurrentStep(1);

      // Mostrar mensagem de sucesso
      if (emailSent) {
        alert("Dados enviados com sucesso! Obrigado pelo seu interesse.");
      } else {
        alert("Dados preparados! Seu cliente de email será aberto para envio. Obrigado pelo seu interesse.");
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      alert("Ocorreu um erro ao enviar os dados. Por favor, tente novamente ou entre em contato diretamente.");
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

  // --- LÓGICA DINÂMICA (D1 Database) ---
  const [dynamicPlans, setDynamicPlans] = useState<any[]>([]);

  // Mapa de ícones
  const iconMap: Record<string, any> = {
    Users, Bot, Link, MessageSquare, Zap, Mail, FileText, CreditCard, DollarSign,
    Download, ShoppingCart, ArrowRightCircle, Check, Headphones, BarChart, Crown,
    Phone, Star, Shield, TrendingUp, Play, ArrowRight, ArrowUp, Sparkles, PhoneCall,
    Clock, BarChart3, AlertCircle, Info, Calendar
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch('/api/plans');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const processed = data.map((p: any) => ({
              ...p,
              features: Array.isArray(p.features) ? p.features.map((f: any) => ({
                text: f.text,
                icon: (typeof f.icon === 'string' ? iconMap[f.icon] : f.icon) || Check
              })) : []
            }));
            setDynamicPlans(processed);
          }
        }
      } catch (err) {
        // Silently fail to static plans
      }
    };
    fetchPlans();
  }, []);

  const plansToDisplay = dynamicPlans.length > 0 ? dynamicPlans : plans;

  const stats = [
    { icon: Users, value: "10.000+", label: "Clientes Ativos" },
    { icon: PhoneCall, value: "2M+", label: "Chamadas Processadas" },
    { icon: Clock, value: "24/7", label: "Disponibilidade" },
    { icon: BarChart3, value: "350%", label: "Aumento Médio em Vendas" }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Announcement Bar */}
      <div className="bg-blue-600 text-white py-2 px-4 text-center text-sm font-medium z-[60] relative">
        <div className="container mx-auto flex items-center justify-center gap-2 animate-pulse-glow">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>🚀 Adicione membros reais no seu grupo Telegram agora mesmo!</span>
          <Sparkles className="w-4 h-4 text-yellow-300" />
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-border/20 backdrop-blur-xl bg-background/80 sticky top-0 left-0 right-0 z-50">
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

      {/* Hero Section Premium - Dual Column Optimized */}
      <section id="hero" className="relative pt-6 pb-20 lg:pt-10 lg:pb-32 overflow-hidden bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-background">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-50 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl opacity-50 animate-pulse delay-700" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">

            {/* Left Column (5 Cols): Copy & Headline */}
            <div className="lg:col-span-5 text-center lg:text-left space-y-6">
              <Badge variant="outline" className="py-1.5 px-4 bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 backdrop-blur-sm animate-fade-in mx-auto lg:mx-0">
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  Sistema 100% Automático
                </span>
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight gradient-text">
                Transforme seu Telegram em uma <br />
                <span className="text-primary relative inline-block">
                  Máquina de Vendas
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-400/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed font-light">
                Nosso Robô vai trazer <strong>leads segmentados</strong>, encher seus grupos e automatizar seu atendimento. Aumente seu faturamento enquanto você dorme.
              </p>
            </div>

            {/* Right Column (7 Cols): Buttons + Trust + Mockup Grouped */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-end space-y-8">

              {/* 1. CTA Buttons & Trust (Align Right/Center) */}
              <div className="w-full flex flex-col items-center lg:items-end space-y-4 animate-fade-in delay-200">
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-end">
                  <Button
                    size="xl"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 w-full sm:w-auto min-w-[240px]"
                    onClick={() => scrollToPricing()}
                  >
                    <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                    QUERO APROVEITAR
                  </Button>
                  <Button
                    variant="outline"
                    size="xl"
                    className="border-2 font-semibold hover:bg-muted/50 transition-all duration-300 w-full sm:w-auto min-w-[180px]"
                    onClick={() => {
                      const el = document.getElementById('features');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Ver na Prática
                  </Button>
                </div>

                <div className="flex flex-wrap justify-center lg:justify-end gap-3 text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-1.5 bg-background/50 px-3 py-1 rounded-full border border-border/50">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Setup Instantâneo</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-background/50 px-3 py-1 rounded-full border border-border/50">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Teste Grátis</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-background/50 px-3 py-1 rounded-full border border-border/50">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Suporte 24/7</span>
                  </div>
                </div>
              </div>

              {/* 2. Interactive Mockup/Video (Below Buttons) */}
              <div className="relative w-full perspective-1000 group pt-4">
                {/* Floating Notifications */}
                <div className="absolute top-8 right-[5%] z-30 animate-float-slow hidden md:block">
                  <div className="bg-white dark:bg-gray-800 p-2.5 rounded-xl shadow-xl shadow-black/10 border border-border/50 flex items-center gap-3 backdrop-blur-md transform scale-90">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-medium text-muted-foreground">Venda Realizada</div>
                      <div className="text-sm font-bold text-green-600 dark:text-green-400">+ R$ 297,00</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-16 left-[0%] z-30 animate-float-delayed hidden md:block">
                  <div className="bg-white dark:bg-gray-800 p-2.5 rounded-xl shadow-xl shadow-black/10 border border-border/50 flex items-center gap-3 backdrop-blur-md transform scale-90">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-medium text-muted-foreground">Novo Lead</div>
                      <div className="text-sm font-bold text-foreground">Grupo Cheio 🚀</div>
                    </div>
                  </div>
                </div>

                {/* Laptop CSS Mockup (Placeholder for Video) */}
                <div className="relative w-full aspect-[16/10] bg-gray-900 rounded-[16px] md:rounded-[20px] shadow-2xl shadow-blue-500/20 border-[6px] md:border-[10px] border-gray-800 overflow-hidden transform transition-all duration-700 ease-out hover:scale-[1.01] hover:shadow-blue-500/30">
                  {/* Screen Content - VIDEO GOES HERE */}
                  <div className="absolute inset-0 bg-gray-950 flex flex-col">
                    {/* Fake Browser Bar */}
                    <div className="h-6 md:h-8 bg-gray-900 flex items-center px-4 gap-2 border-b border-gray-800">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                      </div>
                      <div className="flex-1 mx-4 h-4 bg-gray-800 rounded-md flex items-center justify-center text-[10px] text-gray-500 font-mono">
                        bootflow.app/dashboard
                      </div>
                    </div>

                    {/* VIDEO CONTAINER - Substituir pelo <video> real depois */}
                    <div className="flex-1 p-6 relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-900 to-slate-900">
                      <div className="text-center space-y-4 z-10">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/50 animate-pulse">
                          <Bot className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-white font-bold text-xl md:text-2xl">BootFlow Video Placeholder</h3>
                        <p className="text-xs text-blue-300">Seu vídeo entrará aqui</p>

                        <div className="mt-4 p-3 bg-black/40 rounded border border-white/10 text-[10px] font-mono text-green-400 text-left w-64 mx-auto">
                          &gt; Initializing...<br />
                          &gt; Ready to scale sales.
                        </div>
                      </div>

                      {/* Grid lines */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
                    </div>
                  </div>
                </div>

                {/* Laptop Base */}
                <div className="absolute -bottom-3 left-[5%] w-[90%] h-3 bg-gray-800 rounded-b-lg shadow-xl z-[-1]"></div>
              </div>

            </div>

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
            {plansToDisplay.map((plan, index) => {
              const IconComponent = plan.features[0]?.icon || Check;
              const isPopular = plan.popular;
              const isFree = plan.price === "R$ 0";

              return (
                <div
                  key={index}
                  className={`relative flex flex-col rounded-2xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isPopular
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
                            <div className={`mt-0.5 flex-shrink-0 rounded-full p-1 ${isPopular
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
                      className={`w-full h-12 text-base font-semibold transition-all duration-300 ${isPopular
                        ? 'shadow-lg hover:shadow-xl hover:scale-105'
                        : 'hover:bg-primary hover:text-primary-foreground hover:border-primary'
                        }`}
                      onClick={() => {
                        if (isFree) {
                          navigate('/cadastro');
                        } else {
                          // Remover componentes React (ícones) para evitar erro de DataCloneError na navegação
                          const serializablePlan = {
                            ...plan,
                            features: plan.features.map(f => ({ text: f.text }))
                          };
                          navigate('/checkout', { state: { plan: serializablePlan } });
                        }
                      }}
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

          {/* Formulário de 3 Etapas */}
          <div className="max-w-md mx-auto">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardContent className="p-6">
                {/* Indicador de Steps */}
                <div className="flex justify-center mb-6 gap-2">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step === currentStep
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white scale-110 shadow-lg shadow-purple-500/50"
                        : step < currentStep
                          ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                          : "bg-white/30 border-2 border-white/40 text-white"
                        }`}
                    >
                      {step < currentStep ? <Check className="w-5 h-5 text-white" /> : <span className="text-white font-bold">{step}</span>}
                    </div>
                  ))}
                </div>

                {/* Step 1: Nome */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <Label htmlFor="name" className="text-white text-left block mb-2">
                      Qual é o seu nome?
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Digite seu nome completo"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-xl"
                      autoFocus
                    />
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={handleNextStep}
                      disabled={!formData.name.trim()}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 font-semibold shadow-lg shadow-purple-500/50 [&_svg]:text-white"
                    >
                      Continuar
                      <ArrowRight className="w-4 h-4 ml-2 text-white" />
                    </Button>
                  </div>
                )}

                {/* Step 2: Email */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <Label htmlFor="email" className="text-white text-left block mb-2">
                      Qual é o seu melhor email?
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-xl"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handlePreviousStep}
                        className="flex-1 bg-white/20 border-white/30 text-white hover:bg-white/30 font-semibold"
                      >
                        Voltar
                      </Button>
                      <Button
                        variant="secondary"
                        size="lg"
                        onClick={handleNextStep}
                        disabled={!formData.email.trim() || !formData.email.includes('@')}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 font-semibold shadow-lg shadow-purple-500/50 [&_svg]:text-white"
                      >
                        Continuar
                        <ArrowRight className="w-4 h-4 ml-2 text-white" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Telefone */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <Label htmlFor="phone" className="text-white text-left block mb-2">
                      Qual é o seu WhatsApp?
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(27) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 11) {
                          if (value.length > 0) {
                            if (value.length <= 2) {
                              value = `(${value}`;
                            } else if (value.length <= 7) {
                              value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                            } else {
                              value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
                            }
                          }
                          setFormData({ ...formData, phone: value });
                        }
                      }}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-xl"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handlePreviousStep}
                        className="flex-1 bg-white/20 border-white/30 text-white hover:bg-white/30 font-semibold"
                      >
                        Voltar
                      </Button>
                      <Button
                        variant="secondary"
                        size="lg"
                        onClick={handleSubmit}
                        disabled={!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 font-semibold shadow-lg shadow-purple-500/50 [&_svg]:text-white"
                      >
                        Enviar
                        <ArrowRight className="w-4 h-4 ml-2 text-white" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
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
                    href="https://wa.me/5527999587725"
                    onClick={handleWhatsAppClick}
                    className="hover:text-foreground transition-colors cursor-pointer"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:suporte@bootflow.com.br"
                    onClick={handleEmailClick}
                    className="hover:text-foreground transition-colors cursor-pointer"
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
