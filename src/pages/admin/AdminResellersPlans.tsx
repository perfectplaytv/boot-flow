
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Check, X, Shield, TrendingUp, Users } from "lucide-react";
import { useRevendas } from '@/hooks/useRevendas';

export default function AdminResellersPlans() {
    const { revendas, loading } = useRevendas();

    if (loading) return (
        <div className="flex justify-center items-center h-[50vh]">
            <Loader2 className="animate-spin w-8 h-8 text-primary" />
        </div>
    );

    // Cálculos de resumo
    const totalResellers = revendas?.length || 0;
    const activeResellers = revendas?.filter((r: any) =>
        r.status === 'active' || r.status === 'ativo' || r.status === 'Ativo'
    ).length || 0;
    const eliteResellers = revendas?.filter((r: any) =>
        r.plan_name === 'Elite' || r.permission === 'admin'
    ).length || 0;

    // Calcular receita estimada baseada nos créditos
    const totalCredits = revendas?.reduce((acc: number, r: any) => acc + (r.credits || 0), 0) || 0;

    return (
        <div className="space-y-6 pt-4">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Revendas & Planos</h2>
                <Badge variant="outline" className="text-base px-3 py-1">
                    Total: {totalResellers}
                </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revendas Ativas</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeResellers}</div>
                        <p className="text-xs text-muted-foreground">
                            {totalResellers > 0 ? ((activeResellers / totalResellers) * 100).toFixed(0) : 0}% da base
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Administradores</CardTitle>
                        <Shield className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{eliteResellers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Créditos</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCredits.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Créditos em circulação</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Visão Geral de Revendas</CardTitle>
                </CardHeader>
                <CardContent>
                    {revendas && revendas.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Revenda</TableHead>
                                    <TableHead>Permissão</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Créditos</TableHead>
                                    <TableHead className="text-center">Email</TableHead>
                                    <TableHead className="text-center">Telegram</TableHead>
                                    <TableHead className="text-center">WhatsApp</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {revendas.map((row: any) => (
                                    <TableRow key={row.id}>
                                        <TableCell>
                                            <div className="font-medium">{row.username || row.personal_name || 'Sem nome'}</div>
                                            <div className="text-xs text-muted-foreground">{row.email || '--'}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                row.permission === 'admin' ? 'default' :
                                                    row.permission === 'reseller' ? 'secondary' : 'outline'
                                            }>
                                                {row.permission || 'Reseller'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`
                                                ${row.status === 'active' || row.status === 'ativo' || row.status === 'Ativo'
                                                    ? 'bg-green-500 hover:bg-green-600'
                                                    : 'bg-gray-500'}
                                            `}>
                                                {row.status || 'Ativo'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="font-medium">{row.credits || 0} créditos</span>
                                                </div>
                                                <Progress
                                                    value={Math.min((row.credits || 0) / 100 * 100, 100)}
                                                    className="h-2"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {row.email ? (
                                                <Check className="mx-auto text-green-500 w-4 h-4" />
                                            ) : (
                                                <X className="mx-auto text-muted-foreground w-4 h-4 opacity-30" />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {row.telegram ? (
                                                <Check className="mx-auto text-green-500 w-4 h-4" />
                                            ) : (
                                                <X className="mx-auto text-muted-foreground w-4 h-4 opacity-30" />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {row.whatsapp ? (
                                                <Check className="mx-auto text-green-500 w-4 h-4" />
                                            ) : (
                                                <X className="mx-auto text-muted-foreground w-4 h-4 opacity-30" />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                            <p>Nenhuma revenda cadastrada ainda.</p>
                            <p className="text-sm">Adicione revendas na seção "Revendas" do menu.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
