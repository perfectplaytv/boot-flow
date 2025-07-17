import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Privacy = () => {
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
  );
};

export default Privacy;