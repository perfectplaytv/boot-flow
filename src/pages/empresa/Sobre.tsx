import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Sobre = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre a BootFlow</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Conectando negócios através de soluções inovadoras em tecnologia
          </p>
        </div>
      </div>

      {/* Nossa História */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Nossa História</h2>
          <div className="space-y-6 text-muted-foreground">
            <p>
              Fundada em 2023, a BootFlow surgiu da necessidade de simplificar e otimizar processos 
              empresariais através da tecnologia. Começamos como uma pequena equipe de desenvolvedores 
            </p>
            <p>
              Ao longo dos anos, expandimos nossos serviços e hoje atendemos empresas de diversos portes,
              ajudando-as a alcançar seus objetivos através de soluções tecnológicas inovadoras.
            </p>
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Nossos Valores</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Inovação",
                description: "Buscamos constantemente novas maneiras de resolver problemas e melhorar nossos produtos."
              },
              {
                title: "Transparência",
                description: "Mantemos uma comunicação clara e aberta com nossos clientes e parceiros."
              },
              {
                title: "Qualidade",
                description: "Comprometimento com a excelência em tudo o que fazemos."
              }
            ].map((value, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Time */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">Conheça Nosso Time</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              name: "João Silva",
              role: "CEO & Fundador",
              image: "https://randomuser.me/api/portraits/men/1.jpg"
            },
            {
              name: "Maria Santos",
              role: "CTO",
              image: "https://randomuser.me/api/portraits/women/2.jpg"
            },
            {
              name: "Carlos Oliveira",
              role: "Head de Produto",
              image: "https://randomuser.me/api/portraits/men/3.jpg"
            }
          ].map((member, index) => (
            <div key={index} className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para começar?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de empresas que já estão transformando seus negócios com nossas soluções.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/signup')}>
              Começar Agora
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/contato')}>
              Fale Conosco
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sobre;
