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
export function shouldUseMock(): boolean {
  // Verifica variável de ambiente ou localStorage
  const envMock = import.meta.env.VITE_USE_API_MOCK === 'true';
  const storageMock = localStorage.getItem('useApiBrasilMock') === 'true';
  
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
 */
export async function mockGenerateQRCode(): Promise<{ success: boolean; data?: QRCodeResponse; error?: string }> {
  await delay(1000); // Simula delay de geração
  
  // Gera um QR Code base64 fictício (imagem 1x1 pixel transparente)
  const mockQRCodeBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  
  return {
    success: true,
    data: {
      qrCode: mockQRCodeBase64,
      timeout: 60,
      message: 'QR Code gerado com sucesso (MODO TESTE)',
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
): Promise<{ success: boolean; data?: any; error?: string }> {
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
): Promise<{ success: boolean; data?: any; error?: string }> {
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
): Promise<{ success: boolean; data?: any; error?: string }> {
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
): Promise<{ success: boolean; data?: any; error?: string }> {
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

