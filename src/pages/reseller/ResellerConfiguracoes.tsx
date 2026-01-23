import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings, User as UserIcon, CreditCard, Shield, Save } from "lucide-react";
import { useAuth, User } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ResellerUser extends User {
    plan_name?: string;
    plan_price?: string;
}

interface Theme {
    color: string;
    lightColor: string;
    borderColor: string;
    gradient: string;
}

export default function ResellerConfiguracoes() {
    const { theme } = useOutletContext<{ theme: Theme }>();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // Mock states for profile
    const [profile, setProfile] = useState({
        name: user?.name || "",
        email: user?.email || "",
        whatsapp: "",
        telegram: ""
    });

    const handleSaveProfile = async () => {
        setLoading(true);
        // Simulação de delay de rede
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        toast.success("Perfil atualizado com sucesso!");
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className={cn("text-2xl font-bold flex items-center gap-2", theme.color)}>
                    <Settings className="w-6 h-6" />
                    Configurações da Conta
                </h1>
                <p className="text-muted-foreground">
                    Gerencie suas informações pessoais, plano e segurança.
                </p>
            </div>

            <Tabs defaultValue="perfil" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-[600px]">
                    <TabsTrigger value="perfil" className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        Perfil
                    </TabsTrigger>
                    <TabsTrigger value="faturamento" className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Faturamento
                    </TabsTrigger>
                    <TabsTrigger value="seguranca" className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Segurança
                    </TabsTrigger>
                </TabsList>

                {/* ABA PERFIL */}
                <TabsContent value="perfil" className="space-y-4 mt-6">
                    <Card className={cn("border shadow-sm", theme.borderColor)}>
                        <CardHeader>
                            <CardTitle>Informações Pessoais</CardTitle>
                            <CardDescription>
                                Atualize seus dados de contato e identificação.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome Completo</Label>
                                    <Input
                                        id="name"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className={cn("focus-visible:ring-1", theme.borderColor)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        value={profile.email}
                                        disabled
                                        className="bg-muted cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="whatsapp">WhatsApp</Label>
                                    <Input
                                        id="whatsapp"
                                        placeholder="(00) 00000-0000"
                                        value={profile.whatsapp}
                                        onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                                        className={cn("focus-visible:ring-1", theme.borderColor)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="telegram">Telegram (Opcional)</Label>
                                    <Input
                                        id="telegram"
                                        placeholder="@seuusuario"
                                        value={profile.telegram}
                                        onChange={(e) => setProfile({ ...profile, telegram: e.target.value })}
                                        className={cn("focus-visible:ring-1", theme.borderColor)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className={cn("text-white", theme.gradient)} onClick={handleSaveProfile} disabled={loading}>
                                {loading ? "Salvando..." : <><Save className="w-4 h-4 mr-2" /> Salvar Alterações</>}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* ABA FATURAMENTO */}
                <TabsContent value="faturamento" className="space-y-4 mt-6">
                    <Card className={cn("border shadow-sm", theme.borderColor)}>
                        <CardHeader>
                            <CardTitle>Seu Plano Atual</CardTitle>
                            <CardDescription>
                                Detalhes da sua assinatura e limites.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className={cn("border rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4", theme.lightColor, theme.borderColor)}>
                                <div>
                                    <h3 className={cn("text-lg font-bold mb-1", theme.color)}>Plano {(user as ResellerUser)?.plan_name || 'Essencial'}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Renova em: 01/02/2026
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold">{(user as ResellerUser)?.plan_price || 'R$ 0,00'}<span className="text-sm font-normal text-muted-foreground">/mês</span></div>
                                    <Button variant="outline" size="sm" className={cn("mt-2 border", theme.borderColor)}>Alterar Plano</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={cn("border shadow-sm", theme.borderColor)}>
                        <CardHeader>
                            <CardTitle>Histórico de Pagamentos</CardTitle>
                            <CardDescription>
                                Últimas faturas geradas.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-muted-foreground">
                                Nenhuma fatura encontrada.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ABA SEGURANÇA */}
                <TabsContent value="seguranca" className="space-y-4 mt-6">
                    <Card className={cn("border shadow-sm", theme.borderColor)}>
                        <CardHeader>
                            <CardTitle>Alterar Senha</CardTitle>
                            <CardDescription>
                                Mantenha sua conta segura atualizando sua senha periodicamente.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-pass">Senha Atual</Label>
                                <Input id="current-pass" type="password" className={cn("focus-visible:ring-1", theme.borderColor)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-pass">Nova Senha</Label>
                                <Input id="new-pass" type="password" className={cn("focus-visible:ring-1", theme.borderColor)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-pass">Confirmar Nova Senha</Label>
                                <Input id="confirm-pass" type="password" className={cn("focus-visible:ring-1", theme.borderColor)} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className={cn("text-white", theme.gradient)}>Atualizar Senha</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
