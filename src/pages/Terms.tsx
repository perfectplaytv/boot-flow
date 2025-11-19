import { ArrowLeft, Bot } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

const Terms = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
      const appUrl = `whatsapp://send?phone=${phoneNumber}&text=${defaultMessage}`;
      window.location.href = appUrl;
      setTimeout(() => {
        window.open(`https://wa.me/${phoneNumber}?text=${defaultMessage}`, "_blank", "noopener,noreferrer");
      }, 1000);
    } else if (isDesktop) {
      const desktopAppUrl = `whatsapp://send?phone=${phoneNumber}&text=${defaultMessage}`;
      const webUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${defaultMessage}`;
      const tryDesktopApp = () => {
        window.location.href = desktopAppUrl;
        setTimeout(() => {
          if (document.hasFocus()) {
            window.open(webUrl, "_blank", "noopener,noreferrer");
          }
        }, 500);
      };
      tryDesktopApp();
    } else {
      window.open(`https://wa.me/${phoneNumber}?text=${defaultMessage}`, "_blank", "noopener,noreferrer");
    }
  };

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const emailSubject = encodeURIComponent('Contato - BootFlow');
    const emailBody = encodeURIComponent('Olá! Gostaria de entrar em contato sobre o BootFlow.');
    window.location.href = `mailto:suporte@bootflow.com.br?subject=${emailSubject}&body=${emailBody}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/20 backdrop-blur-xl bg-background/80 fixed top-0 left-0 right-0 z-50">
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
                className="text-muted-foreground hover:text-foreground transition-colors"
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
                className="text-muted-foreground hover:text-foreground transition-colors"
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

      {/* Spacer para compensar o header fixo */}
      <div className="h-[73px]"></div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Termos de Uso</h1>
              <p className="text-muted-foreground">Última atualização: 15 de janeiro de 2024</p>
            </div>
          </div>

        <Card>
          <CardHeader>
            <CardTitle>Termos e Condições de Uso</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h3 className="text-lg font-semibold">1. Aceitação dos Termos</h3>
              <p className="text-muted-foreground">
                Ao acessar e usar nossa plataforma SaaS, você concorda em ficar vinculado a estes 
                termos de uso e a todas as leis e regulamentos aplicáveis, e concorda que é 
                responsável pelo cumprimento de quaisquer leis locais aplicáveis.
              </p>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">2. Licença de Uso</h3>
              <p className="text-muted-foreground">
                É concedida permissão para baixar temporariamente uma cópia dos materiais em 
                nossa plataforma apenas para visualização transitória pessoal e não comercial. 
                Esta é a concessão de uma licença, não uma transferência de título, e sob esta 
                licença você não pode:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Modificar ou copiar os materiais</li>
                <li>Usar os materiais para qualquer finalidade comercial ou para exibição pública</li>
                <li>Tentar descompilar ou fazer engenharia reversa de qualquer software</li>
                <li>Remover quaisquer direitos autorais ou outras notações proprietárias</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">3. Serviços Oferecidos</h3>
              <p className="text-muted-foreground">
                Nossa plataforma oferece diversos serviços incluindo, mas não limitado a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Sistema de Inteligência Artificial com chat e voz</li>
                <li>Módulo IPTV para revendedores</li>
                <li>Sistema multicanal (WhatsApp, Instagram, Telegram, Email, SMS)</li>
                <li>E-commerce integrado</li>
                <li>Sistema de gamificação</li>
                <li>Rádio web e streaming</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">4. Responsabilidades do Usuário</h3>
              <p className="text-muted-foreground">
                Ao usar nossa plataforma, você se compromete a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Fornecer informações precisas e atualizadas</li>
                <li>Manter a confidencialidade de suas credenciais de acesso</li>
                <li>Não usar a plataforma para atividades ilegais ou não autorizadas</li>
                <li>Respeitar os direitos de propriedade intelectual</li>
                <li>Não interferir no funcionamento normal da plataforma</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">5. Pagamentos e Planos</h3>
              <p className="text-muted-foreground">
                Os serviços são oferecidos através de planos de assinatura com diferentes 
                funcionalidades. O pagamento deve ser efetuado conforme o plano escolhido. 
                A falta de pagamento pode resultar na suspensão ou cancelamento do serviço.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Planos são cobrados antecipadamente</li>
                <li>Cancelamentos podem ser feitos a qualquer momento</li>
                <li>Reembolsos seguem nossa política específica</li>
                <li>Preços podem ser alterados mediante aviso prévio</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">6. Privacidade e Proteção de Dados</h3>
              <p className="text-muted-foreground">
                Respeitamos sua privacidade e estamos comprometidos com a proteção de seus 
                dados pessoais. Nossa política de privacidade descreve como coletamos, 
                usamos e protegemos suas informações.
              </p>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">7. Limitação de Responsabilidade</h3>
              <p className="text-muted-foreground">
                Em nenhum caso nossa empresa será responsável por quaisquer danos 
                (incluindo, sem limitação, danos por perda de dados ou lucro, ou devido 
                a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar 
                os materiais em nossa plataforma.
              </p>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">8. Modificações dos Termos</h3>
              <p className="text-muted-foreground">
                Podemos revisar estes termos de uso a qualquer momento, sem aviso prévio. 
                Ao usar nossa plataforma, você concorda em ficar vinculado à versão atual 
                destes termos de uso.
              </p>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">9. Lei Aplicável</h3>
              <p className="text-muted-foreground">
                Estes termos são regidos e interpretados de acordo com as leis do Brasil, 
                e qualquer disputa relacionada a estes termos estará sujeita à jurisdição 
                exclusiva dos tribunais brasileiros.
              </p>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">10. Contato</h3>
              <p className="text-muted-foreground">
                Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato 
                conosco através do email: legal@exemplo.com ou pelo telefone: +55 11 4000-0000.
              </p>
            </section>
          </CardContent>
        </Card>
        </div>
      </div>

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
                <Badge variant="outline">IA Emocional</Badge>
                <Badge variant="outline">WhatsApp</Badge>
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
    </div>
  );
};

export default Terms;