import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, Download, RefreshCw, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { exportToCSV, exportToPDF } from '@/utils/exportUtils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LogEntry {
  id: string;
  event_type: string;
  reason?: string;
  ip_address?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export const LogsEnhanced = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    let filtered = logs;

    if (search) {
      filtered = filtered.filter(
        (log) =>
          log.event_type.toLowerCase().includes(search.toLowerCase()) ||
          log.reason?.toLowerCase().includes(search.toLowerCase()) ||
          log.ip_address?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (filter !== 'all') {
      filtered = filtered.filter((log) => log.event_type === filter);
    }

    setFilteredLogs(filtered);
  }, [search, filter, logs]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('security_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) throw error;
      setLogs((data as LogEntry[]) || []);
    } catch (error) {
      console.error('Erro ao carregar logs', error);
    } finally {
      setLoading(false);
    }
  };

  const getLogIcon = (type: string) => {
    if (type.includes('error') || type.includes('suspicious')) {
      return <AlertCircle className="h-4 w-4 text-red-400" />;
    }
    if (type.includes('warning')) {
      return <AlertTriangle className="h-4 w-4 text-amber-400" />;
    }
    return <Info className="h-4 w-4 text-blue-400" />;
  };

  const getLogBadge = (type: string) => {
    if (type.includes('suspicious')) {
      return <Badge variant="destructive">Suspeito</Badge>;
    }
    if (type.includes('rate_limit')) {
      return <Badge className="bg-amber-600">Rate Limit</Badge>;
    }
    return <Badge variant="secondary">Info</Badge>;
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    const exportData = {
      headers: ['Data', 'Tipo', 'Motivo', 'IP', 'Metadados'],
      rows: filteredLogs.map((log) => [
        format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR }),
        log.event_type,
        log.reason || '-',
        log.ip_address || '-',
        JSON.stringify(log.metadata || {}),
      ]),
      title: 'Logs de Segurança',
    };

    if (format === 'csv') {
      exportToCSV(exportData, 'security-logs');
    } else {
      exportToPDF(exportData, 'security-logs');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Logs de Segurança</h1>
          <p className="text-slate-400 mt-1">Monitoramento e auditoria do sistema</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            PDF
          </button>
          <button
            onClick={loadLogs}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar logs..."
            className="pl-10 bg-slate-900 border-slate-700 text-white"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white"
        >
          <option value="all">Todos</option>
          <option value="suspicious_activity">Atividade Suspeita</option>
          <option value="rate_limit_exceeded">Rate Limit</option>
          <option value="invalid_jwt">JWT Inválido</option>
          <option value="no_session">Sem Sessão</option>
        </select>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">
            {filteredLogs.length} {filteredLogs.length === 1 ? 'log encontrado' : 'logs encontrados'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            {loading ? (
              <div className="text-center py-12 text-slate-400">Carregando logs...</div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-slate-400">Nenhum log encontrado</div>
            ) : (
              <div className="space-y-2">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 rounded-lg border border-slate-800 bg-slate-900/50 p-4 hover:bg-slate-900 transition-colors"
                  >
                    <div className="mt-1">{getLogIcon(log.event_type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white">{log.event_type}</span>
                        {getLogBadge(log.event_type)}
                      </div>
                      {log.reason && <p className="text-sm text-slate-300 mb-1">{log.reason}</p>}
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        {log.ip_address && <span>IP: {log.ip_address}</span>}
                        <span>
                          {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
                        </span>
                      </div>
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <details className="mt-2">
                          <summary className="text-xs text-slate-500 cursor-pointer">Metadados</summary>
                          <pre className="mt-2 text-xs text-slate-400 bg-slate-950 p-2 rounded overflow-auto">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

