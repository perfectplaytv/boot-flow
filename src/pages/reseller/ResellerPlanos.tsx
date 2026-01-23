import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Plus, Check, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface Theme {
    color: string;
    lightColor: string;
    borderColor: string;
    gradient: string;
}

interface Plan {
    id: number;
    name: string;
    price: number;
    features: string[];
    description?: string;
    active: boolean;
}

export default function ResellerPlanos() {
    const { theme } = useOutletContext<{ theme: Theme }>();

    // State for plans
    const [plans, setPlans] = useState<Plan[]>([
        {
            id: 1,
            name: "Plano Básico",
            price: 29.90,
            features: ["1 Usuário", "Suporte Básico", "Acesso Web"],
            description: "Plano ideal para quem está começando.",
            active: true
        },
        {
            id: 2,
            name: "Plano Gold",
            price: 49.90,
            features: ["3 Usuários", "Suporte Prioritário", "Acesso Web + Mobile", "Backup Semanal"],
            description: "Para quem precisa de mais recursos e suporte.",
            active: true
        }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [formData, setFormData] = useState<Partial<Plan>>({
        name: "",
        price: 0,
        features: [],
        description: ""
    });
    const [featureInput, setFeatureInput] = useState("");

    const handleAddPlan = () => {
        setEditingPlan(null);
        setFormData({ name: "", price: 0, features: [], description: "" });
        setFeatureInput("");
        setShowModal(true);
    };

    const handleEditPlan = (plan: Plan) => {
        setEditingPlan(plan);
        setFormData({
            name: plan.name,
            price: plan.price,
            features: [...plan.features],
            description: plan.description
        });
        setFeatureInput("");
        setShowModal(true);
    };

    const handleDeletePlan = (id: number) => {
        if (confirm("Tem certeza que deseja excluir este plano?")) {
            setPlans(plans.filter(p => p.id !== id));
            toast.success("Plano removido com sucesso!");
        }
    };

    const handleSavePlan = () => {
        if (!formData.name || !formData.price || (formData.features && formData.features.length === 0)) {
            toast.error("Preencha todos os campos obrigatórios e adicione ao menos um recurso.");
            return;
        }

        if (editingPlan) {
            // Update
            setPlans(plans.map(p => p.id === editingPlan.id ? { ...p, ...formData } as Plan : p));
            toast.success("Plano atualizado com sucesso!");
        } else {
            // Create
            const newPlan: Plan = {
                id: Date.now(),
                active: true,
                name: formData.name!,
                price: formData.price!,
                features: formData.features || [],
                description: formData.description
            };
            setPlans([...plans, newPlan]);
            toast.success("Plano criado com sucesso!");
        }
        setShowModal(false);
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...(prev.features || []), featureInput.trim()]
            }));
            setFeatureInput("");
        }
    };

    const removeFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features?.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className={cn("text-2xl font-bold flex items-center gap-2", theme.color)}>
                        <Package className="w-6 h-6" />
                        Planos de Venda
                    </h1>
                    <p className="text-muted-foreground">
                        Crie e gerencie os planos que você oferece aos seus clientes
                    </p>
                </div>
                <Button
                    className={cn("text-white shadow-md transition-all", theme.gradient.includes('from') ? `bg-gradient-to-r ${theme.gradient}` : "bg-primary")}
                    onClick={handleAddPlan}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Plano
                </Button>
            </div>

            <Card className={cn("border shadow-sm", theme.borderColor)}>
                <CardHeader>
                    <CardTitle>Seus Planos</CardTitle>
                    <CardDescription>
                        Lista de planos ativos para comercialização
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome do Plano</TableHead>
                                    <TableHead>Preço (Mensal)</TableHead>
                                    <TableHead>Recursos Incluídos</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {plans.map((plan) => (
                                    <TableRow key={plan.id}>
                                        <TableCell className="font-medium">{plan.name}</TableCell>
                                        <TableCell>R$ {plan.price.toFixed(2).replace('.', ',')}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {plan.features.slice(0, 2).map((feature, idx) => (
                                                    <Badge key={idx} variant="outline" className="text-xs">
                                                        {feature}
                                                    </Badge>
                                                ))}
                                                {plan.features.length > 2 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{plan.features.length - 2}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={cn("bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20")}>
                                                Ativo
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditPlan(plan)}>
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDeletePlan(plan.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>


            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingPlan ? "Editar Plano" : "Novo Plano de Venda"}</DialogTitle>
                        <DialogDescription>
                            Configure os detalhes do plano que será oferecido.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome do Plano *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ex: Plano VIP"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="price">Preço Mensal (R$) *</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price || ''}
                                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                placeholder="29.99"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Recursos Incluídos</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={featureInput}
                                    onChange={e => setFeatureInput(e.target.value)}
                                    placeholder="Ex: Suporte 24h"
                                    onKeyDown={e => e.key === 'Enter' && addFeature()}
                                />
                                <Button type="button" onClick={addFeature} variant="outline" size="icon">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.features?.map((f, i) => (
                                    <Badge key={i} variant="secondary" className="gap-1 pr-1">
                                        {f}
                                        <div
                                            className="cursor-pointer hover:text-red-500 rounded-full p-0.5"
                                            onClick={() => removeFeature(i)}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </div>
                                    </Badge>
                                ))}
                            </div>
                            {(!formData.features || formData.features.length === 0) && (
                                <p className="text-xs text-muted-foreground">Adicione ao menos um recurso.</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="desc">Descrição Curta</Label>
                            <Textarea
                                id="desc"
                                value={formData.description || ''}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Uma breve descrição dos benefícios..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                        <Button onClick={handleSavePlan} className={cn("text-white", theme.gradient.includes('from') ? `bg-gradient-to-r ${theme.gradient}` : "bg-primary")}>
                            {editingPlan ? "Salvar Alterações" : "Criar Plano"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}
