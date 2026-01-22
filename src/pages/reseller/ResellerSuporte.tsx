import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    HelpCircle,
    MessageCircle,
    Mail,
    FileText,
    ExternalLink,
    Send,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ResellerSuporte() {
    const [message, setMessage] = useState("");
    const [subject, setSubject] = useState("");

    const handleSendMessage = () => {
        if (!subject || !message) {
            toast.error("Preencha o assunto e a mensagem");
            return;
        }
        toast.success("Mensagem enviada! Retornaremos em breve.");
        setSubject("");
        setMessage("");
    };

    const whatsappSupport = () => {
        window.open("https://wa.me/5527999999999?text=Olá! Preciso de ajuda com minha conta de revenda BootFlow", "_blank");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-green-500" />
                    Central de Suporte
                </h1>
                <p className="text-muted-foreground">
                    Estamos aqui para ajudar você a ter sucesso
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Contact */}
                <Card>
                    <CardHeader>
                        <CardTitle>Contato Rápido</CardTitle>
                        <CardDescription>
                            Escolha a forma mais conveniente de falar conosco
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            className="w-full justify-start gap-3 h-16 bg-green-600 hover:bg-green-700"
                            onClick={whatsappSupport}
                        >
                            <MessageCircle className="w-6 h-6" />
                            <div className="text-left">
                                <p className="font-bold">WhatsApp</p>
                                <p className="text-xs opacity-80">Resposta mais rápida</p>
                            </div>
                            <ExternalLink className="w-4 h-4 ml-auto" />
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full justify-start gap-3 h-16"
                            onClick={() => window.open("mailto:suporte@bootflow.com.br", "_blank")}
                        >
                            <Mail className="w-6 h-6" />
                            <div className="text-left">
                                <p className="font-bold">E-mail</p>
                                <p className="text-xs text-muted-foreground">suporte@bootflow.com.br</p>
                            </div>
                            <ExternalLink className="w-4 h-4 ml-auto" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Send Message */}
                <Card>
                    <CardHeader>
                        <CardTitle>Enviar Mensagem</CardTitle>
                        <CardDescription>
                            Descreva sua dúvida ou problema
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Assunto</Label>
                            <Input
                                id="subject"
                                placeholder="Ex: Dúvida sobre cobrança"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Mensagem</Label>
                            <Textarea
                                id="message"
                                placeholder="Descreva detalhadamente sua dúvida ou problema..."
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                        <Button
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={handleSendMessage}
                        >
                            <Send className="w-4 h-4 mr-2" />
                            Enviar Mensagem
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* FAQ Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Perguntas Frequentes
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold mb-2">Como adicionar um novo cliente?</h4>
                        <p className="text-sm text-muted-foreground">
                            Vá em "Meus Clientes" e clique no botão "Novo Cliente". Preencha os dados e pronto!
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold mb-2">Como gerar cobranças?</h4>
                        <p className="text-sm text-muted-foreground">
                            Na página de Cobranças, você pode criar cobranças individuais ou recorrentes para seus clientes.
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold mb-2">Como funciona o pagamento?</h4>
                        <p className="text-sm text-muted-foreground">
                            Os pagamentos são processados via PIX e você recebe automaticamente sua comissão.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
