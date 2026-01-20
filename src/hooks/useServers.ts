
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Servidor {
    id: number;
    nome: string;
    ip: string;
    porta: number;
    status: 'online' | 'offline' | 'manutencao';
    tipo: string;
    cpu: number;
    memoria: number;
    disco: number;
    ultimaAtualizacao?: string;
}

export function useServers() {
    const { token } = useAuth();
    const [servers, setServers] = useState<Servidor[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchServers = useCallback(async () => {
        // Se ainda não tem token, não busca nada e não marca como carregado se for o inicio
        if (!token) return;

        try {
            const res = await fetch('/api/servers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setServers(data);
            } else {
                console.error('Erro ao buscar servidores:', res.statusText);
            }
        } catch (error) {
            console.error('Erro ao buscar servidores:', error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const addServer = async (server: Omit<Servidor, 'id'>) => {
        if (!token) return false;
        try {
            const res = await fetch('/api/servers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(server)
            });

            if (res.ok) {
                const newServer = await res.json();
                setServers(prev => [...prev, newServer]);
                toast.success('Servidor adicionado com sucesso!');
                return true;
            } else {
                const err = await res.json();
                toast.error(`Erro ao adicionar: ${err.error || res.statusText}`);
                return false;
            }
        } catch (error) {
            console.error('Erro ao adicionar servidor:', error);
            toast.error('Erro de conexão ao adicionar servidor');
            return false;
        }
    };

    const updateServer = async (id: number, updates: Partial<Servidor>) => {
        if (!token) return false;
        try {
            const res = await fetch(`/api/servers/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });

            if (res.ok) {
                const updated = await res.json();
                setServers(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
                toast.success('Servidor atualizado com sucesso!');
                return true;
            } else {
                toast.error('Erro ao atualizar servidor');
                return false;
            }
        } catch (error) {
            console.error('Erro ao atualizar servidor:', error);
            toast.error('Erro de conexão ao atualizar servidor');
            return false;
        }
    };

    const deleteServer = async (id: number) => {
        if (!token) return false;
        try {
            const res = await fetch(`/api/servers/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setServers(prev => prev.filter(s => s.id !== id));
                toast.success('Servidor removido com sucesso!');
                return true;
            } else {
                toast.error('Erro ao remover servidor');
                return false;
            }
        } catch (error) {
            console.error('Erro ao deletar servidor:', error);
            toast.error('Erro de conexão ao remover servidor');
            return false;
        }
    };

    useEffect(() => {
        fetchServers();
    }, [fetchServers]);

    return { servers, loading, addServer, updateServer, deleteServer, fetchServers };
}
