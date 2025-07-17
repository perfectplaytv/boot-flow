import { useState } from "react";
import { ArrowLeft, Search, MessageSquare, Phone, Mail, Book, Video, FileText, ExternalLink, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const HelpCenter = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

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
      title: "Guia de Primeiros Passos",
      description: "Configure sua conta e comece a usar a plataforma",
      type: "text",
      duration: "5 min",
      icon: Book
    },
    {
      title: "Configurando a IA",
      description: "Tutorial completo sobre configuração da IA",
      type: "video",
      duration: "12 min",
      icon: Video
    },
    {
      title: "Sistema IPTV para Revendedores",
      description: "Como ativar e configurar o módulo IPTV",
      type: "text",
      duration: "8 min",
      icon: FileText
    },
    {
      title: "Campanhas Multicanal",
      description: "Criando campanhas para WhatsApp, Instagram e mais",
      type: "video",
      duration: "15 min",
      icon: Video
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
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
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
    </div>
  );
};

export default HelpCenter;