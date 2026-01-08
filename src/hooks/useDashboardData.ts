
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

type UserRow = {
  id: string | number;
  name?: string;
  email?: string;
  status?: string;
  plan?: string;
  price?: string;
  m3u_url?: string;
  pago?: boolean | string | number;
  admin_id?: string;
  [key: string]: any;
};

type ResellerRow = {
  id: string | number;
  username?: string;
  email?: string;
  status?: string;
  credits?: number;
  price?: string;
  admin_id?: string;
  [key: string]: any;
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

const parsePrice = (price: string | number | undefined): number => {
  if (!price) return 0;
  if (typeof price === 'number') return price;
  const priceString = String(price).replace(/\./g, '').replace(',', '.');
  const parsed = parseFloat(priceString);
  return isNaN(parsed) ? 0 : parsed;
};

export function useDashboardData() {
  const { user, userRole } = useAuth();

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

  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const [usersRes, resellersRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/resellers')
      ]);

      const clientesData = usersRes.ok ? await usersRes.json() : [];
      const revendasData = resellersRes.ok ? await resellersRes.json() : [];

      const clientes = Array.isArray(clientesData) ? clientesData : [];
      const revendas = Array.isArray(revendasData) ? revendasData : [];

      // Filtragem por permissão
      const clientesDoAdmin = userRole === 'admin'
        ? clientes
        : clientes.filter((c: UserRow) => c.admin_id === user.id || c.admin_id === null);

      const revendasDoAdmin = userRole === 'admin'
        ? revendas
        : revendas.filter((r: ResellerRow) => r.admin_id === user.id || r.admin_id === null);

      // Metricas
      const activeClients = clientesDoAdmin.filter((c: UserRow) =>
        c.status?.toLowerCase() === 'ativo' || c.status?.toLowerCase() === 'active'
      ).length;

      const activeResellers = revendasDoAdmin.filter((r: ResellerRow) =>
        r.status?.toLowerCase() === 'ativo' || r.status?.toLowerCase() === 'active'
      ).length;

      const totalUsers = clientesDoAdmin.length + revendasDoAdmin.length;

      // Receita Clientes
      const revenueFromClientes = clientesDoAdmin
        .filter((c: UserRow) => c.pago === true || c.pago === "true" || c.pago === 1)
        .reduce((sum: number, c: UserRow) => sum + parsePrice(c.price), 0);

      // Receita Revendas
      const revenueFromRevendas = revendasDoAdmin.reduce((sum: number, r: ResellerRow) => {
        if (r.price) return sum + parsePrice(r.price);
        if (r.credits) return sum + (typeof r.credits === 'number' ? r.credits : parseFloat(String(r.credits)) || 0);
        return sum;
      }, 0);

      // Cobranças (Mockado por enquanto pois não há API, evita erro de rede)
      const revenueFromCobrancas = 0;
      const monthlyGrowth = 0;

      const totalRevenue = revenueFromClientes + revenueFromRevendas + revenueFromCobrancas;

      const iptvUsers = clientesDoAdmin.filter((c: UserRow) =>
        c.plan?.toLowerCase().includes('iptv') || c.m3u_url
      ).length;

      const radioListeners = clientesDoAdmin.filter((c: UserRow) =>
        c.plan?.toLowerCase().includes('radio')
      ).length;

      setStats({
        totalUsers,
        totalRevenue,
        activeResellers,
        activeClients,
        monthlyGrowth,
        iptvUsers,
        radioListeners,
        aiInteractions: 0
      });

    } catch (err: unknown) {
      console.error('Erro ao carregar dashboard:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [user, userRole]);

  useEffect(() => {
    fetchData();

    // Listen for refresh events
    const handleRefresh = (e: CustomEvent) => {
      console.log('🔄 Refresh manual solicitado via evento', e.detail);
      fetchData();
    };
    window.addEventListener('refresh-dashboard', handleRefresh);
    return () => window.removeEventListener('refresh-dashboard', handleRefresh);
  }, [fetchData]);

  return { stats, loading, error, refresh: fetchData };
}

export default useDashboardData;
