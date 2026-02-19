
import axios, { AxiosError } from 'axios';

const EVOLUTION_API_URL = import.meta.env.VITE_EVOLUTION_API_URL || 'http://localhost:8080';
// A chave global definida no .env da Evolution API
const GLOBAL_API_KEY = import.meta.env.VITE_EVOLUTION_API_KEY || '429683C4C977415CAAFCCE10F7D57E11';

export interface EvolutionResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}

const api = axios.create({
    baseURL: EVOLUTION_API_URL,
    headers: {
        'apikey': GLOBAL_API_KEY,
        'Content-Type': 'application/json',
    },
});

interface InstanceData {
    instance: {
        instanceName: string;
        state: string;
    };
    // outras propriedades conforme necessidade
}

/**
 * Cria ou busca uma instância na Evolution API.
 * Mapeamos o profileId do BootFlow para o instanceName da Evolution.
 */
export async function createInstanceIfNotExists(instanceName: string): Promise<EvolutionResponse> {
    try {
        // Tenta buscar a instância primeiro (para ver se existe e evitar erro de duplicação)
        try {
            const { data } = await api.get<InstanceData[]>(`/instance/fetchInstances`);
            if (Array.isArray(data)) {
                const exists = data.find((i) => i.instance.instanceName === instanceName);
                if (exists) {
                    return { success: true, data: exists };
                }
            }
        } catch {
            // Ignora erro de fetch se for só para verificar
        }

        // Cria a instância
        const response = await api.post('/instance/create', {
            instanceName: instanceName,
            token: instanceName, // Usamos o próprio nome como token da instância por simplicidade
            qrcode: true,
            integration: 'WHATSAPP-BAILEYS',
        });
        return { success: true, data: response.data };
    } catch (error: unknown) {
        const err = error as AxiosError<{ response?: { message?: string } }>;
        // Se o erro for "Instance already exists", considera sucesso
        // A estrutura do erro pode variar, verificamos string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorResponseData = err.response?.data as any;
        const errorMessage = errorResponseData?.response?.message ||
            (typeof errorResponseData === 'string' ? errorResponseData : '') ||
            err.message;

        if (typeof errorMessage === 'string' && errorMessage.includes('already exists')) {
            return { success: true };
        }

        console.error('Erro ao criar instância Evolution:', errorMessage);
        return {
            success: false,
            error: typeof errorMessage === 'string' ? errorMessage : 'Falha ao criar instância',
        };
    }
}

/**
 * Gera o QR Code (na verdade, conecta a instância e retorna o QR em base64 se disponível).
 */
export async function fetchQRCode(instanceName: string): Promise<EvolutionResponse<{ qrCode: string }>> {
    try {
        await createInstanceIfNotExists(instanceName);

        // Na Evolution v2, o endpoint /instance/connect/{instance} retorna o QR Code
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await api.get<any>(`/instance/connect/${instanceName}`);

        // A resposta pode variar dependendo da versão, mas geralmente vem em 'base64' ou 'code'
        const qrCode = response.data?.base64 || response.data?.code || response.data?.qrcode;

        if (qrCode) {
            return { success: true, data: { qrCode } };
        }

        // Se já estiver conectado, pode não retornar QR
        if (response.data?.instance?.state === 'open') {
            return { success: false, error: 'Instância já conectada' };
        }

        return { success: false, error: 'QR Code não retornado pela API' };
    } catch (error: unknown) {
        const err = error as AxiosError<{ message: string }>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorData = err.response?.data as any;
        console.error('Erro ao buscar QR Code Evolution:', errorData || err.message);
        return {
            success: false,
            error: errorData?.message || 'Erro ao buscar QR Code',
        };
    }
}

/**
 * Verifica o status da conexão.
 */
export async function getConnectStatus(instanceName: string): Promise<EvolutionResponse<{ connected: boolean; status: string }>> {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await api.get<any>(`/instance/connectionState/${instanceName}`);
        const state = response.data?.instance?.state;

        const connected = state === 'open';

        return {
            success: true,
            data: {
                connected,
                status: state || 'disconnected'
            }
        };
    } catch (error: unknown) {
        const err = error as AxiosError;
        if (err.response?.status === 404) {
            return { success: true, data: { connected: false, status: 'not_found' } };
        }
        return { success: false, error: 'Erro ao verificar status' };
    }
}

/**
 * Envia mensagem de texto.
 */
export async function sendTxtMessage(instanceName: string, phoneNumber: string, text: string): Promise<EvolutionResponse> {
    try {
        const body = {
            number: phoneNumber,
            text: text,
            linkPreview: false
        };

        await api.post(`/message/sendText/${instanceName}`, body);
        return { success: true };
    } catch (error: unknown) {
        const err = error as AxiosError<{ message: string }>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorData = err.response?.data as any;
        console.error('Erro ao enviar mensagem:', errorData || err.message);
        return { success: false, error: 'Falha ao enviar mensagem' };
    }
}

/**
 * Desconecta (Logout).
 */
export async function logoutInstance(instanceName: string): Promise<EvolutionResponse> {
    try {
        await api.delete(`/instance/logout/${instanceName}`);
        return { success: true };
    } catch (error: unknown) {
        return { success: false, error: 'Falha ao desconectar' };
    }
}
