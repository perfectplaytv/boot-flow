import { toast } from 'sonner';

// URL base da API Brasil - Pode ser configurada via variável de ambiente
const API_BRASIL_BASE_URL = process.env.NEXT_PUBLIC_API_BRASIL_URL || 'https://gateway.apibrasil.io/api/v2/whatsapp';

// Interface para respostas da API
interface ApiBrasilResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

// Interface para a resposta do QR Code
export interface QRCodeResponse {
  qrCode: string;
  timeout: number;
  message?: string;
  expiresIn?: number;
}

// Interface para o status de conexão
export interface ConnectionStatusResponse {
  connected: boolean;
  status?: string;
  phoneNumber?: string;
  profileName?: string;
  lastSeen?: string;
}

// Função auxiliar para tratamento de erros HTTP
async function handleApiResponse<T>(response: Response): Promise<ApiBrasilResponse<T>> {
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    console.error('Erro na resposta da API:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      data
    });
    
    const errorMessage = data?.message || data?.error?.message || 
                        `Erro HTTP ${response.status}: ${response.statusText}`;
    
    return {
      success: false,
      error: errorMessage,
      message: errorMessage,
      statusCode: response.status
    };
  }
  
  return { success: true, data };
}

/**
 * Envia uma mensagem via WhatsApp usando a API Brasil
 */
export async function sendMessage(
  token: string,
  profileId: string,
  phoneNumber: string,
  message: string,
  isGroup: boolean = false
): Promise<ApiBrasilResponse> {
  try {
    console.log('Enviando mensagem via WhatsApp...', { profileId, phoneNumber, isGroup });
    
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    
    const response = await fetch(`${API_BRASIL_BASE_URL}/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        profileId,
        phoneNumber: cleanedPhone,
        message,
        isGroup
      })
    });

    const result = await handleApiResponse(response);
    
    if (result.success) {
      console.log('Mensagem enviada com sucesso:', result.data);
      return { success: true, data: result.data };
    } else {
      console.error('Falha ao enviar mensagem:', result.error);
      return result;
    }
  } catch (error: any) {
    console.error('Erro ao enviar mensagem:', error);
    return { 
      success: false, 
      error: error.message || 'Erro ao enviar mensagem',
      message: error.message
    };
  }
}

/**
 * Gera um novo QR Code para autenticação
 */
export async function generateQRCode(
  token: string,
  profileId: string,
  type: 'temporary' | 'permanent' = 'temporary'
): Promise<ApiBrasilResponse<QRCodeResponse>> {
  try {
    console.log('Gerando QR Code...', { profileId, type });
    
    const response = await fetch(`${API_BRASIL_BASE_URL}/qrcode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        profileId,
        type
      })
    });

    console.log('Resposta da API (status):', response.status, response.statusText);
    
    const result = await handleApiResponse<QRCodeResponse>(response);
    
    if (result.success) {
      console.log('QR Code gerado com sucesso');
      return { 
        success: true, 
        data: {
          qrCode: result.data?.qrCode || '',
          timeout: result.data?.timeout || 30000,
          expiresIn: result.data?.expiresIn,
          message: result.data?.message
        } 
      };
    } else {
      console.error('Falha ao gerar QR Code:', result.error);
      return {
        success: false,
        error: result.error,
        message: result.message,
        statusCode: result.statusCode
      };
    }
  } catch (error: any) {
    console.error('Erro ao gerar QR Code:', error);
    const errorMessage = error.message || 'Erro ao gerar QR Code';
    
    // Tratamento específico para erros de rede
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      return { 
        success: false, 
        error: 'Falha na conexão com o servidor. Verifique sua conexão com a internet.',
        message: 'Erro de rede ao tentar gerar QR Code'
      };
    }
    
    return { 
      success: false, 
      error: errorMessage,
      message: errorMessage
    };
  }
}

/**
 * Verifica o status da conexão com o WhatsApp
 */
export async function checkConnectionStatus(
  token: string,
  profileId: string
): Promise<ApiBrasilResponse<{ connected: boolean; status?: string }>> {
  try {
    const response = await fetch(`${API_BRASIL_BASE_URL}/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'profile-id': profileId,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || data?.error?.message || `Erro HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    return { 
      success: true, 
      data: { 
        connected: data.connected || false,
        status: data.status || 'disconnected'
      } 
    };
  } catch (error: any) {
    console.error('Erro ao verificar status da conexão:', error);
    return { 
      success: false, 
      error: error.message || 'Erro ao verificar status da conexão',
      message: error.message
    };
  }
}

/**
 * Desconecta o WhatsApp
 */
export async function disconnectWhatsApp(
  token: string,
  profileId: string
): Promise<ApiBrasilResponse> {
  try {
    const response = await fetch(`${API_BRASIL_BASE_URL}/disconnect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({ profileId })
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || data?.error?.message || `Erro HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Erro ao desconectar WhatsApp:', error);
    return { 
      success: false, 
      error: error.message || 'Erro ao desconectar WhatsApp',
      message: error.message
    };
  }
}

/**
 * Envia um template de mensagem
 */
export async function sendTemplateMessage(
  token: string,
  profileId: string,
  phoneNumber: string,
  templateName: string,
  templateParams: string[] = [],
  isGroup: boolean = false
): Promise<ApiBrasilResponse> {
  try {
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    
    const response = await fetch(`${API_BRASIL_BASE_URL}/send-template`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        profileId,
        phoneNumber: cleanedPhone,
        template: {
          name: templateName,
          parameters: templateParams
        },
        isGroup
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || data?.error?.message || `Erro HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Erro ao enviar template:', error);
    return { 
      success: false, 
      error: error.message || 'Erro ao enviar template',
      message: error.message
    };
  }
}
