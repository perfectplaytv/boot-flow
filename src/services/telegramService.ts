import { agentLogger } from '@/lib/logger.agent';

const logger = agentLogger;

export interface TelegramConfig {
  botToken?: string;
  chatId?: string;
}

export interface TelegramMessage {
  text: string;
  parseMode?: 'HTML' | 'Markdown';
  disableNotification?: boolean;
}

class TelegramService {
  private botToken: string | null = null;
  private chatId: string | null = null;
  private enabled: boolean = false;

  constructor() {
    this.botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || null;
    this.chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID || null;
    this.enabled = !!(this.botToken && this.chatId);

    if (!this.enabled) {
      logger.info('Telegram service desabilitado (credenciais não configuradas)');
    }
  }

  async sendMessage(message: TelegramMessage): Promise<boolean> {
    if (!this.enabled || !this.botToken || !this.chatId) {
      logger.debug('Telegram não configurado, mensagem não enviada');
      return false;
    }

    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message.text,
          parse_mode: message.parseMode,
          disable_notification: message.disableNotification || false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Telegram API error: ${response.statusText}`);
      }

      logger.info('Mensagem Telegram enviada', { chatId: this.chatId });
      return true;
    } catch (error) {
      logger.error('Erro ao enviar mensagem Telegram', { error: (error as Error).message });
      return false;
    }
  }

  async sendAlert(title: string, message: string, severity: 'info' | 'warning' | 'error' = 'info'): Promise<boolean> {
    const emoji = severity === 'error' ? '🚨' : severity === 'warning' ? '⚠️' : 'ℹ️';
    const formatted = `${emoji} <b>${title}</b>\n\n${message}`;
    return this.sendMessage({ text: formatted, parseMode: 'HTML' });
  }
}

export const telegramService = new TelegramService();

