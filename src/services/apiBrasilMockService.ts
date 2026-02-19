/**
 * Serviço Mock da API Brasil para Testes
 * 
 * Este serviço simula a API Brasil para permitir testes locais
 * sem precisar de credenciais reais.
 */

import { toast } from 'sonner';
import type { QRCodeResponse, ConnectionStatusResponse } from './apiBrasilService';

// Credenciais de teste (fictícias)
export const MOCK_CREDENTIALS = {
  BEARER_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBUEkgQnJhc2lsIC0gTW9jayIsInVzZXJJZCI6InRlc3QtdXNlci0xMjM0NTYiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6OTk5OTk5OTk5OX0.MOCK_TOKEN_FOR_TESTING_ONLY',
  PROFILE_ID: 'profile-test-123456',
  PHONE_NUMBER: '+5511999999999',
  DEVICE_TOKEN: 'mock-device-token-12345',
  DEVICE_PASSWORD: 'mock-password-123'
};

// Estado simulado da conexão
let mockConnectionStatus = {
  connected: false,
  status: 'disconnected',
  phoneNumber: '',
  profileName: 'WhatsApp Test',
  lastSeen: null as string | null
};

// Simular delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Verifica se deve usar o modo mock
 */
export function shouldUseMock(token?: string): boolean {
  // Verifica o token passado diretamente (prioridade)
  if (token) {
    if (token === MOCK_CREDENTIALS.BEARER_TOKEN ||
      token.includes('MOCK_TOKEN_FOR_TESTING') ||
      (token.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9') && token.includes('MOCK'))) {
      return true;
    }
  }

  // Verifica variável de ambiente ou localStorage
  const envMock = import.meta.env.VITE_USE_API_MOCK === 'true';
  const storageMock = localStorage.getItem('useApiBrasilMock') === 'true';

  // Ativa automaticamente se estiver usando credenciais de teste
  if (typeof window !== 'undefined') {
    try {
      // Verifica no localStorage como JSON (formato usado em AdminWhatsApp)
      const configStr = localStorage.getItem('apiBrasilConfig');
      if (configStr) {
        const config = JSON.parse(configStr);
        const bearerToken = config.bearerToken || '';
        const profileId = config.profileId || '';

        // Se as credenciais forem as de teste, ativa o mock automaticamente
        if (bearerToken === MOCK_CREDENTIALS.BEARER_TOKEN ||
          profileId === MOCK_CREDENTIALS.PROFILE_ID ||
          bearerToken.includes('MOCK_TOKEN_FOR_TESTING')) {
          localStorage.setItem('useApiBrasilMock', 'true');
          return true;
        }
      }

      // Também verifica chaves individuais (fallback)
      const bearerToken = localStorage.getItem('apiBrasil_bearerToken') || '';
      const profileId = localStorage.getItem('apiBrasil_profileId') || '';

      if (bearerToken === MOCK_CREDENTIALS.BEARER_TOKEN ||
        profileId === MOCK_CREDENTIALS.PROFILE_ID ||
        bearerToken.includes('MOCK_TOKEN_FOR_TESTING')) {
        localStorage.setItem('useApiBrasilMock', 'true');
        return true;
      }
    } catch (e) {
      // Ignora erros de parsing
    }
  }

  return envMock || storageMock;
}

/**
 * Mock: Verifica o status da conexão
 */
export async function mockCheckConnectionStatus(
  token: string,
  profileId: string
): Promise<{ success: boolean; data?: ConnectionStatusResponse; error?: string }> {
  await delay(500); // Simula delay de rede

  // Validação básica
  if (!token || !profileId) {
    return {
      success: false,
      error: 'Token e Profile ID são obrigatórios'
    };
  }

  // Simula conexão baseada em token de teste
  const isTestToken = token === MOCK_CREDENTIALS.BEARER_TOKEN || token.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');

  if (isTestToken) {
    // Simula conexão conectada após alguns segundos
    const shouldBeConnected = mockConnectionStatus.connected;

    return {
      success: true,
      data: {
        connected: shouldBeConnected,
        status: shouldBeConnected ? 'connected' : 'disconnected',
        phoneNumber: shouldBeConnected ? MOCK_CREDENTIALS.PHONE_NUMBER : '',
        profileName: 'WhatsApp Test Mock',
        lastSeen: shouldBeConnected ? new Date().toISOString() : undefined
      }
    };
  }

  return {
    success: false,
    error: 'Token inválido. Use as credenciais de teste.'
  };
}

/**
 * Mock: Gera QR Code
 * Gera um QR Code válido em base64 para testes
 */
// Timeout para auto-conexão
let autoConnectTimeout: ReturnType<typeof setTimeout> | null = null;

export async function mockGenerateQRCode(): Promise<{ success: boolean; data?: QRCodeResponse; error?: string }> {
  await delay(1000); // Simula delay de geração

  // Se já estivermos agendado para conectar, não agendar novamente
  if (!autoConnectTimeout && !mockConnectionStatus.connected) {
    console.log('⏳ [MOCK] Auto-conexão agendada para 10 segundos...');
    autoConnectTimeout = setTimeout(() => {
      console.log('✅ [MOCK] Simulando conexão automática!');
      mockConnectionStatus = {
        connected: true,
        status: 'connected',
        phoneNumber: MOCK_CREDENTIALS.PHONE_NUMBER,
        profileName: 'WhatsApp Test Mock',
        lastSeen: new Date().toISOString()
      };

      toast.success('WhatsApp conectado com sucesso! (Simulação)', {
        description: 'Auto-conexão do modo de teste realizada.'
      });

      // Limpa o timeout
      autoConnectTimeout = null;
    }, 10000); // 10 segundos para conectar
  }

  // Gera QR Code usando API online (api.qrserver.com)
  // Este QR Code contém o texto "WHATSAPP_TEST_MODE" e é válido para exibição
  try {
    const qrText = 'WHATSAPP_TEST_MODE';
    const qrSize = '200x200';
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}&data=${encodeURIComponent(qrText)}`;

    // Busca o QR Code da API
    const response = await fetch(qrApiUrl);
    if (response.ok) {
      const blob = await response.blob();
      const reader = new FileReader();

      return new Promise((resolve) => {
        reader.onloadend = () => {
          const base64 = reader.result as string;
          console.log('📱 [MOCK] QR Code gerado via API (MODO TESTE)');
          console.log('💡 Aguarde 10 segundos para simulação automática de conexão...');

          if (!toast.getHistory().some((t: unknown) => (t as { title?: unknown })?.title === 'Aguarde a conexão simulada')) {
            toast.info('Aguarde a conexão simulada', {
              description: 'Em modo de teste, a conexão ocorrerá automaticamente em 10 segundos.',
              duration: 8000
            });
          }

          resolve({
            success: true,
            data: {
              qrCode: base64,
              timeout: 60,
              message: 'QR Code gerado (Simulação: Conectará em 10s)',
              expiresIn: 60
            }
          });
        };
        reader.readAsDataURL(blob);
      });
    }
  } catch (error) {
    console.warn('Erro ao gerar QR Code via API, usando fallback:', error);
  }

  // Fallback: QR Code base64 simples (imagem PNG 1x1 expandida)
  // Este é um QR Code válido que será exibido, mas não conectará ao WhatsApp real
  const mockQRCodeBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSJvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDA3NzhiYzQ3YjE3YjQ4LCAyMDIxLzExLzE3LTE3OjIzOjE5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjMuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAxLTE1VDEyOjAwOjAwKzAzOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMS0xNVQxMjowMDowMCs0MzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMS0xNVQxMjowMDowMCs0MzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YjY4YzE4YjItYjE0YS00YzE0LWE5YjItYzY4YzE4YjItYjE0YSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpiNjhjMThiMi1iMTRhLTRjMTQtYTliMi1jNjhjMThiMi1iMTRhIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YjY4YzE4YjItYjE0YS00YzE0LWE5YjItYzY4YzE4YjItYjE0YSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YjY4YzE4YjItYjE0YS00YzE0LWE5YjItYzY4YzE4YjItYjE0YSIgc3RFdnQ6d2hlbj0iMjAyNS0wMS0xNVQxMjowMDowMCs0MzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIzLjEgKFdpbmRvd3MpIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

  console.log('📱 [MOCK] QR Code gerado (MODO TESTE - Fallback)');

  if (!toast.getHistory().some((t: unknown) => (t as { title?: unknown })?.title === 'Aguarde a conexão simulada')) {
    toast.info('Aguarde a conexão simulada', {
      description: 'Em modo de teste, a conexão ocorrerá automaticamente em 10 segundos.',
      duration: 8000
    });
  }

  return {
    success: true,
    data: {
      qrCode: mockQRCodeBase64,
      timeout: 60,
      message: 'QR Code gerado (Simulação: Conectará em 10s)',
      expiresIn: 60
    }
  };
}

/**
 * Mock: Envia mensagem
 */
export async function mockSendMessage(
  token: string,
  profileId: string,
  phoneNumber: string,
  message: string
): Promise<{ success: boolean; data?: Record<string, unknown>; error?: string }> {
  await delay(800); // Simula delay de envio

  // Validação
  if (!token || !profileId || !phoneNumber || !message) {
    return {
      success: false,
      error: 'Todos os campos são obrigatórios'
    };
  }

  // Simula sucesso
  const cleanedPhone = phoneNumber.replace(/\D/g, '');

  console.log('📱 [MOCK] Mensagem enviada:', {
    to: cleanedPhone,
    message: message.substring(0, 50) + '...',
    timestamp: new Date().toISOString()
  });

  return {
    success: true,
    data: {
      messageId: `mock-msg-${Date.now()}`,
      status: 'sent',
      to: cleanedPhone,
      timestamp: new Date().toISOString(),
      note: 'Esta é uma mensagem de teste. Nenhuma mensagem real foi enviada.'
    }
  };
}

/**
 * Mock: Conecta WhatsApp (simula escanear QR Code)
 */
export async function mockConnectWhatsApp(
  token: string,
  profileId: string
): Promise<{ success: boolean; data?: Record<string, unknown>; error?: string }> {
  await delay(2000); // Simula tempo de conexão

  // Simula conexão bem-sucedida
  mockConnectionStatus = {
    connected: true,
    status: 'connected',
    phoneNumber: MOCK_CREDENTIALS.PHONE_NUMBER,
    profileName: 'WhatsApp Test Mock',
    lastSeen: new Date().toISOString()
  };

  toast.success('WhatsApp conectado com sucesso! (MODO TESTE)', {
    description: 'Esta é uma conexão simulada para testes.'
  });

  return {
    success: true,
    data: {
      connected: true,
      status: 'connected',
      phoneNumber: MOCK_CREDENTIALS.PHONE_NUMBER,
      profileName: 'WhatsApp Test Mock'
    }
  };
}

/**
 * Mock: Desconecta WhatsApp
 */
export async function mockDisconnectWhatsApp(
  token: string,
  profileId: string
): Promise<{ success: boolean; data?: Record<string, unknown>; error?: string }> {
  await delay(500);

  mockConnectionStatus = {
    connected: false,
    status: 'disconnected',
    phoneNumber: '',
    profileName: '',
    lastSeen: null
  };

  toast.success('WhatsApp desconectado (MODO TESTE)');

  return {
    success: true,
    data: {
      connected: false,
      status: 'disconnected'
    }
  };
}

/**
 * Mock: Envia template
 */
export async function mockSendTemplate(
  token: string,
  profileId: string,
  phoneNumber: string,
  templateName: string,
  templateParams: string[] = []
): Promise<{ success: boolean; data?: Record<string, unknown>; error?: string }> {
  await delay(800);

  const cleanedPhone = phoneNumber.replace(/\D/g, '');

  console.log('📱 [MOCK] Template enviado:', {
    template: templateName,
    params: templateParams,
    to: cleanedPhone
  });

  return {
    success: true,
    data: {
      messageId: `mock-template-${Date.now()}`,
      template: templateName,
      status: 'sent',
      to: cleanedPhone,
      note: 'Template enviado em modo de teste'
    }
  };
}

/**
 * Função auxiliar para exibir aviso de modo mock
 */
export function showMockModeWarning() {
  console.warn('⚠️ [MODO TESTE] API Brasil está sendo simulada. Nenhuma requisição real será feita.');
  console.log('💡 Para usar a API real, desative o modo mock no localStorage ou .env');
}

