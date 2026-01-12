
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Edit, Loader2, Save, Plus, CreditCard, Tag, Star, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface PlanFeature {
    text: string;
    icon: string;
}

interface Plan {
    id: number;
    name: string;
    price: string;
    period: string;
    description: string;
    clients_limit: string;
    is_popular: boolean;
    highlight: string;
    features: PlanFeature[]; // JSON array
    active: boolean;
    display_order: number;
}

export default function AdminPlans() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // Fetch plans
    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        setLoading(true);
        setError(null);
        console.log('[AdminPlans] Fetching plans from /api/plans...');
        try {
            const res = await fetch('/api/plans');
            console.log('[AdminPlans] Response status:', res.status);
            if (res.ok) {
                const data = await res.json();
                console.log('[AdminPlans] Plans loaded:', data);
                setPlans(data as Plan[]);
            } else {
                const errorText = await res.text();
                console.error('[AdminPlans] API Error:', errorText);
                setError(`Erro ao carregar planos: ${res.status}`);
                toast.error("Erro ao carregar planos");
            }
        } catch (err) {
            console.error('[AdminPlans] Network error:', err);
            setError("Erro de conexão com a API");
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
                const error = await res.json() as { error: string };
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

    // Estatísticas Calculadas
    const totalPlans = plans.length;
    const activePlans = plans.filter(p => p.active).length;
    const popularPlans = plans.filter(p => p.is_popular).length;

    return (
        <div className="p-6 min-h-screen bg-background transition-colors duration-300">
            {/* Header Style Notification */}
            <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-7 h-7 text-purple-400" />
                <h1 className="text-3xl font-bold text-purple-300">Planos e Preços</h1>
            </div>
            <p className="text-gray-400 mb-6">Gerencie os planos visíveis na Landing Page e configure preços.</p>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-700/40">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-300">Total de Planos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white flex items-center gap-2">
                            <Tag className="w-5 h-5 text-purple-400" />
                            {totalPlans}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-700/40">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-300">Planos Ativos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-400 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" />
                            {activePlans}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border border-yellow-700/40">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-300">Destaques (Populares)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
                            <Star className="w-5 h-5" />
                            {popularPlans}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end gap-2 mb-4">
                <Button onClick={() => toast.info("Criação de novos planos em breve.")} className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white">
                    <Plus className="mr-2 h-4 w-4" /> Novo Plano
                </Button>
            </div>

            {/* Main Content (Table) */}
            <Card className="bg-[#1f2937] border border-purple-700/40">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Planos Disponíveis</CardTitle>
                    <CardDescription className="text-gray-400">Edite valores, destaques e funcionalidades.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-8">
                            <Loader2 className="animate-spin text-purple-500 w-8 h-8" />
                            <p className="text-gray-400 mt-2">Carregando planos...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                            <p className="text-red-400 mb-4">{error}</p>
                            <Button onClick={fetchPlans} variant="outline" className="border-gray-600 text-gray-300 hover:text-white">
                                Tentar novamente
                            </Button>
                        </div>
                    ) : plans.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                            <p className="text-gray-400 mb-2">Nenhum plano encontrado.</p>
                            <p className="text-gray-500 text-sm">Verifique se a tabela 'plans' foi criada no banco de dados D1.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-gray-700 hover:bg-[#374151]">
                                    <TableHead className="text-gray-400">Ordem</TableHead>
                                    <TableHead className="text-gray-400">Nome</TableHead>
                                    <TableHead className="text-gray-400">Preço</TableHead>
                                    <TableHead className="text-gray-400">Popular</TableHead>
                                    <TableHead className="text-gray-400">Ativo</TableHead>
                                    <TableHead className="text-right text-gray-400">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {plans.map((plan) => (
                                    <TableRow key={plan.id} className="border-gray-700 hover:bg-[#374151]">
                                        <TableCell className="text-white">{plan.display_order}</TableCell>
                                        <TableCell className="font-medium text-white">{plan.name}</TableCell>
                                        <TableCell className="text-white">{plan.price}</TableCell>
                                        <TableCell className="text-white">{plan.is_popular ? "⭐ Sim" : "Não"}</TableCell>
                                        <TableCell>
                                            <div className={`w-2 h-2 rounded-full ${plan.active ? 'bg-green-500' : 'bg-red-500'}`} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(plan)} className="text-gray-400 hover:text-white hover:bg-gray-700">
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
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1f2937] text-white border-purple-700">
                    <DialogHeader>
                        <DialogTitle>Editar Plano</DialogTitle>
                        <DialogDescription className="text-gray-400">Faça alterações nas informações do plano.</DialogDescription>
                    </DialogHeader>

                    {editingPlan && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-white">Nome do Plano</Label>
                                    <Input
                                        id="name"
                                        className="bg-gray-800 border-gray-600 text-white"
                                        value={editingPlan.name}
                                        onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-white">Preço (Ex: R$ 29,90)</Label>
                                    <Input
                                        id="price"
                                        className="bg-gray-800 border-gray-600 text-white"
                                        value={editingPlan.price}
                                        onChange={(e) => setEditingPlan({ ...editingPlan, price: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="desc" className="text-white">Descrição Curta</Label>
                                <Input
                                    id="desc"
                                    className="bg-gray-800 border-gray-600 text-white"
                                    value={editingPlan.description}
                                    onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="highlight" className="text-white">Destaque (Rodapé do Card)</Label>
                                <Input
                                    id="highlight"
                                    className="bg-gray-800 border-gray-600 text-white"
                                    value={editingPlan.highlight}
                                    onChange={(e) => setEditingPlan({ ...editingPlan, highlight: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 items-center">
                                <div className="flex items-center space-x-2 border border-gray-600 p-3 rounded-lg">
                                    <Switch
                                        id="popular"
                                        checked={editingPlan.is_popular}
                                        onCheckedChange={(c) => setEditingPlan({ ...editingPlan, is_popular: c })}
                                    />
                                    <Label htmlFor="popular" className="text-white">Marcar como Recomendado</Label>
                                </div>
                                <div className="flex items-center space-x-2 border border-gray-600 p-3 rounded-lg">
                                    <Switch
                                        id="active"
                                        checked={editingPlan.active}
                                        onCheckedChange={(c) => setEditingPlan({ ...editingPlan, active: c })}
                                    />
                                    <Label htmlFor="active" className="text-white">Plano Ativo (Visível)</Label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-white">Features (JSON)</Label>
                                <p className="text-xs text-gray-400">Edite com cuidado. Mantenha a estrutura <code>{"[{ \"text\": \"...\", \"icon\": \"Check\" }]"}</code></p>
                                <Textarea
                                    className="font-mono text-xs h-40 bg-gray-900 border-gray-600 text-white"
                                    defaultValue={JSON.stringify(editingPlan.features, null, 2)}
                                    onChange={(e) => handleFeaturesChange(e.target.value)}
                                />
                            </div>

                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)} className="border-gray-600 text-white hover:bg-gray-700">Cancelar</Button>
                        <Button onClick={handleSave} disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white">
                            {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                            Salvar Alterações
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
