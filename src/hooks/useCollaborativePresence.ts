import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { agentLogger } from '@/lib/logger.agent';

const logger = agentLogger;

export interface PresenceUser {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  lastSeen: string;
  currentPage?: string;
}

export const useCollaborativePresence = (channel: string = 'presence') => {
  const { user } = useAuth();
  const [activeUsers, setActiveUsers] = useState<PresenceUser[]>([]);

  useEffect(() => {
    if (!user) return;

    const presenceChannel = supabase.channel(channel, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const users: PresenceUser[] = Object.values(state)
          .flat()
          .map((presence: any) => ({
            id: presence.user_id,
            name: presence.name || 'Usuário',
            avatar: presence.avatar,
            role: presence.role || 'client',
            lastSeen: new Date().toISOString(),
            currentPage: presence.currentPage,
          }));

        setActiveUsers(users);
        logger.debug('Presença atualizada', { count: users.length });
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        logger.info('Usuário entrou', { key, presences: newPresences });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        logger.info('Usuário saiu', { key, presences: leftPresences });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: user.id,
            name: user.user_metadata?.full_name || user.email,
            role: 'admin', // Obter do perfil
            currentPage: window.location.pathname,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      presenceChannel.unsubscribe();
    };
  }, [user, channel]);

  return {
    activeUsers,
    totalActive: activeUsers.length,
  };
};

