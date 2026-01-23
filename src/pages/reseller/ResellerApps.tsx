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

export default function ResellerApps() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Smartphone className="w-6 h-6 text-primary" />
                        Meus Aplicativos
                    </h1>
                    <p className="text-muted-foreground">
                        Gerencie seus aplicativos personalizados e links de download.
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
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
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => window.open('https://wa.me/5511999999999', '_blank')}>
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Falar no WhatsApp
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
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
                                <div className="border border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center p-8 text-center text-muted-foreground cursor-pointer hover:border-emerald-500 hover:bg-emerald-500/5 hover:text-emerald-500 transition-all group">
                                    <div className="p-3 rounded-full bg-muted group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors mb-3">
                                        <Plus className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-semibold">Solicitar Novo App</h3>
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
                                <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => window.open('https://wa.me/5511999999999', '_blank')}>
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
