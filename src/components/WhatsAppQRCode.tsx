import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Check, X, Loader2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { generateQRCode, checkConnectionStatus, disconnectWhatsApp } from '@/services/apiBrasilService';

interface WhatsAppQRCodeProps {
  token: string;
  profileId: string;
  onConnectionChange?: (connected: boolean) => void;
  className?: string;
}

export function WhatsAppQRCode({ 
  token, 
  profileId, 
  onConnectionChange,
  className = ''
}: WhatsAppQRCodeProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('Desconectado');

  // Função para verificar o status da conexão
  const checkConnection = useCallback(async () => {
    if (!token || !profileId) return false;
    
    try {
      const { success, data, error } = await checkConnectionStatus(token, profileId);
      
      if (success && data) {
        const connected = data.connected || false;
        setIsConnected(connected);
        setStatus(connected ? 'connected' : 'disconnected');
        setConnectionStatus(connected ? 'Conectado' : 'Desconectado');
        
        if (onConnectionChange) {
          onConnectionChange(connected);
        }
        
        return connected;
      } else {
        throw new Error(error || 'Erro ao verificar conexão');
      }
    } catch (error: any) {
      console.error('Erro ao verificar conexão:', error);
      setStatus('error');
      setConnectionStatus('Erro de conexão');
      setIsConnected(false);
      
      if (onConnectionChange) {
        onConnectionChange(false);
      }
      
      return false;
    }
  }, [token, profileId, onConnectionChange]);

  // Função para gerar um novo QR Code
  const generateNewQRCode = useCallback(async () => {
    if (!token || !profileId) {
      toast.error('Token ou Profile ID não configurados');
      return;
    }

    setIsLoading(true);
    setStatus('connecting');
    setConnectionStatus('Gerando QR Code...');
    setQrCode(null);
    setCountdown(null);

    try {
      const { success, data, error } = await generateQRCode(token, profileId, 'temporary');
      
      if (success && data) {
        setQrCode(data.qrCode);
        setConnectionStatus('Aguardando leitura do QR Code...');
        
        // Configurar contagem regressiva para verificar a conexão
        const timeout = data.timeout || 30000;
        setCountdown(Math.ceil(timeout / 1000));
        
        // Iniciar a verificação de conexão após o timeout
        setTimeout(() => {
          checkConnection();
        }, timeout);
        
        return data.qrCode;
      } else {
        throw new Error(error || 'Falha ao gerar QR Code');
      }
    } catch (error: any) {
      console.error('Erro ao gerar QR Code:', error);
      setStatus('error');
      setConnectionStatus('Erro ao gerar QR Code');
      toast.error(error.message || 'Erro ao gerar QR Code');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [token, profileId, checkConnection]);

  // Função para desconectar o WhatsApp
  const handleDisconnect = async () => {
    if (!token || !profileId) return;
    
    setIsLoading(true);
    
    try {
      const { success, error } = await disconnectWhatsApp(token, profileId);
      
      if (success) {
        setIsConnected(false);
        setStatus('disconnected');
        setConnectionStatus('Desconectado');
        setQrCode(null);
        toast.success('WhatsApp desconectado com sucesso');
        
        if (onConnectionChange) {
          onConnectionChange(false);
        }
      } else {
        throw new Error(error || 'Falha ao desconectar');
      }
    } catch (error: any) {
      console.error('Erro ao desconectar WhatsApp:', error);
      toast.error(error.message || 'Erro ao desconectar WhatsApp');
    } finally {
      setIsLoading(false);
    }
  };

  // Efeito para o contador
  useEffect(() => {
    if (countdown === null || countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // Verificar a conexão ao montar o componente
  useEffect(() => {
    if (token && profileId) {
      checkConnection();
    }
  }, [token, profileId, checkConnection]);

  // Verificar conexão periodicamente quando desconectado
  useEffect(() => {
    if (isConnected || !token || !profileId) return;

    const interval = setInterval(() => {
      checkConnection();
    }, 30000); // Verificar a cada 30 segundos

    return () => clearInterval(interval);
  }, [isConnected, token, profileId, checkConnection]);

  return (
    <div className={`bg-[#23272f] border border-gray-700 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">Conexão WhatsApp</h3>
        <div className="flex items-center gap-2">
          <div 
            className={`w-3 h-3 rounded-full ${
              status === 'connected' ? 'bg-green-500' : 
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
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
            <p className="text-orange-400 text-sm">
              {connectionStatus || 'Escaneie o QR Code abaixo para conectar sua conta do WhatsApp.'}
            </p>
          </div>

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
              
              {status === 'connecting' && countdown !== null && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                  <span className="text-white font-bold text-lg">{countdown}s</span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-3">
              <button
                onClick={generateNewQRCode}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    {qrCode ? 'Atualizar QR Code' : 'Gerar QR Code'}
                  </>
                )}
              </button>
              
              <p className="text-xs text-gray-400 text-center">
                Abra o WhatsApp no seu celular, toque em <strong>Menu</strong> ou <strong>Configurações</strong> e selecione <strong>Dispositivos conectados</strong>.
              </p>
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
