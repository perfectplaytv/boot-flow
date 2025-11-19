import { ArrowLeft, Bot } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

const Privacy = () => {
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
              <Button onClick={() => navigate('/cadastro')}>
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
              <h1 className="text-3xl font-bold">Política de Privacidade</h1>
              <p className="text-muted-foreground">Última atualização: 15 de janeiro de 2024</p>
            </div>
          </div>

        <Card>
          <CardHeader>
            <CardTitle>Nossa Política de Privacidade</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h3 className="text-lg font-semibold">1. Introdução</h3>
              <p className="text-muted-foreground">
                Esta Política de Privacidade descreve como coletamos, usamos, processamos e 
                protegemos suas informações pessoais quando você usa nossa plataforma SaaS. 
                Estamos comprometidos em proteger sua privacidade e garantir a transparência 
                sobre como seus dados são tratados.
              </p>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">2. Informações que Coletamos</h3>
              <p className="text-muted-foreground">
                Coletamos diferentes tipos de informações para fornecer e melhorar nossos serviços:
              </p>
              
              <h4 className="font-medium mt-4">2.1 Informações Pessoais</h4>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Nome, email e informações de contato</li>
                <li>Informações de pagamento e faturamento</li>
                <li>Preferências de conta e configurações</li>
                <li>Histórico de comunicações conosco</li>
              </ul>

              <h4 className="font-medium mt-4">2.2 Dados de Uso</h4>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Logs de atividade na plataforma</li>
                <li>Interações com IA e recursos do sistema</li>
                <li>Dados de desempenho e estatísticas de uso</li>
                <li>Informações sobre dispositivo e navegador</li>
              </ul>

              <h4 className="font-medium mt-4">2.3 Dados Técnicos</h4>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Endereços IP e dados de localização</li>
                <li>Cookies e tecnologias similares</li>
                <li>Dados de sessão e autenticação</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">3. Como Usamos suas Informações</h3>
              <p className="text-muted-foreground">
                Utilizamos suas informações para os seguintes propósitos:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Fornecer e manter nossos serviços</li>
                <li>Processar pagamentos e gerenciar sua conta</li>
                <li>Personalizar sua experiência na plataforma</li>
                <li>Enviar comunicações importantes sobre o serviço</li>
                <li>Melhorar nossos produtos e desenvolver novos recursos</li>
                <li>Detectar e prevenir fraudes ou uso indevido</li>
                <li>Cumprir obrigações legais e regulamentares</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">4. Compartilhamento de Informações</h3>
              <p className="text-muted-foreground">
                Não vendemos suas informações pessoais. Compartilhamos dados apenas nas 
                seguintes circunstâncias:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Com provedores de serviços terceirizados que nos ajudam a operar</li>
                <li>Para cumprir obrigações legais ou solicitações governamentais</li>
                <li>Para proteger nossos direitos, propriedade ou segurança</li>
                <li>Com seu consentimento explícito</li>
                <li>Em caso de fusão, aquisição ou venda de ativos</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">5. Segurança dos Dados</h3>
              <p className="text-muted-foreground">
                Implementamos medidas de segurança técnicas, administrativas e físicas 
                para proteger suas informações:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Criptografia de dados em trânsito e em repouso</li>
                <li>Controles de acesso rigorosos</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Auditorias regulares de segurança</li>
                <li>Treinamento de funcionários sobre proteção de dados</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">6. Seus Direitos</h3>
              <p className="text-muted-foreground">
                Você tem os seguintes direitos em relação aos seus dados pessoais:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Acessar suas informações pessoais</li>
                <li>Corrigir dados incorretos ou incompletos</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Restringir o processamento de suas informações</li>
                <li>Portabilidade de dados</li>
                <li>Retirar o consentimento a qualquer momento</li>
                <li>Apresentar reclamação às autoridades de proteção de dados</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">7. Retenção de Dados</h3>
              <p className="text-muted-foreground">
                Mantemos suas informações pessoais apenas pelo tempo necessário para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Fornecer nossos serviços</li>
                <li>Cumprir obrigações legais</li>
                <li>Resolver disputas</li>
                <li>Fazer cumprir nossos acordos</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Quando os dados não forem mais necessários, serão deletados de forma segura.
              </p>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">8. Cookies e Tecnologias Similares</h3>
              <p className="text-muted-foreground">
                Usamos cookies e tecnologias similares para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Manter você conectado</li>
                <li>Lembrar suas preferências</li>
                <li>Analisar como você usa nossos serviços</li>
                <li>Personalizar conteúdo e anúncios</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Você pode controlar o uso de cookies através das configurações do seu navegador.
              </p>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">9. Transferências Internacionais</h3>
              <p className="text-muted-foreground">
                Seus dados podem ser transferidos e processados em países fora do Brasil. 
                Garantimos que essas transferências atendam aos padrões adequados de proteção 
                de dados através de medidas apropriadas como cláusulas contratuais padrão.
              </p>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">10. Menores de Idade</h3>
              <p className="text-muted-foreground">
                Nossos serviços não são direcionados a menores de 18 anos. Não coletamos 
                intencionalmente informações pessoais de menores. Se tomarmos conhecimento 
                de que coletamos dados de um menor, tomaremos medidas para deletar essas 
                informações.
              </p>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">11. Alterações nesta Política</h3>
              <p className="text-muted-foreground">
                Podemos atualizar esta política ocasionalmente. Notificaremos sobre 
                mudanças significativas através de email ou aviso em nossa plataforma. 
                O uso continuado de nossos serviços após as alterações constitui aceitação 
                da nova política.
              </p>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg font-semibold">12. Contato</h3>
              <p className="text-muted-foreground">
                Para questões sobre esta política de privacidade ou para exercer seus 
                direitos, entre em contato:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Email: privacidade@exemplo.com</li>
                <li>Telefone: +55 11 4000-0000</li>
                <li>Endereço: [Endereço da empresa]</li>
              </ul>
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

export default Privacy;