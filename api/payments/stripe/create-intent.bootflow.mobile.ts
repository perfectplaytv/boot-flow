import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const { amount, currency = 'brl', metadata = {}, customerId } = await request.json();

    if (!amount || amount < 50) {
      return new Response(JSON.stringify({ error: 'Valor inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: Math.round(amount),
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    };

    if (customerId) {
      paymentIntentParams.customer = customerId;
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Erro ao criar payment intent:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

