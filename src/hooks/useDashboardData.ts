import { useState, useEffect, useCallback } from 'react';
import { useRealtime } from './useRealtime';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

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
  // Obter o admin logado
  const { user } = useAuth();
  
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
      
      // Filtrar clientes apenas do admin logado (se houver admin logado)
      const clientesDoAdmin = user?.id 
        ? clientes.filter((cliente) => {
            const clienteRow = cliente as UserRow & { admin_id?: string };
            // Incluir clientes associados ao admin logado ou clientes sem admin (NULL)
            return clienteRow.admin_id === user.id || clienteRow.admin_id === null || clienteRow.admin_id === undefined;
          })
        : clientes;
      
      // Contagem de clientes ativos (apenas do admin logado)
      const activeClients = clientesDoAdmin.filter(cliente => {
        const status = (cliente as UserRow).status?.toLowerCase();
        return status === 'ativo' || status === 'active';
      }).length;

      // Contagem de revendedores ativos
      const activeResellers = revendas.filter(revenda => {
        const status = (revenda as ResellerRow).status?.toLowerCase();
        return status === 'ativo' || status === 'active';
      }).length;

      // Total de usuários (clientes do admin + revendedores)
      const totalUsers = clientesDoAdmin.length + revendas.length;

      // Função auxiliar para converter preço de string (formato brasileiro) para número
      const parsePrice = (price: string | number | undefined): number => {
        if (!price) return 0;
        if (typeof price === 'number') return price;
        
        // Converte formato brasileiro "30,00" para número
        const priceString = String(price).replace(/\./g, '').replace(',', '.');
        const parsed = parseFloat(priceString);
        return isNaN(parsed) ? 0 : parsed;
      };

      console.log(`💰 [useDashboardData] Admin logado: ${user?.id}, Total de clientes: ${clientes.length}, Clientes do admin: ${clientesDoAdmin.length}`);

      // Calcular receita total dos clientes marcados como pagos (soma dos preços)
      // Usar clientesDoAdmin que já foi filtrado acima
      let revenueFromClientes = 0;
      try {
        const clientesPagos = clientesDoAdmin.filter((cliente) => {
          const clienteRow = cliente as UserRow;
          // Verificar se o cliente está marcado como pago
          // Pode ser true, "true", 1, ou qualquer valor truthy
          const isPago = clienteRow.pago === true || 
                        clienteRow.pago === "true" || 
                        clienteRow.pago === 1 ||
                        clienteRow.pago === "1";
          return isPago;
        });
        
        console.log(`💰 [useDashboardData] Total de clientes do admin: ${clientesDoAdmin.length}, Clientes pagos: ${clientesPagos.length}`);
        
        revenueFromClientes = clientesPagos.reduce((sum, cliente) => {
          const clienteRow = cliente as UserRow;
          const price = clienteRow.price;
          const parsedPrice = parsePrice(price);
          console.log(`💰 [useDashboardData] Cliente ${clienteRow.name}: pago=${clienteRow.pago}, price=${price}, parsed=${parsedPrice}, admin_id=${(cliente as UserRow & { admin_id?: string }).admin_id}`);
          return sum + parsedPrice;
        }, 0);
        
        console.log('💰 [useDashboardData] Receita dos clientes pagos do admin:', revenueFromClientes, {
          adminId: user?.id,
          totalClientes: clientes.length,
          clientesDoAdmin: clientesDoAdmin.length,
          clientesPagos: clientesPagos.length,
          detalhes: clientesPagos.map(c => ({ name: c.name, price: c.price, pago: c.pago, admin_id: (c as UserRow & { admin_id?: string }).admin_id }))
        });
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

      // Contar usuários de IPTV e Rádio baseado no plano (apenas do admin logado)
      const iptvUsers = clientesDoAdmin.filter(cliente => {
        const plan = (cliente as UserRow).plan?.toLowerCase();
        // Verifica se o plano contém 'iptv' ou se o cliente tem URL M3U
        return plan?.includes('iptv') || (cliente as UserRow).m3u_url;
      }).length;
      
      const radioListeners = clientesDoAdmin.filter(cliente => {
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
  }, [clientes, revendas, user?.id, setError, setLoading, setStats]);

  // Atualiza as estatísticas quando os dados mudam
  useEffect(() => {
    if (clientes.length > 0 || revendas.length > 0 || clientes.length === 0) {
      calculateStats();
    }
  }, [clientes, revendas, calculateStats]);

  // Função de refresh que atualiza os dados e recalcula as estatísticas
  const refresh = useCallback(async () => {
    console.log('🔄 [useDashboardData] Refresh manual chamado');
    try {
      // Forçar atualização dos dados do useRealtime
      if (refreshClientes) {
        console.log('🔄 [useDashboardData] Atualizando clientes...');
        await refreshClientes();
      }
      if (refreshRevendas) {
        console.log('🔄 [useDashboardData] Atualizando revendas...');
        await refreshRevendas();
      }
      // Aguardar um pouco para os dados serem atualizados e então recalcular
      // Usar um delay maior para garantir que o Supabase atualizou
      setTimeout(async () => {
        console.log('🔄 [useDashboardData] Recalculando estatísticas após refresh...');
        await calculateStats();
      }, 300);
    } catch (error) {
      console.error('❌ [useDashboardData] Erro no refresh:', error);
      // Mesmo com erro, tenta recalcular com os dados atuais
      calculateStats();
    }
  }, [refreshClientes, refreshRevendas, calculateStats]);

  // Listener para eventos de atualização
  useEffect(() => {
    const handleRefreshEvent = (event: CustomEvent) => {
      console.log('🔄 [useDashboardData] Evento refresh-dashboard recebido:', event.detail);
      if (event.detail?.field === 'pago' || event.detail?.forceRefresh || event.detail?.source === 'users') {
        console.log('🔄 [useDashboardData] Evento de pagamento detectado, atualizando receita...');
        console.log('🔄 [useDashboardData] Detalhes:', {
          userId: event.detail?.userId,
          pago: event.detail?.pago,
          price: event.detail?.price
        });
        
        // Primeiro, forçar atualização dos dados do useRealtime
        const updateData = async () => {
          try {
            // Forçar refresh dos clientes
            if (refreshClientes) {
              console.log('🔄 [useDashboardData] Forçando refresh dos clientes...');
              await refreshClientes();
            }
            
            // Aguardar um pouco para os dados serem atualizados
            await new Promise(resolve => setTimeout(resolve, 600));
            
            // Recalcular estatísticas
            console.log('🔄 [useDashboardData] Recalculando estatísticas após refresh...');
            await calculateStats();
            
            // Se ainda não atualizou, tentar novamente
            setTimeout(async () => {
              if (refreshClientes) {
                await refreshClientes();
              }
              await calculateStats();
            }, 1000);
          } catch (error) {
            console.error('❌ [useDashboardData] Erro ao atualizar:', error);
            // Em caso de erro, tentar recalcular com os dados atuais
            calculateStats();
          }
        };
        
        updateData();
      }
    };

    window.addEventListener('refresh-dashboard', handleRefreshEvent as EventListener);
    return () => {
      window.removeEventListener('refresh-dashboard', handleRefreshEvent as EventListener);
    };
  }, [refresh, refreshClientes, calculateStats]);

  return {
    stats,
    loading,
    error: error || clientesError?.message || revendasError?.message,
    refresh
  };
}

export default useDashboardData;
