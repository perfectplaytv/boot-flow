import { supabase } from '@/lib/supabase';
import { agentLogger } from '@/lib/logger.agent';

export interface SupabaseNotification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string;
  data?: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

export class SupabaseNotificationService {
  private channels: Map<string, any> = new Map();

  subscribe(userId: string, onNotification: (notification: SupabaseNotification) => void) {
    const channelName = `notifications:${userId}`;
    
    if (this.channels.has(channelName)) {
      agentLogger.warn('Já inscrito no canal', { channelName });
      return;
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const notification = payload.new as SupabaseNotification;
          onNotification(notification);
          this.showBrowserNotification(notification);
        },
      )
      .subscribe();

    this.channels.set(channelName, channel);
    agentLogger.info('Inscrito em notificações Supabase', { userId });
  }

  unsubscribe(userId: string) {
    const channelName = `notifications:${userId}`;
    const channel = this.channels.get(channelName);
    
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
      agentLogger.info('Desinscrito de notificações', { userId });
    }
  }

  private async showBrowserNotification(notification: SupabaseNotification) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    try {
      await new Notification(notification.title, {
        body: notification.body,
        icon: '/icons/bootflow-192-maskable.png',
        badge: '/icons/bootflow-192-maskable.png',
        tag: notification.id,
        data: notification.data,
      });
    } catch (error) {
      agentLogger.error('Erro ao exibir notificação do navegador', { error: (error as Error).message });
    }
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      agentLogger.error('Erro ao marcar notificação como lida', { error: (error as Error).message });
      return false;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      agentLogger.error('Erro ao obter contagem de não lidas', { error: (error as Error).message });
      return 0;
    }
  }
}

// Lazy initialization para evitar problemas de inicialização
let _supabaseNotificationService: SupabaseNotificationService | null = null;

export const getSupabaseNotificationService = (): SupabaseNotificationService => {
  if (!_supabaseNotificationService) {
    _supabaseNotificationService = new SupabaseNotificationService();
  }
  return _supabaseNotificationService;
};

export const supabaseNotificationService = new Proxy({} as SupabaseNotificationService, {
  get(_target, prop) {
    return getSupabaseNotificationService()[prop as keyof SupabaseNotificationService];
  }
});

