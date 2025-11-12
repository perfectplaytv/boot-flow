import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useClientes } from '@/hooks/useClientes';
import { useRealtime } from '@/hooks/useRealtime.agent';
import { bootFlowSummaryAgent } from '@/modules/ai/summaryAgent';
import { TrendingUp, Users, DollarSign, Activity, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const AnalyticsPlus = () => {
  const { stats } = useDashboardData();
  const { clientes } = useClientes();
  const [summary, setSummary] = useState<string>('');
  const [focusMode, setFocusMode] = useState(false);

  // Dados em tempo real via Supabase Realtime
  const realtimeData = useRealtime<{ timestamp: string; value: number }>({
    channel: 'analytics',
    event: 'metric_update',
    enabled: true,
  });

  useEffect(() => {
    const generateSummary = async () => {
      const summaryText = await bootFlowSummaryAgent.generateMetricsSummary({
        totalUsers: stats?.totalUsers,
        totalRevenue: stats?.totalRevenue,
        activeClients: stats?.activeClients,
        pendingBills: 0,
      });
      setSummary(summaryText);
    };
    generateSummary();
  }, [stats]);

  // Dados simulados para gráficos (substituir por dados reais)
  const revenueData = [
    { month: 'Jan', receita: stats?.totalRevenue ? stats.totalRevenue * 0.8 : 0 },
    { month: 'Fev', receita: stats?.totalRevenue ? stats.totalRevenue * 0.9 : 0 },
    { month: 'Mar', receita: stats?.totalRevenue || 0 },
  ];

  const activityData = clientes.slice(0, 10).map((cliente, idx) => ({
    name: cliente.name || `Cliente ${idx + 1}`,
    valor: cliente.price ? parseFloat(cliente.price.toString()) : 0,
  }));

  return (
    <div className={`space-y-6 p-6 transition-all duration-300 ${focusMode ? 'bg-slate-950' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Plus</h1>
          <p className="text-slate-400 mt-1">Análises avançadas em tempo real</p>
        </div>
        <button
          onClick={() => setFocusMode(!focusMode)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
        >
          {focusMode ? 'Sair do Modo Foco' : 'Modo Foco'}
        </button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-300 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-blue-300 mt-1">+12% este mês</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-300 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Receita Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                R$ {stats?.totalRevenue?.toLocaleString('pt-BR') || '0'}
              </div>
              <p className="text-xs text-green-300 mt-1">+8% este mês</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-300 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Clientes Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats?.activeClients || 0}</div>
              <p className="text-xs text-purple-300 mt-1">Ativos agora</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 border-amber-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-300 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Tempo Real
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {realtimeData ? 'Ativo' : '--'}
              </div>
              <p className="text-xs text-amber-300 mt-1">Conexão Supabase</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Resumo AI */}
      {summary && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-violet-400" />
              Resumo Executivo (IA)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line">{summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Gráficos */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="bg-slate-900 border-slate-800">
          <TabsTrigger value="revenue" className="data-[state=active]:bg-slate-800">Receita</TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-slate-800">Atividade</TabsTrigger>
          <TabsTrigger value="clients" className="data-[state=active]:bg-slate-800">Clientes</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Evolução da Receita</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="receita"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Atividade por Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  />
                  <Bar dataKey="valor" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Distribuição de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="valor" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

