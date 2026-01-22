import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Clock } from "lucide-react";

export default function ResellerConfiguracoes() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Settings className="w-6 h-6 text-green-500" />
                    Configurações
                </h1>
                <p className="text-muted-foreground">
                    Configure sua conta de revendedor
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Em Desenvolvimento</CardTitle>
                    <CardDescription>
                        Esta funcionalidade estará disponível em breve
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12">
                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Em breve!</h3>
                        <p className="text-muted-foreground">
                            Você poderá personalizar sua conta e preferências
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
