import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
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
  );
};

export default Terms;