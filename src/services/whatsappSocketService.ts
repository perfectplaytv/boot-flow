import { toast } from 'sonner';
import * as evolution from './evolutionService';

interface WhatsAppSocketOptions {
  onQrCode: (qrCode: string) => void;
  onConnected: () => void;
  onDisconnected: () => void;
  onError: (error: string) => void;
  onMessage: (message: unknown) => void;
}

class WhatsAppSocketService {
  private options: WhatsAppSocketOptions;
  private isConnecting = false;
  private pollingInterval: ReturnType<typeof setInterval> | null = null;
  private isConnectedState = false;
  private currentInstanceName: string = '';

  constructor(options: WhatsAppSocketOptions) {
    this.options = options;
  }

  connect(bearerToken: string, channelName: string) {
    // Usamos o channelName (ou ProfileID) como nome da instância
    // O bearerToken é ignorado pois usamos a API Key global
    const instanceName = channelName || 'BootFlow';
    this.currentInstanceName = instanceName;

    if (this.isConnecting) return;
    this.isConnecting = true;
    this.isConnectedState = false;

    console.log(`Iniciando conexão simulada (Polling) para instância: ${instanceName}`);

    // Inicia o ciclo de polling
    this.startPolling();
  }

  private startPolling() {
    // Limpa anterior se existir
    this.stopPolling();

    // Função de polling
    const poll = async () => {
      try {
        if (!this.currentInstanceName) return;

        // 1. Verifica status de conexão
        const statusRes = await evolution.getConnectStatus(this.currentInstanceName);

        if (statusRes.success && statusRes.data?.connected) {
          if (!this.isConnectedState) {
            this.isConnectedState = true;
            this.options.onConnected();
            toast.success('WhatsApp Conectado!');
          }
        } else {
          // Se não conectado, tenta pegar o QR Code
          if (this.isConnectedState) {
            this.isConnectedState = false;
            this.options.onDisconnected();
          }

          const qrRes = await evolution.fetchQRCode(this.currentInstanceName);
          if (qrRes.success && qrRes.data?.qrCode) {
            this.options.onQrCode(qrRes.data.qrCode);
          } else if (qrRes.error === 'Instância já conectada') {
            // Caso de borda: API diz que tá conectado mas status check falhou antes?
            // Vamos assumir conectado no próximo ciclo ou forçar aqui
          }
        }
      } catch (error) {
        console.error('Erro no polling do WhatsApp:', error);
        // Não chamamos onError sempre para não floodar a UI, apenas logamos
      }
    };

    // Executa imediatamente
    poll();

    // Define intervalo de 3 segundos
    this.pollingInterval = setInterval(poll, 3000);
  }

  private stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  disconnect() {
    this.stopPolling();
    this.isConnecting = false;
    this.isConnectedState = false;

    // Tenta logout na API também? Talvez opcional.
    // evolution.logoutInstance(this.currentInstanceName); 

    this.options.onDisconnected();
  }

  sendMessage(data: unknown) {
    // Implementar envio se necessário, ou usar o apiBrasilService
    console.log('sendMessage via socket service chamado (mock):', data);
    return true;
  }

  isConnected() {
    return this.isConnectedState;
  }
}

export default WhatsAppSocketService;
