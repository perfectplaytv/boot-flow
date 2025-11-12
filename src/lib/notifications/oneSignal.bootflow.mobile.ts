import { agentLogger } from '@/lib/logger.agent';

const logger = agentLogger;

declare global {
  interface Window {
    OneSignal?: any;
  }
}

export interface OneSignalConfig {
  appId: string;
  safariWebId?: string;
  notifyButton?: {
    enable: boolean;
  };
}

export class OneSignalService {
  private initialized = false;
  private config: OneSignalConfig | null = null;

  async initialize(config: OneSignalConfig): Promise<boolean> {
    if (this.initialized) {
      logger.warn('OneSignal já inicializado');
      return true;
    }

    try {
      if (typeof window === 'undefined' || !window.OneSignal) {
        logger.warn('OneSignal SDK não carregado');
        return false;
      }

      await window.OneSignal.init({
        appId: config.appId,
        safari_web_id: config.safariWebId,
        notifyButton: config.notifyButton,
        allowLocalhostAsSecureOrigin: true,
      });

      this.config = config;
      this.initialized = true;
      logger.info('OneSignal inicializado', { appId: config.appId });
      return true;
    } catch (error) {
      logger.error('Erro ao inicializar OneSignal', { error: (error as Error).message });
      return false;
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.initialized || !window.OneSignal) {
      return Notification.permission;
    }

    try {
      const permission = await window.OneSignal.Notifications.requestPermission();
      logger.info('Permissão de notificação', { permission });
      return permission;
    } catch (error) {
      logger.error('Erro ao solicitar permissão', { error: (error as Error).message });
      return Notification.permission;
    }
  }

  async getUserId(): Promise<string | null> {
    if (!this.initialized || !window.OneSignal) {
      return null;
    }

    try {
      const userId = await window.OneSignal.User.PushSubscription.id;
      return userId || null;
    } catch (error) {
      logger.error('Erro ao obter User ID', { error: (error as Error).message });
      return null;
    }
  }

  async registerDevice(userId: string, oneSignalId: string): Promise<boolean> {
    // Registrar device no Supabase
    try {
      const { supabase } = await import('@/lib/supabase');
      const { error } = await supabase.from('devices').upsert({
        user_id: userId,
        one_signal_id: oneSignalId,
        platform: navigator.platform,
        user_agent: navigator.userAgent,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      logger.info('Device registrado', { userId, oneSignalId });
      return true;
    } catch (error) {
      logger.error('Erro ao registrar device', { error: (error as Error).message });
      return false;
    }
  }
}

export const oneSignalService = new OneSignalService();

