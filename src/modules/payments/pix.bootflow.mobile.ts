import { agentLogger } from '@/lib/logger.agent';

const logger = agentLogger;

export interface PIXPaymentParams {
  amount: number;
  description?: string;
  payerName?: string;
  payerDocument?: string;
}

export interface PIXPaymentResponse {
  qrCode: string;
  qrCodeBase64: string;
  transactionId: string;
  expiresAt: string;
}

export const generatePIXPayment = async (params: PIXPaymentParams): Promise<PIXPaymentResponse | null> => {
  try {
    const response = await fetch('/api/payments/pix/generate.bootflow.mobile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Erro ao gerar pagamento PIX: ${response.statusText}`);
    }

    const data = await response.json();
    logger.info('Pagamento PIX gerado', { transactionId: data.transactionId });
    return data;
  } catch (error) {
    logger.error('Erro ao gerar pagamento PIX', { error: (error as Error).message });
    return null;
  }
};

export const checkPIXPaymentStatus = async (transactionId: string): Promise<'pending' | 'paid' | 'expired' | null> => {
  try {
    const response = await fetch(`/api/payments/pix/status.bootflow.mobile?transactionId=${transactionId}`);

    if (!response.ok) {
      throw new Error(`Erro ao verificar status: ${response.statusText}`);
    }

    const data = await response.json();
    return data.status;
  } catch (error) {
    logger.error('Erro ao verificar status PIX', { error: (error as Error).message });
    return null;
  }
};

