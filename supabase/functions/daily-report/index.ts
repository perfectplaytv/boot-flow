import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || '';

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Buscar métricas do dia
    const { data: metrics } = await supabase
      .from('users')
      .select('count')
      .single();

    const { data: revenue } = await supabase
      .from('users')
      .select('price')
      .eq('pago', true);

    const totalRevenue = revenue?.reduce((sum, u) => sum + (parseFloat(u.price?.toString() || '0') || 0), 0) || 0;

    // Gerar resumo via IA
    const prompt = `Gere um relatório diário executivo em Markdown para a plataforma Boot Flow:

- Total de usuários: ${metrics?.count || 0}
- Receita do dia: R$ ${totalRevenue.toLocaleString('pt-BR')}
- Data: ${new Date().toLocaleDateString('pt-BR')}

Formato: título, resumo executivo (2 parágrafos), destaques (bullet points), recomendações.`;

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const aiData = await aiResponse.json();
    const summary = aiData.choices?.[0]?.message?.content || 'Relatório não disponível.';

    // Salvar relatório
    await supabase.from('daily_reports').insert({
      date: new Date().toISOString().split('T')[0],
      summary,
      metrics: { totalUsers: metrics?.count, totalRevenue },
      created_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ success: true, summary }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

