import { loadStripe, Stripe } from '@stripe/stripe-js';
import { agentLogger } from '@/lib/logger.agent';

const logger = agentLogger;

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = (): Promise<Stripe | null> => {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  if (!publishableKey) {
    logger.warn('Stripe publishable key não configurada');
    return Promise.resolve(null);
  }

  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
};

export interface CreatePaymentIntentParams {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
  customerId?: string;
}

export const createPaymentIntent = async (params: CreatePaymentIntentParams): Promise<{ clientSecret: string } | null> => {
  try {
    const response = await fetch('/api/payments/stripe/create-intent.bootflow.mobile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Erro ao criar payment intent: ${response.statusText}`);
    }

    const data = await response.json();
    return { clientSecret: data.clientSecret };
  } catch (error) {
    logger.error('Erro ao criar payment intent', { error: (error as Error).message });
    return null;
  }
};

export const confirmPayment = async (clientSecret: string, paymentMethodId: string): Promise<boolean> => {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe não inicializado');
    }

    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethodId,
    });

    if (error) {
      throw error;
    }

    logger.info('Pagamento confirmado', { paymentMethodId });
    return true;
  } catch (error) {
    logger.error('Erro ao confirmar pagamento', { error: (error as Error).message });
    return false;
  }
};

