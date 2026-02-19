import { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCw, Check, X, Loader2, MessageSquare, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import WhatsAppSocketService from '@/services/whatsappSocketService';

interface WhatsAppConnectionProps {
  bearerToken: string;
  channelName: string;
  onConnectionChange?: (connected: boolean) => void;
  className?: string;
}

export function WhatsAppConnection({
  bearerToken,
  channelName,
  onConnectionChange,
  className = '',
}: WhatsAppConnectionProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const socketService = useRef<WhatsAppSocketService | null>(null);

  // Inicializa o serviço de socket
  useEffect(() => {
    if (!bearerToken || !channelName) return;

    const options = {
      onQrCode: (qr: string) => {
        setQrCode(qr);
        setStatus('connecting');
        setError(null);
      },
      onConnected: () => {
        setIsConnected(true);
        setStatus('connected');
        setQrCode(null);
        setError(null);
        toast.success('Conectado ao WhatsApp com sucesso!');
        if (onConnectionChange) onConnectionChange(true);
      },
      onDisconnected: () => {
        setIsConnected(false);
        setStatus('disconnected');
        if (onConnectionChange) onConnectionChange(false);
      },
      onError: (errorMsg: string) => {
        setError(errorMsg);
        setStatus('error');
        toast.error(`Erro: ${errorMsg}`);
      },
      onMessage: (message: unknown) => {
        console.log('Nova mensagem recebida:', message);
        // Aqui você pode lidar com mensagens recebidas
      },
    };

    socketService.current = new WhatsAppSocketService(options);
    return () => {
      if (socketService.current) {
        socketService.current.disconnect();
      }
    };
  }, [bearerToken, channelName, onConnectionChange]);

  // Conecta/desconecta quando o status muda
  useEffect(() => {
    if (status === 'connecting' && socketService.current) {
      socketService.current.connect(bearerToken, channelName);
    }
  }, [status, bearerToken, channelName]);

  const handleConnect = useCallback(() => {
    if (!bearerToken || !channelName) {
      toast.error('Token ou Channel Name não configurados');
      return;
    }

    setIsLoading(true);
    setStatus('connecting');
    setError(null);

    if (socketService.current) {
      socketService.current.connect(bearerToken, channelName);
    }
  }, [bearerToken, channelName]);

  const handleDisconnect = useCallback(() => {
    if (socketService.current) {
      socketService.current.disconnect();
      setIsConnected(false);
      setStatus('disconnected');
      setQrCode(null);
      if (onConnectionChange) onConnectionChange(false);
      toast.info('Desconectado do WhatsApp');
    }
  }, [onConnectionChange]);

  // Efeito para reconexão automática
  useEffect(() => {
    if (status === 'connected' && socketService.current?.isConnected()) {
      const interval = setInterval(() => {
        // Verifica periodicamente se ainda está conectado
        if (!socketService.current?.isConnected()) {
          setStatus('disconnected');
          setIsConnected(false);
          if (onConnectionChange) onConnectionChange(false);
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [status, onConnectionChange]);

  return (
    <div className={`bg-green-600 border border-gray-700 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">Conexão WhatsApp</h3>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${status === 'connected' ? 'bg-green-500' :
              status === 'connecting' ? 'bg-yellow-500' :
                status === 'error' ? 'bg-red-500' : 'bg-gray-500'
              }`}
          />
          <span className="text-sm text-gray-300">
            {status === 'connected' ? 'Conectado' :
              status === 'connecting' ? 'Conectando...' :
                status === 'error' ? 'Erro' : 'Desconectado'}
          </span>
        </div>
      </div>

      {!isConnected ? (
        <div className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {status === 'connecting' && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-400 text-sm">
                {qrCode ? 'Escaneie o QR Code abaixo com o WhatsApp (MODO LOCAL)' : 'Conectando ao servidor Local...'}
              </p>
            </div>
          )}

          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              {qrCode ? (
                <img
                  src={qrCode}
                  alt="QR Code WhatsApp"
                  className="w-48 h-48 bg-white p-2 rounded"
                />
              ) : (
                <div className="w-48 h-48 bg-gray-200 rounded flex items-center justify-center">
                  {isLoading ? (
                    <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                  ) : (
                    <MessageSquare className="h-8 w-8 text-gray-400" />
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-3">
              <button
                onClick={handleConnect}
                disabled={isLoading || status === 'connecting'}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading || status === 'connecting' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Conectar WhatsApp
                  </>
                )}
              </button>

              {status === 'connecting' && qrCode && (
                <p className="text-xs text-gray-400 text-center">
                  Abra o WhatsApp no seu celular, toque em <strong>Menu</strong> ou <strong>Configurações</strong> e selecione <strong>Dispositivos conectados</strong>.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-green-400 font-medium">WhatsApp conectado com sucesso!</p>
                <p className="text-green-300 text-sm mt-1">
                  Você já pode enviar e receber mensagens através da plataforma.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleDisconnect}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
              Desconectar WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WhatsAppConnection;
