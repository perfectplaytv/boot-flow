import { useState, useEffect, useCallback } from 'react';
import { useRealtimeClientes, useRealtimeRevendas } from './useRealtime';
import { Cliente } from './useClientes';
import { Revenda } from './useRevendas';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase.types';

type ClienteRow = Database['public']['Tables']['clientes']['Row'];
type RevendaRow = Database['public']['Tables']['revendas']['Row'];

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

function useDashboardData() {
  // Estados para os dados em tempo real
  const { data: clientes = [], error: clientesError } = useRealtimeClientes();
  const { data: revendas = [], error: revendasError } = useRealtimeRevendas();
  const [loading, setLoading] = useState(true);
  
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

  const [error, setError] = useState<string | null>(null);

  // Função para calcular as estatísticas
  const calculateStats = useCallback(async () => {
    try {
      setLoading(true);
      
      // Contagem de clientes ativos
      const activeClients = clientes.filter(cliente => {
        const status = (cliente as ClienteRow).status?.toLowerCase();
        return status === 'ativo' || status === 'active';
      }).length;

      // Contagem de revendedores ativos
      const activeResellers = revendas.filter(revenda => {
        const status = (revenda as RevendaRow).status?.toLowerCase();
        return status === 'ativo' || status === 'active';
      }).length;

      // Total de usuários (clientes + revendedores)
      const totalUsers = clientes.length + revendas.length;

      // Buscar dados adicionais do Supabase, se necessário
      let totalRevenue = 0;
      let monthlyGrowth = 0;
      
      try {
        const { data: revenueData } = await supabase
          .from('cobrancas')
          .select('valor')
          .eq('status', 'pago')
          .gte('data_vencimento', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString())
          .single();
          
        totalRevenue = parseFloat(revenueData?.valor) || 0;
        
        // Cálculo simples de crescimento (pode ser aprimorado)
        const lastMonthData = await supabase
          .from('cobrancas')
          .select('valor')
          .eq('status', 'pago')
          .gte('data_vencimento', new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString())
          .lt('data_vencimento', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString())
          .single();
          
        const lastMonthRevenue = parseFloat(lastMonthData.data?.valor) || 0;
        monthlyGrowth = lastMonthRevenue > 0 
          ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
          : 0;
      } catch (error) {
        console.error('Erro ao buscar dados financeiros:', error);
      }

      // Contar usuários de IPTV e Rádio baseado no plano
      const iptvUsers = clientes.filter(cliente => {
        const planoId = (cliente as ClienteRow).plano_id;
        // Implemente a lógica para verificar se o plano é de IPTV
        return planoId?.toString().toLowerCase().includes('iptv');
      }).length;
      
      const radioListeners = clientes.filter(cliente => {
        const planoId = (cliente as ClienteRow).plano_id;
        // Implemente a lógica para verificar se o plano é de Rádio
        return planoId?.toString().toLowerCase().includes('radio');
      }).length;

      // Atualiza as estatísticas
      setStats(prevStats => ({
        ...prevStats,
        totalUsers,
        totalRevenue,
        activeResellers,
        activeClients,
        monthlyGrowth,
        iptvUsers,
        radioListeners,
        aiInteractions: 0 // Implementar contagem de interações com IA se necessário
      }));

    } catch (err) {
      console.error('Erro ao calcular estatísticas do dashboard:', err);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  }, [clientes, revendas, setError, setLoading, setStats]);

  // Atualiza as estatísticas quando os dados mudam
  useEffect(() => {
    if (clientes.length > 0 || revendas.length > 0) {
      calculateStats();
    }
  }, [clientes, revendas, calculateStats]);

  return {
    stats,
    loading,
    error: error || clientesError?.message || revendasError?.message,
    refresh: calculateStats
  };
}

export default useDashboardData;
