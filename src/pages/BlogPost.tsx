import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Bot, Tag, ArrowLeft } from "lucide-react";

const posts = [
  {
    id: 1,
    title: "Como melhorar a experiência do cliente com IA",
    excerpt: "Descubra como a inteligência artificial está revolucionando o atendimento ao cliente.",
    date: "15 de Julho, 2025",
    readTime: "5 min de leitura",
    category: "IA",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    content: [
      "A experiência do cliente é um dos principais diferenciais competitivos das empresas modernas.",
      "Com o uso de IA, é possível criar atendimentos mais rápidos, personalizados e disponíveis 24/7, sem perder o tom de voz da marca.",
      "Tecnologias como chatbots inteligentes, análise de sentimento e automação de fluxos permitem antecipar dúvidas, resolver problemas e encantar o cliente em grande escala.",
    ],
  },
  {
    id: 2,
    title: "Tendências de tecnologia para 2025",
    excerpt:
      "As principais tendências tecnológicas que vão impactar os negócios no próximo ano.",
    date: "1 de Julho, 2025",
    readTime: "7 min de leitura",
    category: "Tecnologia",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    content: [
      "O cenário tecnológico segue em rápida evolução, trazendo novas oportunidades para empresas de todos os portes.",
      "Entre os destaques estão IA generativa, automação de atendimento, experiências omnichannel e integrações cada vez mais profundas entre sistemas.",
      "Estar atento a essas tendências é fundamental para manter a competitividade e criar experiências memoráveis para os clientes.",
    ],
  },
  {
    id: 3,
    title: "Como aumentar a produtividade da sua equipe",
    excerpt:
      "Dicas práticas para melhorar a produtividade e eficiência no ambiente de trabalho.",
    date: "20 de Junho, 2025",
    readTime: "6 min de leitura",
    category: "Produtividade",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    content: [
      "Produtividade não é apenas fazer mais em menos tempo, mas sim focar no que realmente gera resultado.",
      "Ferramentas de automação, comunicação clara e fluxos bem definidos ajudam o time a trabalhar com mais foco e menos retrabalho.",
    ],
  },
  {
    id: 4,
    title: "Segurança de dados: como proteger sua empresa",
    excerpt: "Conheça as melhores práticas para garantir a segurança dos dados da sua empresa.",
    date: "10 de Junho, 2025",
    readTime: "8 min de leitura",
    category: "Segurança",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    content: [
      "Com o aumento do volume de dados sensíveis, investir em segurança deixou de ser opcional.",
      "Boas práticas incluem controle de acesso, criptografia, backups recorrentes e treinamentos constantes com o time.",
    ],
  },
  {
    id: 5,
    title: "O futuro do trabalho remoto",
    excerpt: "Como as empresas estão se adaptando ao novo normal do trabalho remoto.",
    date: "1 de Junho, 2025",
    readTime: "5 min de leitura",
    category: "Trabalho Remoto",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    content: [
      "O trabalho remoto se consolidou como uma realidade em muitos segmentos.",
      "Ferramentas de colaboração, cultura forte e processos bem definidos são essenciais para manter a performance e o engajamento do time.",
    ],
  },
  {
    id: 6,
    title: "Como escolher a melhor solução em nuvem",
    excerpt:
      "Guia completo para ajudar sua empresa a escolher a melhor solução em nuvem.",
    date: "20 de Maio, 2025",
    readTime: "10 min de leitura",
    category: "Cloud Computing",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    content: [
      "Migrar para a nuvem pode trazer redução de custos, escalabilidade e mais segurança.",
      "É importante avaliar necessidades de compliance, localização de dados, suporte e integrações antes de escolher o provedor.",
    ],
  },
];

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numericId = Number(id);

  const post = posts.find((p) => p.id === numericId);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Artigo não encontrado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              O conteúdo que você está tentando acessar não foi encontrado.
            </p>
            <Button variant="outline" onClick={() => navigate("/empresa/blog")}>Voltar para o blog</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/20 backdrop-blur-xl bg-background/80 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate("/")}
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">BootFlow</span>
            </div>
          </nav>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-[73px]"></div>

      {/* Hero do post */}
      <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button
            variant="outline"
            className="mb-6 flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div className="space-y-4">
            <Badge variant="outline" className="flex items-center gap-1 w-fit">
              <Tag className="w-3 h-3" />
              {post.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo do post */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl grid md:grid-cols-[2fr,1fr] gap-10">
          <article className="space-y-6">
            {post.content.map((paragraph, index) => (
              <p key={index} className="text-lg text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </article>

          <aside className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mais sobre {post.category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Continue explorando conteúdos relacionados à categoria <strong>{post.category}</strong> no blog da
                  BootFlow.
                </p>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => navigate(`/empresa/blog/${post.category.toLowerCase().replace(/\s+/g, "-")}`)}
                >
                  Ver mais artigos
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
