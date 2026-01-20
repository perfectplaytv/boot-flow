
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Aplicativo {
    id: number;
    nome: string;
    versao: string;
    servidor: string;
    status: 'ativo' | 'inativo' | 'atualizando';
    tipo: string;
    usuarios: number;
    ultimaAtualizacao?: string;
}

export function useApplications() {
    const { token } = useAuth();
    const [applications, setApplications] = useState<Aplicativo[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = useCallback(async () => {
        if (!token) return;

        try {
            const res = await fetch('/api/applications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setApplications(data);
            } else {
                console.error('Erro ao buscar aplicativos:', res.statusText);
            }
        } catch (error) {
            console.error('Erro ao buscar aplicativos:', error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const addApplication = async (app: Omit<Aplicativo, 'id'>) => {
        if (!token) return false;
        try {
            const res = await fetch('/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(app)
            });

            if (res.ok) {
                const newApp = await res.json();
                setApplications(prev => [...prev, newApp]);
                toast.success('Aplicativo adicionado com sucesso!');
                return true;
            } else {
                const err = await res.json();
                toast.error(`Erro ao adicionar: ${err.error || res.statusText}`);
                return false;
            }
        } catch (error) {
            console.error('Erro ao adicionar aplicativo:', error);
            toast.error('Erro de conexão ao adicionar aplicativo');
            return false;
        }
    };

    const updateApplication = async (id: number, updates: Partial<Aplicativo>) => {
        if (!token) return false;
        try {
            const res = await fetch(`/api/applications/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });

            if (res.ok) {
                const updated = await res.json();
                setApplications(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
                toast.success('Aplicativo atualizado com sucesso!');
                return true;
            } else {
                toast.error('Erro ao atualizar aplicativo');
                return false;
            }
        } catch (error) {
            console.error('Erro ao atualizar aplicativo:', error);
            toast.error('Erro de conexão ao atualizar aplicativo');
            return false;
        }
    };

    const deleteApplication = async (id: number) => {
        if (!token) return false;
        try {
            const res = await fetch(`/api/applications/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setApplications(prev => prev.filter(a => a.id !== id));
                toast.success('Aplicativo removido com sucesso!');
                return true;
            } else {
                toast.error('Erro ao remover aplicativo');
                return false;
            }
        } catch (error) {
            console.error('Erro ao deletar aplicativo:', error);
            toast.error('Erro de conexão ao remover aplicativo');
            return false;
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    return { applications, loading, addApplication, updateApplication, deleteApplication, fetchApplications };
}
