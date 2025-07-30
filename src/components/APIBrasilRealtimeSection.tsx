import React, { useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { generateQRCode, checkConnectionStatus } from '@/services/apiBrasilService';

interface APIBrasilRealtimeSectionProps {
  apiToken: string;
  profileId: string;
  isConnected: boolean;
  setIsConnected: (v: boolean) => void;
  setConnectionStatus: (v: string) => void;
  setQrCodeData: (v: string | null) => void;
  qrCodeData: string | null;
  isLoadingQR: boolean;
  setIsLoadingQR: (v: boolean) => void;
}

export const APIBrasilRealtimeSection: React.FC<APIBrasilRealtimeSectionProps> = ({
  apiToken,
  profileId,
  isConnected,
  setIsConnected,
  setConnectionStatus,
  setQrCodeData,
  qrCodeData,
  isLoadingQR,
  setIsLoadingQR,
}) => {
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Função para buscar status e QR Code
  const fetchStatusAndQR = useCallback(async () => {
    if (!apiToken || !profileId) return;
    try {
      const statusRes = await checkConnectionStatus(apiToken, profileId);
      if (statusRes.success && statusRes.data.connected) {
        setIsConnected(true);
        setConnectionStatus('connected');
        setQrCodeData(null);
        return;
      } else {
        setIsConnected(false);
        setConnectionStatus('disconnected');
      }
      setIsLoadingQR(true);
      const qrRes = await generateQRCode(apiToken, profileId, 'temporary');
      if (qrRes.success && qrRes.data.qrCode) {
        setQrCodeData(qrRes.data.qrCode);
      } else {
        setQrCodeData(null);
        toast.error('Erro ao gerar QR Code');
      }
    } catch (err: any) {
      setQrCodeData(null);
      toast.error('Erro ao buscar status/QR Code: ' + (err?.message || ''));
    } finally {
      setIsLoadingQR(false);
    }
  }, [apiToken, profileId, setIsConnected, setConnectionStatus, setQrCodeData, setIsLoadingQR]);

  // Polling enquanto desconectado
  useEffect(() => {
    if (!apiToken || !profileId) return;
    if (!isConnected) {
      fetchStatusAndQR();
      pollingRef.current = setInterval(fetchStatusAndQR, 5000);
    } else {
      setQrCodeData(null);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [apiToken, profileId, isConnected, fetchStatusAndQR, setQrCodeData]);

  // Handler para recarregar QR Code manualmente
  const handleRefreshQR = async () => {
    setQrCodeData(null);
    setIsLoadingQR(true);
    try {
      const qrRes = await generateQRCode(apiToken, profileId, 'temporary');
      if (qrRes.success && qrRes.data.qrCode) {
        setQrCodeData(qrRes.data.qrCode);
      } else {
        setQrCodeData(null);
        toast.error('Erro ao gerar QR Code');
      }
    } catch (err: any) {
      setQrCodeData(null);
      toast.error('Erro ao gerar QR Code: ' + (err?.message || ''));
    } finally {
      setIsLoadingQR(false);
    }
  };

  return (
    <div className="bg-[#23272f] border border-gray-700 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-300 font-medium">Status da Integração</span>
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded" 
          size="sm"
          onClick={fetchStatusAndQR}
        >
          Testar Conexão
        </Button>
      </div>
      {isConnected ? (
        <div className="space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold border border-green-500/30">
            Conectado
          </span>
          <div className="flex gap-2">
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs" 
              size="sm"
              onClick={() => {
                setIsConnected(false);
                setConnectionStatus('disconnected');
                toast.info('WhatsApp desconectado');
              }}
            >
              Desconectar
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs" 
              size="sm"
              onClick={fetchStatusAndQR}
            >
              Verificar Status
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
            <p className="text-orange-400 text-sm font-medium mb-1">
              Desconectado! Seu WhatsApp não está conectado no momento
            </p>
            <p className="text-orange-300 text-xs">
              Clique na imagem abaixo para recarregar o QR Code.
            </p>
          </div>
          {/* QR Code Area */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                {qrCodeData && !isLoadingQR ? (
                  <img 
                    src={qrCodeData} 
                    alt="QR Code WhatsApp" 
                    className="w-48 h-48 cursor-pointer"
                    onClick={handleRefreshQR}
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded">
                    <div className="text-center">
                      <Loader2 className="animate-spin h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-gray-500 text-xs">Gerando QR Code...</p>
                    </div>
                  </div>
                )}
                <button 
                  onClick={handleRefreshQR}
                  className="absolute -bottom-2 -right-2 bg-gray-800 text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/* Help Section */}
          <div className="mt-4">
            <h4 className="text-gray-300 font-medium mb-3">Ajuda:</h4>
            <div className="space-y-2">
              <div className="bg-[#1f2937] border-l-4 border-blue-500 p-3 rounded-r-lg cursor-pointer hover:bg-[#374151] transition-colors">
                <p className="text-gray-300 text-sm">QR Code não aparece.</p>
              </div>
              <div className="bg-[#1f2937] border-l-4 border-blue-500 p-3 rounded-r-lg cursor-pointer hover:bg-[#374151] transition-colors">
                <p className="text-gray-300 text-sm">WhatsApp não conecta</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
