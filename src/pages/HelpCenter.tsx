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
                  <Button variant="outline" className="justify-between h-auto p-4">
                    <div className="text-left">
                      <h4 className="font-medium">Documentação da API</h4>
                      <p className="text-sm text-muted-foreground">
                        Integre com nossa API
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4" />
                  </Button>

                  <Button variant="outline" className="justify-between h-auto p-4">
                    <div className="text-left">
                      <h4 className="font-medium">Changelog</h4>
                      <p className="text-sm text-muted-foreground">
                        Veja as últimas atualizações
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4" />
                  </Button>

                  <Button variant="outline" className="justify-between h-auto p-4">
                    <div className="text-left">
                      <h4 className="font-medium">Comunidade</h4>
                      <p className="text-sm text-muted-foreground">
                        Participe do fórum
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4" />
                  </Button>

                  <Button variant="outline" className="justify-between h-auto p-4">
                    <div className="text-left">
                      <h4 className="font-medium">Status da Plataforma</h4>
                      <p className="text-sm text-muted-foreground">
                        Verificar status dos serviços
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactOptions.map((option, index) => {
                const IconComponent = option.icon;
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
    </div>
  );
};

export default HelpCenter;