import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, RefreshCw } from 'lucide-react';
import { generateQRCode, checkConnectionStatus } from '@/services/apiBrasilService';

interface APIBrasilRealtimeSectionProps {
  apiToken: string;
  profileId: string;
  isConnected: boolean;
  setIsConnected: (v: boolean) => void;
  setConnectionStatus: (status: 'connected' | 'disconnected' | 'connecting') => void;
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
  const [error, setError] = useState<string | null>(null);

  // Função para buscar status e QR Code
  const fetchStatusAndQR = useCallback(async () => {
    console.log('[APIBrasilRealtimeSection] Iniciando fetchStatusAndQR');
    console.log('[APIBrasilRealtimeSection] Estado atual:', { 
      apiToken: apiToken ? '***' + apiToken.slice(-4) : 'não definido',
      profileId: profileId || 'não definido',
      isConnected,
      isLoadingQR
    });

    if (!apiToken || !profileId) {
      const errorMsg = 'Token ou Profile ID não fornecidos';
      console.error('[APIBrasilRealtimeSection]', errorMsg);
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    
    try {
      console.log('[APIBrasilRealtimeSection] Verificando status da conexão...');
      const statusRes = await checkConnectionStatus(apiToken, profileId);
      console.log('[APIBrasilRealtimeSection] Resposta do status:', statusRes);
      
      if (statusRes.success && statusRes.data?.connected) {
        console.log('[APIBrasilRealtimeSection] Dispositivo conectado com sucesso');
        setIsConnected(true);
        setConnectionStatus('connected');
        setQrCodeData(null);
        setError(null);
        return;
      } else if (!statusRes.success) {
        console.warn('[APIBrasilRealtimeSection] Erro ao verificar status:', statusRes.error);
      }
      
      console.log('[APIBrasilRealtimeSection] Dispositivo não conectado, gerando QR Code...');
      setIsLoadingQR(true);
      setError(null);
      
      try {
        const qrRes = await generateQRCode(apiToken, profileId, 'temporary');
        console.log('[APIBrasilRealtimeSection] Resposta do QR Code:', { 
          success: qrRes.success,
          hasQRCode: !!(qrRes.data?.qrCode),
          error: qrRes.error
        });
        
        if (qrRes.success && qrRes.data?.qrCode) {
          console.log('[APIBrasilRealtimeSection] QR Code gerado com sucesso');
          setQrCodeData(qrRes.data.qrCode);
          setError(null);
        } else {
          const errorMsg = qrRes.error || 'Erro desconhecido ao gerar QR Code';
          console.error('[APIBrasilRealtimeSection] Erro ao gerar QR Code:', errorMsg);
          setQrCodeData(null);
          setError(errorMsg);
          toast.error('Erro ao gerar QR Code: ' + errorMsg);
        }
      } catch (qrError: any) {
        const errorMsg = qrError?.message || 'Erro ao gerar QR Code';
        console.error('[APIBrasilRealtimeSection] Exceção ao gerar QR Code:', qrError);
        setQrCodeData(null);
        setError(errorMsg);
        toast.error('Erro ao gerar QR Code: ' + errorMsg);
        throw qrError; // Re-throw para ser capturado pelo bloco catch externo
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Erro desconhecido ao verificar status/QR Code';
      console.error('[APIBrasilRealtimeSection] Erro no fetchStatusAndQR:', { 
        error: err,
        message: errorMsg 
      });
      
      setQrCodeData(null);
      setError(errorMsg);
      
      // Mostrar toast apenas se não for um erro de polling
      if (!errorMsg.includes('cancelado') && !errorMsg.includes('timeout')) {
        toast.error('Erro ao verificar status/QR Code: ' + errorMsg);
      }
    } finally {
      setIsLoadingQR(false);
    }
  }, [apiToken, profileId, isConnected, setIsConnected, setConnectionStatus, setQrCodeData, setIsLoadingQR]);

  // Polling enquanto desconectado
  useEffect(() => {
    if (!apiToken || !profileId) {
      console.log('API Token ou Profile ID ausentes');
      return;
    }
    
    if (!isConnected) {
      console.log('Iniciando polling para verificar status...');
      fetchStatusAndQR();
      pollingRef.current = setInterval(fetchStatusAndQR, 15000); // Aumentei para 15 segundos
    } else {
      console.log('Dispositivo conectado, parando polling');
      setQrCodeData(null);
    }
    
    return () => {
      if (pollingRef.current) {
        console.log('Limpando intervalo de polling');
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [apiToken, profileId, isConnected, fetchStatusAndQR, setQrCodeData]);

  // Handler para recarregar QR Code manualmente
  const handleRefreshQR = async () => {
    console.log('[APIBrasilRealtimeSection] Recarregando QR Code manualmente...');
    setQrCodeData(null);
    setError(null);
    setIsLoadingQR(true);
    
    try {
      console.log('[APIBrasilRealtimeSection] Gerando novo QR Code...');
      const qrRes = await generateQRCode(apiToken, profileId, 'temporary');
      console.log('[APIBrasilRealtimeSection] Resposta do QR Code (recarregado):', { 
        success: qrRes.success,
        hasQRCode: !!(qrRes.data?.qrCode),
        error: qrRes.error
      });
      
      if (qrRes.success && qrRes.data?.qrCode) {
        console.log('[APIBrasilRealtimeSection] Novo QR Code gerado com sucesso');
        setQrCodeData(qrRes.data.qrCode);
        setError(null);
        toast.success('QR Code atualizado com sucesso');
      } else {
        const errorMsg = qrRes.error || 'Erro desconhecido ao gerar QR Code';
        console.error('[APIBrasilRealtimeSection] Erro ao recarregar QR Code:', errorMsg);
        setQrCodeData(null);
        setError(errorMsg);
        toast.error('Erro ao gerar QR Code: ' + errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Erro desconhecido ao recarregar QR Code';
      console.error('[APIBrasilRealtimeSection] Exceção ao recarregar QR Code:', { 
        error: err,
        message: errorMsg 
      });
      
      setQrCodeData(null);
      setError(errorMsg);
      toast.error('Erro ao recarregar QR Code: ' + errorMsg);
    } finally {
      setIsLoadingQR(false);
    }
  };

  return (
    <div className="bg-[#23272f] border border-green-700 rounded-xl p-6 mb-6 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-6">
        <span className="text-lg font-semibold text-green-400 flex items-center gap-2">
          {isConnected ? (
            <>
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Conectado ao WhatsApp
            </>
          ) : (
            <>
              <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Desconectado
            </>
          )}
          WhatsApp Business
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshQR}
          disabled={isLoadingQR}
          className="flex items-center gap-2"
        >
          {isLoadingQR ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Recarregar QR
            </>
          )}
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
              {!isConnected && (
                <div className="w-full text-center">
                  {isLoadingQR ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
                      <p className="text-gray-300">Gerando QR Code...</p>
                    </div>
                  ) : qrCodeData ? (
                    <div className="flex flex-col items-center">
                      <img 
                        src={qrCodeData} 
                        alt="QR Code para conexão do WhatsApp" 
                        className="rounded-lg border border-gray-600 max-w-xs w-full"
                      />
                      <p className="mt-4 text-sm text-gray-300">
                        Escaneie este QR Code com o WhatsApp para conectar
                      </p>
                      {error && (
                        <p className="mt-2 text-sm text-red-400">
                          Erro: {error}
                        </p>
                      )}
                    </div>
                  ) : error ? (
                    <div className="text-center py-4">
                      <p className="text-red-400 mb-2">Erro: {error}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleRefreshQR}
                        className="mt-2"
                      >
                        Tentar novamente
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-300">Clique em "Recarregar QR" para gerar um novo código</p>
                    </div>
                  )}
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
