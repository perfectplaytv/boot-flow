import { io, Socket } from 'socket.io-client';

interface WhatsAppSocketOptions {
  onQrCode: (qrCode: string) => void;
  onConnected: () => void;
  onDisconnected: () => void;
  onError: (error: string) => void;
  onMessage: (message: any) => void;
}

class WhatsAppSocketService {
  private socket: Socket | null = null;
  private options: WhatsAppSocketOptions;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;

  constructor(options: WhatsAppSocketOptions) {
    this.options = options;
  }

  connect(bearerToken: string, channelName: string) {
    if (this.isConnecting || this.socket?.connected) return;

    this.isConnecting = true;
    this.reconnectAttempts = 0;

    try {
      // Encerra a conexão existente, se houver
      this.disconnect();

      // Cria uma nova conexão com o servidor de socket
      this.socket = io('https://socket.apibrasil.com.br', {
        query: {
          bearer: bearerToken,
          channelName: channelName,
        },
        reconnection: true,
        reconnectionAttempts: this.MAX_RECONNECT_ATTEMPTS,
        reconnectionDelay: 3000,
        timeout: 20000,
      });

      // Configura os manipuladores de eventos
      this.setupEventListeners();

    } catch (error) {
      console.error('Erro ao conectar ao WebSocket:', error);
      this.options.onError('Erro ao conectar ao servidor de mensagens');
      this.isConnecting = false;
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Conectado ao servidor de WebSocket');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.options.onConnected();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Desconectado do servidor de WebSocket:', reason);
      this.isConnecting = false;
      this.options.onDisconnected();

      if (reason === 'io server disconnect') {
        // Reconexão será tratada automaticamente pelo socket.io
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Erro na conexão WebSocket:', error);
      this.isConnecting = false;
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
        this.options.onError('Não foi possível conectar ao servidor de mensagens após várias tentativas');
      } else {
        this.options.onError(`Tentando reconectar... (${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS})`);
      }
    });

    // Evento para receber o QR Code
    this.socket.on('qr', (data: { qr: string }) => {
      if (data?.qr) {
        this.options.onQrCode(data.qr);
      }
    });

    // Evento para status de conexão
    this.socket.on('connection-state', (state: { status: string }) => {
      if (state?.status === 'open') {
        this.options.onConnected();
      } else if (state?.status === 'close') {
        this.options.onDisconnected();
      }
    });

    // Evento para mensagens recebidas
    this.socket.on('message', (message: any) => {
      this.options.onMessage(message);
    });

    // Evento genérico para evolução do estado
    this.socket.on('evolution', (evolution: any) => {
      console.log('Evento de evolução:', evolution);
      
      if (evolution.qr) {
        this.options.onQrCode(evolution.qr);
      }
      
      if (evolution.status === 'connected') {
        this.options.onConnected();
      } else if (evolution.status === 'disconnected') {
        this.options.onDisconnected();
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  sendMessage(data: any) {
    if (this.socket?.connected) {
      this.socket.emit('send-message', data);
      return true;
    }
    return false;
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export default WhatsAppSocketService;
