import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Edit, Loader2, Save, Trash, Plus } from "lucide-react";
import { toast } from "sonner";

interface Plan {
    id: number;
    name: string;
    price: string;
    period: string;
    description: string;
    clients_limit: string;
    is_popular: boolean;
    highlight: string;
    features: any[]; // JSON array
    active: boolean;
    display_order: number;
}

export default function AdminPlans() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // Fetch plans
    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/plans');
            if (res.ok) {
                const data = await res.json();
                setPlans(data);
            } else {
                toast.error("Erro ao carregar planos");
            }
        } catch (err) {
            toast.error("Erro de conexão");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (plan: Plan) => {
        setEditingPlan({ ...plan });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!editingPlan) return;

        setSaving(true);
        try {
            const res = await fetch('/api/plans', {
                method: 'POST', // Usamos POST para update conforme definido no backend
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingPlan)
            });

            if (res.ok) {
                toast.success("Plano atualizado com sucesso!");
                setIsModalOpen(false);
                fetchPlans(); // Refresh
            } else {
                const error = await res.json();
                toast.error("Erro ao salvar: " + error.error);
            }
        } catch (err) {
            toast.error("Erro ao salvar");
        } finally {
            setSaving(false);
        }
    };

    // Helper para editar features JSON como string por enquanto
    const handleFeaturesChange = (jsonStr: string) => {
        try {
            const parsed = JSON.parse(jsonStr);
            setEditingPlan(prev => prev ? { ...prev, features: parsed } : null);
        } catch (e) {
            // Ignora erro de parse enquanto digita, ou valida no blur
        }
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Planos e Preços</h2>
                    <p className="text-muted-foreground">Gerencie os planos visíveis na Landing Page.</p>
                </div>
                <Button onClick={() => toast.info("Criação de novos planos em breve.")}>
                    <Plus className="mr-2 h-4 w-4" /> Novo Plano
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Planos Atuais</CardTitle>
                    <CardDescription>Edite valores, destacaques e funcionalidades.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ordem</TableHead>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Preço</TableHead>
                                    <TableHead>Popuar</TableHead>
                                    <TableHead>Ativo</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {plans.map((plan) => (
                                    <TableRow key={plan.id}>
                                        <TableCell>{plan.display_order}</TableCell>
                                        <TableCell className="font-medium">{plan.name}</TableCell>
                                        <TableCell>{plan.price}</TableCell>
                                        <TableCell>{plan.is_popular ? "⭐ Sim" : "Não"}</TableCell>
                                        <TableCell>
                                            <div className={`w-2 h-2 rounded-full ${plan.active ? 'bg-green-500' : 'bg-red-500'}`} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(plan)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Modal de Edição */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Editar Plano</DialogTitle>
                        <DialogDescription>Faça alterações nas informações do plano.</DialogDescription>
                    </DialogHeader>

                    {editingPlan && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome do Plano</Label>
                                    <Input
                                        id="name"
                                        value={editingPlan.name}
                                        onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price">Preço (Ex: R$ 29,90)</Label>
                                    <Input
                                        id="price"
                                        value={editingPlan.price}
                                        onChange={(e) => setEditingPlan({ ...editingPlan, price: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="desc">Descrição Curta</Label>
                                <Input
                                    id="desc"
                                    value={editingPlan.description}
                                    onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="highlight">Destaque (Rodapé do Card)</Label>
                                <Input
                                    id="highlight"
                                    value={editingPlan.highlight}
                                    onChange={(e) => setEditingPlan({ ...editingPlan, highlight: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 items-center">
                                <div className="flex items-center space-x-2 border p-3 rounded-lg">
                                    <Switch
                                        id="popular"
                                        checked={editingPlan.is_popular}
                                        onCheckedChange={(c) => setEditingPlan({ ...editingPlan, is_popular: c })}
                                    />
                                    <Label htmlFor="popular">Marcar como Recomendado</Label>
                                </div>
                                <div className="flex items-center space-x-2 border p-3 rounded-lg">
                                    <Switch
                                        id="active"
                                        checked={editingPlan.active}
                                        onCheckedChange={(c) => setEditingPlan({ ...editingPlan, active: c })}
                                    />
                                    <Label htmlFor="active">Plano Ativo (Visível)</Label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Features (JSON)</Label>
                                <p className="text-xs text-muted-foreground">Edite com cuidado. Mantenha a estrutura <code>{"[{ \"text\": \"...\", \"icon\": \"Check\" }]"}</code></p>
                                <Textarea
                                    className="font-mono text-xs h-40"
                                    defaultValue={JSON.stringify(editingPlan.features, null, 2)}
                                    onChange={(e) => handleFeaturesChange(e.target.value)}
                                />
                            </div>

                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                            Salvar Alterações
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
