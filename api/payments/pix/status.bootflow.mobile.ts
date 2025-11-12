import type { APIRoute } from 'astro';

// Mock implementation - substituir por verificação real
export const GET: APIRoute = async ({ url }) => {
  try {
    const transactionId = url.searchParams.get('transactionId');

    if (!transactionId) {
      return new Response(JSON.stringify({ error: 'transactionId obrigatório' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Mock: sempre retorna pending (substituir por verificação real)
    // Em produção, verificar status no provider (MercadoPago, Gerencianet, etc.)
    const status = 'pending';

    return new Response(JSON.stringify({ status, transactionId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

