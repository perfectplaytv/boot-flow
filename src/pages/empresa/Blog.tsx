import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const navigate = useNavigate();

  const posts = [
    {
      id: 1,
      title: "Como melhorar a experiência do cliente com IA",
      excerpt: "Descubra como a inteligência artificial está revolucionando o atendimento ao cliente.",
      date: "15 de Julho, 2025",
      readTime: "5 min de leitura",
      category: "IA",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 2,
      title: "Tendências de tecnologia para 2025",
      excerpt: "As principais tendências tecnológicas que vão impactar os negócios no próximo ano.",
      date: "1 de Julho, 2025",
      readTime: "7 min de leitura",
      category: "Tecnologia",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 3,
      title: "Como aumentar a produtividade da sua equipe",
      excerpt: "Dicas práticas para melhorar a produtividade e eficiência no ambiente de trabalho.",
      date: "20 de Junho, 2025",
      readTime: "6 min de leitura",
      category: "Produtividade",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 4,
      title: "Segurança de dados: como proteger sua empresa",
      excerpt: "Conheça as melhores práticas para garantir a segurança dos dados da sua empresa.",
      date: "10 de Junho, 2025",
      readTime: "8 min de leitura",
      category: "Segurança",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 5,
      title: "O futuro do trabalho remoto",
      excerpt: "Como as empresas estão se adaptando ao novo normal do trabalho remoto.",
      date: "1 de Junho, 2025",
      readTime: "5 min de leitura",
      category: "Trabalho Remoto",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 6,
      title: "Como escolher a melhor solução em nuvem",
      excerpt: "Guia completo para ajudar sua empresa a escolher a melhor solução em nuvem.",
      date: "20 de Maio, 2025",
      readTime: "10 min de leitura",
      category: "Cloud Computing",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  const categories = [
    { name: "Todos", count: posts.length },
    { name: "IA", count: 3 },
    { name: "Tecnologia", count: 5 },
    { name: "Produtividade", count: 2 },
    { name: "Segurança", count: 3 },
    { name: "Trabalho Remoto", count: 2 },
    { name: "Cloud Computing", count: 1 }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Fique por dentro das últimas notícias, dicas e tendências do mundo da tecnologia
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl">Categorias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <div key={index} className="flex justify-between items-center hover:bg-muted/50 p-2 rounded cursor-pointer">
                      <span>{category.name}</span>
                      <Badge variant="outline">{category.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardHeader>
                <CardTitle className="text-xl">Assine nossa newsletter</CardTitle>
                <CardDescription>Receba as últimas atualizações diretamente no seu e-mail.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <input 
                    type="email" 
                    placeholder="Seu e-mail" 
                    className="w-full p-2 border rounded"
                  />
                  <Button className="w-full">Assinar</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Posts */}
          <div className="md:w-3/4">
            <div className="grid md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <CardDescription>{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between items-center">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {post.category}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      className="text-primary"
                      onClick={() => navigate(`/blog/${post.id}`)}
                    >
                      Ler mais →
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex gap-2">
                <Button variant="outline">Anterior</Button>
                <Button variant="outline">1</Button>
                <Button>2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Próximo</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
