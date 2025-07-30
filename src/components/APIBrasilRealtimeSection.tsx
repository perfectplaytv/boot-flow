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
    <div className="bg-[#23272f] border border-green-700 rounded-xl p-6 mb-6 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-6">
        <span className="text-lg font-semibold text-green-400 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>
          Status da Integração
        </span>
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded shadow-md" 
          size="sm"
          onClick={fetchStatusAndQR}
        >
          Testar Conexão
        </Button>
      </div>
      {isConnected ? (
        <div className="flex flex-col items-center gap-4">
          <span className="inline-block px-5 py-2 rounded-full bg-green-500/20 text-green-400 text-base font-bold border border-green-500/40 shadow-lg animate-pulse">
            <svg className="inline w-5 h-5 mr-1 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>
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
        <div className="flex flex-col items-center w-full">
          <div className="mb-4 w-full flex flex-col items-center">
            <span className="inline-block px-5 py-2 rounded-full bg-orange-500/20 text-orange-400 text-base font-bold border border-orange-500/40 shadow-lg animate-pulse mb-2">
              <svg className="inline w-5 h-5 mr-1 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" /></svg>
              Desconectado! Escaneie o QR Code abaixo
            </span>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Escaneie o QR Code no WhatsApp</h3>
              <p className="text-gray-400 text-sm mb-2">Abra o WhatsApp no seu celular {'>'} Menu {'>'} Dispositivos conectados {'>'} Conectar dispositivo</p>
            </div>
          </div>
          {/* QR Code Area */}
          <div className="relative flex justify-center items-center w-full">
            <div className="bg-white p-3 rounded-2xl shadow-2xl border-4 border-green-400 animate-glow relative flex flex-col items-center">
              {qrCodeData && !isLoadingQR ? (
                <img 
                  src={qrCodeData} 
                  alt="QR Code WhatsApp" 
                  className="w-64 h-64 cursor-pointer drop-shadow-lg hover:scale-105 transition-transform"
                  onClick={handleRefreshQR}
                  style={{border: '4px solid #22c55e', boxShadow: '0 0 24px 4px #22c55e55'}}
                />
              ) : (
                <div className="w-64 h-64 bg-gray-100 flex items-center justify-center rounded-2xl border-4 border-dashed border-green-400 animate-pulse">
                  <div className="text-center">
                    <Loader2 className="animate-spin h-10 w-10 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-500 text-base">Gerando QR Code...</p>
                  </div>
                </div>
              )}
              <button 
                onClick={handleRefreshQR}
                className="absolute top-2 right-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition-colors border-2 border-white z-10"
                title="Atualizar QR Code"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
          {/* Instruções e ajuda */}
          <div className="mt-8 w-full flex flex-col items-center">
            <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl justify-center">
              <div className="flex-1 bg-[#1f2937] border-l-4 border-blue-500 p-4 rounded-r-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01" /></svg>
                <span className="text-gray-300 text-sm">QR Code não aparece? Clique no botão de atualizar ou recarregue a página.</span>
              </div>
              <div className="flex-1 bg-[#1f2937] border-l-4 border-blue-500 p-4 rounded-r-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-1.414 1.414A9 9 0 105.636 18.364l1.414-1.414" /></svg>
                <span className="text-gray-300 text-sm">WhatsApp não conecta? Certifique-se de que o app está atualizado e tente novamente.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
