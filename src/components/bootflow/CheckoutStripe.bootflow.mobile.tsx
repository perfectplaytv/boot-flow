import { useState, FormEvent } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { createPaymentIntent, confirmPayment } from '@/modules/payments/stripe.bootflow.mobile';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface CheckoutFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const CheckoutForm = ({ amount, onSuccess, onError }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const paymentIntent = await createPaymentIntent({ amount, currency: 'brl' });
      if (!paymentIntent) {
        throw new Error('Erro ao criar payment intent');
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Elemento de cartão não encontrado');
      }

      const { error: createError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (createError || !paymentMethod) {
        throw createError || new Error('Erro ao criar payment method');
      }

      const success = await confirmPayment(paymentIntent.clientSecret, paymentMethod.id);
      if (success) {
        onSuccess();
      } else {
        throw new Error('Falha ao confirmar pagamento');
      }
    } catch (error) {
      onError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#fff',
                '::placeholder': { color: '#64748b' },
              },
            },
          }}
        />
      </div>
      <Button type="submit" disabled={!stripe || loading} className="w-full bg-violet-600 hover:bg-violet-700">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          `Pagar R$ ${(amount / 100).toFixed(2)}`
        )}
      </Button>
    </form>
  );
};

export interface CheckoutStripeProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export const CheckoutStripe = ({ amount, onSuccess, onError }: CheckoutStripeProps) => {
  if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Stripe não configurado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400">Configure VITE_STRIPE_PUBLISHABLE_KEY para habilitar pagamentos.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
};

