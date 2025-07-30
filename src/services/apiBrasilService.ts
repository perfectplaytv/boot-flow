import { toast } from 'sonner';

const API_BRASIL_BASE_URL = 'https://gateway.apibrasil.io/api/v2/whatsapp';

interface ApiBrasilResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface QRCodeResponse {
  qrCode: string;
  timeout: number;
  message?: string;
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

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || data?.error?.message || `Erro HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    return { success: true, data };
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

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || data?.error?.message || `Erro HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    return { 
      success: true, 
      data: {
        qrCode: data.qrCode,
        timeout: data.timeout || 30000,
        message: data.message
      } 
    };
  } catch (error: any) {
    console.error('Erro ao gerar QR Code:', error);
    return { 
      success: false, 
      error: error.message || 'Erro ao gerar QR Code',
      message: error.message
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
