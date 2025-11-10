import { useState, useEffect, useCallback } from 'react';
import { useRealtime } from './useRealtime';
import { supabase } from '@/lib/supabase';

// Definindo tipos genéricos para usuários e revendedores
type UserRow = {
  id: string | number;
  name?: string;
  email?: string;
  status?: string;
  plan?: string;
  price?: string;
  m3u_url?: string;
  pago?: boolean;
  [key: string]: any; // Para propriedades adicionais
};

type ResellerRow = {
  id: string | number;
  username?: string;
  email?: string;
  status?: string;
  credits?: number;
  price?: string;
  [key: string]: any; // Para propriedades adicionais
};

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
  // Usando o hook useRealtime para buscar dados em tempo real
  // Nota: Estamos usando 'any' temporariamente para evitar erros de tipo
  const { data: clientes = [], error: clientesError, refresh: refreshClientes } = useRealtime<any>({ table: 'users' });
  const { data: revendas = [], error: revendasError, refresh: refreshRevendas } = useRealtime<any>({ table: 'resellers' });
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
        const status = (cliente as UserRow).status?.toLowerCase();
        return status === 'ativo' || status === 'active';
      }).length;

      // Contagem de revendedores ativos
      const activeResellers = revendas.filter(revenda => {
        const status = (revenda as ResellerRow).status?.toLowerCase();
        return status === 'ativo' || status === 'active';
      }).length;

      // Total de usuários (clientes + revendedores)
      const totalUsers = clientes.length + revendas.length;

      // Função auxiliar para converter preço de string (formato brasileiro) para número
      const parsePrice = (price: string | number | undefined): number => {
        if (!price) return 0;
        if (typeof price === 'number') return price;
        
        // Converte formato brasileiro "30,00" para número
        const priceString = String(price).replace(/\./g, '').replace(',', '.');
        const parsed = parseFloat(priceString);
        return isNaN(parsed) ? 0 : parsed;
      };

      // Calcular receita total dos clientes marcados como pagos (soma dos preços)
      let revenueFromClientes = 0;
      try {
        revenueFromClientes = clientes.reduce((sum, cliente) => {
          const clienteRow = cliente as UserRow;
          // Só soma a receita se o cliente estiver marcado como pago
          if (clienteRow.pago === true) {
            const price = clienteRow.price;
            return sum + parsePrice(price);
          }
          return sum;
        }, 0);
        console.log('💰 [useDashboardData] Receita dos clientes pagos:', revenueFromClientes);
      } catch (error) {
        console.error('Erro ao calcular receita dos clientes:', error);
      }

      // Calcular receita total das revendas (soma dos créditos ou preços se houver)
      let revenueFromRevendas = 0;
      try {
        revenueFromRevendas = revendas.reduce((sum, revenda) => {
          // Primeiro tenta usar o campo price, depois credits
          const price = (revenda as ResellerRow).price;
          const credits = (revenda as ResellerRow).credits || 0;
          
          if (price) {
            return sum + parsePrice(price);
          } else if (credits) {
            // Se não tiver price, usa credits como valor
            return sum + (typeof credits === 'number' ? credits : parseFloat(String(credits)) || 0);
          }
          return sum;
        }, 0);
        console.log('💰 [useDashboardData] Receita das revendas:', revenueFromRevendas);
      } catch (error) {
        console.error('Erro ao calcular receita das revendas:', error);
      }

      // Buscar dados adicionais do Supabase (cobranças)
      let revenueFromCobrancas = 0;
      let monthlyGrowth = 0;
      
      try {
        // Busca todas as cobranças pagas do último mês e soma os valores
        const { data: revenueData } = await supabase
          .from('cobrancas')
          .select('valor')
          .eq('status', 'pago')
          .gte('data_vencimento', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]);
          
        revenueFromCobrancas = revenueData?.reduce((sum, item) => sum + (parseFloat(String(item.valor)) || 0), 0) || 0;
        console.log('💰 [useDashboardData] Receita das cobranças:', revenueFromCobrancas);
        
        // Cálculo simples de crescimento (pode ser aprimorado)
        const lastMonthStart = new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().split('T')[0];
        const lastMonthEnd = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0];
        
        const { data: lastMonthData } = await supabase
          .from('cobrancas')
          .select('valor')
          .eq('status', 'pago')
          .gte('data_vencimento', lastMonthStart)
          .lt('data_vencimento', lastMonthEnd);
          
        const lastMonthRevenue = lastMonthData?.reduce((sum, item) => sum + (parseFloat(String(item.valor)) || 0), 0) || 0;
        monthlyGrowth = lastMonthRevenue > 0 
          ? ((revenueFromCobrancas - lastMonthRevenue) / lastMonthRevenue) * 100 
          : 0;
      } catch (error) {
        console.error('Erro ao buscar dados financeiros:', error);
      }

      // Receita total = clientes + revendas + cobranças
      const totalRevenue = revenueFromClientes + revenueFromRevendas + revenueFromCobrancas;
      console.log('💰 [useDashboardData] Receita Total:', totalRevenue, {
        clientes: revenueFromClientes,
        revendas: revenueFromRevendas,
        cobrancas: revenueFromCobrancas
      });

      // Contar usuários de IPTV e Rádio baseado no plano
      const iptvUsers = clientes.filter(cliente => {
        const plan = (cliente as UserRow).plan?.toLowerCase();
        // Verifica se o plano contém 'iptv' ou se o cliente tem URL M3U
        return plan?.includes('iptv') || (cliente as UserRow).m3u_url;
      }).length;
      
      const radioListeners = clientes.filter(cliente => {
        const plan = (cliente as UserRow).plan?.toLowerCase();
        // Implemente a lógica para verificar se o plano é de Rádio
        return plan?.includes('radio');
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
