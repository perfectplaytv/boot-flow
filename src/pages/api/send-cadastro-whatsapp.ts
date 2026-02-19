// Exemplo de endpoint para envio de WhatsApp usando Evolution API
import type { NextApiRequest, NextApiResponse } from 'next';

const EVOLUTION_API_URL = 'https://api.evolutionapi.com.br/v1/message/send';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY;
const DEST_WHATSAPP = '+5527999587725';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { nome, email, whatsapp, plano } = req.body;
  if (!nome || !email || !whatsapp || !plano) return res.status(400).json({ error: 'Dados incompletos' });

  const message = `Novo cadastro:\nNome: ${nome}\nEmail: ${email}\nWhatsApp: ${whatsapp}\nPlano: ${plano}`;

  try {
    const response = await fetch(EVOLUTION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${EVOLUTION_API_KEY}`,
      },
      body: JSON.stringify({
        to: DEST_WHATSAPP,
        type: 'text',
        text: message,
      }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Erro ao enviar WhatsApp');
    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro interno' });
  }
}
