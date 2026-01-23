import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Plus, Download, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Theme {
    color: string;
    lightColor: string;
    borderColor: string;
    gradient: string;
}

export default function ResellerApps() {
    const { theme } = useOutletContext<{ theme: Theme }>();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={cn("text-2xl font-bold flex items-center gap-2", theme.color)}>
                        <Smartphone className="w-6 h-6" />
                        Meus Aplicativos
                    </h1>
                    <p className="text-muted-foreground">
                        Gerencie seus aplicativos personalizados e links de download.
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className={cn("text-white shadow-md", theme.gradient)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Solicitar Aplicativo
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Solicitar Aplicativo Personalizado</DialogTitle>
                            <DialogDescription>
                                Para publicar seu aplicativo na Play Store ou gerar um APK personalizado, entre em contato com nosso time de suporte.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                                <li>Logotipo da sua marca</li>
                                <li>Cores personalizadas</li>
                                <li>Nome do aplicativo</li>
                                <li>Prazo de entrega: 24 a 48 horas</li>
                            </ul>
                        </div>
                        <DialogFooter>
                            <Button className={cn("w-full text-white", theme.gradient)} onClick={() => window.open('https://wa.me/5511999999999', '_blank')}>
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Falar no WhatsApp
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className={cn("border shadow-sm", theme.borderColor)}>
                <CardHeader>
                    <CardTitle>Aplicativos Disponíveis</CardTitle>
                    <CardDescription>
                        Lista de aplicativos configurados para sua revenda.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {/* Empty State / Add New */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className={cn("border border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center p-8 text-center text-muted-foreground cursor-pointer transition-all group hover:bg-muted/30", theme.borderColor.replace('border-', 'hover:border-'))}>
                                    <div className={cn("p-3 rounded-full transition-colors mb-3 group-hover:bg-opacity-80", theme.lightColor)}>
                                        <Plus className={cn("w-6 h-6", theme.color)} />
                                    </div>
                                    <h3 className={cn("font-semibold", theme.color)}>Solicitar Novo App</h3>
                                    <p className="text-xs mt-1">Configurar APK Android</p>
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Solicitar Aplicativo</DialogTitle>
                                    <DialogDescription>
                                        Entre em contato com o suporte para configurar seu novo app.
                                    </DialogDescription>
                                </DialogHeader>
                                <Button className={cn("w-full text-white", theme.gradient)} onClick={() => window.open('https://wa.me/5511999999999', '_blank')}>
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Solicitar via WhatsApp
                                </Button>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
