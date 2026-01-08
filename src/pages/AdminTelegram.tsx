import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useClientes } from "@/hooks/useClientes";
import {
    Upload,
    Users,
    FileSpreadsheet,
    CheckCircle,
    XCircle,
    Download,
    Trash2,
    UserPlus,
    Send,
    AlertCircle
} from "lucide-react";

interface TelegramMember {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    phone: string;
    selected: boolean;
}

export default function AdminTelegram() {
    const { addCliente } = useClientes();

    const [members, setMembers] = useState<TelegramMember[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [importConfig, setImportConfig] = useState({
        defaultPlan: "Mensal",
        defaultStatus: "Ativo",
        defaultServer: "",
    });
    const [importResults, setImportResults] = useState<{
        success: number;
        failed: number;
        errors: string[];
    } | null>(null);

    // Parse CSV content
    const parseCSV = (content: string): TelegramMember[] => {
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length < 2) return [];

        const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
        const usernameIdx = headers.findIndex(h => h.includes('username') || h.includes('user'));
        const firstNameIdx = headers.findIndex(h => h.includes('first') || h.includes('nome'));
        const lastNameIdx = headers.findIndex(h => h.includes('last') || h.includes('sobrenome'));
        const phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('telefone') || h.includes('celular'));
        const idIdx = headers.findIndex(h => h.includes('id') || h.includes('user_id'));

        return lines.slice(1).map((line, index) => {
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
            return {
                id: idIdx >= 0 ? values[idIdx] : `member_${index}`,
                username: usernameIdx >= 0 ? values[usernameIdx]?.replace('@', '') : '',
                firstName: firstNameIdx >= 0 ? values[firstNameIdx] : '',
                lastName: lastNameIdx >= 0 ? values[lastNameIdx] : '',
                phone: phoneIdx >= 0 ? values[phoneIdx] : '',
                selected: true,
            };
        }).filter(m => m.username || m.firstName || m.phone);
    };

    // Parse JSON content
    const parseJSON = (content: string): TelegramMember[] => {
        try {
            const data = JSON.parse(content);
            const items = Array.isArray(data) ? data : data.members || data.users || data.data || [];

            return items.map((item: Record<string, unknown>, index: number) => ({
                id: String(item.id || item.user_id || `member_${index}`),
                username: String(item.username || item.user || '').replace('@', ''),
                firstName: String(item.first_name || item.firstName || item.name || ''),
                lastName: String(item.last_name || item.lastName || ''),
                phone: String(item.phone || item.phone_number || item.telefone || ''),
                selected: true,
            })).filter((m: TelegramMember) => m.username || m.firstName || m.phone);
        } catch {
            return [];
        }
    };

    // Handle file upload
    const handleFileUpload = useCallback((file: File) => {
        setIsLoading(true);
        setImportResults(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            let parsed: TelegramMember[] = [];

            if (file.name.endsWith('.csv')) {
                parsed = parseCSV(content);
            } else if (file.name.endsWith('.json')) {
                parsed = parseJSON(content);
            } else {
                // Try both parsers
                parsed = parseJSON(content);
                if (parsed.length === 0) {
                    parsed = parseCSV(content);
                }
            }

            if (parsed.length > 0) {
                setMembers(parsed);
                toast.success(`${parsed.length} membros encontrados no arquivo!`);
            } else {
                toast.error("Nenhum membro encontrado. Verifique o formato do arquivo.");
            }
            setIsLoading(false);
        };

        reader.onerror = () => {
            toast.error("Erro ao ler o arquivo.");
            setIsLoading(false);
        };

        reader.readAsText(file);
    }, []);

    // Drag and drop handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    // Toggle member selection
    const toggleMember = (id: string) => {
        setMembers(prev => prev.map(m =>
            m.id === id ? { ...m, selected: !m.selected } : m
        ));
    };

    // Select/Deselect all
    const toggleAll = (selected: boolean) => {
        setMembers(prev => prev.map(m => ({ ...m, selected })));
    };

    // Import selected members as clients
    const handleImport = async () => {
        const selectedMembers = members.filter(m => m.selected);

        if (selectedMembers.length === 0) {
            toast.error("Selecione pelo menos um membro para importar.");
            return;
        }

        setIsLoading(true);
        const results = { success: 0, failed: 0, errors: [] as string[] };

        // Calculate default expiration date (30 days from now)
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        const expDateStr = expirationDate.toISOString().split('T')[0];

        for (const member of selectedMembers) {
            try {
                const clientData = {
                    name: `${member.firstName} ${member.lastName}`.trim() || member.username,
                    email: member.username ? `${member.username}@telegram.user` : `${member.id}@telegram.user`,
                    telegram: member.username ? `@${member.username}` : '',
                    whatsapp: member.phone || '',
                    phone: member.phone || '',
                    plan: importConfig.defaultPlan,
                    status: importConfig.defaultStatus,
                    expiration_date: expDateStr,
                    server: importConfig.defaultServer,
                    observations: `Importado do Telegram - ID: ${member.id}`,
                    password: '',
                    m3u_url: '',
                    bouquets: '',
                    real_name: `${member.firstName} ${member.lastName}`.trim(),
                    devices: 1,
                    credits: 0,
                    notes: '',
                };

                const success = await addCliente(clientData);

                if (success) {
                    results.success++;
                } else {
                    results.failed++;
                    results.errors.push(`${member.username || member.firstName}: Erro ao adicionar`);
                }
            } catch (error) {
                results.failed++;
                results.errors.push(`${member.username || member.firstName}: ${error instanceof Error ? error.message : 'Erro'}`);
            }
        }

        setImportResults(results);
        setIsLoading(false);

        if (results.success > 0) {
            toast.success(`${results.success} cliente(s) importado(s) com sucesso!`);
            // Remove imported members from list
            setMembers(prev => prev.filter(m => !m.selected));
        }

        if (results.failed > 0) {
            toast.error(`${results.failed} falha(s) na importação.`);
        }
    };

    // Clear all
    const handleClear = () => {
        setMembers([]);
        setImportResults(null);
    };

    const selectedCount = members.filter(m => m.selected).length;

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                        <Send className="w-7 h-7 text-blue-500" />
                        Importar do Telegram
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Importe membros de grupos do Telegram como clientes
                    </p>
                </div>
            </div>

            {/* Instructions */}
            <Card className="bg-blue-950/30 border-blue-800/50">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-400" />
                        Como usar
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>1. Exporte os membros do seu grupo Telegram usando uma ferramenta como:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                        <li><strong>Telegram Desktop</strong>: Configurações do grupo → Exportar dados</li>
                        <li><strong>Bots</strong>: @ExportMembersBot ou similares</li>
                        <li><strong>Extensões</strong>: Telegram Members Exporter (Chrome/Firefox)</li>
                    </ul>
                    <p>2. Faça upload do arquivo CSV ou JSON abaixo</p>
                    <p>3. Selecione os membros e clique em "Importar como Clientes"</p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload Area */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="w-5 h-5" />
                            Upload de Arquivo
                        </CardTitle>
                        <CardDescription>
                            Arraste um arquivo CSV ou JSON
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Drag and Drop Zone */}
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
                ${isDragOver ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50'}
              `}
                            onClick={() => document.getElementById('file-input')?.click()}
                        >
                            <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                Arraste um arquivo aqui ou clique para selecionar
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Formatos: CSV, JSON
                            </p>
                            <input
                                id="file-input"
                                type="file"
                                accept=".csv,.json"
                                onChange={handleFileInput}
                                className="hidden"
                            />
                        </div>

                        {/* Import Config */}
                        <div className="space-y-4 pt-4 border-t">
                            <h4 className="font-medium">Configurações de Importação</h4>

                            <div className="space-y-2">
                                <Label>Plano Padrão</Label>
                                <Select
                                    value={importConfig.defaultPlan}
                                    onValueChange={(v) => setImportConfig(prev => ({ ...prev, defaultPlan: v }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Mensal">Mensal</SelectItem>
                                        <SelectItem value="Trimestral">Trimestral</SelectItem>
                                        <SelectItem value="Semestral">Semestral</SelectItem>
                                        <SelectItem value="Anual">Anual</SelectItem>
                                        <SelectItem value="Vitalício">Vitalício</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Status Padrão</Label>
                                <Select
                                    value={importConfig.defaultStatus}
                                    onValueChange={(v) => setImportConfig(prev => ({ ...prev, defaultStatus: v }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Ativo">Ativo</SelectItem>
                                        <SelectItem value="Inativo">Inativo</SelectItem>
                                        <SelectItem value="Pendente">Pendente</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Servidor</Label>
                                <Input
                                    placeholder="Ex: server1.exemplo.com"
                                    value={importConfig.defaultServer}
                                    onChange={(e) => setImportConfig(prev => ({ ...prev, defaultServer: e.target.value }))}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Members Preview */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Membros Encontrados
                                {members.length > 0 && (
                                    <Badge variant="secondary">{members.length}</Badge>
                                )}
                            </CardTitle>
                            <CardDescription>
                                {selectedCount} de {members.length} selecionados
                            </CardDescription>
                        </div>

                        {members.length > 0 && (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toggleAll(true)}
                                >
                                    Selecionar Todos
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toggleAll(false)}
                                >
                                    Desmarcar Todos
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleClear}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent>
                        {members.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Nenhum membro carregado</p>
                                <p className="text-sm">Faça upload de um arquivo para ver os membros aqui</p>
                            </div>
                        ) : (
                            <>
                                <div className="max-h-[400px] overflow-auto rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-12">
                                                    <Checkbox
                                                        checked={selectedCount === members.length}
                                                        onCheckedChange={(checked) => toggleAll(!!checked)}
                                                    />
                                                </TableHead>
                                                <TableHead>Username</TableHead>
                                                <TableHead>Nome</TableHead>
                                                <TableHead>Telefone</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {members.map((member) => (
                                                <TableRow key={member.id} className={member.selected ? '' : 'opacity-50'}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={member.selected}
                                                            onCheckedChange={() => toggleMember(member.id)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {member.username ? `@${member.username}` : '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {`${member.firstName} ${member.lastName}`.trim() || '-'}
                                                    </TableCell>
                                                    <TableCell>{member.phone || '-'}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Import Button */}
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        {selectedCount} membro(s) será(ão) importado(s)
                                    </div>
                                    <Button
                                        onClick={handleImport}
                                        disabled={isLoading || selectedCount === 0}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600"
                                    >
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        {isLoading ? 'Importando...' : `Importar ${selectedCount} Cliente(s)`}
                                    </Button>
                                </div>
                            </>
                        )}

                        {/* Import Results */}
                        {importResults && (
                            <div className="mt-4 p-4 rounded-lg bg-muted/50 space-y-2">
                                <h4 className="font-medium">Resultado da Importação</h4>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2 text-green-500">
                                        <CheckCircle className="w-4 h-4" />
                                        {importResults.success} sucesso
                                    </div>
                                    <div className="flex items-center gap-2 text-red-500">
                                        <XCircle className="w-4 h-4" />
                                        {importResults.failed} falha(s)
                                    </div>
                                </div>
                                {importResults.errors.length > 0 && (
                                    <div className="text-sm text-red-400 mt-2">
                                        <p className="font-medium">Erros:</p>
                                        <ul className="list-disc list-inside">
                                            {importResults.errors.slice(0, 5).map((err, i) => (
                                                <li key={i}>{err}</li>
                                            ))}
                                            {importResults.errors.length > 5 && (
                                                <li>... e mais {importResults.errors.length - 5} erros</li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Sample File Download */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        Arquivo de Exemplo
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Baixe um arquivo de exemplo para ver o formato esperado:
                    </p>
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                const csv = 'username,first_name,last_name,phone\n@joao123,João,Silva,+5511999999999\n@maria456,Maria,Santos,+5511988888888';
                                const blob = new Blob([csv], { type: 'text/csv' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'telegram_members_exemplo.csv';
                                a.click();
                            }}
                        >
                            <FileSpreadsheet className="w-4 h-4 mr-2" />
                            Baixar CSV de Exemplo
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                const json = JSON.stringify({
                                    members: [
                                        { id: 123456789, username: "joao123", first_name: "João", last_name: "Silva", phone: "+5511999999999" },
                                        { id: 987654321, username: "maria456", first_name: "Maria", last_name: "Santos", phone: "+5511988888888" }
                                    ]
                                }, null, 2);
                                const blob = new Blob([json], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'telegram_members_exemplo.json';
                                a.click();
                            }}
                        >
                            <FileSpreadsheet className="w-4 h-4 mr-2" />
                            Baixar JSON de Exemplo
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
