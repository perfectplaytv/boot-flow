import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Plus, Download } from "lucide-react";

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
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Solicitar Aplicativo
                </Button>
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
                        {/* Exemplo de Card de App (Placeholder) */}
                        <Card className="border-dashed flex flex-col items-center justify-center p-6 text-center text-muted-foreground cursor-pointer hover:border-primary hover:text-primary transition-colors">
                            <Plus className="w-12 h-12 mb-2 opacity-50" />
                            <h3 className="font-semibold">Nenhum aplicativo configurado</h3>
                            <p className="text-sm mt-1">Clique para solicitar seu primeiro app</p>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
