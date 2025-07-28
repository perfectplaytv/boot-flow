import { useState, useEffect, useCallback } from 'react';
import { useRealtimeClientes, useRealtimeRevendas } from './useRealtime';
import { Cliente } from './useClientes';
import { Revenda } from './useRevendas';
import { supabase } from '@/lib/supabase';

export interface DashboardStats {
  totalUsers: number;
  totalRevenue: number;
  activeResellers: number;
  activeClients: number;
  monthlyGrowth: number;
  iptvUsers: number;
  radioListeners: number;
  aiInteractions: number;
}

export function useDashboardData() {
  // Estados para os dados em tempo real
  const { data: clientes, loading: loadingClientes, error: clientesError } = useRealtimeClientes();
  const { data: revendas, loading: loadingRevendas, error: revendasError } = useRealtimeRevendas();
  
  // Estado para as estatísticas do dashboard
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRevenue: 0,
    activeResellers: 0,
    activeClients: 0,
    monthlyGrowth: 0,
    iptvUsers: 0,
    radioListeners: 0,
    aiInteractions: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para calcular as estatísticas
  const calculateStats = useCallback(async () => {
    try {
      setLoading(true);
      
      // Contagem de clientes ativos (exemplo: status = 'Ativo')
      const activeClients = clientes.filter(cliente => 
        cliente.status === 'Ativo' || cliente.status === 'ativo'
      ).length;

      // Contagem de revendedores ativos
      const activeResellers = revendas.filter(revenda => 
        revenda.status === 'Ativo' || revenda.status === 'ativo' || revenda.status === 'active'
      ).length;

      // Total de usuários (clientes + revendedores)
      const totalUsers = clientes.length + revendas.length;

      // Buscar dados adicionais do Supabase, se necessário
      const { data: revenueData, error: revenueError } = await supabase
        .rpc('get_monthly_revenue')
        .single();

      const { data: growthData, error: growthError } = await supabase
        .rpc('get_growth_rate')
        .single();

      // Atualiza as estatísticas
      setStats({
        totalUsers,
        totalRevenue: revenueData?.revenue || 0,
        activeResellers,
        activeClients,
        monthlyGrowth: growthData?.growth_rate || 0,
        iptvUsers: clientes.filter(c => c.plan?.toLowerCase().includes('iptv')).length,
        radioListeners: clientes.filter(c => c.plan?.toLowerCase().includes('radio')).length,
        aiInteractions: 0 // Implementar contagem de interações com IA se necessário
      });

    } catch (err) {
      console.error('Erro ao calcular estatísticas do dashboard:', err);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  }, [clientes, revendas]);

  // Atualiza as estatísticas quando os dados mudam
  useEffect(() => {
    if (!loadingClientes && !loadingRevendas) {
      calculateStats();
    }
  }, [loadingClientes, loadingRevendas, calculateStats]);

  return {
    stats,
    loading: loading || loadingClientes || loadingRevendas,
    error: error || clientesError?.message || revendasError?.message,
    refresh: calculateStats
  };
}

export default useDashboardData;
