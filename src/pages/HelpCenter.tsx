import { useState, useEffect } from "react";
import { ArrowLeft, Search, MessageSquare, Phone, Mail, Book, Video, FileText, ExternalLink, ChevronRight, ArrowUp, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const HelpCenter = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<string | null>(null);

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

  const faqs = [
    {
      question: "Como configurar a IA do sistema?",
      answer: "Para configurar a IA, acesse o painel de administração > Configurações de IA. Lá você pode ajustar o modelo, personalidade e configurações de voz da IA.",
      category: "IA"
    },
    {
      question: "Como adicionar um novo revendedor?",
      answer: "No painel administrativo, clique em 'Revendedores' > 'Adicionar Novo'. Preencha os dados e defina as permissões de acesso.",
      category: "Usuários"
    },
    {
      question: "Como configurar o sistema IPTV?",
      answer: "Acesse Módulos > IPTV > Configurações. Configure os servidores, listas de canais e defina as permissões para revendedores.",
      category: "IPTV"
    },
    {
      question: "Como agendar campanhas de WhatsApp?",
      answer: "Vá para Campanhas > WhatsApp > Nova Campanha. Defina a mensagem, público-alvo e horário de envio.",
      category: "Campanhas"
    },
    {
      question: "Como alterar meu plano?",
      answer: "Acesse Pagamentos > Plano Atual > Alterar Plano. Escolha o novo plano e confirme a alteração.",
      category: "Pagamentos"
    }
  ];

  const guides = [
    {
      id: "primeiros-passos",
      title: "Guia de Primeiros Passos",
      description: "Configure sua conta e comece a usar a plataforma",
      type: "text",
      duration: "5 min",
      icon: Book,
      content: {
        sections: [
          {
            title: "1. Criando sua Conta",
            content: "Para começar, acesse a página de cadastro e preencha seus dados básicos. Você precisará de um email válido e uma senha segura. Após o cadastro, verifique seu email para ativar a conta."
          },
          {
            title: "2. Configuração Inicial",
            content: "Após o login, você será direcionado para o dashboard. Complete seu perfil adicionando informações como nome completo, telefone e empresa. Isso ajudará na personalização da plataforma."
          },
          {
            title: "3. Explorando o Dashboard",
            content: "O dashboard é seu centro de comando. Aqui você encontrará: estatísticas em tempo real, acesso rápido aos módulos principais, notificações importantes e atalhos para funcionalidades mais usadas."
          },
          {
            title: "4. Primeiros Passos com IA",
            content: "Configure sua primeira assistente de IA acessando o módulo 'IA + Voz'. Escolha uma voz (masculina ou feminina), defina a personalidade e teste as respostas antes de ativar."
          },
          {
            title: "5. Conectando WhatsApp",
            content: "Para começar a usar o WhatsApp, vá em 'WhatsApp' > 'Configurações' e siga o processo de conexão. Você precisará escanear um QR Code com seu WhatsApp Business."
          },
          {
            title: "6. Criando seu Primeiro Cliente",
            content: "Acesse 'Clientes' > 'Novo Cliente' e preencha as informações. Você pode adicionar planos, definir datas de expiração e configurar notificações automáticas."
          }
        ]
      }
    },
    {
      id: "configurando-ia",
      title: "Configurando a IA",
      description: "Tutorial completo sobre configuração da IA",
      type: "video",
      duration: "12 min",
      icon: Video,
      content: {
        sections: [
          {
            title: "1. Acessando as Configurações de IA",
            content: "No menu lateral, clique em 'IA + Voz' para acessar o painel de configuração. Aqui você encontrará todas as opções para personalizar sua assistente virtual."
          },
          {
            title: "2. Escolhendo o Modelo de IA",
            content: "Selecione o modelo de IA que melhor se adequa ao seu negócio. Temos modelos otimizados para vendas, suporte técnico e atendimento geral. Cada modelo tem características específicas de linguagem e tom."
          },
          {
            title: "3. Personalizando a Voz",
            content: "Escolha entre vozes masculinas e femininas, ajuste a velocidade de fala, o tom e a entonação. Você pode testar cada configuração antes de salvar."
          },
          {
            title: "4. Configurando a Personalidade",
            content: "Defina como sua IA deve se comportar: formal ou casual, empática ou direta, técnica ou simples. Isso influencia diretamente na experiência do cliente."
          },
          {
            title: "5. Treinando com Base de Conhecimento",
            content: "Adicione documentos, FAQs e informações sobre seu produto/serviço. A IA usará essas informações para responder perguntas dos clientes de forma mais precisa."
          },
          {
            title: "6. Configurando Fluxos de Conversa",
            content: "Crie fluxos condicionais que direcionam a conversa baseado em palavras-chave, intenções do cliente ou contexto da conversa. Isso permite automações mais inteligentes."
          },
          {
            title: "7. Testando e Ajustando",
            content: "Use o modo de teste para simular conversas e verificar se as respostas estão adequadas. Faça ajustes conforme necessário antes de ativar em produção."
          }
        ]
      }
    },
    {
      id: "iptv-revendedores",
      title: "Sistema IPTV para Revendedores",
      description: "Como ativar e configurar o módulo IPTV",
      type: "text",
      duration: "8 min",
      icon: FileText,
      content: {
        sections: [
          {
            title: "1. Ativando o Módulo IPTV",
            content: "Acesse 'Módulos' > 'IPTV' no menu lateral. Se o módulo não estiver ativo, clique em 'Ativar Módulo'. Alguns planos podem exigir upgrade para acessar esta funcionalidade."
          },
          {
            title: "2. Configurando Servidores",
            content: "Vá em 'IPTV' > 'Servidores' e adicione seus servidores IPTV. Informe o nome, URL do servidor, credenciais de acesso e limite de conexões simultâneas. Você pode adicionar múltiplos servidores."
          },
          {
            title: "3. Importando Listas de Canais",
            content: "Use a função 'Importar M3U' para carregar suas listas de canais. Você pode importar arquivos M3U ou inserir URLs diretas. O sistema organizará automaticamente os canais por categoria."
          },
          {
            title: "4. Criando Pacotes (Bouquets)",
            content: "Organize seus canais em pacotes personalizados. Crie pacotes como 'Básico', 'Premium', 'Esportes', etc. Isso facilita a venda e gestão para seus clientes."
          },
          {
            title: "5. Configurando Preços e Planos",
            content: "Defina preços para cada pacote e crie planos de assinatura (Mensal, Trimestral, Semestral, Anual). Configure descontos e promoções conforme necessário."
          },
          {
            title: "6. Gerenciando Revendedores",
            content: "No painel de revendedores, você pode definir quais servidores e pacotes cada revendedor pode acessar. Configure limites de clientes e comissões."
          },
          {
            title: "7. Exportando Credenciais",
            content: "Para cada cliente, você pode gerar links M3U personalizados ou credenciais de acesso. Essas informações são enviadas automaticamente por email ou WhatsApp após a ativação."
          },
          {
            title: "8. Monitoramento e Estatísticas",
            content: "Acompanhe o uso dos servidores, conexões ativas, canais mais assistidos e receita gerada. Use esses dados para otimizar sua operação."
          }
        ]
      }
    },
    {
      id: "campanhas-multicanal",
      title: "Campanhas Multicanal",
      description: "Criando campanhas para WhatsApp, Instagram e mais",
      type: "video",
      duration: "15 min",
      icon: Video,
      content: {
        sections: [
          {
            title: "1. Acessando o Módulo de Campanhas",
            content: "No menu principal, clique em 'Campanhas' para acessar o gerenciador de campanhas. Aqui você pode criar, editar e monitorar todas as suas campanhas."
          },
          {
            title: "2. Escolhendo o Canal",
            content: "Selecione o canal de comunicação: WhatsApp, Instagram, Facebook, Telegram, Email ou SMS. Cada canal tem características específicas e formatos de mensagem diferentes."
          },
          {
            title: "3. Definindo o Público-Alvo",
            content: "Crie segmentos de clientes baseado em critérios como: plano contratado, data de cadastro, última interação, localização, ou tags personalizadas. Isso garante que a mensagem chegue às pessoas certas."
          },
          {
            title: "4. Criando a Mensagem",
            content: "Use o editor de mensagens para criar conteúdo personalizado. Você pode usar variáveis dinâmicas como {nome}, {empresa}, {plano} para personalizar cada mensagem. Adicione imagens, vídeos ou documentos quando disponível."
          },
          {
            title: "5. Agendando o Envio",
            content: "Escolha entre envio imediato ou agendado. Para agendamento, defina data e horário específicos. Você pode também configurar envios recorrentes (diário, semanal, mensal)."
          },
          {
            title: "6. Configurando Automações",
            content: "Crie respostas automáticas para interações dos clientes. Configure palavras-chave que disparam ações específicas, como enviar um catálogo, agendar uma reunião ou transferir para atendimento humano."
          },
          {
            title: "7. Testando a Campanha",
            content: "Antes de enviar para todos, envie uma mensagem de teste para você mesmo ou para um grupo de teste. Verifique se a formatação, links e mídias estão funcionando corretamente."
          },
          {
            title: "8. Monitorando Resultados",
            content: "Acompanhe em tempo real: mensagens enviadas, entregues, lidas e respondidas. Analise taxas de abertura, cliques e conversões. Use esses dados para melhorar campanhas futuras."
          },
          {
            title: "9. Campanhas Multicanal Coordenadas",
            content: "Crie campanhas que enviam mensagens em múltiplos canais simultaneamente ou sequencialmente. Por exemplo: WhatsApp primeiro, depois Email se não houver resposta, e por fim SMS."
          }
        ]
      }
    }
  ];

  const contactOptions = [
    {
      title: "Chat ao Vivo",
      description: "Fale conosco em tempo real",
      icon: MessageSquare,
      action: "Iniciar Chat",
      available: true
    },
    {
      title: "Telefone",
      description: "+55 11 4000-0000",
      icon: Phone,
      action: "Ligar",
      available: true
    },
    {
      title: "Email",
      description: "suporte@exemplo.com",
      icon: Mail,
      action: "Enviar Email",
      available: true
    }
  ];

  const additionalResources = [
    {
      id: "documentacao-api",
      title: "Documentação da API",
      description: "Integre com nossa API",
      icon: FileText,
      content: {
        sections: [
          {
            title: "O que é a API do BootFlow?",
            content: "A API REST do BootFlow permite que você integre todas as funcionalidades da plataforma com seus próprios sistemas, aplicativos e serviços. Com ela, você pode automatizar processos, sincronizar dados e criar integrações personalizadas."
          },
          {
            title: "Autenticação",
            content: "Para usar a API, você precisa de uma chave de API (API Key). Gere sua chave em 'Configurações' > 'API' > 'Gerar Nova Chave'. Todas as requisições devem incluir o header 'Authorization: Bearer {sua-api-key}'. Mantenha sua chave segura e nunca a compartilhe publicamente."
          },
          {
            title: "Endpoints Principais",
            content: "Nossa API oferece endpoints para: gerenciar clientes (CRUD completo), enviar mensagens via WhatsApp, criar e gerenciar campanhas, configurar assistentes de IA, gerenciar revendedores, consultar estatísticas e relatórios, e muito mais."
          },
          {
            title: "Formato de Resposta",
            content: "Todas as respostas da API seguem o formato JSON padrão. Respostas de sucesso retornam status HTTP 200-299 com os dados solicitados. Erros retornam status 400-500 com uma mensagem de erro descritiva no formato: { 'error': 'mensagem de erro', 'code': 'codigo_erro' }."
          },
          {
            title: "Rate Limiting",
            content: "Para garantir a estabilidade do serviço, aplicamos limites de taxa (rate limiting). O plano Essencial permite 100 requisições/minuto, Profissional 500/minuto, Business 2000/minuto e Elite ilimitado. Exceder o limite retorna status 429 (Too Many Requests)."
          },
          {
            title: "Webhooks",
            content: "Configure webhooks para receber notificações em tempo real sobre eventos importantes: novos clientes, mensagens recebidas, pagamentos confirmados, campanhas finalizadas, etc. Configure os webhooks em 'Configurações' > 'Webhooks'."
          },
          {
            title: "Exemplos de Código",
            content: "Fornecemos exemplos de código em várias linguagens (JavaScript, Python, PHP, cURL) na documentação completa. Acesse '/api' para ver exemplos práticos e começar a integrar rapidamente."
          },
          {
            title: "Suporte para Desenvolvedores",
            content: "Nossa equipe oferece suporte técnico especializado para desenvolvedores. Entre em contato através do email dev@bootflow.com ou acesse nossa comunidade de desenvolvedores para compartilhar experiências e obter ajuda."
          }
        ]
      }
    },
    {
      id: "changelog",
      title: "Changelog",
      description: "Veja as últimas atualizações",
      icon: FileText,
      content: {
        sections: [
          {
            title: "Versão 3.5.0 - Janeiro 2024",
            content: "Nova integração com Mercado Pago para pagamentos diretos na plataforma. Melhorias significativas na performance do sistema de IA emocional. Novo dashboard de analytics com métricas em tempo real. Suporte a múltiplos idiomas na interface."
          },
          {
            title: "Versão 3.4.0 - Dezembro 2023",
            content: "Sistema de campanhas multicanal aprimorado com suporte a Instagram e Facebook. Nova funcionalidade de agendamento inteligente de mensagens. Melhorias na interface do módulo IPTV. Correções de bugs e otimizações gerais."
          },
          {
            title: "Versão 3.3.0 - Novembro 2023",
            content: "Lançamento do sistema de gamificação completo. Novo módulo de rádio web multicanal. Integração com Telegram para campanhas. Melhorias no sistema de notificações. Nova API v2 com mais endpoints e melhor documentação."
          },
          {
            title: "Versão 3.2.0 - Outubro 2023",
            content: "Sistema de IA emocional com vozes mais realistas. Novo editor de fluxos visuais para automações. Suporte a envio de mídias (imagens, vídeos, documentos) via WhatsApp. Dashboard de revendedores redesenhado."
          },
          {
            title: "Versão 3.1.0 - Setembro 2023",
            content: "Sistema de cobranças automatizadas. Integração com gateways de pagamento. Novo módulo de e-commerce. Melhorias na segurança com autenticação de dois fatores. Sistema de backup automático."
          },
          {
            title: "Como Acompanhar Atualizações",
            content: "Você pode acompanhar todas as atualizações através desta página, que é atualizada sempre que uma nova versão é lançada. Também enviamos notificações por email sobre atualizações importantes. Configure suas preferências de notificação em 'Configurações' > 'Notificações'."
          },
          {
            title: "Sugestões de Melhorias",
            content: "Tem uma ideia para melhorar a plataforma? Envie suas sugestões através do email feedback@bootflow.com ou participe da nossa comunidade de desenvolvedores. Suas sugestões são muito importantes para nós!"
          }
        ]
      }
    },
    {
      id: "comunidade",
      title: "Comunidade",
      description: "Participe do fórum",
      icon: MessageSquare,
      content: {
        sections: [
          {
            title: "O que é a Comunidade BootFlow?",
            content: "A Comunidade BootFlow é um espaço onde usuários, desenvolvedores e entusiastas da plataforma se reúnem para compartilhar conhecimento, experiências, dicas, tutoriais e ajudar uns aos outros."
          },
          {
            title: "Benefícios de Participar",
            content: "Ao participar da comunidade, você terá acesso a: tutoriais criados por outros usuários, soluções para problemas comuns, dicas de otimização e melhores práticas, networking com outros empreendedores, acesso antecipado a novas funcionalidades, e suporte da comunidade além do suporte oficial."
          },
          {
            title: "Como Participar",
            content: "Para participar, acesse nosso fórum em forum.bootflow.com e crie sua conta gratuita. Você pode fazer perguntas, responder dúvidas de outros membros, compartilhar seus casos de sucesso e contribuir com a documentação colaborativa."
          },
          {
            title: "Categorias do Fórum",
            content: "O fórum está organizado em categorias: 'Primeiros Passos' para iniciantes, 'Dúvidas Técnicas' para questões técnicas, 'Integrações e API' para desenvolvedores, 'Casos de Sucesso' para compartilhar resultados, 'Sugestões' para melhorias, e 'Marketplace' para serviços e produtos relacionados."
          },
          {
            title: "Regras da Comunidade",
            content: "Mantenha o respeito e cordialidade em todas as interações. Compartilhe conhecimento de forma clara e útil. Não faça spam ou autopromoção excessiva. Respeite a privacidade e dados de outros membros. Siga as diretrizes de cada categoria do fórum."
          },
          {
            title: "Programa de Moderadores",
            content: "Membros ativos e experientes podem se tornar moderadores da comunidade. Moderadores ajudam a manter a qualidade das discussões, respondem dúvidas e guiam novos membros. Entre em contato se tiver interesse em se tornar moderador."
          },
          {
            title: "Eventos e Webinars",
            content: "Regularmente organizamos webinars, workshops e eventos online para a comunidade. Participe para aprender novas funcionalidades, conhecer casos de sucesso e interagir diretamente com a equipe BootFlow e outros membros."
          },
          {
            title: "Contribuindo com Conteúdo",
            content: "Você pode contribuir criando tutoriais, vídeos, artigos ou compartilhando suas experiências. Conteúdo de qualidade pode ser destacado e até mesmo integrado à documentação oficial. Entre em contato para saber como contribuir."
          }
        ]
      }
    },
    {
      id: "status-plataforma",
      title: "Status da Plataforma",
      description: "Verificar status dos serviços",
      icon: FileText,
      content: {
        sections: [
          {
            title: "O que é a Página de Status?",
            content: "A página de Status da Plataforma fornece informações em tempo real sobre a disponibilidade e performance de todos os serviços do BootFlow. Você pode verificar se há incidentes, manutenções programadas ou problemas conhecidos."
          },
          {
            title: "Status dos Serviços",
            content: "Monitoramos continuamente: API e endpoints, sistema de mensagens WhatsApp, processamento de IA e voz, servidores IPTV, sistema de pagamentos, dashboard e interface web, sincronização de dados, e webhooks e notificações."
          },
          {
            title: "Indicadores de Status",
            content: "Verde (Operacional): Todos os sistemas funcionando normalmente. Amarelo (Degradado): Alguns serviços podem estar mais lentos ou com funcionalidades limitadas. Vermelho (Indisponível): Serviço temporariamente fora do ar. Azul (Manutenção): Manutenção programada em andamento."
          },
          {
            title: "Histórico de Incidentes",
            content: "Mantemos um histórico completo de todos os incidentes, incluindo: data e horário do incidente, duração, serviços afetados, causa raiz, e ações tomadas para resolução. Isso ajuda a manter a transparência e permite que você entenda o que aconteceu."
          },
          {
            title: "Manutenções Programadas",
            content: "Anunciamos todas as manutenções programadas com pelo menos 48 horas de antecedência. Durante a manutenção, alguns serviços podem ficar temporariamente indisponíveis. Tentamos sempre agendar manutenções em horários de menor uso."
          },
          {
            title: "Notificações de Status",
            content: "Você pode se inscrever para receber notificações sobre mudanças de status através de email, SMS ou webhook. Configure suas preferências em 'Configurações' > 'Notificações' > 'Status da Plataforma'."
          },
          {
            title: "SLA e Garantias",
            content: "Nosso objetivo é manter 99.9% de uptime para todos os serviços. Planos Enterprise e Elite têm SLAs garantidos com compensações em caso de indisponibilidade. Consulte os termos de serviço para mais detalhes sobre garantias do seu plano."
          },
          {
            title: "Reportar Problemas",
            content: "Se você notar um problema que não está listado na página de status, entre em contato imediatamente através do suporte. Isso nos ajuda a identificar e resolver problemas mais rapidamente. Inclua detalhes sobre o que você estava fazendo quando o problema ocorreu."
          }
        ]
      }
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Central de Ajuda</h1>
            <p className="text-muted-foreground">Encontre respostas e obtenha suporte</p>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Busque por uma pergunta ou tópico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faq">Perguntas Frequentes</TabsTrigger>
            <TabsTrigger value="guides">Guias</TabsTrigger>
            <TabsTrigger value="contact">Contato</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Perguntas Frequentes</CardTitle>
                <CardDescription>
                  Respostas para as dúvidas mais comuns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="text-left hover:no-underline">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            {faq.category}
                          </Badge>
                          <span>{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {filteredFaqs.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Nenhuma pergunta encontrada. Tente ajustar sua busca.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guides" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guides.map((guide, index) => {
                const IconComponent = guide.icon;
                return (
                  <Card 
                    key={index} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedGuide(guide.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{guide.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {guide.type === "video" ? "Vídeo" : "Texto"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {guide.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {guide.duration}
                            </span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recursos Adicionais</CardTitle>
                <CardDescription>
                  Links úteis e documentação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {additionalResources.map((resource, index) => {
                    const IconComponent = resource.icon;
                    return (
                      <Button 
                        key={index}
                        variant="outline" 
                        className="justify-between h-auto p-4 cursor-pointer hover:bg-accent"
                        onClick={() => setSelectedResource(resource.id)}
                      >
                        <div className="text-left">
                          <h4 className="font-medium">{resource.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {resource.description}
                          </p>
                        </div>
                        <IconComponent className="h-4 w-4" />
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactOptions.map((option, index) => {
                const IconComponent = option.icon;
                const handleAction = () => {
                  if (option.title === "Chat ao Vivo") {
                    const phoneNumber = "5527999587725";
                    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    const isMac = /Macintosh|MacIntel|MacPPC|Mac68K/i.test(navigator.userAgent);
                    const isWindows = /Windows|Win32|Win64/i.test(navigator.userAgent);
                    const isLinux = /Linux/i.test(navigator.userAgent);
                    const isDesktop = isMac || isWindows || isLinux;
                    
                    if (isMobile) {
                      // Mobile (Android/iOS): Tenta abrir no app WhatsApp Mobile
                      const appUrl = `whatsapp://send?phone=${phoneNumber}`;
                      
                      // Tenta abrir no app
                      window.location.href = appUrl;
                      
                      // Fallback: se o app não abrir em 1 segundo, abre no web
                      setTimeout(() => {
                        window.open(`https://wa.me/${phoneNumber}`, "_blank", "noopener,noreferrer");
                      }, 1000);
                    } else if (isDesktop) {
                      // Desktop (Windows/Mac/Linux): Tenta abrir no app WhatsApp Desktop primeiro
                      const desktopAppUrl = `whatsapp://send?phone=${phoneNumber}`;
                      const webUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=`;
                      
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
                      window.open(`https://wa.me/${phoneNumber}`, "_blank", "noopener,noreferrer");
                    }
                  } else if (option.title === "Telefone") {
                    window.open(`tel:${option.description.replace(/\s/g, "")}`, "_self");
                  } else if (option.title === "Email") {
                    window.open(`mailto:${option.description}`, "_self");
                  }
                };
                
                return (
                  <Card key={index}>
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{option.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {option.description}
                      </p>
                      <Button 
                        className="w-full"
                        disabled={!option.available}
                        onClick={handleAction}
                      >
                        {option.action}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Horários de Atendimento</CardTitle>
                <CardDescription>
                  Nossos horários de suporte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Suporte Técnico</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Segunda a Sexta:</span>
                        <span>8h às 18h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sábado:</span>
                        <span>9h às 15h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Domingo:</span>
                        <span>Fechado</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Chat ao Vivo</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Segunda a Sexta:</span>
                        <span>8h às 22h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fim de Semana:</span>
                        <span>9h às 18h</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-success">Online agora</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

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

      {/* Modal de Recursos Adicionais */}
      {selectedResource && (
        <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {additionalResources.find(r => r.id === selectedResource)?.title}
              </DialogTitle>
              <DialogDescription>
                {additionalResources.find(r => r.id === selectedResource)?.description}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-6">
              {additionalResources.find(r => r.id === selectedResource)?.content?.sections.map((section, index) => (
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
              <Button onClick={() => setSelectedResource(null)}>
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default HelpCenter;